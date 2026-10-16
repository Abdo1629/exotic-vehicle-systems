"use client";

import { useEffect, useState } from "react";
import type { VehicleTelemetrySnapshot } from "@/lib/telemetry/contracts";
import { T, useLocale } from "@/components/LocaleProvider";

type ApiResponse = {
  status: "connected" | "not_configured" | "unavailable" | "authorization_required" | "stale";
  vehicleId: string;
  data: VehicleTelemetrySnapshot | null;
  message?: string;
};

function displayMeasurement(measurement: { value: number; unit: string } | undefined) {
  if (!measurement || !Number.isFinite(measurement.value)) return "—";
  return `${measurement.value.toLocaleString(undefined, { maximumFractionDigits: 1 })}`;
}

export default function TelemetrySnapshot() {
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const { locale } = useLocale();

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const result = await fetch("/api/telemetry/latest", { cache: "no-store" });
        const body = (await result.json()) as ApiResponse;
        if (active) setResponse(body);
      } catch {
        if (active) setResponse({ status: "unavailable", vehicleId: "exotic-racing-01", data: null, message: "The telemetry API could not be reached." });
      }
    };
    void load();
    const interval = window.setInterval(() => void load(), 10000);
    return () => { active = false; window.clearInterval(interval); };
  }, []);

  const data = response?.data;
  const connected = response?.status === "connected" && !!data;
  const metrics = [
    { label: "State of charge", arLabel: "نسبة الشحن", value: connected ? displayMeasurement(data?.stateOfChargePercent) : "—", unit: data?.stateOfChargePercent?.unit ?? "%", note: connected ? data?.stateOfChargePercent?.source ?? "Waiting for verified BMS mapping" : "No current verified reading", arNote: connected ? data?.stateOfChargePercent?.source ?? "في انتظار مصدر BMS موثّق" : "لا توجد قراءة حالية موثّقة", icon: "▤" },
    { label: "Battery voltage", arLabel: "جهد البطارية", value: connected ? displayMeasurement(data?.batteryVoltageV) : "—", unit: data?.batteryVoltageV?.unit ?? "V", note: connected ? data?.batteryVoltageV?.source ?? "Waiting for voltage source" : "No current verified reading", arNote: connected ? data?.batteryVoltageV?.source ?? "في انتظار مصدر الجهد" : "لا توجد قراءة حالية موثّقة", icon: "ϟ" },
    { label: "Battery temperature", arLabel: "حرارة البطارية", value: connected ? displayMeasurement(data?.batteryTemperatureC) : "—", unit: data?.batteryTemperatureC?.unit ?? "°C", note: connected ? data?.batteryTemperatureC?.source ?? "Waiting for mapped temperature sensor" : "No current verified reading", arNote: connected ? data?.batteryTemperatureC?.source ?? "في انتظار مستشعر حرارة موثّق" : "لا توجد قراءة حالية موثّقة", icon: "♨" },
    { label: "Vehicle connection", arLabel: "اتصال العربية", value: connected ? "Connected" : "Offline", arValue: connected ? "متصلة" : "غير متصلة", unit: connected ? "Telemetry received" : "No verified feed", arUnit: connected ? "تم استقبال بيانات" : "لا يوجد مصدر موثّق", note: connected ? `Updated ${new Date(data.receivedAt).toLocaleTimeString(locale === "ar" ? "ar-EG" : "en-US")}` : "Connection state only; motion unknown", arNote: "حالة الاتصال فقط؛ الحركة غير معروفة", icon: "⌁" },
  ];

  return (
    <>
      <section className="notice" aria-label="Telemetry integration status">
        <div className="notice-icon">i</div>
        <div className="notice-copy">
          <strong>{connected ? <T en="Vehicle data received" ar="تم استقبال بيانات العربية" /> : <T en="Vehicle data source unavailable" ar="مصدر بيانات العربية غير متاح" />}</strong>
          <p>{response?.status === "authorization_required" ? (locale === "ar" ? "قراءات العربية محمية؛ يلزم إعداد تسجيل الدخول وصلاحيات الفريق قبل عرضها." : "Telemetry reads are protected until sign-in and team permissions are configured.") : response?.message ?? (connected ? (locale === "ar" ? "القيم التالية من مصدر القياس المتصل." : "Values below are from the configured telemetry provider.") : (locale === "ar" ? "ستظهر القراءات بعد إعداد مصدر أجهزة موثّق." : "Live values appear after a verified hardware adapter is configured."))}</p>
        </div>
        <span className="notice-tag">{connected ? <T en="SOURCE CONNECTED" ar="المصدر متصل" /> : <T en="AWAITING SOURCE" ar="في انتظار المصدر" />}</span>
      </section>
      <section className="section-block" aria-labelledby="telemetry-heading">
        <div className="section-heading">
          <div><h2 id="telemetry-heading"><T en="Telemetry snapshot" ar="ملخص القراءات" /></h2><p><T en="Latest values from the configured vehicle data source" ar="أحدث القيم من مصدر بيانات العربية" /></p></div>
          <span className="updated-label"><span className={connected ? "status-dot" : "status-dot grey"} /> {connected ? <T en="Source connected" ar="المصدر متصل" /> : <T en="No current feed" ar="لا توجد قراءات حالية" />}</span>
        </div>
        <div className="metrics-grid">
          {metrics.map((metric) => (
            <article className="metric-card" key={metric.label}>
              <div className="metric-top"><span><T en={metric.label} ar={metric.arLabel} /></span><span className="mark" aria-hidden="true">{metric.icon}</span></div>
              <div className="metric-value">{locale === "ar" && "arValue" in metric ? metric.arValue : metric.value}</div>
              <div className="metric-unit">{locale === "ar" && "arUnit" in metric ? metric.arUnit : metric.unit}</div>
              <div className="metric-foot"><span className="metric-foot-line" />{locale === "ar" ? metric.arNote : metric.note}</div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
