# Vehicle model asset slot

Place the team's approved, optimized 3D vehicle model at:

`public/models/exotic-racer.glb`

The dashboard reserves this URL in the Vehicle Model workspace via `data-model-path="/models/exotic-racer.glb"`. The current view is a clearly labeled generic illustration and **is not the team's actual car model**. It is not a GLB renderer yet.

## Before integrating the real asset

- Obtain a model that matches the team's actual vehicle; do not present a generic model as the real car.
- Prefer GLB with embedded materials/textures and a practical web budget (start by targeting under 10 MB, then profile on target devices).
- Confirm scale, forward axis, origin/pivot, wheel positions, and model licensing with the team.
- Add a client-side WebGL renderer (for example Three.js / React Three Fiber) only after selecting the real asset and reviewing dependency/Bundle size.
- Replace the illustration inside `VehicleModelStage` while preserving its subsystem selection and telemetry inspector contract.
- Map each clickable hotspot to a verified physical subsystem and telemetry field. Unknown or missing telemetry must remain visibly unavailable.
- Any visual fault overlay must be driven by verified fault/event data, not decorative assumptions.

The current numbered hotspots are interaction placeholders for layout integration only. They do not indicate real component locations or current vehicle health.
