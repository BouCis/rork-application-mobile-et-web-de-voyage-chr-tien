import { Tabs } from "expo-router";
import { Home, Hotel, MapPin, UtensilsCrossed, MoreHorizontal, User } from "lucide-react-native";
import React from "react";
import { View } from "react-native";

import { useTheme } from "@/store/ThemeContext";

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      initialRouteName="planner"
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarBackground: () => (
          <View style={{ flex: 1, backgroundColor: colors.surface }} />
        ),
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          paddingHorizontal: 8,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginTop: 4,
          letterSpacing: 0.3,
        },
        tabBarIconStyle: {
          marginTop: 0,
        },
        tabBarItemStyle: {
          paddingVertical: 6,
          gap: 2,
        },
      }}
    >
      <Tabs.Screen
        name="planner"
        options={{
          title: "Accueil",
          tabBarIcon: ({ focused }) => (
            <Home
              color={focused ? colors.primary : colors.textSecondary}
              size={24}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="hotels"
        options={{
          title: "Hotel",
          tabBarIcon: ({ focused }) => (
            <Hotel
              color={focused ? colors.primary : colors.textSecondary}
              size={24}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="activities"
        options={{
          title: "Activite",
          tabBarIcon: ({ focused }) => (
            <MapPin
              color={focused ? colors.primary : colors.textSecondary}
              size={24}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="restaurants"
        options={{
          title: "Restaurant",
          tabBarIcon: ({ focused }) => (
            <UtensilsCrossed
              color={focused ? colors.primary : colors.textSecondary}
              size={24}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Mon espace",
          tabBarIcon: ({ focused }) => (
            <User
              color={focused ? colors.primary : colors.textSecondary}
              size={24}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: "Plus",
          tabBarIcon: ({ focused }) => (
            <MoreHorizontal
              color={focused ? colors.primary : colors.textSecondary}
              size={24}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
    </Tabs>
  );
}
