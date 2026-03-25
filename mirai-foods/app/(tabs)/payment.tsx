import { StyleSheet, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';

import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useCart } from '@/contexts/CartContext';

export default function PaymentScreen() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { cart, updateQuantity, removeFromCart, getTotal, clearCart } = useCart();

  const subtotal = getTotal();
  const delivery = cart.length > 0 ? 2.0 : 0;
  const total = Number((subtotal + delivery).toFixed(2));

  const handlePayment = () => {
    Alert.alert('Payment Successful', 'Your order has been placed!', [
      { text: 'OK', onPress: () => { clearCart(); router.push('/(tabs)'); } }
    ]);
  };

  if (cart.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors[colorScheme ?? 'light'].background, paddingTop: insets.top, paddingBottom: insets.bottom, justifyContent: 'center', alignItems: 'center' }}>
        <ThemedText type="title">Your cart is empty</ThemedText>
        <TouchableOpacity style={[styles.payButton, { backgroundColor: Colors[colorScheme ?? 'light'].tint, marginTop: 20 }]} onPress={() => router.push('/(tabs)')}>
          <ThemedText style={styles.payText}>Continue Shopping</ThemedText>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors[colorScheme ?? 'light'].background, paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <ScrollView contentContainerStyle={styles.container}>
        <ThemedText type="title" style={styles.title}>Cart</ThemedText>
        {cart.map((item) => (
          <View key={item.id} style={[styles.itemCard, { backgroundColor: Colors[colorScheme ?? 'light'].cardBackground }]}>
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <TouchableOpacity style={styles.removeIcon} onPress={() => removeFromCart(item.id)}>
              <Feather name="trash-2" size={20} color="#ff4444" />
            </TouchableOpacity>
            <View style={styles.itemDetails}>
              <ThemedText type="subtitle" style={styles.itemName}>{item.name}</ThemedText>
              <ThemedText style={styles.itemDescription}>{item.description}</ThemedText>
              <View style={styles.itemBottom}>
                <ThemedText style={styles.itemPrice}>${item.discountedPrice.toFixed(2)}</ThemedText>
                <View style={styles.quantityControls}>
                  <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQuantity(item.id, item.quantity - 1)}>
                    <ThemedText style={styles.qtyBtnText}>-</ThemedText>
                  </TouchableOpacity>
                  <ThemedText style={styles.itemQty}>{item.quantity}</ThemedText>
                  <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQuantity(item.id, item.quantity + 1)}>
                    <ThemedText style={styles.qtyBtnText}>+</ThemedText>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        ))}

        <View style={[styles.summaryCard, { backgroundColor: Colors[colorScheme ?? 'light'].cardBackground }]}> 
          <View style={styles.lineItem}><ThemedText>Subtotal</ThemedText><ThemedText>${subtotal.toFixed(2)}</ThemedText></View>
          <View style={styles.lineItem}><ThemedText>Delivery amount</ThemedText><ThemedText>${delivery.toFixed(2)}</ThemedText></View>
          <View style={styles.lineItem}><ThemedText>Total Amount</ThemedText><ThemedText>${total.toFixed(2)}</ThemedText></View>
        </View>

        <TouchableOpacity style={[styles.payButton, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]} onPress={handlePayment}>
          <ThemedText style={styles.payText}>Make Payment</ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 18,
  },
  itemCard: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    position: 'relative',
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemDescription: {
    color: '#777',
    marginVertical: 4,
  },
  itemBottom: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  itemPrice: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  qtyBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  qtyBtnText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemQty: {
    fontSize: 16,
    fontWeight: 'bold',
    minWidth: 20,
    textAlign: 'center',
  },
  removeBtn: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  removeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  summaryCard: {
    borderRadius: 12,
    padding: 16,
    marginTop: 10,
  },
  lineItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  payButton: {
    marginTop: 24,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  payText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});