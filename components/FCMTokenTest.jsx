import React, { useState, useEffect } from 'react';
import { messaging, getToken, onMessage } from '../lib/firebase';
import { toast } from 'sonner';

const FCMTokenTest = () => {
  const [fcmToken, setFcmToken] = useState(null);
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState('default');
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Mark as client-side
    setIsClient(true);
    
    // Check if notifications are supported
    if ('Notification' in window && 'serviceWorker' in navigator) {
      setIsSupported(true);
      setPermission(Notification.permission);
    }

    // Handle foreground messages only if messaging is available
    if (!messaging) return;
    
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('Message received in foreground:', payload);
      toast.success(payload.notification?.title || 'Notification', {
        description: payload.notification?.body || 'You have a new notification',
        duration: 5000,
      });
    });

    return () => unsubscribe();
  }, []);

  const requestPermission = async () => {
    if (!isSupported) {
      toast.error('Notifications not supported in this browser');
      return;
    }

    setIsLoading(true);
    try {
      const permission = await Notification.requestPermission();
      console.log("permission", permission);
      setPermission(permission);
      
      if (permission === 'granted') {
        await getFCMToken();
        toast.success('Notification permission granted!');
      } else {
        toast.error('Notification permission denied');
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
      toast.error('Error requesting permission');
    } finally {
      setIsLoading(false);
    }
  };

  const getFCMToken = async () => {
    try {
      const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
      
      if (!vapidKey) {
        toast.error('VAPID key not configured. Please add NEXT_PUBLIC_FIREBASE_VAPID_KEY to your environment variables.');
        return;
      }

      const token = await getToken(messaging, { vapidKey });
      
      if (token) {
        setFcmToken(token);
        console.log('FCM Token:', token);
        toast.success('FCM Token generated successfully!');
        
        // Send token to backend for testing
        await sendTokenToBackend(token);
      } else {
        toast.error('No FCM token available');
      }
    } catch (error) {
      console.error('Error getting FCM token:', error);
      toast.error('Error getting FCM token: ' + error.message);
    }
  };

  const sendTokenToBackend = async (token) => {
    try {
      // Use your backend API instead of local Next.js API
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
      const response = await fetch(`${backendUrl}/v1/vendor/notification/register-fcm-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add authentication header if needed
          // 'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ 
          fcm_token: token,
          platform: 'web'
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('FCM token registered successfully:', result);
        toast.success('Token registered with backend');
      } else {
        const error = await response.json();
        console.error('Failed to register token:', error);
        toast.error('Failed to register token with backend: ' + (error.detail || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error registering FCM token:', error);
      toast.error('Error registering token with backend: ' + error.message);
    }
  };

  const copyToken = () => {
    if (fcmToken) {
      navigator.clipboard.writeText(fcmToken);
      toast.success('FCM Token copied to clipboard!');
    }
  };

  const testNotification = async () => {
    if (!fcmToken) {
      toast.error('No FCM token available');
      return;
    }

    try {
      // Use your backend API instead of local Next.js API
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
      const response = await fetch(`${backendUrl}/v1/vendor/notification/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add authentication header if needed
          // 'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          title: 'Test Notification',
          body: 'This is a test notification from Plenti Vendor App!',
          notification_type: 'default',
          data: {
            test: true,
            timestamp: Date.now()
          }
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Test notification sent:', result);
        toast.success('Test notification sent!');
      } else {
        const error = await response.json();
        console.error('Failed to send test notification:', error);
        toast.error('Failed to send test notification: ' + (error.detail || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error sending test notification:', error);
      toast.error('Error sending test notification: ' + error.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">FCM Token Test</h2>
      
      <div className="space-y-4">
        {/* Support Status */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">Browser Support:</h3>
          <div className="space-y-1 text-sm">
            <p><strong>Notifications:</strong> {isClient ? (isSupported ? '✅ Supported' : '❌ Not Supported') : '⏳ Loading...'}</p>
            <p><strong>Service Worker:</strong> {isClient ? ('serviceWorker' in navigator ? '✅ Supported' : '❌ Not Supported') : '⏳ Loading...'}</p>
            <p><strong>Permission:</strong> 
              <span className={`ml-2 px-2 py-1 rounded text-xs ${
                permission === 'granted' ? 'bg-green-100 text-green-800' :
                permission === 'denied' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {isClient ? permission : '⏳ Loading...'}
              </span>
            </p>
          </div>
        </div>

        {/* VAPID Key Status */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold mb-2">VAPID Key Configuration:</h3>
          <p className="text-sm">
            {process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY ? 
              '✅ VAPID Key configured' : 
              '❌ VAPID Key not configured - Add NEXT_PUBLIC_FIREBASE_VAPID_KEY to your environment variables'
            }
          </p>
        </div>

        {/* FCM Token */}
        {fcmToken && (
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold mb-2">FCM Token:</h3>
            <div className="bg-gray-100 p-2 rounded text-xs font-mono break-all">
              {fcmToken}
            </div>
            <button
              onClick={copyToken}
              className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              Copy Token
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2">
          {permission !== 'granted' && (
            <button
              onClick={requestPermission}
              disabled={isLoading || !isSupported}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              {isLoading ? 'Requesting...' : 'Request Notification Permission'}
            </button>
          )}

          {permission === 'granted' && !fcmToken && (
            <button
              onClick={getFCMToken}
              className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Generate FCM Token
            </button>
          )}

          {fcmToken && (
            <button
              onClick={testNotification}
              className="w-full px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              Send Test Notification
            </button>
          )}
        </div>

        {/* Instructions */}
        <div className="p-4 bg-yellow-50 rounded-lg">
          <h3 className="font-semibold mb-2">Instructions:</h3>
          <ol className="text-sm space-y-1 list-decimal list-inside">
            <li>Make sure you have VAPID key configured in environment variables</li>
            <li>Click "Request Notification Permission" to enable notifications</li>
            <li>Click "Generate FCM Token" to get your unique token</li>
            <li>Click "Send Test Notification" to test the notification flow</li>
            <li>Check browser console for detailed logs</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default FCMTokenTest;
