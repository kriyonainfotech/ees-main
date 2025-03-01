import axios from "axios";
import { useContext } from "react";
import { UserContext } from "./UserContext";

export const sendNotification = async (title, message) => {
    const {user} = useContext(UserContext)
    const userId = user?._id;
    
    try {
        const response = await axios.post("http://localhost:5000/notify/send-notification", {
            title,
            message,
            userId
        });
        console.log("Notification Sent:", response.data);
    } catch (error) {
        console.error("Error sending notification:", error);
    }
};
