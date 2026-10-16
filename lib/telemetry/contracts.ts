/**
 * Canonical contracts between the EVS dashboard and a future hardware adapter.
 * Values are optional because each field must be mapped to a verified source.
 * Timestamps are ISO-8601 UTC strings; measurements must carry explicit units.
 */

export type TelemetryConnectionState = "connected" | "disconnected" | "not_configured" | "error";

export interface Measurement<T extends string | number = number> {
  value: T;
  unit: string;
  measuredAt: string;
  source: string;
  quality: "verified" | "estimated";
}

export interface VehicleTelemetrySnapshot {
  vehicleId: string;
  receivedAt: string;
  connection: TelemetryConnectionState;
  stateOfChargePercent?: Measurement;
  batteryVoltageV?: Measurement;
  batteryCurrentA?: Measurement;
  batteryPowerW?: Measurement;
  batteryTemperatureC?: Measurement;
  chargerConnected?: Measurement<"connected" | "disconnected">;
  motorTemperatureC?: Measurement;
  motorVoltageV?: Measurement;
  motorCurrentA?: Measurement;
  speedKph?: Measurement;
  latitude?: Measurement;
  longitude?: Measurement;
  odometerKm?: Measurement;
}

export interface TripRecord {
  id: string;
  vehicleId: string;
  startedAt: string;
  endedAt?: string;
  startLocation?: { latitude: number; longitude: number; recordedAt: string };
  endLocation?: { latitude: number; longitude: number; recordedAt: string };
  route?: Array<{ latitude: number; longitude: number; recordedAt: string }>;
  distanceKm?: number;
  energyUsedWh?: number;
  startSocPercent?: number;
  endSocPercent?: number;
  source: string;
  status: "in_progress" | "completed" | "incomplete";
}

export interface EnergySummary {
  periodStart: string;
  periodEnd: string;
  energyUsedWh?: number;
  distanceKm?: number;
  efficiencyWhPerKm?: number;
  measurementMethod: "integrated_voltage_current" | "energy_meter" | "unavailable";
  source?: string;
}

export interface ApiUnavailable {
  status: "not_configured" | "unavailable";
  message: string;
}
