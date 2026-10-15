import { Tabs } from "expo-router";
import { Text } from "react-native";

const tabs = [
  { name: "index", title: "Overview", glyph: "◈" },
  { name: "battery", title: "Battery", glyph: "ϟ" },
  { name: "diagnostics", title: "System", glyph: "⌁" },
  { name: "logbook", title: "Test log", glyph: "≡" },
] as const;

export default function TabLayout() {
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
        tabBarLabelStyle: { fontSize: 10, fontWeight: "600" },
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
