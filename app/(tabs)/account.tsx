import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
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

  // Handle menu item press
  const handleMenuItemPress = (route: string) => {
    // Use type assertion to handle the TypeScript error
    router.push(route as any);
  };

  // Handle logout
  const handleLogout = () => {
    // Implement logout logic here
    router.replace('/(auth)/login');
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
            {(index !== 4 && index !== 6) && <View style={styles.divider} />}
            
            {/* Add section divider after notifications and help center */}
            {(index === 4 || index === 6) && <View style={styles.sectionDivider} />}
          </React.Fragment>
        ))}

        {/* Logout Button */}
        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={24} color={red} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
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
});