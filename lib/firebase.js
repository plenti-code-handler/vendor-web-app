import { initializeApp } from 'firebase/app';
import { getMessaging, onMessage, isSupported } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBWJ9Je4FICt7McAynNzoHRl2YAokp_5Mk",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "plenti-food-app.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "plenti-food-app",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "plenti-food-app.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "298219936678",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:298219936678:web:10601e05835503e3408d67",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-R94SWH4WEK"
};

const app = initializeApp(firebaseConfig);
let messagingInstance = null;
let initPromise = null;

export const initMessaging = async () => {
  if (initPromise) return initPromise;
  initPromise = (async () => {
    if (typeof window === 'undefined') return null;
    const supported = await isSupported().catch(() => false);
    if (!supported) return null;

    await navigator.serviceWorker.ready;
    const registration = await navigator.serviceWorker.getRegistration();
    if (!registration) return null;

    if (!messagingInstance) {
      messagingInstance = getMessaging(app, { serviceWorkerRegistration: registration });
    }
    return messagingInstance;
  })();
  return initPromise;
};

export { onMessage };
export const getMessagingInstance = () => messagingInstance;