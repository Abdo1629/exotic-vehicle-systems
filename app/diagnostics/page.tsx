import AppShell from "@/components/AppShell";

const checks = [
  ["Battery data source", "No interface or protocol verified", "NOT CONFIGURED"],
  ["Motor controller", "Model and communication protocol unknown", "NOT CONFIGURED"],
  ["Vehicle gateway", "No adapter connected to the application", "OFFLINE"],
  ["Telemetry freshness", "No timestamps have been received", "UNKNOWN"],
  ["Remote commands", "Not implemented; no commands are sent", "DISABLED"],
];
export default function DiagnosticsPage() {
  return <AppShell active="diagnostics" title="Diagnostics"><div className="content">
    <div className="page-intro"><div><p className="eyebrow"><span className="eyebrow-line" /> INTEGRATION STATUS</p><h1>Diagnostics<span className="title-period">.</span></h1><p className="subtitle">What is configured, what remains unknown, and what needs verification.</p></div><span className="health-badge neutral">NO LIVE FEED</span></div>
    <section className="notice"><div className="notice-icon">i</div><div className="notice-copy"><strong>Unknown does not mean healthy</strong><p>This page reports software and integration readiness only. It does not assess the physical vehicle or certify it for operation.</p></div></section>
    <section className="panel-card"><div className="panel-heading"><div><h2>Integration checklist</h2><p>Current known state of the software connection</p></div><span className="panel-icon">⌁</span></div><div className="health-list">{checks.map(([name,detail,status])=><div className="health-row" key={name}><span className="health-symbol">•</span><div><strong>{name}</strong><small>{detail}</small></div><span className="health-badge neutral">{status}</span></div>)}</div><div className="panel-footer"><span>Statuses change only after the relevant interface is verified and configured.</span><a href="/battery">Battery details <span>↗</span></a></div></section>
    <section className="logbook-strip"><div className="logbook-icon">☷</div><div><strong>Keep hardware findings traceable</strong><p>Record controller labels, wiring checks, protocol documentation, and validation results in the engineering logbook.</p></div><a className="text-link" href="/logbook">Open logbook ↗</a></section>
  </div></AppShell>;
}
