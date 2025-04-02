import React, { useState, useRef, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  TouchableOpacity, 
  TextInput, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform, 
  Keyboard,
  FlatList,
  Modal,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// Types
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
}

interface Chat {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messages: Message[];
  unread: number;
}

export default function CustomerServiceScreen() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  
  // State
  const [message, setMessage] = useState('');
  const [showChats, setShowChats] = useState(false);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [chats, setChats] = useState<Chat[]>([
    {
      id: '1',
      title: 'Order Issue',
      lastMessage: 'Can you tell me the problem you are having? so I can help solve it',
      timestamp: new Date('2025-04-02T10:51:00'),
      unread: 0,
      messages: [
        {
          id: '1',
          text: 'Hello, good morning.',
          sender: 'agent',
          timestamp: new Date('2025-04-02T10:41:00')
        },
        {
          id: '2',
          text: 'I am a Customer Service, is there anything I can help you with?',
          sender: 'agent',
          timestamp: new Date('2025-04-02T10:41:10')
        },
        {
          id: '3',
          text: 'Hi, I\'m having problems with my order & payment.',
          sender: 'user',
          timestamp: new Date('2025-04-02T10:50:00')
        },
        {
          id: '4',
          text: 'Can you help me?',
          sender: 'user',
          timestamp: new Date('2025-04-02T10:50:10')
        },
        {
          id: '5',
          text: 'Of course...',
          sender: 'agent',
          timestamp: new Date('2025-04-02T10:51:00')
        },
        {
          id: '6',
          text: 'Can you tell me the problem you are having? so I can help solve it',
          sender: 'agent',
          timestamp: new Date('2025-04-02T10:51:30')
        }
      ]
    },
    {
      id: '2',
      title: 'Shipping Question',
      lastMessage: 'Your order should arrive within 3-5 business days.',
      timestamp: new Date('2025-04-01T14:22:00'),
      unread: 1,
      messages: [
        {
          id: '1',
          text: 'Hello, how can I help you today?',
          sender: 'agent',
          timestamp: new Date('2025-04-01T14:15:00')
        },
        {
          id: '2',
          text: 'I want to know when my order will arrive.',
          sender: 'user',
          timestamp: new Date('2025-04-01T14:20:00')
        },
        {
          id: '3',
          text: 'Your order should arrive within 3-5 business days.',
          sender: 'agent',
          timestamp: new Date('2025-04-01T14:22:00')
        }
      ]
    }
  ]);
  
  // Set default active chat
  useEffect(() => {
    if (chats.length > 0 && !activeChat) {
      setActiveChat(chats[0]);
    }
  }, [chats, activeChat]);
  
  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [activeChat?.messages]);
  
  // Format time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Format date
  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };
  
  // Send message
  const handleSendMessage = () => {
    if (!message.trim() || !activeChat) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      text: message.trim(),
      sender: 'user',
      timestamp: new Date()
    };
    
    // Update active chat
    const updatedChat = {
      ...activeChat,
      lastMessage: message.trim(),
      timestamp: new Date(),
      messages: [...activeChat.messages, newMessage]
    };
    
    // Update chats list
    setChats(prevChats => 
      prevChats.map(chat => 
        chat.id === activeChat.id ? updatedChat : chat
      )
    );
    
    setActiveChat(updatedChat);
    setMessage('');
    
    // Simulate agent response after a delay
    setTimeout(() => {
      const agentResponse: Message = {
        id: Date.now().toString(),
        text: 'Thank you for your message. Our team will get back to you shortly.',
        sender: 'agent',
        timestamp: new Date()
      };
      
      const updatedChatWithResponse = {
        ...updatedChat,
        lastMessage: agentResponse.text,
        timestamp: new Date(),
        messages: [...updatedChat.messages, agentResponse]
      };
      
      setChats(prevChats => 
        prevChats.map(chat => 
          chat.id === activeChat.id ? updatedChatWithResponse : chat
        )
      );
      
      setActiveChat(updatedChatWithResponse);
    }, 1000);
  };
  
  // Create new chat
  const handleNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: 'New Conversation',
      lastMessage: 'How can we help you today?',
      timestamp: new Date(),
      unread: 0,
      messages: [
        {
          id: '1',
          text: 'Hello, welcome to customer service. How can we help you today?',
          sender: 'agent',
          timestamp: new Date()
        }
      ]
    };
    
    setChats(prevChats => [newChat, ...prevChats]);
    setActiveChat(newChat);
    setShowChats(false);
  };
  
  // Delete chat
  const handleDeleteChat = (chatId: string) => {
    Alert.alert(
      'Delete Conversation',
      'Are you sure you want to delete this conversation?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          onPress: () => {
            setChats(prevChats => prevChats.filter(chat => chat.id !== chatId));
            
            // If deleted chat was active, set first chat as active
            if (activeChat?.id === chatId) {
              const remainingChats = chats.filter(chat => chat.id !== chatId);
              setActiveChat(remainingChats.length > 0 ? remainingChats[0] : null);
            }
            
            setShowChats(false);
          },
          style: 'destructive'
        }
      ]
    );
  };
  
  // Edit chat title
  const handleEditChatTitle = (chatId: string, newTitle: string) => {
    setChats(prevChats => 
      prevChats.map(chat => 
        chat.id === chatId ? { ...chat, title: newTitle } : chat
      )
    );
    
    if (activeChat?.id === chatId) {
      setActiveChat(prev => prev ? { ...prev, title: newTitle } : null);
    }
  };
  
  // Mark chat as read
  const handleMarkAsRead = (chatId: string) => {
    setChats(prevChats => 
      prevChats.map(chat => 
        chat.id === chatId ? { ...chat, unread: 0 } : chat
      )
    );
  };
  
  // Select chat
  const handleSelectChat = (chat: Chat) => {
    setActiveChat(chat);
    handleMarkAsRead(chat.id);
    setShowChats(false);
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen 
        options={{
          title: activeChat?.title || 'Customer Service',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerStyle: {
            backgroundColor: Colors[colorScheme ?? 'light'].background,
          },
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View style={styles.headerRightContainer}>
              <TouchableOpacity onPress={() => setShowChats(true)} style={styles.headerButton}>
                <Ionicons name="chatbubbles-outline" size={24} color="#000" />
                {chats.some(chat => chat.unread > 0) && (
                  <View style={styles.unreadBadge}>
                    <ThemedText style={styles.unreadBadgeText}>
                      {chats.reduce((total, chat) => total + chat.unread, 0)}
                    </ThemedText>
                  </View>
                )}
              </TouchableOpacity>
              <TouchableOpacity onPress={() => Alert.alert('Calling customer service...')} style={styles.headerButton}>
                <Ionicons name="call-outline" size={24} color="#000" />
              </TouchableOpacity>
            </View>
          ),
        }} 
      />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {activeChat ? (
          <>
            <ScrollView 
              ref={scrollViewRef}
              style={styles.messagesContainer}
              contentContainerStyle={styles.messagesContent}
            >
              {/* Date Header */}
              <View style={styles.dateHeader}>
                <ThemedText style={styles.dateHeaderText}>
                  {formatDate(activeChat.messages[0]?.timestamp || new Date())}
                </ThemedText>
              </View>
              
              {/* Messages */}
              {activeChat.messages.map((msg, index) => (
                <View 
                  key={msg.id} 
                  style={[
                    styles.messageContainer,
                    msg.sender === 'user' ? styles.userMessageContainer : styles.agentMessageContainer
                  ]}
                >
                  <View 
                    style={[
                      styles.messageBubble,
                      msg.sender === 'user' ? styles.userMessageBubble : styles.agentMessageBubble
                    ]}
                  >
                    <ThemedText 
                      style={[
                        styles.messageText,
                        msg.sender === 'user' ? styles.userMessageText : styles.agentMessageText
                      ]}
                    >
                      {msg.text}
                    </ThemedText>
                  </View>
                  <ThemedText style={styles.messageTime}>
                    {formatTime(msg.timestamp)}
                  </ThemedText>
                </View>
              ))}
            </ScrollView>
            
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <TouchableOpacity style={styles.attachButton}>
                  <Ionicons name="image-outline" size={24} color="#888" />
                </TouchableOpacity>
                <TextInput
                  style={styles.input}
                  placeholder="Write your message..."
                  placeholderTextColor="#888"
                  value={message}
                  onChangeText={setMessage}
                  multiline
                />
              </View>
              <TouchableOpacity 
                style={[
                  styles.sendButton,
                  !message.trim() && styles.sendButtonDisabled
                ]}
                onPress={handleSendMessage}
                disabled={!message.trim()}
              >
                <Ionicons 
                  name="send" 
                  size={20} 
                  color={message.trim() ? '#fff' : '#aaa'} 
                />
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={styles.noChatsContainer}>
            <Ionicons name="chatbubbles-outline" size={64} color="#ccc" />
            <ThemedText style={styles.noChatsText}>No conversations yet</ThemedText>
            <TouchableOpacity 
              style={styles.newChatButton}
              onPress={handleNewChat}
            >
              <ThemedText style={styles.newChatButtonText}>Start New Conversation</ThemedText>
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
      
      {/* Chats Modal */}
      <Modal
        visible={showChats}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowChats(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Conversations</ThemedText>
              <TouchableOpacity onPress={() => setShowChats(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={styles.newChatItem}
              onPress={handleNewChat}
            >
              <Ionicons name="add-circle" size={24} color="#000" style={styles.newChatIcon} />
              <ThemedText style={styles.newChatText}>Start New Conversation</ThemedText>
            </TouchableOpacity>
            
            <FlatList
              data={chats}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={[
                    styles.chatItem,
                    activeChat?.id === item.id && styles.activeChatItem
                  ]}
                  onPress={() => handleSelectChat(item)}
                >
                  <View style={styles.chatItemContent}>
                    <View style={styles.chatItemHeader}>
                      <ThemedText style={styles.chatItemTitle}>{item.title}</ThemedText>
                      <ThemedText style={styles.chatItemTime}>
                        {formatDate(item.timestamp)}
                      </ThemedText>
                    </View>
                    <ThemedText 
                      style={[
                        styles.chatItemLastMessage,
                        item.unread > 0 && styles.unreadMessage
                      ]}
                      numberOfLines={1}
                    >
                      {item.lastMessage}
                    </ThemedText>
                  </View>
                  
                  {item.unread > 0 && (
                    <View style={styles.chatUnreadBadge}>
                      <ThemedText style={styles.chatUnreadBadgeText}>
                        {item.unread}
                      </ThemedText>
                    </View>
                  )}
                  
                  <TouchableOpacity 
                    style={styles.chatItemDelete}
                    onPress={() => handleDeleteChat(item.id)}
                  >
                    <Ionicons name="trash-outline" size={20} color="#f44336" />
                  </TouchableOpacity>
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.chatsList}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.noChatsInList}>
                  <ThemedText style={styles.noChatsInListText}>No conversations yet</ThemedText>
                </View>
              }
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerButton: {
    padding: 8,
  },
  headerRightContainer: {
    flexDirection: 'row',
  },
  unreadBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#f44336',
    borderRadius: 10,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 24,
  },
  dateHeader: {
    alignItems: 'center',
    marginVertical: 16,
  },
  dateHeaderText: {
    fontSize: 14,
    color: '#888',
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  messageContainer: {
    marginBottom: 16,
    maxWidth: '80%',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
  },
  agentMessageContainer: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    borderRadius: 16,
    padding: 12,
    marginBottom: 4,
  },
  userMessageBubble: {
    backgroundColor: '#222',
  },
  agentMessageBubble: {
    backgroundColor: '#e0e0e0',
  },
  messageText: {
    fontSize: 16,
  },
  userMessageText: {
    color: '#fff',
  },
  agentMessageText: {
    color: '#000',
  },
  messageTime: {
    fontSize: 12,
    color: '#888',
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
  },
  attachButton: {
    padding: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
    padding: 8,
  },
  sendButton: {
    backgroundColor: '#000',
    borderRadius: 24,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#e0e0e0',
  },
  noChatsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  noChatsText: {
    fontSize: 18,
    fontWeight: '500',
    marginTop: 16,
    marginBottom: 24,
  },
  newChatButton: {
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  newChatButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  chatsList: {
    padding: 16,
  },
  newChatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  newChatIcon: {
    marginRight: 12,
  },
  newChatText: {
    fontSize: 16,
    fontWeight: '500',
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  activeChatItem: {
    borderColor: '#000',
    backgroundColor: '#f9f9f9',
  },
  chatItemContent: {
    flex: 1,
  },
  chatItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatItemTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  chatItemTime: {
    fontSize: 12,
    color: '#888',
  },
  chatItemLastMessage: {
    fontSize: 14,
    color: '#666',
  },
  unreadMessage: {
    fontWeight: '500',
    color: '#000',
  },
  chatUnreadBadge: {
    backgroundColor: '#f44336',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  chatUnreadBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  chatItemDelete: {
    padding: 8,
  },
  noChatsInList: {
    padding: 24,
    alignItems: 'center',
  },
  noChatsInListText: {
    fontSize: 16,
    color: '#888',
  },
});
