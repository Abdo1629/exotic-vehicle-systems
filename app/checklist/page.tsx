import AppShell from "@/components/AppShell";
import PreTestChecklist from "@/components/PreTestChecklist";
import { T } from "@/components/LocaleProvider";

export default function ChecklistPage() {
  return (
    <AppShell active="checklist" title="Before-test checklist">
      <div className="content">
        <div className="page-intro">
          <div>
            <p className="eyebrow"><span className="eyebrow-line" /> <T en="PIT WORKFLOW" ar="تجهيز الاختبار" /></p>
            <h1><T en="Before-test checklist" ar="قائمة ما قبل الاختبار" /><span className="title-period">.</span></h1>
            <p className="subtitle"><T en="Keep the team aligned before a test session and make ownership visible." ar="خلّي الفريق متفق قبل جلسة الاختبار وخلي المسؤوليات واضحة." /></p>
          </div>
        </div>
        <PreTestChecklist />
        <section className="notice"><div className="notice-icon">i</div><div className="notice-copy"><strong><T en="A checked box is not a safety certification" ar="تحديد البند لا يعني اعتماد السلامة" /></strong><p><T en="Follow the team's approved operating procedure and have the designated lead verify each item. This checklist is saved locally and is not an official safety record." ar="اتبع إجراءات التشغيل المعتمدة للفريق، وخلي المسؤول المختص يتحقق من كل بند. القائمة محفوظة محليًا وليست سجل سلامة رسميًا." /></p></div></section>
      </div>
    </AppShell>
  );
}
