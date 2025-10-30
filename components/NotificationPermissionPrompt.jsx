"use client";
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { initMessaging, getMessagingInstance } from '../lib/firebase';
import { getToken } from 'firebase/messaging';
import axiosClient from '../AxiosClient';

const waitUntilControlled = async () => {
  if (navigator.serviceWorker.controller) return;
  await new Promise((resolve) => {
    navigator.serviceWorker.addEventListener('controllerchange', () => resolve(), { once: true });
  });
};

const NotificationPermissionPrompt = () => {
  const [ready, setReady] = useState(false);
  const [permission, setPermission] = useState('default');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      await navigator.serviceWorker.ready;
      await waitUntilControlled();
      await initMessaging();
      setReady(true);
      setPermission(Notification.permission);
      if (Notification.permission === 'default') {
        const t = setTimeout(() => setShow(true), 1200);
        return () => clearTimeout(t);
      } else if (Notification.permission === 'granted') {
        fetchTokenSilently();
      }
    })();
  }, []);

  const fetchTokenSilently = async () => {
    try {
      const existing = localStorage.getItem('fcm_token');
      if (existing) return;
      const registration = await navigator.serviceWorker.getRegistration();
      const messaging = getMessagingInstance();
      if (!registration || !messaging) return;
      const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
      if (!vapidKey) return;

      const token = await getToken(messaging, { vapidKey, serviceWorkerRegistration: registration });
      if (token) {
        localStorage.setItem('fcm_token', token);
        await sendToken(token);
      }
    } catch (e) {
      console.error('Silent token error:', e);
    }
  };

  const sendToken = async (token) => {
    const last = localStorage.getItem('last_sent_fcm_token');
    if (last === token) return;
    await axiosClient.post('/v1/vendor/me/fcm-token/add', null, { params: { fcm_token: token } });
    localStorage.setItem('last_sent_fcm_token', token);
  };

  const onEnable = async () => {
    setLoading(true);
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result !== 'granted') {
        toast.info('You can enable notifications later from browser settings.');
        setShow(false);
        return;
      }
      const registration = await navigator.serviceWorker.getRegistration();
      const messaging = getMessagingInstance();
      if (!registration || !messaging) return;

      const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
      const token = await getToken(messaging, { vapidKey, serviceWorkerRegistration: registration });
      if (token) {
        localStorage.setItem('fcm_token', token);
        await sendToken(token);
        toast.success('Notifications enabled');
      }
      setShow(false);
    } catch (e) {
      console.error('Enable error:', e);
      toast.error('Could not enable notifications');
    } finally {
      setLoading(false);
    }
  };

  if (!ready || !show || permission !== 'default') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden">
        <div className="p-6 sm:p-7">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#5f22d91a]">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#5f22d9" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
          </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Enable order notifications</h3>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            Get instant alerts for new orders and updates in real time.
          </p>

          <div className="mt-6">
            <button
              onClick={onEnable}
              disabled={loading}
              className="inline-flex w-full items-center justify-center rounded-lg px-4 py-3 text-sm font-semibold text-white transition-colors disabled:opacity-60"
              style={{ backgroundColor: '#5f22d9' }}
            >
              {loading ? 'Enabling…' : 'Enable notifications'}
            </button>
          </div>

          <p className="mt-3 text-center text-xs text-gray-500">
            You can change this anytime in your browser settings.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotificationPermissionPrompt;
