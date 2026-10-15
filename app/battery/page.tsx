import AppShell from "@/components/AppShell";

const readings = [
  ["State of charge", "—", "No live feed"],
  ["Pack voltage", "—", "No live feed"],
  ["Current", "—", "No live feed"],
  ["Temperature", "—", "No mapped sensor"],
];
export default function BatteryPage() {
  return <AppShell active="battery" title="Battery & charging">
    <div className="content">
      <div className="page-intro"><div><p className="eyebrow"><span className="eyebrow-line" /> POWER SYSTEM</p><h1>Battery & charging<span className="title-period">.</span></h1><p className="subtitle">Pack information and measurements, with unknown values left blank until the interface is verified.</p></div><span className="health-badge neutral">NOT CONNECTED</span></div>
      <section className="notice"><div className="notice-icon">i</div><div className="notice-copy"><strong>Label information is not live telemetry</strong><p>The team-reported battery label is Smart App Series Marine LiFePO4, 24 V, 80 Ah. This is nameplate information only; it does not confirm current charge, pack health, or the controller protocol.</p></div></section>
      <section className="section-block"><div className="section-heading"><div><h2>Live measurements</h2><p>Waiting for a verified battery data source</p></div><span className="updated-label"><span className="status-dot grey" /> No readings received</span></div><div className="metrics-grid">{readings.map(([label,value,note])=><article className="metric-card" key={label}><div className="metric-top"><span>{label}</span></div><div className="metric-value">{value}</div><div className="metric-unit">{note}</div><div className="metric-foot"><span className="metric-foot-line" />Not available</div></article>)}</div></section>
      <section className="panel-card"><div className="panel-heading"><div><h2>Integration checklist</h2><p>Confirm these before displaying measurements</p></div><span className="panel-icon cyan-icon">ϟ</span></div><div className="checklist"><div><span>01</span><p><strong>Identify battery communication interface</strong><small>Confirm what the battery actually exposes; do not assume CAN or Bluetooth telemetry.</small></p><em>OPEN</em></div><div><span>02</span><p><strong>Identify motor controller and protocol</strong><small>Record model, connector and documentation from the team hardware.</small></p><em>OPEN</em></div><div><span>03</span><p><strong>Validate readings and units</strong><small>Compare data against a trusted instrument before calling it live.</small></p><em>OPEN</em></div></div><div className="panel-footer"><a href="/diagnostics">Open diagnostics <span>↗</span></a></div></section>
    </div>
  </AppShell>;
}
