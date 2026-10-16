import type { VehicleTelemetrySnapshot } from "./contracts";

/**
 * Implement this interface when the team confirms the actual BMS/controller
 * protocol and gateway. Do not return fabricated readings from an adapter.
 */
export interface TelemetryProvider {
  getLatestSnapshot(vehicleId: string): Promise<VehicleTelemetrySnapshot | null>;
}

export class TelemetryNotConfiguredError extends Error {
  constructor(message = "No verified vehicle telemetry adapter is configured.") {
    super(message);
    this.name = "TelemetryNotConfiguredError";
  }
}

/**
 * Safe default until hardware, protocol, units and source mapping are verified.
 * Swap this implementation for a real provider without changing the UI contract.
 */
export const telemetryProvider: TelemetryProvider | null = null;
