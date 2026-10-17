import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { useLocale } from "../lib/i18n";
import { useTheme, type ThemeColors } from "../lib/theme";

export function VehiclePreview3D() {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const { tr } = useLocale();
  const rotation = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(Animated.timing(rotation, { toValue: 1, duration: 9000, useNativeDriver: true }));
    loop.start();
    return () => loop.stop();
  }, [rotation]);
  const rotateY = rotation.interpolate({ inputRange: [0, 1], outputRange: ["-7deg", "7deg"] });
  return (
    <View style={styles.card}>
      <View style={styles.header}><View><Text style={styles.eyebrow}>{tr("DIGITAL VEHICLE VIEW", "عرض المركبة الرقمي")}</Text><Text style={styles.title}>{tr("3D vehicle preview", "معاينة المركبة ثلاثية الأبعاد")}</Text></View><Text style={styles.status}>{tr("ASSET PENDING", "الملف قيد التجهيز")}</Text></View>
      <View style={styles.viewport}>
        <View style={styles.grid} />
        <Animated.View style={[styles.car, { transform: [{ perspective: 700 }, { rotateY }] }]}>
          <View style={styles.roof} /><View style={styles.cabin}><View style={styles.window} /></View><View style={styles.body}><View style={styles.light} /><View style={styles.light} /></View><View style={[styles.wheel, styles.wheelFront]} /><View style={[styles.wheel, styles.wheelRear]} />
        </Animated.View>
        <Text style={styles.caption}>{tr("Interactive rotation · verified GLB asset not uploaded", "تدوير تفاعلي · ملف GLB الموثق لم يُرفع بعد")}</Text>
      </View>
    </View>
  );
}

function makeStyles(colors: ThemeColors) { return StyleSheet.create({
  card: { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 12, overflow: "hidden" },
  header: { padding: 15, flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 10, borderBottomWidth: 1, borderBottomColor: colors.border },
  eyebrow: { color: colors.blue, fontFamily: "Manrope_500Medium", fontSize: 9, fontWeight: "800", letterSpacing: 1 },
  title: { color: colors.text, fontFamily: "Manrope_500Medium", fontSize: 16, fontWeight: "800", marginTop: 5 },
  status: { color: colors.warning, fontSize: 8, fontWeight: "800", letterSpacing: .6 },
  viewport: { height: 205, alignItems: "center", justifyContent: "center", backgroundColor: colors.background, overflow: "hidden" },
  grid: { ...StyleSheet.absoluteFill, opacity: .3, borderColor: colors.blue, borderWidth: 1, transform: [{ perspective: 500 }, { rotateX: "62deg" }, { scale: 1.7 }] },
  car: { width: 210, height: 90, alignItems: "center", justifyContent: "flex-end" },
  roof: { position: "absolute", top: 5, width: 92, height: 42, borderTopLeftRadius: 45, borderTopRightRadius: 45, backgroundColor: colors.surfaceRaised, borderWidth: 1, borderColor: colors.blue },
  cabin: { position: "absolute", top: 13, width: 78, height: 28, backgroundColor: colors.background, borderWidth: 1, borderColor: colors.blue, transform: [{ skewX: "-16deg" }] },
  window: { margin: 4, flex: 1, backgroundColor: colors.blue + "55" },
  body: { width: 190, height: 44, borderRadius: 22, backgroundColor: colors.accent + "cc", borderWidth: 1, borderColor: colors.accent, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20 },
  light: { width: 17, height: 7, borderRadius: 4, backgroundColor: colors.warning },
  wheel: { position: "absolute", bottom: -8, width: 29, height: 29, borderRadius: 15, backgroundColor: colors.background, borderWidth: 5, borderColor: colors.surfaceRaised },
  wheelFront: { right: 26 }, wheelRear: { left: 26 },
  caption: { position: "absolute", bottom: 12, color: colors.subtle, fontSize: 9 },
}); }