"use client";
import { useEffect } from "react";
import { initMessaging } from "../lib/firebase";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;
    // Register and then init messaging
    navigator.serviceWorker
      .register('/firebase-messaging-sw.js')
      .then(async (registration) => {
        await navigator.serviceWorker.ready;
        // Wait until page is controlled by the SW
        if (!navigator.serviceWorker.controller) {
          await new Promise((resolve) => {
            navigator.serviceWorker.addEventListener('controllerchange', () => resolve(), { once: true });
          });
        }
        await initMessaging();
      })
      .catch((err) => console.error('SW registration failed:', err));
  }, []);
  return null;
}