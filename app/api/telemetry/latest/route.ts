import { NextResponse } from "next/server";
import type { Measurement, VehicleTelemetrySnapshot as ApiSnapshot } from "@/lib/telemetry/contracts";
import type { NumericReading, VehicleTelemetrySnapshot } from "@/lib/telemetry/types";

export const dynamic = "force-dynamic";

function databaseConfig() {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && key ? { url, key } : null;
}

function measurement(reading: NumericReading | undefined, source: string): Measurement | undefined {
  if (!reading || reading.quality !== "valid" || reading.value === null || !reading.measuredAt) return undefined;
  return { value: reading.value, unit: reading.unit, measuredAt: reading.measuredAt, source, quality: "verified" };
}

function chargerMeasurement(reading: VehicleTelemetrySnapshot["battery"]["chargerConnected"], source: string): Measurement<"connected" | "disconnected"> | undefined {
  if (!reading || reading.quality !== "valid" || reading.value === null || !reading.measuredAt) return undefined;
  return { value: reading.value ? "connected" : "disconnected", unit: "state", measuredAt: reading.measuredAt, source, quality: "verified" };
}

function toApiSnapshot(snapshot: VehicleTelemetrySnapshot, receivedAt: string): ApiSnapshot {
  const source = snapshot.source.id;
  return {
    vehicleId: snapshot.vehicleId,
    receivedAt,
    connection: snapshot.connection.connected ? "connected" : "disconnected",
    stateOfChargePercent: measurement(snapshot.battery.stateOfCharge, source),
    batteryVoltageV: measurement(snapshot.battery.voltage, source),
    batteryCurrentA: measurement(snapshot.battery.current, source),
    batteryTemperatureC: measurement(snapshot.battery.temperature, source),
    chargerConnected: chargerMeasurement(snapshot.battery.chargerConnected, source),
    speedKph: measurement(snapshot.motor?.speedKph, source),
    motorTemperatureC: measurement(snapshot.motor?.controllerTemperatureC ?? snapshot.motor?.temperatureC, source),
    motorVoltageV: measurement(snapshot.motor?.voltageV, source),
    motorCurrentA: measurement(snapshot.motor?.currentA, source),
    latitude: measurement(snapshot.gps?.latitudeDeg, source),
    longitude: measurement(snapshot.gps?.longitudeDeg, source),
    odometerKm: measurement(snapshot.odometerKm, source),
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const vehicleId = searchParams.get("vehicleId")?.trim() || "exotic-racing-01";
  // Fail closed: vehicle telemetry can include location and operational details.
  // Replace this internal-only gate with verified sign-in + team/vehicle authorization before release.
  if (process.env.EVS_ALLOW_UNAUTHENTICATED_TELEMETRY_READ !== "true") {
    return NextResponse.json({ status: "authorization_required", vehicleId, data: null, message: "Telemetry reads are protected until team and vehicle authorization is configured." }, { status: 403, headers: { "Cache-Control": "no-store" } });
  }
  const config = databaseConfig();

  if (!config) {
    return NextResponse.json(
      { status: "not_configured", vehicleId, data: null, message: "Persistent telemetry storage is not configured. Set the server-side database credentials after creating the schema." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    const query = new URLSearchParams({
      select: "payload,received_at",
      vehicle_id: `eq.${vehicleId}`,
      order: "captured_at.desc",
      limit: "1",
    });
    const response = await fetch(`${config.url}/rest/v1/vehicle_telemetry_snapshots?${query.toString()}`, {
      headers: { apikey: config.key, Authorization: `Bearer ${config.key}` },
      cache: "no-store",
    });
    if (!response.ok) {
      return NextResponse.json({ status: "unavailable", vehicleId, data: null, message: "Telemetry storage could not be queried." }, { status: 503, headers: { "Cache-Control": "no-store" } });
    }
    const rows = await response.json() as Array<{ payload: VehicleTelemetrySnapshot; received_at: string }>;
    const row = rows[0];
    if (!row?.payload) {
      return NextResponse.json({ status: "unavailable", vehicleId, data: null, message: "No telemetry snapshot has been received from the vehicle gateway yet." }, { status: 503, headers: { "Cache-Control": "no-store" } });
    }
    const data = toApiSnapshot(row.payload, row.received_at);
    const staleAfterSeconds = Number(process.env.EVS_GATEWAY_STALE_AFTER_SECONDS ?? "120");
    const threshold = Number.isFinite(staleAfterSeconds) && staleAfterSeconds > 0 ? staleAfterSeconds : 120;
    const ageSeconds = (Date.now() - Date.parse(row.payload.capturedAt)) / 1000;
    const isStale = !Number.isFinite(ageSeconds) || ageSeconds > threshold;
    const status = !row.payload.connection.connected ? "unavailable" : isStale ? "stale" : "connected";
    const message = status === "connected"
      ? "Latest stored hardware snapshot."
      : status === "stale"
        ? "The latest snapshot is older than the configured freshness threshold; live values are withheld."
        : "The last snapshot reports a disconnected gateway; its readings may not be current.";
    return NextResponse.json(
      { status, vehicleId, data, message },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json({ status: "unavailable", vehicleId, data: null, message: "Persistent telemetry storage could not be reached." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
