# Exotic Vehicle Systems (EVS)

Bilingual vehicle-operations software for Exotic Racing Team IAET, designed as a product foundation for multiple teams and vehicles.

## Applications

### Web dashboard
Next.js App Router, React, TypeScript. Run with `npm ci && npm run dev`.

- Arabic/English language toggle with RTL layout and Arabic typography.
- Overview, battery & charging, diagnostics, test sessions and engineering logbook.
- Telemetry cards read from the API and do not generate measurements.
- Dark/light theme and responsive phone-sized web layout.

### Mobile app
Expo + React Native + TypeScript under [mobile/](mobile/README.md). Android-first; iOS is configured for future use.

```bash
cd mobile
npm install
npx expo start
```

- Dedicated app header that respects the phone's safe area/status bar.
- Arabic/English toggle, RTL-aware layouts and bottom navigation.
- Overview polls the configured latest-telemetry API; battery/system/test log screens are available.
- Test notes are still stored locally on the device and are not synced to the team server.

## Real telemetry integration

The software now has a versioned data contract, structural validation, authenticated ingestion endpoint, PostgreSQL schema and latest-snapshot API integration:

- Contract and validation: `lib/telemetry/`
- Ingestion: `POST /api/telemetry/ingest`
- Latest snapshot: `GET /api/telemetry/latest`
- Database schema: `supabase/migrations/202610160001_vehicle_telemetry.sql`
- Hardware + cellular architecture: [docs/cellular-telemetry-architecture.md](docs/cellular-telemetry-architecture.md)
- Contract details: [docs/vehicle-telemetry-contract.md](docs/vehicle-telemetry-contract.md)
- Environment template: [.env.example](.env.example)

### Important setup gates

1. Apply the SQL migration to a private Supabase project.
2. Configure `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and a strong `EVS_INGEST_TOKEN` as server-only deployment secrets.
3. Identify the exact BMS and motor-controller models and documented interfaces.
4. Select a cellular gateway/modem with matching interfaces, supported LTE bands and GPS if needed; use a data SIM in the gateway so it can transmit without Wi-Fi.
5. Build and bench-test the hardware adapter, then validate units, timestamps, disconnect behavior and buffering.
6. **Before public or commercial deployment, add and verify sign-in, team/vehicle authorization and protected telemetry reads.** The ingestion route is authenticated, but the current read path is not yet a complete user authorization system. Do not expose private vehicle telemetry publicly.

The battery reported by the team is Smart App Series Marine LiFePO4, rated 24 V / 80 Ah. These are label specifications only. They do not identify the BMS protocol or confirm live readings.

## Data integrity and safety boundaries

- No invented live values. Missing, invalid or stale data must remain clearly identified.
- Connection state does not prove that the car is stopped or safe.
- Production ingestion rejects payloads marked as simulation.
- Do not assume CAN, UART, RS-485, Bluetooth or any other protocol before verifying the actual hardware documentation.
- The app is a monitoring/engineering workspace, not a safety-certified controller.
- No remote propulsion, steering or braking commands are in scope.
- Any future lock/unlock operation requires separate hardware validation, authorization, safety review and confirmed command acknowledgement.

## Current limitations

- No vehicle gateway has been connected or verified yet.
- Cloud database and deployment secrets must be configured by the team.
- Team accounts, role-based permissions and protected read access remain release blockers.
- Web and mobile logbooks are local-only; shared records, audit trails, trip history, maps, energy analytics and push notifications require backend work.
- The actual team vehicle GLB model has not yet been supplied.
- Changes in this branch have not been built or tested on a physical phone in this environment; run the web and mobile quality checks before merging.
