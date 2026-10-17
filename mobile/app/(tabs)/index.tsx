import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Card, Eyebrow, Heading, Label, Pill, Screen, Value } from "../../components/Screen";
import { useTheme, type ThemeColors } from "../../lib/theme";
import { useLocale } from "../../lib/i18n";
import { fetchLatestTelemetry, type TelemetryApiResponse } from "../../lib/api";
import { VehiclePreview3D } from "../../components/VehiclePreview3D";

function reading(value: number | undefined, digits = 1) {
  return typeof value === "number" && Number.isFinite(value) ? value.toLocaleString(undefined, { maximumFractionDigits: digits }) : "—";
}

export default function OverviewScreen() {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const { tr, locale } = useLocale();
  const [response, setResponse] = useState<TelemetryApiResponse | null>(null);
  useEffect(() => {
    let active = true;
    const load = async () => {
      const result = await fetchLatestTelemetry();
      if (active) setResponse(result);
    };
    void load();
    const timer = setInterval(() => void load(), 10000);
    return () => { active = false; clearInterval(timer); };
  }, []);
  const data = response?.data;
  const connected = response?.status === "connected" && data?.connection === "connected";
  const stale = response?.status === "stale";
  const chargerConnection = connected && data?.chargerConnected ? (data.chargerConnected.value === "connected" ? tr("Connected", "متصل") : tr("Disconnected", "غير متصل")) : tr("Unknown", "غير معروفة");
  const metrics = [
    { label: tr("State of charge", "نسبة الشحن"), value: connected ? reading(data?.stateOfChargePercent?.value) : "—", unit: connected ? data?.stateOfChargePercent?.unit ?? "%" : tr("No live data", "لا توجد بيانات مباشرة") },
    { label: tr("Battery voltage", "جهد البطارية"), value: connected ? reading(data?.batteryVoltageV?.value, 2) : "—", unit: connected ? data?.batteryVoltageV?.unit ?? "V" : tr("Unavailable", "غير متاح") },
    { label: tr("Battery temperature", "حرارة البطارية"), value: connected ? reading(data?.batteryTemperatureC?.value) : "—", unit: connected ? data?.batteryTemperatureC?.unit ?? "°C" : tr("Unavailable", "غير متاح") },
    { label: tr("Vehicle speed", "سرعة المركبة"), value: connected ? reading(data?.speedKph?.value) : "—", unit: connected ? data?.speedKph?.unit ?? "km/h" : tr("Unavailable", "غير متاحة") },
  ];
  return (
    <Screen>
      <Heading title={tr("Vehicle overview", "ملخص المركبة")} subtitle={tr("Understand the latest confirmed information and what needs attention.", "اعرف آخر المعلومات المؤكدة وإيه اللي محتاج متابعة.")} />
      <Card style={styles.hero}>
        <View style={[styles.heroTop, locale === "ar" && styles.rowRtl]}>
          <View style={styles.brandMark}><Image source={require("../../../public/logo.jpeg")} style={styles.brandImage} accessibilityLabel="Exotic Vehicle Systems logo" /></View>
          <View style={{ flex: 1, gap: 3 }}>
            <Eyebrow>{tr("TEAM VEHICLE", "مركبة الفريق")}</Eyebrow>
            <Text style={styles.heroTitle}>{tr("Exotic Racer", "مركبة إكزوتك")}</Text>
          </View>
          <Pill tone={connected ? "accent" : "warning"}>{connected ? tr("ONLINE", "متصلة") : stale ? tr("STALE DATA", "بيانات قديمة") : tr("OFFLINE", "غير متصلة")}</Pill>
        </View>
        <View style={styles.divider} />
        <Text style={[styles.heroMessage, locale === "ar" && styles.textRtl]}>{connected ? tr("The gateway reports a connection. This is not a safety certification.", "وحدة الاتصال بتبلغ عن اتصال، وده مش اعتماد لسلامة المركبة.") : stale ? tr("The latest snapshot is too old to represent the current vehicle state. Live values are withheld.", "آخر قراءة قديمة ومش بتعبّر عن حالة المركبة الحالية؛ تم إخفاء القراءات المباشرة.") : tr("Movement and safety state are unknown. Connection status alone cannot confirm the car is stopped.", "حالة الحركة والسلامة غير معروفة. حالة الاتصال وحدها لا تثبت إن المركبة متوقفة.")}</Text>
        <View style={[styles.assetLine, locale === "ar" && styles.rowRtl]}><View style={[styles.dot, connected && styles.connectedDot]} /><Text style={styles.assetText}>{connected ? tr("Latest gateway snapshot received", "تم استقبال أحدث بيانات من وحدة الاتصال") : stale ? tr("Last snapshot is stale", "آخر قراءة قديمة") : tr("No current verified gateway data", "لا توجد بيانات حالية موثّقة من وحدة الاتصال")}</Text></View>
        {response?.message && !connected ? <Text style={[styles.assetText, locale === "ar" && styles.textRtl]}>{locale === "ar" ? "الاتصال بالخادم أو مصدر البيانات غير متاح حاليًا." : response.message}</Text> : null}
        {data?.receivedAt ? <Text style={styles.timestamp}>{tr("Last server receipt", "آخر استقبال على الخادم")}: {new Date(data.receivedAt).toLocaleString(locale === "ar" ? "ar-EG" : "en-US")}</Text> : null}
        <View style={[styles.chargingRow, locale === "ar" && styles.rowRtl]}><Text style={styles.assetText}>{tr("Charger connection", "اتصال الشاحن")}</Text><Pill>{chargerConnection}</Pill></View>
      </Card>
      <VehiclePreview3D />
      <View style={[styles.sectionTitle, locale === "ar" && styles.rowRtl]}><Text style={styles.sectionHeading}>{tr("Telemetry snapshot", "ملخص القراءات")}</Text>{connected ? <Pill>{tr("LIVE SOURCE", "مصدر مباشر")}</Pill> : <Pill>{tr("NO LIVE DATA", "لا توجد بيانات مباشرة")}</Pill>}</View>
      <View style={styles.grid}>
        {metrics.map((item) => <Card key={item.label} style={styles.metric}><Label>{item.label}</Label><Value>{item.value}</Value><Text style={styles.metricUnit}>{item.unit}</Text></Card>)}
      </View>
      <Card>
        <View style={[styles.rowBetween, locale === "ar" && styles.rowRtl]}><Text style={styles.cardTitle}>{tr("Next step", "الخطوة التالية")}</Text><Pill tone="warning">{tr("NEEDS SETUP", "يحتاج تجهيز")}</Pill></View>
        <Text style={[styles.body, locale === "ar" && styles.textRtl]}>{tr("Confirm the exact battery BMS and motor controller models before selecting a gateway or SIM-connected data path.", "لازم نحدد موديل نظام البطارية BMS ووحدة التحكم في المحرك قبل اختيار وحدة الاتصال أو مسار بيانات بشريحة SIM.")}</Text>
        <Link href="/diagnostics" style={styles.link}>{tr("Review integration checklist →", "راجع قائمة تجهيز الربط ←")}</Link>
      </Card>
      <Text style={styles.footer}>{tr("EVS MOBILE · LIVE DATA NOT CONNECTED", "EVS موبايل · البيانات المباشرة غير متصلة")}</Text>
    </Screen>
  );
}

function makeStyles(colors: ThemeColors) { return StyleSheet.create({
  hero: { padding: 18, backgroundColor: colors.surfaceRaised },
  heroTop: { flexDirection: "row", alignItems: "center", gap: 12 },
  rowRtl: { flexDirection: "row-reverse" },
  textRtl: { textAlign: "right" },
  brandMark: { width: 42, height: 42, borderRadius: 13, backgroundColor: colors.surfaceRaised, borderColor: colors.border, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  brandImage: { width: "100%", height: "100%" },
  heroTitle: { color: colors.text, fontFamily: "Cairo_400Regular", fontSize: 21, fontWeight: "700" },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 14 },
  heroMessage: { color: colors.muted, fontFamily: "Cairo_400Regular", fontSize: 13, lineHeight: 20 },
  assetLine: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 4 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.warning },
  connectedDot: { backgroundColor: colors.blue },
  assetText: { color: colors.subtle, fontSize: 11, lineHeight: 16 },
  timestamp: { color: colors.subtle, fontSize: 10, marginTop: 3 },
  chargingRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10, marginTop: 6 },
  sectionTitle: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 4, gap: 8 },
  sectionHeading: { color: colors.text, fontFamily: "Cairo_400Regular", fontSize: 16, fontWeight: "700" },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  metric: { width: "48%", flexGrow: 1, minHeight: 124, padding: 13, gap: 9 },
  metricUnit: { color: colors.subtle, fontSize: 10 },
  rowBetween: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 },
  cardTitle: { color: colors.text, fontSize: 14, fontWeight: "700" },
  body: { color: colors.muted, fontSize: 12, lineHeight: 19 },
  link: { color: colors.accent, fontWeight: "700", fontSize: 12, paddingTop: 3 },
  footer: { color: colors.subtle, textAlign: "center", fontSize: 9, letterSpacing: 0.5, marginTop: 8 },
});
}
