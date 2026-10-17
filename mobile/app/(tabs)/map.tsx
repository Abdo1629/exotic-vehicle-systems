import { useEffect, useState } from "react";
import MapView, { Marker, type Region } from "react-native-maps";
import { StyleSheet, Text, View } from "react-native";
import { Card, Heading, Pill, Screen } from "../../components/Screen";
import { fetchLatestTelemetry, type TelemetryApiResponse } from "../../lib/api";
import { useLocale } from "../../lib/i18n";
import { useTheme, type ThemeColors } from "../../lib/theme";

const fallbackRegion: Region = { latitude: 30.0444, longitude: 31.2357, latitudeDelta: 0.12, longitudeDelta: 0.12 };

export default function MapScreen() {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const { tr, locale } = useLocale();
  const [response, setResponse] = useState<TelemetryApiResponse | null>(null);
  useEffect(() => {
    let active = true;
    const load = async () => { const result = await fetchLatestTelemetry(); if (active) setResponse(result); };
    void load();
    const timer = setInterval(() => void load(), 15000);
    return () => { active = false; clearInterval(timer); };
  }, []);
  const latitude = response?.data?.latitude;
  const longitude = response?.data?.longitude;
  const verified = response?.status === "connected" && latitude?.quality === "verified" && longitude?.quality === "verified" && Number.isFinite(latitude.value) && Number.isFinite(longitude.value);
  const region = verified ? { ...fallbackRegion, latitude: latitude.value, longitude: longitude.value } : fallbackRegion;
  return (
    <Screen>
      <Heading title={tr("Live vehicle map", "خريطة موقع المركبة")} subtitle={tr("The map only shows a marker when the vehicle sends verified GPS coordinates.", "الخريطة تعرض marker فقط عند وصول إحداثيات GPS موثقة من المركبة.")} />
      <Card style={styles.mapCard}>
        <View style={[styles.mapHeader, locale === "ar" && styles.rowRtl]}><View><Text style={styles.mapTitle}>{tr("Vehicle position", "موقع المركبة")}</Text><Text style={styles.mapSub}>{verified ? tr("Verified GPS fix", "إحداثيات GPS موثقة") : tr("Waiting for verified GPS", "في انتظار GPS موثق")}</Text></View><Pill tone={verified ? "accent" : "warning"}>{verified ? tr("VERIFIED", "موثق") : tr("UNAVAILABLE", "غير متاح")}</Pill></View>
        <MapView style={styles.map} region={region} mapType="standard" showsCompass showsScale>
          {verified ? <Marker coordinate={{ latitude: latitude.value, longitude: longitude.value }} title={tr("Exotic Racer", "مركبة إكزوتك")} description={tr("Verified vehicle position", "موقع المركبة الموثق")} /> : null}
        </MapView>
        <Text style={styles.note}>{verified ? `${latitude.value.toFixed(6)}, ${longitude.value.toFixed(6)}` : tr("No marker is shown until the telemetry gateway provides valid coordinates.", "لن يظهر marker قبل أن توفر بوابة البيانات إحداثيات صحيحة.")}</Text>
      </Card>
    </Screen>
  );
}

function makeStyles(colors: ThemeColors) { return StyleSheet.create({
  mapCard: { padding: 0, overflow: "hidden" },
  mapHeader: { padding: 15, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 },
  rowRtl: { flexDirection: "row-reverse" },
  mapTitle: { color: colors.text, fontSize: 15, fontWeight: "800" },
  mapSub: { color: colors.muted, fontSize: 10, marginTop: 4 },
  map: { height: 360, width: "100%" },
  note: { color: colors.subtle, padding: 13, fontSize: 10, lineHeight: 16 },
}); }