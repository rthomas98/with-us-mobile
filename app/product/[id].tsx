import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  TouchableOpacity, 
  ScrollView,
  Dimensions,
  Pressable,
  FlatList,
  Share,
  Modal,
  TextInput
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView, PinchGestureHandler } from 'react-native-gesture-handler';

// Define colors
const white = '#FFFFFF';
const black = '#000000';
const lightGray = '#F5F5F5';
const darkGray = '#888888';
const orange = '#FFA500';
const red = '#FF0000';

// Define types
interface ProductSize {
  id: string;
  label: string;
}

interface ProductColor {
  id: string;
  name: string;
  value: string;
}

interface RelatedProduct {
  id: string;
  name: string;
  price: number;
  discountPercentage?: number;
  image: any;
}

interface ProductReview {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  discountPercentage?: number;
  images: any[];
  description: string;
  rating: number;
  reviews: number;
  sizes: ProductSize[];
  colors: ProductColor[];
  relatedProducts: RelatedProduct[];
  reviewList: ProductReview[];
}

// Sample product data
const productData: { [key: string]: Product } = {
  '1': { 
    id: '1', 
    name: 'Regular Fit Slogan', 
    price: 1190, 
    images: [
      require('@/assets/images/shirts/shutterstock_1904909734.jpg'),
      require('@/assets/images/shirts/shutterstock_2161469387.jpg'),
      require('@/assets/images/shirts/shutterstock_2391378139.jpg'),
    ],
    description: 'The name says it all, the right size slightly snugs the body leaving enough room for comfort in the sleeves and waist.',
    rating: 4.0,
    reviews: 45,
    sizes: [
      { id: 's', label: 'S' },
      { id: 'm', label: 'M' },
      { id: 'l', label: 'L' },
    ],
    colors: [
      { id: 'navy', name: 'Navy', value: '#000080' },
      { id: 'black', name: 'Black', value: '#000000' },
      { id: 'gray', name: 'Gray', value: '#808080' },
    ],
    relatedProducts: [
      { 
        id: '2', 
        name: 'Regular Fit Polo', 
        price: 1190, 
        discountPercentage: 52,
        image: require('@/assets/images/shirts/shutterstock_2161469387.jpg'),
      },
      { 
        id: '3', 
        name: 'Regular Fit Black', 
        price: 1690, 
        image: require('@/assets/images/shirts/shutterstock_2391378139.jpg'),
      },
      { 
        id: '4', 
        name: 'Regular Fit V-Neck', 
        price: 1290, 
        image: require('@/assets/images/shirts/shutterstock_2494261525.jpg'),
      },
    ],
    reviewList: [
      { 
        id: '1', 
        userName: 'John D.', 
        rating: 5, 
        date: '2025-03-15', 
        comment: 'Great fit and comfortable fabric. Highly recommend!' 
      },
      { 
        id: '2', 
        userName: 'Sarah M.', 
        rating: 4, 
        date: '2025-03-10', 
        comment: 'Nice quality, but runs slightly small. Order a size up.' 
      },
      { 
        id: '3', 
        userName: 'Mike T.', 
        rating: 3, 
        date: '2025-02-28', 
        comment: 'Decent shirt, but the color faded after a few washes.' 
      },
    ]
  },
  '2': { 
    id: '2', 
    name: 'Regular Fit Polo', 
    price: 1190, 
    discountPercentage: 52,
    images: [
      require('@/assets/images/shirts/shutterstock_2161469387.jpg'),
      require('@/assets/images/shirts/shutterstock_1904909734.jpg'),
      require('@/assets/images/shirts/shutterstock_2494261525.jpg'),
    ],
    description: 'Classic polo design with a comfortable regular fit. Perfect for casual occasions with breathable fabric.',
    rating: 4.2,
    reviews: 38,
    sizes: [
      { id: 's', label: 'S' },
      { id: 'm', label: 'M' },
      { id: 'l', label: 'L' },
      { id: 'xl', label: 'XL' },
    ],
    colors: [
      { id: 'teal', name: 'Teal', value: '#008080' },
      { id: 'blue', name: 'Blue', value: '#0000FF' },
      { id: 'green', name: 'Green', value: '#008000' },
    ],
    relatedProducts: [
      { 
        id: '1', 
        name: 'Regular Fit Slogan', 
        price: 1190, 
        image: require('@/assets/images/shirts/shutterstock_1904909734.jpg'),
      },
      { 
        id: '3', 
        name: 'Regular Fit Black', 
        price: 1690, 
        image: require('@/assets/images/shirts/shutterstock_2391378139.jpg'),
      },
      { 
        id: '4', 
        name: 'Regular Fit V-Neck', 
        price: 1290, 
        image: require('@/assets/images/shirts/shutterstock_2494261525.jpg'),
      },
    ],
    reviewList: [
      { 
        id: '1', 
        userName: 'Alex K.', 
        rating: 5, 
        date: '2025-03-20', 
        comment: 'Perfect polo shirt! Great material and fit.' 
      },
      { 
        id: '2', 
        userName: 'Jessica L.', 
        rating: 4, 
        date: '2025-03-05', 
        comment: 'Good quality and nice color. Slightly tight in the shoulders.' 
      },
      { 
        id: '3', 
        userName: 'Robert P.', 
        rating: 4, 
        date: '2025-02-15', 
        comment: 'Comfortable and stylish. Would buy again.' 
      },
    ]
  },
  '3': { 
    id: '3', 
    name: 'Regular Fit Black', 
    price: 1690, 
    images: [
      require('@/assets/images/shirts/shutterstock_2391378139.jpg'),
      require('@/assets/images/shirts/shutterstock_2494261525.jpg'),
      require('@/assets/images/shirts/shutterstock_1904909734.jpg'),
    ],
    description: 'Sleek black design with a comfortable fit. Versatile for both casual and semi-formal occasions.',
    rating: 4.5,
    reviews: 52,
    sizes: [
      { id: 's', label: 'S' },
      { id: 'm', label: 'M' },
      { id: 'l', label: 'L' },
    ],
    colors: [
      { id: 'black', name: 'Black', value: '#000000' },
      { id: 'charcoal', name: 'Charcoal', value: '#36454F' },
      { id: 'gray', name: 'Gray', value: '#808080' },
    ],
    relatedProducts: [
      { 
        id: '1', 
        name: 'Regular Fit Slogan', 
        price: 1190, 
        image: require('@/assets/images/shirts/shutterstock_1904909734.jpg'),
      },
      { 
        id: '2', 
        name: 'Regular Fit Polo', 
        price: 1190, 
        discountPercentage: 52,
        image: require('@/assets/images/shirts/shutterstock_2161469387.jpg'),
      },
      { 
        id: '4', 
        name: 'Regular Fit V-Neck', 
        price: 1290, 
        image: require('@/assets/images/shirts/shutterstock_2494261525.jpg'),
      },
    ],
    reviewList: [
      { 
        id: '1', 
        userName: 'David R.', 
        rating: 5, 
        date: '2025-03-25', 
        comment: 'Perfect black shirt that goes with everything!' 
      },
      { 
        id: '2', 
        userName: 'Emma S.', 
        rating: 5, 
        date: '2025-03-12', 
        comment: 'Great quality and doesn\'t fade after washing.' 
      },
      { 
        id: '3', 
        userName: 'Thomas B.', 
        rating: 4, 
        date: '2025-02-20', 
        comment: 'Good fit and material. Slightly longer than expected.' 
      },
    ]
  },
  '4': { 
    id: '4', 
    name: 'Regular Fit V-Neck', 
    price: 1290, 
    images: [
      require('@/assets/images/shirts/shutterstock_2494261525.jpg'),
      require('@/assets/images/shirts/shutterstock_2391378139.jpg'),
      require('@/assets/images/shirts/shutterstock_2161469387.jpg'),
    ],
    description: 'V-neck design that offers a modern look with comfortable fit around the shoulders and chest.',
    rating: 3.8,
    reviews: 29,
    sizes: [
      { id: 's', label: 'S' },
      { id: 'm', label: 'M' },
      { id: 'l', label: 'L' },
    ],
    colors: [
      { id: 'black', name: 'Black', value: '#000000' },
      { id: 'white', name: 'White', value: '#FFFFFF' },
      { id: 'navy', name: 'Navy', value: '#000080' },
    ],
    relatedProducts: [
      { 
        id: '1', 
        name: 'Regular Fit Slogan', 
        price: 1190, 
        image: require('@/assets/images/shirts/shutterstock_1904909734.jpg'),
      },
      { 
        id: '2', 
        name: 'Regular Fit Polo', 
        price: 1190, 
        discountPercentage: 52,
        image: require('@/assets/images/shirts/shutterstock_2161469387.jpg'),
      },
      { 
        id: '3', 
        name: 'Regular Fit Black', 
        price: 1690, 
        image: require('@/assets/images/shirts/shutterstock_2391378139.jpg'),
      },
    ],
    reviewList: [
      { 
        id: '1', 
        userName: 'Chris J.', 
        rating: 4, 
        date: '2025-03-18', 
        comment: 'Nice V-neck with good material quality.' 
      },
      { 
        id: '2', 
        userName: 'Lisa M.', 
        rating: 3, 
        date: '2025-03-02', 
        comment: 'Decent shirt but the V is deeper than it appears in photos.' 
      },
      { 
        id: '3', 
        userName: 'Kevin P.', 
        rating: 4, 
        date: '2025-02-10', 
        comment: 'Good fit and comfortable for everyday wear.' 
      },
    ]
  },
};

export default function ProductDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showZoomModal, setShowZoomModal] = useState(false);
  const [zoomImageIndex, setZoomImageIndex] = useState(0);
  const [scale, setScale] = useState(1);
  const [showReviews, setShowReviews] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [userRating, setUserRating] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const zoomRef = useRef(null);

  // Format price
  const formatPrice = (price: number) => {
    return `$${(price / 100).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  };

  // Toggle saved status
  const toggleSaved = () => {
    setIsSaved(!isSaved);
  };

  // Share product
  const shareProduct = async () => {
    try {
      await Share.share({
        message: `Check out this ${product?.name} for ${formatPrice(product?.price || 0)} on With Us!`,
        url: `https://with-us.com/product/${product?.id}`,
        title: product?.name,
      });
    } catch (error) {
      console.error('Error sharing product:', error);
    }
  };

  // Handle add to cart
  const addToCart = () => {
    if (!selectedSize || !selectedColor) {
      // Show size and color selection error
      alert('Please select a size and color');
      return;
    }
    
    // Add to cart logic here
    alert(`Added ${quantity} ${product?.name} (Size: ${selectedSize.toUpperCase()}, Color: ${selectedColor}) to cart`);
  };

  // Increment quantity
  const incrementQuantity = () => {
    setQuantity(prev => Math.min(prev + 1, 10)); // Max 10 items
  };

  // Decrement quantity
  const decrementQuantity = () => {
    setQuantity(prev => Math.max(prev - 1, 1)); // Min 1 item
  };

  // Change image
  const changeImage = (index: number) => {
    setCurrentImageIndex(index);
    flatListRef.current?.scrollToIndex({ index, animated: true });
  };

  // Handle scroll end
  const handleScrollEnd = (e: any) => {
    const contentOffset = e.nativeEvent.contentOffset;
    const viewSize = e.nativeEvent.layoutMeasurement;
    const pageNum = Math.floor(contentOffset.x / viewSize.width);
    setCurrentImageIndex(pageNum);
  };

  // Load product data
  useEffect(() => {
    if (id && productData[id]) {
      setProduct(productData[id]);
      // Set default color to first option
      if (productData[id].colors.length > 0) {
        setSelectedColor(productData[id].colors[0].id);
      }
    } else {
      // Handle product not found
      alert('Product not found');
      router.back();
    }
  }, [id]);

  // Handle zoom
  const onZoomEvent = (event: any) => {
    const newScale = event.nativeEvent.scale;
    setScale(Math.max(1, Math.min(newScale, 5))); // Limit scale between 1 and 5
  };

  // Open zoom modal
  const openZoomModal = (index: number) => {
    setZoomImageIndex(index);
    setShowZoomModal(true);
    setScale(1); // Reset scale
  };

  // Navigate to related product
  const navigateToRelatedProduct = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  // Toggle reviews section
  const toggleReviews = () => {
    setShowReviews(!showReviews);
  };

  // Submit review
  const submitReview = () => {
    if (userRating === 0) {
      alert('Please select a rating');
      return;
    }
    
    if (reviewText.trim() === '') {
      alert('Please enter a review comment');
      return;
    }
    
    // Submit review logic here
    alert('Thank you for your review!');
    setReviewText('');
    setUserRating(0);
  };

  if (!product) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Details</Text>
        <TouchableOpacity 
          style={styles.notificationIcon} 
          onPress={() => router.push('/notifications')}
        >
          <Ionicons name="notifications-outline" size={24} color={black} />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
        {/* Product Image Gallery */}
        <View style={styles.productImageContainer}>
          <FlatList
            ref={flatListRef}
            data={product.images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleScrollEnd}
            renderItem={({ item, index }) => (
              <TouchableOpacity 
                activeOpacity={0.9}
                onPress={() => openZoomModal(index)}
              >
                <Image source={item} style={styles.productImage} />
              </TouchableOpacity>
            )}
            keyExtractor={(_, index) => index.toString()}
          />
          
          {/* Image Indicators */}
          <View style={styles.indicatorContainer}>
            {product.images.map((_, index) => (
              <TouchableOpacity 
                key={index} 
                style={[
                  styles.indicator, 
                  index === currentImageIndex && styles.activeIndicator
                ]}
                onPress={() => changeImage(index)}
              />
            ))}
          </View>
          
          {/* Action Buttons */}
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={toggleSaved}
            >
              <Ionicons 
                name={isSaved ? "heart" : "heart-outline"} 
                size={24} 
                color={isSaved ? "red" : black} 
              />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={shareProduct}
            >
              <Ionicons name="share-social-outline" size={24} color={black} />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Thumbnail Gallery */}
        <View style={styles.thumbnailContainer}>
          <FlatList
            data={product.images}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <TouchableOpacity 
                onPress={() => changeImage(index)}
                style={[
                  styles.thumbnail, 
                  index === currentImageIndex && styles.activeThumbnail
                ]}
              >
                <Image source={item} style={styles.thumbnailImage} />
              </TouchableOpacity>
            )}
            keyExtractor={(_, index) => `thumb-${index}`}
            contentContainerStyle={styles.thumbnailList}
          />
        </View>
        
        {/* Product Info */}
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{product.name}</Text>
          
          {/* Ratings */}
          <TouchableOpacity 
            style={styles.ratingsContainer}
            onPress={toggleReviews}
          >
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons 
                  key={star}
                  name={star <= Math.floor(product.rating) ? "star" : "star-outline"} 
                  size={18} 
                  color="orange" 
                  style={styles.starIcon}
                />
              ))}
              <Text style={styles.ratingText}>{product.rating}/5</Text>
            </View>
            <View style={styles.reviewsContainer}>
              <Text style={styles.reviewsText}>({product.reviews} reviews)</Text>
              <Ionicons name="chevron-down" size={16} color="#888" />
            </View>
          </TouchableOpacity>
          
          {/* Description */}
          <Text style={styles.descriptionText}>{product.description}</Text>
          
          {/* Color Selection */}
          <View style={styles.colorSection}>
            <Text style={styles.sectionTitle}>Choose color</Text>
            <View style={styles.colorOptions}>
              {product.colors.map((color) => (
                <TouchableOpacity 
                  key={color.id}
                  style={[
                    styles.colorButton,
                    selectedColor === color.id && styles.selectedColorButton
                  ]}
                  onPress={() => setSelectedColor(color.id)}
                >
                  <View style={[styles.colorCircle, { backgroundColor: color.value }]} />
                  <Text 
                    style={[
                      styles.colorButtonText,
                      selectedColor === color.id && styles.selectedColorButtonText
                    ]}
                  >
                    {color.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          {/* Size Selection */}
          <View style={styles.sizeSection}>
            <Text style={styles.sectionTitle}>Choose size</Text>
            <View style={styles.sizeOptions}>
              {product.sizes.map((size) => (
                <TouchableOpacity 
                  key={size.id}
                  style={[
                    styles.sizeButton,
                    selectedSize === size.id && styles.selectedSizeButton
                  ]}
                  onPress={() => setSelectedSize(size.id)}
                >
                  <Text 
                    style={[
                      styles.sizeButtonText,
                      selectedSize === size.id && styles.selectedSizeButtonText
                    ]}
                  >
                    {size.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          {/* Quantity Selector */}
          <View style={styles.quantitySection}>
            <Text style={styles.sectionTitle}>Quantity</Text>
            <View style={styles.quantitySelector}>
              <TouchableOpacity 
                style={styles.quantityButton}
                onPress={decrementQuantity}
                disabled={quantity <= 1}
              >
                <Ionicons 
                  name="remove" 
                  size={20} 
                  color={quantity <= 1 ? "#888" : black} 
                />
              </TouchableOpacity>
              
              <Text style={styles.quantityText}>{quantity}</Text>
              
              <TouchableOpacity 
                style={styles.quantityButton}
                onPress={incrementQuantity}
                disabled={quantity >= 10}
              >
                <Ionicons 
                  name="add" 
                  size={20} 
                  color={quantity >= 10 ? "#888" : black} 
                />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Reviews Section */}
          {showReviews && (
            <View style={styles.reviewsSection}>
              <View style={styles.reviewsHeader}>
                <Text style={styles.sectionTitle}>Customer Reviews</Text>
                <TouchableOpacity 
                  style={styles.seeAllReviewsButton}
                  onPress={() => router.push(`/reviews/${product.id}`)}
                >
                  <Text style={styles.seeAllReviewsText}>See All</Text>
                  <Ionicons name="chevron-forward" size={16} color="#666" />
                </TouchableOpacity>
              </View>
              
              {/* Review List */}
              {product.reviewList.map((review) => (
                <View key={review.id} style={styles.reviewItem}>
                  <View style={styles.reviewHeader}>
                    <Text style={styles.reviewUserName}>{review.userName}</Text>
                    <Text style={styles.reviewDate}>{review.date}</Text>
                  </View>
                  
                  <View style={styles.reviewRating}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Ionicons 
                        key={star}
                        name={star <= review.rating ? "star" : "star-outline"} 
                        size={14} 
                        color="orange" 
                        style={styles.reviewStarIcon}
                      />
                    ))}
                  </View>
                  
                  <Text style={styles.reviewComment}>{review.comment}</Text>
                </View>
              ))}
              
              {/* Write a Review */}
              <View style={styles.writeReviewSection}>
                <Text style={styles.writeReviewTitle}>Write a Review</Text>
                
                <View style={styles.ratingInput}>
                  <Text style={styles.ratingInputLabel}>Your Rating:</Text>
                  <View style={styles.ratingStars}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <TouchableOpacity
                        key={star}
                        onPress={() => setUserRating(star)}
                      >
                        <Ionicons 
                          name={star <= userRating ? "star" : "star-outline"} 
                          size={24} 
                          color="orange" 
                          style={styles.ratingInputStar}
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                
                <TextInput
                  style={styles.reviewInput}
                  placeholder="Write your review here..."
                  multiline
                  numberOfLines={4}
                  value={reviewText}
                  onChangeText={setReviewText}
                />
                
                <TouchableOpacity 
                  style={styles.submitReviewButton}
                  onPress={submitReview}
                >
                  <Text style={styles.submitReviewText}>Submit Review</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          
          {/* Related Products */}
          <View style={styles.relatedProductsSection}>
            <Text style={styles.sectionTitle}>You might also like</Text>
            
            <FlatList
              data={product.relatedProducts}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.relatedProductItem}
                  onPress={() => navigateToRelatedProduct(item.id)}
                >
                  <Image source={item.image} style={styles.relatedProductImage} />
                  <View style={styles.relatedProductInfo}>
                    <Text style={styles.relatedProductName} numberOfLines={1}>{item.name}</Text>
                    <View style={styles.relatedProductPriceContainer}>
                      <Text style={styles.relatedProductPrice}>{formatPrice(item.price)}</Text>
                      {item.discountPercentage && (
                        <Text style={styles.relatedProductDiscount}>-{item.discountPercentage}%</Text>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => `related-${item.id}`}
              contentContainerStyle={styles.relatedProductsList}
            />
          </View>
        </View>
      </ScrollView>
      
      {/* Sticky Price and Add to Cart */}
      <View style={styles.stickyFooter}>
        <View style={styles.stickyPriceContainer}>
          <Text style={styles.priceLabel}>Price</Text>
          <Text style={styles.priceValue}>{formatPrice(product.price * quantity)}</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.stickyAddToCartButton}
          onPress={addToCart}
        >
          <Ionicons name="cart-outline" size={20} color={white} style={styles.cartIcon} />
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
      
      {/* Zoom Modal */}
      <Modal
        visible={showZoomModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowZoomModal(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity 
            style={styles.closeModalButton}
            onPress={() => setShowZoomModal(false)}
          >
            <Ionicons name="close" size={28} color={white} />
          </TouchableOpacity>
          
          <PinchGestureHandler
            ref={zoomRef}
            onGestureEvent={onZoomEvent}
          >
            <View style={styles.zoomImageContainer}>
              <Image 
                source={product.images[zoomImageIndex]} 
                style={[
                  styles.zoomImage,
                  { transform: [{ scale }] }
                ]} 
                resizeMode="contain"
              />
            </View>
          </PinchGestureHandler>
          
          <Text style={styles.zoomInstructions}>Pinch to zoom</Text>
        </View>
      </Modal>
    </GestureHandlerRootView>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: white,
    paddingTop: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  scrollView: {
    flex: 1,
    backgroundColor: white,
  },
  scrollViewContent: {
    paddingBottom: 100, // Add padding to account for sticky footer
  },
  productImageContainer: {
    position: 'relative',
    width: '100%',
    height: width,
  },
  productImage: {
    width: width,
    height: width,
    resizeMode: 'cover',
  },
  indicatorContainer: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: white,
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  actionButtonsContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
  },
  actionButton: {
    backgroundColor: white,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginRight: 8,
  },
  thumbnailContainer: {
    paddingVertical: 12,
    backgroundColor: white,
  },
  thumbnailList: {
    paddingHorizontal: 16,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: lightGray,
  },
  activeThumbnail: {
    borderColor: black,
    borderWidth: 2,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  productInfo: {
    padding: 16,
  },
  productName: {
    fontSize: 24,
    fontWeight: '600',
    color: black,
    marginBottom: 8,
  },
  ratingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIcon: {
    marginRight: 2,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  reviewsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  reviewsText: {
    fontSize: 14,
    color: darkGray,
    marginRight: 4,
  },
  descriptionText: {
    fontSize: 16,
    color: darkGray,
    lineHeight: 24,
    marginBottom: 24,
  },
  colorSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: black,
    marginBottom: 12,
  },
  colorOptions: {
    flexDirection: 'row',
  },
  colorButton: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  selectedColorButton: {
    borderColor: black,
    backgroundColor: lightGray,
  },
  colorCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 8,
  },
  colorButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: black,
  },
  selectedColorButtonText: {
    color: black,
  },
  sizeSection: {
    marginBottom: 24,
  },
  sizeOptions: {
    flexDirection: 'row',
  },
  sizeButton: {
    width: 50,
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  selectedSizeButton: {
    borderColor: black,
    backgroundColor: black,
  },
  sizeButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: black,
  },
  selectedSizeButtonText: {
    color: white,
  },
  quantitySection: {
    marginBottom: 24,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 120,
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: white,
    shadowColor: black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: '600',
    color: black,
  },
  priceCartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    display: 'none', // Hide the original price/cart section
  },
  stickyFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderTopColor: lightGray,
    shadowColor: black,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  stickyPriceContainer: {
    flex: 1,
  },
  stickyAddToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: black,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  reviewsSection: {
    marginBottom: 24,
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  reviewItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: lightGray,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewUserName: {
    fontSize: 16,
    fontWeight: '600',
    color: black,
  },
  reviewDate: {
    fontSize: 14,
    color: darkGray,
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewStarIcon: {
    marginRight: 2,
  },
  reviewComment: {
    fontSize: 16,
    color: darkGray,
    lineHeight: 24,
  },
  writeReviewSection: {
    paddingVertical: 16,
  },
  writeReviewTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: black,
    marginBottom: 12,
  },
  ratingInput: {
    marginBottom: 16,
  },
  ratingInputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: black,
    marginBottom: 8,
  },
  ratingStars: {
    flexDirection: 'row',
  },
  ratingInputStar: {
    marginRight: 8,
  },
  reviewInput: {
    fontSize: 16,
    fontWeight: '500',
    color: black,
    padding: 12,
    backgroundColor: white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: lightGray,
    marginBottom: 16,
  },
  submitReviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: black,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  submitReviewText: {
    fontSize: 16,
    fontWeight: '600',
    color: white,
  },
  relatedProductsSection: {
    marginBottom: 24,
  },
  relatedProductItem: {
    width: 120,
    height: 180,
    borderRadius: 8,
    marginRight: 16,
    overflow: 'hidden',
    backgroundColor: white,
    shadowColor: black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  relatedProductImage: {
    width: '100%',
    height: '60%',
    resizeMode: 'cover',
  },
  relatedProductInfo: {
    padding: 8,
  },
  relatedProductName: {
    fontSize: 16,
    fontWeight: '600',
    color: black,
    marginBottom: 4,
  },
  relatedProductPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  relatedProductPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: black,
  },
  relatedProductDiscount: {
    fontSize: 14,
    color: red,
    marginLeft: 4,
  },
  relatedProductsList: {
    paddingHorizontal: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  closeModalButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
  },
  zoomImageContainer: {
    width: width,
    height: width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  zoomInstructions: {
    fontSize: 16,
    color: white,
    marginTop: 16,
  },
  priceLabel: {
    fontSize: 14,
    color: darkGray,
  },
  priceValue: {
    fontSize: 24,
    fontWeight: '600',
    color: black,
  },
  cartIcon: {
    marginRight: 8,
  },
  addToCartText: {
    fontSize: 16,
    fontWeight: '600',
    color: white,
  },
  seeAllReviewsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: white,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    shadowColor: black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  seeAllReviewsText: {
    fontSize: 16,
    fontWeight: '600',
    color: black,
    marginRight: 4,
  },
});
