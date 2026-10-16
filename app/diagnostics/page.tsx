import AppShell from "@/components/AppShell";
import { T } from "@/components/LocaleProvider";

const checks = [
  ["Battery data source", "No interface or protocol verified", "NOT CONFIGURED", "مصدر بيانات البطارية", "لم يتم التحقق من الواجهة أو البروتوكول", "غير مُعد"],
  ["Motor controller", "Model and communication protocol unknown", "NOT CONFIGURED", "وحدة التحكم في المحرك", "الموديل وبروتوكول الاتصال غير معروفين", "غير مُعد"],
  ["Vehicle gateway", "No adapter connected to the application", "OFFLINE", "وحدة الاتصال بالمركبة", "لا يوجد وسيط اتصال مرتبط بالتطبيق", "غير متصل"],
  ["Telemetry freshness", "No timestamps have been received", "UNKNOWN", "حداثة القراءات", "لم يتم استقبال طوابع زمنية", "غير معروفة"],
  ["Remote commands", "Not implemented; no commands are sent", "DISABLED", "الأوامر عن بُعد", "غير منفذة ولا يتم إرسال أوامر", "معطّلة"],
];
export default function DiagnosticsPage() {
  return <AppShell active="diagnostics" title="Diagnostics"><div className="content">
    <div className="page-intro"><div><p className="eyebrow"><span className="eyebrow-line" /> <T en="INTEGRATION STATUS" ar="حالة الربط" /></p><h1><T en="Diagnostics" ar="حالة النظام" /><span className="title-period">.</span></h1><p className="subtitle"><T en="See what is configured, what remains unknown, and what needs verification." ar="تعرّف على ما تم إعداده، وما لا يزال غير معروف ويحتاج إلى التحقق." /></p></div><span className="health-badge neutral"><T en="NO LIVE FEED" ar="لا توجد بيانات مباشرة" /></span></div>
    <section className="notice"><div className="notice-icon">i</div><div className="notice-copy"><strong><T en="Unknown does not mean healthy" ar="عدم التحقق لا يعني سلامة النظام" /></strong><p><T en="This page reports software integration readiness only. It does not assess physical vehicle safety or certify it for operation." ar="تعرض هذه الصفحة جاهزية الربط البرمجي فقط، ولا تقيّم السلامة الفعلية للمركبة أو تعتمدها للتشغيل." /></p></div></section>
    <section className="panel-card"><div className="panel-heading"><div><h2><T en="Integration checklist" ar="قائمة التحقق من الربط" /></h2><p><T en="Current known state of the software connection" ar="الحالة الحالية المعروفة للاتصال البرمجي" /></p></div><span className="panel-icon">⌁</span></div><div className="health-list">{checks.map(([name,detail,status,arName,arDetail,arStatus])=><div className="health-row" key={name}><span className="health-symbol">•</span><div><strong><T en={name} ar={arName} /></strong><small><T en={detail} ar={arDetail} /></small></div><span className="health-badge neutral"><T en={status} ar={arStatus} /></span></div>)}</div><div className="panel-footer"><span><T en="Statuses change only after the interface is verified and configured." ar="الحالات لا تتغير إلا بعد التحقق من الواجهة وإعدادها." /></span><a href="/battery"><T en="Battery details ↗" ar="تفاصيل البطارية ↗" /></a></div></section>
    <section className="logbook-strip"><div className="logbook-icon">☷</div><div><strong><T en="Keep hardware findings traceable" ar="وثّق نتائج فحص المكوّنات" /></strong><p><T en="Record controller labels, wiring checks, protocol documentation and validation results." ar="دوّن بيانات وحدات التحكم وفحوصات التوصيلات ووثائق بروتوكولات الاتصال ونتائج التحقق." /></p></div><a className="text-link" href="/logbook"><T en="Open logbook ↗" ar="فتح السجل ↗" /></a></section>
  </div></AppShell>;
}
