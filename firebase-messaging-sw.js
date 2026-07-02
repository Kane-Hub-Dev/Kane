// Firebase background messaging service worker.
// Fill the same config below after creating your Firebase project.

importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "PASTE_YOUR_API_KEY",
  authDomain: "PASTE_YOUR_PROJECT.firebaseapp.com",
  projectId: "PASTE_YOUR_PROJECT_ID",
  storageBucket: "PASTE_YOUR_PROJECT.appspot.com",
  messagingSenderId: "PASTE_YOUR_SENDER_ID",
  appId: "PASTE_YOUR_APP_ID"
};

if (firebaseConfig.apiKey && !firebaseConfig.apiKey.startsWith('PASTE_')) {
  firebase.initializeApp(firebaseConfig);
  const messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {
    const title = payload?.notification?.title || 'HTB Control Room';
    const body = payload?.notification?.body || 'Open your control room and execute the next action.';
    self.registration.showNotification(title, {
      body,
      icon: './icon-192.png',
      badge: './badge-72.png',
      tag: payload?.data?.tag || 'htb-control-room',
      data: payload?.data?.url || './'
    });
  });
}

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow('./'));
});
