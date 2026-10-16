"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { T, useLocale } from "@/components/LocaleProvider";
import VehicleModelStage from "@/components/vehicle/VehicleModelStage";

type Measurement = { value: number; unit: string; quality?: string; measuredAt?: string };
type Snapshot = { stateOfChargePercent?: Measurement; batteryVoltageV?: Measurement; batteryCurrentA?: Measurement; batteryTemperatureC?: Measurement; speedKph?: Measurement; latitude?: Measurement; longitude?: Measurement; odometerKm?: Measurement; receivedAt?: string };
type TelemetryResponse = { status?: string; message?: string; data?: Snapshot | null };
type Trip = { id: string; startedAt: string; endedAt: string | null; durationSeconds: number | null; distanceKm: number | null; energyWh: number | null; averageWhPerKm: number | null; status: string };
type TripsResponse = { status?: string; message?: string; trips?: Trip[]; summary?: { totalTrips: number; totalDistanceKm: number; totalEnergyWh: number } | null };
const measurement = (value?: Measurement) => value && Number.isFinite(value.value) ? value.value.toLocaleString(undefined, { maximumFractionDigits: 1 }) : "—";

export default function OverviewDashboard() {
  const { locale } = useLocale();
  const [telemetry, setTelemetry] = useState<TelemetryResponse | null>(null);
  const [tripResult, setTripResult] = useState<TripsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    const load = async () => {
      const results = await Promise.allSettled([
        fetch("/api/telemetry/latest?vehicleId=exotic-racing-01", { cache: "no-store" }).then(r => r.json() as Promise<TelemetryResponse>),
        fetch("/api/trips?vehicleId=exotic-racing-01", { cache: "no-store" }).then(async r => {
          const body = await r.json() as TripsResponse;
          return { ...body, status: r.status === 403 ? "authorization_required" : body.status };
        })
      ]);
      if (!active) return;
      setTelemetry(results[0].status === "fulfilled" ? results[0].value : { status: "unavailable" });
      setTripResult(results[1].status === "fulfilled" ? results[1].value : { status: "unavailable" });
      setLoading(false);
    };
    void load();
    const timer = window.setInterval(() => void load(), 20000);
    return () => { active = false; window.clearInterval(timer); };
  }, []);
  const connected = telemetry?.status === "connected" && !!telemetry.data;
  const data = telemetry?.data;
  const hasMap = connected && data?.latitude?.quality === "verified" && data?.longitude?.quality === "verified" && Number.isFinite(data.latitude.value) && Number.isFinite(data.longitude.value) && Math.abs(data.latitude.value) <= 90 && Math.abs(data.longitude.value) <= 180;
  const mapUrl = hasMap && data?.latitude && data.longitude ? "https://maps.google.com/maps?q=" + data.latitude.value + "," + data.longitude.value + "&z=15&output=embed" : null;
  const trips = tripResult?.trips ?? [];
  const summary = tripResult?.summary;
  const protectedTrips = tripResult?.status === "authorization_required";
  const fmt = (value: number | null | undefined, digits = 1) => value == null || !Number.isFinite(value) ? "—" : value.toLocaleString(locale === "ar" ? "ar-EG" : "en-GB", { maximumFractionDigits: digits });
  const date = (value: string) => new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-GB", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
  const duration = (seconds: number | null) => seconds == null ? "—" : locale === "ar" ? Math.floor(seconds / 3600) + " س " + Math.floor(seconds % 3600 / 60) + " د" : Math.floor(seconds / 3600) + "h " + Math.floor(seconds % 3600 / 60) + "m";

  return <div className="content overview-content">
    <section className="welcome-row">
      <div><div className="eyebrow"><span className="eyebrow-line" /> <T en="TEAM VEHICLE / OVERVIEW" ar="مركبة الفريق / لوحة المعلومات" /></div>
        <h1><T en="Vehicle overview" ar="لوحة معلومات المركبة" /><span className="title-period">.</span></h1>
        <p className="subtitle"><T en="One place for vehicle status, live position, trip history, battery and engineering records." ar="عرض موحّد لحالة المركبة وموقعها وسجل رحلاتها والبطارية والسجلات الهندسية." /></p></div>
      <div className="vehicle-state"><span className="state-symbol">↗</span><div><span><T en="VEHICLE STATUS" ar="حالة المركبة" /></span><strong>{loading ? <T en="Checking connection" ar="جارٍ التحقق من الاتصال" /> : connected ? <T en="Connected" ar="متصلة بالنظام" /> : <T en="Not connected" ar="غير متصلة بالنظام" />}</strong><small>{connected ? <T en="Latest verified telemetry available" ar="تتوفر أحدث بيانات القياس الموثّقة" /> : <T en="Movement and safety state unknown" ar="حالة الحركة والسلامة غير معروفة" />}</small></div></div>
    </section>
    <VehicleModelStage />
    <section className="overview-metrics" aria-label={locale === "ar" ? "ملخص بيانات المركبة" : "Vehicle summary"}>
      <article className="overview-metric"><span className="overview-metric-icon">▤</span><div><small><T en="Battery charge" ar="نسبة شحن البطارية" /></small><strong>{connected ? measurement(data?.stateOfChargePercent) : "—"}<em>{connected && data?.stateOfChargePercent ? "%" : ""}</em></strong><span>{connected ? <T en="Verified reading" ar="قراءة موثّقة" /> : <T en="No live reading" ar="لا توجد قراءة مباشرة" />}</span></div></article>
      <article className="overview-metric"><span className="overview-metric-icon">ϟ</span><div><small><T en="Battery voltage" ar="جهد البطارية" /></small><strong>{connected ? measurement(data?.batteryVoltageV) : "—"}<em>{connected && data?.batteryVoltageV ? " V" : ""}</em></strong><span><T en="Latest accepted value" ar="أحدث قيمة مقبولة" /></span></div></article>
      <article className="overview-metric"><span className="overview-metric-icon">♨</span><div><small><T en="Battery temperature" ar="درجة حرارة البطارية" /></small><strong>{connected ? measurement(data?.batteryTemperatureC) : "—"}<em>{connected && data?.batteryTemperatureC ? " °C" : ""}</em></strong><span><T en="Sensor required" ar="تتطلب مستشعرًا موثّقًا" /></span></div></article>
      <article className="overview-metric"><span className="overview-metric-icon">↗</span><div><small><T en="Recorded journeys" ar="الرحلات المسجّلة" /></small><strong>{summary ? fmt(summary.totalTrips, 0) : "—"}</strong><span>{protectedTrips ? <T en="Sign-in required" ar="يتطلب تسجيل الدخول" /> : <T en="Saved trip records" ar="سجلات الرحلات المحفوظة" />}</span></div></article>
    </section>
    <div className="overview-main-grid">
      <section className="panel-card overview-map-card"><div className="panel-heading"><div><h2><T en="Live map" ar="الخريطة المباشرة" /></h2><p><T en="Latest verified GPS position" ar="أحدث موقع موثّق عبر GPS" /></p></div><Link className="text-link" href="/map"><T en="Open map ↗" ar="عرض الخريطة ↗" /></Link></div>
        {mapUrl ? <iframe className="overview-map-frame" title={locale === "ar" ? "موقع المركبة على الخريطة" : "Vehicle live map"} src={mapUrl} loading="lazy" referrerPolicy="no-referrer" /> : <div className="overview-map-empty"><span className="overview-empty-icon">⌖</span><strong><T en="Live location unavailable" ar="الموقع المباشر غير متاح" /></strong><p><T en="The map will show a marker when verified GPS data is received. No location is fabricated." ar="سيظهر موقع المركبة عند استقبال إحداثيات GPS موثّقة. لا يعرض النظام موقعًا افتراضيًا." /></p><Link className="text-link" href="/map"><T en="View map status ↗" ar="عرض حالة الخريطة ↗" /></Link></div>}
        <div className="panel-footer"><span>{connected && hasMap ? <T en="GPS coordinates verified" ar="تم التحقق من إحداثيات GPS" /> : <T en="Waiting for a verified GPS source" ar="في انتظار مصدر GPS موثّق" />}</span><span className="health-badge neutral">{hasMap ? <T en="GPS READY" ar="GPS متاح" /> : <T en="NO GPS" ar="لا توجد بيانات GPS" />}</span></div>
      </section>
      <section className="panel-card overview-trips-card"><div className="panel-heading"><div><h2><T en="Trip history" ar="سجل الرحلات" /></h2><p><T en="Distance, duration and energy use" ar="المسافة والمدة واستهلاك الطاقة" /></p></div><Link className="text-link" href="/trips"><T en="All trips ↗" ar="جميع الرحلات ↗" /></Link></div>
        <div className="trip-summary-row"><div><small><T en="Total distance" ar="إجمالي المسافة" /></small><strong>{summary ? fmt(summary.totalDistanceKm) : "—"} <em>km</em></strong></div><div><small><T en="Total energy" ar="إجمالي الطاقة" /></small><strong>{summary ? fmt(summary.totalEnergyWh / 1000, 2) : "—"} <em>kWh</em></strong></div></div>
        {trips.length > 0 ? <div className="overview-trip-list">{trips.slice(0, 4).map(trip => <Link href="/trips" className="overview-trip-row" key={trip.id}><span className="overview-trip-symbol">↗</span><span className="overview-trip-info"><strong>{date(trip.startedAt)}</strong><small>{duration(trip.durationSeconds)} · {fmt(trip.distanceKm)} km</small></span><span className="overview-trip-energy">{trip.energyWh == null ? "—" : fmt(trip.energyWh / 1000, 2) + " kWh"}<small>{trip.averageWhPerKm == null ? "—" : fmt(trip.averageWhPerKm) + " Wh/km"}</small></span></Link>)}</div> : <div className="overview-map-empty compact"><span className="overview-empty-icon">↗</span><strong>{protectedTrips ? <T en="Trip history is protected" ar="سجل الرحلات محمي" /> : <T en="No saved journeys yet" ar="لا توجد رحلات محفوظة بعد" />}</strong><p>{protectedTrips ? <T en="Team sign-in and permissions are required to view records." ar="يلزم تسجيل الدخول وتفعيل صلاحيات الفريق لعرض السجلات." /> : <T en="Saved journeys will appear here after the vehicle data source and trip recording are configured." ar="ستظهر الرحلات المسجّلة هنا بعد إعداد مصدر بيانات المركبة ونظام تسجيل الرحلات." />}</p></div>}
        <div className="panel-footer"><span><T en="Measured values only · No sample trips" ar="بيانات مقاسة فقط · دون رحلات تجريبية" /></span></div>
      </section>
    </div>
    <div className="overview-secondary-grid">
      <section className="panel-card"><div className="panel-heading"><div><h2><T en="Vehicle systems" ar="أنظمة المركبة" /></h2><p><T en="Quick readiness summary" ar="ملخص الجاهزية" /></p></div><Link className="text-link" href="/diagnostics"><T en="Details ↗" ar="التفاصيل ↗" /></Link></div>
        <div className="health-list">
          <div className="health-row"><span className="health-symbol">◉</span><div><strong><T en="Vehicle gateway" ar="بوابة اتصال المركبة" /></strong><small>{connected ? <T en="Telemetry feed available" ar="مصدر بيانات القياس متاح" /> : <T en="No verified adapter" ar="لا يوجد وسيط اتصال موثّق" />}</small></div><span className="health-badge neutral">{connected ? <T en="CONNECTED" ar="متصل" /> : <T en="WAITING" ar="في الانتظار" />}</span></div>
          <div className="health-row"><span className="health-symbol">▤</span><div><strong><T en="Battery & charging" ar="البطارية والشحن" /></strong><small>{connected && data?.stateOfChargePercent ? <T en="Charge value received" ar="تم استقبال نسبة الشحن" /> : <T en="Readings unavailable" ar="القراءات غير متاحة" />}</small></div><Link className="text-link" href="/battery"><T en="Open" ar="فتح" /></Link></div>
          <div className="health-row"><span className="health-symbol">✓</span><div><strong><T en="Pre-test checklist" ar="قائمة ما قبل الاختبار" /></strong><small><T en="Review before every test session" ar="راجعها قبل كل جلسة اختبار" /></small></div><Link className="text-link" href="/checklist"><T en="Open" ar="فتح" /></Link></div>
        </div>
      </section>
      <section className="panel-card"><div className="panel-heading"><div><h2><T en="Engineering workspace" ar="مساحة العمل الهندسية" /></h2><p><T en="Shortcuts to the rest of the system" ar="اختصارات بقية أقسام النظام" /></p></div></div>
        <div className="overview-shortcuts">
          <Link href="/tests"><span>◷</span><div><strong><T en="Test sessions" ar="جلسات الاختبار" /></strong><small><T en="Test notes and outcomes" ar="ملاحظات الاختبار ونتائجه" /></small></div><b>↗</b></Link>
          <Link href="/logbook"><span>☷</span><div><strong><T en="Engineering logbook" ar="السجل الهندسي" /></strong><small><T en="Maintenance and component changes" ar="الصيانة وتغييرات المكوّنات" /></small></div><b>↗</b></Link>
          <Link href="/diagnostics"><span>⌁</span><div><strong><T en="Diagnostics" ar="تشخيص الأنظمة" /></strong><small><T en="Connection and data quality" ar="الاتصال وجودة البيانات" /></small></div><b>↗</b></Link>
        </div>
      </section>
    </div>

    <footer className="footer"><span>EVS <span className="footer-dot">·</span> Exotic Racing Team IAET</span><span><T en="Engineering workspace · Not safety-certified" ar="منظومة هندسية · غير معتمدة كمنظومة سلامة" /></span></footer>
  </div>;
}
