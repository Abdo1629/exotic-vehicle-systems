import AppShell from "@/components/AppShell";
import VehicleModelStage from "@/components/vehicle/VehicleModelStage";

const metrics = [
  { label: "State of charge", value: "—", unit: "Not connected", icon: "▤", note: "No verified battery feed", tone: "blue" },
  { label: "Battery voltage", value: "—", unit: "V · unavailable", icon: "ϟ", note: "Awaiting hardware mapping", tone: "cyan" },
  { label: "Battery temperature", value: "—", unit: "°C · unavailable", icon: "♨", note: "No temperature sensor mapped", tone: "amber" },
  { label: "Vehicle connection", value: "Offline", unit: "No device connected", icon: "⌁", note: "Connection only; motion unknown", tone: "muted" },
];
const events = [{ title: "No vehicle events received", detail: "Events will appear when a verified source is connected." }];
function Mark({ children }: { children: React.ReactNode }) {
  return <span className="mark" aria-hidden="true">{children}</span>;
}
export default function Home() {
  return (
    <AppShell active="overview" title="Overview">
      <div className="content">
        <section className="welcome-row">
                    <div>
                      <div className="eyebrow"><span className="eyebrow-line" /> TEAM VEHICLE / OVERVIEW</div>
                      <h1>Vehicle overview<span className="title-period">.</span></h1>
                      <p className="subtitle">Vehicle status, available readings, and recent engineering work.</p>
                    </div>
                    <div className="vehicle-state"><span className="state-symbol">↗</span><div><span>VEHICLE STATUS</span><strong>Not connected</strong><small>Connection state only — motion unknown</small></div></div>
                  </section>
        
                  <section className="notice" aria-label="Simulation notice">
                    <div className="notice-icon">i</div>
                    <div className="notice-copy"><strong>Demo environment · No live vehicle data</strong><p>Telemetry is currently unavailable. Values are intentionally withheld until a verified source is connected. No commands are sent to the vehicle.</p></div>
                    <span className="notice-tag">NO LIVE DATA</span>
                  </section>
        
                  <VehicleModelStage />
        
                  <section className="section-block" aria-labelledby="telemetry-heading">
                    <div className="section-heading"><div><h2 id="telemetry-heading">Telemetry snapshot</h2><p>Latest known values from the configured data source</p></div><span className="updated-label"><span className="status-dot grey" /> No readings received</span></div>
                    <div className="metrics-grid">
                      {metrics.map((metric) => (
                        <article className="metric-card" key={metric.label}>
                          <div className="metric-top"><span>{metric.label}</span><Mark>{metric.icon}</Mark></div>
                          <div className={metric.tone === "muted" ? "metric-value status-value" : "metric-value"}>{metric.value}</div>
                          <div className="metric-unit">{metric.unit}</div>
                          <div className="metric-foot"><span className="metric-foot-line" />{metric.note}</div>
                        </article>
                      ))}
                    </div>
                  </section>
        
                  <div className="lower-grid">
                    <section className="panel-card" id="diagnostics">
                      <div className="panel-heading"><div><h2>System health</h2><p>Integration and data quality</p></div><span className="panel-icon">⌁</span></div>
                      <div className="health-list">
                        <div className="health-row"><span className="health-symbol">◉</span><div><strong>Vehicle gateway</strong><small>No adapter configured</small></div><span className="health-badge neutral">NOT SET</span></div>
                        <div className="health-row"><span className="health-symbol">▤</span><div><strong>Telemetry stream</strong><small>No readings received</small></div><span className="health-badge neutral">WAITING</span></div>
                        <div className="health-row"><span className="health-symbol">⌑</span><div><strong>Data freshness</strong><small>Cannot be evaluated yet</small></div><span className="health-badge neutral">UNKNOWN</span></div>
                        <div className="health-row"><span className="health-symbol">✓</span><div><strong>Remote commands</strong><small>Not implemented or enabled</small></div><span className="health-badge disabled">DISABLED</span></div>
                      </div>
                      <div className="panel-footer"><span>Health reflects integration readiness, not vehicle safety certification.</span></div>
                    </section>
        
                    <section className="panel-card" id="battery">
                      <div className="panel-heading"><div><h2>Battery & charging</h2><p>Measurements require hardware mapping</p></div><span className="panel-icon cyan-icon">ϟ</span></div>
                      <div className="battery-empty">
                        <div className="battery-illustration"><div className="battery-terminal" /><div className="battery-body"><span /><span /><span /></div></div>
                        <strong>Waiting for battery telemetry</strong>
                        <p>State of charge, voltage, current, and temperature will appear once the battery interface and units are verified.</p>
                        <span className="outline-label">MEASUREMENTS UNAVAILABLE</span>
                      </div>
                      <div className="panel-footer"><span>Battery readings are not inferred or estimated.</span><a href="/logbook">Engineering logbook <span>↗</span></a></div>
                    </section>
                  </div>
        
                  <section className="panel-card activity-panel" id="tests">
                    <div className="panel-heading"><div><h2>Recent activity</h2><p>Recorded system events and engineering updates</p></div><a className="text-link" href="/logbook">View logbook <span>↗</span></a></div>
                    <div className="activity-empty"><div className="empty-icon">⌁</div><div><strong>{events[0].title}</strong><p>{events[0].detail}</p></div><span className="health-badge neutral">NO DATA</span></div>
                  </section>
        
                  <section className="logbook-strip" id="logbook">
                    <div className="logbook-icon">☷</div><div><strong>Engineering logbook</strong><p>Keep maintenance notes, inspections, test sessions, and hardware changes in one traceable record.</p></div><span className="coming-soon">FOUNDATION PHASE</span>
                  </section>
        
                  <footer className="footer"><span>EVS <span className="footer-dot">·</span> Exotic Racing Team IAET</span><span>Engineering interface <span className="footer-dot">·</span> Not safety-certified</span></footer>
      </div>
    </AppShell>
  );
}
