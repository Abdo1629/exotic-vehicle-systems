-- EVS trip history persistence.
-- Apply after 202610160001_vehicle_telemetry.sql. Only server-side service-role access
-- is available until verified team authentication and vehicle authorization are reviewed.

create table if not exists public.vehicle_trip_history (
  id uuid primary key default gen_random_uuid(),
  vehicle_id text not null,
  started_at timestamptz not null,
  ended_at timestamptz,
  distance_km numeric(12,3) check (distance_km is null or distance_km >= 0),
  duration_seconds bigint check (duration_seconds is null or duration_seconds >= 0),
  energy_wh numeric(14,3) check (energy_wh is null or energy_wh >= 0),
  start_soc_percent numeric(5,2) check (start_soc_percent is null or start_soc_percent between 0 and 100),
  end_soc_percent numeric(5,2) check (end_soc_percent is null or end_soc_percent between 0 and 100),
  average_wh_per_km numeric(12,3) check (average_wh_per_km is null or average_wh_per_km >= 0),
  status text not null default 'incomplete' check (status in ('completed', 'in_progress', 'incomplete')),
  source_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint trip_end_after_start check (ended_at is null or ended_at >= started_at)
);

create index if not exists vehicle_trip_history_vehicle_started_idx
  on public.vehicle_trip_history (vehicle_id, started_at desc);

alter table public.vehicle_trip_history enable row level security;

-- No anon/authenticated policies: public clients must not read driving history.
