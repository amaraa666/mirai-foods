import { useMemo, useState } from "react";
import {
  FlatList,
  Keyboard,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";
import { searchMainMenu, type SearchResult } from "@/constants/data";

const BG = "#FAF7F4";
const PRIMARY = "#4A151B";
const TEXT_PRIMARY = "#1a1a1a";
const TEXT_SECONDARY = "#888";

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [query, setQuery] = useState("");

  const results = useMemo(() => searchMainMenu(query), [query]);
  const trimmed = query.trim();

  const openResult = (item: SearchResult) => {
    Keyboard.dismiss();
    if (item.type === "product") {
      router.push(`/product/${item.id}`);
    } else {
      router.push(`/place/${item.id}`);
    }
  };

  const renderItem = ({ item }: { item: SearchResult }) => (
    <Pressable
      style={({ pressed }) => [styles.resultRow, pressed && styles.resultPressed]}
      onPress={() => openResult(item)}
    >
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.thumb} contentFit="cover" />
      ) : (
        <View style={[styles.thumb, styles.thumbPlaceholder]}>
          <Feather
            name={item.type === "place" ? "home" : "shopping-bag"}
            size={22}
            color={TEXT_SECONDARY}
          />
        </View>
      )}
      <View style={styles.resultBody}>
        <View style={styles.resultTop}>
          <View
            style={[
              styles.typeBadge,
              item.type === "place" ? styles.placeBadge : styles.productBadge,
            ]}
          >
            <Text style={styles.typeBadgeText}>
              {item.type === "place" ? "Seller" : "Product"}
            </Text>
          </View>
        </View>
        <Text style={styles.resultTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.resultSub} numberOfLines={2}>
          {item.subtitle}
        </Text>
      </View>
      <Feather name="chevron-right" size={20} color={TEXT_SECONDARY} />
    </Pressable>
  );

  return (
    <View style={[styles.root, { paddingTop: insets.top + 12 }]}>
      <Text style={styles.title}>Search</Text>
      <View style={styles.searchWrapper}>
        <Feather name="search" size={18} color={TEXT_SECONDARY} />
        <TextInput
          style={styles.input}
          placeholder="Search sellers or products..."
          placeholderTextColor="#bbb"
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
          autoCorrect={false}
          clearButtonMode="while-editing"
        />
        {trimmed.length > 0 && (
          <Pressable onPress={() => setQuery("")} hitSlop={8}>
            <Feather name="x-circle" size={18} color={TEXT_SECONDARY} />
          </Pressable>
        )}
      </View>

      {!trimmed ? (
        <View style={styles.hintBox}>
          <Feather name="search" size={32} color="#ccc" />
          <Text style={styles.hintTitle}>Find artisan surplus</Text>
          <Text style={styles.hintText}>
            Search by bakery name, address, or dish — e.g. &quot;Maison&quot;,
            &quot;croissant&quot;, &quot;Savor&quot;
          </Text>
        </View>
      ) : results.length === 0 ? (
        <View style={styles.hintBox}>
          <Feather name="package" size={32} color="#ccc" />
          <Text style={styles.hintTitle}>No results</Text>
          <Text style={styles.hintText}>
            Try another name or check spelling
          </Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => `${item.type}-${item.id}`}
          renderItem={renderItem}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: insets.bottom + 100,
            paddingTop: 8,
          }}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
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
    color: TEXT_PRIMARY,
    marginBottom: 16,
    fontFamily: Platform.select({ ios: "Georgia", android: "serif" }),
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0EBE4",
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 46,
    gap: 10,
    marginBottom: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: TEXT_PRIMARY,
  },
  hintBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingBottom: 80,
    gap: 12,
  },
  hintTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: TEXT_PRIMARY,
  },
  hintText: {
    fontSize: 14,
    color: TEXT_SECONDARY,
    textAlign: "center",
    lineHeight: 21,
  },
  resultRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    gap: 12,
  },
  resultPressed: {
    opacity: 0.92,
  },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: "#e8e0da",
  },
  thumbPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  resultBody: {
    flex: 1,
    minWidth: 0,
  },
  resultTop: {
    flexDirection: "row",
    marginBottom: 4,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  placeBadge: {
    backgroundColor: "#F0EBE4",
  },
  productBadge: {
    backgroundColor: "#F8F0F0",
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
    color: PRIMARY,
    textTransform: "uppercase",
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: TEXT_PRIMARY,
    marginBottom: 2,
  },
  resultSub: {
    fontSize: 13,
    color: TEXT_SECONDARY,
    lineHeight: 18,
  },
  separator: {
    height: 10,
  },
});
