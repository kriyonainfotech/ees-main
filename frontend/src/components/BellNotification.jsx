import React, { useState, useCallback, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import bellSound from '../../public/bell.mp3';
import { Link, useNavigate } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import { BsFillBellFill } from "react-icons/bs";
import bellGold from "../../public/bellGold.png"; // Updated import
import { UserContext } from '../UserContext';

const backend_API = import.meta.env.VITE_API_URL;

const BellNotification = () => {
    const { user } = useContext(UserContext);
    const token = JSON.parse(localStorage.getItem('token'));
    const navigate = useNavigate();

    const [notifications, setNotifications] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const autoCloseTimer = useRef(null);

    const playSound = useCallback(() => {
        const sound = new Audio(bellSound);
        sound.play().catch((error) => {
            console.error("Error playing sound:", error);
        });
    }, []);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleBellClick = () => {
        playSound();
        toggleDropdown();

        if (!isDropdownOpen) {
            autoCloseTimer.current = setTimeout(() => {
                setIsDropdownOpen(false);
            }, 9000);
        } else if (autoCloseTimer.current) {
            clearTimeout(autoCloseTimer.current);
        }
    };

    const fetchNotifications = async () => {
        if (!user) {
            return;
        }
        try {
            const response = await axios.get(`${backend_API}/request/getNotifications`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                withCredentials: true,
            });
            console.log(response.data.notifications, "notify");

            setNotifications(response.data.notifications);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    const handleDeleteNotification = async (notificationId) => {
        try {
            await axios.delete(`${backend_API}/request/deleteNotification`, {
                data: { notificationId },
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                withCredentials: true,
            });

            setNotifications((prevNotifications) =>
                prevNotifications
                    .filter(n => n._id !== notificationId) // Remove the deleted notification
                    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)) // Sort by timestamp (latest first)
            );
        } catch (error) {
            console.error("Error deleting notification:", error);
        }
    };

    // **Handle Notification Click Based on Title**
    const handleNotificationClick = (notification) => {

        if (notification.type === "new_work") {
            navigate('/work');
        } else if (notification.type === "referral") {
            navigate('/team');
        } else if (notification.type === "reward") {
            navigate('/wallete');
        }
    };

    useEffect(() => {
        fetchNotifications();

        return () => {
            if (autoCloseTimer.current) {
                clearTimeout(autoCloseTimer.current);
            }
        };
    }, []);

    return (
        <div className="bell-notification-container">
            <Link
                onClick={handleBellClick}
                title="Notifications"
                aria-label="Notifications"
                className="notification-bell-link"
            >
                <img src={bellGold} height={50} width={40} alt="Notification Bell" />
                {notifications.length > 0 && (
                    <span className="notification-count">{notifications.length}</span>
                )}
            </Link>
            {isDropdownOpen && (
                <div className="notification-dropdown">
                    {notifications.length === 0 ? (
                        <p>No notifications</p>
                    ) : (
                        <ul>
                            {notifications.map((notification) => (
                                <li
                                    key={notification._id}
                                    className="notification-item w-100 d-flex justify-content-between text-sm cursor-pointer"
                                    onClick={() => handleNotificationClick(notification)}
                                >
                                    <div>
                                        <strong>{notification.title}</strong>: {notification.message}
                                    </div>
                                    <div>
                                        <FaTimes
                                            className="delete-icon"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteNotification(notification._id);
                                            }}
                                        />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};

export default BellNotification;
