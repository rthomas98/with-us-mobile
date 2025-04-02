import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  Image,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TextInput } from 'react-native';

// Colors
const black = '#000000';
const white = '#FFFFFF';
const lightGray = '#F5F5F5';
const mediumGray = '#D3D3D3';
const green = '#4CAF50';

// Screen width
const { width } = Dimensions.get('window');

// Order status types
type OrderStatus = 'Packing' | 'Picked' | 'In Transit' | 'Delivered' | 'Completed';

// Order item type
interface OrderItem {
  id: string;
  name: string;
  size: string;
  price: number;
  image: any;
  status: OrderStatus;
  rating?: number;
}

// Sample data for ongoing orders
const ongoingOrders: OrderItem[] = [
  {
    id: '1',
    name: 'Regular Fit Slogan',
    size: 'M',
    price: 1190,
    image: require('@/assets/images/shirts/shutterstock_1904909734.jpg'),
    status: 'In Transit'
  },
  {
    id: '2',
    name: 'Regular Fit Polo',
    size: 'L',
    price: 1100,
    image: require('@/assets/images/shirts/shutterstock_2161469387.jpg'),
    status: 'Picked'
  },
  {
    id: '3',
    name: 'Regular Fit Black',
    size: 'L',
    price: 1690,
    image: require('@/assets/images/shirts/shutterstock_2391378139.jpg'),
    status: 'In Transit'
  },
  {
    id: '4',
    name: 'Regular Fit V-Neck',
    size: 'S',
    price: 1290,
    image: require('@/assets/images/shirts/shutterstock_2494261525.jpg'),
    status: 'Packing'
  },
  {
    id: '5',
    name: 'Regular Fit Pink',
    size: 'M',
    price: 1341,
    image: require('@/assets/images/shirts/shutterstock_492187627.jpg'),
    status: 'Picked'
  }
];

// Sample data for completed orders
const completedOrders: OrderItem[] = [
  {
    id: '6',
    name: 'Regular Fit Slogan',
    size: 'M',
    price: 1190,
    image: require('@/assets/images/shirts/shutterstock_1904909734.jpg'),
    status: 'Completed'
  },
  {
    id: '7',
    name: 'Regular Fit Polo',
    size: 'L',
    price: 1100,
    image: require('@/assets/images/shirts/shutterstock_2161469387.jpg'),
    status: 'Completed',
    rating: 4.5
  },
  {
    id: '8',
    name: 'Regular Fit Black',
    size: 'L',
    price: 1690,
    image: require('@/assets/images/shirts/shutterstock_2391378139.jpg'),
    status: 'Completed'
  },
  {
    id: '9',
    name: 'Regular Fit V-Neck',
    size: 'S',
    price: 1290,
    image: require('@/assets/images/shirts/shutterstock_2494261525.jpg'),
    status: 'Completed'
  },
  {
    id: '10',
    name: 'Regular Fit Pink',
    size: 'M',
    price: 1341,
    image: require('@/assets/images/shirts/shutterstock_492187627.jpg'),
    status: 'Completed',
    rating: 3.5
  }
];

export default function MyOrdersScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'ongoing' | 'completed'>('ongoing');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Format price
  const formatPrice = (price: number) => {
    return `$ ${price.toLocaleString()}`;
  };

  // Handle tab change
  const handleTabChange = (tab: 'ongoing' | 'completed') => {
    setActiveTab(tab);
  };

  // Handle track order
  const handleTrackOrder = (orderId: string) => {
    // In a real app, you would navigate to a tracking screen with the order ID
    router.push({
      pathname: '/orders/track',
      params: { id: orderId }
    } as any);
  };

  // Handle leave review
  const handleLeaveReview = (orderId: string) => {
    setSelectedOrderId(orderId);
    setShowReviewModal(true);
  };

  // Handle submit review
  const handleSubmitReview = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setShowReviewModal(false);
      setRating(5);
      setReview('');
      setSelectedOrderId(null);
      
      // In a real app, you would update the order with the review
    }, 1000);
  };

  // Handle close review modal
  const handleCloseReviewModal = () => {
    setShowReviewModal(false);
    setRating(5);
    setReview('');
    setSelectedOrderId(null);
  };

  // Render order item
  const renderOrderItem = (item: OrderItem) => {
    return (
      <TouchableOpacity 
        style={styles.orderItem} 
        key={item.id}
        onPress={() => router.push({
          pathname: '/order/[id]',
          params: { id: item.id }
        } as any)}
      >
        <Image 
          source={item.image} 
          style={styles.productImage}
          resizeMode="cover"
        />
        
        <View style={styles.orderDetails}>
          <View>
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productSize}>Size {item.size}</Text>
          </View>
          
          <View style={styles.orderPriceContainer}>
            <Text style={styles.productPrice}>{formatPrice(item.price)}</Text>
            
            {activeTab === 'ongoing' ? (
              <View style={[styles.statusBadge, 
                item.status === 'In Transit' && styles.transitBadge,
                item.status === 'Picked' && styles.pickedBadge,
                item.status === 'Packing' && styles.packingBadge
              ]}>
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            ) : (
              <View style={[styles.statusBadge, styles.completedBadge]}>
                <Text style={styles.statusText}>Completed</Text>
              </View>
            )}
          </View>
        </View>
        
        {activeTab === 'ongoing' ? (
          <TouchableOpacity 
            style={styles.trackButton}
            onPress={() => handleTrackOrder(item.id)}
          >
            <Text style={styles.trackButtonText}>Track Order</Text>
          </TouchableOpacity>
        ) : (
          item.rating ? (
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.ratingText}>{item.rating}/5</Text>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.reviewButton}
              onPress={() => handleLeaveReview(item.id)}
            >
              <Text style={styles.reviewButtonText}>Leave Review</Text>
            </TouchableOpacity>
          )
        )}
      </TouchableOpacity>
    );
  };

  // Render empty state
  const renderEmptyState = () => {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="cube-outline" size={50} color={mediumGray} />
        <Text style={styles.emptyTitle}>No {activeTab === 'ongoing' ? 'Ongoing' : 'Completed'} Orders!</Text>
        <Text style={styles.emptyText}>
          You don't have any {activeTab === 'ongoing' ? 'ongoing' : 'completed'} orders at this time.
        </Text>
      </View>
    );
  };

  // Render review modal
  const renderReviewModal = () => {
    if (!showReviewModal) return null;
    
    return (
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Leave a Review</Text>
            <TouchableOpacity onPress={handleCloseReviewModal}>
              <Ionicons name="close" size={24} color={black} />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.modalSubtitle}>How was your order?</Text>
          <Text style={styles.modalDescription}>Please give your rating and also your review.</Text>
          
          <View style={styles.ratingStars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity 
                key={star} 
                onPress={() => setRating(star)}
                style={styles.starButton}
              >
                <Ionicons 
                  name={star <= rating ? "star" : "star-outline"} 
                  size={30} 
                  color={star <= rating ? "#FFD700" : mediumGray} 
                />
              </TouchableOpacity>
            ))}
          </View>
          
          <View style={styles.reviewInputContainer}>
            <TextInput
              style={styles.reviewInput}
              placeholder="Write your review..."
              value={review}
              onChangeText={setReview}
              multiline
            />
          </View>
          
          <TouchableOpacity 
            style={styles.submitButton}
            onPress={handleSubmitReview}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={white} />
            ) : (
              <Text style={styles.submitButtonText}>Submit</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Orders</Text>
        <TouchableOpacity style={styles.notificationIcon} onPress={() => router.push('/notifications' as any)}>
          <Ionicons name="notifications-outline" size={24} color={black} />
        </TouchableOpacity>
      </View>
      
      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[
            styles.tab, 
            activeTab === 'ongoing' && styles.activeTab
          ]}
          onPress={() => handleTabChange('ongoing')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'ongoing' && styles.activeTabText
          ]}>Ongoing</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.tab, 
            activeTab === 'completed' && styles.activeTab
          ]}
          onPress={() => handleTabChange('completed')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'completed' && styles.activeTabText
          ]}>Completed</Text>
        </TouchableOpacity>
      </View>
      
      {/* Orders List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'ongoing' ? (
          ongoingOrders.length > 0 ? (
            ongoingOrders.map(item => renderOrderItem(item))
          ) : (
            renderEmptyState()
          )
        ) : (
          completedOrders.length > 0 ? (
            completedOrders.map(item => renderOrderItem(item))
          ) : (
            renderEmptyState()
          )
        )}
      </ScrollView>
      
      {/* Review Modal */}
      {renderReviewModal()}
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: lightGray,
    borderRadius: 8,
    margin: 16,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: white,
  },
  tabText: {
    fontSize: 16,
    color: mediumGray,
  },
  activeTabText: {
    color: black,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  orderItem: {
    flexDirection: 'row',
    backgroundColor: white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: lightGray,
  },
  orderDetails: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    color: black,
    marginBottom: 4,
  },
  productSize: {
    fontSize: 14,
    color: mediumGray,
  },
  orderPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '500',
    color: black,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: lightGray,
  },
  transitBadge: {
    backgroundColor: '#E3F2FD',
  },
  pickedBadge: {
    backgroundColor: '#E8F5E9',
  },
  packingBadge: {
    backgroundColor: '#FFF3E0',
  },
  completedBadge: {
    backgroundColor: '#E8F5E9',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  trackButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: black,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
  },
  trackButtonText: {
    color: white,
    fontSize: 12,
    fontWeight: '500',
  },
  reviewButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: black,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
  },
  reviewButtonText: {
    color: white,
    fontSize: 12,
    fontWeight: '500',
  },
  ratingContainer: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
    color: black,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: black,
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: mediumGray,
    textAlign: 'center',
    marginTop: 8,
    maxWidth: '80%',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: black,
  },
  modalSubtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: black,
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 14,
    color: mediumGray,
    marginBottom: 16,
  },
  ratingStars: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  starButton: {
    marginHorizontal: 8,
  },
  reviewInputContainer: {
    borderWidth: 1,
    borderColor: lightGray,
    borderRadius: 8,
    marginBottom: 24,
  },
  reviewInput: {
    padding: 12,
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: black,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    color: white,
    fontSize: 16,
    fontWeight: '600',
  },
});
