import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  Image, 
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCart } from '@/context/CartContext';

// Define colors
const white = '#FFFFFF';
const black = '#000000';
const darkGray = '#777777';
const lightGray = '#F5F5F5';
const red = '#FF0000';

// Define types
interface SearchHistory {
  id: string;
  query: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  discountPercentage?: number;
  image: any;
}

export default function SearchScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([
    { id: '1', query: 'Jeans' },
    { id: '2', query: 'Casual clothes' },
    { id: '3', query: 'Hoodie' },
    { id: '4', query: 'Nike shoes black' },
    { id: '5', query: 'V-neck tshirt' },
    { id: '6', query: 'Winter clothes' },
  ]);
  
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const { addToCart } = useCart();
  
  // Sample product data
  const products: Product[] = [
    { 
      id: '1', 
      name: 'Regular Fit Slogan', 
      price: 1190, 
      image: require('@/assets/images/shirts/shutterstock_1904909734.jpg') 
    },
    { 
      id: '2', 
      name: 'Regular Fit Polo', 
      price: 1100, 
      discountPercentage: 52, 
      image: require('@/assets/images/shirts/shutterstock_2161469387.jpg') 
    },
    { 
      id: '3', 
      name: 'Regular Fit Black', 
      price: 1690, 
      image: require('@/assets/images/shirts/shutterstock_2391378139.jpg') 
    },
    { 
      id: '4', 
      name: 'Regular Fit V-Neck', 
      price: 1290, 
      image: require('@/assets/images/shirts/shutterstock_2494261525.jpg') 
    },
    { 
      id: '5', 
      name: 'Regular Fit Crew Neck', 
      price: 1390, 
      image: require('@/assets/images/shirts/shutterstock_1904909734.jpg') 
    },
    { 
      id: '6', 
      name: 'Regular Fit Henley', 
      price: 1490, 
      discountPercentage: 30, 
      image: require('@/assets/images/shirts/shutterstock_2161469387.jpg') 
    },
    { 
      id: '7', 
      name: 'Regular Fit Long Sleeve', 
      price: 1790, 
      image: require('@/assets/images/shirts/shutterstock_2391378139.jpg') 
    },
    { 
      id: '8', 
      name: 'Regular Fit Button-Down', 
      price: 1990, 
      image: require('@/assets/images/shirts/shutterstock_2494261525.jpg') 
    },
    // Shirt products
    { 
      id: '9', 
      name: 'Cotton Shirt Blue', 
      price: 1290, 
      image: require('@/assets/images/shirts/shutterstock_1904909734.jpg') 
    },
    { 
      id: '10', 
      name: 'Linen Shirt White', 
      price: 1490, 
      discountPercentage: 25, 
      image: require('@/assets/images/shirts/shutterstock_2161469387.jpg') 
    },
    { 
      id: '11', 
      name: 'Dress Shirt Striped', 
      price: 1690, 
      image: require('@/assets/images/shirts/shutterstock_2391378139.jpg') 
    },
    { 
      id: '12', 
      name: 'Oxford Shirt Classic', 
      price: 1590, 
      image: require('@/assets/images/shirts/shutterstock_2494261525.jpg') 
    },
    { 
      id: '13', 
      name: 'Flannel Shirt Checkered', 
      price: 1390, 
      image: require('@/assets/images/shirts/shutterstock_1904909734.jpg') 
    },
    { 
      id: '14', 
      name: 'Denim Shirt Vintage', 
      price: 1790, 
      discountPercentage: 15, 
      image: require('@/assets/images/shirts/shutterstock_2161469387.jpg') 
    },
  ];
  
  // Format price
  const formatPrice = (price: number) => {
    return `$ ${(price / 100).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  };
  
  // Handle search
  const handleSearch = () => {
    if (searchQuery.trim() === '') return;
    
    // Add to search history if not already there
    if (!searchHistory.some(item => item.query.toLowerCase() === searchQuery.toLowerCase())) {
      const newHistory = {
        id: Date.now().toString(),
        query: searchQuery
      };
      setSearchHistory([newHistory, ...searchHistory]);
    }
    
    // Filter products based on search query
    const filtered = products.filter(product => 
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setSearchResults(filtered);
    setShowResults(true);
    setNoResults(filtered.length === 0);
    Keyboard.dismiss();
  };
  
  // Handle search history item press
  const handleHistoryItemPress = (query: string) => {
    setSearchQuery(query);
    
    // Filter products based on selected history item
    const filtered = products.filter(product => 
      product.name.toLowerCase().includes(query.toLowerCase())
    );
    
    setSearchResults(filtered);
    setShowResults(true);
    setNoResults(filtered.length === 0);
    Keyboard.dismiss();
  };
  
  // Remove search history item
  const removeHistoryItem = (id: string) => {
    setSearchHistory(searchHistory.filter(item => item.id !== id));
  };
  
  // Clear all search history
  const clearAllHistory = () => {
    setSearchHistory([]);
  };
  
  // Navigate to product details
  const navigateToProduct = (productId: string) => {
    // Navigate to product details page
    router.push(`/product/${productId}`);
  };
  
  // Clear search and results
  const clearSearch = () => {
    setSearchQuery('');
    setShowResults(false);
    setNoResults(false);
    setSearchResults([]);
  };
  
  // Listen for keyboard events
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setShowKeyboard(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setShowKeyboard(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar style="dark" />
      
      {/* Header with back and notification buttons */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Search</Text>
        <TouchableOpacity 
          style={styles.notificationIcon} 
          onPress={() => router.push('/notifications')}
        >
          <Ionicons name="notifications-outline" size={24} color={black} />
        </TouchableOpacity>
      </View>
      
      {/* Search Input */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color={darkGray} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for clothes..."
            placeholderTextColor={darkGray}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color={darkGray} />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.micButton} onPress={() => console.log('Voice search')}>
            <Ionicons name="mic-outline" size={20} color={darkGray} />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Content */}
      <View style={styles.content}>
        {!showResults ? (
          // Search History
          searchHistory.length > 0 ? (
            <View style={{ flex: 1 }}>
              <View style={styles.recentSearchesHeader}>
                <Text style={styles.recentSearchesTitle}>Recent Searches</Text>
                {searchHistory.length > 0 && (
                  <TouchableOpacity onPress={clearAllHistory}>
                    <Text style={styles.clearAllText}>Clear all</Text>
                  </TouchableOpacity>
                )}
              </View>
              
              <FlatList
                data={searchHistory}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View style={styles.historyItem}>
                    <TouchableOpacity 
                      style={styles.historyItemContent}
                      onPress={() => handleHistoryItemPress(item.query)}
                    >
                      <Text style={styles.historyItemText}>{item.query}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.removeButton}
                      onPress={() => removeHistoryItem(item.id)}
                    >
                      <Ionicons name="close-circle" size={20} color={darkGray} />
                    </TouchableOpacity>
                  </View>
                )}
                showsVerticalScrollIndicator={false}
              />
            </View>
          ) : (
            <View style={styles.emptyHistoryContainer}>
              <Text style={styles.emptyHistoryText}>No recent searches</Text>
            </View>
          )
        ) : (
          // Search Results
          showResults && (
            <>
              {searchResults.length > 0 ? (
                <ScrollView style={styles.resultsContainer}>
                  {searchResults.map((product, index) => (
                    <TouchableOpacity 
                      key={index} 
                      style={styles.productItem}
                      onPress={() => navigateToProduct(product.id)}
                    >
                      <Image source={product.image} style={styles.productImage} />
                      <View style={styles.productInfo}>
                        <Text style={styles.productName}>{product.name}</Text>
                        <View style={styles.priceContainer}>
                          <Text style={styles.productPrice}>{formatPrice(product.price)}</Text>
                          {product.discountPercentage && (
                            <Text style={styles.discountText}>-{product.discountPercentage}%</Text>
                          )}
                        </View>
                      </View>
                      <View style={styles.actionButtons}>
                        <TouchableOpacity 
                          style={styles.addToCartButton}
                          onPress={(e) => {
                            e.stopPropagation();
                            addToCart(product);
                          }}
                        >
                          <Ionicons name="cart-outline" size={20} color={white} />
                        </TouchableOpacity>
                        <Ionicons name="arrow-forward" size={20} color={black} style={styles.arrowIcon} />
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              ) : (
                <View style={styles.noResultsContainer}>
                  <Text style={styles.noResultsText}>
                    No results found for "{searchQuery}"
                  </Text>
                </View>
              )}
            </>
          )
        )}
      </View>
      
      {/* Keyboard */}
      {showKeyboard && (
        <View style={styles.keyboardContainer}>
          {/* This is just a visual representation of the keyboard */}
          <View style={styles.keyboardRow}>
            {['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'].map(key => (
              <View key={key} style={styles.keyboardKey}>
                <Text style={styles.keyboardKeyText}>{key}</Text>
              </View>
            ))}
          </View>
          <View style={styles.keyboardRow}>
            {['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'].map(key => (
              <View key={key} style={styles.keyboardKey}>
                <Text style={styles.keyboardKeyText}>{key}</Text>
              </View>
            ))}
          </View>
          <View style={styles.keyboardRow}>
            <View style={styles.keyboardKey}>
              <Ionicons name="arrow-up" size={18} color={black} />
            </View>
            {['Z', 'X', 'C', 'V', 'B', 'N', 'M'].map(key => (
              <View key={key} style={styles.keyboardKey}>
                <Text style={styles.keyboardKeyText}>{key}</Text>
              </View>
            ))}
            <View style={styles.keyboardKey}>
              <Ionicons name="backspace" size={18} color={black} />
            </View>
          </View>
          <View style={styles.keyboardRow}>
            <View style={styles.keyboardSpecialKey}>
              <Text style={styles.keyboardKeyText}>123</Text>
            </View>
            <View style={styles.keyboardSpaceKey}>
              <Text style={styles.keyboardKeyText}>space</Text>
            </View>
            <View style={styles.keyboardSpecialKey}>
              <Text style={styles.keyboardKeyText}>return</Text>
            </View>
          </View>
          <View style={styles.keyboardRow}>
            <View style={styles.keyboardEmoji}>
              <Text style={styles.keyboardKeyText}>😊</Text>
            </View>
            <View style={styles.keyboardMic}>
              <Ionicons name="mic" size={18} color={black} />
            </View>
          </View>
        </View>
      )}
      
      {/* Bottom Tab Bar */}
      {!showKeyboard && (
        <View style={styles.tabBar}>
          <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/(tabs)')}>
            <Ionicons name="home-outline" size={24} color={darkGray} />
            <Text style={styles.tabText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tabItem, styles.activeTab]}>
            <Ionicons name="search" size={24} color={black} />
            <Text style={[styles.tabText, styles.activeTabText]}>Search</Text>
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
      )}
    </KeyboardAvoidingView>
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
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: lightGray,
    borderRadius: 30,
    paddingHorizontal: 12,
    height: 50,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: black,
  },
  clearButton: {
    padding: 4,
  },
  micButton: {
    padding: 8,
    marginLeft: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  recentSearchesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  recentSearchesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: black,
  },
  clearAllText: {
    fontSize: 14,
    color: darkGray,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  historyItemContent: {
    flex: 1,
  },
  historyItemText: {
    fontSize: 16,
    color: black,
  },
  removeButton: {
    padding: 8,
  },
  emptyHistoryContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyHistoryText: {
    fontSize: 16,
    color: darkGray,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  noResultsText: {
    fontSize: 16,
    color: darkGray,
  },
  resultsContainer: {
    flex: 1,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: lightGray,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    color: black,
    marginBottom: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: black,
  },
  discountText: {
    fontSize: 14,
    fontWeight: '500',
    color: red,
    marginLeft: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addToCartButton: {
    backgroundColor: black,
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  arrowIcon: {
    marginLeft: 5,
  },
  keyboardContainer: {
    backgroundColor: '#D1D5DB',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderTopWidth: 1,
    borderTopColor: '#A1A1AA',
  },
  keyboardRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
  keyboardKey: {
    width: 32,
    height: 42,
    backgroundColor: white,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 2,
    shadowColor: black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  keyboardSpecialKey: {
    width: 50,
    height: 42,
    backgroundColor: '#A1A1AA',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 2,
  },
  keyboardSpaceKey: {
    flex: 1,
    height: 42,
    backgroundColor: white,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 6,
  },
  keyboardKeyText: {
    fontSize: 14,
    color: black,
  },
  keyboardEmoji: {
    width: 42,
    height: 42,
    backgroundColor: '#A1A1AA',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 'auto',
    marginLeft: 10,
  },
  keyboardMic: {
    width: 42,
    height: 42,
    backgroundColor: '#A1A1AA',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 'auto',
    marginRight: 10,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: black,
  },
  tabText: {
    fontSize: 12,
    marginTop: 4,
    color: darkGray,
  },
  activeTabText: {
    color: black,
  },
});