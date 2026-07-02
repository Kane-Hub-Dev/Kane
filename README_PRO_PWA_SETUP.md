# KANE V6 Firebase Push Scheduler Setup

V6 adds real Firebase push scheduling for KANE. V5 local reminders can work while the app is open/background. V6 uses Firebase Cloud Messaging plus Cloud Functions Scheduler so reminders can arrive even when KANE is not open.

## What V6 contains

- `index.html`, `style.css`, `app.js` — KANE app UI + V6 sync buttons.
- `firebase-client-config.js` — paste Firebase Web Config + VAPID key here.
- `firebase-messaging-sw.js` — background push receiver. Paste the same Firebase config here too.
- `functions/index.js` — scheduled backend that checks your routine every 5 minutes and sends push notifications.
- `functions/package.json` — backend dependencies.
- `firebase.json` and `firestore.rules` — Firebase deploy configuration.

## Step 1 — Firebase project

1. Go to Firebase Console.
2. Create/select a project.
3. Add a Web App.
4. Copy the Firebase Web Config.
5. Open `firebase-client-config.js` and replace all `PASTE_...` values.
6. Open `firebase-messaging-sw.js` and replace the same `PASTE_...` values.
7. In Firebase Console → Project Settings → Cloud Messaging → Web Push certificates → Generate key pair.
8. Copy that VAPID key into `firebase-client-config.js`.

## Step 2 — Firestore

1. Firebase Console → Firestore Database → Create database.
2. Start in production mode if asked.
3. Deploy the included rules with Firebase CLI later.

## Step 3 — Upload front-end to GitHub

Upload these files to your GitHub `Kane` repo and replace existing files:

- `index.html`
- `style.css`
- `app.js`
- `manifest.json`
- `service-worker.js`
- `firebase-client-config.js`
- `fcm-config.js`
- `firebase-messaging-sw.js`
- `icon-192.png`
- `icon-512.png`
- `badge-72.png`
- `favicon.png`

Commit message:

```bash
KANE V6 Firebase Push Scheduler
```

Open:

```text
https://kane-hub-dev.github.io/Kane/?v=6
```

## Step 4 — Deploy Firebase Functions

Cloud Functions scheduled jobs may require Firebase Blaze / pay-as-you-go billing. The scheduler runs every 5 minutes.

Install Firebase CLI:

```bash
npm install -g firebase-tools
firebase login
```

In the folder that contains `firebase.json` and `functions/`, run:

```bash
firebase use --add
firebase deploy --only firestore:rules
cd functions
npm install
cd ..
firebase deploy --only functions
```

After deploy, Firebase will create a scheduled function named:

```text
sendKaneScheduledReminders
```

## Step 5 — Enable push on your phone/computer

1. Open KANE from GitHub Pages.
2. Install the PWA.
3. Go to More → Firebase Push Scheduler setup.
4. Click `Enable Firebase push`.
5. Allow notifications.
6. A token should appear in the text box.
7. Click `Start Reminder Engine`.
8. Click `Sync schedule`.

## How to confirm it works

### A. Confirm token saved

Firebase Console → Firestore Database → `kaneDevices`.

You should see one document with fields like:

- `token`
- `enabled: true`
- `mode`
- `reminderLeads`
- `timezone`
- `siteUrl`

If you see this, the app has connected to Firebase correctly.

### B. Confirm background receiver exists

Open the app in Chrome and go to DevTools → Application → Service Workers. You should see:

- `service-worker.js`
- `firebase-messaging-sw.js`

### C. Confirm scheduled function is running

Firebase Console → Functions → `sendKaneScheduledReminders` → Logs.

Or in terminal:

```bash
firebase functions:log --only sendKaneScheduledReminders
```

You should see logs like:

```text
KANE scheduler complete { checked: 1, sent: 1, skipped: 0 }
```

### D. Fast practical test

Change your current mode to Deep Work, enable leads `5 min before` and `At start`, then wait near an action time from your schedule. Keep the app closed. Within the 5-minute scheduler window, Firebase should send the notification.

## Important limits

- V6 is much stronger than V5 because Firebase can wake the browser service worker with a push event.
- Phone battery optimization/browser restrictions can still affect delivery, but FCM is the correct web method for closed-app push.
- If token disappears or notification stops, click `Enable Firebase push` again and `Sync schedule`.
- Do not put private server keys in GitHub. The public Firebase Web Config is okay; private admin credentials are handled by Cloud Functions automatically.

