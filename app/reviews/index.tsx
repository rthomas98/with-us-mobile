import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, FlatList, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';

// Colors
const black = '#000000';
const white = '#FFFFFF';
const lightGray = '#F5F5F5';
const mediumGray = '#E5E5E5';
const starColor = '#FFA41C';
const red = '#FF3B30';

// Mock data for reviews
interface Review {
  id: string;
  rating: number;
  comment: string;
  userName: string;
  date: string;
}

const mockReviews: Review[] = [
  {
    id: '1',
    rating: 5,
    comment: 'The item is very good, my son likes it very much and plays every day.',
    userName: 'Wade Warren',
    date: '6 days ago',
  },
  {
    id: '2',
    rating: 4,
    comment: 'The seller is very fast in sending packet, I just bought it and the item arrived in just 1 day!',
    userName: 'Guy Hawkins',
    date: '1 week ago',
  },
  {
    id: '3',
    rating: 4,
    comment: 'I just bought it and the stuff is really good! I highly recommend it!',
    userName: 'Robert Fox',
    date: '2 weeks ago',
  },
  {
    id: '4',
    rating: 4,
    comment: 'Great quality and fast delivery. Would buy again.',
    userName: 'Jane Cooper',
    date: '3 weeks ago',
  },
  {
    id: '5',
    rating: 3,
    comment: 'Good product but the packaging could be better.',
    userName: 'Esther Howard',
    date: '1 month ago',
  },
];

// Rating distribution data
interface RatingDistribution {
  rating: number;
  percentage: number;
}

const ratingDistribution: RatingDistribution[] = [
  { rating: 5, percentage: 75 },
  { rating: 4, percentage: 60 },
  { rating: 3, percentage: 25 },
  { rating: 2, percentage: 10 },
  { rating: 1, percentage: 5 },
];

export default function ReviewsScreen() {
  const router = useRouter();
  const [sortOption, setSortOption] = useState('Most Relevant');
  const [showSortModal, setShowSortModal] = useState(false);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  
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
    ? mockReviews.filter(review => review.rating === selectedRating)
    : mockReviews;

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
            name={star <= rating ? 'star' : 'star-outline'}
            size={20}
            color={starColor}
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

  // Render a single review item
  const renderReviewItem = ({ item }: { item: Review }) => (
    <View style={styles.reviewItem}>
      {renderStars(item.rating)}
      <ThemedText style={styles.reviewComment}>{item.comment}</ThemedText>
      <View style={styles.reviewFooter}>
        <ThemedText style={styles.reviewAuthor}>{item.userName}</ThemedText>
        <ThemedText style={styles.reviewDate}>• {item.date}</ThemedText>
      </View>
      <View style={styles.reviewDivider} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={black} />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Reviews</ThemedText>
        <TouchableOpacity style={styles.notificationIcon} onPress={() => router.push('/notifications' as any)}>
          <Ionicons name="notifications-outline" size={24} color={black} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Rating Overview */}
        <View style={styles.ratingOverview}>
          <View style={styles.ratingScoreContainer}>
            <ThemedText style={styles.ratingScore}>4.0</ThemedText>
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons
                  key={star}
                  name={star <= 4 ? 'star' : 'star-outline'}
                  size={24}
                  color={starColor}
                />
              ))}
            </View>
            <ThemedText style={styles.totalRatings}>1034 Ratings</ThemedText>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: mediumGray,
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
  ratingOverview: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  ratingScoreContainer: {
    alignItems: 'center',
    marginBottom: 16,
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
    marginVertical: 4,
  },
  ratingBarsContainer: {
    marginTop: 8,
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
    alignItems: 'center',
  },
  reviewAuthor: {
    fontSize: 14,
    fontWeight: '600',
  },
  reviewDate: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  reviewDivider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginTop: 12,
  },
  // Sort Modal Styles
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
