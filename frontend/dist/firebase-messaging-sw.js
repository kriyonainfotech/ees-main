// importScripts(
//   "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
// );
// importScripts(
//   "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
// );

// // Initialize Firebase app
// firebase.initializeApp({
//   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
//   authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
//   projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
//   storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
//   appId: import.meta.env.VITE_FIREBASE_APP_ID,
//   measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
// });

// // Retrieve Firebase Messaging instance
// const messaging = firebase.messaging();

// messaging.onBackgroundMessage((payload) => {
//   console.log("Received background message:", payload);

//   const notificationTitle = payload.notification.title;
//   const notificationOptions = {
//     body: payload.notification.body,
//     icon: "/logo.png",
//   };

//   // Show the notification
//   self.registration
//     .showNotification(notificationTitle, notificationOptions)
//     .catch((error) => {
//       console.error("Error showing notification:", error);
//     });
// });
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);

// Initialize Firebase inside Service Worker
firebase.initializeApp({
  apiKey: "AIzaSyDsi2i-V91bw_4yYSVNGbkdV9KjejGa6eY",
  authDomain: "ees121-47d74.firebaseapp.com",
  projectId: "ees121-47d74",
  storageBucket: "ees121-47d74.firebasestorage.app",
  messagingSenderId: "39793981073",
  appId: "1:39793981073:web:e07f252cdb0513758ef130",
  measurementId: "G-RML24DDFKR",
});

// Get Firebase Messaging instance
const messaging = firebase.messaging();

// Handle background notifications
messaging.onBackgroundMessage((payload) => {
  console.log("Received background message:", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/logo.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
