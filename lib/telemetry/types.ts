/**
 * Versioned boundary between a verified vehicle adapter and the dashboard.
 * These types describe data; they do not imply that a hardware source exists.
 */
export type TelemetrySourceKind = "bms" | "motor_controller" | "gateway" | "manual" | "simulation";
export type ReadingQuality = "valid" | "stale" | "invalid" | "unavailable";

export interface TelemetrySource {
  id: string;
  kind: TelemetrySourceKind;
  /** True only for deliberately generated/test data. Never label it as live. */
  simulated: boolean;
}

export interface NumericReading {
  value: number | null;
  unit: string;
  measuredAt: string | null;
  quality: ReadingQuality;
}

export interface BatteryTelemetry {
  stateOfCharge: NumericReading; // unit: "%"
  voltage: NumericReading; // unit: "V"
  current: NumericReading; // unit: "A"; sign convention must be documented by adapter
  temperature: NumericReading; // unit: "°C"; sensor location must be documented
}

export interface VehicleTelemetrySnapshot {
  schemaVersion: "1.0";
  vehicleId: string;
  capturedAt: string;
  source: TelemetrySource;
  connection: {
    connected: boolean;
    lastMessageAt: string | null;
  };
  battery: BatteryTelemetry;
}

export type TelemetryValidationResult =
  | { ok: true; data: VehicleTelemetrySnapshot }
  | { ok: false; errors: string[] };
