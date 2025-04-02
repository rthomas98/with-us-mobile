import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  TextInput,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Colors
const black = '#000000';
const white = '#FFFFFF';
const gray = '#F5F5F5';
const lightGray = '#E5E5E5';
const darkGray = '#888888';
const green = '#4CAF50';

export default function NewCardScreen() {
  const router = useRouter();
  
  // State
  const [cardNumber, setCardNumber] = useState<string>('');
  const [cardholderName, setCardholderName] = useState<string>('');
  const [expiryDate, setExpiryDate] = useState<string>('');
  const [cvv, setCvv] = useState<string>('');
  const [isDefault, setIsDefault] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  
  // Format card number with spaces
  const formatCardNumber = (text: string) => {
    // Remove all non-digit characters
    const cleaned = text.replace(/\D/g, '');
    
    // Add a space after every 4 digits
    let formatted = '';
    for (let i = 0; i < cleaned.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formatted += ' ';
      }
      formatted += cleaned[i];
    }
    
    // Limit to 19 characters (16 digits + 3 spaces)
    return formatted.slice(0, 19);
  };
  
  // Format expiry date (MM/YY)
  const formatExpiryDate = (text: string) => {
    // Remove all non-digit characters
    const cleaned = text.replace(/\D/g, '');
    
    // Format as MM/YY
    if (cleaned.length > 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    } else {
      return cleaned;
    }
  };
  
  // Handle card number change
  const handleCardNumberChange = (text: string) => {
    setCardNumber(formatCardNumber(text));
  };
  
  // Handle expiry date change
  const handleExpiryDateChange = (text: string) => {
    setExpiryDate(formatExpiryDate(text));
  };
  
  // Handle save card
  const handleSaveCard = () => {
    // Validate inputs
    if (cardNumber.replace(/\s/g, '').length < 16) {
      Alert.alert('Error', 'Please enter a valid card number');
      return;
    }
    
    if (!cardholderName) {
      Alert.alert('Error', 'Please enter the cardholder name');
      return;
    }
    
    if (expiryDate.length < 5) {
      Alert.alert('Error', 'Please enter a valid expiry date');
      return;
    }
    
    if (cvv.length < 3) {
      Alert.alert('Error', 'Please enter a valid CVV');
      return;
    }
    
    // Show success message
    setShowSuccess(true);
    
    // After a short delay, navigate back
    setTimeout(() => {
      router.back();
    }, 1500);
  };
  
  // If showing success message
  if (showSuccess) {
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
          <Text style={styles.headerTitle}>New Card</Text>
          <TouchableOpacity style={styles.notificationIcon} onPress={() => router.push('/notifications')}>
            <Ionicons name="notifications-outline" size={24} color={black} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.successContainer}>
          <View style={styles.successContent}>
            <View style={styles.successIcon}>
              <Ionicons name="checkmark" size={30} color={white} />
            </View>
            <Text style={styles.successTitle}>Congratulations!</Text>
            <Text style={styles.successText}>Your new card has been added.</Text>
            <TouchableOpacity 
              style={styles.successButton}
              onPress={() => router.back()}
            >
              <Text style={styles.successButtonText}>Thanks</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }
  
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
        <Text style={styles.headerTitle}>New Card</Text>
        <TouchableOpacity style={styles.notificationIcon} onPress={() => router.push('/notifications')}>
          <Ionicons name="notifications-outline" size={24} color={black} />
        </TouchableOpacity>
      </View>
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView style={styles.content}>
          {/* Card Preview */}
          <View style={styles.cardPreviewContainer}>
            <View style={styles.cardPreview}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardType}>VISA</Text>
                <Ionicons name="wifi-outline" size={24} color={white} />
              </View>
              
              <Text style={styles.cardNumberPreview}>
                {cardNumber || '•••• •••• •••• ••••'}
              </Text>
              
              <View style={styles.cardFooter}>
                <View>
                  <Text style={styles.cardLabelPreview}>CARD HOLDER</Text>
                  <Text style={styles.cardValuePreview}>
                    {cardholderName || 'Your Name'}
                  </Text>
                </View>
                
                <View>
                  <Text style={styles.cardLabelPreview}>EXPIRES</Text>
                  <Text style={styles.cardValuePreview}>
                    {expiryDate || 'MM/YY'}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          
          {/* Card Form */}
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Add New Card</Text>
            
            {/* Card Number */}
            <Text style={styles.inputLabel}>Card Number</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="0000 0000 0000 0000"
                value={cardNumber}
                onChangeText={handleCardNumberChange}
                keyboardType="numeric"
                maxLength={19}
              />
              <Ionicons name="card-outline" size={24} color={darkGray} style={styles.inputIcon} />
            </View>
            
            {/* Cardholder Name */}
            <Text style={styles.inputLabel}>Cardholder Name</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Your Name"
                value={cardholderName}
                onChangeText={setCardholderName}
              />
              <Ionicons name="person-outline" size={24} color={darkGray} style={styles.inputIcon} />
            </View>
            
            {/* Expiry Date and CVV */}
            <View style={styles.rowInputs}>
              <View style={styles.halfInput}>
                <Text style={styles.inputLabel}>Expiry Date</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="MM/YY"
                    value={expiryDate}
                    onChangeText={handleExpiryDateChange}
                    keyboardType="numeric"
                    maxLength={5}
                  />
                  <Ionicons name="calendar-outline" size={24} color={darkGray} style={styles.inputIcon} />
                </View>
              </View>
              
              <View style={styles.halfInput}>
                <Text style={styles.inputLabel}>CVV</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="123"
                    value={cvv}
                    onChangeText={setCvv}
                    keyboardType="numeric"
                    maxLength={4}
                    secureTextEntry
                  />
                  <Ionicons name="lock-closed-outline" size={24} color={darkGray} style={styles.inputIcon} />
                </View>
              </View>
            </View>
            
            {/* Default Card Checkbox */}
            <TouchableOpacity 
              style={styles.checkboxContainer}
              onPress={() => setIsDefault(!isDefault)}
            >
              <View style={[styles.checkbox, isDefault && styles.checkboxChecked]}>
                {isDefault && <Ionicons name="checkmark" size={16} color={white} />}
              </View>
              <Text style={styles.checkboxLabel}>Make this as a default card</Text>
            </TouchableOpacity>
            
            {/* Add Button */}
            <TouchableOpacity 
              style={[
                styles.addButton,
                (!cardNumber || !cardholderName || !expiryDate || !cvv) && styles.addButtonDisabled
              ]}
              onPress={handleSaveCard}
              disabled={!cardNumber || !cardholderName || !expiryDate || !cvv}
            >
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: white,
  },
  keyboardAvoidingView: {
    flex: 1,
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
  },
  cardPreviewContainer: {
    padding: 16,
    backgroundColor: gray,
  },
  cardPreview: {
    height: 200,
    backgroundColor: black,
    borderRadius: 16,
    padding: 24,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardType: {
    color: white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardNumberPreview: {
    color: white,
    fontSize: 22,
    letterSpacing: 2,
    marginVertical: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardLabelPreview: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    marginBottom: 4,
  },
  cardValuePreview: {
    color: white,
    fontSize: 16,
  },
  formContainer: {
    padding: 16,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: black,
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: black,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: lightGray,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  inputIcon: {
    marginLeft: 8,
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: lightGray,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: black,
    borderColor: black,
  },
  checkboxLabel: {
    fontSize: 16,
    color: black,
  },
  addButton: {
    backgroundColor: black,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonDisabled: {
    backgroundColor: lightGray,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: white,
  },
  // Success Screen
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  successContent: {
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
  successTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: black,
    marginBottom: 8,
  },
  successText: {
    fontSize: 16,
    color: darkGray,
    marginBottom: 24,
    textAlign: 'center',
  },
  successButton: {
    backgroundColor: black,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  successButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: white,
  },
});
