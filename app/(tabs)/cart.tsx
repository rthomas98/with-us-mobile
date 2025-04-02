import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  ScrollView,
  StatusBar,
  Platform,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Colors
const black = '#000000';
const white = '#FFFFFF';
const gray = '#F5F5F5';
const lightGray = '#E5E5E5';
const darkGray = '#888888';
const red = '#FF3B30';

// Types
interface CartItem {
  id: string;
  name: string;
  price: number;
  size: string;
  quantity: number;
  image: any;
}

export default function CartScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const screenHeight = Dimensions.get('window').height;
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: '1',
      name: 'Regular Fit Slogan',
      price: 1190,
      size: 'L',
      quantity: 2,
      image: require('@/assets/images/shirts/shutterstock_1904909734.jpg'),
    },
    {
      id: '2',
      name: 'Regular Fit Polo',
      price: 1100,
      size: 'M',
      quantity: 1,
      image: require('@/assets/images/shirts/shutterstock_2161469387.jpg'),
    },
    {
      id: '3',
      name: 'Regular Fit Black',
      price: 1290,
      size: 'L',
      quantity: 1,
      image: require('@/assets/images/shirts/shutterstock_2391378139.jpg'),
    },
  ]);

  // Calculate totals
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shippingFee = subtotal > 0 ? 80 : 0;
  const vat = 0; // VAT calculation if needed
  const total = subtotal + shippingFee + vat;

  // Format price
  const formatPrice = (price: number) => {
    return `$ ${(price / 100).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  };

  // Increment quantity
  const incrementQuantity = (id: string) => {
    setCartItems(
      cartItems.map(item => 
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Decrement quantity
  const decrementQuantity = (id: string) => {
    setCartItems(
      cartItems.map(item => 
        item.id === id && item.quantity > 1 
          ? { ...item, quantity: item.quantity - 1 } 
          : item
      )
    );
  };

  // Remove item from cart
  const removeItem = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  // Navigate to checkout
  const goToCheckout = () => {
    router.push('/checkout');
  };

  // Navigate back
  const goBack = () => {
    router.back();
  };

  // Render cart item
  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItem}>
      <Image source={item.image} style={styles.itemImage} />
      
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemSize}>Size {item.size}</Text>
        <Text style={styles.itemPrice}>{formatPrice(item.price)}</Text>
      </View>
      
      <View style={styles.itemActions}>
        <TouchableOpacity 
          style={styles.removeButton} 
          onPress={() => removeItem(item.id)}
        >
          <Ionicons name="trash-outline" size={20} color={red} />
        </TouchableOpacity>
        
        <View style={styles.quantityControl}>
          <TouchableOpacity 
            style={[
              styles.quantityButton,
              item.quantity <= 1 && styles.quantityButtonDisabled
            ]}
            onPress={() => decrementQuantity(item.id)}
            disabled={item.quantity <= 1}
          >
            <Ionicons 
              name="remove" 
              size={18} 
              color={item.quantity <= 1 ? darkGray : black} 
            />
          </TouchableOpacity>
          
          <Text style={styles.quantityText}>{item.quantity}</Text>
          
          <TouchableOpacity 
            style={styles.quantityButton}
            onPress={() => incrementQuantity(item.id)}
          >
            <Ionicons name="add" size={18} color={black} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  // Empty cart view
  const EmptyCart = () => (
    <View style={styles.emptyCartContainer}>
      <Ionicons name="cart-outline" size={80} color={lightGray} />
      <Text style={styles.emptyCartTitle}>Your Cart Is Empty!</Text>
      <Text style={styles.emptyCartText}>
        When you add products, they'll appear here.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Ionicons name="arrow-back" size={24} color={black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Cart</Text>
        <TouchableOpacity style={styles.notificationButton} onPress={() => router.push('/notifications')}>
          <Ionicons name="notifications-outline" size={24} color={black} />
        </TouchableOpacity>
      </View>
      
      {cartItems.length > 0 ? (
        <View style={{flex: 1}}>
          <ScrollView 
            style={{flex: 1}}
            contentContainerStyle={{paddingHorizontal: 16, paddingBottom: 100}}
          >
            {/* Cart Items */}
            {cartItems.map((item) => (
              <React.Fragment key={item.id}>
                {renderCartItem({ item })}
              </React.Fragment>
            ))}
            
            {/* Order Summary */}
            <View style={styles.orderSummary}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Sub-total</Text>
                <Text style={styles.summaryValue}>{formatPrice(subtotal)}</Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>VAT (%)</Text>
                <Text style={styles.summaryValue}>{formatPrice(vat)}</Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Shipping fee</Text>
                <Text style={styles.summaryValue}>{formatPrice(shippingFee)}</Text>
              </View>
              
              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>{formatPrice(total)}</Text>
              </View>
            </View>
            
            {/* Checkout Button */}
            <View style={styles.checkoutButtonWrapper}>
              <TouchableOpacity 
                style={styles.checkoutButton}
                onPress={goToCheckout}
              >
                <Text style={styles.checkoutButtonText}>Go To Checkout</Text>
                <Ionicons name="arrow-forward" size={20} color={white} />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      ) : (
        <EmptyCart />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: lightGray,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: black,
  },
  notificationButton: {
    padding: 8,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 16,
    marginTop: 20,
    backgroundColor: white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: lightGray,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  itemDetails: {
    flex: 1,
    marginRight: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: black,
    marginBottom: 4,
  },
  itemSize: {
    fontSize: 14,
    color: darkGray,
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: black,
  },
  itemActions: {
    alignItems: 'flex-end',
  },
  removeButton: {
    padding: 8,
    marginBottom: 8,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: lightGray,
    borderRadius: 8,
    overflow: 'hidden',
  },
  quantityButton: {
    padding: 8,
    backgroundColor: white,
  },
  quantityButtonDisabled: {
    opacity: 0.5,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '500',
    color: black,
    paddingHorizontal: 12,
  },
  orderSummary: {
    padding: 16,
    backgroundColor: white,
    borderTopWidth: 1,
    borderTopColor: lightGray,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: darkGray,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '500',
    color: black,
  },
  totalRow: {
    marginTop: 8,
    marginBottom: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: lightGray,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: black,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: black,
  },
  checkoutButtonWrapper: {
    marginTop: 16,
    marginBottom: 16,
  },
  checkoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: black,
    borderRadius: 8,
    paddingVertical: 16,
    width: '100%',
  },
  checkoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: white,
    marginRight: 8,
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyCartTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: black,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyCartText: {
    fontSize: 16,
    color: darkGray,
    textAlign: 'center',
  },
});