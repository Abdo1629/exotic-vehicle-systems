import AppShell from "@/components/AppShell";
import LocalRecordBook from "@/components/LocalRecordBook";
import { T } from "@/components/LocaleProvider";
export default function TestsPage() {
  return <AppShell active="tests" title="Test sessions"><div className="content">
    <div className="page-intro"><div><p className="eyebrow"><span className="eyebrow-line" /> <T en="ENGINEERING RECORDS" ar="سجلات الاختبارات" /></p><h1><T en="Test sessions" ar="جلسات الاختبار" /><span className="title-period">.</span></h1><p className="subtitle"><T en="Record inspections and test observations. This form does not generate vehicle measurements." ar="سجّل الفحوصات وملاحظات الاختبار. النموذج لا ينشئ قراءات للعربية." /></p></div></div>
    <LocalRecordBook storageKey="evs-test-sessions-v1" heading="New test session" description="Write down the session purpose and observations." buttonLabel="Save session" emptyTitle="No sessions recorded" emptyDescription="Add the first entry when the team is ready to document a test or inspection." />
  </div></AppShell>;
}
