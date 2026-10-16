# IAET Racing identity, live map and trip history

## Visual identity
- Racing red: #E53935
- Carbon black: #090A0B
- White: #F5F5F3
- Technical green: #25A56A
- English UI typeface: Manrope
- Arabic UI typeface: Cairo
- RTL layouts use Cairo with normal letter spacing.

## Live map
The map reads only the latest accepted snapshot from /api/telemetry/latest. A marker is displayed only when the snapshot is current, connected and includes validated GPS coordinates. It intentionally does not invent a location.

## Trip history
The vehicle_trip_history table stores trip distance, duration, measured energy, average Wh/km and start/end state of charge. The dashboard only displays persisted records. Energy is not estimated from the battery nameplate; the vehicle gateway must provide valid measurements and trip segmentation.

Apply supabase/migrations/202610160002_vehicle_trip_history.sql after the telemetry migration.

## Release blockers
- Configure and verify the vehicle gateway's GPS, odometer and voltage/current data sources.
- Implement team sign-in and vehicle-level authorization before exposing trip or GPS data.
- Build a trusted trip segmentation/energy integration process from validated hardware readings.
- Never enable EVS_ALLOW_UNAUTHENTICATED_TELEMETRY_READ=true on a public deployment as a substitute for authentication.
