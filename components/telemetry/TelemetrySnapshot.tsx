"use client";

import { useEffect, useState } from "react";
import type { VehicleTelemetrySnapshot } from "@/lib/telemetry/contracts";
import { T, useLocale } from "@/components/LocaleProvider";

type ApiResponse = {
  status: "connected" | "not_configured" | "unavailable" | "authorization_required";
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
    { label: "State of charge", arLabel: "نسبة الشحن", value: displayMeasurement(data?.stateOfChargePercent), unit: data?.stateOfChargePercent?.unit ?? "%", note: data?.stateOfChargePercent?.source ?? "Waiting for verified BMS mapping", arNote: "في انتظار مصدر BMS موثّق", icon: "▤" },
    { label: "Battery voltage", arLabel: "جهد البطارية", value: displayMeasurement(data?.batteryVoltageV), unit: data?.batteryVoltageV?.unit ?? "V", note: data?.batteryVoltageV?.source ?? "Waiting for voltage source", arNote: "في انتظار مصدر الجهد", icon: "ϟ" },
    { label: "Battery temperature", arLabel: "حرارة البطارية", value: displayMeasurement(data?.batteryTemperatureC), unit: data?.batteryTemperatureC?.unit ?? "°C", note: data?.batteryTemperatureC?.source ?? "Waiting for mapped temperature sensor", arNote: "في انتظار مستشعر حرارة موثّق", icon: "♨" },
    { label: "Vehicle connection", arLabel: "اتصال العربية", value: connected ? "Connected" : "Offline", arValue: connected ? "متصلة" : "غير متصلة", unit: connected ? "Telemetry received" : "No verified feed", arUnit: connected ? "تم استقبال بيانات" : "لا يوجد مصدر موثّق", note: connected ? `Updated ${new Date(data.receivedAt).toLocaleTimeString(locale === "ar" ? "ar-EG" : "en-US")}` : "Connection state only; motion unknown", arNote: "حالة الاتصال فقط؛ الحركة غير معروفة", icon: "⌁" },
  ];

  return (
    <>
      <section className="notice" aria-label="Telemetry integration status">
        <div className="notice-icon">i</div>
        <div className="notice-copy">
          <strong>{connected ? <T en="Vehicle data received" ar="تم استقبال بيانات العربية" /> : <T en="Vehicle data source unavailable" ar="مصدر بيانات العربية غير متاح" />}</strong>
          <p>{response?.message ?? (connected ? (locale === "ar" ? "القيم التالية من مصدر القياس المتصل." : "Values below are from the configured telemetry provider.") : (locale === "ar" ? "الواجهة متصلة بطبقة API؛ ستظهر القراءات بعد إعداد مصدر أجهزة موثّق." : "The dashboard is wired to the telemetry API. Live values appear after a verified hardware adapter is configured."))}</p>
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
