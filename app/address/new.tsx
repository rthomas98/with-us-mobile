import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  TouchableOpacity, 
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// Address nickname options
const addressNicknames = ['Home', 'Office', 'Apartment', 'Parent\'s House'];

export default function NewAddressScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  
  // State
  const [nickname, setNickname] = useState<string>('');
  const [fullAddress, setFullAddress] = useState<string>('');
  const [isDefault, setIsDefault] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [showNicknameDropdown, setShowNicknameDropdown] = useState<boolean>(false);
  const [location, setLocation] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Get user's current location
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      } catch (error) {
        console.log('Error getting location:', error);
      }
    })();
  }, []);
  
  // Handle map region change
  const onRegionChange = (region: any) => {
    setLocation(region);
  };
  
  // Handle save address
  const handleSaveAddress = () => {
    // Show success message
    setShowSuccess(true);
    
    // After a short delay, navigate back
    setTimeout(() => {
      router.back();
    }, 2000);
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'New Address',
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
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView style={styles.scrollView}>
          {/* Map View */}
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              region={location}
              onRegionChangeComplete={onRegionChange}
            >
              <Marker
                coordinate={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                }}
              />
            </MapView>
          </View>
          
          {/* Address Form */}
          <View style={styles.formContainer}>
            <View style={styles.formHeader}>
              <ThemedText style={styles.formTitle}>Address</ThemedText>
              <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            
            {/* Success Message */}
            {showSuccess && (
              <View style={styles.successOverlay}>
                <View style={styles.successCard}>
                  <View style={styles.successIcon}>
                    <Ionicons name="checkmark" size={24} color="#fff" />
                  </View>
                  <ThemedText style={styles.successTitle}>Congratulations!</ThemedText>
                  <ThemedText style={styles.successMessage}>Your new address has been added.</ThemedText>
                  <TouchableOpacity 
                    style={styles.thanksButton}
                    onPress={() => router.back()}
                  >
                    <ThemedText style={styles.thanksButtonText}>Thanks</ThemedText>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            
            {/* Address Nickname */}
            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Address Nickname</ThemedText>
              <TouchableOpacity 
                style={styles.dropdown}
                onPress={() => setShowNicknameDropdown(!showNicknameDropdown)}
              >
                <ThemedText style={nickname ? styles.dropdownText : styles.dropdownPlaceholder}>
                  {nickname || 'Choose one'}
                </ThemedText>
                <Ionicons name="chevron-down" size={20} color="#000" />
              </TouchableOpacity>
              
              {showNicknameDropdown && (
                <View style={styles.dropdownMenu}>
                  {addressNicknames.map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setNickname(option);
                        setShowNicknameDropdown(false);
                      }}
                    >
                      <ThemedText style={styles.dropdownItemText}>{option}</ThemedText>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
            
            {/* Full Address */}
            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Full Address</ThemedText>
              <TextInput
                style={styles.addressInput}
                placeholder="Enter your full address..."
                value={fullAddress}
                onChangeText={setFullAddress}
                multiline
              />
            </View>
            
            {/* Default Address Checkbox */}
            <TouchableOpacity 
              style={styles.checkboxContainer}
              onPress={() => setIsDefault(!isDefault)}
            >
              <View style={[styles.checkbox, isDefault && styles.checkboxChecked]}>
                {isDefault && <Ionicons name="checkmark" size={16} color="#fff" />}
              </View>
              <ThemedText style={styles.checkboxLabel}>Make this as a default address</ThemedText>
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
              <ThemedText style={styles.addButtonText}>Add</ThemedText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const { width, height } = Dimensions.get('window');

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
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  mapContainer: {
    width: '100%',
    height: height * 0.3,
    backgroundColor: '#f5f5f5',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  formContainer: {
    padding: 20,
    position: 'relative',
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 14,
    backgroundColor: '#fff',
  },
  dropdownText: {
    fontSize: 16,
    color: '#000',
  },
  dropdownPlaceholder: {
    fontSize: 16,
    color: '#999',
  },
  dropdownMenu: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    zIndex: 10,
  },
  dropdownItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownItemText: {
    fontSize: 16,
  },
  addressInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    minHeight: 50,
    textAlignVertical: 'top',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  checkboxLabel: {
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#000',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  addButtonDisabled: {
    backgroundColor: '#ccc',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  successOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  successCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    width: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  successIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  successMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  thanksButton: {
    backgroundColor: '#000',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    width: '100%',
    alignItems: 'center',
  },
  thanksButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
