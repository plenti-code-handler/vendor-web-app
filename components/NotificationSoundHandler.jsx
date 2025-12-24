"use client";
import { useEffect } from 'react';
import { initMessaging, onMessage } from '../lib/firebase';
import playNotificationSound from '../utils/notificationSound';
import { toast } from 'sonner';

export default function NotificationSoundHandler() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let unsubscribe = null;

    // Setup: Handle both foreground and background notifications
    const setup = async () => {
      try {
        const messaging = await initMessaging();
        if (!messaging) return;

        // 1. Foreground: Listen to Firebase onMessage
        unsubscribe = onMessage(messaging, (payload) => {
          console.log('🎯 FOREGROUND notification - playing sound');
          // Play sound with source indicator
          playNotificationSound('order', 0.7);
          
          // Show toast notification
          const title = payload.notification?.title || 'New Order';
          const body = payload.notification?.body || 'You have a new notification';
          
          toast.info(title, {description: body});
        });

        // 2. Background: Listen to service worker messages
        const handleSWMessage = (event) => {
          if (event.data?.type === 'PLAY_NOTIFICATION_SOUND') {
            console.log('🎯 BACKGROUND notification - playing sound');
            // Play sound with source indicator
            playNotificationSound('order', 0.7);
          }
        };

        navigator.serviceWorker?.addEventListener('message', handleSWMessage);

        // Cleanup function
        return () => {
          if (unsubscribe && typeof unsubscribe === 'function') {
            unsubscribe();
          }
          navigator.serviceWorker?.removeEventListener('message', handleSWMessage);
        };
      } catch (error) {
        console.error('Error setting up notification sound handler:', error);
      }
    };

    // Wait for service worker to be ready
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(setup);
    } else {
      setup();
    }
  }, []);

  return null;
}
