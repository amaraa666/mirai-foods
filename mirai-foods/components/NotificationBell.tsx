import { Pressable, StyleSheet, Text, View, type ViewStyle } from "react-native";
import { useRouter } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import { useAppNotifications } from "@/contexts/NotificationsContext";

type Props = {
  color: string;
  size?: number;
  style?: ViewStyle;
};

export function NotificationBell({ color, size = 22, style }: Props) {
  const router = useRouter();
  const { unreadCount } = useAppNotifications();

  const badgeLabel =
    unreadCount > 99 ? "99+" : unreadCount > 0 ? String(unreadCount) : null;

  return (
    <Pressable
      style={[styles.wrap, style]}
      onPress={() => router.push("/notifications")}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={
        unreadCount > 0
          ? `Notifications, ${unreadCount} unread`
          : "Notifications"
      }
    >
      <Feather name="bell" size={size} color={color} />
      {badgeLabel != null && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badgeLabel}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -6,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#C62828",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: "#FAF7F4",
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "800",
    lineHeight: 12,
  },
});
