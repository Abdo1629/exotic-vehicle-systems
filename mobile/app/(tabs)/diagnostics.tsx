import { StyleSheet, Text, View } from "react-native";
import { Card, Heading, Pill, Screen } from "../../components/Screen";
import { theme } from "../../lib/theme";

const checks = [
  { name: "Vehicle gateway", state: "NOT CONFIGURED", detail: "No verified gateway or hardware adapter is connected." },
  { name: "Telemetry source", state: "UNAVAILABLE", detail: "No battery or controller readings have been received." },
  { name: "Data freshness", state: "UNKNOWN", detail: "Freshness cannot be assessed without timestamped measurements." },
  { name: "Remote operations", state: "DISABLED", detail: "No vehicle commands are implemented in this mobile app." },
];

export default function DiagnosticsScreen() {
  return (
    <Screen>
      <Heading title="System diagnostics." subtitle="Connection readiness and data quality. These checks do not certify the vehicle as safe." />
      {checks.map((item, index) => (
        <Card key={item.name}>
          <View style={styles.row}>
            <View style={styles.number}><Text style={styles.numberText}>{String(index + 1).padStart(2, "0")}</Text></View>
            <View style={styles.content}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.detail}>{item.detail}</Text>
              <Pill tone={index === 3 ? "warning" : "neutral"}>{item.state}</Pill>
            </View>
          </View>
        </Card>
      ))}
      <Card style={styles.infoCard}>
        <Text style={styles.infoTitle}>Important distinction</Text>
        <Text style={styles.infoBody}>Offline does not mean stopped. Unknown does not mean healthy. Missing readings are never replaced with zero or estimated values.</Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  number: { width: 36, height: 36, borderRadius: 11, backgroundColor: theme.colors.surfaceRaised, alignItems: "center", justifyContent: "center" },
  numberText: { color: theme.colors.accent, fontSize: 11, fontWeight: "800" },
  content: { flex: 1, gap: 8 },
  name: { color: theme.colors.text, fontWeight: "700", fontSize: 14 },
  detail: { color: theme.colors.muted, fontSize: 12, lineHeight: 18 },
  infoCard: { borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceRaised, marginTop: 4 },
  infoTitle: { color: theme.colors.warning, fontWeight: "700", fontSize: 13 },
  infoBody: { color: theme.colors.muted, fontSize: 12, lineHeight: 19 },
});
