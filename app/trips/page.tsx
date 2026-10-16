"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import { T, useLocale } from "@/components/LocaleProvider";

type Trip = { id: string; startedAt: string; endedAt: string | null; distanceKm: number | null; durationSeconds: number | null; energyWh: number | null; startSocPercent: number | null; endSocPercent: number | null; averageWhPerKm: number | null; status: "completed" | "in_progress" | "incomplete" };
type ApiResponse = { status?: string; message?: string; trips?: Trip[]; summary?: { totalTrips: number; totalDistanceKm: number; totalEnergyWh: number } };
const number = (value: number | null | undefined, digits = 1) => value == null || !Number.isFinite(value) ? "—" : value.toLocaleString(undefined, { maximumFractionDigits: digits });

export default function TripHistoryPage() {
  const { locale } = useLocale();
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let alive = true;
    fetch("/api/trips?vehicleId=exotic-racing-01", { cache: "no-store" })
      .then(async response => {
        const body = await response.json() as ApiResponse;
        return { ...body, status: response.status === 403 ? "authorization_required" : body.status };
      })
      .then(data => { if (alive) setResult(data); })
      .catch(() => { if (alive) setResult({ status: "unavailable" }); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);
  const trips = result?.trips ?? [];
  const summary = result?.summary;
  const date = (value: string | null) => value ? new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-GB", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)) : (locale === "ar" ? "رحلة مستمرة" : "In progress");
  const duration = (seconds: number | null) => seconds == null ? "—" : Math.floor(seconds / 3600) + "h " + Math.floor(seconds % 3600 / 60) + "m";
  const protectedAccess = result?.status === "authorization_required";
  return <AppShell active="trips" title="Trip history"><div className="content">
    <div className="page-intro"><div><p className="eyebrow"><span className="eyebrow-line" /> <T en="ENERGY & JOURNEY ANALYTICS" ar="تحليل الرحلات والطاقة" /></p><h1><T en="Trip history" ar="سجل الرحلات" /><span className="title-period">.</span></h1><p className="subtitle"><T en="Review each recorded drive, its distance, duration and measured energy consumption." ar="راجع كل رحلة مسجّلة ومسافتها ومدتها واستهلاك الطاقة المقاس خلالها." /></p></div><span className="health-badge neutral">{loading ? (locale === "ar" ? "جارٍ التحميل" : "LOADING") : trips.length + " " + (locale === "ar" ? "رحلة" : "TRIPS")}</span></div>
    <div className="trip-stat-grid">
      <article className="trip-stat"><span><T en="Recorded trips" ar="عدد الرحلات المسجّلة" /></span><strong>{summary ? number(summary.totalTrips, 0) : "—"}</strong><small><T en="Stored records only" ar="السجلات المحفوظة فقط" /></small></article>
      <article className="trip-stat"><span><T en="Total distance" ar="إجمالي المسافة" /></span><strong>{summary ? number(summary.totalDistanceKm) : "—"} <small>km</small></strong><small><T en="Requires valid odometer or GPS distance" ar="يتطلب عدّاد مسافة أو GPS موثوقًا" /></small></article>
      <article className="trip-stat"><span><T en="Energy consumed" ar="الطاقة المستهلكة" /></span><strong>{summary ? number(summary.totalEnergyWh / 1000, 2) : "—"} <small>kWh</small></strong><small><T en="Calculated from measured voltage and current" ar="تُحسب من الجهد والتيار المقاسين" /></small></article>
    </div>
    <section className="panel-card"><div className="panel-heading"><div><h2><T en="Recorded journeys" ar="الرحلات المسجّلة" /></h2><p><T en="Energy values are shown only when recorded by the data system" ar="لا تظهر قيم الطاقة إلا إذا سجّلها نظام البيانات" /></p></div><span className="panel-icon">↗</span></div>
      {trips.length ? <div className="trip-table-wrap"><table className="trip-table"><thead><tr><th><T en="Started" ar="وقت البدء" /></th><th><T en="Duration" ar="المدة" /></th><th><T en="Distance" ar="المسافة" /></th><th><T en="Energy" ar="الطاقة" /></th><th><T en="Efficiency" ar="معدل الاستهلاك" /></th><th><T en="Battery" ar="البطارية" /></th></tr></thead><tbody>{trips.map(trip=><tr key={trip.id}><td>{date(trip.startedAt)}</td><td>{duration(trip.durationSeconds)}</td><td>{number(trip.distanceKm)} km</td><td>{trip.energyWh == null ? "—" : number(trip.energyWh / 1000, 3) + " kWh"}</td><td>{trip.averageWhPerKm == null ? "—" : number(trip.averageWhPerKm) + " Wh/km"}</td><td>{trip.startSocPercent == null || trip.endSocPercent == null ? "—" : number(trip.startSocPercent, 0) + "% → " + number(trip.endSocPercent, 0) + "%"}</td></tr>)}</tbody></table></div> : <div className="trip-empty"><span className="panel-icon">↗</span><strong><T en={protectedAccess ? "Trip history access is protected" : "No saved trips yet"} ar={protectedAccess ? "الوصول إلى سجل الرحلات محمي" : "لا توجد رحلات محفوظة حتى الآن"} /></strong><p>{loading ? (locale === "ar" ? "جارٍ تحميل السجلات المحفوظة." : "Loading stored records.") : protectedAccess ? (locale === "ar" ? "يلزم تفعيل تسجيل الدخول وصلاحيات أعضاء الفريق قبل عرض بيانات الرحلات وموقع المركبة." : "Team sign-in and vehicle permissions must be enabled before trip and location data can be shown.") : (result?.message || (locale === "ar" ? "لن تُنشأ رحلات تجريبية. سيظهر السجل بعد تطبيق ترحيل قاعدة البيانات وتوصيل مصدر قياس حقيقي." : "No demo trips are fabricated. History will appear after the database migration is applied and a real measurement source is connected."))}</p></div>}
      <div className="panel-footer"><span><T en="No sample values are generated or presented as real vehicle data." ar="لا تُنشأ قيم تجريبية ولا تُعرض على أنها بيانات حقيقية للمركبة." /></span></div>
    </section>
  </div></AppShell>;
}
