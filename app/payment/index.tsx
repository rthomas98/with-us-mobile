import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// Types
interface PaymentMethod {
  id: string;
  type: 'card' | 'cash' | 'applepay';
  cardNumber?: string;
  cardBrand?: string;
  isDefault?: boolean;
}

export default function PaymentMethodScreen() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  
  // Mock payment methods
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
  
  const [selectedPaymentId, setSelectedPaymentId] = useState<string>(
    paymentMethods.find(p => p.isDefault)?.id || ''
  );
  
  // Handle delete card
  const handleDeleteCard = (id: string) => {
    Alert.alert(
      'Delete Card',
      'Are you sure you want to delete this card?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          onPress: () => {
            setPaymentMethods(prev => prev.filter(card => card.id !== id));
            if (selectedPaymentId === id) {
              setSelectedPaymentId(paymentMethods[0]?.id || '');
            }
          },
          style: 'destructive'
        }
      ]
    );
  };
  
  // Handle set as default
  const handleSetAsDefault = (id: string) => {
    setPaymentMethods(prev => 
      prev.map(card => ({
        ...card,
        isDefault: card.id === id
      }))
    );
    setSelectedPaymentId(id);
  };
  
  // Handle add new card
  const handleAddNewCard = () => {
    router.push('/payment/new-card');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Payment Methods',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerStyle: {
            backgroundColor: Colors[colorScheme ?? 'light'].background,
          },
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push('/notifications')} style={styles.notificationButton}>
              <Ionicons name="notifications-outline" size={24} color="#000" />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView style={styles.content}>
        <View style={styles.paymentOptions}>
          <TouchableOpacity 
            style={[
              styles.paymentOption,
              styles.selectedPaymentOption
            ]}
          >
            <Ionicons name="card-outline" size={24} color="#000" />
            <ThemedText style={styles.paymentOptionText}>Card</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.paymentOption}
            onPress={() => Alert.alert('Cash on Delivery', 'This payment method is only available during checkout.')}
          >
            <Ionicons name="cash-outline" size={24} color="#000" />
            <ThemedText style={styles.paymentOptionText}>Cash</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.paymentOption}
            onPress={() => Alert.alert('Apple Pay', 'This payment method is only available during checkout.')}
          >
            <Ionicons name="logo-apple" size={24} color="#000" />
            <ThemedText style={styles.paymentOptionText}>Apple Pay</ThemedText>
          </TouchableOpacity>
        </View>
        
        <ThemedText style={styles.sectionTitle}>My Cards</ThemedText>
        
        <View style={styles.savedCards}>
          {paymentMethods
            .filter(method => method.type === 'card')
            .map(card => (
              <View 
                key={card.id}
                style={styles.savedCard}
              >
                <View style={styles.cardInfo}>
                  <View style={styles.cardBrandContainer}>
                    <ThemedText style={styles.cardBrandText}>
                      {card.cardBrand === 'VISA' ? 'VISA' : 
                       card.cardBrand === 'mastercard' ? 'mastercard' : 'Card'}
                    </ThemedText>
                  </View>
                  <ThemedText style={styles.cardNumberText}>**** **** **** {card.cardNumber}</ThemedText>
                  {card.isDefault && (
                    <View style={styles.defaultBadge}>
                      <ThemedText style={styles.defaultBadgeText}>Default</ThemedText>
                    </View>
                  )}
                </View>
                
                <View style={styles.cardActions}>
                  {!card.isDefault && (
                    <TouchableOpacity 
                      style={styles.cardAction}
                      onPress={() => handleSetAsDefault(card.id)}
                    >
                      <Ionicons name="checkmark-circle-outline" size={20} color="#000" />
                      <ThemedText style={styles.cardActionText}>Set as default</ThemedText>
                    </TouchableOpacity>
                  )}
                  
                  <TouchableOpacity 
                    style={[styles.cardAction, styles.deleteAction]}
                    onPress={() => handleDeleteCard(card.id)}
                  >
                    <Ionicons name="trash-outline" size={20} color="#f44336" />
                    <ThemedText style={[styles.cardActionText, styles.deleteActionText]}>Delete</ThemedText>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
        </View>
        
        <TouchableOpacity 
          style={styles.addCardButton}
          onPress={handleAddNewCard}
        >
          <Ionicons name="add" size={24} color="#000" />
          <ThemedText style={styles.addCardText}>Add New Card</ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backButton: {
    marginLeft: 10,
  },
  notificationButton: {
    marginRight: 10,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 16,
  },
  paymentOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  paymentOption: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    marginHorizontal: 4,
  },
  selectedPaymentOption: {
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#000',
  },
  paymentOptionText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  savedCards: {
    marginBottom: 20,
  },
  savedCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardInfo: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  cardBrandContainer: {
    marginBottom: 8,
  },
  cardBrandText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardNumberText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  defaultBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  defaultBadgeText: {
    fontSize: 12,
    color: '#666',
  },
  cardActions: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#f9f9f9',
  },
  cardAction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    paddingVertical: 4,
  },
  cardActionText: {
    marginLeft: 4,
    fontSize: 14,
  },
  deleteAction: {
    marginLeft: 'auto',
  },
  deleteActionText: {
    color: '#f44336',
  },
  addCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#eee',
  },
  addCardText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
});
