import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, Image, Text } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

// Define colors
const white = '#FFFFFF';
const black = '#000000';
const darkGray = '#777777';
const lightGray = '#F5F5F5';

// Define notification types
interface Notification {
  id: string;
  type: 'promo' | 'wallet' | 'service' | 'payment' | 'account';
  title: string;
  message: string;
  date: string;
  read: boolean;
}

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([
    // Sample notifications data
    {
      id: '1',
      type: 'promo',
      title: '30% Special Discount!',
      message: 'Special promotion only valid today.',
      date: 'Today',
      read: false
    },
    {
      id: '2',
      type: 'wallet',
      title: 'Top Up E-wallet Successfully!',
      message: 'You have top up your e-wallet.',
      date: 'Yesterday',
      read: false
    },
    {
      id: '3',
      type: 'service',
      title: 'New Service Available!',
      message: 'Now you can track order in real-time.',
      date: 'Yesterday',
      read: true
    },
    {
      id: '4',
      type: 'payment',
      title: 'Credit Card Connected!',
      message: 'Credit card has been linked.',
      date: 'June 7, 2023',
      read: true
    },
    {
      id: '5',
      type: 'account',
      title: 'Account Setup Successfully!',
      message: 'Your account has been created.',
      date: 'June 7, 2023',
      read: true
    }
  ]);
  
  // State to toggle between empty and filled notifications view
  const [hasNotifications, setHasNotifications] = useState(true);
  
  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };
  
  const clearAllNotifications = () => {
    setHasNotifications(false);
  };
  
  const restoreNotifications = () => {
    setHasNotifications(true);
  };
  
  const getNotificationIcon = (type: string) => {
    switch(type) {
      case 'promo':
        return <Ionicons name="pricetag-outline" size={24} color={darkGray} />;
      case 'wallet':
        return <Ionicons name="wallet-outline" size={24} color={darkGray} />;
      case 'service':
        return <Ionicons name="location-outline" size={24} color={darkGray} />;
      case 'payment':
        return <Ionicons name="card-outline" size={24} color={darkGray} />;
      case 'account':
        return <Ionicons name="person-outline" size={24} color={darkGray} />;
      default:
        return <Ionicons name="notifications-outline" size={24} color={darkGray} />;
    }
  };
  
  // Group notifications by date
  const groupedNotifications = notifications.reduce((groups: Record<string, Notification[]>, notification) => {
    const { date } = notification;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(notification);
    return groups;
  }, {});

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity 
          style={styles.trashButton} 
          onPress={hasNotifications ? clearAllNotifications : restoreNotifications}
        >
          <Ionicons 
            name={hasNotifications ? "trash-outline" : "refresh-outline"} 
            size={24} 
            color={black} 
          />
        </TouchableOpacity>
      </View>
      
      {hasNotifications ? (
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {Object.entries(groupedNotifications).map(([date, items]) => (
            <View key={date} style={styles.section}>
              <Text style={styles.sectionTitle}>{date}</Text>
              
              {items.map(notification => (
                <TouchableOpacity 
                  key={notification.id} 
                  style={styles.notificationItem}
                  onPress={() => markAsRead(notification.id)}
                >
                  <View style={styles.iconContainer}>
                    {getNotificationIcon(notification.type)}
                  </View>
                  <View style={styles.notificationContent}>
                    <Text style={styles.notificationTitle}>{notification.title}</Text>
                    <Text style={styles.notificationMessage}>{notification.message}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Ionicons name="notifications-outline" size={64} color={lightGray} />
          </View>
          <Text style={styles.emptyTitle}>You haven't gotten any notifications yet!</Text>
          <Text style={styles.emptyMessage}>We'll alert you when something cool happens.</Text>
        </View>
      )}
      
      {/* Bottom Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/(tabs)')}>
          <Ionicons name="home-outline" size={24} color={darkGray} />
          <Text style={styles.tabText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/(tabs)/search')}>
          <Ionicons name="search" size={24} color={darkGray} />
          <Text style={styles.tabText}>Search</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/(tabs)/saved')}>
          <Ionicons name="heart-outline" size={24} color={darkGray} />
          <Text style={styles.tabText}>Saved</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/(tabs)/cart')}>
          <Ionicons name="cart-outline" size={24} color={darkGray} />
          <Text style={styles.tabText}>Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/(tabs)/account')}>
          <Ionicons name="person-outline" size={24} color={darkGray} />
          <Text style={styles.tabText}>Account</Text>
        </TouchableOpacity>
      </View>
    </View>
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
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  trashButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 12,
    paddingHorizontal: 16,
  },
  notificationItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: darkGray,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
  },
  emptyMessage: {
    fontSize: 16,
    color: darkGray,
    textAlign: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: white,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 30,
    height: 85,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 12,
    marginTop: 4,
    color: darkGray,
  },
});
