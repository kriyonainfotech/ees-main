import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
const backend_API = import.meta.env.VITE_API_URL;


const DeleteAccount = ({ userId }) => {
    const [confirming, setConfirming] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleDelete = async () => {
        try {
            setLoading(true);
            const res = await axios.delete(`${backend_API}/auth/deleteUser`, {
                data: { id: userId }
            }); // replace USER_ID dynamically
            setMessage(res.data.message);
            setLoading(false);
            toast.success("user deleted success")
            setTimeout(() => window.location.reload(), 5000);
            // Optionally log out or redirect
        } catch (error) {
            setMessage(error.response?.data?.message || "Error deleting account");
            setLoading(false);
            toast.error('Error deleting user')
        }
    };

    return (
        <div className="container px-0 mt-10">
            <div className="bg-red-50 border border-red-200 p-4 rounded-xl shadow-sm">
                <h3 className="text-red-600 font-semibold text-lg mb-2">Delete Account</h3>
                <p className="text-sm text-red-500 mb-4">
                    This will permanently delete your account and all related data. This action cannot be undone.
                </p>

                {confirming ? (
                    <>
                        <p className="text-sm text-gray-700 mb-2">Are you sure?</p>
                        <button
                            onClick={handleDelete}
                            disabled={loading}
                            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                        >
                            {loading ? "Deleting..." : "Yes, delete my account"}
                        </button>
                        <button
                            onClick={() => setConfirming(false)}
                            className="ml-2 text-gray-600 underline text-sm"
                        >
                            Cancel
                        </button>
                    </>
                ) : (
                    <button

                        onClick={() => setConfirming(true)}
                        className="text-white hover:underline text-sm bg-red-600 py-2 px-3 rounded-xl"
                    >
                        Delete my account
                    </button>
                )}

                {message && <p className="mt-3 text-sm text-gray-600">{message}</p>}
            </div>
        </div>
    );
};

export default DeleteAccount;
