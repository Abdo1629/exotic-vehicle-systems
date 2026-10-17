import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Card, Heading, Pill, Screen } from "../../components/Screen";
import { useTheme, type ThemeColors } from "../../lib/theme";
import { useLocale } from "../../lib/i18n";

const STORAGE_KEY = "evs.mobile.pretest-checklist.v1";
const checklist = [
  { id: "briefing", en: "Team briefing and roles agreed", ar: "تم الاتفاق على إحاطة الفريق والأدوار" },
  { id: "interlocks", en: "Safety interlocks and emergency stop checked by the responsible lead", ar: "تم فحص دوائر الأمان والإيقاف الطارئ بواسطة المسؤول المختص" },
  { id: "vehicle", en: "Body, wheels, fasteners and visible wiring inspected", ar: "تم فحص جسم المركبة والعجلات والمثبتات والتوصيلات الظاهرة" },
  { id: "battery", en: "Battery enclosure and charging equipment checked by an authorized member", ar: "تم فحص صندوق البطارية ومعدات الشحن بواسطة عضو مخوّل" },
  { id: "telemetry", en: "Gateway power, timestamps and data source checked", ar: "تم فحص تغذية وحدة الاتصال والطوابع الزمنية ومصدر البيانات" },
  { id: "abort", en: "Test area, communication plan and stop criteria agreed", ar: "تم الاتفاق على منطقة الاختبار وخطة التواصل ومعايير الإيقاف" },
];

export default function PitScreen() {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const { tr, locale } = useLocale();
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    void AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (!active || !raw) return;
      try { const parsed = JSON.parse(raw) as unknown; if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) setChecked(parsed as Record<string, boolean>); } catch {}
    }).catch(() => {}).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  useEffect(() => {
    if (!loading) void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(checked)).catch(() => {});
  }, [checked, loading]);
  const completed = useMemo(() => checklist.filter((item) => checked[item.id] === true).length, [checked]);
  return (
    <Screen>
      <Heading title={tr("Pit mode", "وضع الاختبار")} subtitle={tr("Align the team before a session. This is a workflow aid, not a safety certification.", "نظّم تجهيز الفريق قبل الجلسة. دي أداة تنظيم وليست اعتماد سلامة.")} />
      <Card style={styles.summary}>
        <View style={[styles.summaryRow, locale === "ar" && styles.rowRtl]}><View style={{ flex: 1, gap: 4 }}><Text style={styles.summaryTitle}>{tr("Pre-test readiness", "الاستعداد للاختبار")}</Text><Text style={styles.summarySub}>{tr("Complete each item only after it has been checked.", "علّم على كل بند بعد التحقق منه فقط.")}</Text></View><Text style={styles.count}>{completed}/{checklist.length}</Text></View>
        <View style={styles.track}><View style={[styles.fill, { width: `${completed / checklist.length * 100}%` }]} /></View>
      </Card>
      {checklist.map((item, index) => {
        const done = checked[item.id] === true;
        return <Pressable key={item.id} onPress={() => setChecked((prev) => ({ ...prev, [item.id]: !prev[item.id] }))} accessibilityRole="checkbox" accessibilityState={{ checked: done }} style={({ pressed }) => [styles.task, done && styles.taskDone, pressed && styles.pressed, locale === "ar" && styles.rowRtl]}>
          <View style={[styles.number, done && styles.numberDone]}><Text style={[styles.numberText, done && styles.numberTextDone]}>{done ? "✓" : String(index + 1).padStart(2, "0")}</Text></View>
          <View style={styles.taskCopy}><Text style={[styles.taskTitle, locale === "ar" && styles.textRtl]}>{tr(item.en, item.ar)}</Text><Text style={[styles.taskSub, locale === "ar" && styles.textRtl]}>{tr(done ? "Marked complete on this phone" : "Mark only after the responsible person verifies it", done ? "تم التأشير كمكتمل على الموبايل" : "لا تؤشر عليه إلا بعد تحقق الشخص المسؤول")}</Text></View>
          <Pill tone={done ? "accent" : "neutral"}>{tr(done ? "DONE" : "OPEN", done ? "تم" : "مفتوح")}</Pill>
        </Pressable>;
      })}
      <Card style={styles.warning}><Text style={styles.warningTitle}>{tr("Important", "مهم")}</Text><Text style={[styles.warningBody, locale === "ar" && styles.textRtl]}>{tr("Checklist progress is saved on this phone only and is not shared with the team. Follow the approved operating procedure and never use this list as the sole safety record.", "تقدم القائمة محفوظ على الموبايل فقط ومش بيتشارك مع الفريق. اتبع إجراءات التشغيل المعتمدة ولا تعتمد على القائمة دي كسجل السلامة الوحيد.")}</Text></Card>
    </Screen>
  );
}

function makeStyles(colors: ThemeColors) { return StyleSheet.create({
  summary: { backgroundColor: colors.surfaceRaised },
  summaryRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  rowRtl: { flexDirection: "row-reverse" },
  textRtl: { textAlign: "right" },
  summaryTitle: { color: colors.text, fontFamily: "Cairo_400Regular", fontSize: 15, fontWeight: "800" },
  summarySub: { color: colors.muted, fontFamily: "Cairo_400Regular", fontSize: 11, lineHeight: 17 },
  count: { color: colors.accent, fontSize: 23, fontWeight: "800" },
  track: { height: 5, borderRadius: 99, overflow: "hidden", backgroundColor: colors.border },
  fill: { height: "100%", backgroundColor: colors.accent, borderRadius: 99 },
  task: { flexDirection: "row", alignItems: "center", gap: 10, padding: 13, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 12 },
  taskDone: { borderColor: colors.accent + "77" },
  pressed: { opacity: 0.75 },
  number: { width: 34, height: 34, borderRadius: 10, alignItems: "center", justifyContent: "center", backgroundColor: colors.surfaceRaised, borderWidth: 1, borderColor: colors.border },
  numberDone: { backgroundColor: colors.accent + "20", borderColor: colors.accent },
  numberText: { color: colors.muted, fontSize: 10, fontWeight: "800" },
  numberTextDone: { color: colors.accent },
  taskCopy: { flex: 1, gap: 5 },
  taskTitle: { color: colors.text, fontFamily: "Cairo_400Regular", fontSize: 12, fontWeight: "700", lineHeight: 18 },
  taskSub: { color: colors.subtle, fontFamily: "Cairo_400Regular", fontSize: 10, lineHeight: 15 },
  warning: { backgroundColor: colors.surfaceRaised },
  warningTitle: { color: colors.warning, fontSize: 13, fontWeight: "800" },
  warningBody: { color: colors.muted, fontFamily: "Cairo_400Regular", fontSize: 11, lineHeight: 18 },
});
}
