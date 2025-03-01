// // Import the functions you need from the SDKs
// import { initializeApp } from "firebase/app";
// import { getMessaging, getToken, onMessage } from "firebase/messaging";
// import { toast } from "react-toastify";

// // Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyDsi2i-V91bw_4yYSVNGbkdV9KjejGa6eY",
//   authDomain: "ees121-47d74.firebaseapp.com",
//   projectId: "ees121-47d74",
//   storageBucket: "ees121-47d74.firebasestorage.app",
//   messagingSenderId: "39793981073",
//   appId: "1:39793981073:web:e07f252cdb0513758ef130",
//   measurementId: "G-RML24DDFKR",
// };

// // Initialize Firebase app
// const app = initializeApp(firebaseConfig);
// export const messaging = getMessaging(app);

// // Function to request FCM token
// export const getFcmToken = async () => {
//   try {
//     const permission = await Notification.requestPermission();
//     if (permission !== "granted") {
//       console.warn("Notification permission denied.");
//       return null;
//     }

//     const fcmToken = await getToken(messaging, {
//       vapidKey:
//         "BLR_TorL-P9BMsa4OTXDLEheymqVpfFSpe_GimseAIALU61FrqbevTY9PEdEl0k0yV3e2IG-VOfIg4UFhsH1CrE",
//     });

//     if (fcmToken) {
//       // console.log("FCM Token:", fcmToken);
//       return fcmToken;
//     } else {
//       console.warn("No FCM token received. Ensure notifications are enabled.");
//       return null;
//     }
//   } catch (error) {
//     console.error("Error fetching FCM token:", error);
//     return null;
//   }
// };

// // Function to listen for incoming messages
// export const onMessageListener = () =>
//   new Promise((resolve, reject) => {
//     try {
//       onMessage(messaging, (payload) => {
//         console.log("Message received:", payload);

//         // Display notification as a toast
//         if (payload?.notification?.title) {
//           // toast.info(`${payload.notification.title}`, {
//           //   position: "top-right",
//           //   autoClose: 5000,
//           //   hideProgressBar: false,
//           //   closeOnClick: true,
//           //   pauseOnHover: true,
//           //   draggable: true,
//           //   progress: undefined,
//           // });
//         }

//         resolve(payload);
//       });
//     } catch (error) {
//       console.error("Error in onMessageListener:", error);
//       reject(error);
//     }
//   });
// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { toast } from "react-toastify";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDsi2i-V91bw_4yYSVNGbkdV9KjejGa6eY",
  authDomain: "ees121-47d74.firebaseapp.com",
  projectId: "ees121-47d74",
  storageBucket: "ees121-47d74.firebasestorage.app",
  messagingSenderId: "39793981073",
  appId: "1:39793981073:web:e07f252cdb0513758ef130",
  measurementId: "G-RML24DDFKR",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

// Function to request FCM token
export const getFcmToken = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("Notification permission denied.");
      return null;
    }

    const fcmToken = await getToken(messaging, {
      vapidKey:
        "BLR_TorL-P9BMsa4OTXDLEheymqVpfFSpe_GimseAIALU61FrqbevTY9PEdEl0k0yV3e2IG-VOfIg4UFhsH1CrE",
      serviceWorkerRegistration: await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js"
      ),
    });

    if (fcmToken) {
      return fcmToken;
    } else {
      console.warn("No FCM token received. Ensure notifications are enabled.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching FCM token:", error);
    return null;
  }
};

// Function to listen for foreground messages
export const onMessageListener = () =>
  new Promise((resolve, reject) => {
    try {
      onMessage(messaging, (payload) => {
        console.log("Message received:", payload);

        if (payload?.notification?.title) {
          toast.info(`${payload.notification.title}`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }

        resolve(payload);
      });
    } catch (error) {
      console.error("Error in onMessageListener:", error);
      reject(error);
    }
  });
