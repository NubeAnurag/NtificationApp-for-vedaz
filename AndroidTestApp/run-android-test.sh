#!/bin/bash

echo "🤖 Android Notification Test Setup"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📋 Checking prerequisites...${NC}"

# Check if Android SDK is installed
if ! command -v adb &> /dev/null; then
    echo -e "${RED}❌ Android SDK not found. Please install Android Studio and set up SDK.${NC}"
    echo "Install from: https://developer.android.com/studio"
    exit 1
else
    echo -e "${GREEN}✅ Android SDK found${NC}"
fi

# Check if emulator is available
if ! command -v emulator &> /dev/null; then
    echo -e "${YELLOW}⚠️  Emulator command not found. Make sure Android SDK tools are in PATH.${NC}"
fi

# Check if backend is running
echo -e "${BLUE}🌐 Checking backend connection...${NC}"
if curl -s http://localhost:3001/ > /dev/null; then
    echo -e "${GREEN}✅ Backend server is running${NC}"
else
    echo -e "${RED}❌ Backend server not running. Starting it now...${NC}"
    cd ../../backend && node server-simple.js &
    BACKEND_PID=$!
    echo "Backend started with PID: $BACKEND_PID"
    sleep 3
    cd ../AndroidTestApp
fi

# List available AVDs
echo -e "${BLUE}📱 Available Android Virtual Devices:${NC}"
if command -v emulator &> /dev/null; then
    emulator -list-avds
    
    AVD_COUNT=$(emulator -list-avds | wc -l)
    if [ $AVD_COUNT -eq 0 ]; then
        echo -e "${RED}❌ No Android Virtual Devices found.${NC}"
        echo -e "${YELLOW}📖 To create an AVD:${NC}"
        echo "1. Open Android Studio"
        echo "2. Go to Tools > AVD Manager"
        echo "3. Click 'Create Virtual Device'"
        echo "4. Choose a device (e.g., Pixel 7)"
        echo "5. Select API 35 (Android 15) or API 34"
        echo "6. Finish and start the emulator"
        echo ""
        echo "Then run this script again."
        exit 1
    fi
else
    echo -e "${YELLOW}⚠️  Emulator command not available. Please ensure Android SDK tools are in PATH.${NC}"
fi

# Check if emulator is already running
echo -e "${BLUE}🔍 Checking for running emulator...${NC}"
RUNNING_DEVICES=$(adb devices | grep -v "List of devices" | grep "device" | wc -l)

if [ $RUNNING_DEVICES -eq 0 ]; then
    echo -e "${YELLOW}⚠️  No emulator running. Please start an emulator manually:${NC}"
    echo "Option 1: Android Studio > Tools > AVD Manager > Start emulator"
    echo "Option 2: Command line: emulator -avd [AVD_NAME]"
    echo ""
    echo "Press Enter after starting the emulator..."
    read -r
else
    echo -e "${GREEN}✅ Emulator is running${NC}"
fi

# Install dependencies if not already done
echo -e "${BLUE}📦 Installing dependencies...${NC}"
cd TestNotifications
npm install

# Start Metro bundler
echo -e "${BLUE}📱 Starting Metro bundler...${NC}"
npx react-native start --reset-cache &
METRO_PID=$!
echo "Metro started with PID: $METRO_PID"

# Wait for Metro to start
sleep 5

# Build and run the app
echo -e "${BLUE}🚀 Building and running the test app...${NC}"
npx react-native run-android

echo ""
echo -e "${GREEN}🎉 Android test app should now be running!${NC}"
echo ""
echo -e "${YELLOW}📋 How to test:${NC}"
echo "1. ✅ App should be running on emulator"
echo "2. 📱 Test local notifications by tapping the buttons"
echo "3. 🌐 Test backend notifications (requires backend connection)"
echo "4. 📳 Put app in background and test notifications"
echo "5. 📞 Voice/Video call notifications will show alert dialogs"
echo ""
echo -e "${BLUE}🧪 Test commands (run in another terminal):${NC}"
echo "curl -X POST http://localhost:3001/demo/message"
echo "curl -X POST http://localhost:3001/demo/voice-call"
echo "curl -X POST http://localhost:3001/demo/video-call"
echo ""
echo -e "${RED}🛑 To stop services:${NC}"
echo "kill $METRO_PID"
if [ ! -z "$BACKEND_PID" ]; then
    echo "kill $BACKEND_PID"
fi

# Keep script running to maintain services
echo -e "${BLUE}🔄 Services running. Press Ctrl+C to stop all services.${NC}"

cleanup() {
    echo -e "\n${YELLOW}🧹 Cleaning up...${NC}"
    kill $METRO_PID 2>/dev/null
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
    fi
    echo -e "${GREEN}✅ Cleanup complete${NC}"
}

trap cleanup EXIT

# Wait for user to stop
while true; do
    sleep 1
done 