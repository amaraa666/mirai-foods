import { Image } from "expo-image";
import {
  Alert,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Text,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";
import { NotificationBell } from "@/components/NotificationBell";
import { curatedListings } from "@/constants/data";
import { signOut } from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase";

const BG = "#FAF7F4";
const TEXT_PRIMARY = "#1a1a1a";
const TEXT_SECONDARY = "#888";
const BADGE_BG = "rgba(255,255,255,0.92)";
const BADGE_TEXT = "#3B0914";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = () => {
    Alert.alert("Log out", "Do you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log out",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut(firebaseAuth);
            router.replace("/login");
          } catch (error) {
            console.warn("[auth] logout failed", error);
          }
        },
      },
    ]);
  };

  const filtered = searchQuery
    ? curatedListings.filter(
        (b) =>
          b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : curatedListings;

  const firstHalf = filtered.slice(0, 3);
  const secondHalf = filtered.slice(3);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              style={styles.avatar}
              activeOpacity={0.8}
              onPress={handleLogout}
            >
              <Image
                source={{ uri: "https://i.pravatar.cc/100" }}
                style={styles.avatarImage}
              />
            </TouchableOpacity>
            <Text style={styles.brandName}>Savor</Text>
          </View>
          <NotificationBell color={TEXT_PRIMARY} size={22} style={styles.bellBtn} />
        </View>

        {/* Search */}
        <View style={styles.searchWrapper}>
          <Feather
            name="search"
            size={18}
            color={TEXT_SECONDARY}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for artisanal bakeries..."
            placeholderTextColor="#bbb"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Daily Curation */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Daily Curation</Text>
          <Text style={styles.sectionLocation}>NEW YORK, NY</Text>
        </View>

        {/* First batch of cards */}
        {firstHalf.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            activeOpacity={0.9}
            onPress={() => router.push(`/product/${item.productId}`)}
          >
            <View style={styles.imageWrapper}>
              <Image
                source={{ uri: item.image }}
                style={styles.cardImage}
                contentFit="cover"
              />
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>
                  {item.discountPercent}% OFF
                </Text>
              </View>
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardName}>{item.title}</Text>
              <Text style={styles.cardPrice}>${item.price.toFixed(2)}</Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* Twilight Treats Banner */}
        <TouchableOpacity style={styles.banner} activeOpacity={0.9}>
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>Twilight{"\n"}Treats</Text>
            <Text style={styles.bannerSub}>save after dusk{"\n"}with us</Text>
          </View>
          <View style={styles.bannerBtnWrapper}>
            <View style={styles.bannerBtn}>
              <Text style={styles.bannerBtnText}>EXPLORE</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Second batch of cards */}
        {secondHalf.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            activeOpacity={0.9}
            onPress={() => router.push(`/product/${item.productId}`)}
          >
            <View style={styles.imageWrapper}>
              <Image
                source={{ uri: item.image }}
                style={styles.cardImage}
                contentFit="cover"
              />
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>
                  {item.discountPercent}% OFF
                </Text>
              </View>
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardName}>{item.title}</Text>
              <Text style={styles.cardPrice}>${item.price.toFixed(2)}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BG,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#e0d5ca",
  },
  avatarImage: {
    width: 36,
    height: 36,
  },
  brandName: {
    fontSize: 22,
    fontWeight: "700",
    color: TEXT_PRIMARY,
    letterSpacing: -0.3,
  },
  bellBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  // Search
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: "#F0EBE4",
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 46,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: TEXT_PRIMARY,
  },

  // Section header
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: TEXT_PRIMARY,
  },
  sectionLocation: {
    fontSize: 12,
    fontWeight: "600",
    color: TEXT_SECONDARY,
    letterSpacing: 0.5,
  },

  // Product cards
  card: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  imageWrapper: {
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#d4a373",
  },
  cardImage: {
    width: "100%",
    height: 200,
  },
  discountBadge: {
    position: "absolute",
    top: 14,
    right: 14,
    backgroundColor: BADGE_BG,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  discountText: {
    fontSize: 12,
    fontWeight: "700",
    color: BADGE_TEXT,
  },
  cardInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
    paddingHorizontal: 4,
  },
  cardName: {
    fontSize: 15,
    fontWeight: "600",
    color: TEXT_PRIMARY,
  },
  cardPrice: {
    fontSize: 15,
    fontWeight: "700",
    color: TEXT_PRIMARY,
  },

  // Twilight Treats banner
  banner: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#2C1810",
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  bannerContent: {
    marginBottom: 16,
  },
  bannerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#E8C9A0",
    lineHeight: 34,
  },
  bannerSub: {
    fontSize: 13,
    color: "#C4A07A",
    marginTop: 6,
    lineHeight: 18,
  },
  bannerBtnWrapper: {
    alignItems: "flex-start",
  },
  bannerBtn: {
    backgroundColor: "#D4A373",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 14,
  },
  bannerBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#2C1810",
    letterSpacing: 1,
  },
});
