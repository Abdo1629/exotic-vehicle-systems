import { NextResponse } from "next/server";
import { telemetryProvider } from "@/lib/telemetry/provider";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const vehicleId = searchParams.get("vehicleId")?.trim() || "exotic-racing-01";

  if (!telemetryProvider) {
    return NextResponse.json(
      {
        status: "not_configured",
        vehicleId,
        data: null,
        message:
          "Telemetry adapter is not configured. Connect a verified GPS/BMS/controller source to enable live readings.",
      },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    const data = await telemetryProvider.getLatestSnapshot(vehicleId);
    if (!data) {
      return NextResponse.json(
        { status: "unavailable", vehicleId, data: null, message: "No telemetry snapshot has been received yet." },
        { status: 503, headers: { "Cache-Control": "no-store" } },
      );
    }

    return NextResponse.json(
      { status: "connected", vehicleId, data },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { status: "unavailable", vehicleId, data: null, message: "The telemetry provider could not be reached." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
