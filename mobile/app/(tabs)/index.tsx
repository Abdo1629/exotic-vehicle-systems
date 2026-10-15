import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { Card, Eyebrow, Heading, Label, Pill, Screen, Value } from "../../components/Screen";
import { theme } from "../../lib/theme";

const metrics = [
  { label: "State of charge", value: "—", unit: "Not connected" },
  { label: "Battery voltage", value: "—", unit: "V · unavailable" },
  { label: "Battery temperature", value: "—", unit: "°C · unavailable" },
  { label: "Motor controller", value: "—", unit: "No verified feed" },
];

export default function OverviewScreen() {
  return (
    <Screen>
      <Heading title="Vehicle overview." subtitle="The team's mobile engineering companion. Live data will appear after a verified hardware connection." />
      <Card style={styles.hero}>
        <View style={styles.heroTop}>
          <View style={styles.brandMark}><Text style={styles.brandGlyph}>EX</Text></View>
          <View style={{ flex: 1, gap: 3 }}>
            <Eyebrow>VEHICLE 01</Eyebrow>
            <Text style={styles.heroTitle}>Exotic Racer</Text>
          </View>
          <Pill>OFFLINE</Pill>
        </View>
        <View style={styles.divider} />
        <Text style={styles.heroMessage}>Connection status only. Vehicle motion and safety state are unknown.</Text>
        <View style={styles.assetLine}><View style={styles.dot} /><Text style={styles.assetText}>No vehicle gateway configured</Text></View>
      </Card>
      <View style={styles.sectionTitle}><Text style={styles.sectionHeading}>Telemetry snapshot</Text><Pill>NO LIVE DATA</Pill></View>
      <View style={styles.grid}>
        {metrics.map((item) => (
          <Card key={item.label} style={styles.metric}>
            <Label>{item.label}</Label>
            <Value>{item.value}</Value>
            <Text style={styles.metricUnit}>{item.unit}</Text>
          </Card>
        ))}
      </View>
      <Card>
        <View style={styles.rowBetween}><Text style={styles.cardTitle}>Integration readiness</Text><Pill tone="warning">NOT SET UP</Pill></View>
        <Text style={styles.body}>The dashboard is ready for a data source contract, but no BMS or controller interface has been verified.</Text>
        <Link href="/diagnostics" style={styles.link}>Review diagnostics →</Link>
      </Card>
      <Text style={styles.footer}>EVS MOBILE · ENGINEERING PREVIEW · NO COMMANDS ENABLED</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { padding: 18, backgroundColor: theme.colors.surfaceRaised },
  heroTop: { flexDirection: "row", alignItems: "center", gap: 12 },
  brandMark: { width: 42, height: 42, borderRadius: 13, backgroundColor: "#1D3D48", borderColor: "#37626A", borderWidth: 1, alignItems: "center", justifyContent: "center" },
  brandGlyph: { color: theme.colors.accent, fontWeight: "900", fontSize: 12, letterSpacing: 1 },
  heroTitle: { color: theme.colors.text, fontSize: 21, fontWeight: "700" },
  divider: { height: 1, backgroundColor: theme.colors.border, marginVertical: 14 },
  heroMessage: { color: theme.colors.muted, fontSize: 13, lineHeight: 19 },
  assetLine: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 4 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: theme.colors.warning },
  assetText: { color: theme.colors.subtle, fontSize: 11 },
  sectionTitle: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 4 },
  sectionHeading: { color: theme.colors.text, fontSize: 16, fontWeight: "700" },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  metric: { width: "48%", flexGrow: 1, minHeight: 124, padding: 13, gap: 9 },
  metricUnit: { color: theme.colors.subtle, fontSize: 10 },
  rowBetween: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 },
  cardTitle: { color: theme.colors.text, fontSize: 14, fontWeight: "700" },
  body: { color: theme.colors.muted, fontSize: 12, lineHeight: 19 },
  link: { color: theme.colors.accent, fontWeight: "700", fontSize: 12, paddingTop: 3 },
  footer: { color: theme.colors.subtle, textAlign: "center", fontSize: 9, letterSpacing: 1.1, marginTop: 8 },
});
