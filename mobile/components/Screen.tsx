import type { ReactNode } from "react";
import { ScrollView, StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../lib/theme";

export function Screen({ children }: { children: ReactNode }) {
  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <Text style={styles.eyebrow}>{children}</Text>;
}

export function Heading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <View style={styles.heading}>
      <Eyebrow>EXOTIC RACING · IAET</Eyebrow>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

export function Card({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Label({ children }: { children: ReactNode }) {
  return <Text style={styles.label}>{children}</Text>;
}

export function Value({ children, unit }: { children: ReactNode; unit?: string }) {
  return (
    <View style={styles.valueRow}>
      <Text style={styles.value}>{children}</Text>
      {unit ? <Text style={styles.unit}>{unit}</Text> : null}
    </View>
  );
}

export function Pill({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "accent" | "warning" }) {
  const color = tone === "accent" ? theme.colors.accent : tone === "warning" ? theme.colors.warning : theme.colors.muted;
  return <View style={[styles.pill, { borderColor: color + "66" }]}><Text style={[styles.pillText, { color }]}>{children}</Text></View>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: 20, paddingBottom: 34, gap: 16 },
  heading: { gap: 7, marginBottom: 4 },
  eyebrow: { color: theme.colors.accent, fontSize: 10, letterSpacing: 1.8, fontWeight: "800" },
  title: { color: theme.colors.text, fontSize: 30, fontWeight: "700", letterSpacing: -0.8 },
  subtitle: { color: theme.colors.muted, fontSize: 13, lineHeight: 19, maxWidth: 330 },
  card: { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderWidth: 1, borderRadius: theme.radius.card, padding: 16, gap: 12 },
  label: { color: theme.colors.muted, fontSize: 12, fontWeight: "600" },
  valueRow: { flexDirection: "row", alignItems: "baseline", gap: 6 },
  value: { color: theme.colors.text, fontSize: 26, fontWeight: "700", letterSpacing: -0.5 },
  unit: { color: theme.colors.subtle, fontSize: 12 },
  pill: { alignSelf: "flex-start", borderWidth: 1, borderRadius: theme.radius.pill, paddingHorizontal: 10, paddingVertical: 5 },
  pillText: { fontSize: 9, letterSpacing: 0.8, fontWeight: "800" },
});
