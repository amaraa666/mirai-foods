import { StyleSheet, View } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import type { PlaceCategory } from "@/utils/geo";

const PRIMARY = "#4A151B";

type Props = {
  category: PlaceCategory;
  size: number;
  iconSize: number;
  selected?: boolean;
};

/** Feather icons — reliable on Android (MaterialCommunity "croissant" can fail). */
export function PlaceMapMarker({
  category,
  size,
  iconSize,
  selected,
}: Props) {
  const iconName = category === "bakery" ? "coffee" : "shopping-bag";

  return (
    <View
      style={[
        styles.marker,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
        selected && styles.selected,
      ]}
    >
      <Feather name={iconName} size={iconSize} color="#fff" />
    </View>
  );
}

const styles = StyleSheet.create({
  marker: {
    backgroundColor: PRIMARY,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  selected: {
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 8,
  },
});
