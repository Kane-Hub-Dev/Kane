// Firebase Web Config for KANE V6
// Replace these values with your Firebase project settings.
// Do NOT put private server keys here.

export const firebaseConfig = {
  apiKey: "PASTE_YOUR_API_KEY",
  authDomain: "PASTE_YOUR_PROJECT.firebaseapp.com",
  projectId: "PASTE_YOUR_PROJECT_ID",
  storageBucket: "PASTE_YOUR_PROJECT.appspot.com",
  messagingSenderId: "PASTE_YOUR_SENDER_ID",
  appId: "PASTE_YOUR_APP_ID"
};

// Firebase Console → Project Settings → Cloud Messaging → Web Push certificates → Generate key pair.
export const vapidKey = "PASTE_YOUR_VAPID_KEY";

// Your GitHub Pages URL. Change this only if your repo/domain changes.
export const defaultSiteUrl = "https://kane-hub-dev.github.io/Kane/";
