import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Image, 
  FlatList, 
  TouchableOpacity, 
  TextInput,
  SafeAreaView,
  Dimensions,
  StatusBar,
  ScrollView,
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { useCart } from '@/context/CartContext';

// Get screen dimensions
const { width } = Dimensions.get('window');
const itemWidth = (width - 40) / 2; // 2 items per row with 20px padding on sides

// Brand colors
const black = '#000000';
const white = '#FFFFFF';
const gray = '#F5F5F5';
const darkGray = '#888888';

// Product data
const products = [
  {
    id: '1',
    name: 'Regular Fit Slogan',
    price: 1190,
    image: require('@/assets/images/shirts/shutterstock_1904909734.jpg'),
    discount: null,
  },
  {
    id: '2',
    name: 'Regular Fit Polo',
    price: 1100,
    image: require('@/assets/images/shirts/shutterstock_2161469387.jpg'),
    discount: 52,
  },
  {
    id: '3',
    name: 'Regular Fit Black',
    price: 1690,
    image: require('@/assets/images/shirts/shutterstock_2391378139.jpg'),
    discount: null,
  },
  {
    id: '4',
    name: 'Regular Fit V-Neck',
    price: 1290,
    image: require('@/assets/images/shirts/shutterstock_2494261525.jpg'),
    discount: null,
  },
  {
    id: '5',
    name: 'Regular Fit Navy',
    price: 1390,
    image: require('@/assets/images/shirts/shutterstock_492187627.jpg'),
    discount: null,
  },
];

// Category tabs
const categories = [
  { id: '1', name: 'All' },
  { id: '2', name: 'Tshirts' },
  { id: '3', name: 'Jeans' },
  { id: '4', name: 'Shoes' },
];

export default function DiscoverScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('2'); // Default to Tshirts
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortOption, setSortOption] = useState('relevance');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 19]);
  const [selectedSize, setSelectedSize] = useState('L');
  const [showSizeOptions, setShowSizeOptions] = useState(false);
  const { addToCart } = useCart();

  const toggleFavorite = (productId: string) => {
    if (favorites.includes(productId)) {
      setFavorites(favorites.filter(id => id !== productId));
    } else {
      setFavorites([...favorites, productId]);
    }
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  const handleSortOptionPress = (option: string) => {
    setSortOption(option);
  };
  
  const toggleSizeOptions = () => {
    setShowSizeOptions(!showSizeOptions);
  };
  
  const selectSize = (size: string) => {
    setSelectedSize(size);
    setShowSizeOptions(false);
  };
  
  const applyFilters = () => {
    // Here you would apply the filters to your product list
    // For now, we'll just close the filter modal
    toggleFilters();
  };

  const formatPrice = (price: number) => {
    return `$ ${(price / 100).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  };

  const renderProduct = ({ item }: { item: typeof products[0] }) => (
    <TouchableOpacity 
      style={styles.productCard}
      onPress={() => router.push(`/product/${item.id}`)}
    >
      <View style={styles.imageContainer}>
        <Image source={item.image} style={styles.productImage} />
        <TouchableOpacity 
          style={styles.favoriteButton}
          onPress={(e) => {
            e.stopPropagation(); // Prevent triggering the parent onPress
            toggleFavorite(item.id);
          }}
        >
          <Ionicons 
            name={favorites.includes(item.id) ? "heart" : "heart-outline"} 
            size={24} 
            color={favorites.includes(item.id) ? "#FF6B6B" : black} 
          />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.addToCartButton}
          onPress={(e) => {
            e.stopPropagation(); // Prevent triggering the parent onPress
            addToCart(item);
          }}
        >
          <Ionicons name="cart-outline" size={20} color={white} />
        </TouchableOpacity>
      </View>
      <Text style={styles.productName}>{item.name}</Text>
      <View style={styles.priceContainer}>
        <Text style={styles.productPrice}>{formatPrice(item.price)}</Text>
        {item.discount && (
          <Text style={styles.discountText}>-{item.discount}%</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Discover</Text>
        <TouchableOpacity 
          style={styles.notificationButton}
          onPress={() => router.push('/notifications')}
        >
          <Ionicons name="notifications-outline" size={24} color={black} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={24} color={darkGray} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for clothes..."
            placeholderTextColor={darkGray}
          />
        </View>
        <TouchableOpacity style={styles.filterButton} onPress={toggleFilters}>
          <Ionicons name="options-outline" size={24} color={white} />
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        {categories.map(category => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryTab,
              selectedCategory === category.id && styles.selectedCategoryTab
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Text 
              style={[
                styles.categoryText,
                selectedCategory === category.id && styles.selectedCategoryText
              ]}
              numberOfLines={1}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.productRow}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.productList}
      />
      
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => {}}>
          <View style={styles.tabIconContainer}>
            <Ionicons name="home" size={26} color={black} />
          </View>
          <Text style={styles.tabText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => {}}>
          <View style={styles.tabIconContainer}>
            <Ionicons name="search" size={26} color={darkGray} />
          </View>
          <Text style={styles.tabTextInactive}>Search</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => {}}>
          <View style={styles.tabIconContainer}>
            <Ionicons name="heart-outline" size={26} color={darkGray} />
          </View>
          <Text style={styles.tabTextInactive}>Saved</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => {}}>
          <View style={styles.tabIconContainer}>
            <Ionicons name="cart-outline" size={26} color={darkGray} />
          </View>
          <Text style={styles.tabTextInactive}>Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => {}}>
          <View style={styles.tabIconContainer}>
            <Ionicons name="person-outline" size={26} color={darkGray} />
          </View>
          <Text style={styles.tabTextInactive}>Account</Text>
        </TouchableOpacity>
      </View>
      
      {/* Filter Modal - Positioned at the end of the component to ensure it renders on top */}
      {showFilters && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={showFilters}
          onRequestClose={toggleFilters}
        >
          <View style={styles.filtersOverlay}>
            <View style={styles.filtersContainer}>
              <View style={styles.filtersHeader}>
                <Text style={styles.filtersTitle}>Filters</Text>
                <TouchableOpacity onPress={toggleFilters}>
                  <Ionicons name="close" size={24} color={black} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Sort By</Text>
                <View style={styles.sortOptions}>
                  <TouchableOpacity 
                    style={[
                      styles.sortOption, 
                      sortOption === 'relevance' && styles.sortOptionSelected
                    ]}
                    onPress={() => handleSortOptionPress('relevance')}
                  >
                    <Text 
                      style={sortOption === 'relevance' ? styles.sortOptionSelectedText : styles.sortOptionText}
                    >
                      Relevance
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[
                      styles.sortOption, 
                      sortOption === 'low-high' && styles.sortOptionSelected
                    ]}
                    onPress={() => handleSortOptionPress('low-high')}
                  >
                    <Text 
                      style={sortOption === 'low-high' ? styles.sortOptionSelectedText : styles.sortOptionText}
                    >
                      Price: Low - High
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[
                      styles.sortOption, 
                      sortOption === 'high-low' && styles.sortOptionSelected
                    ]}
                    onPress={() => handleSortOptionPress('high-low')}
                  >
                    <Text 
                      style={sortOption === 'high-low' ? styles.sortOptionSelectedText : styles.sortOptionText}
                    >
                      Price: High - Low
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Price</Text>
                <View style={styles.priceRangeContainer}>
                  <Text style={styles.priceRangeText}>$ {priceRange[0]} - $ {priceRange[1]}</Text>
                  <View style={styles.priceSlider}>
                    <View style={styles.sliderTrack} />
                    <TouchableOpacity 
                      style={[styles.sliderThumb, {left: '0%'}]}
                      onPress={() => setPriceRange([Math.max(0, priceRange[0] - 5), priceRange[1]])}
                    />
                    <TouchableOpacity 
                      style={[styles.sliderThumb, {right: '0%'}]}
                      onPress={() => setPriceRange([priceRange[0], Math.min(99, priceRange[1] + 5)])}
                    />
                  </View>
                </View>
              </View>
              
              <View style={styles.filterSection}>
                <TouchableOpacity 
                  style={styles.filterSectionHeader}
                  onPress={toggleSizeOptions}
                >
                  <Text style={styles.filterSectionTitle}>Size</Text>
                  <Text style={styles.filterSectionValue}>{selectedSize}</Text>
                  <Ionicons 
                    name={showSizeOptions ? "chevron-up" : "chevron-down"} 
                    size={20} 
                    color={black} 
                  />
                </TouchableOpacity>
                
                {showSizeOptions && (
                  <View style={styles.sizeOptions}>
                    {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
                      <TouchableOpacity 
                        key={size}
                        style={[
                          styles.sizeOption,
                          selectedSize === size && styles.selectedSizeOption
                        ]}
                        onPress={() => selectSize(size)}
                      >
                        <Text 
                          style={[
                            styles.sizeOptionText,
                            selectedSize === size && styles.selectedSizeOptionText
                          ]}
                        >
                          {size}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
              
              <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: black,
  },
  notificationButton: {
    padding: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: gray,
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 50,
    marginRight: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: black,
  },
  filterButton: {
    backgroundColor: black,
    width: 50,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoriesContainer: {
    paddingHorizontal: 15,
    paddingBottom: 25,
    paddingTop: 15,
    marginBottom: 15,
  },
  categoryTab: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    marginHorizontal: 5,
    backgroundColor: gray,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
    height: 38,
  },
  selectedCategoryTab: {
    backgroundColor: black,
  },
  categoryText: {
    fontSize: 14,
    color: black,
    fontWeight: '500',
    textAlign: 'center',
  },
  selectedCategoryText: {
    color: white,
    fontWeight: '600',
  },
  productList: {
    paddingHorizontal: 10,
    paddingBottom: 100, // Increased space for tab bar
    paddingTop: 10,
  },
  productRow: {
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  productCard: {
    width: itemWidth,
    marginBottom: 20,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 180,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addToCartButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: black,
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 6,
    color: black,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '500',
    color: black,
  },
  discountText: {
    fontSize: 14,
    color: 'red',
    marginLeft: 8,
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
    flex: 1,
    height: '100%',
  },
  tabIconContainer: {
    height: 30,
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  tabText: {
    fontSize: 12,
    marginTop: 6,
    color: black,
    fontWeight: '500',
  },
  tabTextInactive: {
    fontSize: 12,
    marginTop: 6,
    color: darkGray,
  },
  filtersOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    zIndex: 1000,
  },
  filtersContainer: {
    backgroundColor: white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    maxHeight: '80%',
    zIndex: 1001,
  },
  filtersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  filtersTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: black,
  },
  filterSection: {
    marginBottom: 25,
  },
  filterSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterSectionTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: black,
    marginBottom: 15,
  },
  filterSectionValue: {
    fontSize: 18,
    fontWeight: '400',
    color: black,
    marginLeft: 'auto',
    marginRight: 5,
  },
  sortOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  sortOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    backgroundColor: 'transparent',
  },
  sortOptionSelected: {
    backgroundColor: black,
    borderColor: black,
  },
  sortOptionText: {
    color: black,
    fontSize: 14,
  },
  sortOptionSelectedText: {
    color: white,
    fontSize: 14,
    fontWeight: '500',
  },
  priceRangeContainer: {
    marginBottom: 10,
  },
  priceRangeText: {
    fontSize: 16,
    color: black,
    marginBottom: 15,
  },
  priceSlider: {
    height: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    position: 'relative',
    marginBottom: 30,
  },
  sliderTrack: {
    position: 'absolute',
    height: 2,
    backgroundColor: black,
    left: '0%',
    right: '0%',
  },
  sliderThumb: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: white,
    borderWidth: 2,
    borderColor: black,
    top: -9,
  },
  applyButton: {
    backgroundColor: black,
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  applyButtonText: {
    color: white,
    fontSize: 16,
    fontWeight: '600',
  },
  sizeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    gap: 10,
  },
  sizeOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    backgroundColor: 'transparent',
    minWidth: 50,
    alignItems: 'center',
  },
  selectedSizeOption: {
    backgroundColor: black,
    borderColor: black,
  },
  sizeOptionText: {
    color: black,
    fontSize: 14,
  },
  selectedSizeOptionText: {
    color: white,
    fontWeight: '500',
  },
});