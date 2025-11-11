import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";
import { AppProvider } from "@/store/AppContext";
import { ThemeProvider } from "@/store/ThemeContext";
import { trpc, trpcClient } from "@/lib/trpc";

import ErrorBoundary from "@/components/ErrorBoundary";

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Retour" }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen 
        name="trip/create" 
        options={{ 
          presentation: "modal",
          headerShown: false
        }} 
      />
      <Stack.Screen 
        name="trip/budget-admin" 
        options={{ 
          presentation: "modal",
          headerShown: false
        }} 
      />
      <Stack.Screen 
        name="destination/[id]" 
        options={{ 
          headerShown: false
        }} 
      />


      <Stack.Screen 
        name="auth/signup" 
        options={{ 
          headerShown: false
        }} 
      />
      <Stack.Screen 
        name="auth/login" 
        options={{ 
          headerShown: false
        }} 
      />
      <Stack.Screen 
        name="auth/verify-email" 
        options={{ 
          headerShown: false
        }} 
      />
      <Stack.Screen 
        name="destination/prepare" 
        options={{ 
          headerShown: false
        }} 
      />
      <Stack.Screen 
        name="settings" 
        options={{ 
          headerShown: false
        }} 
      />
      <Stack.Screen 
        name="settings/account" 
        options={{ 
          headerShown: false
        }} 
      />
      <Stack.Screen 
        name="settings/theme" 
        options={{ 
          headerShown: false
        }} 
      />
      <Stack.Screen 
        name="tools/currency-converter" 
        options={{ 
          headerShown: true
        }} 
      />
      <Stack.Screen 
        name="tools/phrase-guide" 
        options={{ 
          headerShown: true
        }} 
      />
      <Stack.Screen 
        name="tools/emergency-numbers" 
        options={{ 
          headerShown: true
        }} 
      />
      <Stack.Screen 
        name="destination/search-results" 
        options={{ 
          headerShown: false
        }} 
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default function RootLayout() {
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <ThemeProvider>
          <AppProvider>
            <GestureHandlerRootView style={styles.container}>
              <ErrorBoundary>
                <RootLayoutNav />
              </ErrorBoundary>
            </GestureHandlerRootView>
          </AppProvider>
        </ThemeProvider>
      </trpc.Provider>
    </QueryClientProvider>
  );
}