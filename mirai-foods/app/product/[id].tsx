import { Image } from 'expo-image';
import { StyleSheet, TouchableOpacity, View, ScrollView } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useState } from 'react';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { mockProducts } from '@/constants/data';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useCart } from '@/contexts/CartContext';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const product = mockProducts.find(p => p.id === id);

  if (!product) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Product not found</ThemedText>
      </ThemedView>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background, paddingTop: insets.top }]}> 
        <View style={[styles.customHeader , {backgroundColor: Colors[colorScheme ?? 'light'].background,
}]}>
          <TouchableOpacity style={styles.customBack} onPress={() => router.back()}>
            <ThemedText style={styles.customBackText}>
              <FontAwesome5 name="arrow-left" size={20} color="black" />
            </ThemedText>
          </TouchableOpacity>
          <ThemedText type="title" style={styles.customTitle}>Product Details</ThemedText>
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: insets.bottom + 100 }} showsVerticalScrollIndicator={false}>
          <View style={styles.productImageWrapper}>
            <Image source={{ uri: product.image }} style={styles.productImage} />
            <View style={styles.imageBadges}>
              <ThemedText style={styles.imageBadgeText}>Left {product.quantityLeft}</ThemedText>
              <ThemedText style={[styles.imageBadgeText, styles.discountBadgeText]}>-{product.discountPercentage}%</ThemedText>
            </View>
          </View>

          <View style={styles.detailsContainer}>
            <ThemedText type="title" style={styles.productName}>{product.name}</ThemedText>
            <ThemedText style={styles.description}>{product.description}</ThemedText>

            {product.freshnessGuarantee && (
              <View style={styles.guaranteeBadge}>
                <IconSymbol name="checkmark.seal" size={16} color="#4caf50" />
                <ThemedText style={styles.guaranteeText}>Freshness Guarantee</ThemedText>
              </View>
            )}

            <View style={styles.priceContainer}>
              <ThemedText style={styles.originalPrice}>Original: ${product.originalPrice}</ThemedText>
              <ThemedText style={styles.discountedPrice}>Now: ${product.discountedPrice}</ThemedText>
              <ThemedText style={styles.discount}>({product.discountPercentage}% off)</ThemedText>
            </View>

            <View style={styles.quantityContainer}>
              <TouchableOpacity style={styles.qtyBtn} onPress={() => setQuantity(Math.max(1, quantity - 1))}>
                <ThemedText style={styles.qtyBtnText}>-</ThemedText>
              </TouchableOpacity>
              <ThemedText style={styles.quantityText}>{quantity}</ThemedText>
              <TouchableOpacity style={styles.qtyBtn} onPress={() => setQuantity(Math.min(product.quantityLeft, quantity + 1))}>
                <ThemedText style={styles.qtyBtnText}>+</ThemedText>
              </TouchableOpacity>
            </View>

            <View style={styles.expiryContainer}>
              <IconSymbol name="timer" size={16} color="#d32f2f" />
              <ThemedText style={styles.expiryText}>
                Discount ends in {Math.floor(product.expiringInHours)}h {Math.max(0, Math.round((product.expiringInHours % 1) * 60))}m
              </ThemedText>
            </View>

            <TouchableOpacity style={[styles.reserveButton, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]} onPress={() => { addToCart(product, quantity); router.push('/(tabs)/payment'); }}>
              <ThemedText style={styles.reserveText}>Add to Cart ({quantity})</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.checkoutButton, { backgroundColor: '#fff', borderColor: Colors[colorScheme ?? 'light'].tint, borderWidth: 1, marginTop: 12 }]} onPress={() => router.push('/payment')}>
              <ThemedText style={[styles.reserveText, { color: Colors[colorScheme ?? 'light'].tint }]}>Checkout</ThemedText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  customBack: {
    paddingVertical: 1,
  },
  customBackText: {
    fontWeight: 'bold',
  },
  customTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerPlaceholder: {
    width: 60,
  },
  productImageWrapper: {
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: 250,
    borderRadius: 16,
  },
  imageBadges: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imageBadgeText: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  discountBadgeText: {
    color: '#d32f2f',
  },
  productStockText: {
    color: '#d32f2f',
  },
  detailsContainer: {
    padding: 16,
  },
  productName: {
    fontSize: 24,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
    color: Colors.light.icon,
  },
  guaranteeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    padding: 8,
    borderRadius: 8,
    marginBottom: 16,
  },
  guaranteeText: {
    marginLeft: 8,
    color: '#4caf50',
    fontWeight: 'bold',
  },
  priceContainer: {
    marginBottom: 16,
  },
  originalPrice: {
    textDecorationLine: 'line-through',
    color: '#888',
    fontSize: 16,
  },
  discountedPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  discount: {
    color: '#d32f2f',
    fontWeight: 'bold',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  qtyBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
  },
  qtyBtnText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    minWidth: 30,
    textAlign: 'center',
  },
  expiryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  expiryText: {
    marginLeft: 8,
    color: '#d32f2f',
    fontWeight: 'bold',
  },
  reserveButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  checkoutButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  reserveText: {
    color: Colors.light.accent,
    fontSize: 18,
    fontWeight: 'bold',
  },
});