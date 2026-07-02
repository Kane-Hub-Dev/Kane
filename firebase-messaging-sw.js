// KANE V6 Firebase Messaging Service Worker
// Receives closed-app/background push notifications from Firebase Cloud Messaging.

importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

// This config is duplicated here because service workers cannot import ES modules from firebase-client-config.js in all browsers.
// Replace with the same Firebase Web Config used in firebase-client-config.js.
firebase.initializeApp({
  apiKey: 'PASTE_YOUR_API_KEY',
  authDomain: 'PASTE_YOUR_PROJECT.firebaseapp.com',
  projectId: 'PASTE_YOUR_PROJECT_ID',
  storageBucket: 'PASTE_YOUR_PROJECT.appspot.com',
  messagingSenderId: 'PASTE_YOUR_SENDER_ID',
  appId: 'PASTE_YOUR_APP_ID'
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notification = payload.notification || {};
  const data = payload.data || {};
  const title = notification.title || data.title || 'KANE reminder';
  const body = notification.body || data.body || 'Open KANE and execute the next action.';

  self.registration.showNotification(title, {
    body,
    icon: './icon-192.png',
    badge: './badge-72.png',
    tag: data.tag || 'kane-v6-reminder',
    data: { url: data.url || './' }
  });
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification?.data?.url || './';
  event.waitUntil(clients.openWindow(url));
});
