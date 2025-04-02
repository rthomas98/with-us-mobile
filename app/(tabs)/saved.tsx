import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  FlatList, 
  Image, 
  ScrollView 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

// Define colors
const white = '#FFFFFF';
const black = '#000000';
const lightGray = '#F5F5F5';
const darkGray = '#888888';
const red = '#FF0000';

// Define types
interface SavedProduct {
  id: string;
  name: string;
  price: number;
  discountPercentage?: number;
  image: any;
  isSaved: boolean;
}

export default function SavedScreen() {
  const router = useRouter();
  const [savedProducts, setSavedProducts] = useState<SavedProduct[]>([
    { 
      id: '1', 
      name: 'Regular Fit Slogan', 
      price: 1190, 
      image: require('@/assets/images/shirts/shutterstock_1904909734.jpg'),
      isSaved: true
    },
    { 
      id: '2', 
      name: 'Regular Fit Polo', 
      price: 1190, 
      image: require('@/assets/images/shirts/shutterstock_2161469387.jpg'),
      isSaved: true
    },
    { 
      id: '3', 
      name: 'Regular Fit Black', 
      price: 1190, 
      image: require('@/assets/images/shirts/shutterstock_2391378139.jpg'),
      isSaved: true
    },
    { 
      id: '4', 
      name: 'Regular Fit V-Neck', 
      price: 1190, 
      image: require('@/assets/images/shirts/shutterstock_2494261525.jpg'),
      isSaved: true
    },
    { 
      id: '5', 
      name: 'Regular Fit Slogan', 
      price: 1190, 
      image: require('@/assets/images/shirts/shutterstock_1904909734.jpg'),
      isSaved: true
    },
    { 
      id: '6', 
      name: 'Regular Fit Slogan', 
      price: 1190, 
      image: require('@/assets/images/shirts/shutterstock_2391378139.jpg'),
      isSaved: true
    },
  ]);

  // Toggle saved status
  const toggleSaved = (productId: string) => {
    setSavedProducts(prevProducts => 
      prevProducts.map(product => 
        product.id === productId 
          ? { ...product, isSaved: !product.isSaved } 
          : product
      ).filter(product => product.isSaved)
    );
  };

  // Navigate to product details
  const navigateToProduct = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  // Format price
  const formatPrice = (price: number) => {
    return `$${(price / 100).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Saved Items</Text>
        <TouchableOpacity 
          style={styles.notificationIcon} 
          onPress={() => router.push('/notifications')}
        >
          <Ionicons name="notifications-outline" size={24} color={black} />
        </TouchableOpacity>
      </View>
      
      {/* Content */}
      {savedProducts.length > 0 ? (
        <FlatList
          data={savedProducts}
          numColumns={2}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.productGrid}
          renderItem={({ item }) => (
            <View style={styles.productCard}>
              <TouchableOpacity 
                style={styles.productImageContainer}
                onPress={() => navigateToProduct(item.id)}
              >
                <Image source={item.image} style={styles.productImage} />
                <TouchableOpacity 
                  style={styles.heartButton}
                  onPress={() => toggleSaved(item.id)}
                >
                  <Ionicons 
                    name={item.isSaved ? "heart" : "heart-outline"} 
                    size={24} 
                    color={item.isSaved ? red : white} 
                  />
                </TouchableOpacity>
              </TouchableOpacity>
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>{formatPrice(item.price)}</Text>
              </View>
            </View>
          )}
        />
      ) : (
        <View style={styles.emptyStateContainer}>
          <View style={styles.emptyIconContainer}>
            <Ionicons name="heart-outline" size={64} color={darkGray} />
          </View>
          <Text style={styles.emptyStateTitle}>No Saved Items!</Text>
          <Text style={styles.emptyStateMessage}>
            You don't have any saved items.{'\n'}
            Go to home and add some.
          </Text>
        </View>
      )}
      
      {/* Bottom Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={styles.tabItem} 
          onPress={() => router.push('/')}
        >
          <Ionicons name="home-outline" size={24} color={darkGray} />
          <Text style={styles.tabLabel}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.tabItem} 
          onPress={() => router.push('/search')}
        >
          <Ionicons name="search-outline" size={24} color={darkGray} />
          <Text style={styles.tabLabel}>Search</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.tabItem, styles.activeTab]}>
          <Ionicons name="heart" size={24} color={black} />
          <Text style={[styles.tabLabel, styles.activeTabLabel]}>Saved</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.tabItem}
          onPress={() => router.push('/cart')}
        >
          <Ionicons name="cart-outline" size={24} color={darkGray} />
          <Text style={styles.tabLabel}>Cart</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.tabItem}
          onPress={() => router.push('/account')}
        >
          <Ionicons name="person-outline" size={24} color={darkGray} />
          <Text style={styles.tabLabel}>Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: white,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: black,
  },
  backButton: {
    padding: 8,
  },
  notificationIcon: {
    padding: 8,
  },
  productGrid: {
    padding: 8,
  },
  productCard: {
    flex: 1,
    margin: 8,
    maxWidth: '50%',
  },
  productImageContainer: {
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: lightGray,
    aspectRatio: 1,
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heartButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productInfo: {
    marginTop: 8,
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    color: black,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    color: darkGray,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
    color: black,
  },
  emptyStateMessage: {
    fontSize: 16,
    color: darkGray,
    textAlign: 'center',
    lineHeight: 24,
  },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: lightGray,
    paddingVertical: 8,
    backgroundColor: white,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  activeTab: {
    borderTopWidth: 2,
    borderTopColor: black,
    marginTop: -2,
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
    color: darkGray,
  },
  activeTabLabel: {
    color: black,
    fontWeight: '500',
  },
});