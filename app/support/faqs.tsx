import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  TouchableOpacity, 
  ScrollView, 
  TextInput,
  Animated,
  Pressable
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// FAQ Categories
type Category = 'general' | 'account' | 'service' | 'payment';

// FAQ Item Interface
interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: Category;
}

export default function FAQsScreen() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  
  // State
  const [selectedCategory, setSelectedCategory] = useState<Category>('general');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  // FAQ Data
  const faqData: FAQItem[] = [
    {
      id: '1',
      question: 'How do I make a purchase?',
      answer: 'When you find a product you want to purchase, tap on it to view the product details. Check the price, description, and available options (if applicable), and then tap the "Add to Cart" button. Follow the on-screen instructions to complete the purchase, including providing shipping details and payment information.',
      category: 'general'
    },
    {
      id: '2',
      question: 'What payment methods are accepted?',
      answer: 'We accept credit/debit cards (Visa, Mastercard, American Express), Apple Pay, and cash on delivery for eligible orders. You can manage your payment methods in the Payment Methods section of your account.',
      category: 'payment'
    },
    {
      id: '3',
      question: 'How do I track my orders?',
      answer: 'You can track your orders by going to the My Orders section in your account. There you\'ll find a list of all your orders with their current status. Tap on any order to view detailed information including tracking numbers when available.',
      category: 'service'
    },
    {
      id: '4',
      question: 'Can I cancel or return an order?',
      answer: 'Yes, you can cancel an order if it hasn\'t been shipped yet. Once shipped, you can return items within 30 days of delivery. Go to My Orders, select the order you want to cancel or return, and follow the instructions. Please note that some items may not be eligible for return.',
      category: 'service'
    },
    {
      id: '5',
      question: 'How can I contact customer support for assistance?',
      answer: 'You can contact our customer support team through the Help section in the app. We offer live chat support during business hours, or you can send us an email anytime. Our team typically responds within 24 hours.',
      category: 'general'
    },
    {
      id: '6',
      question: 'How do I create an account?',
      answer: 'To create an account, tap on the Account icon at the bottom of the screen and select "Sign Up". Fill in your details including name, email, and password. You can also sign up using your Google or Apple account for faster registration.',
      category: 'account'
    },
    {
      id: '7',
      question: 'How do I reset my password?',
      answer: 'If you forgot your password, go to the login screen and tap on "Forgot Password". Enter the email address associated with your account, and we\'ll send you instructions to reset your password.',
      category: 'account'
    },
    {
      id: '8',
      question: 'What are the shipping costs?',
      answer: 'Shipping costs vary based on your location and the size of your order. Standard shipping is free for orders over $50. You can view the exact shipping cost during checkout before completing your purchase.',
      category: 'payment'
    }
  ];
  
  // Filter FAQs based on selected category and search query
  const filteredFAQs = faqData.filter(faq => {
    const matchesCategory = selectedCategory === faq.category;
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });
  
  // Toggle FAQ expansion
  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'FAQs',
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
      
      <View style={styles.content}>
        {/* Category Tabs */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.categoryContainer}
          contentContainerStyle={styles.categoryContentContainer}
        >
          <TouchableOpacity 
            style={[
              styles.categoryTab, 
              selectedCategory === 'general' && styles.selectedCategoryTab
            ]}
            onPress={() => setSelectedCategory('general')}
          >
            <ThemedText 
              style={[
                styles.categoryText, 
                selectedCategory === 'general' && styles.selectedCategoryText
              ]}
            >
              General
            </ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.categoryTab, 
              selectedCategory === 'account' && styles.selectedCategoryTab
            ]}
            onPress={() => setSelectedCategory('account')}
          >
            <ThemedText 
              style={[
                styles.categoryText, 
                selectedCategory === 'account' && styles.selectedCategoryText
              ]}
            >
              Account
            </ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.categoryTab, 
              selectedCategory === 'service' && styles.selectedCategoryTab
            ]}
            onPress={() => setSelectedCategory('service')}
          >
            <ThemedText 
              style={[
                styles.categoryText, 
                selectedCategory === 'service' && styles.selectedCategoryText
              ]}
            >
              Service
            </ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.categoryTab, 
              selectedCategory === 'payment' && styles.selectedCategoryTab
            ]}
            onPress={() => setSelectedCategory('payment')}
          >
            <ThemedText 
              style={[
                styles.categoryText, 
                selectedCategory === 'payment' && styles.selectedCategoryText
              ]}
            >
              Payment
            </ThemedText>
          </TouchableOpacity>
        </ScrollView>
        
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for questions..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#888" />
            </TouchableOpacity>
          )}
        </View>
        
        {/* FAQ List */}
        <ScrollView style={styles.faqList} showsVerticalScrollIndicator={false}>
          {filteredFAQs.map(faq => (
            <Pressable 
              key={faq.id} 
              style={styles.faqItem}
              onPress={() => toggleExpand(faq.id)}
            >
              <View style={styles.faqHeader}>
                <ThemedText style={styles.faqQuestion}>{faq.question}</ThemedText>
                <Ionicons 
                  name={expandedId === faq.id ? 'chevron-up' : 'chevron-down'} 
                  size={24} 
                  color="#000" 
                />
              </View>
              
              {expandedId === faq.id && (
                <View style={styles.faqAnswer}>
                  <ThemedText style={styles.faqAnswerText}>{faq.answer}</ThemedText>
                </View>
              )}
            </Pressable>
          ))}
          
          {filteredFAQs.length === 0 && (
            <View style={styles.noResults}>
              <Ionicons name="search" size={48} color="#ccc" />
              <ThemedText style={styles.noResultsText}>
                No FAQs found for "{searchQuery}"
              </ThemedText>
              <ThemedText style={styles.noResultsSubtext}>
                Try a different search term or category
              </ThemedText>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backButton: {
    marginLeft: 10,
  },
  notificationButton: {
    marginRight: 10,
  },
  content: {
    flex: 1,
  },
  categoryContainer: {
    flexGrow: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 8,
  },
  categoryContentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  categoryTab: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  selectedCategoryTab: {
    backgroundColor: '#000',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 24,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  faqList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  faqItem: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  faqQuestion: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    marginRight: 16,
  },
  faqAnswer: {
    padding: 16,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  faqAnswerText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666',
  },
  noResults: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  noResultsText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 16,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#888',
    marginTop: 8,
  },
});
