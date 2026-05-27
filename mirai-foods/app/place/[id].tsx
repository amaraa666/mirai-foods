import { useEffect, useState } from "react";
import { Image } from "expo-image";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { PickupLocationMap } from "@/components/PickupLocationMap";
import { PlaceStarRating } from "@/components/PlaceStarRating";
import {
  getPlaceBuildingImage,
  getPlaceById,
  getPlaceMenuProducts,
} from "@/constants/data";
import {
  getPlaceCategory,
  getPlaceRating,
} from "@/utils/geo";
import { openDirectionsToPlace } from "@/utils/openDirections";
import {
  getUserPlaceRating,
  setUserPlaceRating,
} from "@/utils/placeUserRating";

const NAV_BG = "#E9DAD6";
const BG = "#FDF8F5";
const PRIMARY = "#4A151B";
const TEXT_PRIMARY = "#2D2926";
const TEXT_SECONDARY = "#757575";
const DIVIDER = "#E8E0DA";

export default function PlaceDetailScreen() {
  const { id, distance } = useLocalSearchParams<{
    id: string;
    distance?: string;
  }>();
  const placeId = Array.isArray(id) ? id[0] : id;
  const distanceLabel =
    typeof distance === "string"
      ? distance
      : Array.isArray(distance)
        ? distance[0]
        : undefined;

  const insets = useSafeAreaInsets();
  const router = useRouter();
  const place = placeId ? getPlaceById(placeId) : undefined;
  const products = place ? getPlaceMenuProducts(place) : [];
  const category = place ? getPlaceCategory(place) : "bakery";
  const communityRating = place ? getPlaceRating(place) : 0;
  const buildingImage = place
    ? getPlaceBuildingImage(place, products[0]?.image)
    : undefined;

  const [userRating, setUserRating] = useState<number | null>(null);

  useEffect(() => {
    if (placeId) {
      setUserRating(getUserPlaceRating(placeId));
    }
  }, [placeId]);

  const handleRate = (stars: number) => {
    if (!placeId) return;
    setUserPlaceRating(placeId, stars);
    setUserRating(stars);
  };

  const handleDirections = () => {
    if (!place) return;
    openDirectionsToPlace(place.location, { label: place.name });
  };

  if (!place || products.length === 0) {
    return (
      <View style={[styles.root, { paddingTop: insets.top + 24 }]}>
        <Stack.Screen options={{ headerShown: false }} />
        <Pressable onPress={() => router.back()} style={styles.backOnly}>
          <Feather name="arrow-left" size={22} color={TEXT_PRIMARY} />
        </Pressable>
        <Text style={styles.notFound}>Seller not found</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.root}>
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <View style={styles.headerSide}>
            <Pressable
              onPress={() => router.back()}
              style={styles.headerBtn}
              hitSlop={12}
            >
              <Feather name="arrow-left" size={22} color={TEXT_PRIMARY} />
            </Pressable>
          </View>
          <Text style={styles.headerBrand}>Savor</Text>
          <View style={[styles.headerSide, styles.headerRight]}>
            <View style={styles.headerRightSpacer} />
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
        >
          {buildingImage && (
            <View style={styles.heroWrap}>
              <Image
                source={{ uri: buildingImage }}
                style={styles.heroImage}
                contentFit="cover"
              />
              <View style={styles.heroOverlay} />
              <View style={styles.buildingBadge}>
                <Feather name="home" size={12} color="#fff" />
                <Text style={styles.buildingBadgeText}>Storefront</Text>
              </View>
            </View>
          )}

          <View style={styles.content}>
            <View style={styles.titleBlock}>
              <Text style={styles.category}>
                {category === "bakery" ? "ARTISAN BAKERY" : "RESTAURANT"}
              </Text>
              <Text style={styles.placeName}>{place.name}</Text>
              <View style={styles.metaRow}>
                <Feather name="map-pin" size={14} color={TEXT_SECONDARY} />
                <Text style={styles.address}>{place.address}</Text>
              </View>
            </View>

            <PlaceStarRating
              value={userRating}
              communityRating={communityRating}
              onChange={handleRate}
            />

            <View style={styles.chipsRow}>
              {distanceLabel && (
                <View style={styles.chip}>
                  <Feather name="navigation" size={12} color={PRIMARY} />
                  <Text style={styles.chipText}>{distanceLabel}</Text>
                </View>
              )}
              <View style={styles.chip}>
                <Feather name="clock" size={12} color={PRIMARY} />
                <Text style={styles.chipText}>Ready 15–20 min</Text>
              </View>
              <View style={styles.chip}>
                <Feather name="package" size={12} color={PRIMARY} />
                <Text style={styles.chipText}>
                  {products.length} item{products.length !== 1 ? "s" : ""}
                </Text>
              </View>
            </View>

            <Pressable style={styles.directionsBtn} onPress={handleDirections}>
              <Feather name="navigation" size={18} color="#fff" />
              <Text style={styles.directionsBtnText}>Get directions</Text>
            </Pressable>

            <Text style={styles.sectionTitle}>Location</Text>
            <ErrorBoundary fallbackTitle="Map preview unavailable">
              <PickupLocationMap place={place} />
            </ErrorBoundary>

            <View style={styles.divider} />

            <Text style={styles.sectionTitle}>Available now</Text>
            <Text style={styles.sectionSub}>
              Surplus meals and treats ready for pickup today
            </Text>

            {products.map((product) => (
              <Pressable
                key={product.id}
                style={styles.productCard}
                onPress={() => router.push(`/product/${product.id}`)}
              >
                <Image
                  source={{ uri: product.image }}
                  style={styles.productImage}
                  contentFit="cover"
                />
                <View style={styles.productBody}>
                  <Text style={styles.productName} numberOfLines={2}>
                    {product.name}
                  </Text>
                  <Text style={styles.productDesc} numberOfLines={2}>
                    {product.description}
                  </Text>
                  <View style={styles.priceRow}>
                    {product.originalPrice > product.discountedPrice && (
                      <Text style={styles.oldPrice}>
                        ${product.originalPrice.toFixed(2)}
                      </Text>
                    )}
                    <Text style={styles.price}>
                      ${product.discountedPrice.toFixed(2)}
                    </Text>
                    {product.discountPercentage > 0 && (
                      <View style={styles.offBadge}>
                        <Text style={styles.offText}>
                          {product.discountPercentage}% off
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.stock}>
                    {product.quantityLeft} left · ends in{" "}
                    {product.expiringInHours < 1
                      ? `${Math.round(product.expiringInHours * 60)}m`
                      : `${product.expiringInHours.toFixed(1)}h`}
                  </Text>
                </View>
                <Feather
                  name="chevron-right"
                  size={20}
                  color={TEXT_SECONDARY}
                  style={styles.chevron}
                />
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BG,
  },
  notFound: {
    fontSize: 16,
    color: TEXT_PRIMARY,
    paddingHorizontal: 24,
  },
  backOnly: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: NAV_BG,
    paddingHorizontal: 12,
    paddingBottom: 10,
  },
  headerSide: {
    width: 88,
    flexDirection: "row",
    alignItems: "center",
  },
  headerBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerBrand: {
    flex: 1,
    textAlign: "center",
    fontSize: 22,
    fontWeight: "700",
    color: TEXT_PRIMARY,
    fontFamily: Platform.select({ ios: "Georgia", android: "serif" }),
  },
  headerRight: {
    justifyContent: "flex-end",
  },
  headerRightSpacer: {
    width: 40,
    height: 40,
  },
  heroWrap: {
    height: 200,
    backgroundColor: "#e8e0da",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(45, 41, 38, 0.12)",
  },
  content: {
    paddingHorizontal: 22,
    paddingTop: 20,
  },
  titleBlock: {
    marginBottom: 14,
  },
  buildingBadge: {
    position: "absolute",
    bottom: 14,
    left: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(45, 41, 38, 0.75)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  buildingBadgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  category: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.1,
    color: TEXT_SECONDARY,
    marginBottom: 6,
  },
  placeName: {
    fontSize: 28,
    fontWeight: "700",
    color: PRIMARY,
    marginBottom: 8,
    fontFamily: Platform.select({ ios: "Georgia", android: "serif" }),
    lineHeight: 34,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
  },
  address: {
    flex: 1,
    fontSize: 14,
    color: TEXT_SECONDARY,
    lineHeight: 20,
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F0EBE4",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  chipText: {
    fontSize: 12,
    fontWeight: "600",
    color: PRIMARY,
  },
  directionsBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: PRIMARY,
    borderRadius: 14,
    paddingVertical: 14,
    marginBottom: 24,
  },
  directionsBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: TEXT_PRIMARY,
    marginBottom: 4,
  },
  sectionSub: {
    fontSize: 14,
    color: TEXT_SECONDARY,
    marginBottom: 16,
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: DIVIDER,
    marginVertical: 24,
  },
  productCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 12,
    marginBottom: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  productImage: {
    width: 88,
    height: 88,
    borderRadius: 16,
    backgroundColor: "#e8e0da",
  },
  productBody: {
    flex: 1,
    marginLeft: 12,
    paddingRight: 4,
  },
  productName: {
    fontSize: 16,
    fontWeight: "700",
    color: TEXT_PRIMARY,
    marginBottom: 4,
  },
  productDesc: {
    fontSize: 12,
    color: TEXT_SECONDARY,
    lineHeight: 17,
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 4,
  },
  oldPrice: {
    fontSize: 13,
    color: TEXT_SECONDARY,
    textDecorationLine: "line-through",
  },
  price: {
    fontSize: 16,
    fontWeight: "800",
    color: PRIMARY,
  },
  offBadge: {
    backgroundColor: "#F8F0F0",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  offText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#C62828",
  },
  stock: {
    fontSize: 11,
    color: TEXT_SECONDARY,
    fontWeight: "500",
  },
  chevron: {
    marginLeft: 4,
  },
});
