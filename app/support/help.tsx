import React from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// Support options
interface SupportOption {
  id: string;
  title: string;
  icon: string;
  iconType: 'ionicons' | 'custom';
  action: () => void;
}

export default function HelpCenterScreen() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  
  // Handle contact options
  const handleCustomerService = () => {
    router.push('/support/customer-service');
  };
  
  const handleWhatsapp = () => {
    Linking.openURL('https://wa.me/1234567890').catch(() => {
      Alert.alert('Error', 'Could not open WhatsApp');
    });
  };
  
  const handleWebsite = () => {
    Linking.openURL('https://www.withus.com').catch(() => {
      Alert.alert('Error', 'Could not open website');
    });
  };
  
  const handleFacebook = () => {
    Linking.openURL('https://www.facebook.com/withus').catch(() => {
      Alert.alert('Error', 'Could not open Facebook');
    });
  };
  
  const handleTwitter = () => {
    Linking.openURL('https://www.twitter.com/withus').catch(() => {
      Alert.alert('Error', 'Could not open Twitter');
    });
  };
  
  const handleInstagram = () => {
    Linking.openURL('https://www.instagram.com/withus').catch(() => {
      Alert.alert('Error', 'Could not open Instagram');
    });
  };
  
  // Support options
  const supportOptions: SupportOption[] = [
    {
      id: 'customer-service',
      title: 'Customer Service',
      icon: 'headset-outline',
      iconType: 'ionicons',
      action: handleCustomerService
    },
    {
      id: 'whatsapp',
      title: 'Whatsapp',
      icon: 'logo-whatsapp',
      iconType: 'ionicons',
      action: handleWhatsapp
    },
    {
      id: 'website',
      title: 'Website',
      icon: 'globe-outline',
      iconType: 'ionicons',
      action: handleWebsite
    },
    {
      id: 'facebook',
      title: 'Facebook',
      icon: 'logo-facebook',
      iconType: 'ionicons',
      action: handleFacebook
    },
    {
      id: 'twitter',
      title: 'Twitter',
      icon: 'logo-twitter',
      iconType: 'ionicons',
      action: handleTwitter
    },
    {
      id: 'instagram',
      title: 'Instagram',
      icon: 'logo-instagram',
      iconType: 'ionicons',
      action: handleInstagram
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Help Center',
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
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.supportOptionsContainer}>
          {supportOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={styles.supportOption}
              onPress={option.action}
            >
              <Ionicons name={option.icon as any} size={24} color="#000" style={styles.supportOptionIcon} />
              <ThemedText style={styles.supportOptionText}>{option.title}</ThemedText>
              <Ionicons name="chevron-forward" size={20} color="#888" />
            </TouchableOpacity>
          ))}
        </View>
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
    padding: 16,
  },
  supportOptionsContainer: {
    marginTop: 8,
  },
  supportOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  supportOptionIcon: {
    marginRight: 16,
  },
  supportOptionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
});
