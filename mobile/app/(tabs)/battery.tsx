import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Card, Heading, Label, Pill, Screen, Value } from "../../components/Screen";
import { useTheme, type ThemeColors } from "../../lib/theme";
import { useLocale } from "../../lib/i18n";
import { fetchLatestTelemetry, type TelemetryApiResponse } from "../../lib/api";

export default function BatteryScreen() {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const { tr, locale } = useLocale();
  const [response, setResponse] = useState<TelemetryApiResponse | null>(null);
  useEffect(() => {
    let active = true;
    const load = async () => { const result = await fetchLatestTelemetry(); if (active) setResponse(result); };
    void load();
    const timer = setInterval(() => void load(), 10000);
    return () => { active = false; clearInterval(timer); };
  }, []);
  const data = response?.data;
  const connected = response?.status === "connected" && data?.connection === "connected";
  const readings = [
    { label: tr("State of charge", "نسبة الشحن"), value: connected ? data?.stateOfChargePercent?.value : undefined, unit: "%" },
    { label: tr("Pack voltage", "جهد البطارية"), value: connected ? data?.batteryVoltageV?.value : undefined, unit: "V" },
    { label: tr("Current", "التيار"), value: connected ? data?.batteryCurrentA?.value : undefined, unit: "A" },
    { label: tr("Temperature", "درجة الحرارة"), value: connected ? data?.batteryTemperatureC?.value : undefined, unit: "°C" },
  ];
  const checks = [
    tr("Identify the exact BMS model and documented interface.", "حدد موديل الـBMS وواجهة الاتصال الموثقة بدقة."),
    tr("Confirm measurement units, scaling and timestamps.", "تحقق من وحدات القياس ومعامل التحويل والطوابع الزمنية."),
    tr("Record the current sign convention and sensor locations.", "وثّق طريقة تحديد اتجاه التيار ومواقع المستشعرات."),
    tr("Validate disconnect and invalid-packet handling on a safe bench setup.", "اختبر التعامل مع انقطاع الاتصال والبيانات غير الصحيحة على منصة اختبار آمنة."),
  ];
  return (
    <Screen>
      <Heading title={tr("Battery & charging", "البطارية والشحن")} subtitle={tr("Known battery label details and measurements still required from a verified source.", "معلومات ملصق البطارية والقياسات التي نحتاجها من مصدر موثّق.")} />
      <Card style={styles.packCard}>
        <View style={[styles.packHeader, locale === "ar" && styles.rowRtl]}><Text style={styles.batteryIcon}>ϟ</Text><View style={{ flex: 1, gap: 4 }}><Text style={styles.packTitle}>{tr("LiFePO₄ battery", "بطارية LiFePO₄")}</Text><Text style={styles.packSub}>Smart App Series · Marine</Text></View><Pill>{tr("NAMEPLATE", "بيانات الملصق")}</Pill></View>
        <View style={[styles.specRow, locale === "ar" && styles.rowRtl]}><Text style={styles.specLabel}>{tr("Rated voltage", "الجهد الاسمي")}</Text><Text style={styles.specValue}>24 V</Text></View>
        <View style={[styles.specRow, locale === "ar" && styles.rowRtl]}><Text style={styles.specLabel}>{tr("Rated capacity", "السعة الاسمية")}</Text><Text style={styles.specValue}>80 Ah</Text></View>
        <Text style={[styles.note, locale === "ar" && styles.textRtl]}>{tr("These are nameplate specifications only, not live voltage, remaining charge or a charging estimate.", "دي مواصفات الملصق فقط، مش الجهد الحالي أو الشحن المتبقي أو تقدير وقت الشحن.")}</Text>
      </Card>
      <View style={[styles.sectionHeading, locale === "ar" && styles.rowRtl]}><Text style={styles.sectionTitle}>{tr("Live readings", "القراءات المباشرة")}</Text><Pill tone={connected ? "accent" : "neutral"}>{connected ? tr("LIVE SOURCE", "مصدر مباشر") : tr("UNAVAILABLE", "غير متاحة")}</Pill></View>
      <View style={styles.readingGrid}>
        {readings.map((item) => <Card key={item.label} style={styles.reading}><Label>{item.label}</Label><Value unit={item.unit}>{typeof item.value === "number" && Number.isFinite(item.value) ? item.value.toLocaleString(locale === "ar" ? "ar-EG" : "en-US", { maximumFractionDigits: 2 }) : "—"}</Value><Text style={styles.note}>{connected ? tr("Verified source", "مصدر موثّق") : tr("No current verified reading", "لا توجد قراءة حالية موثّقة")}</Text></Card>)}
      </View>
      {data?.receivedAt ? <Text style={styles.note}>{tr("Last server receipt", "آخر استقبال على الخادم")}: {new Date(data.receivedAt).toLocaleString(locale === "ar" ? "ar-EG" : "en-US")}</Text> : null}
      <Card>
        <Text style={styles.cardTitle}>{tr("Before connecting telemetry", "قبل ربط القراءات")}</Text>
        {checks.map((item, index) => <View style={[styles.checkRow, locale === "ar" && styles.rowRtl]} key={item}><Text style={styles.checkNumber}>{String(index + 1).padStart(2, "0")}</Text><Text style={[styles.checkText, locale === "ar" && styles.textRtl]}>{item}</Text></View>)}
      </Card>
    </Screen>
  );
}

function makeStyles(colors: ThemeColors) { return StyleSheet.create({
  packCard: { backgroundColor: colors.surfaceRaised },
  packHeader: { flexDirection: "row", alignItems: "center", gap: 11, marginBottom: 6 },
  rowRtl: { flexDirection: "row-reverse" },
  textRtl: { textAlign: "right" },
  batteryIcon: { color: colors.accent, fontSize: 30, width: 42, textAlign: "center" },
  packTitle: { color: colors.text, fontFamily: "Cairo_400Regular", fontSize: 17, fontWeight: "700" },
  packSub: { color: colors.muted, fontFamily: "Cairo_400Regular", fontSize: 11 },
  specRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderTopWidth: 1, borderTopColor: colors.border, paddingVertical: 12 },
  specLabel: { color: colors.muted, fontSize: 12 },
  specValue: { color: colors.text, fontSize: 18, fontWeight: "700" },
  note: { color: colors.subtle, fontSize: 11, lineHeight: 17, paddingTop: 4 },
  sectionHeading: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 3 },
  sectionTitle: { color: colors.text, fontFamily: "Cairo_400Regular", fontSize: 16, fontWeight: "700" },
  readingGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  reading: { width: "48%", flexGrow: 1, minHeight: 110, padding: 13, gap: 8 },
  cardTitle: { color: colors.text, fontWeight: "700", fontSize: 14, marginBottom: 4 },
  checkRow: { flexDirection: "row", alignItems: "flex-start", gap: 12, paddingVertical: 7 },
  checkNumber: { color: colors.accent, fontWeight: "800", fontSize: 11, paddingTop: 2 },
  checkText: { color: colors.muted, fontSize: 12, lineHeight: 18, flex: 1 },
});
}
