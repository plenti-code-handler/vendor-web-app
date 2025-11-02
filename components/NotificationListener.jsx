"use client";
import { useEffect, useState } from 'react';
import playNotificationSound from '../utils/notificationSound';
import { isIOS, isPushNotificationSupported, isPWA } from '../utility/deviceDetection';

export default function NotificationListener() {
  const [deviceInfo, setDeviceInfo] = useState({
    isIOS: false,
    isPWA: false,
    pushSupported: false
  });

  useEffect(() => {
    // Detect device on mount
    setDeviceInfo({
      isIOS: isIOS(),
      isPWA: isPWA(),
      pushSupported: isPushNotificationSupported()
    });
  }, []);

  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return;

    // ⚠️ Skip service worker message listener on iOS (not reliable)
    if (deviceInfo.isIOS) {
      console.log('🍎 iOS detected - service worker notifications limited');
      
      if (!deviceInfo.isPWA) {
        console.warn('💡 TIP: Install app for better notification support on iOS');
      }
      
      return; // Don't set up listener
    }

    // ✅ Android/Desktop: Set up service worker listener
    const handleServiceWorkerMessage = (event) => {
      console.log('📨 Service worker message received:', event.data);
      
      // Only play sound for actual notifications
      // if (event.data?.type === 'NOTIFICATION_RECEIVED') {
      console.log('🔊 Playing sound for notification');
      playNotificationSound('order', 0.7);
    };

    navigator.serviceWorker?.addEventListener('message', handleServiceWorkerMessage);

    return () => {
      navigator.serviceWorker?.removeEventListener('message', handleServiceWorkerMessage);
    };
  }, [deviceInfo]);

  return null;
}