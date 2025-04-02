import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView,
  TextInput,
  Image,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '@/context/CartContext';

// Colors
const black = '#000000';
const white = '#FFFFFF';
const gray = '#F5F5F5';
const lightGray = '#E5E5E5';
const darkGray = '#888888';
const green = '#4CAF50';

// Types
interface Address {
  id: string;
  nickname: string;
  fullAddress: string;
  isDefault: boolean;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'cash' | 'applepay';
  cardNumber?: string;
  cardBrand?: string;
  isDefault?: boolean;
}

export default function CheckoutScreen() {
  const router = useRouter();
  const { cartItems, getCartTotal, clearCart } = useCart();
  
  // State
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      nickname: 'Home',
      fullAddress: '925 S Chugach St #APT 10, Alaska 99645',
      isDefault: true
    }
  ]);
  
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'card',
      cardNumber: '2512',
      cardBrand: 'VISA',
      isDefault: true
    },
    {
      id: '2',
      type: 'card',
      cardNumber: '5421',
      cardBrand: 'mastercard',
      isDefault: false
    },
    {
      id: '3',
      type: 'card',
      cardNumber: '2512',
      cardBrand: 'VISA',
      isDefault: false
    }
  ]);
  
  const [selectedAddressId, setSelectedAddressId] = useState<string>(addresses.find(a => a.isDefault)?.id || '');
  const [selectedPaymentId, setSelectedPaymentId] = useState<string>(paymentMethods.find(p => p.isDefault)?.id || '');
  const [promoCode, setPromoCode] = useState<string>('');
  const [showAddAddressModal, setShowAddAddressModal] = useState<boolean>(false);
  const [showAddCardModal, setShowAddCardModal] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  
  // Calculate totals
  const subtotal = getCartTotal();
  const vat = 0; // No VAT in this example
  const shippingFee = subtotal > 0 ? 80 : 0;
  const total = subtotal + vat + shippingFee;
  
  // Format price
  const formatPrice = (price: number) => {
    return `$ ${(price / 100).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  };
  
  // Get selected address
  const selectedAddress = addresses.find(address => address.id === selectedAddressId);
  
  // Get selected payment method
  const selectedPayment = paymentMethods.find(payment => payment.id === selectedPaymentId);
  
  // Handle add new address
  const handleAddAddress = () => {
    router.push('/address/new');
  };
  
  // Handle add new payment method
  const handleAddPaymentMethod = () => {
    router.push('/payment/new-card');
  };
  
  // Handle place order
  const handlePlaceOrder = () => {
    if (!selectedAddress) {
      Alert.alert('Error', 'Please select a delivery address');
      return;
    }
    
    if (!selectedPayment) {
      Alert.alert('Error', 'Please select a payment method');
      return;
    }
    
    // Show success message
    Alert.alert(
      'Order Placed Successfully',
      'Your order has been placed and will be processed soon.',
      [
        {
          text: 'OK',
          onPress: () => {
            // Clear cart and navigate back to home
            clearCart();
            router.push('/(tabs)');
          }
        }
      ]
    );
  };
  
  // Handle apply promo code
  const handleApplyPromoCode = () => {
    if (promoCode.trim() === '') {
      Alert.alert('Error', 'Please enter a promo code');
      return;
    }
    
    Alert.alert('Success', 'Promo code applied successfully');
    setPromoCode('');
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen 
        options={{
          headerShown: false
        }} 
      />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <TouchableOpacity style={styles.notificationIcon} onPress={() => router.push('/notifications')}>
          <Ionicons name="notifications-outline" size={24} color={black} />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Delivery Address */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Delivery Address</Text>
            {selectedAddress && (
              <TouchableOpacity onPress={handleAddAddress}>
                <Text style={styles.changeText}>Change</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {selectedAddress ? (
            <View style={styles.addressCard}>
              <View style={styles.addressIconContainer}>
                <Ionicons name="location-outline" size={24} color={darkGray} />
              </View>
              <View style={styles.addressDetails}>
                <Text style={styles.addressNickname}>{selectedAddress.nickname}</Text>
                <Text style={styles.addressText}>{selectedAddress.fullAddress}</Text>
              </View>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.addAddressButton}
              onPress={handleAddAddress}
            >
              <Ionicons name="add" size={24} color={black} />
              <Text style={styles.addAddressText}>Add New Address</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          
          <View style={styles.paymentOptions}>
            <TouchableOpacity 
              style={[
                styles.paymentOption,
                selectedPayment?.type === 'card' && styles.selectedPaymentOption
              ]}
              onPress={() => setSelectedPaymentId(paymentMethods.find(p => p.type === 'card')?.id || '')}
            >
              <Ionicons name="card-outline" size={24} color={black} />
              <Text style={styles.paymentOptionText}>Card</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.paymentOption,
                selectedPayment?.type === 'cash' && styles.selectedPaymentOption
              ]}
              onPress={() => Alert.alert('Cash on Delivery', 'This payment method is not available for this order.')}
            >
              <Ionicons name="cash-outline" size={24} color={black} />
              <Text style={styles.paymentOptionText}>Cash</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.paymentOption,
                selectedPayment?.type === 'applepay' && styles.selectedPaymentOption
              ]}
              onPress={() => Alert.alert('Apple Pay', 'This payment method is not available for this order.')}
            >
              <Ionicons name="logo-apple" size={24} color={black} />
              <Text style={styles.paymentOptionText}>Apple Pay</Text>
            </TouchableOpacity>
          </View>
          
          {selectedPayment?.type === 'card' && (
            <View style={styles.savedCards}>
              {paymentMethods
                .filter(method => method.type === 'card')
                .map(card => (
                  <TouchableOpacity 
                    key={card.id}
                    style={[
                      styles.savedCard,
                      card.id === selectedPaymentId && styles.selectedCard
                    ]}
                    onPress={() => setSelectedPaymentId(card.id)}
                  >
                    <View style={styles.cardBrandContainer}>
                      <Text style={styles.cardBrandText}>
                        {card.cardBrand === 'VISA' ? 'VISA' : 
                         card.cardBrand === 'mastercard' ? 'mastercard' : 'Card'}
                      </Text>
                    </View>
                    <Text style={styles.cardNumberText}>**** **** **** {card.cardNumber}</Text>
                    {card.isDefault && (
                      <View style={styles.defaultBadge}>
                        <Text style={styles.defaultBadgeText}>Default</Text>
                      </View>
                    )}
                    <View style={styles.radioButton}>
                      {card.id === selectedPaymentId && (
                        <View style={styles.radioButtonInner} />
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              
              <TouchableOpacity 
                style={styles.addCardButton}
                onPress={handleAddPaymentMethod}
              >
                <Ionicons name="add" size={24} color={black} />
                <Text style={styles.addCardText}>Add New Card</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        
        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryItemLabel}>Sub-total</Text>
            <Text style={styles.summaryItemValue}>{formatPrice(subtotal)}</Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryItemLabel}>VAT (%)</Text>
            <Text style={styles.summaryItemValue}>{formatPrice(vat)}</Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryItemLabel}>Shipping fee</Text>
            <Text style={styles.summaryItemValue}>{formatPrice(shippingFee)}</Text>
          </View>
          
          <View style={styles.totalItem}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatPrice(total)}</Text>
          </View>
          
          {/* Promo Code */}
          <View style={styles.promoCodeContainer}>
            <View style={styles.promoCodeInputContainer}>
              <Ionicons name="pricetag-outline" size={20} color={darkGray} style={styles.promoCodeIcon} />
              <TextInput
                style={styles.promoCodeInput}
                placeholder="Enter promo code"
                value={promoCode}
                onChangeText={setPromoCode}
              />
            </View>
            <TouchableOpacity 
              style={styles.promoCodeButton}
              onPress={handleApplyPromoCode}
            >
              <Text style={styles.promoCodeButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      
      {/* Place Order Button */}
      <View style={styles.placeOrderContainer}>
        <TouchableOpacity 
          style={styles.placeOrderButton}
          onPress={handlePlaceOrder}
        >
          <Text style={styles.placeOrderButtonText}>Place Order</Text>
        </TouchableOpacity>
      </View>
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
  notificationIcon: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginTop: 24,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: black,
    marginBottom: 16,
  },
  changeText: {
    fontSize: 16,
    fontWeight: '500',
    color: black,
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: lightGray,
  },
  addressIconContainer: {
    marginRight: 16,
  },
  addressDetails: {
    flex: 1,
  },
  addressNickname: {
    fontSize: 16,
    fontWeight: '600',
    color: black,
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: darkGray,
  },
  addAddressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: lightGray,
    borderStyle: 'dashed',
  },
  addAddressText: {
    fontSize: 16,
    fontWeight: '500',
    color: black,
    marginLeft: 8,
  },
  paymentOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  paymentOption: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: lightGray,
    marginHorizontal: 4,
  },
  selectedPaymentOption: {
    borderColor: black,
    borderWidth: 2,
  },
  paymentOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: black,
    marginTop: 4,
  },
  savedCards: {
    marginTop: 16,
  },
  savedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: lightGray,
    marginBottom: 12,
  },
  selectedCard: {
    borderColor: black,
    borderWidth: 2,
  },
  cardBrandContainer: {
    marginRight: 12,
  },
  cardBrandText: {
    fontSize: 16,
    fontWeight: '700',
    color: black,
  },
  cardNumberText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: black,
  },
  defaultBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: lightGray,
    borderRadius: 4,
    marginRight: 8,
  },
  defaultBadgeText: {
    fontSize: 12,
    color: black,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: black,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: black,
  },
  addCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: lightGray,
    borderStyle: 'dashed',
  },
  addCardText: {
    fontSize: 16,
    fontWeight: '500',
    color: black,
    marginLeft: 8,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryItemLabel: {
    fontSize: 16,
    color: darkGray,
  },
  summaryItemValue: {
    fontSize: 16,
    fontWeight: '500',
    color: black,
  },
  totalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
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
  promoCodeContainer: {
    flexDirection: 'row',
    marginTop: 24,
  },
  promoCodeInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: lightGray,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 12,
  },
  promoCodeIcon: {
    marginRight: 8,
  },
  promoCodeInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
  },
  promoCodeButton: {
    backgroundColor: black,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  promoCodeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: white,
  },
  placeOrderContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: lightGray,
  },
  placeOrderButton: {
    backgroundColor: black,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeOrderButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: white,
  },
  // Success Modal
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: white,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  successIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: green,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: black,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    color: darkGray,
    marginBottom: 24,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: black,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: white,
  },
});
