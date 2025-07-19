const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3002;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve mobile test page
app.get('/mobile', (req, res) => {
  res.sendFile(path.join(__dirname, 'mobile-test.html'));
});

// Serve messaging interface
app.get('/messaging', (req, res) => {
  res.sendFile(path.join(__dirname, 'messaging-interface.html'));
});

// Store FCM tokens (in production, this would be in a database)
const fcmTokens = new Set();

// Store pending notifications for the app to poll
const pendingNotifications = [];

// Friends data
const friends = {
  'Manya': { id: '1', avatar: '👩‍💻', lastSeen: 'online' },
  'Manas': { id: '2', avatar: '🎮', lastSeen: '5 min ago' },
  'Aarav': { id: '3', avatar: '📚', lastSeen: '2 min ago' },
  'Harsh': { id: '4', avatar: '🎬', lastSeen: '1 hour ago' },
  'Anurag': { id: '5', avatar: '⭐', lastSeen: 'online' }
};

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'WhatsApp Clone Backend Server (Demo Mode)',
    note: 'Firebase not configured - notifications are simulated',
    endpoints: {
      register: 'POST /register',
      sendMessage: 'POST /send-message',
      sendVoiceCall: 'POST /send-voice-call',
      sendVideoCall: 'POST /send-video-call',
      sendPersonalMessage: 'POST /send-personal-message',
      sendPersonalCall: 'POST /send-personal-call',
      getPendingNotifications: 'GET /get-pending-notifications',
      tokens: 'GET /tokens',
      demo: 'POST /demo/*',
      messaging: 'GET /messaging'
    }
  });
});

// Register FCM token
app.post('/register', (req, res) => {
  const { token } = req.body;
  
  if (!token) {
    return res.status(400).json({ error: 'FCM token is required' });
  }
  
  fcmTokens.add(token);
  console.log(`FCM token registered: ${token}`);
  console.log(`Total registered tokens: ${fcmTokens.size}`);
  
  res.json({ 
    message: 'Token registered successfully (demo mode)',
    note: 'In production, this would register with Firebase'
  });
});

// Send personalized message notification
app.post('/send-personal-message', (req, res) => {
  const { recipient, message, sender } = req.body;
  
  if (!recipient || !message) {
    return res.status(400).json({ error: 'Recipient and message are required' });
  }

  const friend = friends[recipient];
  if (!friend) {
    return res.status(404).json({ error: 'Friend not found' });
  }

  const notificationData = {
    type: 'message',
    title: `${sender || 'Unknown'} → ${recipient}`,
    body: message,
    chatId: friend.id,
    senderId: sender || 'Web User',
    senderName: sender || 'Web User',
    recipientName: recipient,
    recipientAvatar: friend.avatar,
    screen: 'chat',
    timestamp: new Date().toISOString()
  };

  // Log the notification (in production, this would send via FCM)
  console.log(`\n💬 Personal message notification:`, {
    ...notificationData,
    recipient: recipient,
    message: message
  });

  // Add to pending notifications for the app to poll
  pendingNotifications.push(notificationData);

  res.json({ 
    message: `Message notification sent to ${recipient} (demo mode)`,
    data: notificationData
  });
});

// Send personalized call notification
app.post('/send-personal-call', (req, res) => {
  const { recipient, callType, caller } = req.body;
  
  if (!recipient || !callType) {
    return res.status(400).json({ error: 'Recipient and callType are required' });
  }

  const friend = friends[recipient];
  if (!friend) {
    return res.status(404).json({ error: 'Friend not found' });
  }

  const callTypeText = callType === 'voice' ? 'Voice Call' : 'Video Call';
  const callIcon = callType === 'voice' ? '📞' : '📹';

  const notificationData = {
    type: `${callType}_call`,
    title: `${callIcon} ${caller || 'Someone'} → ${recipient}`,
    body: `Incoming ${callTypeText.toLowerCase()}`,
    chatId: friend.id,
    senderId: caller || 'Web User',
    callerName: caller || 'Web User',
    recipientName: recipient,
    recipientAvatar: friend.avatar,
    callType: callType,
    screen: 'call',
    timestamp: new Date().toISOString()
  };

  // Log the notification (in production, this would send via FCM)
  console.log(`\n${callIcon} Personal ${callType} call notification:`, {
    ...notificationData,
    recipient: recipient,
    caller: caller || 'Web User'
  });

  // Add to pending notifications for the app to poll
  pendingNotifications.push(notificationData);

  res.json({ 
    message: `${callTypeText} notification sent to ${recipient} (demo mode)`,
    data: notificationData
  });
});

// Original endpoints (keeping for backward compatibility)
app.post('/send-message', (req, res) => {
  const { title, body, chatId, senderId } = req.body;
  
  const notificationData = {
    type: 'message',
    title: title || 'New Message',
    body: body || 'You have a new message',
    chatId: chatId || 'general',
    senderId: senderId || 'unknown',
    screen: 'chat',
    timestamp: new Date().toISOString()
  };

  console.log(`\n💬 Generic message notification:`, notificationData);

  res.json({ 
    message: 'Message notification sent (demo mode)',
    data: notificationData
  });
});

app.post('/send-voice-call', (req, res) => {
  const { title, body, chatId, senderId } = req.body;
  
  const notificationData = {
    type: 'voice_call',
    title: title || 'Incoming Voice Call',
    body: body || 'Someone is calling you',
    chatId: chatId || 'general',
    senderId: senderId || 'unknown',
    callType: 'voice',
    screen: 'call',
    timestamp: new Date().toISOString()
  };

  console.log(`\n📞 Generic voice call notification:`, notificationData);

  res.json({ 
    message: 'Voice call notification sent (demo mode)',
    data: notificationData
  });
});

app.post('/send-video-call', (req, res) => {
  const { title, body, chatId, senderId } = req.body;
  
  const notificationData = {
    type: 'video_call',
    title: title || 'Incoming Video Call',
    body: body || 'Someone wants to video chat',
    chatId: chatId || 'general',
    senderId: senderId || 'unknown',
    callType: 'video',
    screen: 'call',
    timestamp: new Date().toISOString()
  };

  console.log(`\n📹 Generic video call notification:`, notificationData);

  res.json({ 
    message: 'Video call notification sent (demo mode)',
    data: notificationData
  });
});

// Get pending notifications (for app polling)
app.get('/get-pending-notifications', (req, res) => {
  const notifications = [...pendingNotifications];
  pendingNotifications.length = 0; // Clear the array
  res.json({
    notifications: notifications,
    count: notifications.length
  });
});

// Get registered tokens
app.get('/tokens', (req, res) => {
  res.json({
    tokens: Array.from(fcmTokens),
    count: fcmTokens.size,
    note: 'Demo mode - tokens not actually used for FCM'
  });
});

// Demo endpoints
app.post('/demo/message', (req, res) => {
  const demoNotification = {
    type: 'message',
    title: 'Demo Message',
    body: 'This is a test message from the backend!',
    chatId: 'demo-chat-1',
    senderId: 'Demo User',
    screen: 'chat',
    timestamp: new Date().toISOString()
  };

  console.log(`\n🧪 Demo message notification:`, demoNotification);

  res.json({ 
    message: 'Demo message notification sent',
    data: demoNotification
  });
});

app.post('/demo/voice-call', (req, res) => {
  const demoNotification = {
    type: 'voice_call',
    title: 'Demo Voice Call',
    body: 'Incoming demo voice call',
    chatId: 'demo-chat-1',
    senderId: 'Demo Caller',
    callType: 'voice',
    screen: 'call',
    timestamp: new Date().toISOString()
  };

  console.log(`\n🧪 Demo voice call notification:`, demoNotification);

  res.json({ 
    message: 'Demo voice call notification sent',
    data: demoNotification
  });
});

app.post('/demo/video-call', (req, res) => {
  const demoNotification = {
    type: 'video_call',
    title: 'Demo Video Call',
    body: 'Incoming demo video call',
    chatId: 'demo-chat-1',
    senderId: 'Demo Caller',
    callType: 'video',
    screen: 'call',
    timestamp: new Date().toISOString()
  };

  console.log(`\n🧪 Demo video call notification:`, demoNotification);

  res.json({ 
    message: 'Demo video call notification sent',
    data: demoNotification
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 WhatsApp Clone Backend Server (Demo Mode) running on port ${PORT}`);
  console.log(`📡 Server URL: http://localhost:${PORT}`);
  console.log(`📋 Available endpoints:`);
  console.log(`  GET  / - Server info`);
  console.log(`  POST /register - Register FCM token`);
  console.log(`  POST /send-message - Send message notification`);
  console.log(`  POST /send-voice-call - Send voice call notification`);
  console.log(`  POST /send-video-call - Send video call notification`);
  console.log(`  POST /send-personal-message - Send personalized message`);
  console.log(`  POST /send-personal-call - Send personalized call`);
  console.log(`  GET  /get-pending-notifications - Get pending notifications for app`);
  console.log(`  GET  /tokens - Get registered tokens`);
  console.log(`  GET  /mobile - Mobile test interface`);
  console.log(`  GET  /messaging - Personal messaging interface`);
  console.log(`  POST /demo/message - Send demo message`);
  console.log(`  POST /demo/voice-call - Send demo voice call`);
  console.log(`  POST /demo/video-call - Send demo video call`);
  console.log(`💡 Note: This is demo mode - notifications are logged but not sent via FCM`);
  console.log(`🔧 To enable real FCM notifications, configure Firebase and use server.js`);
});

// Auto-send demo notifications every 30 seconds for testing
let demoCounter = 0;
const demoFriends = ['Manya', 'Manas', 'Aarav', 'Harsh'];
const demoMessages = [
  'Hey! How are you doing? 😊',
  'Are you free for a quick chat?',
  'Just wanted to say hi! 👋',
  'How was your day today?',
  'Want to hang out later? 🎉'
];

setInterval(() => {
  demoCounter++;
  const friend = demoFriends[demoCounter % demoFriends.length];
  const message = demoMessages[demoCounter % demoMessages.length];
  
  // Simulate a message from a friend every 30 seconds
  const demoNotification = {
    type: 'message',
    title: `${friend} 💬`,
    body: message,
    chatId: friends[friend].id,
    senderId: friend,
    senderName: friend,
    recipientName: 'Anurag',
    recipientAvatar: friends[friend].avatar,
    screen: 'chat',
    timestamp: new Date().toISOString()
  };

  console.log(`\n🤖 Auto-demo notification from ${friend}:`, demoNotification);
  
  // Add to pending notifications for the app to poll
  pendingNotifications.push(demoNotification);
}, 30000); // Every 30 seconds 