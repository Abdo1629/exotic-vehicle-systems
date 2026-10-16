import AppShell from "@/components/AppShell";
import LocalRecordBook from "@/components/LocalRecordBook";
import { T } from "@/components/LocaleProvider";
export default function LogbookPage() {
  return <AppShell active="logbook" title="Engineering logbook"><div className="content">
    <div className="page-intro"><div><p className="eyebrow"><span className="eyebrow-line" /> <T en="TEAM NOTES" ar="ملاحظات الفريق" /></p><h1><T en="Engineering logbook" ar="السجل الهندسي" /><span className="title-period">.</span></h1><p className="subtitle"><T en="Record maintenance, component changes and integration findings." ar="دوّن أعمال الصيانة وتغييرات المكوّنات ونتائج فحص الربط." /></p></div></div>
    <LocalRecordBook storageKey="evs-engineering-logbook-v1" heading="New engineering note" description="Keep the entry specific: what changed, what was checked, and what remains open." buttonLabel="Save note" emptyTitle="No engineering notes yet" emptyDescription="Start with the next verified finding from the car, battery, controller, or software integration." />
  </div></AppShell>;
}
