import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import { Stack, usePathname } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { CartProvider } from "@/contexts/CartContext";
import { NotificationsProvider } from "@/contexts/NotificationsContext";
import "@/lib/firebase";
import { seedMockCatalogIfNeeded } from "@/services/seedMockData";
import { useEffect } from "react";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const unstable_settings = {
  anchor: "index",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const pathname = usePathname();
  const isDarkHero = pathname === "/" || pathname === "/login";
  const statusBarStyle =
    isDarkHero ? "light" : colorScheme === "dark" ? "light" : "dark";

  useEffect(() => {
    void seedMockCatalogIfNeeded().catch((error) => {
      console.warn("[firebase] mock seed failed", error);
    });
  }, []);

  return (
    <SafeAreaProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <CartProvider>
          <NotificationsProvider>
            <Stack initialRouteName="index">
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="login" options={{ headerShown: false }} />
              <Stack.Screen name="signup" options={{ headerShown: false }} />
              <Stack.Screen name="notifications" options={{ headerShown: false }} />
              <Stack.Screen
                name="product/[id]"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="place/[id]"
                options={{ headerShown: false }}
              />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="modal"
                options={{ presentation: "modal", title: "Modal" }}
              />
            </Stack>
          </NotificationsProvider>
        </CartProvider>
        <StatusBar style={statusBarStyle} />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
