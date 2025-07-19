/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Linking,
} from 'react-native';
// import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
}

interface Notification {
  id: string;
  type: 'message' | 'voice_call' | 'video_call';
  title: string;
  body: string;
  chatId: string;
  senderId: string;
  timestamp: string;
}

const App = () => {
  const [chats, setChats] = useState<Chat[]>([
    {
      id: '1',
      name: 'John Doe',
      lastMessage: 'Hey, how are you?',
      timestamp: '2:30 PM',
      unreadCount: 2,
    },
    {
      id: '2',
      name: 'Jane Smith',
      lastMessage: 'Can we talk?',
      timestamp: '1:45 PM',
      unreadCount: 0,
    },
    {
      id: '3',
      name: 'Mike Johnson',
      lastMessage: 'Meeting at 3 PM',
      timestamp: '12:20 PM',
      unreadCount: 1,
    },
  ]);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentScreen, setCurrentScreen] = useState<'chats' | 'chat' | 'call'>('chats');
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

  useEffect(() => {
    requestUserPermission();
    setupNotifications();
    loadNotifications();
    setupDeepLinking();
  }, []);

  const requestUserPermission = async () => {
    console.log('Demo mode: Simulating notification permission granted');
    getFCMToken();
  };

  const getFCMToken = async () => {
    try {
      const demoToken = 'demo-fcm-token-' + Date.now();
      console.log('Demo FCM Token:', demoToken);
      
      // Register token with backend
      try {
        const response = await fetch('http://localhost:3001/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: demoToken }),
        });
        const result = await response.json();
        console.log('Token registered:', result);
      } catch (error) {
        console.log('Backend not available:', error);
      }
    } catch (error) {
      console.log('Error getting FCM token:', error);
    }
  };

  const setupNotifications = () => {
    console.log('Demo mode: Notifications setup simulated');
    // In demo mode, we'll simulate notifications via backend API calls
    return () => console.log('Unsubscribe simulated');
  };

  const handleNotification = async (remoteMessage: any) => {
    const notification: Notification = {
      id: Date.now().toString(),
      type: remoteMessage.data?.type || 'message',
      title: remoteMessage.data?.title || remoteMessage.notification?.title || 'New Message',
      body: remoteMessage.data?.body || remoteMessage.notification?.body || 'You have a new message',
      chatId: remoteMessage.data?.chatId || '',
      senderId: remoteMessage.data?.senderId || '',
      timestamp: new Date().toLocaleTimeString(),
    };

    setNotifications(prev => [notification, ...prev]);
    await saveNotification(notification);

    // Update chat list if it's a message
    if (notification.type === 'message') {
      updateChatList(notification);
    }
  };

  const handleDeepLink = (remoteMessage: any) => {
    const screen = remoteMessage.data?.screen || 'chat';
    const chatId = remoteMessage.data?.chatId || '';
    const callType = remoteMessage.data?.callType || '';

    if (screen === 'call') {
      setCurrentScreen('call');
      Alert.alert(
        'Incoming Call',
        `Incoming ${callType} call from ${remoteMessage.data?.senderId || 'Unknown'}`,
        [
          {text: 'Decline', style: 'cancel'},
          {text: 'Accept', onPress: () => console.log('Call accepted')},
        ]
      );
    } else if (screen === 'chat') {
      const chat = chats.find(c => c.id === chatId);
      if (chat) {
        setSelectedChat(chat);
        setCurrentScreen('chat');
      }
    }
  };

  const setupDeepLinking = () => {
    Linking.addEventListener('url', ({url}) => {
      console.log('Deep link received:', url);
      // Handle custom URL schemes if needed
    });
  };

  const updateChatList = (notification: Notification) => {
    setChats(prev => {
      const existingChatIndex = prev.findIndex(chat => chat.id === notification.chatId);
      if (existingChatIndex >= 0) {
        const updatedChats = [...prev];
        updatedChats[existingChatIndex] = {
          ...updatedChats[existingChatIndex],
          lastMessage: notification.body,
          timestamp: notification.timestamp,
          unreadCount: updatedChats[existingChatIndex].unreadCount + 1,
        };
        return updatedChats;
      } else {
        // Add new chat
        return [
          {
            id: notification.chatId,
            name: notification.senderId,
            lastMessage: notification.body,
            timestamp: notification.timestamp,
            unreadCount: 1,
          },
          ...prev,
        ];
      }
    });
  };

  const saveNotification = async (notification: Notification) => {
    try {
      const existingNotifications = await AsyncStorage.getItem('notifications');
      const notifications = existingNotifications
        ? JSON.parse(existingNotifications)
        : [];
      notifications.unshift(notification);
      // Keep only last 50 notifications
      const trimmedNotifications = notifications.slice(0, 50);
      await AsyncStorage.setItem('notifications', JSON.stringify(trimmedNotifications));
    } catch (error) {
      console.log('Error saving notification:', error);
    }
  };

  const loadNotifications = async () => {
    try {
      const savedNotifications = await AsyncStorage.getItem('notifications');
      if (savedNotifications) {
        setNotifications(JSON.parse(savedNotifications));
      }
    } catch (error) {
      console.log('Error loading notifications:', error);
    }
  };

  const renderChatsScreen = () => (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>WhatsApp Clone</Text>
        <TouchableOpacity onPress={() => setCurrentScreen('chats')}>
          <Text style={styles.headerButton}>Chats</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.chatList}>
        {chats.map(chat => (
          <TouchableOpacity
            key={chat.id}
            style={styles.chatItem}
            onPress={() => {
              setSelectedChat(chat);
              setCurrentScreen('chat');
            }}>
            <View style={styles.chatAvatar}>
              <Text style={styles.avatarText}>{chat.name.charAt(0)}</Text>
            </View>
            <View style={styles.chatInfo}>
              <View style={styles.chatHeader}>
                <Text style={styles.chatName}>{chat.name}</Text>
                <Text style={styles.chatTime}>{chat.timestamp}</Text>
              </View>
              <View style={styles.chatFooter}>
                <Text style={styles.chatMessage} numberOfLines={1}>
                  {chat.lastMessage}
      </Text>
                {chat.unreadCount > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadCount}>{chat.unreadCount}</Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderChatScreen = () => (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setCurrentScreen('chats')}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{selectedChat?.name}</Text>
        <TouchableOpacity>
          <Text style={styles.headerButton}>Call</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.chatContainer}>
        <Text style={styles.placeholderText}>Chat with {selectedChat?.name}</Text>
        <Text style={styles.placeholderText}>Messages will appear here</Text>
      </View>
    </View>
  );

  const renderCallScreen = () => (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setCurrentScreen('chats')}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Call</Text>
        <View style={{width: 50}} />
      </View>
      
      <View style={styles.callContainer}>
        <Text style={styles.placeholderText}>Call Interface</Text>
        <Text style={styles.placeholderText}>Voice/Video call controls would go here</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      {currentScreen === 'chats' && renderChatsScreen()}
      {currentScreen === 'chat' && renderChatScreen()}
      {currentScreen === 'call' && renderCallScreen()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#128C7E',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerButton: {
    fontSize: 16,
    color: '#ffffff',
  },
  backButton: {
    fontSize: 16,
    color: '#ffffff',
  },
  chatList: {
    flex: 1,
  },
  chatItem: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  chatAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#128C7E',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  chatInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  chatTime: {
    fontSize: 12,
    color: '#666666',
  },
  chatFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatMessage: {
    flex: 1,
    fontSize: 14,
    color: '#666666',
    marginRight: 8,
  },
  unreadBadge: {
    backgroundColor: '#25D366',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadCount: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  chatContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  callContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  placeholderText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default App;
