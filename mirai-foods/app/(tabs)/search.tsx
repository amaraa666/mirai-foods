import { StyleSheet, Text, TextInput, View } from "react-native";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";

const BG = "#FAF7F4";

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");

  return (
    <View style={[styles.root, { paddingTop: insets.top + 12 }]}>
      <Text style={styles.title}>Search</Text>
      <View style={styles.searchWrapper}>
        <Feather name="search" size={18} color="#bbb" style={{ marginRight: 10 }} />
        <TextInput
          style={styles.input}
          placeholder="Search for bakeries, products..."
          placeholderTextColor="#bbb"
          value={query}
          onChangeText={setQuery}
          autoFocus
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BG,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 16,
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0EBE4",
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 46,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#1a1a1a",
  },
});
