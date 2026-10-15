import VehicleModelStage from "@/components/vehicle/VehicleModelStage";
import ThemeToggle from "@/components/ThemeToggle";

const navigation = [
  { label: "Overview", icon: "◫", href: "#overview", active: true },
  { label: "Battery & charging", icon: "▤", href: "#battery" },
  { label: "Diagnostics", icon: "⌁", href: "#diagnostics" },
  { label: "Test sessions", icon: "◷", href: "#tests" },
  { label: "Engineering logbook", icon: "☷", href: "#logbook" },
];

const metrics = [
  { label: "State of charge", value: "—", unit: "Not connected", icon: "▤", note: "No verified battery feed", tone: "blue" },
  { label: "Battery voltage", value: "—", unit: "V · unavailable", icon: "ϟ", note: "Awaiting hardware mapping", tone: "cyan" },
  { label: "Battery temperature", value: "—", unit: "°C · unavailable", icon: "♨", note: "No temperature sensor mapped", tone: "amber" },
  { label: "Vehicle connection", value: "Offline", unit: "No device connected", icon: "⌁", note: "This is not vehicle-state data", tone: "muted" },
];

const events = [
  { time: "—", title: "No vehicle events received", detail: "Events will appear here when a verified data source is connected.", kind: "neutral" },
];

function Mark({ children }: { children: React.ReactNode }) {
  return <span className="mark" aria-hidden="true">{children}</span>;
}

export default function Home() {
  return (
    <main className="app-shell" id="overview">
      <aside className="sidebar">
        <a className="brand" href="#overview" aria-label="EVS overview">
          <span className="brand-mark"><span>EV</span><i>S</i></span>
          <span className="brand-copy"><strong>EXOTIC</strong><small>VEHICLE SYSTEMS</small></span>
        </a>
        <div className="side-label">VEHICLE OPERATIONS</div>
        <nav className="nav-list" aria-label="Main navigation">
          {navigation.map((item) => (
            <a className={item.active ? "nav-item active" : "nav-item"} href={item.href} key={item.label} aria-current={item.active ? "page" : undefined}>
              <span className="nav-icon" aria-hidden="true">{item.icon}</span><span>{item.label}</span>
              {item.active && <span className="nav-indicator" />}
            </a>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="system-card">
            <span className="system-card-icon">⌘</span>
            <div><strong>Integration status</strong><small>No hardware adapter</small></div>
            <span className="status-dot grey" />
          </div>
          <div className="profile">
            <div className="avatar">ER</div>
            <div className="profile-copy"><strong>Exotic Racing Team</strong><small>IAET · Engineering</small></div>
            <span className="profile-menu">···</span>
          </div>
        </div>
      </aside>

      <section className="main-panel">
        <header className="topbar">
          <div className="breadcrumbs"><span>EVS</span><span className="crumb-sep">/</span><strong>Overview</strong></div>
          <div className="topbar-actions">
            <ThemeToggle />
            <span className="mode-pill"><span className="status-dot blue-dot" /> DEMO MODE</span>
            <span className="topbar-divider" />
            <span className="topbar-team"><span className="team-avatar">ER</span><span>Engineering team</span></span>
          </div>
        </header>

        <div className="content">
          <section className="welcome-row">
            <div>
              <div className="eyebrow"><span className="eyebrow-line" /> VEHICLE SYSTEMS MONITOR</div>
              <h1>Vehicle overview<span className="title-period">.</span></h1>
              <p className="subtitle">A clear view of system health, data availability, and engineering activity.</p>
            </div>
            <div className="vehicle-state"><span className="state-symbol">↗</span><div><span>VEHICLE STATUS</span><strong>Not connected</strong><small>Connection state only — motion unknown</small></div></div>
          </section>

          <section className="notice" aria-label="Simulation notice">
            <div className="notice-icon">i</div>
            <div className="notice-copy"><strong>Demo environment · No live vehicle data</strong><p>Telemetry is currently unavailable. Values are intentionally withheld until a verified source is connected. No commands are sent to the vehicle.</p></div>
            <span className="notice-tag">SIMULATED</span>
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
              <div className="panel-footer"><span>Battery readings are not inferred or estimated.</span><a href="#logbook">Integration notes <span>↗</span></a></div>
            </section>
          </div>

          <section className="panel-card activity-panel" id="tests">
            <div className="panel-heading"><div><h2>Recent activity</h2><p>Recorded system events and engineering updates</p></div><a className="text-link" href="#logbook">View logbook <span>↗</span></a></div>
            <div className="activity-empty"><div className="empty-icon">⌁</div><div><strong>{events[0].title}</strong><p>{events[0].detail}</p></div><span className="health-badge neutral">NO DATA</span></div>
          </section>

          <section className="logbook-strip" id="logbook">
            <div className="logbook-icon">☷</div><div><strong>Engineering logbook</strong><p>Keep maintenance notes, inspections, test sessions, and hardware changes in one traceable record.</p></div><span className="coming-soon">FOUNDATION PHASE</span>
          </section>

          <footer className="footer"><span>EVS <span className="footer-dot">·</span> Exotic Racing Team IAET</span><span>Engineering interface <span className="footer-dot">·</span> Not safety-certified</span></footer>
        </div>
      </section>
    </main>
  );
}
