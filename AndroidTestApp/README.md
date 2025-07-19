# 🤖 Android Notification Test App

This is a simplified test app specifically designed to demonstrate push notifications on Android emulator without Firebase complexity. It connects to your existing backend server and tests all notification functionality.

## 🎯 What This Demonstrates

✅ **Local Push Notifications** - Works without internet  
✅ **Backend Connection** - Connects to your Node.js server  
✅ **Android 15 Support** - Configured for latest Android  
✅ **Notification Types** - Message, Voice Call, Video Call  
✅ **Background Notifications** - Works when app is minimized  
✅ **Deep Linking** - Call notifications show alert dialogs  
✅ **Real-time Updates** - Notification history in app  

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)
```bash
./run-android-test.sh
```

### Option 2: Manual Steps

1. **Start Backend Server**:
```bash
cd ../backend && node server-simple.js
```

2. **Start Android Emulator** (Android Studio):
   - Open Android Studio
   - Tools > AVD Manager
   - Start an existing emulator or create new one

3. **Run Test App**:
```bash
cd TestNotifications
npx react-native start --reset-cache &
npx react-native run-android
```

## 📋 Prerequisites

### Required
- ✅ **Node.js** (v16+)
- ✅ **Android Studio** with SDK
- ✅ **Android Emulator** (API 34 or 35)
- ✅ **Java Development Kit**

### Setup Android Development Environment

1. **Install Android Studio**:
   - Download: https://developer.android.com/studio
   - Install with default settings

2. **Configure SDK**:
   - Open Android Studio
   - Go to Settings > Appearance & Behavior > System Settings > Android SDK
   - Install:
     - Android SDK Platform 35 (Android 15)
     - Android SDK Build-Tools 34.0.0
     - Android SDK Command-line Tools

3. **Create Virtual Device**:
   - Tools > AVD Manager
   - Create Virtual Device
   - Choose Pixel 7 or similar
   - Select **API 35** (Android 15) or **API 34**
   - Finish and start emulator

4. **Set Environment Variables** (Add to ~/.zshrc or ~/.bash_profile):
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

## 🧪 Testing Instructions

### 1. Test Local Notifications
- Open the test app on emulator
- Tap "📱 Test Message" - Should show notification immediately
- Tap "📞 Test Voice Call" - Should show notification + alert dialog
- Tap "📹 Test Video Call" - Should show notification + alert dialog

### 2. Test Backend Notifications
- Ensure backend server is running (port 3001)
- Tap "🌐 Backend Message" - Calls backend API and shows notification
- Check app shows "✅ Connected" status

### 3. Test Background Notifications
- Put app in background (press home button)
- Run curl commands to trigger notifications:
```bash
curl -X POST http://localhost:3001/demo/message
curl -X POST http://localhost:3001/demo/voice-call
curl -X POST http://localhost:3001/demo/video-call
```

### 4. Test Notification History
- All notifications appear in app's notification list
- Tap "Clear" to clear history

## 🔧 Network Configuration

The app uses `http://10.0.2.2:3001` to connect to backend from Android emulator:
- `10.0.2.2` is the Android emulator's way to access host machine's `localhost`
- Backend server runs on port `3001`

## 📱 App Features

### UI Sections
1. **📱 Local Notifications** - Test notifications directly on device
2. **🌐 Backend Notifications** - Test notifications via backend API
3. **📋 Recent Notifications** - View notification history
4. **ℹ️ Setup Instructions** - Quick help guide

### Notification Types
- **💬 Message**: Standard notification with sound
- **📞 Voice Call**: High priority with alert dialog
- **📹 Video Call**: High priority with alert dialog

### Backend Integration
- Automatic connection testing
- Real-time status display
- API call testing
- Simulated FCM notifications

## 🐛 Troubleshooting

### Common Issues

1. **"Backend not reachable"**
   - Ensure backend server is running: `cd ../backend && node server-simple.js`
   - Check backend URL in app (should be `http://10.0.2.2:3001`)

2. **"No Android Virtual Devices found"**
   - Open Android Studio > Tools > AVD Manager
   - Create a new virtual device with API 34 or 35

3. **Build errors**
   ```bash
   cd TestNotifications
   npx react-native start --reset-cache
   npx react-native clean
   npx react-native run-android
   ```

4. **Metro port conflict**
   ```bash
   npx react-native start --port 8082
   ```

5. **Permission denied**
   - Make sure script is executable: `chmod +x run-android-test.sh`

### Debug Commands

```bash
# Check connected devices
adb devices

# Check Metro bundler
npx react-native start --reset-cache

# Clean build
npx react-native clean

# Verbose build
npx react-native run-android --verbose

# Check backend
curl http://localhost:3001/
```

## 📊 Project Structure

```
AndroidTestApp/
├── TestNotifications/          # React Native test app
│   ├── android/               # Android native code
│   ├── App.tsx               # Main test interface
│   └── package.json          
├── run-android-test.sh       # Automated setup script
└── README.md                 # This file
```

## 🎉 Success Criteria

When everything is working, you should see:

✅ **App opens** on Android emulator  
✅ **"✅ Connected"** status in app header  
✅ **Local notifications** work when tapping buttons  
✅ **Backend notifications** trigger from curl commands  
✅ **Call alerts** show dialog boxes  
✅ **Background notifications** work when app is minimized  
✅ **Notification history** updates in real-time  

## 🔗 Integration with Main Project

This test app connects to the same backend as your main WhatsApp Clone project:
- Backend server: `../backend/server-simple.js`
- Same API endpoints
- Same notification format
- Demonstrates full notification flow

Once this test works, you can implement the same notification handling in your main WhatsApp Clone app with Firebase for real push notifications.

---

**📧 Assignment**: React Native Push Notifications for Android 15  
**🎯 Status**: Test Implementation Complete  
**✅ Ready for**: Emulator testing and demonstration 