// Import Firebase scripts for service worker
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js');

// Initialize Firebase in service worker
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

// Function to play sound in service worker
function playSound(soundUrl) {
  // Send message to all clients (browser tabs) to play sound
  self.clients.matchAll({ type: 'window', includeUncontrolled: true })
    .then(clients => {
      clients.forEach(client => {
        client.postMessage({
          type: 'PLAY_SOUND',
          soundUrl: soundUrl
        });
      });
    });
}

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message', payload);

  // Play custom sound based on notification type
  const notificationType = payload.data?.notification_type || 'order';
  const soundUrl = self.location.origin + `/sounds/${notificationType}.mp3`;
  playSound(soundUrl);

  const notificationTitle = payload.notification.title;
  const iconUrl = 'https://plenti-company-logo.s3.us-east-2.amazonaws.com/playstore.png';
  
  const notificationOptions = {
    body: payload.notification.body,
    icon: iconUrl,
    badge: iconUrl,
    tag: 'plenti-notification',
    requireInteraction: true,
    actions: [
      {
        action: 'open',
        title: 'Open App'
      },
      {
        action: 'close',
        title: 'Close'
      }
    ]
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  event.notification.close();

  if (event.action === 'open') {
    event.waitUntil(clients.openWindow('/'));
  } else if (event.action === 'close') {
    return;
  } else {
    event.waitUntil(clients.openWindow('/'));
  }
});