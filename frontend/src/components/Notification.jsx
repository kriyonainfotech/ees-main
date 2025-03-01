import React, { useState, useEffect, useCallback } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getFcmToken, onMessageListener } from "../Firebaseconfig";

const Notification = () => {
  const [notification, setNotification] = useState({ title: "", body: "" });

  const [loading, setLoading] = useState(false);
  // Display a toast notification
  const notify = useCallback(() => {
    if (notification.title || notification.body) {
      toast(
        <div>
          <p>
            <b>{notification.title || "Notification"}</b>
          </p>
          <p>{notification.body || "No content available."}</p>
        </div>
      );
    }
  }, [notification]);

  useEffect(() => {
    // Request FCM token on component mount
    getFcmToken().catch((err) =>
      console.error("Failed to get FCM token:", err)
    );

    // Listen for messages
    const unsubscribe = onMessageListener()
      .then((payload) => {
        const { title = "Notification", body = "No content available." } =
          payload?.notification || {};
        setNotification({ title, body });
      })
      .catch((err) => console.error("Failed to receive message:", err));

    // Cleanup if onMessageListener returns an unsubscribe function
    return typeof unsubscribe === "function" ? unsubscribe : undefined;
  }, []);

  useEffect(() => {
    // Show notification whenever the state updates
    notify();
  }, [notify]);

  return <ToastContainer />;
};

export default Notification;
