import type { ReactNode } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import { LanguageToggle, T } from "@/components/LocaleProvider";

const navigation = [
  { key: "overview", label: "Overview", ar: "نظرة عامة", icon: "◫", href: "/" },
  { key: "battery", label: "Battery & charging", ar: "البطارية والشحن", icon: "▤", href: "/battery" },
  { key: "map", label: "Live map", ar: "الخريطة المباشرة", icon: "⌖", href: "/map" },
  { key: "trips", label: "Trip history", ar: "سجل الرحلات", icon: "↗", href: "/trips" },
  { key: "diagnostics", label: "Diagnostics", ar: "حالة النظام", icon: "⌁", href: "/diagnostics" },
  { key: "tests", label: "Test sessions", ar: "جلسات الاختبار", icon: "◷", href: "/tests" },
  { key: "checklist", label: "Before-test checklist", ar: "قائمة ما قبل الاختبار", icon: "✓", href: "/checklist" },
  { key: "download", label: "Download app", ar: "تنزيل التطبيق", icon: "↓", href: "/download" },
  { key: "logbook", label: "Engineering logbook", ar: "سجل الصيانة والهندسة", icon: "☷", href: "/logbook" },
];

export default function AppShell({ children, active, title }: { children: ReactNode; active: string; title: string }) {
  const activeItem = navigation.find((item) => item.key === active);
  return (
    <main className="app-shell">
      <aside className="sidebar">
        <Link className="brand" href="/" aria-label="Exotic Vehicle Systems home">
          <span className="brand-mark"><img src="/logo.jpeg" alt="Exotic Vehicle Systems logo" /></span>
          <span className="brand-copy"><strong>EXOTIC</strong><small>VEHICLE SYSTEMS</small></span>
        </Link>
        <div className="side-label"><T en="TEAM WORKSPACE" ar="مساحة عمل الفريق" /></div>
        <nav className="nav-list" aria-label="Main navigation">
          {navigation.map((item) => (
            <Link className={item.key === active ? "nav-item active" : "nav-item"} href={item.href} key={item.key} aria-current={item.key === active ? "page" : undefined}>
              <span className="nav-icon" aria-hidden="true">{item.icon}</span><span><T en={item.label} ar={item.ar} /></span>
              {item.key === active && <span className="nav-indicator" />}
            </Link>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="system-card">
            <span className="system-card-icon">⌘</span>
            <div><strong><T en="Vehicle connection" ar="اتصال المركبة" /></strong><small><T en="No hardware adapter" ar="لا يوجد وسيط أجهزة متصل" /></small></div>
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
          <div className="breadcrumbs"><Link href="/">EVS</Link><span className="crumb-sep">/</span><strong>{activeItem ? <T en={activeItem.label} ar={activeItem.ar} /> : title}</strong></div>
          <div className="topbar-actions">
            <LanguageToggle />
            <ThemeToggle />
            <span className="mode-pill"><span className="status-dot blue-dot" /> <T en="NO LIVE DATA" ar="لا توجد بيانات مباشرة" /></span>
            <span className="topbar-divider" />
            <span className="topbar-team"><span className="team-avatar">ER</span><span><T en="Team workspace" ar="مساحة عمل الفريق" /></span></span>
          </div>
        </header>
        {children}
      </section>
    </main>
  );
}
