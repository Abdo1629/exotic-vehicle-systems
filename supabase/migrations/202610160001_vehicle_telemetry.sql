-- EVS telemetry persistence schema (Supabase PostgreSQL)
-- Apply in the Supabase SQL editor. Never expose the service-role key to clients.

create table if not exists public.vehicle_telemetry_snapshots (
  id bigint generated always as identity primary key,
  vehicle_id text not null,
  captured_at timestamptz not null,
  received_at timestamptz not null default now(),
  source_id text not null,
  source_kind text not null check (source_kind in ('bms', 'motor_controller', 'gateway', 'manual')),
  payload jsonb not null check (jsonb_typeof(payload) = 'object')
);

create index if not exists vehicle_telemetry_latest_idx
  on public.vehicle_telemetry_snapshots (vehicle_id, received_at desc);

create index if not exists vehicle_telemetry_captured_idx
  on public.vehicle_telemetry_snapshots (vehicle_id, captured_at desc);

alter table public.vehicle_telemetry_snapshots enable row level security;

-- No anon/authenticated policies are created. Only the server-side service role
-- can access this table until team authentication and vehicle-level authorization
-- policies have been implemented and reviewed.
