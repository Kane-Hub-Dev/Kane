# HTB Control Room Pro V2

This is a fresh full final project for the How This Began Daily Control Room.

## What changed in V2

- New premium colors: Midnight Navy + Emerald + Gold.
- Fresh `index.html`, not only CSS, so the visible content changes.
- Class Day Mode: 8:00–12:30 and 14:00–17:00.
- Afternoon Class Cancelled button with a recovered time plan.
- Holiday Mode for coding, video production, sport, revision, and quiet introvert discipline.
- Deep Work Mode.
- Big 3 daily execution tracker.
- Smart agenda with local reminders.
- Focus Sprint timer.
- How This Began 2 videos/week production pipeline.
- Social Media Discipline for YouTube, TikTok, X, and WhatsApp.
- Mission Protection Tracker: no alcohol, no chasing girls, no peer pressure, no random scrolling, phone away before sleep.
- PWA install support.
- Service worker with cache versioning so updates show faster.
- Firebase Cloud Messaging ready files.

## Files to upload to GitHub root

Upload these files to the root of your repository and replace old files with the same names:

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

You can keep old files like `README.md`, `firebase.json`, and `firestore.rules` if they are useful. But make sure the new `index.html` is the one in the root.

## Important: why your old content may still show

After uploading, open your live GitHub Pages URL and add `?v=2` at the end, for example:

```text
https://YOUR_USERNAME.github.io/YOUR_REPO/?v=2
```

If old content still appears:

1. Open live site.
2. Press `Ctrl + Shift + R`.
3. Open DevTools → Application → Service Workers → Unregister.
4. Application → Storage → Clear site data.
5. Refresh again.
6. Reinstall the PWA if you installed the old version.

## Notification reality

Local notifications can work while the app/browser is active and notification permission is granted.

Closed-app push notifications need Firebase Cloud Messaging configured in:

- `firebase-client-config.js`
- `firebase-messaging-sw.js`

You must paste the same Firebase Web Config in both files, and paste your Web Push VAPID key in `firebase-client-config.js`.

## Firebase setup summary

1. Create a Firebase project.
2. Add a Web App in Firebase Project Settings.
3. Copy the Firebase config into `firebase-client-config.js`.
4. Copy the same Firebase config into `firebase-messaging-sw.js`.
5. Go to Cloud Messaging → Web Push certificates.
6. Generate/copy VAPID key.
7. Paste VAPID key into `firebase-client-config.js`.
8. Upload files to GitHub.
9. Open GitHub Pages site over HTTPS.
10. Click `Enable FCM push` and copy the token.

To send automatic scheduled push notifications when the app is closed, you still need a backend/scheduler later, such as Firebase Cloud Functions or another server. This project is ready for that setup.

## GitHub upload instruction

Do not upload only `style.css`. Upload the whole V2 package. The visible content is mostly in `index.html`, and behavior is in `app.js`.

Commit message:

```text
HTB Control Room Pro V2 full upgrade
```
