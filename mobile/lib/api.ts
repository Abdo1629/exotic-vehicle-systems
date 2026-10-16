export type ApiMeasurement = { value: number; unit: string; measuredAt: string; source: string; quality: "verified" | "estimated" };
export type TelemetryApiSnapshot = {
  vehicleId: string;
  receivedAt: string;
  connection: "connected" | "disconnected" | "not_configured" | "error";
  stateOfChargePercent?: ApiMeasurement;
  batteryVoltageV?: ApiMeasurement;
  batteryCurrentA?: ApiMeasurement;
  batteryTemperatureC?: ApiMeasurement;
  chargerConnected?: { value: "connected" | "disconnected"; unit: string; measuredAt: string; source: string; quality: "verified" | "estimated" };
  speedKph?: ApiMeasurement;
  motorTemperatureC?: ApiMeasurement;
  latitude?: ApiMeasurement;
  longitude?: ApiMeasurement;
  odometerKm?: ApiMeasurement;
};
export type TelemetryApiResponse = {
  status: "connected" | "not_configured" | "unavailable" | "authorization_required" | "stale";
  vehicleId: string;
  data: TelemetryApiSnapshot | null;
  message?: string;
};

export async function fetchLatestTelemetry(vehicleId = "exotic-racing-01"): Promise<TelemetryApiResponse> {
  const baseUrl = process.env.EXPO_PUBLIC_EVS_API_URL?.replace(/\/$/, "");
  if (!baseUrl) {
    return { status: "not_configured", vehicleId, data: null, message: "Set EXPO_PUBLIC_EVS_API_URL to the secured EVS deployment URL." };
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(`${baseUrl}/api/telemetry/latest?vehicleId=${encodeURIComponent(vehicleId)}`, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });
    const body = await response.json() as TelemetryApiResponse;
    return body;
  } catch {
    return { status: "unavailable", vehicleId, data: null, message: "The EVS server could not be reached." };
  } finally {
    clearTimeout(timeout);
  }
}
