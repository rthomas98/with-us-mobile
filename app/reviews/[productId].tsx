import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, FlatList, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// Colors
const black = '#000000';
const white = '#FFFFFF';
const lightGray = '#F5F5F5';
const mediumGray = '#E5E5E5';
const starColor = '#FFA41C';
const red = '#FF3B30';

// Mock data for product details
const productData: Record<string, {
  name: string;
  rating: number;
  totalRatings: number;
  reviewList: Review[];
}> = {
  '1': {
    name: 'Regular Fit Slogan',
    rating: 4.2,
    totalRatings: 87,
    reviewList: [
      { id: '1', userName: 'John D.', rating: 5, date: '2 weeks ago', comment: 'Great quality and fit. Highly recommend!' },
      { id: '2', userName: 'Sarah M.', rating: 4, date: '1 month ago', comment: 'Nice material and comfortable to wear. Shipping was fast.' },
      { id: '3', userName: 'Mike T.', rating: 5, date: '1 month ago', comment: 'Exactly as described. Will buy more colors.' },
      { id: '4', userName: 'Emily R.', rating: 3, date: '2 months ago', comment: 'Good product but the sizing runs a bit large.' },
    ]
  },
  '2': {
    name: 'Slim Fit Cotton',
    rating: 3.8,
    totalRatings: 62,
    reviewList: [
      { id: '1', userName: 'Alex K.', rating: 4, date: '3 weeks ago', comment: 'Good quality for the price.' },
      { id: '2', userName: 'Jessica W.', rating: 3, date: '1 month ago', comment: 'Nice design but fabric is a bit thin.' },
      { id: '3', userName: 'David L.', rating: 5, date: '2 months ago', comment: 'Perfect fit and very comfortable!' },
    ]
  },
  '3': {
    name: 'Regular Fit Black',
    rating: 4.5,
    totalRatings: 124,
    reviewList: [
      { id: '1', userName: 'Robert J.', rating: 5, date: '1 week ago', comment: 'Excellent quality and perfect fit.' },
      { id: '2', userName: 'Lisa P.', rating: 4, date: '3 weeks ago', comment: 'Very comfortable and looks great.' },
      { id: '3', userName: 'Thomas B.', rating: 5, date: '1 month ago', comment: 'Best purchase I\'ve made in a while!' },
      { id: '4', userName: 'Amanda S.', rating: 4, date: '2 months ago', comment: 'Great value for money. Would buy again.' },
      { id: '5', userName: 'Kevin M.', rating: 5, date: '2 months ago', comment: 'Exactly what I was looking for. Fast shipping too!' },
    ]
  }
};

// Interface for reviews
interface Review {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
}

// Interface for rating distribution
interface RatingDistribution {
  rating: number;
  percentage: number;
}

export default function ProductReviewsScreen() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const { productId } = useLocalSearchParams<{ productId: string }>();
  const [sortOption, setSortOption] = useState('Most Relevant');
  const [showSortModal, setShowSortModal] = useState(false);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  
  // Get product data
  const product = productData[productId as string] || {
    name: 'Product',
    rating: 0,
    totalRatings: 0,
    reviewList: []
  };

  // Calculate rating distribution
  const calculateRatingDistribution = (): RatingDistribution[] => {
    const distribution: { [key: number]: number } = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    
    product.reviewList.forEach((review: Review) => {
      distribution[review.rating] = (distribution[review.rating] || 0) + 1;
    });
    
    return [5, 4, 3, 2, 1].map(rating => ({
      rating,
      percentage: product.totalRatings > 0 
        ? (distribution[rating] / product.totalRatings) * 100 
        : 0
    }));
  };

  const ratingDistribution = calculateRatingDistribution();
  
  const sortOptions = [
    'Most Relevant',
    'Most Recent',
    'Highest Rating',
    'Lowest Rating'
  ];

  // Toggle sort modal
  const toggleSortModal = () => {
    setShowSortModal(!showSortModal);
  };

  // Select sort option
  const selectSortOption = (option: string) => {
    setSortOption(option);
    setShowSortModal(false);
  };

  // Filter reviews by rating
  const filteredReviews = selectedRating 
    ? product.reviewList.filter((review: Review) => review.rating === selectedRating)
    : product.reviewList;

  // Toggle rating filter
  const toggleRatingFilter = (rating: number) => {
    if (selectedRating === rating) {
      setSelectedRating(null);
    } else {
      setSelectedRating(rating);
    }
  };

  // Render stars based on rating
  const renderStars = (rating: number) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name={star <= rating ? "star" : "star-outline"}
            size={16}
            color={starColor}
            style={styles.starIcon}
          />
        ))}
      </View>
    );
  };

  // Render rating bar
  const renderRatingBar = (percentage: number) => {
    return (
      <View style={styles.ratingBarContainer}>
        <View style={[styles.ratingBar, { width: `${percentage}%` }]} />
      </View>
    );
  };

  // Render review item
  const renderReviewItem = ({ item }: { item: Review }) => {
    return (
      <View style={styles.reviewItem}>
        {renderStars(item.rating)}
        <ThemedText style={styles.reviewComment}>{item.comment}</ThemedText>
        <View style={styles.reviewFooter}>
          <ThemedText style={styles.reviewUser}>{item.userName}</ThemedText>
          <ThemedText style={styles.reviewDate}>{item.date}</ThemedText>
        </View>
        <View style={styles.reviewDivider} />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{
          title: product.name,
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
      
      <ScrollView style={styles.scrollView}>
        {/* Rating Overview */}
        <View style={styles.ratingOverview}>
          <View style={styles.ratingScoreContainer}>
            <ThemedText style={styles.ratingScore}>{product.rating.toFixed(1)}</ThemedText>
            {renderStars(product.rating)}
            <ThemedText style={styles.totalRatings}>{product.totalRatings} Ratings</ThemedText>
          </View>
          
          {/* Rating Bars */}
          <View style={styles.ratingBarsContainer}>
            {ratingDistribution.map((item) => (
              <TouchableOpacity 
                key={item.rating} 
                style={styles.ratingBarRow}
                onPress={() => toggleRatingFilter(item.rating)}
                activeOpacity={0.7}
              >
                <View style={[
                  styles.ratingLabelContainer,
                  selectedRating === item.rating && styles.selectedRatingLabel
                ]}>
                  {renderStars(item.rating)}
                </View>
                {renderRatingBar(item.percentage)}
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <View style={styles.divider} />

        {/* Reviews List Header */}
        <View style={styles.reviewsHeader}>
          <View style={styles.reviewsHeaderLeft}>
            <ThemedText style={styles.reviewsCount}>
              {filteredReviews.length} {filteredReviews.length === 1 ? 'Review' : 'Reviews'}
            </ThemedText>
            {selectedRating !== null && (
              <TouchableOpacity 
                style={styles.filterBadge}
                onPress={() => setSelectedRating(null)}
              >
                <ThemedText style={styles.filterBadgeText}>
                  {selectedRating} Star{selectedRating !== 1 ? 's' : ''}
                </ThemedText>
                <Ionicons name="close-circle" size={16} color={white} />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity style={styles.sortButton} onPress={toggleSortModal}>
            <ThemedText style={styles.sortButtonText}>{sortOption}</ThemedText>
            <Ionicons name="chevron-down" size={16} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Reviews List */}
        {filteredReviews.length > 0 ? (
          <FlatList
            data={filteredReviews}
            renderItem={renderReviewItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        ) : (
          <View style={styles.noReviewsContainer}>
            <Ionicons name="star-outline" size={48} color="#999" />
            <ThemedText style={styles.noReviewsText}>
              No reviews with {selectedRating} star{selectedRating !== 1 ? 's' : ''}
            </ThemedText>
          </View>
        )}
      </ScrollView>

      {/* Sort Options Modal */}
      <Modal
        visible={showSortModal}
        transparent={true}
        animationType="fade"
        onRequestClose={toggleSortModal}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={toggleSortModal}
        >
          <View style={styles.sortModalContainer}>
            {sortOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.sortOptionItem,
                  sortOption === option && styles.selectedSortOption
                ]}
                onPress={() => selectSortOption(option)}
              >
                <ThemedText 
                  style={[
                    styles.sortOptionText,
                    sortOption === option && styles.selectedSortOptionText
                  ]}
                >
                  {option}
                </ThemedText>
                {sortOption === option && (
                  <Ionicons name="checkmark" size={20} color={black} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: white,
  },
  backButton: {
    marginLeft: 10,
  },
  notificationButton: {
    marginRight: 10,
  },
  scrollView: {
    flex: 1,
  },
  ratingOverview: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: white,
  },
  ratingScoreContainer: {
    alignItems: 'center',
    marginRight: 24,
  },
  ratingScore: {
    fontSize: 64,
    fontWeight: 'bold',
    lineHeight: 76,
    marginBottom: 4,
  },
  totalRatings: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  starIcon: {
    marginHorizontal: 1,
  },
  ratingBarsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  ratingBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingLabelContainer: {
    paddingVertical: 4,
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  selectedRatingLabel: {
    backgroundColor: 'rgba(255, 164, 28, 0.1)',
  },
  ratingBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#EEEEEE',
    borderRadius: 4,
    marginLeft: 12,
    overflow: 'hidden',
  },
  ratingBar: {
    height: '100%',
    backgroundColor: black,
    borderRadius: 4,
  },
  divider: {
    height: 1,
    backgroundColor: mediumGray,
    marginVertical: 12,
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  reviewsHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewsCount: {
    fontSize: 16,
    fontWeight: '600',
  },
  filterBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: black,
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginLeft: 8,
  },
  filterBadgeText: {
    color: white,
    fontSize: 12,
    marginRight: 4,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortButtonText: {
    fontSize: 14,
    color: '#666',
    marginRight: 4,
  },
  reviewItem: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  reviewComment: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
    marginBottom: 8,
  },
  reviewFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  reviewUser: {
    fontSize: 12,
    fontWeight: '600',
  },
  reviewDate: {
    fontSize: 12,
    color: '#666',
  },
  reviewDivider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginTop: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  sortModalContainer: {
    width: '100%',
    backgroundColor: white,
    borderRadius: 12,
    overflow: 'hidden',
  },
  sortOptionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: lightGray,
  },
  selectedSortOption: {
    backgroundColor: lightGray,
  },
  sortOptionText: {
    fontSize: 16,
  },
  selectedSortOptionText: {
    fontWeight: '600',
  },
  noReviewsContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noReviewsText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
    textAlign: 'center',
  },
});
