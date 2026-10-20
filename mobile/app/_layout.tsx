import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { Cairo_400Regular, Cairo_500Medium, Cairo_600SemiBold, Cairo_700Bold } from "@expo-google-fonts/cairo";
import { Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold } from "@expo-google-fonts/manrope";
import { useFonts } from "expo-font";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { LocaleProvider } from "../lib/i18n";
import { ThemeProvider, useTheme } from "../lib/theme";

function LoadingScreen() {
  return (
    <View style={styles.loadingScreen}>
      <Image source={require("../../public/logo.jpeg")} style={styles.loadingLogo} accessibilityLabel="Exotic Vehicle Systems logo" />
      <Text style={styles.loadingTitle}>EXOTIC RACING</Text>
      <Text style={styles.loadingSubtitle}>Loading vehicle systems</Text>
      <ActivityIndicator color="#E53935" size="small" style={styles.loadingIndicator} />
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
    const timer = setTimeout(() => setMinimumLoadingTimeComplete(true), 900);
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
  loadingLogo: { width: 112, height: 112, borderRadius: 20, marginBottom: 24 },
  loadingTitle: { color: "#F5F5F3", fontSize: 16, fontWeight: "800", letterSpacing: 1.8 },
  loadingSubtitle: { color: "#8F9691", fontSize: 12, marginTop: 8 },
  loadingIndicator: { marginTop: 28 },
});
