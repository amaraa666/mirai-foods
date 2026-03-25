import { Image } from "expo-image";
import {
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { mockProducts, Product } from "@/constants/data";
import { useColorScheme } from "@/hooks/use-color-scheme";
import Fontisto from "@expo/vector-icons/Fontisto";

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<
    "Bakery" | "Fruits" | "Vegetables" | "Meat"
  >("Bakery");
  const router = useRouter();

  const categories = ["Bakery", "Fruits", "Vegetables", "Meat"] as const;
  const topProduct = mockProducts[0];

  const filteredProducts = mockProducts.filter((product) => {
    const matchesCategory = activeCategory === 'Bakery' ? product.type === 'cake' :
      activeCategory === 'Fruits' ? product.type === 'pastry' :
        activeCategory === 'Vegetables' ? product.type === 'sandwich' : true;
    const matchesSearch = searchQuery === '' || product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const renderMostOrdered = ({ item }: { item: Product }) => {
    const hours = Math.floor(item.expiringInHours);
    const minutes = Math.max(0, Math.round((item.expiringInHours % 1) * 60));

    return (
      <TouchableOpacity
        style={[
          styles.mostOrderedCard,
          { backgroundColor: Colors[colorScheme ?? "light"].cardBackground },
        ]}
        onPress={() => router.push(`/product/${item.id}`)}
      >
        <Image source={{ uri: item.image }} style={[styles.pinImage, { width: '100%', height: 120 }]} />
        <View style={styles.pinBadgeContainer}>
          <ThemedText style={styles.pinRemaining}>Left {item.quantityLeft}</ThemedText>
          <ThemedText style={styles.pinDiscount}>{item.discountPercentage}% off</ThemedText>
        </View>
        <View style={styles.topInfo}>
          <ThemedText style={styles.mostOrderedName}>{item.name}</ThemedText>
          <View style={styles.priceRow}>
            <ThemedText style={styles.originalPrice}>
              ${item.originalPrice}
            </ThemedText>
            <ThemedText style={styles.mostOrderedPrice}>
              ${item.discountedPrice}
            </ThemedText>
          </View>
          <ThemedText style={[styles.mostOrderedMeta, styles.discountBadgeText]}>
            Ends in: {hours}h {minutes}m
          </ThemedText>
        </View>


      </TouchableOpacity>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors[colorScheme ?? "light"].background,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <View>
            <ThemedText type="subtitle" style={styles.smallText}>
              Good Morning
            </ThemedText>
            <ThemedText type="title" style={styles.headerTitle}>
              Tania William
            </ThemedText>
          </View>
          <TouchableOpacity
            style={[styles.circleButton, { backgroundColor: "#f5f5f5" }]}
            onPress={() => router.push("/notifications")}
          >
            <ThemedText>
              <Fontisto name="bell" size={24} color="black" />
            </ThemedText>
          </TouchableOpacity>
        </View>

        <TextInput
          style={[
            styles.searchBar,
            {
              backgroundColor: "#f5f5f5",
              color: Colors[colorScheme ?? "light"].text,
            },
          ]}
          placeholder="Search your product"
          placeholderTextColor={Colors[colorScheme ?? "light"].icon}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryRow}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryChip,
                activeCategory === category ? styles.categoryChipActive : null,
              ]}
              onPress={() => setActiveCategory(category)}
            >
              <ThemedText
                style={
                  activeCategory === category
                    ? styles.categoryTextActive
                    : styles.categoryText
                }
              >
                {category}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {topProduct && (
          <TouchableOpacity
            style={[
              styles.topProductCard,
              {
                backgroundColor: Colors[colorScheme ?? "light"].cardBackground,
              },
            ]}
            onPress={() => router.push(`/product/${topProduct.id}`)}
          >
            <View style={styles.topImageWrapper}>
              <Image
                source={{ uri: topProduct.image }}
                style={styles.topImage}
              />
              <View style={styles.imageBadges}>
                <ThemedText style={styles.imageBadgeText}>
                  Left {topProduct.quantityLeft}
                </ThemedText>
                <ThemedText
                  style={[styles.imageBadgeText, styles.discountBadgeText]}
                >
                  -{topProduct.discountPercentage}%
                </ThemedText>
              </View>
            </View>
            <View style={styles.topInfo}>
              <ThemedText type="title" style={styles.topName} numberOfLines={1}>
                {topProduct.name}
              </ThemedText>
              <View style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 8 }}>
                <ThemedText style={styles.originalPrice}>
                  ${topProduct.originalPrice}
                </ThemedText>
                <ThemedText style={styles.topPrice}>
                  ${topProduct.discountedPrice}.00
                </ThemedText>
              </View>

              <View style={styles.topMetaRow}>
                <ThemedText style={[styles.topMeta, styles.discountBadgeText]}>
                  Ends in {Math.floor(topProduct.expiringInHours)}h{" "}
                  {Math.max(
                    0,
                    Math.round((topProduct.expiringInHours % 1) * 60),
                  )}
                  m
                </ThemedText>
              </View>
              <TouchableOpacity
                style={[
                  styles.button,
                  { backgroundColor: Colors[colorScheme ?? "light"].tint },
                ]}
                onPress={() => router.push("/payment")}
              >
                <ThemedText style={styles.buttonText}>Add to Cart</ThemedText>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}

        <View style={styles.sectionHeader}>
          <ThemedText type="title" style={styles.sectionTitle}>
            Most Ordered
          </ThemedText>
          <TouchableOpacity onPress={() => router.push("/map")}>
            <ThemedText style={styles.sectionAction}>Explore All</ThemedText>
          </TouchableOpacity>
        </View>

        <FlatList
          data={filteredProducts}
          renderItem={renderMostOrdered}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.mostOrderedList}
          scrollEnabled={true}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  smallText: {
    color: "#888",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
  },
  circleButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  searchBar: {
    height: 45,
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 16,
    fontSize: 16,
  },
  categoryRow: {
    marginBottom: 20,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#ddd",
    marginRight: 10,
  },
  categoryChipActive: {
    backgroundColor: "#fff",
    borderColor: "#f2b9c4",
  },
  categoryText: {
    color: "#333",
  },
  categoryTextActive: {
    color: "#000",
    fontWeight: "bold",
  },
  topProductCard: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 24,
  },
  topImageWrapper: {
    position: "relative",
  },
  topImage: {
    width: "100%",
    height: 260,
  },
  mostOrderedImageWrapper: {
    position: "relative",
  },
  imageBadges: {
    position: "absolute",
    top: 8,
    left: 8,
    right: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  pinRemaining: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 11,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  imageBadgeText: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    fontSize: 11,
    color: "#333",
    fontWeight: "700",
  },
  discountBadgeText: {
    color: "#cb2b2b",
    fontWeight: "bold",
  },
  topInfo: {
    padding: 14,
  },
  topName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  topPrice: {
    color: "#606C38",
    marginBottom: 6,
  },
  topMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  topMeta: {
    fontSize: 12,
    color: "#555",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
  },
  sectionAction: {
    color: "#a12f5d",
    fontWeight: "bold",
  },
  mostOrderedList: {
    paddingBottom: 30,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  originalPrice: {
    color: "#999",
    textDecorationLine: "line-through",
    fontSize: 12,
  },
  mostOrderedCard: {
    width: 170,
    height: 250,
    marginRight: 10,
    borderRadius: 14,
    justifyContent: "space-between",
  },
  mostOrderedImage: {
    width: "100%",
    height: 120,
    borderRadius: 10,
    marginBottom: 8,
  },
  pinContainer: {
    width: '100%',
    height: 220,
    borderRadius: 14,
    padding: 0,
    backgroundColor: '#fff',
    overflow: 'hidden',
    marginBottom: 12,
  },
  pinImage: {
    width: '100%',
    height: 140,
  },
  pinBadgeContainer: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pinDiscount: {
    color: '#d32f2f',
    fontWeight: 'bold',
    fontSize: 12,
    backgroundColor: '#ffffffcc',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  mostOrderedName: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 2,
  },
  mostOrderedPrice: {
    fontSize: 13,
    color: "#606C38",
    marginBottom: 4,
  },
  mostOrderedMeta: {
    fontSize: 11,
    color: "#555",
    marginTop: 1,
    lineHeight: 14,
  },
  button: {
    marginTop: 10,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
