import React, { useContext, useState } from 'react';
import { FaPhone } from 'react-icons/fa6';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import starGold from "../../public/starRating.png";
import starSilver from "../../public/startSilver.png";
import ProfileIcon from "../../public/User_icon.webp";
import axios from 'axios';
import { UserContext } from '../UserContext';
const backend_API = import.meta.env.VITE_API_URL;


const Senedrequest = ({ sendedRequest, setSendedRequest }) => {
    const user = useContext(UserContext);
    // console.log(user.user._id)
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [status, setStatus] = useState(null);
    const [rating, setRating] = useState(0);
    const token = JSON.parse(localStorage.getItem('token'));
    console.log(sendedRequest, "sendedRequest");

    const cancelRequest = (requestId) => {
        const userId = user?.user?._id;

        if (!userId) {
            toast.error("User not found!");
            return;
        }

        toast.info(
            <div>
                <p>Are you sure you want to cancel this request?</p>
                <div className="flex justify-end gap-3 mt-2">
                    <button
                        className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                        onClick={async () => {
                            toast.dismiss(); // Close toast before making API call
                            try {
                                const { data } = await axios.delete(`${backend_API}/request/deleteRequest`, {
                                    data: { requestId, userId },
                                });

                                if (data.success) {
                                    toast.success("Request deleted successfully!");
                                    setTimeout(() => {
                                        window.location.reload(); // Reload the page after 5 seconds
                                    }, 4000); // 5000ms = 5 seconds
                                    // Optionally update UI (e.g., remove request from state)
                                } else {
                                    toast.error(data.message || "Failed to delete request.");
                                }
                            } catch (error) {
                                console.error("Error deleting request:", error);
                                toast.error(error.response?.data?.message || "An error occurred while deleting the request.");
                            }
                        }}
                    >
                        Yes
                    </button>
                    <button
                        className="px-3 py-1 bg-gray-400 text-white rounded-md hover:bg-gray-500"
                        onClick={() => toast.dismiss()} // Close toast if No is clicked
                    >
                        No
                    </button>
                </div>
            </div>,
            { autoClose: false, closeOnClick: false }
        );
    };
    const handleAction = async (id, requestId, newStatus) => {
        try {
            const response = await axios.post(
                `${backend_API}/request/updateRequestStatus`,
                { userId: id, requestId, status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.status === 200) {
                toast.success(`Request ${newStatus}`);
                setStatus(newStatus);
                setSendedRequest((prev) =>
                    prev.map((req) =>
                        req.requestId === requestId ? { ...req, status: newStatus } : req
                    )
                );
            } else {
                toast.error("Failed to update request status");
            }
        } catch (error) {
            toast.error("Failed to update request status");
        }
    };


    const openModal = (request) => {
        setSelectedRequest(request);
    };

    const closeModal = () => {
        setSelectedRequest(null);
        setRating(0);
    };
    const submitRating = async (senderId, requestId, ratingValue) => {
        console.log(senderId, requestId, ratingValue, "senderId, requestId, ratingValue");
        if (!selectedRequest) return;

        try {
            const response = await axios.post(`${backend_API}/user/rate`, {
                receiverId: senderId,
                requestId: requestId,
                ratingValue: ratingValue,
                comment: "",
            }, {
                withCredentials: true,
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.status === 200) {
                toast.success(response.data.message || "Rating submitted successfully");
                setSendedRequest((prev) =>
                    prev.map((req) =>
                        req.requestId === requestId
                            ? { ...req, userRating: ratingValue, status: "rated" } // ✅ Update status
                            : req
                    )
                );
                closeModal();

            } else {
                console.log(response, "response");
                toast.error("Failed to submit rating.");
            }
        } catch (error) {
            console.log(error, "error");
            toast.error(error?.response?.data?.message || "Failed to submit rating.");
        }
    };
    const renderStars = (ratingValue = 0, maxRating = 10, isClickable = false) => {
        return Array.from({ length: maxRating }, (_, i) => (
            <img
                key={i}
                src={i < ratingValue ? starGold : starSilver}
                alt={i < ratingValue ? "Filled Star" : "Empty Star"}
                width={22}
                className={`cursor-pointer ${isClickable ? "hover:opacity-80" : ""}`}
                onClick={isClickable ? () => {
                    console.log("Star Clicked:", i + 1);
                    setRating(i + 1);
                } : undefined}
            />
        ));
    };

    return (
        <div className="mt-0">
            <section>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
                    {sendedRequest?.length ? (
                        sendedRequest.map((send, i) => (
                            <div
                                key={i}
                                title={
                                    send.status === "rejected"
                                        ? "Receiver has rejected the request."
                                        : send.status === "completed"
                                            ? "Request completed rate the user"
                                            : send.status === "accepted"
                                                ? "Request accepted contact the user"
                                                : ""
                                }
                                className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden ${send.status === "rejected" ? "opacity-50 grayscale" : ""
                                    }`}
                            >
                                <div className="relative">
                                    <img
                                        className="w-full h-[400px] object-cover object-top"
                                        src={send.profilePic || ProfileIcon}
                                        alt="Profile"
                                    />
                                    <span
                                        className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold 
                                                  ${send.status === "accepted"
                                                ? "bg-blue-600"
                                                : send.status === "completed"
                                                    ? "bg-green-600"
                                                    : "bg-yellow-500"
                                            } text-white`}
                                    >
                                        {send.status || "Pending"}
                                    </span>
                                </div>
                                <div className="p-4">
                                    <div className="flex justify-between items-center">
                                        <p className="text-orange-600 font-semibold capitalize">
                                            {send.businessCategory?.join(", ") || "N/A"}
                                        </p>
                                        <p className="text-sm">{format(new Date(send.date), "PPpp")}</p>
                                    </div>
                                    <h4 className="pt-1 font-semibold text-lg">{send.name || "Unknown User"}</h4>
                                    <p className="text-sm text-gray-600 py-1">{send.email || "No email provided"}</p>
                                    <div className="flex items-center">
                                        <strong className="pe-1">User Rating:</strong>
                                        {renderStars(send?.providerrating?.value || 0, 10)}
                                        <span className="pl-2">{send?.providerrating?.value || 0}</span>
                                    </div>

                                    {/* Buttons based on request status */}
                                    <div className="mt-4 flex gap-2">
                                        {send.status === "pending" && (
                                            <>
                                                <a
                                                    href={`tel:${send.phone}`}
                                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                                                >
                                                    <FaPhone /> Contact Now
                                                </a>
                                                <button
                                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                                                    onClick={() => cancelRequest(send.requestId)}
                                                >
                                                    Delete request
                                                </button>
                                            </>
                                        )}
                                        {send.status === "accepted" && (
                                            <>
                                                <a
                                                    href={`tel:${send.phone}`}
                                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                                                >
                                                    <FaPhone /> Contact Now
                                                </a>
                                                <button
                                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                                    onClick={() => handleAction(send.receiverId, send.requestId, "completed")}
                                                >
                                                    Completed
                                                </button>
                                            </>
                                        )}
                                        {send.status === "completed" && (
                                            <button
                                                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition"
                                                onClick={() => openModal(send)}
                                            >
                                                Rate User
                                            </button>
                                        )}
                                        {send.status === "cancelled" && (
                                            <button
                                                className="px-4 w-100 py-2 bg-red-600 text-white rounded-lg hover:bg-red-900 transition"
                                                onClick={() => cancelRequest(send.requestId)}
                                            >
                                                Delete Request
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-3 text-center py-12">
                            <h5>No Requests Found</h5>
                            <p className="text-gray-500">Your sent requests will appear here.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Rating Modal */}
            {selectedRequest && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h3 className="text-lg font-semibold mb-4">Rate {selectedRequest.name}</h3>
                        <div className="flex justify-center mb-4">{renderStars(rating, 10, true)}</div>
                        <div className="flex justify-end gap-2">
                            <button className="px-4 py-2 bg-gray-400 text-white rounded-lg" onClick={closeModal}>
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                                onClick={() => submitRating(selectedRequest.receiverId, selectedRequest.requestId, rating)}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

};


export default Senedrequest;