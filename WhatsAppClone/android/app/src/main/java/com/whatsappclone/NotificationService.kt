package com.whatsappclone

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.media.RingtoneManager
import android.os.Build
import androidx.core.app.NotificationCompat
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage

class NotificationService : FirebaseMessagingService() {
    
    companion object {
        private const val CHANNEL_ID = "whatsapp_clone_channel"
        private const val CHANNEL_NAME = "WhatsApp Clone Notifications"
        private const val CHANNEL_DESCRIPTION = "Notifications for WhatsApp Clone app"
    }
    
    override fun onNewToken(token: String) {
        super.onNewToken(token)
        // Send token to your server
        sendRegistrationToServer(token)
    }
    
    override fun onMessageReceived(remoteMessage: RemoteMessage) {
        super.onMessageReceived(remoteMessage)
        
        // Handle data payload
        remoteMessage.data.isNotEmpty().let {
            val notificationType = remoteMessage.data["type"] ?: "message"
            val title = remoteMessage.data["title"] ?: "New Message"
            val body = remoteMessage.data["body"] ?: "You have a new message"
            val chatId = remoteMessage.data["chatId"] ?: ""
            val senderId = remoteMessage.data["senderId"] ?: ""
            
            when (notificationType) {
                "message" -> showMessageNotification(title, body, chatId, senderId)
                "voice_call" -> showCallNotification("Voice Call", "Incoming voice call", chatId, senderId, "voice")
                "video_call" -> showCallNotification("Video Call", "Incoming video call", chatId, senderId, "video")
                else -> showMessageNotification(title, body, chatId, senderId)
            }
        }
        
        // Handle notification payload
        remoteMessage.notification?.let { notification ->
            showMessageNotification(
                notification.title ?: "New Message",
                notification.body ?: "You have a new message",
                "",
                ""
            )
        }
    }
    
    private fun showMessageNotification(title: String, body: String, chatId: String, senderId: String) {
        createNotificationChannel()
        
        val intent = Intent(this, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
            putExtra("screen", "chat")
            putExtra("chatId", chatId)
            putExtra("senderId", senderId)
        }
        
        val pendingIntent = PendingIntent.getActivity(
            this, 0, intent,
            PendingIntent.FLAG_ONE_SHOT or PendingIntent.FLAG_IMMUTABLE
        )
        
        val defaultSoundUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION)
        val notificationBuilder = NotificationCompat.Builder(this, CHANNEL_ID)
            .setSmallIcon(R.drawable.ic_notification)
            .setContentTitle(title)
            .setContentText(body)
            .setAutoCancel(true)
            .setSound(defaultSoundUri)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setContentIntent(pendingIntent)
        
        val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        notificationManager.notify(0, notificationBuilder.build())
    }
    
    private fun showCallNotification(title: String, body: String, chatId: String, senderId: String, callType: String) {
        createNotificationChannel()
        
        val intent = Intent(this, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
            putExtra("screen", "call")
            putExtra("chatId", chatId)
            putExtra("senderId", senderId)
            putExtra("callType", callType)
        }
        
        val pendingIntent = PendingIntent.getActivity(
            this, 1, intent,
            PendingIntent.FLAG_ONE_SHOT or PendingIntent.FLAG_IMMUTABLE
        )
        
        val defaultSoundUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_RINGTONE)
        val notificationBuilder = NotificationCompat.Builder(this, CHANNEL_ID)
            .setSmallIcon(R.drawable.ic_call)
            .setContentTitle(title)
            .setContentText(body)
            .setAutoCancel(true)
            .setSound(defaultSoundUri)
            .setPriority(NotificationCompat.PRIORITY_MAX)
            .setOngoing(true)
            .setContentIntent(pendingIntent)
        
        val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        notificationManager.notify(1, notificationBuilder.build())
    }
    
    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                CHANNEL_NAME,
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = CHANNEL_DESCRIPTION
                enableLights(true)
                enableVibration(true)
            }
            
            val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            notificationManager.createNotificationChannel(channel)
        }
    }
    
    private fun sendRegistrationToServer(token: String) {
        // TODO: Send token to your backend server
        println("FCM Token: $token")
    }
} 