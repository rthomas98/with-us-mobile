import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView,
  Image,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Colors
const black = '#000000';
const white = '#FFFFFF';
const lightGray = '#F5F5F5';
const mediumGray = '#D3D3D3';
const darkGray = '#666666';
const green = '#4CAF50';

// Order status types
type OrderStatus = 'Packing' | 'Picked' | 'In Transit' | 'Delivered' | 'Completed';

// Order item type
interface OrderItem {
  id: string;
  name: string;
  size: string;
  price: number;
  image: any;
  quantity: number;
}

// Order type
interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  paymentMethod: string;
  shippingAddress: string;
}

// Sample orders data
const sampleOrders: { [key: string]: Order } = {
  '1': {
    id: '1',
    date: 'April 2, 2025',
    status: 'In Transit',
    items: [
      {
        id: '101',
        name: 'Regular Fit Slogan',
        size: 'M',
        price: 1190,
        image: require('@/assets/images/shirts/shutterstock_1904909734.jpg'),
        quantity: 1
      }
    ],
    subtotal: 1190,
    shipping: 50,
    tax: 119,
    total: 1359,
    paymentMethod: 'Visa **** 4242',
    shippingAddress: '2336 Jack Warren Rd, Delta Junction, Alaska 99737, USA'
  },
  '2': {
    id: '2',
    date: 'April 1, 2025',
    status: 'Picked',
    items: [
      {
        id: '102',
        name: 'Regular Fit Polo',
        size: 'L',
        price: 1100,
        image: require('@/assets/images/shirts/shutterstock_2161469387.jpg'),
        quantity: 1
      }
    ],
    subtotal: 1100,
    shipping: 50,
    tax: 110,
    total: 1260,
    paymentMethod: 'Mastercard **** 5555',
    shippingAddress: '2417 Tongass Ave #111, Ketchikan, Alaska 99901, USA'
  },
  '3': {
    id: '3',
    date: 'March 30, 2025',
    status: 'In Transit',
    items: [
      {
        id: '103',
        name: 'Regular Fit Black',
        size: 'L',
        price: 1690,
        image: require('@/assets/images/shirts/shutterstock_2391378139.jpg'),
        quantity: 1
      }
    ],
    subtotal: 1690,
    shipping: 50,
    tax: 169,
    total: 1909,
    paymentMethod: 'PayPal',
    shippingAddress: '16 Rr 2, Ketchikan, Alaska 99901, USA'
  },
  '4': {
    id: '4',
    date: 'March 28, 2025',
    status: 'Packing',
    items: [
      {
        id: '104',
        name: 'Regular Fit V-Neck',
        size: 'S',
        price: 1290,
        image: require('@/assets/images/shirts/shutterstock_2494261525.jpg'),
        quantity: 1
      }
    ],
    subtotal: 1290,
    shipping: 50,
    tax: 129,
    total: 1469,
    paymentMethod: 'Apple Pay',
    shippingAddress: '925 S Chugach St #APT 10, Alaska 99645, USA'
  },
  '5': {
    id: '5',
    date: 'March 25, 2025',
    status: 'Picked',
    items: [
      {
        id: '105',
        name: 'Regular Fit Pink',
        size: 'M',
        price: 1341,
        image: require('@/assets/images/shirts/shutterstock_492187627.jpg'),
        quantity: 1
      }
    ],
    subtotal: 1341,
    shipping: 50,
    tax: 134,
    total: 1525,
    paymentMethod: 'Visa **** 1234',
    shippingAddress: '2417 Tongass Ave #111, Ketchikan, Alaska 99901, USA'
  }
};

export default function OrderDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch order details
    const timer = setTimeout(() => {
      if (id && sampleOrders[id]) {
        setOrder(sampleOrders[id]);
      }
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [id]);

  // Format price
  const formatPrice = (price: number) => {
    return `$ ${price.toLocaleString()}`;
  };

  // Handle track order
  const handleTrackOrder = () => {
    if (order) {
      router.push({
        pathname: '/orders/track',
        params: { id: order.id }
      } as any);
    }
  };

  // Handle reorder
  const handleReorder = () => {
    // In a real app, you would add the items to the cart
    // and navigate to the cart screen
    router.push('/cart' as any);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={black} />
      </SafeAreaView>
    );
  }

  if (!order) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={black} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Order Details</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.notFoundContainer}>
          <Ionicons name="alert-circle-outline" size={50} color={mediumGray} />
          <Text style={styles.notFoundText}>Order not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Details</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Order Info */}
        <View style={styles.orderInfoContainer}>
          <View style={styles.orderInfoRow}>
            <Text style={styles.orderInfoLabel}>Order ID</Text>
            <Text style={styles.orderInfoValue}>#{order.id}</Text>
          </View>
          <View style={styles.orderInfoRow}>
            <Text style={styles.orderInfoLabel}>Date</Text>
            <Text style={styles.orderInfoValue}>{order.date}</Text>
          </View>
          <View style={styles.orderInfoRow}>
            <Text style={styles.orderInfoLabel}>Status</Text>
            <View style={[
              styles.statusBadge,
              order.status === 'In Transit' && styles.transitBadge,
              order.status === 'Picked' && styles.pickedBadge,
              order.status === 'Packing' && styles.packingBadge,
              order.status === 'Completed' && styles.completedBadge
            ]}>
              <Text style={styles.statusText}>{order.status}</Text>
            </View>
          </View>
        </View>

        {/* Order Items */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Items</Text>
          {order.items.map((item) => (
            <View key={item.id} style={styles.orderItem}>
              <Image 
                source={item.image} 
                style={styles.productImage}
                resizeMode="cover"
              />
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemSize}>Size: {item.size}</Text>
                <View style={styles.itemPriceRow}>
                  <Text style={styles.itemPrice}>{formatPrice(item.price)}</Text>
                  <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Order Summary */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>{formatPrice(order.subtotal)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Shipping</Text>
              <Text style={styles.summaryValue}>{formatPrice(order.shipping)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax</Text>
              <Text style={styles.summaryValue}>{formatPrice(order.tax)}</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{formatPrice(order.total)}</Text>
            </View>
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <View style={styles.paymentContainer}>
            <Ionicons name="card-outline" size={24} color={black} />
            <Text style={styles.paymentText}>{order.paymentMethod}</Text>
          </View>
        </View>

        {/* Shipping Address */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Shipping Address</Text>
          <View style={styles.addressContainer}>
            <Ionicons name="location-outline" size={24} color={black} />
            <Text style={styles.addressText}>{order.shippingAddress}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          {order.status !== 'Completed' && (
            <TouchableOpacity 
              style={styles.trackButton}
              onPress={handleTrackOrder}
            >
              <Text style={styles.trackButtonText}>Track Order</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={[
              styles.reorderButton,
              order.status !== 'Completed' && styles.secondaryButton
            ]}
            onPress={handleReorder}
          >
            <Text style={[
              styles.reorderButtonText,
              order.status !== 'Completed' && styles.secondaryButtonText
            ]}>Reorder</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: black,
  },
  placeholder: {
    width: 40,
    height: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  orderInfoContainer: {
    backgroundColor: white,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    marginBottom: 8,
    shadowColor: black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  orderInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderInfoLabel: {
    fontSize: 14,
    color: darkGray,
  },
  orderInfoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: black,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: lightGray,
  },
  transitBadge: {
    backgroundColor: '#E3F2FD',
  },
  pickedBadge: {
    backgroundColor: '#E8F5E9',
  },
  packingBadge: {
    backgroundColor: '#FFF3E0',
  },
  completedBadge: {
    backgroundColor: '#E8F5E9',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  sectionContainer: {
    backgroundColor: white,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: black,
    marginBottom: 16,
  },
  orderItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: lightGray,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: black,
    marginBottom: 4,
  },
  itemSize: {
    fontSize: 14,
    color: darkGray,
    marginBottom: 8,
  },
  itemPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '500',
    color: black,
  },
  itemQuantity: {
    fontSize: 14,
    color: darkGray,
  },
  summaryContainer: {
    backgroundColor: white,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: darkGray,
  },
  summaryValue: {
    fontSize: 14,
    color: black,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: lightGray,
    marginTop: 8,
    paddingTop: 16,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: black,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '600',
    color: black,
  },
  paymentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentText: {
    fontSize: 14,
    color: black,
    marginLeft: 12,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  addressText: {
    flex: 1,
    fontSize: 14,
    color: black,
    marginLeft: 12,
    lineHeight: 20,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 24,
  },
  trackButton: {
    flex: 1,
    backgroundColor: black,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginRight: 8,
  },
  trackButtonText: {
    color: white,
    fontSize: 16,
    fontWeight: '600',
  },
  reorderButton: {
    flex: 1,
    backgroundColor: black,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginLeft: 8,
  },
  secondaryButton: {
    backgroundColor: white,
    borderWidth: 1,
    borderColor: black,
  },
  reorderButtonText: {
    color: white,
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: black,
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFoundText: {
    fontSize: 18,
    fontWeight: '500',
    color: darkGray,
    marginTop: 16,
  },
});
