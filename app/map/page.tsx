"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import { T, useLocale } from "@/components/LocaleProvider";

type ApiResponse = {
  status?: string; message?: string;
  data?: {
    latitude?: { value: number; quality: string };
    longitude?: { value: number; quality: string };
    speedKph?: { value: number; quality: string };
  } | null;
};

export default function LiveMapPage() {
  const { locale } = useLocale();
  const [snapshot, setSnapshot] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const response = await fetch("/api/telemetry/latest?vehicleId=exotic-racing-01", { cache: "no-store" });
        const body = await response.json() as ApiResponse;
        if (alive) setSnapshot(body);
      } catch { if (alive) setSnapshot({ status: "unavailable" }); }
      finally { if (alive) setLoading(false); }
    };
    void load();
    const timer = window.setInterval(load, 15000);
    return () => { alive = false; window.clearInterval(timer); };
  }, []);
  const lat = snapshot?.data?.latitude;
  const lon = snapshot?.data?.longitude;
  const hasCoordinates = snapshot?.status === "connected" && lat?.quality === "verified" && lon?.quality === "verified" &&
    Number.isFinite(lat.value) && Number.isFinite(lon.value) && Math.abs(lat.value) <= 90 && Math.abs(lon.value) <= 180;
  let mapUrl: string | null = null;
  if (hasCoordinates && lat && lon) {
    const params = new URLSearchParams({ bbox: [lon.value - 0.004, lat.value - 0.003, lon.value + 0.004, lat.value + 0.003].join(","), layer: "mapnik", marker: lat.value + "," + lon.value });
    mapUrl = "https://www.openstreetmap.org/export/embed.html?" + params.toString();
  }
  return <AppShell active="map" title="Live map"><div className="content">
    <div className="page-intro"><div><p className="eyebrow"><span className="eyebrow-line" /> <T en="POSITION & CONNECTIVITY" ar="الموقع والاتصال" /></p><h1><T en="Live vehicle map" ar="خريطة موقع المركبة" /><span className="title-period">.</span></h1><p className="subtitle"><T en="The map updates only from verified GPS coordinates received from the vehicle gateway." ar="لا تُحدَّث الخريطة إلا باستخدام إحداثيات GPS موثّقة تصل من بوابة اتصال المركبة." /></p></div><span className="health-badge neutral">{loading ? (locale === "ar" ? "جارٍ التحقق" : "CHECKING") : hasCoordinates ? (locale === "ar" ? "موقع موثّق" : "VERIFIED GPS") : (locale === "ar" ? "الموقع غير متاح" : "LOCATION UNAVAILABLE")}</span></div>
    <div className="map-layout">
      <section className="panel-card"><div className="panel-heading"><div><h2><T en="Vehicle position" ar="موقع المركبة" /></h2><p><T en="OpenStreetMap · GPS source required" ar="OpenStreetMap · يتطلب مصدر GPS" /></p></div><span className="panel-icon">⌖</span></div>
        {mapUrl ? <iframe className="map-frame" title={locale === "ar" ? "خريطة موقع المركبة" : "Vehicle location map"} src={mapUrl} loading="lazy" referrerPolicy="no-referrer" /> : <div className="map-placeholder"><div><span className="panel-icon">⌖</span><strong><T en="No verified location available" ar="لا يتوفر موقع موثّق للمركبة" /></strong><p><T en="The system will not place a fake marker. Authorize telemetry access and provide valid GPS coordinates from the vehicle gateway." ar="لن يعرض النظام موقعًا افتراضيًا مضللًا. يلزم تفعيل صلاحية الوصول إلى بيانات المركبة واستقبال إحداثيات GPS صحيحة من بوابة الاتصال." /></p></div></div>}
        <div className="panel-footer"><span><T en="Location is sensitive data; team authorization must be enabled before production use." ar="بيانات الموقع حساسة؛ يجب تفعيل صلاحيات أعضاء الفريق قبل الاستخدام الفعلي." /></span></div>
      </section>
      <div className="map-side"><section className="panel-card"><div className="panel-heading"><div><h2><T en="Position details" ar="تفاصيل الموقع" /></h2><p><T en="Latest accepted GPS fix" ar="أحدث إحداثيات GPS مقبولة" /></p></div></div><div className="health-list">
        <div className="health-row"><span className="health-symbol">N</span><div><strong><T en="Latitude" ar="خط العرض" /></strong><small>{hasCoordinates && lat ? lat.value.toFixed(6) : "—"}</small></div></div>
        <div className="health-row"><span className="health-symbol">E</span><div><strong><T en="Longitude" ar="خط الطول" /></strong><small>{hasCoordinates && lon ? lon.value.toFixed(6) : "—"}</small></div></div>
        <div className="health-row"><span className="health-symbol">↗</span><div><strong><T en="Speed" ar="السرعة" /></strong><small>{hasCoordinates && snapshot?.data?.speedKph ? snapshot.data.speedKph.value + " km/h" : "—"}</small></div></div>
      </div></section>
      <section className="notice"><div className="notice-icon">i</div><div className="notice-copy"><strong><T en="Connection status" ar="حالة الاتصال" /></strong><p>{loading ? (locale === "ar" ? "جارٍ طلب أحدث قراءة." : "Requesting the latest snapshot.") : (snapshot?.message || (locale === "ar" ? "لم تصل بيانات موقع حتى الآن." : "No location data received yet."))}</p></div></section>
      <p className="subtitle"><T en="Automatic refresh every 15 seconds while this page is open." ar="تُحدَّث البيانات تلقائيًا كل 15 ثانية ما دامت الصفحة مفتوحة." /></p></div>
    </div>
  </div></AppShell>;
}
