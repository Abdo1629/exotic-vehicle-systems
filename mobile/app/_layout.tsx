import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { LocaleProvider } from "../lib/i18n";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <LocaleProvider>
        <StatusBar style="light" backgroundColor="#111317" />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "#111317" } }}>
          <Stack.Screen name="(tabs)" />
        </Stack>
      </LocaleProvider>
    </SafeAreaProvider>
  );
}
