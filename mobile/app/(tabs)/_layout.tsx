import { Tabs } from "expo-router";
import { Text } from "react-native";
import { useLocale } from "../../lib/i18n";
import { useTheme } from "../../lib/theme";

export default function TabLayout() {
  const { locale, tr } = useLocale();
  const { colors } = useTheme();
  const tabs = [
    { name: "index", title: tr("Overview", "الرئيسية"), glyph: "◈" },
    { name: "battery", title: tr("Battery", "البطارية"), glyph: "ϟ" },
    { name: "diagnostics", title: tr("System", "النظام"), glyph: "⌁" },
    { name: "logbook", title: tr("Test log", "سجل الاختبارات"), glyph: "≡" },
    { name: "pit", title: tr("Pit mode", "وضع الاختبار"), glyph: "✓" },
  ] as const;
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.subtle,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 68,
          paddingTop: 8,
          paddingBottom: 8,
        },
        tabBarLabelStyle: { fontSize: locale === "ar" ? 10 : 10, fontWeight: "600" },
      }}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ color }) => (
              <Text style={{ color, fontSize: 20, fontWeight: "600" }}>{tab.glyph}</Text>
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
