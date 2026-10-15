import type {
  NumericReading,
  TelemetrySourceKind,
  TelemetryValidationResult,
  VehicleTelemetrySnapshot,
} from "./types";

const sourceKinds: TelemetrySourceKind[] = [
  "bms",
  "motor_controller",
  "gateway",
  "manual",
  "simulation",
];
const qualities = ["valid", "stale", "invalid", "unavailable"] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isTimestamp(value: unknown): value is string {
  return typeof value === "string" && value.length > 0 && Number.isFinite(Date.parse(value));
}

function validateReading(
  value: unknown,
  path: string,
  expectedUnit: string,
  errors: string[],
): value is NumericReading {
  if (!isRecord(value)) {
    errors.push(`${path} must be an object`);
    return false;
  }

  if (value.unit !== expectedUnit) errors.push(`${path}.unit must be "${expectedUnit}"`);
  if (value.value !== null && (typeof value.value !== "number" || !Number.isFinite(value.value))) {
    errors.push(`${path}.value must be a finite number or null`);
  }
  if (value.measuredAt !== null && !isTimestamp(value.measuredAt)) {
    errors.push(`${path}.measuredAt must be a timestamp or null`);
  }
  if (typeof value.quality !== "string" || !qualities.includes(value.quality as (typeof qualities)[number])) {
    errors.push(`${path}.quality is not supported`);
  }
  if (value.quality === "valid" && (value.value === null || value.measuredAt === null)) {
    errors.push(`${path} cannot be valid without a value and measurement timestamp`);
  }
  if (value.quality === "unavailable" && value.value !== null) {
    errors.push(`${path} must use null when quality is unavailable`);
  }

  if (typeof value.value === "number") {
    if (path.endsWith(".stateOfCharge") && (value.value < 0 || value.value > 100)) {
      errors.push(`${path}.value must be between 0 and 100`);
    }
    if (path.endsWith(".voltage") && value.value < 0) {
      errors.push(`${path}.value cannot be negative`);
    }
  }
  return true;
}

/**
 * Validates the structural contract only. It does not establish that a sensor,
 * value, timestamp, calibration, or vehicle state is truthful.
 */
export function validateTelemetrySnapshot(input: unknown): TelemetryValidationResult {
  const errors: string[] = [];
  if (!isRecord(input)) return { ok: false, errors: ["Payload must be an object"] };

  if (input.schemaVersion !== "1.0") errors.push('schemaVersion must be "1.0"');
  if (typeof input.vehicleId !== "string" || !input.vehicleId.trim()) errors.push("vehicleId is required");
  if (!isTimestamp(input.capturedAt)) errors.push("capturedAt must be a valid timestamp");

  if (!isRecord(input.source)) {
    errors.push("source must be an object");
  } else {
    if (typeof input.source.id !== "string" || !input.source.id.trim()) errors.push("source.id is required");
    if (typeof input.source.kind !== "string" || !sourceKinds.includes(input.source.kind as TelemetrySourceKind)) {
      errors.push("source.kind is not supported");
    }
    if (typeof input.source.simulated !== "boolean") errors.push("source.simulated must be boolean");
    if (input.source.kind === "simulation" && input.source.simulated !== true) {
      errors.push("simulation sources must set source.simulated to true");
    }
    if (input.source.simulated === true && input.source.kind !== "simulation") {
      errors.push("simulated data must use source.kind = simulation");
    }
  }

  if (!isRecord(input.connection)) {
    errors.push("connection must be an object");
  } else {
    if (typeof input.connection.connected !== "boolean") errors.push("connection.connected must be boolean");
    if (input.connection.lastMessageAt !== null && !isTimestamp(input.connection.lastMessageAt)) {
      errors.push("connection.lastMessageAt must be a timestamp or null");
    }
  }

  if (!isRecord(input.battery)) {
    errors.push("battery must be an object");
  } else {
    validateReading(input.battery.stateOfCharge, "battery.stateOfCharge", "%", errors);
    validateReading(input.battery.voltage, "battery.voltage", "V", errors);
    validateReading(input.battery.current, "battery.current", "A", errors);
    validateReading(input.battery.temperature, "battery.temperature", "°C", errors);
  }

  if (errors.length > 0) return { ok: false, errors };
  return { ok: true, data: input as unknown as VehicleTelemetrySnapshot };
}
