import { Tabs } from "expo-router";
import { Home, Hotel, MapPin, UtensilsCrossed, MoreHorizontal } from "lucide-react-native";
import React from "react";
import { Platform, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";

import { useTheme } from "@/store/ThemeContext";

export default function TabLayout() {
  const { colors, isDark } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: Platform.OS === 'web' ? (colors.tabBarBackground || colors.surface) : 'transparent',
          borderTopWidth: 0,
          paddingHorizontal: 4,
          height: Platform.OS === 'ios' ? 88 : 72,
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 28 : 12,
          elevation: 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.3,
          shadowRadius: 12,
        },
        tabBarBackground: () => Platform.OS !== 'web' && colors.tabBarBlur ? (
          <BlurView
            intensity={95}
            tint={isDark ? 'dark' : 'light'}
            style={StyleSheet.absoluteFill}
          />
        ) : Platform.OS !== 'web' ? (
          <BlurView
            intensity={0}
            tint={isDark ? 'dark' : 'light'}
            style={[StyleSheet.absoluteFill, { backgroundColor: colors.tabBarBackground || colors.surface }]}
          />
        ) : null,
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
          tabBarIcon: ({ color, focused }) => (
            <Home
              color={focused ? colors.primary : colors.textLight}
              size={24}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="hotels"
        options={{
          title: "Hôtels",
          tabBarIcon: ({ color, focused }) => (
            <Hotel
              color={focused ? colors.primary : colors.textLight}
              size={24}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="activities"
        options={{
          title: "Activités",
          tabBarIcon: ({ color, focused }) => (
            <MapPin
              color={focused ? colors.primary : colors.textLight}
              size={24}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="restaurants"
        options={{
          title: "Restos",
          tabBarIcon: ({ color, focused }) => (
            <UtensilsCrossed
              color={focused ? colors.primary : colors.textLight}
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
          tabBarIcon: ({ color, focused }) => (
            <MoreHorizontal
              color={focused ? colors.primary : colors.textLight}
              size={24}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="gallery"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="spiritual"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

