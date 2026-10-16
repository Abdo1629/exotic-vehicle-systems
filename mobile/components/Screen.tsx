import type { ReactNode } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme, type ThemeColors } from "../lib/theme";
import { useLocale } from "../lib/i18n";

export function Screen({ children }: { children: ReactNode }) {
  const { colors, mode, toggle: toggleTheme } = useTheme();
  const styles = makeStyles(colors);
  const { locale, toggle, tr } = useLocale();
  const rtl = locale === "ar";
  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={[styles.appHeader, rtl && styles.rowRtl]}>
        <View style={[styles.brandGroup, rtl && styles.rowRtl]}>
          <View style={styles.brandMark}><Text style={styles.brandGlyph}>EVS</Text></View>
          <View style={styles.brandCopy}>
            <Text style={styles.brandTitle}>EXOTIC RACING</Text>
            <Text style={styles.brandSubtitle}>{tr("IAET · VEHICLE SYSTEMS", "IAET · أنظمة المركبة")}</Text>
          </View>
        </View>
        <View style={[styles.headerActions, rtl && styles.rowRtl]}>
          <View style={[styles.connectionPill, rtl && styles.rowRtl]}><View style={styles.offlineDot} /><Text style={styles.connectionText}>{tr("OFFLINE", "غير متصلة")}</Text></View>
          <Pressable onPress={toggleTheme} accessibilityRole="button" accessibilityLabel={mode === "dark" ? tr("Switch to light mode", "التبديل إلى الوضع الفاتح") : tr("Switch to dark mode", "التبديل إلى الوضع الداكن")} style={styles.languageButton}>
            <Text style={styles.languageText}>{mode === "dark" ? "☼" : "☾"}</Text>
          </Pressable>
          <Pressable onPress={toggle} accessibilityRole="button" accessibilityLabel={tr("Switch language", "تغيير اللغة")} style={styles.languageButton}>
            <Text style={styles.languageText}>{rtl ? "EN" : "عربي"}</Text>
          </Pressable>
        </View>
      </View>
      <ScrollView contentContainerStyle={[styles.content, rtl && styles.rtlContent]} showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  return <Text style={styles.eyebrow}>{children}</Text>;
}

export function Heading({ title, subtitle }: { title: string; subtitle: string }) {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const { locale, tr } = useLocale();
  return (
    <View style={[styles.heading, locale === "ar" && styles.textRtl]}>
      <Eyebrow>{tr("EXOTIC RACING · IAET", "إكزوتك ريسينج · المعهد")}</Eyebrow>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

export function Card({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Label({ children }: { children: ReactNode }) {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  return <Text style={styles.label}>{children}</Text>;
}

export function Value({ children, unit }: { children: ReactNode; unit?: string }) {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  return (
    <View style={styles.valueRow}>
      <Text style={styles.value}>{children}</Text>
      {unit ? <Text style={styles.unit}>{unit}</Text> : null}
    </View>
  );
}

export function Pill({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "accent" | "warning" }) {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const color = tone === "accent" ? colors.accent : tone === "warning" ? colors.warning : colors.muted;
  return <View style={[styles.pill, { borderColor: color + "66" }]}><Text style={[styles.pillText, { color }]}>{children}</Text></View>;
}

function makeStyles(colors: ThemeColors) { return StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  appHeader: { minHeight: 66, paddingHorizontal: 17, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10, backgroundColor: colors.surface },
  brandGroup: { flexDirection: "row", alignItems: "center", gap: 9, flexShrink: 1 },
  brandMark: { width: 36, height: 36, borderRadius: 9, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surfaceRaised, alignItems: "center", justifyContent: "center" },
  brandGlyph: { color: colors.accent, fontWeight: "900", fontSize: 10, letterSpacing: 1 },
  brandCopy: { gap: 3, flexShrink: 1 },
  brandTitle: { color: colors.text, fontWeight: "800", fontSize: 10, letterSpacing: 1 },
  brandSubtitle: { color: colors.subtle, fontSize: 8 },
  headerActions: { flexDirection: "row", alignItems: "center", gap: 7 },
  connectionPill: { flexDirection: "row", alignItems: "center", gap: 5, borderWidth: 1, borderColor: colors.border, borderRadius: 99, paddingHorizontal: 8, paddingVertical: 6 },
  offlineDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.warning },
  connectionText: { color: colors.muted, fontSize: 8, fontWeight: "800" },
  languageButton: { minHeight: 32, minWidth: 39, alignItems: "center", justifyContent: "center", borderRadius: 8, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 8 },
  languageText: { color: colors.text, fontSize: 11, fontWeight: "800" },
  content: { padding: 20, paddingBottom: 34, gap: 16 },
  rtlContent: { direction: "rtl" },
  rowRtl: { flexDirection: "row-reverse" },
  textRtl: { alignItems: "stretch" },
  heading: { gap: 7, marginBottom: 4 },
  eyebrow: { color: colors.accent, fontSize: 10, letterSpacing: 1.2, fontWeight: "700" },
  title: { color: colors.text, fontSize: 27, fontWeight: "700", letterSpacing: -0.4, textAlign: "auto" },
  subtitle: { color: colors.muted, fontSize: 13, lineHeight: 20, maxWidth: 360, textAlign: "auto" },
  card: { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 9, padding: 16, gap: 12 },
  label: { color: colors.muted, fontSize: 12, fontWeight: "600" },
  valueRow: { flexDirection: "row", alignItems: "baseline", gap: 6 },
  value: { color: colors.text, fontSize: 26, fontWeight: "700", letterSpacing: -0.5 },
  unit: { color: colors.subtle, fontSize: 12 },
  pill: { alignSelf: "flex-start", borderWidth: 1, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5 },
  pillText: { fontSize: 9, letterSpacing: 0.8, fontWeight: "800" },
});
}
