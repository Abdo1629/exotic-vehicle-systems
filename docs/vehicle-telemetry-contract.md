# Vehicle telemetry contract — v1.0

## Purpose

This is the proposed data boundary between a future, verified vehicle adapter and the Exotic Vehicle Systems dashboard. It is a software contract, **not** evidence that telemetry is available or that any specific hardware protocol is supported.

Implementation:
- Types: `lib/telemetry/types.ts`
- Structural validator: `lib/telemetry/validate.ts`

## Required envelope

Every snapshot includes:
- `schemaVersion`: currently `1.0`
- `vehicleId`
- `capturedAt`: timestamp for the snapshot
- `source`: stable source ID, source kind, and explicit simulation flag
- `connection`: transport connection status and last received message timestamp
- `battery`: SOC, voltage, current, and temperature readings; optional charger-connected state
- optional `motor`: vehicle speed, motor/controller temperature, voltage and current
- optional `gps`: latitude, longitude and fix accuracy
- optional `odometerKm`: odometer measurement

Every numeric reading has a value (or `null`), an explicit unit, measurement timestamp (or `null`), and quality: `valid`, `stale`, `invalid`, or `unavailable`. Optional groups can be omitted when the vehicle does not expose that signal; do not fill absent GPS or motor signals with placeholders. GPS coordinates are range-checked, but validation does not verify the real location.

## Rules

1. Missing data is `null` with quality `unavailable`; never replace it with a guessed value or zero.
2. `valid` requires a non-null value and measurement timestamp.
3. Simulation payloads must use source kind `simulation` and set `simulated: true`. Never present them as live telemetry.
4. Structural validation cannot verify sensor calibration, truthfulness, electrical safety, or the meaning of a value.
5. The adapter must document the battery-current sign convention and temperature sensor location before the dashboard interprets either.
6. Staleness thresholds must be agreed per signal and transport; a successful network connection does not prove the vehicle is healthy or stationary.
7. No remote propulsion, steering, or braking commands are in scope.

## Example contract shape (illustrative only — not real vehicle data)

```json
{
  "schemaVersion": "1.0",
  "vehicleId": "exotic-racer",
  "capturedAt": "2026-10-15T12:00:00Z",
  "source": { "id": "unconfigured-example", "kind": "simulation", "simulated": true },
  "connection": { "connected": false, "lastMessageAt": null },
  "battery": {
    "stateOfCharge": { "value": null, "unit": "%", "measuredAt": null, "quality": "unavailable" },
    "voltage": { "value": null, "unit": "V", "measuredAt": null, "quality": "unavailable" },
    "current": { "value": null, "unit": "A", "measuredAt": null, "quality": "unavailable" },
    "temperature": { "value": null, "unit": "°C", "measuredAt": null, "quality": "unavailable" }
  }
}
```

The example timestamp is illustrative. The payload deliberately contains no fabricated measurements.

## Hardware integration gate

Before implementing a real adapter, record and verify:
- battery BMS make/model and available documented interface
- motor controller make/model and documented communication interface
- gateway/MCU selected by the team, wiring and isolation requirements
- message format/register map, units, scaling, signedness and update rates
- measurement source, sensor location, calibration and per-signal stale timeout
- behavior on disconnect, corrupt packets, clock mismatch and gateway restart
- safe bench-test procedure approved by the electrical/control-system leads

Do not infer CAN, UART, Bluetooth, Modbus, OBD, or any other protocol from the battery label alone.
