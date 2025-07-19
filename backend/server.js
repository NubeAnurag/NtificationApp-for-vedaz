const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const admin = require('firebase-admin');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize Firebase Admin SDK
// Note: You'll need to replace this with your actual Firebase service account key
let serviceAccount;
try {
  serviceAccount = require('./firebase-service-account.json');
} catch (error) {
  console.log('Firebase service account not found. Using placeholder configuration.');
  serviceAccount = {
    projectId: 'whatsapp-clone-push',
    privateKeyId: 'placeholder',
    privateKey: 'placeholder',
    clientEmail: 'placeholder@whatsapp-clone-push.iam.gserviceaccount.com',
    clientId: 'placeholder',
    authUri: 'https://accounts.google.com/o/oauth2/auth',
    tokenUri: 'https://oauth2.googleapis.com/token',
    authProviderX509CertUrl: 'https://www.googleapis.com/oauth2/v1/certs',
    clientX509CertUrl: 'placeholder'
  };
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'whatsapp-clone-push'
});

// Store FCM tokens (in production, this would be in a database)
const fcmTokens = new Set();

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'WhatsApp Clone Backend Server',
    endpoints: {
      register: 'POST /register',
      sendMessage: 'POST /send-message',
      sendVoiceCall: 'POST /send-voice-call',
      sendVideoCall: 'POST /send-video-call',
      tokens: 'GET /tokens'
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
    message: 'Token registered successfully',
    totalTokens: fcmTokens.size
  });
});

// Send message notification
app.post('/send-message', async (req, res) => {
  const { title, body, chatId, senderId } = req.body;
  
  if (!title || !body) {
    return res.status(400).json({ error: 'Title and body are required' });
  }
  
  const message = {
    data: {
      type: 'message',
      title: title,
      body: body,
      chatId: chatId || 'default-chat',
      senderId: senderId || 'Unknown',
      screen: 'chat'
    },
    notification: {
      title: title,
      body: body
    },
    android: {
      priority: 'high',
      notification: {
        channelId: 'whatsapp_clone_channel',
        priority: 'high',
        defaultSound: true,
        defaultVibrateTimings: true
      }
    }
  };
  
  try {
    const results = await sendToAllTokens(message);
    res.json({
      message: 'Message notification sent',
      results: results
    });
  } catch (error) {
    console.error('Error sending message notification:', error);
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

// Send voice call notification
app.post('/send-voice-call', async (req, res) => {
  const { senderId, chatId } = req.body;
  
  const message = {
    data: {
      type: 'voice_call',
      title: 'Voice Call',
      body: `Incoming voice call from ${senderId || 'Unknown'}`,
      chatId: chatId || 'default-chat',
      senderId: senderId || 'Unknown',
      callType: 'voice',
      screen: 'call'
    },
    notification: {
      title: 'Voice Call',
      body: `Incoming voice call from ${senderId || 'Unknown'}`
    },
    android: {
      priority: 'high',
      notification: {
        channelId: 'whatsapp_clone_channel',
        priority: 'max',
        defaultSound: true,
        defaultVibrateTimings: true,
        ongoing: true
      }
    }
  };
  
  try {
    const results = await sendToAllTokens(message);
    res.json({
      message: 'Voice call notification sent',
      results: results
    });
  } catch (error) {
    console.error('Error sending voice call notification:', error);
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

// Send video call notification
app.post('/send-video-call', async (req, res) => {
  const { senderId, chatId } = req.body;
  
  const message = {
    data: {
      type: 'video_call',
      title: 'Video Call',
      body: `Incoming video call from ${senderId || 'Unknown'}`,
      chatId: chatId || 'default-chat',
      senderId: senderId || 'Unknown',
      callType: 'video',
      screen: 'call'
    },
    notification: {
      title: 'Video Call',
      body: `Incoming video call from ${senderId || 'Unknown'}`
    },
    android: {
      priority: 'high',
      notification: {
        channelId: 'whatsapp_clone_channel',
        priority: 'max',
        defaultSound: true,
        defaultVibrateTimings: true,
        ongoing: true
      }
    }
  };
  
  try {
    const results = await sendToAllTokens(message);
    res.json({
      message: 'Video call notification sent',
      results: results
    });
  } catch (error) {
    console.error('Error sending video call notification:', error);
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

// Get registered tokens
app.get('/tokens', (req, res) => {
  res.json({
    tokens: Array.from(fcmTokens),
    count: fcmTokens.size
  });
});

// Helper function to send to all registered tokens
async function sendToAllTokens(message) {
  const results = [];
  
  for (const token of fcmTokens) {
    try {
      const response = await admin.messaging().send({
        token: token,
        ...message
      });
      results.push({ token, success: true, messageId: response });
    } catch (error) {
      console.error(`Error sending to token ${token}:`, error);
      results.push({ token, success: false, error: error.message });
      
      // Remove invalid tokens
      if (error.code === 'messaging/invalid-registration-token' ||
          error.code === 'messaging/registration-token-not-registered') {
        fcmTokens.delete(token);
      }
    }
  }
  
  return results;
}

// Demo endpoints for testing
app.post('/demo/message', async (req, res) => {
  const message = {
    data: {
      type: 'message',
      title: 'Demo Message',
      body: 'This is a test message from the backend!',
      chatId: 'demo-chat-1',
      senderId: 'Demo User',
      screen: 'chat'
    },
    notification: {
      title: 'Demo Message',
      body: 'This is a test message from the backend!'
    },
    android: {
      priority: 'high',
      notification: {
        channelId: 'whatsapp_clone_channel',
        priority: 'high',
        defaultSound: true,
        defaultVibrateTimings: true
      }
    }
  };
  
  try {
    const results = await sendToAllTokens(message);
    res.json({
      message: 'Demo message sent',
      results: results
    });
  } catch (error) {
    console.error('Error sending demo message:', error);
    res.status(500).json({ error: 'Failed to send demo message' });
  }
});

app.post('/demo/voice-call', async (req, res) => {
  const message = {
    data: {
      type: 'voice_call',
      title: 'Demo Voice Call',
      body: 'Incoming demo voice call',
      chatId: 'demo-chat-1',
      senderId: 'Demo Caller',
      callType: 'voice',
      screen: 'call'
    },
    notification: {
      title: 'Demo Voice Call',
      body: 'Incoming demo voice call'
    },
    android: {
      priority: 'high',
      notification: {
        channelId: 'whatsapp_clone_channel',
        priority: 'max',
        defaultSound: true,
        defaultVibrateTimings: true,
        ongoing: true
      }
    }
  };
  
  try {
    const results = await sendToAllTokens(message);
    res.json({
      message: 'Demo voice call sent',
      results: results
    });
  } catch (error) {
    console.error('Error sending demo voice call:', error);
    res.status(500).json({ error: 'Failed to send demo voice call' });
  }
});

app.post('/demo/video-call', async (req, res) => {
  const message = {
    data: {
      type: 'video_call',
      title: 'Demo Video Call',
      body: 'Incoming demo video call',
      chatId: 'demo-chat-1',
      senderId: 'Demo Caller',
      callType: 'video',
      screen: 'call'
    },
    notification: {
      title: 'Demo Video Call',
      body: 'Incoming demo video call'
    },
    android: {
      priority: 'high',
      notification: {
        channelId: 'whatsapp_clone_channel',
        priority: 'max',
        defaultSound: true,
        defaultVibrateTimings: true,
        ongoing: true
      }
    }
  };
  
  try {
    const results = await sendToAllTokens(message);
    res.json({
      message: 'Demo video call sent',
      results: results
    });
  } catch (error) {
    console.error('Error sending demo video call:', error);
    res.status(500).json({ error: 'Failed to send demo video call' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`WhatsApp Clone Backend Server running on port ${PORT}`);
  console.log(`Server URL: http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('  GET  / - Server info');
  console.log('  POST /register - Register FCM token');
  console.log('  POST /send-message - Send message notification');
  console.log('  POST /send-voice-call - Send voice call notification');
  console.log('  POST /send-video-call - Send video call notification');
  console.log('  GET  /tokens - Get registered tokens');
  console.log('  POST /demo/message - Send demo message');
  console.log('  POST /demo/voice-call - Send demo voice call');
  console.log('  POST /demo/video-call - Send demo video call');
}); 