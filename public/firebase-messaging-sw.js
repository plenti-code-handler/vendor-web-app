// Import Firebase compat in SW context (stable for messaging)
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyBWJ9Je4FICt7McAynNzoHRl2YAokp_5Mk",
  authDomain: "plenti-food-app.firebaseapp.com",
  projectId: "plenti-food-app",
  storageBucket: "plenti-food-app.firebasestorage.app",
  messagingSenderId: "298219936678",
  appId: "1:298219936678:web:10601e05835503e3408d67",
  measurementId: "G-R94SWH4WEK"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Background messages
messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || 'Plenti Notification';
  const body = payload.notification?.body || 'You have a new notification';
  const icon = 'https://plenti-company-logo.s3.us-east-2.amazonaws.com/playstore.png';
  return self.registration.showNotification(title, {
    body,
    icon,
    badge: icon,
    tag: 'plenti-notification',
    requireInteraction: true,
    silent: false,
    data: payload.data || {}
  });
});

// Clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const client of list) {
        if (client.url.includes(self.location.origin) && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow('/business');
    })
  );
});

// Ensure control quickly
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));
