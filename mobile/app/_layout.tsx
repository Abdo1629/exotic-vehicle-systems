import { Stack } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Cairo_400Regular, Cairo_500Medium, Cairo_600SemiBold, Cairo_700Bold } from "@expo-google-fonts/cairo";
import { Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold } from "@expo-google-fonts/manrope";
import { useFonts } from "expo-font";
import { ActivityIndicator, Animated, Easing, Image, StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { LocaleProvider } from "../lib/i18n";
import { ThemeProvider, useTheme } from "../lib/theme";

function LoadingScreen() {
  const entrance = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0.94)).current;

  useEffect(() => {
    const enter = Animated.timing(entrance, {
      toValue: 1,
      duration: 650,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });
    const breathing = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.035, duration: 1000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.94, duration: 1000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
    );
    enter.start();
    breathing.start();
    return () => {
      enter.stop();
      breathing.stop();
    };
  }, [entrance, pulse]);

  const opacity = entrance;
  const translateY = entrance.interpolate({ inputRange: [0, 1], outputRange: [18, 0] });

  return (
    <View style={styles.loadingScreen}>
      <Animated.View style={[styles.splashContent, { opacity, transform: [{ translateY }] }]}>
        <Animated.View style={[styles.logoFrame, { transform: [{ scale: pulse }] }]}>
          <Image source={require("../../public/logo.jpeg")} style={styles.loadingLogo} accessibilityLabel="Exotic Racing team logo" resizeMode="contain" />
        </Animated.View>
        <Text style={styles.loadingTitle}>EXOTIC RACING</Text>
        <Text style={styles.loadingSubtitle}>IAET · ELECTRIC VEHICLE SYSTEMS</Text>
        <View style={styles.loadingTrack}><Animated.View style={[styles.loadingProgress, { opacity: pulse }]} /></View>
        <ActivityIndicator color="#B9D8C7" size="small" style={styles.loadingIndicator} />
      </Animated.View>
    </View>
  );
}

function AppNavigator() {
  const { colors, mode } = useTheme();
  return (
    <>
      <StatusBar style={mode === "dark" ? "light" : "dark"} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const [minimumLoadingTimeComplete, setMinimumLoadingTimeComplete] = useState(false);
  const [fontsLoaded] = useFonts({
    Cairo_400Regular,
    Cairo_500Medium,
    Cairo_600SemiBold,
    Cairo_700Bold,
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
  });

  useEffect(() => {
    const timer = setTimeout(() => setMinimumLoadingTimeComplete(true), 1800);
    return () => clearTimeout(timer);
  }, []);

  if (!fontsLoaded || !minimumLoadingTimeComplete) return <LoadingScreen />;

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <LocaleProvider>
          <AppNavigator />
        </LocaleProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingScreen: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#090A0B", padding: 24 },
  splashContent: { alignItems: "center", justifyContent: "center" },
  logoFrame: { width: 124, height: 124, borderRadius: 28, marginBottom: 28, padding: 8, backgroundColor: "#111719", borderColor: "#34463F", borderWidth: 1, alignItems: "center", justifyContent: "center" },
  loadingLogo: { width: "100%", height: "100%", borderRadius: 20 },
  loadingTitle: { color: "#F5F5F3", fontFamily: "Manrope_700Bold", fontSize: 18, letterSpacing: 3.2 },
  loadingSubtitle: { color: "#9DAAA3", fontFamily: "Manrope_500Medium", fontSize: 9, marginTop: 9, letterSpacing: 1.4 },
  loadingTrack: { width: 108, height: 2, backgroundColor: "#26312D", marginTop: 30, overflow: "hidden", borderRadius: 2 },
  loadingProgress: { width: "55%", height: "100%", backgroundColor: "#B9D8C7", alignSelf: "center" },
  loadingIndicator: { marginTop: 20 },
});
