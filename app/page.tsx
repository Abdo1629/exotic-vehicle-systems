import AppShell from "@/components/AppShell";
import VehicleModelStage from "@/components/vehicle/VehicleModelStage";
import TelemetrySnapshot from "@/components/telemetry/TelemetrySnapshot";
import { T } from "@/components/LocaleProvider";

export default function Home() {
  return (
    <AppShell active="overview" title="Overview">
      <div className="content">
        <section className="welcome-row">
          <div>
            <div className="eyebrow"><span className="eyebrow-line" /> <T en="TEAM VEHICLE / OVERVIEW" ar="عربية الفريق / نظرة عامة" /></div>
            <h1><T en="Vehicle overview" ar="ملخص العربية" /><span className="title-period">.</span></h1>
            <p className="subtitle"><T en="Understand the latest confirmed vehicle information and what needs attention." ar="اعرف آخر معلومات مؤكدة عن العربية وإيه اللي محتاج متابعة." /></p>
          </div>
          <div className="vehicle-state"><span className="state-symbol">↗</span><div><span><T en="VEHICLE STATUS" ar="حالة العربية" /></span><strong><T en="Not connected" ar="غير متصلة بالنظام" /></strong><small><T en="Movement and safety state are unknown" ar="حالة الحركة والسلامة غير معروفة" /></small></div></div>
        </section>
        <VehicleModelStage />
        <TelemetrySnapshot />
        <div className="lower-grid">
          <section className="panel-card" id="diagnostics">
            <div className="panel-heading"><div><h2><T en="System readiness" ar="جاهزية النظام" /></h2><p><T en="Connection and data quality" ar="الاتصال وجودة البيانات" /></p></div><span className="panel-icon">⌁</span></div>
            <div className="health-list">
              <div className="health-row"><span className="health-symbol">◉</span><div><strong><T en="Vehicle gateway" ar="وحدة الاتصال بالعربية" /></strong><small><T en="No adapter configured" ar="لم يتم إعداد وسيط اتصال" /></small></div><span className="health-badge neutral"><T en="NOT SET" ar="غير مُعد" /></span></div>
              <div className="health-row"><span className="health-symbol">▤</span><div><strong><T en="Telemetry stream" ar="تدفق القراءات" /></strong><small><T en="No readings received" ar="لم يتم استقبال قراءات" /></small></div><span className="health-badge neutral"><T en="WAITING" ar="في الانتظار" /></span></div>
              <div className="health-row"><span className="health-symbol">⌑</span><div><strong><T en="Data freshness" ar="حداثة البيانات" /></strong><small><T en="Cannot be evaluated yet" ar="لا يمكن تقييمها حتى الآن" /></small></div><span className="health-badge neutral"><T en="UNKNOWN" ar="غير معروفة" /></span></div>
              <div className="health-row"><span className="health-symbol">✓</span><div><strong><T en="Remote commands" ar="الأوامر عن بُعد" /></strong><small><T en="Not implemented or enabled" ar="غير منفذة وغير مفعّلة" /></small></div><span className="health-badge disabled"><T en="DISABLED" ar="معطّلة" /></span></div>
            </div>
            <div className="panel-footer"><span><T en="System readiness does not certify the physical vehicle as safe." ar="جاهزية النظام لا تعني أن العربية آمنة للتشغيل." /></span></div>
          </section>
          <section className="panel-card" id="battery">
            <div className="panel-heading"><div><h2><T en="Battery & charging" ar="البطارية والشحن" /></h2><p><T en="Live readings need a verified battery interface" ar="القراءات المباشرة تحتاج واجهة بطارية موثقة" /></p></div><span className="panel-icon cyan-icon">ϟ</span></div>
            <div className="battery-empty">
              <div className="battery-illustration"><div className="battery-terminal" /><div className="battery-body"><span /><span /><span /></div></div>
              <strong><T en="Waiting for battery data" ar="في انتظار بيانات البطارية" /></strong>
              <p><T en="Charge, voltage, current and temperature appear only after a real source is verified." ar="لن تظهر نسبة الشحن والجهد والتيار والحرارة إلا بعد توصيل مصدر بيانات حقيقي والتحقق منه." /></p>
              <span className="outline-label"><T en="READINGS UNAVAILABLE" ar="القراءات غير متاحة" /></span>
            </div>
            <div className="panel-footer"><span><T en="Missing readings are never guessed." ar="لا يتم تخمين القراءات المفقودة." /></span><a href="/battery"><T en="Battery details ↗" ar="تفاصيل البطارية ↗" /></a></div>
          </section>
        </div>
        <section className="panel-card activity-panel" id="tests">
          <div className="panel-heading"><div><h2><T en="Recent activity" ar="أحدث النشاطات" /></h2><p><T en="Recorded maintenance and test events" ar="سجلات الصيانة والاختبارات" /></p></div><a className="text-link" href="/logbook"><T en="Open logbook ↗" ar="فتح السجل ↗" /></a></div>
          <div className="activity-empty"><div className="empty-icon">⌁</div><div><strong><T en="No events recorded yet" ar="لا توجد أحداث مسجلة حتى الآن" /></strong><p><T en="Verified events will appear when data ingestion and shared storage are connected." ar="ستظهر الأحداث المؤكدة بعد ربط استقبال البيانات والتخزين المشترك." /></p></div><span className="health-badge neutral"><T en="NO DATA" ar="لا توجد بيانات" /></span></div>
        </section>
        <section className="logbook-strip" id="logbook">
          <div className="logbook-icon">☷</div><div><strong><T en="Vehicle memory & engineering logbook" ar="ذاكرة العربية والسجل الهندسي" /></strong><p><T en="Track inspections, component changes, issues and test outcomes in one place." ar="تابع الفحوصات وتغييرات المكونات والمشكلات ونتائج الاختبارات في مكان واحد." /></p></div><a className="text-link" href="/logbook"><T en="Open ↗" ar="فتح ↗" /></a>
        </section>
        <footer className="footer"><span>EVS <span className="footer-dot">·</span> Exotic Racing Team IAET</span><span><T en="Engineering workspace · Not safety-certified" ar="منظومة هندسية · غير معتمدة كمنظومة سلامة" /></span></footer>
      </div>
    </AppShell>
  );
}
