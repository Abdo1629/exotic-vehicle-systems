"use client";

import { useEffect, useRef, useState } from "react";
import { T, useLocale } from "@/components/LocaleProvider";

type VehicleZone = {
  id: string;
  label: string;
  detail: string;
  arLabel: string;
  arDetail: string;
  x: number;
  y: number;
};

const zones: VehicleZone[] = [
  { id: "battery", label: "Battery pack", detail: "SOC, voltage, current and temperature require a verified battery data source.", arLabel: "حزمة البطارية", arDetail: "نسبة الشحن والجهد والتيار والحرارة تحتاج مصدر بيانات بطارية موثّق.", x: 50, y: 49 },
  { id: "controller", label: "Motor controller", detail: "Controller model, state and fault codes have not been mapped yet.", arLabel: "وحدة التحكم في المحرك", arDetail: "لم يتم تحديد موديل وحدة التحكم أو حالتها أو رموز الأعطال بعد.", x: 72, y: 57 },
  { id: "front", label: "Front assembly", detail: "No front sensor or subsystem data has been configured.", arLabel: "المجموعة الأمامية", arDetail: "لم يتم إعداد بيانات مستشعرات أو أنظمة الجزء الأمامي.", x: 23, y: 58 },
  { id: "rear", label: "Rear assembly", detail: "No rear sensor or subsystem data has been configured.", arLabel: "المجموعة الخلفية", arDetail: "لم يتم إعداد بيانات مستشعرات أو أنظمة الجزء الخلفي.", x: 81, y: 48 },
];

export default function VehicleModelStage() {
  const { locale } = useLocale();
  const rtl = locale === "ar";
  const [selectedZone, setSelectedZone] = useState(zones[0]);
  const [view, setView] = useState<"3d" | "systems">("3d");
  const [modelStatus, setModelStatus] = useState<"pending" | "loaded" | "error">("pending");
  const modelViewerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const viewer = modelViewerRef.current;
    if (!viewer) return;
    const handleLoad = () => setModelStatus("loaded");
    const handleError = () => setModelStatus("error");
    viewer.addEventListener("load", handleLoad);
    viewer.addEventListener("error", handleError);
    return () => {
      viewer.removeEventListener("load", handleLoad);
      viewer.removeEventListener("error", handleError);
    };
  }, []);

  return (
    <section className="vehicle-stage-card" aria-labelledby="vehicle-stage-title">
      <div className="vehicle-stage-heading">
        <div>
          <div className="stage-eyebrow"><span className="stage-eyebrow-dot" /> <T en="VEHICLE DIGITAL VIEW" ar="عرض المركبة الرقمي" /></div>
          <h2 id="vehicle-stage-title"><T en="Vehicle model" ar="نموذج المركبة" /></h2>
          <p><T en="Rotatable 3D viewer · select a subsystem to inspect" ar="عارض ثلاثي الأبعاد قابل للدوران · اختر نظامًا لفحصه" /></p>
        </div>
        <div className="stage-controls" role="group" aria-label={rtl ? "وضع عرض المركبة" : "Vehicle view mode"}>
          <button className={view === "3d" ? "stage-tab selected" : "stage-tab"} onClick={() => setView("3d")} type="button"><T en="Model view" ar="عرض النموذج" /></button>
          <button className={view === "systems" ? "stage-tab selected" : "stage-tab"} onClick={() => setView("systems")} type="button"><T en="Systems" ar="الأنظمة" /></button>
        </div>
      </div>

      <div className="vehicle-stage-body">
        <div className="vehicle-viewport" data-model-slot="vehicle-glb" data-model-path="/models/exotic-racer.glb">
          <div className="viewport-grid" aria-hidden="true" />
          <div className="viewport-topline"><span>EVS / <T en="VEHICLE ASSET" ar="ملف المركبة" /></span><span className="asset-state"><i /> {modelStatus === "loaded" ? <T en="3D MODEL LOADED" ar="تم تحميل النموذج" /> : modelStatus === "error" ? <T en="ASSET NOT FOUND" ar="الملف غير موجود" /> : <T en="MODEL ASSET PENDING" ar="في انتظار ملف النموذج" />}</span></div>
          {view === "3d" ? (
            <div className="vehicle-model-shell">
              <model-viewer
                ref={modelViewerRef}
                className="vehicle-model-viewer"
                src="/models/exotic-racer.glb"
                alt={rtl ? "نموذج ثلاثي الأبعاد تفاعلي لمركبة فريق إكزوتك ريسينج" : "Interactive 3D model of the Exotic Racing Team vehicle"}
                camera-controls
                auto-rotate
                rotation-per-second="12deg"
                interaction-prompt="auto"
                shadow-intensity="1"
                exposure="1"
                environment-image="neutral"
                loading="eager"
                ar
              >
                <div slot="poster" className="model-pending">
                  <span className="model-pending-mark">3D</span>
                  <strong><T en="Vehicle model not uploaded yet" ar="لم يتم رفع نموذج المركبة بعد" /></strong>
                  <p><T en="Add the team’s verified exotic-racer.glb file to public/models/. Once present, drag to rotate and scroll or pinch to zoom." ar="أضف ملف exotic-racer.glb المعتمد للمركبة داخل public/models/. بعد إضافته، اسحب لتدوير النموذج واستخدم التمرير أو ضم الأصابع للتكبير." /></p>
                  <span className="placeholder-caption"><T en="WAITING FOR THE REAL VEHICLE ASSET" ar="في انتظار الملف الحقيقي للمركبة" /></span>
                </div>
              </model-viewer>
              <div className="model-controls-hint"><span>↔</span> <T en="Drag to rotate" ar="اسحب للتدوير" /> <span>⌕</span> <T en="Scroll / pinch to zoom" ar="مرّر أو ضم الأصابع للتكبير" /></div>
            </div>
          ) : (
            <div className="systems-list">
              {zones.map((zone) => <button type="button" key={zone.id} className={selectedZone.id === zone.id ? "system-select active" : "system-select"} onClick={() => setSelectedZone(zone)}><span className="system-select-dot" /><span>{rtl ? zone.arLabel : zone.label}</span><small><T en="UNAVAILABLE" ar="غير متاح" /></small></button>)}
            </div>
          )}
          {view === "3d" && zones.map((zone, index) => (
            <button type="button" key={zone.id} className={selectedZone.id === zone.id ? "vehicle-hotspot active" : "vehicle-hotspot"} style={{ left: zone.x + "%", top: zone.y + "%" }} onClick={() => setSelectedZone(zone)} aria-label={rtl ? `فحص ${zone.arLabel}` : `Inspect ${zone.label}`} aria-pressed={selectedZone.id === zone.id}>
              <span>{String(index + 1).padStart(2, "0")}</span><i />
            </button>
          ))}
          <div className="viewport-bottomline"><span><i /> <T en="LIVE MODEL FEED NOT CONFIGURED" ar="مصدر بيانات النموذج غير مُعد" /></span><span>ASSET: /models/exotic-racer.glb</span></div>
        </div>

        <aside className="vehicle-inspector" aria-live="polite">
          <div className="inspector-label"><T en="SELECTED SUBSYSTEM" ar="النظام المحدد" /></div>
          <div className="inspector-title"><span className="inspector-symbol">⌁</span><div><strong>{rtl ? selectedZone.arLabel : selectedZone.label}</strong><small><T en="Vehicle zone" ar="منطقة في المركبة" /> · {selectedZone.id.toUpperCase()}</small></div></div>
          <div className="inspector-status"><span className="status-dot grey" /> <T en="DATA UNAVAILABLE" ar="البيانات غير متاحة" /></div>
          <p className="inspector-description">{rtl ? selectedZone.arDetail : selectedZone.detail}</p>
          <div className="inspector-divider" />
          <div className="inspector-row"><span><T en="Telemetry source" ar="مصدر القراءات" /></span><strong><T en="Not mapped" ar="غير محدد" /></strong></div>
          <div className="inspector-row"><span><T en="Last update" ar="آخر تحديث" /></span><strong><T en="Never received" ar="لم يتم الاستقبال" /></strong></div>
          <div className="inspector-row"><span><T en="Fault status" ar="حالة الأعطال" /></span><strong><T en="Unknown" ar="غير معروفة" /></strong></div>
          <div className="inspector-note"><span>i</span><p><T en="Unknown does not mean healthy. Subsystem indicators will only reflect verified incoming data." ar="غير معروف لا تعني سليم. مؤشرات الأنظمة ستعتمد فقط على بيانات واردة تم التحقق منها." /></p></div>
        </aside>
      </div>
      <div className="vehicle-stage-footer"><span><i /> <T en="3D viewer supports drag rotation and zoom when the model asset is present" ar="عارض 3D يدعم التدوير والتكبير عند إضافة ملف النموذج" /></span><span><T en="GLB asset and verified sensor mapping pending" ar="في انتظار ملف GLB وربط المستشعرات الموثق" /></span></div>
    </section>
  );
}
