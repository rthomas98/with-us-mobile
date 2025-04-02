import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Colors
const black = '#000000';
const white = '#FFFFFF';
const lightGray = '#E5E5E5';
const mediumGray = '#D3D3D3';
const red = '#FF3B30';

// Menu items
const menuItems = [
  {
    id: 'orders',
    title: 'My Orders',
    icon: 'cube-outline',
    route: '/orders',
  },
  {
    id: 'details',
    title: 'My Details',
    icon: 'person-outline',
    route: '/profile/details',
  },
  {
    id: 'address',
    title: 'Address Book',
    icon: 'home-outline',
    route: '/address',
  },
  {
    id: 'payment',
    title: 'Payment Methods',
    icon: 'card-outline',
    route: '/payment',
  },
  {
    id: 'reviews',
    title: 'Reviews',
    icon: 'star-outline',
    route: '/reviews',
  },
  {
    id: 'notifications',
    title: 'Notifications',
    icon: 'notifications-outline',
    route: '/notifications',
  },
  {
    id: 'faqs',
    title: 'FAQs',
    icon: 'help-circle-outline',
    route: '/support/faqs',
  },
  {
    id: 'help',
    title: 'Help Center',
    icon: 'headset-outline',
    route: '/support/help',
  },
];

export default function AccountScreen() {
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Handle menu item press
  const handleMenuItemPress = (route: string) => {
    // Use type assertion to handle the TypeScript error
    router.push(route as any);
  };

  // Show logout confirmation
  const showLogoutConfirmation = () => {
    setShowLogoutModal(true);
  };

  // Handle logout
  const handleLogout = () => {
    // Implement logout logic here
    setShowLogoutModal(false);
    router.replace('/(auth)');
  };

  // Cancel logout
  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.backButton}>
          {/* No back button on tab screen */}
        </View>
        <Text style={styles.headerTitle}>Account</Text>
        <TouchableOpacity style={styles.notificationIcon} onPress={() => router.push('/notifications' as any)}>
          <Ionicons name="notifications-outline" size={24} color={black} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Menu Items */}
        {menuItems.map((item, index) => (
          <React.Fragment key={item.id}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleMenuItemPress(item.route)}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemLeft}>
                <View style={styles.iconContainer}>
                  <Ionicons name={item.icon as any} size={24} color={black} />
                </View>
                <Text style={styles.menuItemTitle}>{item.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#AAAAAA" />
            </TouchableOpacity>
            
            {/* Add divider after each item except the last one in its group */}
            {(index !== 4 && index !== 6 && index !== 7) && <View style={styles.divider} />}
            
            {/* Add section divider after notifications and help center */}
            {(index === 4 || index === 6) && <View style={styles.sectionDivider} />}
          </React.Fragment>
        ))}

        {/* Logout Button */}
        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={showLogoutConfirmation}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={24} color={red} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Logout Confirmation Modal */}
      <Modal
        visible={showLogoutModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalIconContainer}>
              <Ionicons name="alert-circle" size={64} color={red} />
            </View>
            
            <Text style={styles.modalTitle}>Logout?</Text>
            <Text style={styles.modalMessage}>Are you sure you want to logout?</Text>
            
            <TouchableOpacity 
              style={styles.logoutConfirmButton} 
              onPress={handleLogout}
              activeOpacity={0.8}
            >
              <Text style={styles.logoutConfirmText}>Yes, Logout</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={cancelLogout}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelText}>No, Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  notificationIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuItemTitle: {
    fontSize: 16,
    color: black,
  },
  divider: {
    height: 1,
    backgroundColor: lightGray,
    marginLeft: 56,
  },
  sectionDivider: {
    height: 8,
    backgroundColor: mediumGray,
    opacity: 0.1,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 24,
  },
  logoutText: {
    fontSize: 16,
    color: red,
    marginLeft: 16,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContainer: {
    width: '100%',
    backgroundColor: white,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  modalIconContainer: {
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: black,
  },
  modalMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    color: '#666',
  },
  logoutConfirmButton: {
    width: '100%',
    backgroundColor: red,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  logoutConfirmText: {
    color: white,
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    width: '100%',
    backgroundColor: white,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelText: {
    color: black,
    fontSize: 16,
    fontWeight: '500',
  },
});