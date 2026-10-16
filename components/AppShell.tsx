import type { ReactNode } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

const navigation = [
  { key: "overview", label: "Overview", icon: "◫", href: "/" },
  { key: "battery", label: "Battery & charging", icon: "▤", href: "/battery" },
  { key: "diagnostics", label: "Diagnostics", icon: "⌁", href: "/diagnostics" },
  { key: "tests", label: "Test sessions", icon: "◷", href: "/tests" },
  { key: "logbook", label: "Engineering logbook", icon: "☷", href: "/logbook" },
];
export default function AppShell({ children, active, title }: { children: ReactNode; active: string; title: string }) {
  return (
    <main className="app-shell">
      <aside className="sidebar">
        <Link className="brand" href="/" aria-label="Exotic Vehicle Systems home">
          <span className="brand-mark" aria-label="Official team logo placeholder"><span>LOGO</span></span>
          <span className="brand-copy"><strong>EXOTIC</strong><small>VEHICLE SYSTEMS</small></span>
        </Link>
        <div className="side-label">TEAM WORKSPACE</div>
        <nav className="nav-list" aria-label="Main navigation">
          {navigation.map((item) => (
            <Link className={item.key === active ? "nav-item active" : "nav-item"} href={item.href} key={item.key} aria-current={item.key === active ? "page" : undefined}>
              <span className="nav-icon" aria-hidden="true">{item.icon}</span><span>{item.label}</span>
              {item.key === active && <span className="nav-indicator" />}
            </Link>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="system-card">
            <span className="system-card-icon">⌘</span>
            <div><strong>Vehicle connection</strong><small>No hardware adapter</small></div>
            <span className="status-dot grey" />
          </div>
          <div className="profile">
            <div className="avatar">ER</div>
            <div className="profile-copy"><strong>Exotic Racing Team</strong><small>IAET · Engineering</small></div>
          </div>
        </div>
      </aside>
      <section className="main-panel">
        <header className="topbar">
          <div className="breadcrumbs"><Link href="/">EVS</Link><span className="crumb-sep">/</span><strong>{title}</strong></div>
          <div className="topbar-actions">
            <ThemeToggle />
            <span className="mode-pill"><span className="status-dot blue-dot" /> NO LIVE DATA</span>
            <span className="topbar-divider" />
            <span className="topbar-team"><span className="team-avatar">ER</span><span>Engineering team</span></span>
          </div>
        </header>
        {children}
      </section>
    </main>
  );
}
