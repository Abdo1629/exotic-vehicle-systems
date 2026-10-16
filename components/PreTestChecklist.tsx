"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { T, useLocale } from "@/components/LocaleProvider";

const STORAGE_KEY = "evs-pretest-checklist-v1";
const items = [
  { id: "briefing", en: "Team briefing and roles agreed", ar: "تم الاتفاق على إحاطة الفريق والأدوار" },
  { id: "interlocks", en: "Safety interlocks and emergency stop checked by the responsible lead", ar: "تم فحص دوائر الأمان والإيقاف الطارئ بواسطة المسؤول المختص" },
  { id: "vehicle", en: "Vehicle body, wheels, fasteners and visible wiring inspected", ar: "تم فحص جسم المركبة والعجلات والمثبتات والتوصيلات الظاهرة" },
  { id: "battery", en: "Battery enclosure and charging equipment inspected by an authorized member", ar: "تم فحص صندوق البطارية ومعدات الشحن بواسطة عضو مخوّل" },
  { id: "telemetry", en: "Telemetry gateway power, timestamps and data source checked", ar: "تم فحص تغذية وحدة القياس والطوابع الزمنية ومصدر البيانات" },
  { id: "abort", en: "Test area, communication plan and stop criteria agreed", ar: "تم الاتفاق على منطقة الاختبار وخطة التواصل ومعايير إيقاف الاختبار" },
];

export default function PreTestChecklist() {
  const { locale } = useLocale();
  const rtl = locale === "ar";
  const subscribe = useCallback((notify: () => void) => {
    window.addEventListener("storage", notify);
    window.addEventListener("evs-checklist-change", notify);
    return () => {
      window.removeEventListener("storage", notify);
      window.removeEventListener("evs-checklist-change", notify);
    };
  }, []);
  const getSnapshot = useCallback(() => {
    try { return localStorage.getItem(STORAGE_KEY) ?? "[]"; } catch { return "[]"; }
  }, []);
  const serialized = useSyncExternalStore(subscribe, getSnapshot, () => "[]");
  const checked = useMemo<string[]>(() => {
    try {
      const parsed: unknown = JSON.parse(serialized);
      return Array.isArray(parsed) ? parsed.filter((value): value is string => typeof value === "string") : [];
    } catch { return []; }
  }, [serialized]);
  function setItem(id: string, next: boolean) {
    const values = next ? [...new Set([...checked, id])] : checked.filter((value) => value !== id);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(values)); } catch {}
    window.dispatchEvent(new Event("evs-checklist-change"));
  }
  function reset() {
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    window.dispatchEvent(new Event("evs-checklist-change"));
  }
  return (
    <section className="panel-card pit-checklist">
      <div className="panel-heading"><div><h2><T en="Before-test checklist" ar="قائمة ما قبل الاختبار" /></h2><p><T en="A team workflow aid — not a substitute for the official safety procedure." ar="أداة لتنظيم عمل الفريق، ولا تُغني عن إجراءات السلامة الرسمية." /></p></div><span className="panel-icon">✓</span></div>
      <div className="pit-progress">
        <div className="pit-progress-copy"><strong>{checked.filter((id) => items.some((item) => item.id === id)).length} / {items.length}</strong><span><T en="items checked on this device" ar="البنود المؤكدة على هذا الجهاز" /></span></div>
        <div className="pit-progress-track"><span style={{ width: `${Math.round(checked.filter((id) => items.some((item) => item.id === id)).length / items.length * 100)}%` }} /></div>
      </div>
      <div className="pit-list">
        {items.map((item, index) => {
          const done = checked.includes(item.id);
          return <button type="button" key={item.id} className={`pit-item${done ? " checked" : ""}`} onClick={() => setItem(item.id, !done)} aria-pressed={done}>
            <span className="pit-check">{done ? "✓" : String(index + 1).padStart(2, "0")}</span>
            <span className="pit-item-copy"><strong><T en={item.en} ar={item.ar} /></strong><small>{done ? <T en="Marked complete on this device" ar="البنود المحددة بوصفها مكتملة على هذا الجهاز" /> : <T en="Mark only after the responsible person has checked it" ar="لا تحدده بوصفه مكتملًا إلا بعد فحصه من المسؤول المختص" />}</small></span>
            <span className="pit-item-state">{done ? <T en="DONE" ar="تم" /> : <T en="OPEN" ar="مفتوح" />}</span>
          </button>;
        })}
      </div>
      <div className="panel-footer"><span><T en="Saved in this browser only; not synced to the team." ar="تُحفظ البيانات في هذا المتصفح فقط، ولا تتم مزامنتها مع بقية أعضاء الفريق." /></span><button className="quiet-action" type="button" onClick={reset}><T en="Reset checklist" ar="إعادة تعيين القائمة" /></button></div>
    </section>
  );
}
