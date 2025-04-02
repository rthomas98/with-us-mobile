import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// Mock address data
const savedAddresses = [
  {
    id: '1',
    nickname: 'Home',
    isDefault: true,
    address: '925 S Chugach St #APT 10, Alaska 99615'
  },
  {
    id: '2',
    nickname: 'Office',
    isDefault: false,
    address: '2438 6th Ave, Ketchikan, Alaska 99901'
  },
  {
    id: '3',
    nickname: 'Apartment',
    isDefault: false,
    address: '2551 Vista Dr #B301, Juneau, Alaska 99801'
  },
  {
    id: '4',
    nickname: 'Parent\'s House',
    isDefault: false,
    address: '4821 Ridge Top Cir, Anchorage, Alaska 99508'
  }
];

export default function AddressScreen() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [selectedAddress, setSelectedAddress] = useState<string>('1'); // Default to first address

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Address',
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
        <ThemedText style={styles.sectionTitle}>Saved Address</ThemedText>
        
        {/* Address List */}
        <View style={styles.addressList}>
          {savedAddresses.map((address) => (
            <TouchableOpacity 
              key={address.id}
              style={styles.addressCard}
              onPress={() => setSelectedAddress(address.id)}
            >
              <View style={styles.addressInfo}>
                <Ionicons name="location-outline" size={24} color="#888" style={styles.locationIcon} />
                <View style={styles.addressDetails}>
                  <View style={styles.nicknameContainer}>
                    <ThemedText style={styles.nickname}>{address.nickname}</ThemedText>
                    {address.isDefault && (
                      <View style={styles.defaultBadge}>
                        <ThemedText style={styles.defaultText}>Default</ThemedText>
                      </View>
                    )}
                  </View>
                  <ThemedText style={styles.addressText}>{address.address}</ThemedText>
                </View>
              </View>
              <View style={[
                styles.radioButton, 
                selectedAddress === address.id && styles.radioButtonSelected
              ]}>
                {selectedAddress === address.id && (
                  <View style={styles.radioButtonInner} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Add New Address Button */}
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push('/address/new')}
        >
          <Ionicons name="add" size={24} color="#000" />
          <ThemedText style={styles.addButtonText}>Add New Address</ThemedText>
        </TouchableOpacity>
        
        {/* Apply Button */}
        <TouchableOpacity style={styles.applyButton}>
          <ThemedText style={styles.applyButtonText}>Apply</ThemedText>
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
    marginBottom: 16,
  },
  addressList: {
    marginBottom: 20,
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  addressInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  locationIcon: {
    marginRight: 12,
  },
  addressDetails: {
    flex: 1,
  },
  nicknameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  nickname: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  defaultBadge: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  defaultText: {
    fontSize: 12,
    color: '#666',
  },
  addressText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  radioButtonSelected: {
    borderColor: '#000',
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#000',
  },
  addButton: {
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
  addButtonText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  applyButton: {
    backgroundColor: '#000',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
