"use client";

import { useState } from "react";

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

  return (
    <section className="vehicle-stage-card" aria-labelledby="vehicle-stage-title">
      <div className="vehicle-stage-heading">
        <div>
          <div className="stage-eyebrow"><span className="stage-eyebrow-dot" /> VEHICLE DIGITAL VIEW</div>
          <h2 id="vehicle-stage-title">Vehicle model</h2>
          <p>3D-ready vehicle workspace · subsystem status points</p>
        </div>
        <div className="stage-controls" role="group" aria-label="Vehicle view mode">
          <button className={view === "3d" ? "stage-tab selected" : "stage-tab"} onClick={() => setView("3d")} type="button">Model view</button>
          <button className={view === "systems" ? "stage-tab selected" : "stage-tab"} onClick={() => setView("systems")} type="button">Systems</button>
        </div>
      </div>

      <div className="vehicle-stage-body">
        <div className="vehicle-viewport" data-model-slot="vehicle-glb" data-model-path="/models/exotic-racer.glb">
          <div className="viewport-grid" aria-hidden="true" />
          <div className="viewport-topline"><span>EVS / VEHICLE ASSET</span><span className="asset-state"><i /> MODEL ASSET PENDING</span></div>
          {view === "3d" ? (
            <div className="vehicle-render-placeholder" role="img" aria-label="Illustrative electric race car placeholder; not the team's actual vehicle model">
              <svg className="vehicle-blueprint" viewBox="0 0 680 310" role="img" aria-label="Generic low-detail race car silhouette placeholder">
                <defs>
                  <linearGradient id="carBody" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#7cbaff" stopOpacity=".92" /><stop offset=".48" stopColor="#2b639b" stopOpacity=".84" /><stop offset="1" stopColor="#132d4c" stopOpacity=".95" /></linearGradient>
                  <linearGradient id="carGlass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8edcf3" stopOpacity=".8" /><stop offset="1" stopColor="#244d70" stopOpacity=".9" /></linearGradient>
                  <filter id="carGlow"><feGaussianBlur stdDeviation="7" /></filter>
                </defs>
                <ellipse cx="350" cy="238" rx="220" ry="21" fill="#2b92f2" opacity=".15" filter="url(#carGlow)" />
                <path d="M105 205 L128 178 L198 158 L254 108 Q271 94 306 94 L399 98 Q426 102 451 133 L500 158 L558 176 L581 202 L570 224 L523 229 L490 210 L210 214 L177 231 L120 224 Z" fill="url(#carBody)" stroke="#83c6ff" strokeOpacity=".88" strokeWidth="2" />
                <path d="M226 155 L271 111 Q282 103 307 104 L345 106 L346 155 Z" fill="url(#carGlass)" stroke="#a3dfff" strokeOpacity=".75" strokeWidth="1.5" />
                <path d="M357 107 L396 110 Q417 115 440 147 L357 154 Z" fill="url(#carGlass)" stroke="#a3dfff" strokeOpacity=".75" strokeWidth="1.5" />
                <path d="M125 180 L191 163 L217 170 L203 193 L132 199 Z" fill="#10243b" stroke="#65baff" strokeWidth="1.5" />
                <path d="M445 155 L503 174 L552 188 L559 202 L486 197 Z" fill="#0e2136" stroke="#65baff" strokeWidth="1.5" />
                <path d="M224 169 L342 168 L344 202 L211 203 Z" fill="#1b3b5c" stroke="#4c9de8" strokeWidth="1.5" />
                <path d="M357 169 L462 166 L484 198 L357 202 Z" fill="#1b3b5c" stroke="#4c9de8" strokeWidth="1.5" />
                <path d="M143 207 L532 207" stroke="#9ad9ff" strokeOpacity=".9" strokeWidth="3" />
                <path d="M173 229 L195 228 L213 212 L489 212 L509 231 L535 232" fill="none" stroke="#69d9ef" strokeWidth="3" strokeLinecap="round" />
                <path d="M252 211 L268 220 L421 220 L444 211" fill="none" stroke="#72bfff" strokeOpacity=".8" strokeWidth="2" />
                <g>
                  <ellipse cx="204" cy="216" rx="36" ry="43" fill="#07101b" stroke="#547da1" strokeWidth="3" />
                  <ellipse cx="204" cy="216" rx="21" ry="27" fill="#172a3c" stroke="#6ca9d8" strokeWidth="3" />
                  <ellipse cx="204" cy="216" rx="7" ry="9" fill="#78b9e8" />
                  <path d="M204 190 V242 M184 216 H224 M190 197 L218 235 M218 197 L190 235" stroke="#4b769a" strokeWidth="3" />
                  <ellipse cx="491" cy="216" rx="36" ry="43" fill="#07101b" stroke="#547da1" strokeWidth="3" />
                  <ellipse cx="491" cy="216" rx="21" ry="27" fill="#172a3c" stroke="#6ca9d8" strokeWidth="3" />
                  <ellipse cx="491" cy="216" rx="7" ry="9" fill="#78b9e8" />
                  <path d="M491 190 V242 M471 216 H511 M477 197 L505 235 M505 197 L477 235" stroke="#4b769a" strokeWidth="3" />
                </g>
                <path d="M111 205 L87 204 L76 211 L106 217 M565 202 L597 194 L609 201 L578 213" fill="none" stroke="#76c9f3" strokeWidth="4" strokeLinecap="round" />
                <path d="M276 92 L288 81 L404 84 L419 98" fill="none" stroke="#6bb9ff" strokeWidth="2" strokeDasharray="4 5" opacity=".75" />
              </svg>
              <span className="placeholder-caption">ILLUSTRATIVE PLACEHOLDER · NOT THE TEAM CAR</span>
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
      <div className="vehicle-stage-footer"><span><i /> Interactive subsystem selection is ready</span><span>Actual 3D model and sensor mapping pending</span></div>
    </section>
  );
}
