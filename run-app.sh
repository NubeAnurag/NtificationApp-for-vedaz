#!/bin/bash

echo "🚀 Starting WhatsApp Clone Demo..."

# Kill any existing processes
echo "🧹 Cleaning up existing processes..."
pkill -f "react-native start" 2>/dev/null || true
pkill -f "server-simple.js" 2>/dev/null || true

# Wait a moment
sleep 2

echo "📡 Starting backend server..."
cd backend && node server-simple.js &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

echo "📱 Starting React Native Metro..."
cd ../WhatsAppClone && npx react-native start --reset-cache &
METRO_PID=$!

# Wait for Metro to start
sleep 5

echo ""
echo "✅ Services started!"
echo "🌐 Backend: http://localhost:3001"
echo "📱 Metro: http://localhost:8081"
echo ""
echo "📋 Next steps:"
echo "1. Open Android Studio and start an emulator"
echo "2. In a new terminal, run: cd WhatsAppClone && npx react-native run-android"
echo "3. Test notifications: curl -X POST http://localhost:3001/demo/message"
echo ""
echo "🛑 To stop: kill $BACKEND_PID $METRO_PID"

# Keep script running
wait 