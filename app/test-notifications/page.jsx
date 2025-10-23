'use client';

import React, { useEffect } from 'react';
import FCMTokenTest from '../../components/FCMTokenTest';

const TestNotificationsPage = () => {
  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/firebase-messaging-sw.js')
        .then((registration) => {
          console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch((err) => {
          console.log('Service Worker registration failed:', err);
        });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <FCMTokenTest />
      </div>
    </div>
  );
};

export default TestNotificationsPage;
