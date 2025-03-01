import axios from 'axios';
import React from 'react';
import { FaPowerOff } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const backend_API = import.meta.env.VITE_API_URL;

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axios.get(`${backend_API}/auth/logout`, {
        withCredentials: true, // Ensure cookies are sent with the request
      });
  
      if (response.status === 200) {
        toast(response.data.message || "Logout Successful...");
        
        document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.vercel.app; Secure; SameSite=None; HttpOnly";

        // Clear client-side storage
        localStorage.removeItem('token');
        window.location.reload()
        navigate('/login');
      }
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error(error?.response?.data?.message ||"Logout failed. Please try again.");
    }
  };
  

  return (
    <li className="p-2 rounded hover:bg-primary hover:text-white focus:text-white">
      <Link
        onClick={handleLogout}
        className="w-100 text-md d-flex justify-content-start justify-content-lg-start align-items-center"
      >
        <span className="inline-block mr-3 text-lg">
          <FaPowerOff />
        </span>
        Logout
      </Link>
    </li>
  );
};

export default Logout;
