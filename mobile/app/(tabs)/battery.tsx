import { StyleSheet, Text, View } from "react-native";
import { Card, Heading, Label, Pill, Screen, Value } from "../../components/Screen";
import { theme } from "../../lib/theme";

const readings = [
  { label: "State of charge", value: "—", unit: "%" },
  { label: "Pack voltage", value: "—", unit: "V" },
  { label: "Current", value: "—", unit: "A" },
  { label: "Temperature", value: "—", unit: "°C" },
];

export default function BatteryScreen() {
  return (
    <Screen>
      <Heading title="Battery & charging." subtitle="Known nameplate details and the measurements still required from a verified battery interface." />
      <Card style={styles.packCard}>
        <View style={styles.packHeader}><Text style={styles.batteryIcon}>ϟ</Text><View style={{ flex: 1, gap: 4 }}><Text style={styles.packTitle}>LiFePO₄ battery</Text><Text style={styles.packSub}>Smart App Series · Marine</Text></View><Pill>NAMEPLATE</Pill></View>
        <View style={styles.specRow}><Text style={styles.specLabel}>Rated voltage</Text><Text style={styles.specValue}>24 V</Text></View>
        <View style={styles.specRow}><Text style={styles.specLabel}>Rated capacity</Text><Text style={styles.specValue}>80 Ah</Text></View>
        <Text style={styles.note}>These are nameplate specifications only, not live voltage, remaining charge, or a charging estimate.</Text>
      </Card>
      <View style={styles.sectionHeading}><Text style={styles.sectionTitle}>Live readings</Text><Pill>UNAVAILABLE</Pill></View>
      <View style={styles.readingGrid}>
        {readings.map((item) => <Card key={item.label} style={styles.reading}><Label>{item.label}</Label><Value unit={item.unit}>{item.value}</Value></Card>)}
      </View>
      <Card>
        <Text style={styles.cardTitle}>Before connecting telemetry</Text>
        {[
          "Identify the exact BMS model and documented interface.",
          "Confirm measurement units, scaling, and timestamp behavior.",
          "Document the current sign convention and temperature sensor location.",
          "Test disconnect and invalid-packet handling on a safe bench setup.",
        ].map((item, index) => <View style={styles.checkRow} key={item}><Text style={styles.checkNumber}>{String(index + 1).padStart(2, "0")}</Text><Text style={styles.checkText}>{item}</Text></View>)}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  packCard: { backgroundColor: theme.colors.surfaceRaised },
  packHeader: { flexDirection: "row", alignItems: "center", gap: 11, marginBottom: 6 },
  batteryIcon: { color: theme.colors.accent, fontSize: 30, width: 42, textAlign: "center" },
  packTitle: { color: theme.colors.text, fontSize: 17, fontWeight: "700" },
  packSub: { color: theme.colors.muted, fontSize: 11 },
  specRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderTopWidth: 1, borderTopColor: theme.colors.border, paddingVertical: 12 },
  specLabel: { color: theme.colors.muted, fontSize: 12 },
  specValue: { color: theme.colors.text, fontSize: 18, fontWeight: "700" },
  note: { color: theme.colors.subtle, fontSize: 11, lineHeight: 17, paddingTop: 4 },
  sectionHeading: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 3 },
  sectionTitle: { color: theme.colors.text, fontSize: 16, fontWeight: "700" },
  readingGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  reading: { width: "48%", flexGrow: 1, minHeight: 96, padding: 13, gap: 8 },
  cardTitle: { color: theme.colors.text, fontWeight: "700", fontSize: 14, marginBottom: 4 },
  checkRow: { flexDirection: "row", alignItems: "flex-start", gap: 12, paddingVertical: 7 },
  checkNumber: { color: theme.colors.accent, fontWeight: "800", fontSize: 11, paddingTop: 2 },
  checkText: { color: theme.colors.muted, fontSize: 12, lineHeight: 18, flex: 1 },
});
