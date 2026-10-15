# Exotic Vehicle Systems (EVS)

Engineering dashboard and mobile companion foundation for Exotic Racing Team IAET.

## Current status

The web dashboard and mobile app are **not connected to the vehicle**, are not safety-certified, and must not be used as evidence of vehicle state or readiness.

- Vehicle telemetry: unavailable until hardware and protocol are verified.
- Remote commands: not implemented.
- Backend, team sync, authentication, and hardware adapter: not implemented.
- Measurements remain unavailable rather than invented.

## Applications

### Web dashboard (repository root)

- Next.js App Router, React, TypeScript
- Run: `npm ci && npm run dev`
- Pages: overview, battery, diagnostics, tests, engineering logbook

### Mobile app (Expo)

The separate React Native app lives in [mobile/](mobile/README.md) and supports Android first, with iOS configured for future use.

```bash
cd mobile
npm install
npx expo start
```

Mobile screens:
- Overview — connection readiness and unavailable telemetry
- Battery — known nameplate details and unavailable live readings
- System — diagnostics readiness
- Test log — local notes stored on the device

Mobile notes are not synced to the web dashboard or a team server.

## Vehicle 3D model

The web dashboard has a model-ready vehicle workspace, but the actual team GLB asset has not been supplied. A generic placeholder is not the team's vehicle.

## Data integrity and safety boundaries

- Do not label simulated values as live measurements.
- Missing readings are unavailable; do not infer motion or stopped state from connectivity.
- A real integration must define units, source identity, timestamps, freshness thresholds, and validity rules.
- Keep the vehicle adapter separate from API and UI layers.
- Do not implement remote propulsion, steering, or braking controls.
- Future remote operations require a hardware-specific engineering review, server-side authorization, independent local safety interlocks, and trustworthy target-system acknowledgement.

## Telemetry contract

Types and structural validation live in `lib/telemetry/`; integration gates are documented in [docs/vehicle-telemetry-contract.md](docs/vehicle-telemetry-contract.md). This contract does not imply that a hardware source exists.

## Quality checks

The root GitHub Actions workflow runs lint, TypeScript checking, and a production build for the web app. The mobile app has a separate TypeScript configuration and should be installed and checked from the `mobile/` directory. Do not consider the mobile app verified until its dependencies are installed and it is tested on a device or emulator.
