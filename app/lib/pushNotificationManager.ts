import { PushNotifications } from '@capacitor/push-notifications';

/**
 * Push Notification Manager for Shift Scan App
 * Handles initialization, permission checking, and device token management
 */
export class PushNotificationManager {
  private static isInitialized = false;

  /**
   * Initialize push notifications with permission checking
   * Should be called during app startup
   */
  static async initialize(): Promise<void> {
    if (this.isInitialized) {
      console.log('Push notifications already initialized');
      return;
    }

    try {
      console.log('🔔 Initializing push notifications...');

      // Check and request permissions (Android 13+)
      await this.checkAndRequestPermissions();

      // Register with FCM
      await PushNotifications.register();

      // Set up listeners
      this.setupListeners();

      this.isInitialized = true;
      console.log('✅ Push notifications initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize push notifications:', error);
      throw error;
    }
  }

  /**
   * Check push notification permissions and request if needed
   * Required for Android 13 (API 33) and higher
   */
  static async checkAndRequestPermissions(): Promise<void> {
    try {
      // Check current permission status
      const permStatus = await PushNotifications.checkPermissions();
      console.log('📋 Current permission status:', permStatus);

      // If permission prompt is shown, request it
      if (permStatus.receive === 'prompt') {
        console.log('📲 Requesting push notification permission...');
        const result = await PushNotifications.requestPermissions();
        console.log('✅ Permission request result:', result);

        if (result.receive === 'denied') {
          console.warn(
            '⚠️ Push notifications denied by user. Notifications will not be received.'
          );
          return;
        }
      }

      if (permStatus.receive === 'granted') {
        console.log('✅ Push notifications permission granted');
      }
    } catch (error) {
      console.error('❌ Error checking/requesting permissions:', error);
      throw error;
    }
  }

  /**
   * Get the device token for push notifications
   * This token should be sent to your server for targeted notifications
   */
  static async getDeviceToken(): Promise<string | null> {
    try {
      // After registering, the tokenReceived event will provide the token
      // For now, we listen to the event or return from cache
      const token = await new Promise<string | null>((resolve) => {
        const timeout = setTimeout(() => {
          console.warn('⚠️ Timeout waiting for device token');
          resolve(null);
        }, 5000);

        PushNotifications.addListener('registration', (token) => {
          clearTimeout(timeout);
          console.log('📱 Device token:', token.value);
          resolve(token.value);
        });
      });

      return token;
    } catch (error) {
      console.error('❌ Error getting device token:', error);
      return null;
    }
  }

  /**
   * Set up push notification listeners
   * These handle incoming notifications and user interactions
   */
  private static setupListeners(): void {
    // Handle received notifications
    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('🔔 Notification received:', notification);
      this.handleNotificationReceived(notification);
    });

    // Handle notification action (user tapped on notification)
    PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
      console.log('👆 Notification action performed:', action);
      this.handleNotificationAction(action);
    });

    // Handle registration errors
    PushNotifications.addListener('registrationError', (error: any) => {
      console.error('❌ Push registration error:', error);
    });
  }

  /**
   * Handle incoming notification
   * Called when app receives a push notification
   */
  private static handleNotificationReceived(notification: any): void {
    const { title, body, data } = notification;
    console.log('📬 New notification:', { title, body, data });

    // You can customize behavior here:
    // - Show a toast
    // - Log to analytics
    // - Trigger state updates
    // - Navigate to relevant page
  }

  /**
   * Handle notification action
   * Called when user taps on a notification
   */
  private static handleNotificationAction(action: any): void {
    const { notification } = action;
    const { data } = notification;

    console.log('🎯 User tapped notification with data:', data);

    // Handle navigation based on notification data
    if (data?.url) {
      console.log('🔗 Navigating to:', data.url);
      // Use your router to navigate to the specified URL
      // Example: window.location.href = data.url;
    }

    if (data?.notificationId) {
      console.log('📌 Notification ID:', data.notificationId);
      // Mark notification as read in your backend
      this.markNotificationAsRead(data.notificationId);
    }
  }

  /**
   * Mark a notification as read in your backend
   */
  private static async markNotificationAsRead(notificationId: string): Promise<void> {
    try {
      // Call your backend API to mark notification as read
      // Example: await fetch(`/api/notifications/${notificationId}/read`, { method: 'PUT' });
      console.log('✅ Marking notification as read:', notificationId);
    } catch (error) {
      console.error('❌ Error marking notification as read:', error);
    }
  }

  /**
   * Subscribe device to a notification topic
   * Topics allow you to send notifications to groups of devices
   */
  static async subscribeToTopic(topic: string): Promise<void> {
    try {
      // Use the Firebase Admin SDK on the backend for topic subscriptions
      // Send token to backend which subscribes it using Firebase Admin SDK
      await fetch('/api/notifications/subscribe-to-topic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
      });
      console.log(`✅ Subscribed to topic: ${topic}`);
    } catch (error) {
      console.error(`❌ Error subscribing to topic ${topic}:`, error);
      throw error;
    }
  }

  /**
   * Unsubscribe device from a notification topic
   */
  static async unsubscribeFromTopic(topic: string): Promise<void> {
    try {
      // Use the Firebase Admin SDK on the backend for topic unsubscriptions
      await fetch('/api/notifications/unsubscribe-from-topic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
      });
      console.log(`✅ Unsubscribed from topic: ${topic}`);
    } catch (error) {
      console.error(`❌ Error unsubscribing from topic ${topic}:`, error);
      throw error;
    }
  }

  /**
   * Remove all push notification listeners
   * Call when cleaning up or before re-initializing
   */
  static removeAllListeners(): void {
    PushNotifications.removeAllListeners();
    this.isInitialized = false;
    console.log('✅ All push notification listeners removed');
  }
}

/**
 * Common topics for Shift Scan App
 */
export const PushTopics = {
  ALL_USERS: 'all-users',
  ADMINS: 'admins',
  MECHANICS: 'mechanics',
  SUPERVISORS: 'supervisors',
  SHIFT_UPDATES: 'shift-updates',
  EMERGENCY: 'emergency-alerts',
  SYSTEM_MAINTENANCE: 'system-maintenance',
} as const;

/**
 * Helper to initialize notifications on app startup
 * Call this in your App component's useEffect or initialization logic
 */
export async function initializePushNotificationsOnStartup(): Promise<void> {
  // Only initialize on mobile platforms (web doesn't use push notifications)
  const isMobile = typeof window !== 'undefined' && 
    (window.navigator.userAgent.includes('Mobile') || 
     window.navigator.userAgent.includes('Android') ||
     window.navigator.userAgent.includes('iPhone'));

  if (!isMobile && typeof window !== 'undefined' && !window.location.hostname.includes('localhost')) {
    console.log('ℹ️ Skipping push notifications on non-mobile platform');
    return;
  }

  try {
    await PushNotificationManager.initialize();

    // Get and log device token for verification
    const token = await PushNotificationManager.getDeviceToken();
    if (token) {
      console.log('🔑 Device token obtained successfully');
      // Send token to your backend to store in database
      // await sendTokenToBackend(token);
    }
  } catch (error) {
    console.error('Failed to initialize push notifications on startup:', error);
    // Don't crash the app if push notifications fail - this is not critical
  }
}
