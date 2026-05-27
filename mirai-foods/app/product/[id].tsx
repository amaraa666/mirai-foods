import { Image } from "expo-image";
import {
  Platform,
  StyleSheet,
  View,
  ScrollView,
  Text,
  Pressable,
} from "react-native";
import { useLocalSearchParams, Stack, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";
import { PickupLocationMap } from "@/components/PickupLocationMap";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { getDisplayProduct, getPlaceById } from "@/constants/data";
import { useCart } from "@/contexts/CartContext";
import { formatOfferEnds, formatQuantityLeft } from "@/utils/product";

const NAV_BG = "#E9DAD6";
const BG = "#FDF8F5";
const TEXT_PRIMARY = "#2D2926";
const PRICE_COLOR = "#4A151B";
const TEXT_SECONDARY = "#757575";
const HERO_BG = "#FDF8F5";
const DIVIDER = "#E8E0DA";

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { addToCart } = useCart();

  const productId = Array.isArray(id) ? id[0] : id;
  const product = productId ? getDisplayProduct(productId) : undefined;
  const place = product ? getPlaceById(product.placeId) : undefined;

  if (!product) {
    return (
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <Text style={styles.notFound}>Product not found</Text>
      </View>
    );
  }

  const heroUri = product.image;
  const offerEnds = formatOfferEnds(product.expiringInHours);
  const quantityLabel = formatQuantityLeft(product.quantityLeft);
  const isUrgent = product.expiringInHours > 0 && product.expiringInHours < 1;

  const bakeryName = place?.name ?? "Pickup location";
  const bakeryAddress = place?.address ?? "Ulaanbaatar";

  const goToSeller = () => {
    if (place) {
      router.push(`/place/${place.id}`);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.root}>
        {/* Header */}
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
          style={styles.scroll}
          contentContainerStyle={{
            paddingBottom: insets.bottom + 24,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero */}
          <View style={styles.heroWrapper}>
            <View style={styles.heroInner}>
              <Image
                source={{ uri: heroUri }}
                style={styles.heroImage}
                contentFit="cover"
              />
              <View style={styles.heroBadgesTop}>
                {offerEnds && (
                  <View
                    style={[
                      styles.timeBadge,
                      isUrgent && styles.timeBadgeUrgent,
                    ]}
                  >
                    <Feather
                      name="clock"
                      size={12}
                      color="#fff"
                      style={styles.badgeIcon}
                    />
                    <Text style={styles.timeBadgeText}>{offerEnds}</Text>
                  </View>
                )}
                {product.discountPercentage > 0 && (
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountBadgeText}>
                      {product.discountPercentage}% OFF
                    </Text>
                  </View>
                )}
              </View>
              {quantityLabel != null && (
                <View
                  style={[
                    styles.stockBadge,
                    product.quantityLeft <= 0 && styles.stockBadgeSoldOut,
                  ]}
                >
                  <Feather
                    name="package"
                    size={12}
                    color="#fff"
                    style={styles.badgeIcon}
                  />
                  <Text style={styles.stockBadgeText}>{quantityLabel}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Title & price */}
          <View style={styles.content}>
            <Text style={styles.collectionLabel}>ARTISAN COLLECTION</Text>
            <View style={styles.titleRow}>
              <Text style={styles.productTitle}>{product.name}</Text>
              <View style={styles.priceBlock}>
                {product.originalPrice > product.discountedPrice && (
                  <Text style={styles.originalPrice}>
                    ${product.originalPrice.toFixed(2)}
                  </Text>
                )}
                <Text style={styles.price}>
                  ${product.discountedPrice.toFixed(2)}
                </Text>
              </View>
            </View>

            {/* Pickup location */}
            <Text style={styles.sectionHeading}>Pickup Location</Text>
            {place ? (
              <Pressable
                style={styles.sellerLink}
                onPress={goToSeller}
              >
                <Text style={styles.bakeryName}>{bakeryName}</Text>
                <Feather name="chevron-right" size={18} color={PRICE_COLOR} />
              </Pressable>
            ) : (
              <Text style={styles.bakeryNameStatic}>{bakeryName}</Text>
            )}
            <Text style={styles.bakeryAddress}>{bakeryAddress}</Text>
            {(offerEnds || quantityLabel) && (
              <View style={styles.offerMetaRow}>
                {offerEnds && (
                  <View
                    style={[
                      styles.offerMetaChip,
                      isUrgent && styles.offerMetaChipUrgent,
                    ]}
                  >
                    <Feather
                      name="clock"
                      size={13}
                      color={isUrgent ? "#C62828" : TEXT_SECONDARY}
                    />
                    <Text
                      style={[
                        styles.offerMetaText,
                        isUrgent && styles.offerMetaTextUrgent,
                      ]}
                    >
                      {offerEnds}
                    </Text>
                  </View>
                )}
                {quantityLabel != null && (
                  <View style={styles.offerMetaChip}>
                    <Feather name="package" size={13} color={TEXT_SECONDARY} />
                    <Text style={styles.offerMetaText}>{quantityLabel}</Text>
                  </View>
                )}
              </View>
            )}
            <View style={styles.readyRow}>
              <Feather name="clock" size={14} color={TEXT_SECONDARY} />
              <Text style={styles.readyText}>Ready in 15–20 mins</Text>
            </View>

            {place && (
              <ErrorBoundary fallbackTitle="Map preview unavailable">
                <PickupLocationMap place={place} />
              </ErrorBoundary>
            )}

            <View style={styles.divider} />

            <Text style={styles.description}>{product.description}</Text>

            <Pressable
              style={({ pressed }) => [
                styles.ctaBtn,
                pressed && styles.ctaPressed,
                product.quantityLeft <= 0 && styles.ctaDisabled,
              ]}
              disabled={product.quantityLeft <= 0}
              onPress={() => {
                addToCart(product, 1);
                router.push("/(tabs)/payment" as const);
              }}
            >
              <Text style={styles.ctaText}>
                {product.quantityLeft <= 0 ? "Sold out" : "Add to Cart"}
              </Text>
            </Pressable>
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
    padding: 24,
    color: TEXT_PRIMARY,
    fontSize: 16,
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
    letterSpacing: -0.3,
  },
  headerRight: {
    justifyContent: "flex-end",
  },
  headerRightSpacer: {
    width: 40,
    height: 40,
  },
  scroll: {
    flex: 1,
  },
  heroWrapper: {
    backgroundColor: BG,
    paddingHorizontal: 0,
    paddingBottom: 0,
  },
  heroInner: {
    backgroundColor: HERO_BG,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: "hidden",
    marginHorizontal: 0,
  },
  heroImage: {
    width: "100%",
    height: 380,
  },
  heroBadgesTop: {
    position: "absolute",
    top: 16,
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
  },
  timeBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(45, 41, 38, 0.82)",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
    maxWidth: "58%",
  },
  timeBadgeUrgent: {
    backgroundColor: "rgba(180, 30, 45, 0.92)",
  },
  timeBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  discountBadge: {
    backgroundColor: "rgba(180, 30, 45, 0.88)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: "auto",
  },
  discountBadgeText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  stockBadge: {
    position: "absolute",
    bottom: 16,
    left: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(45, 41, 38, 0.82)",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
  },
  stockBadgeSoldOut: {
    backgroundColor: "rgba(100, 100, 100, 0.9)",
  },
  stockBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  badgeIcon: {
    marginRight: 5,
  },
  priceBlock: {
    alignItems: "flex-end",
    gap: 2,
  },
  originalPrice: {
    fontSize: 14,
    fontWeight: "500",
    color: TEXT_SECONDARY,
    textDecorationLine: "line-through",
  },
  content: {
    backgroundColor: BG,
    paddingHorizontal: 22,
    paddingTop: 18,
  },
  collectionLabel: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1.2,
    color: TEXT_SECONDARY,
    marginBottom: 10,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 28,
    gap: 16,
  },
  productTitle: {
    flex: 1,
    fontSize: 28,
    fontWeight: "700",
    color: TEXT_PRIMARY,
    lineHeight: 34,
    letterSpacing: -0.5,
  },
  price: {
    fontSize: 28,
    fontWeight: "800",
    color: PRICE_COLOR,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: "700",
    color: TEXT_PRIMARY,
    marginBottom: 10,
  },
  sellerLink: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 4,
    marginBottom: 4,
  },
  bakeryName: {
    fontSize: 16,
    fontWeight: "700",
    color: PRICE_COLOR,
  },
  bakeryNameStatic: {
    fontSize: 15,
    fontWeight: "600",
    color: TEXT_PRIMARY,
    marginBottom: 4,
  },
  bakeryAddress: {
    fontSize: 14,
    color: TEXT_SECONDARY,
    lineHeight: 20,
    marginBottom: 10,
  },
  offerMetaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  offerMetaChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F0EBE4",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  offerMetaChipUrgent: {
    backgroundColor: "#FFF0F0",
  },
  offerMetaText: {
    fontSize: 12,
    fontWeight: "600",
    color: TEXT_SECONDARY,
  },
  offerMetaTextUrgent: {
    color: "#C62828",
  },
  readyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 16,
  },
  readyText: {
    fontSize: 13,
    color: TEXT_SECONDARY,
  },
  divider: {
    height: 1,
    backgroundColor: DIVIDER,
    marginBottom: 20,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    color: TEXT_SECONDARY,
    marginBottom: 28,
  },
  ctaBtn: {
    backgroundColor: PRICE_COLOR,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  ctaPressed: {
    opacity: 0.9,
  },
  ctaDisabled: {
    opacity: 0.45,
  },
  ctaText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
