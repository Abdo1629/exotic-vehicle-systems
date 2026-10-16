import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { LocaleProvider } from "../lib/i18n";
import { ThemeProvider, useTheme } from "../lib/theme";

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
