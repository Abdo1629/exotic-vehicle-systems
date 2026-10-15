"use client";

import { useEffect, useRef, useState } from "react";

type VehicleZone = {
  id: string;
  label: string;
  detail: string;
  x: number;
  y: number;
};

const zones: VehicleZone[] = [
  { id: "battery", label: "Battery pack", detail: "SOC, voltage, current and temperature require a verified battery data source.", x: 50, y: 49 },
  { id: "controller", label: "Motor controller", detail: "Controller model, state and fault codes have not been mapped yet.", x: 72, y: 57 },
  { id: "front", label: "Front assembly", detail: "No front sensor or subsystem data has been configured.", x: 23, y: 58 },
  { id: "rear", label: "Rear assembly", detail: "No rear sensor or subsystem data has been configured.", x: 81, y: 48 },
];

export default function VehicleModelStage() {
  const [selectedZone, setSelectedZone] = useState(zones[0]);
  const [view, setView] = useState<"3d" | "systems">("3d");
  const [modelStatus, setModelStatus] = useState<"pending" | "loaded" | "error">("pending");
  const modelViewerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const viewer = modelViewerRef.current;
    if (!viewer) return;
    const handleLoad = () => setModelStatus("loaded");
    const handleError = () => setModelStatus("error");
    viewer.addEventListener("load", handleLoad);
    viewer.addEventListener("error", handleError);
    return () => {
      viewer.removeEventListener("load", handleLoad);
      viewer.removeEventListener("error", handleError);
    };
  }, []);

  return (
    <section className="vehicle-stage-card" aria-labelledby="vehicle-stage-title">
      <div className="vehicle-stage-heading">
        <div>
          <div className="stage-eyebrow"><span className="stage-eyebrow-dot" /> VEHICLE DIGITAL VIEW</div>
          <h2 id="vehicle-stage-title">Vehicle model</h2>
          <p>Rotatable 3D viewer · select a subsystem to inspect</p>
        </div>
        <div className="stage-controls" role="group" aria-label="Vehicle view mode">
          <button className={view === "3d" ? "stage-tab selected" : "stage-tab"} onClick={() => setView("3d")} type="button">Model view</button>
          <button className={view === "systems" ? "stage-tab selected" : "stage-tab"} onClick={() => setView("systems")} type="button">Systems</button>
        </div>
      </div>

      <div className="vehicle-stage-body">
        <div className="vehicle-viewport" data-model-slot="vehicle-glb" data-model-path="/models/exotic-racer.glb">
          <div className="viewport-grid" aria-hidden="true" />
          <div className="viewport-topline"><span>EVS / VEHICLE ASSET</span><span className="asset-state"><i /> {modelStatus === "loaded" ? "3D MODEL LOADED" : modelStatus === "error" ? "ASSET NOT FOUND" : "MODEL ASSET PENDING"}</span></div>
          {view === "3d" ? (
            <div className="vehicle-model-shell">
              <model-viewer
                ref={modelViewerRef}
                className="vehicle-model-viewer"
                src="/models/exotic-racer.glb"
                alt="Interactive 3D model of the Exotic Racing Team vehicle"
                camera-controls
                auto-rotate
                rotation-per-second="12deg"
                interaction-prompt="auto"
                shadow-intensity="1"
                exposure="1"
                environment-image="neutral"
                loading="eager"
                ar
              >
                <div slot="poster" className="model-pending">
                  <span className="model-pending-mark">3D</span>
                  <strong>Vehicle model not uploaded yet</strong>
                  <p>Add the team’s verified <code>exotic-racer.glb</code> file to <code>public/models/</code>. Once present, drag to rotate and scroll or pinch to zoom.</p>
                  <span className="placeholder-caption">WAITING FOR THE REAL VEHICLE ASSET</span>
                </div>
              </model-viewer>
              <div className="model-controls-hint"><span>↔</span> Drag to rotate <span>⌕</span> Scroll / pinch to zoom</div>
            </div>
          ) : (
            <div className="systems-list">
              {zones.map((zone) => <button type="button" key={zone.id} className={selectedZone.id === zone.id ? "system-select active" : "system-select"} onClick={() => setSelectedZone(zone)}><span className="system-select-dot" /><span>{zone.label}</span><small>UNAVAILABLE</small></button>)}
            </div>
          )}
          {view === "3d" && zones.map((zone, index) => (
            <button type="button" key={zone.id} className={selectedZone.id === zone.id ? "vehicle-hotspot active" : "vehicle-hotspot"} style={{ left: zone.x + "%", top: zone.y + "%" }} onClick={() => setSelectedZone(zone)} aria-label={`Inspect ${zone.label}`} aria-pressed={selectedZone.id === zone.id}>
              <span>{String(index + 1).padStart(2, "0")}</span><i />
            </button>
          ))}
          <div className="viewport-bottomline"><span><i /> LIVE MODEL FEED NOT CONFIGURED</span><span>ASSET: /models/exotic-racer.glb</span></div>
        </div>

        <aside className="vehicle-inspector" aria-live="polite">
          <div className="inspector-label">SELECTED SUBSYSTEM</div>
          <div className="inspector-title"><span className="inspector-symbol">⌁</span><div><strong>{selectedZone.label}</strong><small>Vehicle zone · {selectedZone.id.toUpperCase()}</small></div></div>
          <div className="inspector-status"><span className="status-dot grey" /> DATA UNAVAILABLE</div>
          <p className="inspector-description">{selectedZone.detail}</p>
          <div className="inspector-divider" />
          <div className="inspector-row"><span>Telemetry source</span><strong>Not mapped</strong></div>
          <div className="inspector-row"><span>Last update</span><strong>Never received</strong></div>
          <div className="inspector-row"><span>Fault status</span><strong>Unknown</strong></div>
          <div className="inspector-note"><span>i</span><p>Unknown does not mean healthy. Subsystem indicators will only reflect verified incoming data.</p></div>
        </aside>
      </div>
      <div className="vehicle-stage-footer"><span><i /> 3D viewer supports drag rotation and zoom when the model asset is present</span><span>GLB asset and verified sensor mapping pending</span></div>
    </section>
  );
}
