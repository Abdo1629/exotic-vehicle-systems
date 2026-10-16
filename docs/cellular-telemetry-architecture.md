# Cellular telemetry architecture (EVS)

## Goal

The car should send telemetry when it is outside Wi-Fi coverage. The phone app and web dashboard read from the cloud; they do not need to connect directly to the car's Wi-Fi.

## Data path

```text
Battery BMS + motor controller + GPS
            │ documented, verified interface only
            ▼
Vehicle gateway / embedded controller
  - reads signals and timestamps them
  - validates units and ranges
  - buffers data when cellular coverage drops
  - monitors its own power and health
            │ LTE/4G modem + data SIM
            ▼
Mobile carrier network ── outbound TLS connection
            ▼
EVS ingestion API (/api/telemetry/ingest)
  - bearer-token authentication
  - schema/unit/timestamp validation
  - rejects simulated data in production ingestion
            ▼
PostgreSQL / Supabase table
            ▼
EVS API → Web dashboard + mobile app
```

## What the SIM does (and does not do)

- The SIM provides the gateway with mobile data. It does not automatically expose battery data.
- The SIM normally belongs in a separate cellular gateway/modem, unless the selected controller/gateway already includes a supported cellular modem.
- The gateway still needs a verified data interface to the BMS and motor controller. The battery label alone does not tell us whether that interface is CAN, UART, RS-485, Bluetooth, or something else.
- The car can publish to the cloud over cellular even when the phone is not nearby and no Wi-Fi is available, as long as the gateway has power, cellular coverage, and a working data plan.
- A carrier outage should lead to local buffering and later upload, not invented readings. Store capture time separately from server receipt time.

## MVP transport vs production transport

**MVP:** gateway sends HTTPS POST snapshots to `/api/telemetry/ingest` over TLS. The request must include `Authorization: Bearer <EVS_INGEST_TOKEN>` and the versioned JSON payload documented in `vehicle-telemetry-contract.md`.

**Production evolution:** use MQTT over TLS or batched HTTPS for higher-frequency streams, device identity per gateway, token rotation, replay protection, acknowledgements, backoff, a local queue, and monitoring. Do not put the service-role database key on the gateway or in either app.

## Database setup

1. Create a private Supabase project (PostgreSQL).
2. Apply `supabase/migrations/202610160001_vehicle_telemetry.sql`.
3. Configure server-only `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and a random `EVS_INGEST_TOKEN` of at least 32 characters.
4. Keep secrets in the deployment provider's server environment, never in Git or `EXPO_PUBLIC_*` variables.
5. Send a verified gateway snapshot to the ingestion endpoint over HTTPS.
6. Check the accepted response, then confirm the snapshot appears in the database and latest endpoint.

## Contract payload

The gateway must send schema version `1.0`, `vehicleId`, ISO timestamps, source identity/kind, connection status, and battery readings with explicit units and quality. See `docs/vehicle-telemetry-contract.md` for the full shape and validation rules. Production ingestion rejects `source.simulated=true`.

## Hardware decision gate

Do not buy a gateway based only on the SIM requirement. First record:
- exact BMS make/model and its documented telemetry interface;
- motor controller make/model and its documented telemetry interface;
- whether GPS is required and where it can receive a reliable signal;
- voltage input range, power draw, sleep/current behavior, environmental protection and mounting;
- local storage capacity, watchdog/recovery behavior and antenna placement;
- carrier coverage at the team's actual test routes and garage, not just a city-level coverage map.

Then choose a gateway with matching interfaces and an LTE modem supported in Egypt. Test coverage, data use, reboot recovery, and buffering on a bench before installation in the vehicle.

## Security and release gates

The ingestion endpoint is authenticated and validated. The current dashboard read path is an integration foundation, **not a complete account/role authorization system**. Before exposing a deployed dashboard or telemetry API to the public internet, implement and test sign-in, team membership, vehicle-level authorization, audit logs, rate limits, token rotation, and secure read access. GPS and vehicle telemetry must not be publicly readable. RLS is enabled on the table and no anonymous database policies are created.

## Data use and sampling

Start with a modest sample interval agreed by the electrical/software leads (for example, 5–10 seconds for non-safety monitoring), batch readings where useful, and calculate actual data consumption from measured payload and protocol overhead. Higher-frequency control or safety signals require a separate engineering design; this dashboard is not a real-time safety controller.
