import { Image } from "expo-image";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";
import { useCart } from "@/contexts/CartContext";

const BG = "#FDFBFA";
const PRIMARY = "#400511";
const TEXT_SECONDARY = "#707070";
const QTY_BG = "#EBEBEB";
const DIVIDER = "#E8E0DA";

export default function CartScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { cart, updateQuantity, removeFromCart, getTotal, clearCart } =
    useCart();

  const subtotal = getTotal();
  const total = subtotal;

  const handleCheckout = () => {
    Alert.alert("Order placed", "Your order has been placed!", [
      {
        text: "OK",
        onPress: () => {
          clearCart();
          router.push("/(tabs)");
        },
      },
    ]);
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Cart</Text>
      </View>

      {cart.length === 0 ? (
        <View
          style={[
            styles.empty,
            { paddingBottom: insets.bottom + 72 },
          ]}
        >
          <View style={styles.emptyInner}>
            <Text style={styles.emptyTitle}>Your cart is empty</Text>
            <Pressable
              style={[styles.checkoutBtn, styles.emptyContinueBtn]}
              onPress={() => router.push("/(tabs)")}
            >
              <Text style={styles.checkoutText}>Continue Shopping</Text>
              <Feather name="arrow-right" size={18} color="#fff" />
            </Pressable>
          </View>
        </View>
      ) : (
        <>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingBottom: 24,
            }}
            showsVerticalScrollIndicator={false}
          >
            {cart.map((item, index) => (
              <View key={item.id}>
                <View style={styles.cartItem}>
                  <Image
                    source={{ uri: item.image }}
                    style={styles.itemImage}
                    contentFit="cover"
                  />
                  <View style={styles.itemBody}>
                    <Pressable
                      style={styles.removeBtn}
                      onPress={() => removeFromCart(item.id)}
                      hitSlop={8}
                    >
                      <Feather name="x" size={18} color={TEXT_SECONDARY} />
                    </Pressable>
                    <Text style={styles.itemTitle}>{item.name}</Text>
                    <Text style={styles.itemDesc} numberOfLines={2}>
                      {item.description}
                    </Text>
                    <View style={styles.priceRow}>
                      {item.originalPrice > item.discountedPrice && (
                        <Text style={styles.itemOldPrice}>
                          ${item.originalPrice.toFixed(2)}
                        </Text>
                      )}
                      <Text style={styles.itemPrice}>
                        ${item.discountedPrice.toFixed(2)}
                      </Text>
                    </View>
                    <View style={styles.itemFooter}>
                      <View style={styles.qtyPill}>
                        <Pressable
                          onPress={() =>
                            item.quantity <= 1
                              ? removeFromCart(item.id)
                              : updateQuantity(item.id, item.quantity - 1)
                          }
                          style={styles.qtyBtn}
                        >
                          <Text style={styles.qtySymbol}>−</Text>
                        </Pressable>
                        <Text style={styles.qtyValue}>{item.quantity}</Text>
                        <Pressable
                          onPress={() =>
                            updateQuantity(
                              item.id,
                              Math.min(
                                item.quantity + 1,
                                item.quantityLeft
                              )
                            )
                          }
                          style={styles.qtyBtn}
                        >
                          <Text style={styles.qtySymbol}>+</Text>
                        </Pressable>
                      </View>
                    </View>
                  </View>
                </View>
                {index < cart.length - 1 && <View style={styles.divider} />}
              </View>
            ))}

            <View style={styles.summary}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValueMuted}>
                  ${subtotal.toFixed(2)}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Delivery Fee</Text>
                <Text style={styles.summaryFree}>Free</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
              </View>
            </View>
          </ScrollView>

          <View
            style={[
              styles.footer,
              { paddingBottom: Math.max(insets.bottom, 16) + 56 },
            ]}
          >
            <Pressable
              style={({ pressed }) => [
                styles.checkoutBtn,
                pressed && styles.checkoutPressed,
              ]}
              onPress={handleCheckout}
            >
              <Text style={styles.checkoutText}>Checkout</Text>
              <Feather name="arrow-right" size={20} color="#fff" />
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BG,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: PRIMARY,
    fontFamily: Platform.select({ ios: "Georgia", android: "serif" }),
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  itemOldPrice: {
    fontSize: 13,
    color: TEXT_SECONDARY,
    textDecorationLine: "line-through",
  },
  scroll: {
    flex: 1,
  },
  cartItem: {
    flexDirection: "row",
    paddingVertical: 16,
    gap: 14,
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 20,
    backgroundColor: "#e8e0da",
  },
  itemBody: {
    flex: 1,
    paddingRight: 4,
  },
  removeBtn: {
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 1,
    padding: 4,
  },
  itemTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: PRIMARY,
    paddingRight: 28,
    marginBottom: 4,
  },
  itemDesc: {
    fontSize: 13,
    color: TEXT_SECONDARY,
    lineHeight: 18,
    marginBottom: 8,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: PRIMARY,
    marginBottom: 10,
  },
  itemFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  qtyPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: QTY_BG,
    borderRadius: 24,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  qtyBtn: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  qtySymbol: {
    fontSize: 18,
    color: PRIMARY,
    fontWeight: "500",
  },
  qtyValue: {
    fontSize: 15,
    fontWeight: "600",
    color: PRIMARY,
    minWidth: 24,
    textAlign: "center",
  },
  divider: {
    height: 1,
    backgroundColor: DIVIDER,
  },
  summary: {
    marginTop: 8,
    paddingTop: 8,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 15,
    color: TEXT_SECONDARY,
  },
  summaryValueMuted: {
    fontSize: 15,
    color: TEXT_SECONDARY,
  },
  summaryFree: {
    fontSize: 15,
    fontWeight: "600",
    color: PRIMARY,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: DIVIDER,
    marginBottom: 14,
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  totalValue: {
    fontSize: 22,
    fontWeight: "700",
    color: PRIMARY,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: BG,
  },
  checkoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: PRIMARY,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 999,
  },
  checkoutPressed: {
    opacity: 0.92,
  },
  checkoutText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  emptyInner: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    maxWidth: 320,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    color: TEXT_SECONDARY,
    marginBottom: 24,
    textAlign: "center",
    width: "100%",
  },
  emptyContinueBtn: {
    alignSelf: "center",
  },
});
