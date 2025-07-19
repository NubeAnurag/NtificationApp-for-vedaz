#!/bin/bash

# WhatsApp Clone - Personalized Messaging Test Script
# This script starts the backend server and provides testing instructions

echo "🚀 Starting WhatsApp Clone - Personalized Messaging Test"
echo "=========================================================="

# Kill any existing servers
echo "🧹 Cleaning up existing servers..."
pkill -f "node server-simple" 2>/dev/null || true
pkill -f "metro" 2>/dev/null || true

# Start backend server
echo "🌐 Starting backend server on port 3002..."
cd backend
node server-simple.js &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 3

# Start Metro bundler
echo "📱 Starting Metro bundler for React Native app..."
cd AndroidTestApp/TestNotifications
npx react-native start --port 8081 --reset-cache &
METRO_PID=$!
cd ../..

# Wait for Metro to start
sleep 5

echo ""
echo "✅ Setup Complete! Here's how to test:"
echo "======================================"
echo ""
echo "📱 1. REACT NATIVE APP:"
echo "   • Open Android emulator (Pixel 7)"
echo "   • Run: npx react-native run-android"
echo "   • App shows contacts: Manya, Manas, Aarav, Harsh, Anurag"
echo ""
echo "🌐 2. WEB MESSAGING INTERFACE:"
echo "   • Open on phone: http://192.168.29.3:3002/messaging"
echo "   • Send personalized messages to each friend"
echo "   • Make voice/video calls to specific people"
echo "   • Each action will create notifications on the emulator"
echo ""
echo "🧪 3. TEST ENDPOINTS:"
echo "   • Message to Manya: curl -X POST http://192.168.29.3:3002/send-personal-message -H 'Content-Type: application/json' -d '{\"recipient\":\"Manya\", \"message\":\"Hey Manya!\", \"sender\":\"Anurag\"}'"
echo "   • Call Harsh: curl -X POST http://192.168.29.3:3002/send-personal-call -H 'Content-Type: application/json' -d '{\"recipient\":\"Harsh\", \"callType\":\"video\", \"caller\":\"Anurag\"}'"
echo ""
echo "🎯 4. WHAT TO EXPECT:"
echo "   • Notifications appear on emulator with friend's name"
echo "   • Chat list updates with new messages"
echo "   • Specific friend conversations get updated"
echo "   • Auto-demo messages from friends every 30 seconds"
echo ""
echo "📋 5. RUNNING SERVERS:"
echo "   • Backend: http://localhost:3002 (PID: $BACKEND_PID)"
echo "   • Metro: http://localhost:8081 (PID: $METRO_PID)"
echo ""
echo "🛑 To stop servers: kill $BACKEND_PID $METRO_PID"
echo ""
echo "🔗 Quick Links:"
echo "   • Mobile messaging: http://192.168.29.3:3002/messaging"
echo "   • Original mobile test: http://192.168.29.3:3002/mobile"
echo "   • Server status: http://192.168.29.3:3002/"
echo ""
echo "Happy testing! 🎉" 