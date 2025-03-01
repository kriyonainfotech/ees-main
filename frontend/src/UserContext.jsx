import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const backend_API = import.meta.env.VITE_API_URL;

// Create UserContext
export const UserContext = createContext();

// UserProvider component
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null); // User data state
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state for better debugging
    

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true); // Ensure loading is set to true before fetching
                const response = await axios.get(`${backend_API}/auth/getuser`, {
                    withCredentials: true, // Include cookies in the request
                });

                if (response.status === 200) {
                    setUser(response.data.user); // Set user data
                    console.log("Fetched user data:", response.data.user);
                }
            } catch (err) {
                console.error("Error fetching user:", err);
                setError(err);

                if (err.response?.status === 403) {
                    console.error("Invalid or expired token. Redirecting to login...");
                    window.location.href = "/login"; // Redirect to login page
                }
            } finally {
                setLoading(false); // Set loading to false after fetch is complete
            }
        };

        fetchUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, loading, error }}>
            {!loading ? children : <></>} {/* Loading fallback */}
        </UserContext.Provider>
    );
};
