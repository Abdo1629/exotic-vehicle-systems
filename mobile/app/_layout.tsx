import { Stack } from "expo-router";
import { Cairo_400Regular, Cairo_500Medium, Cairo_600SemiBold, Cairo_700Bold } from "@expo-google-fonts/cairo";
import { Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold } from "@expo-google-fonts/manrope";
import { useFonts } from "expo-font";
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

  if (!fontsLoaded) return null;

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
