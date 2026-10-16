import { NextResponse } from "next/server";

type TripRow = {
  id: string; started_at: string; ended_at: string | null; distance_km: number | null;
  duration_seconds: number | null; energy_wh: number | null; start_soc_percent: number | null;
  end_soc_percent: number | null; average_wh_per_km: number | null;
  status: "completed" | "in_progress" | "incomplete";
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const vehicleId = searchParams.get("vehicleId")?.trim() || "exotic-racing-01";
  // Fail closed because trip history can expose vehicle usage and location patterns.
  // Replace this gate with verified sign-in and team/vehicle authorization before production.
  if (process.env.EVS_ALLOW_UNAUTHENTICATED_TELEMETRY_READ !== "true") {
    return NextResponse.json({ status: "authorization_required", message: "Trip history is protected until team and vehicle authorization is configured.", trips: [], summary: null }, { status: 403, headers: { "Cache-Control": "no-store" } });
  }
  const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return NextResponse.json({ status: "not_configured", message: "Persistent trip storage is not configured. Apply the trip-history migration and configure server-side database credentials.", trips: [], summary: null }, { status: 503, headers: { "Cache-Control": "no-store" } });
  try {
    const query = new URLSearchParams({ select: "id,started_at,ended_at,distance_km,duration_seconds,energy_wh,start_soc_percent,end_soc_percent,average_wh_per_km,status", vehicle_id: `eq.${vehicleId}`, order: "started_at.desc", limit: "200" });
    const response = await fetch(`${url}/rest/v1/vehicle_trip_history?${query.toString()}`, { headers: { apikey: key, Authorization: `Bearer ${key}` }, cache: "no-store" });
    if (!response.ok) return NextResponse.json({ status: "storage_error", message: "Trip history could not be queried.", trips: [], summary: null }, { status: 503, headers: { "Cache-Control": "no-store" } });
    const rows = await response.json() as TripRow[];
    const trips = rows.map(row => ({ id: row.id, startedAt: row.started_at, endedAt: row.ended_at, distanceKm: row.distance_km, durationSeconds: row.duration_seconds, energyWh: row.energy_wh, startSocPercent: row.start_soc_percent, endSocPercent: row.end_soc_percent, averageWhPerKm: row.average_wh_per_km, status: row.status }));
    const summary = rows.reduce((acc, row) => ({ totalTrips: acc.totalTrips + (row.status === "completed" ? 1 : 0), totalDistanceKm: acc.totalDistanceKm + (row.distance_km ?? 0), totalEnergyWh: acc.totalEnergyWh + (row.energy_wh ?? 0) }), { totalTrips: 0, totalDistanceKm: 0, totalEnergyWh: 0 });
    return NextResponse.json({ status: "ok", vehicleId, trips, summary }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ status: "storage_unavailable", message: "Persistent trip storage could not be reached.", trips: [], summary: null }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
