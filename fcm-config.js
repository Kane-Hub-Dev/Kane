// Optional Firebase Cloud Messaging setup.
// The app works without this file configured, but closed-app push notifications need Firebase setup.

import { firebaseConfig, vapidKey } from './firebase-client-config.js';

function configIsReady() {
  return firebaseConfig && firebaseConfig.apiKey && !firebaseConfig.apiKey.startsWith('PASTE_') && vapidKey && !vapidKey.startsWith('PASTE_');
}

window.enableHTBPush = async function enableHTBPush() {
  if (!('serviceWorker' in navigator)) {
    alert('Service Worker is not supported in this browser.');
    return '';
  }
  if (!('Notification' in window)) {
    alert('Notifications are not supported in this browser.');
    return '';
  }
  if (!configIsReady()) {
    alert('Firebase config is not filled yet. Open firebase-client-config.js and paste your config + VAPID key.');
    return '';
  }

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    alert('Notification permission was not granted.');
    return '';
  }

  const [{ initializeApp }, { getMessaging, getToken, onMessage }] = await Promise.all([
    import('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js'),
    import('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging.js')
  ]);

  const app = initializeApp(firebaseConfig);
  const messaging = getMessaging(app);
  const registration = await navigator.serviceWorker.register('./firebase-messaging-sw.js');
  const token = await getToken(messaging, { vapidKey, serviceWorkerRegistration: registration });

  onMessage(messaging, (payload) => {
    const title = payload?.notification?.title || 'KANE';
    const body = payload?.notification?.body || 'Open the app and execute your next action.';
    registration.showNotification(title, { body, icon: './icon-192.png', badge: './badge-72.png' });
  });

  return token;
};
