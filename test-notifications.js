const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testNotifications() {
  console.log('🧪 Testing WhatsApp Clone Push Notifications\n');

  try {
    // Test 1: Check server status
    console.log('1. Checking server status...');
    const statusResponse = await axios.get(`${BASE_URL}/`);
    console.log('✅ Server is running:', statusResponse.data.message);
    console.log('📋 Available endpoints:', Object.keys(statusResponse.data.endpoints).length);

    // Test 2: Check registered tokens
    console.log('\n2. Checking registered FCM tokens...');
    const tokensResponse = await axios.get(`${BASE_URL}/tokens`);
    console.log(`✅ Found ${tokensResponse.data.count} registered tokens`);

    if (tokensResponse.data.count === 0) {
      console.log('⚠️  No FCM tokens registered. Make sure the app is running and has requested notification permissions.');
      return;
    }

    // Test 3: Send demo message
    console.log('\n3. Sending demo message notification...');
    const messageResponse = await axios.post(`${BASE_URL}/demo/message`);
    console.log('✅ Demo message sent:', messageResponse.data.message);

    // Test 4: Send demo voice call
    console.log('\n4. Sending demo voice call notification...');
    const voiceCallResponse = await axios.post(`${BASE_URL}/demo/voice-call`);
    console.log('✅ Demo voice call sent:', voiceCallResponse.data.message);

    // Test 5: Send demo video call
    console.log('\n5. Sending demo video call notification...');
    const videoCallResponse = await axios.post(`${BASE_URL}/demo/video-call`);
    console.log('✅ Demo video call sent:', videoCallResponse.data.message);

    console.log('\n🎉 All tests completed successfully!');
    console.log('\n📱 Check your Android device/emulator for notifications.');
    console.log('💡 Make sure the app is in the background or killed to test background notifications.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Make sure the backend server is running:');
      console.log('   cd backend && npm start');
    }
    
    if (error.response) {
      console.log('Response status:', error.response.status);
      console.log('Response data:', error.response.data);
    }
  }
}

// Run the test
testNotifications(); 