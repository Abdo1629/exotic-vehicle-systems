import { StyleSheet, Text, View } from "react-native";
import { Card, Heading, Pill, Screen } from "../../components/Screen";
import { useTheme, type ThemeColors } from "../../lib/theme";
import { useLocale } from "../../lib/i18n";

export default function DiagnosticsScreen() {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const { tr, locale } = useLocale();
  const checks = [
    { name: tr("Vehicle gateway", "وحدة الاتصال بالمركبة"), state: tr("NOT CONFIGURED", "غير مُعدة"), detail: tr("No verified gateway or hardware adapter is connected.", "لا توجد وحدة اتصال أو وسيط أجهزة تم التحقق منه.") },
    { name: tr("Telemetry source", "مصدر القراءات"), state: tr("UNAVAILABLE", "غير متاح"), detail: tr("No battery or controller readings have been received.", "لم يتم استقبال قراءات من البطارية أو وحدة التحكم.") },
    { name: tr("Data freshness", "حداثة البيانات"), state: tr("UNKNOWN", "غير معروفة"), detail: tr("Freshness cannot be assessed without timestamps.", "لا يمكن تقييم حداثة البيانات من غير طوابع زمنية.") },
    { name: tr("Remote operations", "العمليات عن بُعد"), state: tr("DISABLED", "معطّلة"), detail: tr("No vehicle commands are implemented in this app.", "لا توجد أوامر تحكم بالمركبة منفذة في التطبيق.") },
  ];
  return (
    <Screen>
      <Heading title={tr("System diagnostics", "تشخيص النظام")} subtitle={tr("Connection readiness and data quality. These checks do not certify the vehicle as safe.", "جاهزية الاتصال وجودة البيانات. الفحوصات دي لا تعتمد سلامة المركبة.")} />
      {checks.map((item, index) => (
        <Card key={item.name}>
          <View style={[styles.row, locale === "ar" && styles.rowRtl]}>
            <View style={styles.number}><Text style={styles.numberText}>{String(index + 1).padStart(2, "0")}</Text></View>
            <View style={[styles.content, locale === "ar" && styles.textRtl]}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.detail}>{item.detail}</Text>
              <Pill tone={index === 3 ? "warning" : "neutral"}>{item.state}</Pill>
            </View>
          </View>
        </Card>
      ))}
      <Card style={styles.infoCard}>
        <Text style={styles.infoTitle}>{tr("Important distinction", "فرق مهم")}</Text>
        <Text style={[styles.infoBody, locale === "ar" && styles.textRtl]}>{tr("Offline does not mean stopped. Unknown does not mean healthy. Missing readings are never replaced with zero or estimated values.", "غير متصلة لا تعني متوقفة. وغير معروف لا تعني سليم. القراءات المفقودة لا يتم استبدالها بصفر أو قيم تقديرية.")}</Text>
      </Card>
    </Screen>
  );
}

function makeStyles(colors: ThemeColors) { return StyleSheet.create({
  row: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  rowRtl: { flexDirection: "row-reverse" },
  textRtl: { alignItems: "stretch" },
  number: { width: 36, height: 36, borderRadius: 11, backgroundColor: colors.surfaceRaised, alignItems: "center", justifyContent: "center" },
  numberText: { color: colors.accent, fontSize: 11, fontWeight: "800" },
  content: { flex: 1, gap: 8 },
  name: { color: colors.text, fontFamily: "Cairo_400Regular", fontWeight: "700", fontSize: 14 },
  detail: { color: colors.muted, fontFamily: "Cairo_400Regular", fontSize: 12, lineHeight: 18 },
  infoCard: { borderColor: colors.border, backgroundColor: colors.surfaceRaised, marginTop: 4 },
  infoTitle: { color: colors.warning, fontWeight: "700", fontSize: 13 },
  infoBody: { color: colors.muted, fontFamily: "Cairo_400Regular", fontSize: 12, lineHeight: 19 },
});
}
