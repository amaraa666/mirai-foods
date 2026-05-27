import Feather from "@expo/vector-icons/Feather";
import { Image } from "expo-image";
import { Stack, useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import * as ExpoNotifications from "expo-notifications";
import { useCallback } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { AppNotification } from "@/constants/notificationsFeed";
import { useAppNotifications } from "@/contexts/NotificationsContext";
import { formatTimeAgo } from "@/utils/timeAgo";

const BG = "#FBF8F6";
const PRIMARY = "#4A151B";
const MUTED = "#6F6663";
const CARD_READ = "#F3EFEC";
const CARD_UNREAD = "#FFFFFF";

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { notifications, markInboxSeen, markAllAsRead } = useAppNotifications();

  useFocusEffect(
    useCallback(() => {
      markInboxSeen();
      return () => {
        markAllAsRead();
      };
    }, [markInboxSeen, markAllAsRead])
  );

  const goToProduct = (item: AppNotification) => {
    if (item.isDiscount) {
      router.push(`/product/${item.productId}`);
    }
  };

  const scheduleUpcomingNotification = async (item: AppNotification) => {
    const settings = await ExpoNotifications.getPermissionsAsync();
    const perm = settings as ExpoNotifications.NotificationPermissionsStatus & {
      granted: boolean;
    };

    const granted =
      Platform.OS === "ios"
        ? settings.ios?.status ===
            ExpoNotifications.IosAuthorizationStatus.AUTHORIZED ||
          settings.ios?.status ===
            ExpoNotifications.IosAuthorizationStatus.PROVISIONAL
        : perm.granted;

    if (!granted) {
      const req =
        (await ExpoNotifications.requestPermissionsAsync()) as typeof perm;
      if (Platform.OS === "ios") {
        const status = req.ios?.status;
        if (
          status !== ExpoNotifications.IosAuthorizationStatus.AUTHORIZED &&
          status !== ExpoNotifications.IosAuthorizationStatus.PROVISIONAL
        ) {
          return;
        }
      } else if (!req.granted) {
        return;
      }
    }

    if (Platform.OS === "android") {
      await ExpoNotifications.setNotificationChannelAsync("default", {
        name: "General",
        importance: ExpoNotifications.AndroidImportance.DEFAULT,
      });
    }

    try {
      await ExpoNotifications.scheduleNotificationAsync({
        content: {
          title: "Upcoming drop reminder",
          body: `${item.title} is coming soon. We'll notify you when it goes live.`,
          sound: "default",
        },
        trigger: {
          type: ExpoNotifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: 5,
        },
      });
    } catch (e) {
      console.warn("[notifications] schedule failed", e);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Pressable style={styles.headerIcon} onPress={() => router.back()}>
            <Feather name="arrow-left" size={23} color={PRIMARY} />
          </Pressable>
          <Text style={styles.headerBrand}>MIRAI FOODS</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
        >
          <Text style={styles.title}>Notifications</Text>
          <Text style={styles.subtitle}>
            Curated offers and freshness alerts from your favorite local artisans.
          </Text>

          {notifications.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => item.isDiscount && goToProduct(item)}
              style={[
                styles.card,
                item.read ? styles.cardRead : styles.cardUnread,
              ]}
            >
              <Text
                style={[
                  styles.timeAgo,
                  styles.cardTime,
                  item.read && styles.timeAgoRead,
                ]}
              >
                {formatTimeAgo(item.createdAt)}
              </Text>

              <Pressable
                onPress={() => item.isDiscount && goToProduct(item)}
                style={styles.thumbPressable}
              >
                <Image
                  source={{ uri: item.image }}
                  style={[
                    styles.thumb,
                    item.read && styles.thumbRead,
                  ]}
                  contentFit="cover"
                />
              </Pressable>

              <View style={styles.body}>
                <Text
                  style={[
                    styles.vendor,
                    item.read && styles.vendorRead,
                  ]}
                >
                  {item.vendor}
                </Text>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.productTitle,
                    item.read && styles.productTitleRead,
                  ]}
                >
                  {item.title}
                </Text>

                {item.isDiscount && (
                  <View style={styles.priceRow}>
                    <Text style={styles.oldPrice}>
                      ${item.oldPrice?.toFixed(2)}
                    </Text>
                    <Text
                      style={[
                        styles.newPrice,
                        item.read && styles.newPriceRead,
                      ]}
                    >
                      ${item.newPrice?.toFixed(2)}
                    </Text>
                    <View
                      style={[
                        styles.tagPill,
                        item.read && styles.tagPillRead,
                      ]}
                    >
                      <Text style={styles.tagText}>{item.tag}</Text>
                    </View>
                  </View>
                )}

                {!item.isDiscount && (
                  <View style={styles.noteWrap}>
                    <Text
                      style={[
                        styles.availableText,
                        item.read && styles.availableTextRead,
                      ]}
                    >
                      {item.note}
                    </Text>
                    <View style={styles.noteTag}>
                      <Text style={styles.noteTagText}>{item.tag}</Text>
                    </View>
                  </View>
                )}
              </View>

              {!item.isDiscount && (
                <Pressable
                  onPress={() => scheduleUpcomingNotification(item)}
                  style={[styles.cta, styles.ctaOutline]}
                >
                  <Text style={[styles.ctaText, styles.ctaTextOutline]}>
                    Notify
                  </Text>
                </Pressable>
              )}
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    paddingTop: 8,
  },
  headerIcon: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  headerBrand: {
    flex: 1,
    fontSize: 18,
    fontWeight: "800",
    color: PRIMARY,
    letterSpacing: 0.2,
    textAlign: "center",
  },
  headerSpacer: {
    width: 40,
    height: 40,
  },
  title: {
    fontSize: 48,
    fontWeight: "800",
    color: PRIMARY,
    marginBottom: 10,
    lineHeight: 52,
  },
  subtitle: {
    color: MUTED,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  card: {
    borderRadius: 24,
    padding: 16,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
    position: "relative",
    overflow: "hidden",
  },
  cardUnread: {
    backgroundColor: CARD_UNREAD,
    borderWidth: 1,
    borderColor: "rgba(74, 21, 27, 0.12)",
  },
  cardRead: {
    backgroundColor: CARD_READ,
    opacity: 0.92,
  },
  thumb: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginRight: 14,
    backgroundColor: "#e5ded8",
  },
  thumbRead: {
    opacity: 0.75,
  },
  body: {
    flex: 1,
    paddingRight: 8,
  },
  cardTime: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 1,
  },
  vendor: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.1,
    color: PRIMARY,
    marginBottom: 3,
    paddingRight: 72,
  },
  vendorRead: {
    color: MUTED,
    fontWeight: "700",
  },
  timeAgo: {
    fontSize: 11,
    fontWeight: "600",
    color: PRIMARY,
  },
  timeAgoRead: {
    color: MUTED,
    fontWeight: "500",
  },
  productTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#211D1D",
    marginBottom: 6,
  },
  productTitleRead: {
    fontWeight: "600",
    color: MUTED,
  },
  thumbPressable: {
    width: 96,
    height: 96,
    borderRadius: 48,
    overflow: "hidden",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  oldPrice: {
    fontSize: 12,
    color: MUTED,
    textDecorationLine: "line-through",
  },
  newPrice: {
    fontSize: 18,
    fontWeight: "800",
    color: PRIMARY,
  },
  newPriceRead: {
    fontWeight: "700",
    color: "#6F625A",
  },
  tagPill: {
    backgroundColor: "#EFE8E6",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  tagPillRead: {
    backgroundColor: "#E8E2DE",
  },
  tagText: {
    fontSize: 10,
    color: "#4A2C32",
    fontWeight: "700",
  },
  availableText: {
    fontSize: 13,
    color: "#4A433F",
    marginBottom: 6,
  },
  availableTextRead: {
    color: MUTED,
  },
  noteWrap: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 8,
  },
  noteTag: {
    alignSelf: "flex-start",
    backgroundColor: "#EFE8E0",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  noteTagText: {
    fontSize: 10,
    color: "#6F625A",
    fontWeight: "700",
  },
  cta: {
    minWidth: 86,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  ctaOutline: {
    borderWidth: 1.5,
    borderColor: "#8E8681",
    backgroundColor: "#fff",
  },
  ctaText: {
    fontSize: 16,
    fontWeight: "700",
  },
  ctaTextOutline: {
    color: "#433C37",
  },
});
