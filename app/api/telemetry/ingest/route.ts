import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { validateTelemetrySnapshot } from "@/lib/telemetry/validate";
import type { VehicleTelemetrySnapshot } from "@/lib/telemetry/types";

function safeTokenMatch(received: string, expected: string) {
  const a = Buffer.from(received);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

function databaseConfig() {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return { url, key };
}

/** Secure ingestion endpoint for the vehicle gateway. Call only over HTTPS. */
export async function POST(request: Request) {
  const expectedToken = process.env.EVS_INGEST_TOKEN;
  if (!expectedToken || expectedToken.length < 32) {
    return NextResponse.json({ status: "not_configured", message: "Telemetry ingestion credentials are not configured." }, { status: 503 });
  }

  const authorization = request.headers.get("authorization") ?? "";
  const receivedToken = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
  if (!receivedToken || !safeTokenMatch(receivedToken, expectedToken)) {
    return NextResponse.json({ status: "unauthorized", message: "Valid gateway credentials are required." }, { status: 401 });
  }

  const config = databaseConfig();
  if (!config) {
    return NextResponse.json({ status: "not_configured", message: "Persistent telemetry storage is not configured." }, { status: 503 });
  }

  let payload: unknown;
  try {
    const contentLength = Number(request.headers.get("content-length") ?? "0");
    if (contentLength > 64_000) return NextResponse.json({ status: "payload_too_large" }, { status: 413 });
    payload = await request.json();
  } catch {
    return NextResponse.json({ status: "invalid_json", message: "Request body must be valid JSON." }, { status: 400 });
  }

  const validation = validateTelemetrySnapshot(payload);
  if (!validation.ok) {
    return NextResponse.json({ status: "invalid_payload", errors: validation.errors }, { status: 422 });
  }

  const snapshot: VehicleTelemetrySnapshot = validation.data;
  if (snapshot.source.simulated || snapshot.source.kind === "simulation") {
    return NextResponse.json({ status: "simulation_rejected", message: "Production ingestion accepts verified hardware-source payloads only." }, { status: 422 });
  }

  try {
    const response = await fetch(`${config.url}/rest/v1/vehicle_telemetry_snapshots`, {
      method: "POST",
      headers: {
        apikey: config.key,
        Authorization: `Bearer ${config.key}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        vehicle_id: snapshot.vehicleId,
        captured_at: snapshot.capturedAt,
        source_id: snapshot.source.id,
        source_kind: snapshot.source.kind,
        payload: snapshot,
      }),
      cache: "no-store",
    });
    if (!response.ok) {
      return NextResponse.json({ status: "storage_error", message: "The telemetry snapshot could not be stored." }, { status: 502 });
    }
    return NextResponse.json({ status: "accepted", vehicleId: snapshot.vehicleId, capturedAt: snapshot.capturedAt }, { status: 202 });
  } catch {
    return NextResponse.json({ status: "storage_unavailable", message: "Persistent telemetry storage could not be reached." }, { status: 503 });
  }
}
