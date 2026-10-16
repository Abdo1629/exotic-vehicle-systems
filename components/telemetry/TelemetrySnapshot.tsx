"use client";

import { useEffect, useState } from "react";
import type { VehicleTelemetrySnapshot } from "@/lib/telemetry/contracts";

type ApiResponse = {
  status: "connected" | "not_configured" | "unavailable";
  vehicleId: string;
  data: VehicleTelemetrySnapshot | null;
  message?: string;
};

function displayMeasurement(
  measurement: { value: number; unit: string } | undefined,
  digits = 1,
) {
  if (!measurement || !Number.isFinite(measurement.value)) return "—";
  return `${measurement.value.toLocaleString(undefined, { maximumFractionDigits: digits })}`;
}

export default function TelemetrySnapshot() {
  const [response, setResponse] = useState<ApiResponse | null>(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const result = await fetch("/api/telemetry/latest", { cache: "no-store" });
        const body = (await result.json()) as ApiResponse;
        if (active) setResponse(body);
      } catch {
        if (active) {
          setResponse({
            status: "unavailable",
            vehicleId: "exotic-racing-01",
            data: null,
            message: "The telemetry API could not be reached.",
          });
        }
      }
    };

    void load();
    const interval = window.setInterval(() => void load(), 10000);
    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, []);

  const data = response?.data;
  const connected = response?.status === "connected" && !!data;
  const metrics = [
    {
      label: "State of charge",
      value: displayMeasurement(data?.stateOfChargePercent),
      unit: data?.stateOfChargePercent?.unit ?? "%",
      icon: "▤",
      note: data?.stateOfChargePercent?.source ?? "Waiting for verified BMS mapping",
      tone: "blue",
    },
    {
      label: "Battery voltage",
      value: displayMeasurement(data?.batteryVoltageV, 2),
      unit: data?.batteryVoltageV?.unit ?? "V",
      icon: "ϟ",
      note: data?.batteryVoltageV?.source ?? "Waiting for voltage source",
      tone: "cyan",
    },
    {
      label: "Battery temperature",
      value: displayMeasurement(data?.batteryTemperatureC),
      unit: data?.batteryTemperatureC?.unit ?? "°C",
      icon: "♨",
      note: data?.batteryTemperatureC?.source ?? "Waiting for mapped temperature sensor",
      tone: "amber",
    },
    {
      label: "Vehicle connection",
      value: connected ? "Connected" : "Offline",
      unit: connected ? "Telemetry received" : "No verified feed",
      icon: "⌁",
      note: connected ? `Updated ${new Date(data.receivedAt).toLocaleTimeString()}` : "Connection state only; motion unknown",
      tone: "muted",
    },
  ];

  return (
    <>
      <section className="notice" aria-label="Telemetry integration status">
        <div className="notice-icon">i</div>
        <div className="notice-copy">
          <strong>{connected ? "Vehicle telemetry connected" : "Vehicle data source not connected"}</strong>
          <p>{response?.message ?? (connected ? "Values below are from the configured telemetry provider." : "The dashboard is wired to the telemetry API. Live values appear after a verified GPS/BMS/controller adapter is configured.")}</p>
        </div>
        <span className="notice-tag">{connected ? "LIVE SOURCE" : "AWAITING SOURCE"}</span>
      </section>

      <section className="section-block" aria-labelledby="telemetry-heading">
        <div className="section-heading">
          <div>
            <h2 id="telemetry-heading">Telemetry snapshot</h2>
            <p>Latest values from the configured vehicle data source</p>
          </div>
          <span className="updated-label"><span className={connected ? "status-dot" : "status-dot grey"} /> {connected ? "Source connected" : "No readings received"}</span>
        </div>
        <div className="metrics-grid">
          {metrics.map((metric) => (
            <article className="metric-card" key={metric.label}>
              <div className="metric-top"><span>{metric.label}</span><span className="mark" aria-hidden="true">{metric.icon}</span></div>
              <div className={metric.tone === "muted" ? "metric-value status-value" : "metric-value"}>{metric.value}</div>
              <div className="metric-unit">{metric.unit}</div>
              <div className="metric-foot"><span className="metric-foot-line" />{metric.note}</div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
