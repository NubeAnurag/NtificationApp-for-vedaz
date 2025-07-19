# 📱 WhatsApp Clone - Personalized Messaging System

## 🎯 Overview
You now have a complete personalized messaging system! Send messages, voice calls, and video calls to specific friends (Manya, Manas, Aarav, Harsh, Anurag) from your phone's web browser to the Android emulator.

## 🚀 Quick Start

### 1. Start Everything
```bash
./start-messaging-test.sh
```

### 2. Run the App
```bash
cd AndroidTestApp/TestNotifications
npx react-native run-android
```

### 3. Open Web Interface on Your Phone
Go to: **http://192.168.29.3:3002/messaging**

## 👥 Your Friends

| Friend | Avatar | Personality | Chat ID |
|--------|--------|-------------|---------|
| **Manya** | 👩‍💻 | Tech enthusiast • Always coding | 1 |
| **Manas** | 🎮 | Gaming buddy • Always up for fun | 2 |
| **Aarav** | 📚 | Study partner • Always learning | 3 |
| **Harsh** | 🎬 | Movie lover • Entertainment expert | 4 |
| **Anurag** | ⭐ | Project creator • React Native dev | 5 |

## 🌐 Web Messaging Interface Features

### 📱 Individual Friend Cards
Each friend has their own card with:
- **Custom Message Input**: Type personalized messages
- **Send Message Button**: 💬 Send custom text
- **Voice Call Button**: 📞 Initiate voice call
- **Video Call Button**: 📹 Start video call

### 🚀 Quick Actions
- **📢 Group Message**: Send to all friends at once
- **🧪 Test All Notifications**: Send test messages and calls to everyone
- **🗑️ Clear All Inputs**: Reset all message fields

## 📱 What Happens on the Emulator

### When You Send a Message:
1. **Notification appears** with sender's name and message
2. **Chat list updates** with the new message
3. **Unread count increases** for that friend
4. **Message shows in chat** when you open the conversation

### When You Make a Call:
1. **Call notification appears** with caller's name
2. **High-priority notification** (stays on screen longer)
3. **Call screen opens** when tapped
4. **Call log updates** in the chat

## 🧪 Testing Examples

### Send Message to Manya
```bash
curl -X POST http://192.168.29.3:3002/send-personal-message \
  -H 'Content-Type: application/json' \
  -d '{"recipient":"Manya", "message":"Hey Manya! How is the coding going?", "sender":"Anurag"}'
```

### Video Call Harsh
```bash
curl -X POST http://192.168.29.3:3002/send-personal-call \
  -H 'Content-Type: application/json' \
  -d '{"recipient":"Harsh", "callType":"video", "caller":"Anurag"}'
```

### Voice Call Aarav
```bash
curl -X POST http://192.168.29.3:3002/send-personal-call \
  -H 'Content-Type: application/json' \
  -d '{"recipient":"Aarav", "callType":"voice", "caller":"Anurag"}'
```

## 🔄 Auto-Demo Features

### Automatic Friend Messages
Every 30 seconds, one of your friends will send you a message:
- **Manya**: "Hey! How are you doing? 😊"
- **Manas**: "Are you free for a quick chat?"
- **Aarav**: "Just wanted to say hi! 👋"
- **Harsh**: "How was your day today?"

These appear as real notifications on your emulator!

## 🎨 App Features

### WhatsApp-Like UI
- **Green WhatsApp theme** 🎨
- **Chat list** with unread counts
- **Individual chat screens** for each friend
- **Call screens** for voice/video calls
- **Real notification system** 📱

### Smart Chat Updates
- **Last message preview** updates in real-time
- **Timestamps** show when messages arrived
- **Unread badges** track new messages
- **Avatar system** for each friend

## 🌐 Web Interface URLs

| Purpose | URL |
|---------|-----|
| **Personalized Messaging** | http://192.168.29.3:3002/messaging |
| **Original Test Page** | http://192.168.29.3:3002/mobile |
| **Server Status** | http://192.168.29.3:3002/ |
| **Backend Health** | http://localhost:3002/ |

## 🔧 API Endpoints

### Personalized Endpoints
```
POST /send-personal-message
{
  "recipient": "Manya",
  "message": "Your custom message",
  "sender": "Your name"
}

POST /send-personal-call
{
  "recipient": "Harsh", 
  "callType": "voice|video",
  "caller": "Your name"
}
```

### Original Endpoints (Still Work)
```
POST /demo/message         # Demo message
POST /demo/voice-call      # Demo voice call  
POST /demo/video-call      # Demo video call
POST /send-message         # Generic message
POST /send-voice-call      # Generic voice call
POST /send-video-call      # Generic video call
```

## 🎯 Expected Results

### ✅ When Working Correctly:
1. **Web interface loads** on your phone
2. **Friend cards display** with names and avatars
3. **Messages send successfully** (get success alerts)
4. **Notifications appear** on emulator immediately
5. **Chat list updates** with new messages
6. **Auto-demo messages** arrive every 30 seconds

### ❌ Troubleshooting:
- **Can't access web page**: Check if backend is running on port 3002
- **No notifications**: Ensure Metro bundler is running and app is loaded
- **App not updating**: Try reloading the app (R+R in Metro)
- **Backend errors**: Check terminal for error messages

## 🏆 Success Indicators

You'll know it's working when:
- ✅ You can open the messaging interface on your phone
- ✅ Sending messages shows success alerts
- ✅ Notifications appear on the emulator with friend names
- ✅ Chat list updates with new messages and timestamps
- ✅ Auto-demo messages arrive from different friends
- ✅ Voice/video call notifications work
- ✅ Each friend has their own conversation thread

## 🎉 Congratulations!

You now have a fully functional personalized messaging system that mimics WhatsApp's behavior with:
- **Individual friend management**
- **Personalized notifications**
- **Real-time chat updates**
- **Voice and video call support**
- **Professional UI/UX design**

Perfect for your internship demonstration! 🚀 