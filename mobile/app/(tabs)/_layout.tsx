import { Tabs } from "expo-router";
import { Text } from "react-native";
import { useLocale } from "../../lib/i18n";

export default function TabLayout() {
  const { locale, tr } = useLocale();
  const tabs = [
    { name: "index", title: tr("Overview", "الرئيسية"), glyph: "◈" },
    { name: "battery", title: tr("Battery", "البطارية"), glyph: "ϟ" },
    { name: "diagnostics", title: tr("System", "النظام"), glyph: "⌁" },
    { name: "logbook", title: tr("Test log", "سجل الاختبارات"), glyph: "≡" },
  ] as const;
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#C5A875",
        tabBarInactiveTintColor: "#85877F",
        tabBarStyle: {
          backgroundColor: "#191C21",
          borderTopColor: "#353A41",
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
