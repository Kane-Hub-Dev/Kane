// KANE V6 Firebase Cloud Messaging + Firestore device sync.
// Closed-app reminders need this file configured AND functions/ deployed.

import { firebaseConfig, vapidKey, defaultSiteUrl } from './firebase-client-config.js';

let cachedToken = localStorage.getItem('kaneFcmToken') || '';
let cachedDeviceId = localStorage.getItem('kaneDeviceId') || '';
let firebaseReady = false;
let dbRef = null;
let setDocRef = null;
let docRef = null;
let serverTimestampRef = null;

function configIsReady() {
  return firebaseConfig && firebaseConfig.apiKey && !firebaseConfig.apiKey.startsWith('PASTE_') && vapidKey && !vapidKey.startsWith('PASTE_');
}

async function sha256Hex(input) {
  const data = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function loadFirebaseModules() {
  if (firebaseReady) return;
  const [{ initializeApp }, messagingModule, firestoreModule] = await Promise.all([
    import('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js'),
    import('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging.js'),
    import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js')
  ]);
  const app = initializeApp(firebaseConfig);
  window.__kaneMessagingModule = messagingModule;
  window.__kaneMessaging = messagingModule.getMessaging(app);
  dbRef = firestoreModule.getFirestore(app);
  setDocRef = firestoreModule.setDoc;
  docRef = firestoreModule.doc;
  serverTimestampRef = firestoreModule.serverTimestamp;
  firebaseReady = true;
}

async function saveDeviceToFirestore(payload = {}) {
  if (!cachedToken) return '';
  await loadFirebaseModules();
  const deviceId = cachedDeviceId || await sha256Hex(cachedToken);
  cachedDeviceId = deviceId;
  localStorage.setItem('kaneDeviceId', deviceId);

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Africa/Kigali';
  const siteUrl = defaultSiteUrl || `${location.origin}${location.pathname}`;
  const docData = {
    token: cachedToken,
    enabled: payload.reminderEngine !== false,
    mode: payload.mode || 'class',
    reminderLeads: Array.isArray(payload.reminderLeads) && payload.reminderLeads.length ? payload.reminderLeads.map(Number) : [15, 5, 0],
    timezone,
    siteUrl,
    userLabel: 'Iragena',
    app: 'KANE',
    lastSyncReason: payload.reason || 'enable-push',
    updatedAt: serverTimestampRef(),
    createdAt: serverTimestampRef()
  };
  await setDocRef(docRef(dbRef, 'kaneDevices', deviceId), docData, { merge: true });
  return deviceId;
}

window.enableHTBPush = async function enableHTBPush(schedulePayload = {}) {
  if (!('serviceWorker' in navigator)) {
    alert('Service Worker is not supported in this browser.');
    return '';
  }
  if (!('Notification' in window)) {
    alert('Notifications are not supported in this browser.');
    return '';
  }
  if (!configIsReady()) {
    alert('Firebase config is not filled yet. Open firebase-client-config.js and paste your Firebase config + VAPID key. Also paste config inside firebase-messaging-sw.js.');
    return '';
  }

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    alert('Notification permission was not granted.');
    return '';
  }

  await loadFirebaseModules();
  const registration = await navigator.serviceWorker.register('./firebase-messaging-sw.js');
  const { getToken, onMessage } = window.__kaneMessagingModule;
  const token = await getToken(window.__kaneMessaging, { vapidKey, serviceWorkerRegistration: registration });
  cachedToken = token;
  localStorage.setItem('kaneFcmToken', token);
  await saveDeviceToFirestore({ ...schedulePayload, reason: 'enable-push' });

  onMessage(window.__kaneMessaging, (payload) => {
    const title = payload?.notification?.title || payload?.data?.title || 'KANE';
    const body = payload?.notification?.body || payload?.data?.body || 'Open the app and execute your next action.';
    registration.showNotification(title, { body, icon: './icon-192.png', badge: './badge-72.png', tag: 'kane-v6-foreground' });
  });

  return token;
};

window.syncKanePushSchedule = async function syncKanePushSchedule(schedulePayload = {}) {
  if (!configIsReady() || !cachedToken) return '';
  await saveDeviceToFirestore(schedulePayload);
  return cachedToken;
};
