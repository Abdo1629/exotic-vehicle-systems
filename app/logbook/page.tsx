import AppShell from "@/components/AppShell";
import LocalRecordBook from "@/components/LocalRecordBook";
export default function LogbookPage() {
  return <AppShell active="logbook" title="Engineering logbook"><div className="content">
    <div className="page-intro"><div><p className="eyebrow"><span className="eyebrow-line" /> TEAM NOTES</p><h1>Engineering logbook<span className="title-period">.</span></h1><p className="subtitle">A simple local record for maintenance notes, component changes, and integration findings.</p></div></div>
    <LocalRecordBook storageKey="evs-engineering-logbook-v1" heading="New engineering note" description="Keep the entry specific: what changed, what was checked, and what remains open." buttonLabel="Save note" emptyTitle="No engineering notes yet" emptyDescription="Start with the next verified finding from the car, battery, controller, or software integration." />
  </div></AppShell>;
}
