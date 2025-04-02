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
  Platform
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

// Address nickname options
const addressNicknames = ['Home', 'Work', 'Other'];

export default function NewAddressScreen() {
  const router = useRouter();
  
  // State
  const [nickname, setNickname] = useState<string>('');
  const [fullAddress, setFullAddress] = useState<string>('');
  const [isDefault, setIsDefault] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  
  // Handle save address
  const handleSaveAddress = () => {
    // Validate inputs
    if (!nickname) {
      Alert.alert('Error', 'Please select an address nickname');
      return;
    }
    
    if (!fullAddress) {
      Alert.alert('Error', 'Please enter your full address');
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
          <Text style={styles.headerTitle}>New Address</Text>
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
            <Text style={styles.successText}>Your new address has been added.</Text>
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
        <Text style={styles.headerTitle}>New Address</Text>
        <TouchableOpacity style={styles.notificationIcon} onPress={() => router.push('/notifications')}>
          <Ionicons name="notifications-outline" size={24} color={black} />
        </TouchableOpacity>
      </View>
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView style={styles.content}>
          {/* Map View (Placeholder) */}
          <View style={styles.mapContainer}>
            <View style={styles.mapPin}>
              <Ionicons name="location" size={24} color={black} />
            </View>
          </View>
          
          {/* Address Form */}
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Address</Text>
            <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
              <Ionicons name="close" size={24} color={black} />
            </TouchableOpacity>
            
            {/* Address Nickname */}
            <Text style={styles.inputLabel}>Address Nickname</Text>
            <TouchableOpacity style={styles.dropdown}>
              <Text style={nickname ? styles.dropdownText : styles.dropdownPlaceholder}>
                {nickname || 'Choose one'}
              </Text>
              <Ionicons name="chevron-down" size={20} color={black} />
            </TouchableOpacity>
            
            {/* Nickname Options */}
            <View style={styles.nicknameOptions}>
              {addressNicknames.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.nicknameOption,
                    nickname === option && styles.selectedNicknameOption
                  ]}
                  onPress={() => setNickname(option)}
                >
                  <Text 
                    style={[
                      styles.nicknameOptionText,
                      nickname === option && styles.selectedNicknameOptionText
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            {/* Full Address */}
            <Text style={styles.inputLabel}>Full Address</Text>
            <TextInput
              style={styles.addressInput}
              placeholder="Enter your full address..."
              value={fullAddress}
              onChangeText={setFullAddress}
              multiline
            />
            
            {/* Default Address Checkbox */}
            <TouchableOpacity 
              style={styles.checkboxContainer}
              onPress={() => setIsDefault(!isDefault)}
            >
              <View style={[styles.checkbox, isDefault && styles.checkboxChecked]}>
                {isDefault && <Ionicons name="checkmark" size={16} color={white} />}
              </View>
              <Text style={styles.checkboxLabel}>Make this as a default address</Text>
            </TouchableOpacity>
            
            {/* Add Button */}
            <TouchableOpacity 
              style={[
                styles.addButton,
                (!nickname || !fullAddress) && styles.addButtonDisabled
              ]}
              onPress={handleSaveAddress}
              disabled={!nickname || !fullAddress}
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
  mapContainer: {
    height: 250,
    backgroundColor: gray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPin: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: black,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    padding: 16,
    position: 'relative',
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: black,
    marginBottom: 24,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 4,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: black,
    marginBottom: 8,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: lightGray,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  dropdownText: {
    fontSize: 16,
    color: black,
  },
  dropdownPlaceholder: {
    fontSize: 16,
    color: darkGray,
  },
  nicknameOptions: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  nicknameOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: lightGray,
    marginRight: 8,
  },
  selectedNicknameOption: {
    backgroundColor: black,
  },
  nicknameOptionText: {
    fontSize: 14,
    color: black,
  },
  selectedNicknameOptionText: {
    color: white,
  },
  addressInput: {
    borderWidth: 1,
    borderColor: lightGray,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 24,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
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
