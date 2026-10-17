import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { Card, Heading, Pill, Screen } from "../../components/Screen";
import { useLocale } from "../../lib/i18n";
import { useTheme, type ThemeColors } from "../../lib/theme";

type Trip = {
  id: string;
  startedAt: string;
  endedAt: string | null;
  distanceKm: number | null;
  durationSeconds: number | null;
  energyWh: number | null;
  startSocPercent: number | null;
  endSocPercent: number | null;
  averageWhPerKm: number | null;
  status: "completed" | "in_progress" | "incomplete" | string;
};
type TripsResponse = {
  status?: string;
  message?: string;
  trips?: Trip[];
  summary?: { totalTrips: number; totalDistanceKm: number; totalEnergyWh: number } | null;
};

const formatNumber = (n: number | null | undefined, digits = 1) =>
  n == null || !Number.isFinite(n) ? "—" : n.toLocaleString(undefined, { maximumFractionDigits: digits });
const formatDuration = (n: number | null | undefined, tr: (en: string, ar: string) => string) => {
  if (n == null || !Number.isFinite(n) || n < 0) return "—";
  const total = Math.round(n);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  return hours ? tr(`${hours}h ${minutes}m`, `${hours} س ${minutes} د`) : tr(`${minutes} min`, `${minutes} دقيقة`);
};

export default function TripsScreen() {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const { tr, locale } = useLocale();
  const [result, setResult] = useState<TripsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const baseUrl = process.env.EXPO_PUBLIC_EVS_API_URL?.replace(/\/$/, "");

  const load = useCallback(async () => {
    if (!baseUrl) {
      setResult(null);
      setError(tr("Trip history server is not configured for this app.", "خادم سجل الرحلات غير مضبوط للتطبيق."));
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      try {
        const response = await fetch(`${baseUrl}/api/trips?vehicleId=exotic-racing-01`, {
          headers: { Accept: "application/json" },
          signal: controller.signal,
        });
        const body = await response.json() as TripsResponse;
        if (!response.ok || body.status !== "ok") {
          setResult(null);
          setError(response.status === 403
            ? tr("Trip history is protected until team sign-in and vehicle permissions are configured.", "سجل الرحلات محمي لحين إعداد تسجيل دخول الفريق وصلاحيات المركبة.")
            : (locale === "ar" ? "سجل الرحلات غير متاح من الخادم حاليًا." : body.message ?? "Trip history is currently unavailable."));
        } else {
          setResult(body);
        }
      } finally {
        clearTimeout(timeout);
      }
    } catch {
      setResult(null);
      setError(tr("Could not reach the trip-history server. Check the connection and retry.", "تعذر الوصول لخادم سجل الرحلات. تحقق من الاتصال وحاول مجددًا."));
    } finally {
      setLoading(false);
    }
  }, [baseUrl, locale, tr]);

  useEffect(() => { void load(); }, [load]);

  const summary = result?.summary;
  return (
    <Screen>
      <Heading
        title={tr("Trip history", "سجل الرحلات")}
        subtitle={tr("Completed vehicle runs, distance, duration and energy use from saved server records.", "الرحلات المسجلة والمسافة والمدة واستهلاك الطاقة من سجلات الخادم.")}
      />
      <View style={styles.summaryGrid}>
        <Card style={styles.summaryCard}><Text style={styles.metricLabel}>{tr("Completed trips", "الرحلات المكتملة")}</Text><Text style={styles.metricValue}>{summary ? formatNumber(summary.totalTrips, 0) : "—"}</Text></Card>
        <Card style={styles.summaryCard}><Text style={styles.metricLabel}>{tr("Total distance", "إجمالي المسافة")}</Text><Text style={styles.metricValue}>{summary ? formatNumber(summary.totalDistanceKm) : "—"} <Text style={styles.unit}>km</Text></Text></Card>
        <Card style={styles.summaryCard}><Text style={styles.metricLabel}>{tr("Energy used", "الطاقة المستهلكة")}</Text><Text style={styles.metricValue}>{summary ? formatNumber(summary.totalEnergyWh / 1000, 2) : "—"} <Text style={styles.unit}>kWh</Text></Text></Card>
      </View>
      <View style={[styles.sectionHeader, locale === "ar" && styles.rowRtl]}>
        <Text style={styles.sectionTitle}>{tr("Recorded runs", "الرحلات المسجلة")}</Text>
        <Pressable onPress={() => void load()} accessibilityRole="button" style={styles.refresh}><Text style={styles.refreshText}>{tr("Refresh ↻", "تحديث ↻")}</Text></Pressable>
      </View>
      {loading && !result ? <Card style={styles.center}><ActivityIndicator color={colors.accent} /><Text style={styles.muted}>{tr("Loading saved trips…", "جارٍ تحميل الرحلات المسجلة…")}</Text></Card> : null}
      {error ? <Card style={styles.notice}><Pill tone="warning">{tr("UNAVAILABLE", "غير متاح")}</Pill><Text style={styles.noticeText}>{error}</Text><Text style={styles.helper}>{tr("No demo trips are shown as real vehicle history.", "لن نعرض رحلات تجريبية على أنها سجل حقيقي للمركبة.")}</Text><Pressable onPress={() => void load()} style={styles.retry}><Text style={styles.retryText}>{tr("Try again", "حاول مجددًا")}</Text></Pressable></Card> : null}
      {!loading && !error && result && result.trips?.length === 0 ? <Card style={styles.center}><Text style={styles.emptyTitle}>{tr("No trips recorded yet", "لا توجد رحلات مسجلة بعد")}</Text><Text style={styles.muted}>{tr("Once a verified trip is saved by the vehicle system, it will appear here with its metrics.", "عند حفظ رحلة موثقة من نظام المركبة، ستظهر هنا ببياناتها.")}</Text></Card> : null}
      {result?.trips?.map((trip) => (
        <Card key={trip.id} style={styles.tripCard}>
          <View style={[styles.tripTop, locale === "ar" && styles.rowRtl]}>
            <View style={styles.tripHeading}><Text style={styles.tripDate}>{new Date(trip.startedAt).toLocaleString(locale === "ar" ? "ar-EG" : "en-US", { dateStyle: "medium", timeStyle: "short" })}</Text><Text style={styles.tripId}>{tr("Trip", "رحلة")} · {trip.id.slice(0, 8)}</Text></View>
            <Pill tone={trip.status === "completed" ? "accent" : "warning"}>{trip.status === "completed" ? tr("COMPLETED", "مكتملة") : trip.status === "in_progress" ? tr("IN PROGRESS", "جارية") : tr("INCOMPLETE", "غير مكتملة")}</Pill>
          </View>
          <View style={styles.metricsGrid}>
            <Metric label={tr("Distance", "المسافة")} value={formatNumber(trip.distanceKm)} unit="km" styles={styles} />
            <Metric label={tr("Duration", "المدة")} value={formatDuration(trip.durationSeconds, tr)} unit="" styles={styles} />
            <Metric label={tr("Energy", "الطاقة")} value={formatNumber(trip.energyWh == null ? null : trip.energyWh / 1000, 2)} unit="kWh" styles={styles} />
            <Metric label={tr("Efficiency", "الكفاءة")} value={formatNumber(trip.averageWhPerKm, 0)} unit="Wh/km" styles={styles} />
          </View>
          {trip.startSocPercent != null || trip.endSocPercent != null ? <Text style={styles.soc}>{tr("Charge", "الشحن")}: {formatNumber(trip.startSocPercent, 0)}% → {formatNumber(trip.endSocPercent, 0)}%</Text> : null}
        </Card>
      ))}
      <Text style={styles.footer}>{tr("Only server-recorded trips are displayed. No GPS or energy values are fabricated.", "يتم عرض الرحلات المسجلة على الخادم فقط، دون اختلاق بيانات GPS أو الطاقة.")}</Text>
    </Screen>
  );
}

function Metric({ label, value, unit, styles }: { label: string; value: string; unit: string; styles: ReturnType<typeof makeStyles> }) {
  return <View style={styles.metric}><Text style={styles.metricLabel}>{label}</Text><Text style={styles.metricValue}>{value}{unit ? <Text style={styles.unit}> {unit}</Text> : null}</Text></View>;
}

function makeStyles(colors: ThemeColors) { return StyleSheet.create({
  summaryGrid: { flexDirection: "row", flexWrap: "wrap", gap: 9 },
  summaryCard: { flexGrow: 1, flexBasis: "30%", minWidth: 94, padding: 12, gap: 7 },
  metricLabel: { color: colors.muted, fontSize: 10, lineHeight: 15 },
  metricValue: { color: colors.text, fontSize: 20, fontWeight: "800" },
  unit: { color: colors.subtle, fontSize: 10, fontWeight: "600" },
  sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 },
  rowRtl: { flexDirection: "row-reverse" },
  sectionTitle: { color: colors.text, fontSize: 16, fontWeight: "800" },
  refresh: { borderWidth: 1, borderColor: colors.border, borderRadius: 8, paddingVertical: 8, paddingHorizontal: 11 },
  refreshText: { color: colors.accent, fontSize: 11, fontWeight: "700" },
  center: { alignItems: "center", paddingVertical: 26 },
  muted: { color: colors.muted, fontSize: 12, lineHeight: 18, textAlign: "center" },
  notice: { borderColor: colors.warning + "66" },
  noticeText: { color: colors.text, fontSize: 13, lineHeight: 20 },
  helper: { color: colors.subtle, fontSize: 11, lineHeight: 17 },
  retry: { alignSelf: "flex-start", backgroundColor: colors.surfaceRaised, borderRadius: 7, paddingVertical: 9, paddingHorizontal: 13 },
  retryText: { color: colors.text, fontSize: 12, fontWeight: "700" },
  emptyTitle: { color: colors.text, fontSize: 15, fontWeight: "800" },
  tripCard: { gap: 14 },
  tripTop: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 10 },
  tripHeading: { flex: 1, gap: 4 },
  tripDate: { color: colors.text, fontSize: 13, fontWeight: "800" },
  tripId: { color: colors.subtle, fontSize: 10 },
  metricsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  metric: { flexGrow: 1, flexBasis: "40%", gap: 5 },
  soc: { color: colors.muted, fontSize: 11 },
  footer: { color: colors.subtle, fontSize: 10, lineHeight: 16, textAlign: "center", paddingHorizontal: 8 },
}); }
