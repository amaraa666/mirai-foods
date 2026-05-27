import { Pressable, StyleSheet, Text, View } from "react-native";
import Feather from "@expo/vector-icons/Feather";

const PRIMARY = "#4A151B";
const STAR_ACTIVE = "#E8A317";
const STAR_INACTIVE = "#D4CCC4";
const TEXT_SECONDARY = "#757575";

type Props = {
  value: number | null;
  communityRating: number;
  onChange: (stars: number) => void;
};

export function PlaceStarRating({
  value,
  communityRating,
  onChange,
}: Props) {
  const displayValue = value ?? 0;

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>Rate this seller</Text>
      <View style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = displayValue >= star;
          return (
            <Pressable
              key={star}
              onPress={() => onChange(star)}
              style={styles.starBtn}
              accessibilityRole="button"
              accessibilityLabel={`${star} star${star !== 1 ? "s" : ""}`}
            >
              <Feather
                name="star"
                size={32}
                color={filled ? STAR_ACTIVE : STAR_INACTIVE}
                style={filled ? styles.starFilled : undefined}
              />
            </Pressable>
          );
        })}
      </View>
      <Text style={styles.hint}>
        {value != null
          ? `You rated ${value} out of 5 — thank you!`
          : "Tap a star to share your experience"}
      </Text>
      <Text style={styles.community}>
        Community average · {communityRating.toFixed(1)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: PRIMARY,
    marginBottom: 10,
  },
  starsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    marginBottom: 10,
  },
  starBtn: {
    padding: 4,
  },
  starFilled: {
    shadowColor: STAR_ACTIVE,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.35,
    shadowRadius: 2,
  },
  hint: {
    fontSize: 13,
    color: TEXT_SECONDARY,
    textAlign: "center",
    marginBottom: 4,
  },
  community: {
    fontSize: 12,
    color: TEXT_SECONDARY,
    textAlign: "center",
    fontWeight: "600",
  },
});
