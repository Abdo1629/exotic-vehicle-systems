# Exotic Vehicle Systems (EVS)

Engineering dashboard foundation for Exotic Racing Team IAET.

## Current status

This repository currently contains a responsive dashboard UI foundation. It is **not connected to the vehicle**, is not safety-certified, and must not be used as evidence of vehicle state or readiness.

- Vehicle telemetry: unavailable until hardware and protocol are verified.
- Remote commands: not implemented.
- Backend, persistence, authentication, and hardware adapter: not implemented.
- Dashboard metrics intentionally show unavailable values rather than invented measurements.

## Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS v4 (base dependency retained; dashboard styling currently uses CSS variables and component classes)

## Requirements

- Node.js compatible with the installed Next.js 16 version
- npm

## Run locally

```bash
npm ci
npm run dev
```

Open http://localhost:3000.

## Quality checks

```bash
npm run lint
npx tsc --noEmit
npm run build
```

These commands should be run in a local Node.js environment or CI. A GitHub file edit does not execute them.

## Data integrity and safety boundaries

- Do not label simulated values as live vehicle measurements.
- Treat missing readings as unavailable; do not infer vehicle motion or stopped state from connectivity.
- A real integration must define measurement units, source identity, timestamps, freshness thresholds, and validity rules.
- Keep the vehicle adapter separate from API and UI layers.
- Do not implement remote propulsion, steering, or braking controls.
- Any future remote operation requires a hardware-specific engineering review, server-side authorization, independent local safety interlocks, and trustworthy target-system acknowledgement.

## Planned delivery sequence

1. Dashboard foundation and explicit unavailable states.
2. Typed telemetry contracts and isolated simulation provider.
3. API, persistence, authentication, and authorization after requirements are defined.
4. Hardware adapter only after controller and communication interfaces are verified.
5. Test coverage, accessibility, and security hardening.
