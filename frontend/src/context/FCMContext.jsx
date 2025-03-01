import React, { createContext, useState, useEffect } from "react";
import { getFcmToken } from "../Firebaseconfig";

export const FCMContext = createContext();

export const FCMProvider = ({ children }) => {
  const [fcmToken, setFcmToken] = useState(null);

  useEffect(() => {
    const fetchToken = async () => {
      const token = await getFcmToken();
      setFcmToken(token);
    };

    fetchToken();
  }, []);

  return (
    <FCMContext.Provider value={{ fcmToken }}>
      {children}
    </FCMContext.Provider>
  );
};
