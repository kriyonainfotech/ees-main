// 📁 components/Request/RequestCard.jsx
import React, { useContext } from "react";
import { format } from "date-fns";
import { FaPhone } from "react-icons/fa6";
import ProfileIcon from "../../../public/User_icon.webp";
import starGold from "../../../public/starRating.png";
import starSilver from "../../../public/startSilver.png";
import { toast } from "react-toastify";
import { UserContext } from "../../UserContext";
import axios from "axios";

const backend_API = import.meta.env.VITE_API_URL;

const RequestCard = ({ request, userRole, setData, onRate }) => {

    const { user } = useContext(UserContext);
    // console.log(user, 'user')

    const token = JSON.parse(localStorage.getItem("token"));

    const handleAction = async (id, requestId, status) => {
        try {
            const endpoint =
                status === "cancelled" ? "cancelRequest" : "updateRequestStatus";
            const response = await axios.post(
                `${backend_API}/request/${endpoint}`,
                { userId: id, requestId, status },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (response.status === 200) {
                toast.success(`Request ${status}`);
                setData((prev) =>
                    prev.map((req) =>
                        req.requestId === requestId ? { ...req, status } : req
                    )
                );
            } else {
                toast.error("Failed to update request");
            }
        } catch (error) {
            console.error(error);
            toast.error("Server error");
        }
    };

    const cancelRequest = async (requestId) => {
        console.log(user, 'user 2')
        const userId = user?._id;
        if (!userId) return toast.error("User not found");

        toast.info(
            <div>
                <p>Are you sure you want to cancel this request?</p>
                <div className="flex justify-end gap-3 mt-2">
                    <button
                        className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                        onClick={async () => {
                            toast.dismiss();
                            try {
                                const { data } = await axios.delete(
                                    `${backend_API}/request/deleteRequest`,
                                    { data: { requestId, userId } }
                                );
                                if (data.success) {
                                    toast.success("Request deleted successfully!");
                                    setData((prev) =>
                                        prev.filter((req) => req.requestId !== requestId)
                                    );
                                } else toast.error(data.message);
                            } catch (err) {
                                console.log(err, 'error in delete request')
                                toast.error("Failed to delete request");
                            }
                        }}
                    >
                        Yes
                    </button>
                    <button
                        className="px-3 py-1 bg-gray-400 text-white rounded-md hover:bg-gray-500"
                        onClick={() => toast.dismiss()}
                    >
                        No
                    </button>
                </div>
            </div>,
            { autoClose: false }
        );
    };

    const renderStars = (value = 0) => {
        return Array.from({ length: 10 }, (_, i) => (
            <img
                key={i}
                src={i < value ? starGold : starSilver}
                alt="star"
                width={16}
            />
        ));
    };

    const showRateBtn = request.status === "completed";

    return (
        <div className="bg-white rounded-xl border overflow-hidden">
            <div className="relative">
                <img
                    className="w-full h-[250px] md:h-[350px] object-cover"
                    src={request.profilePic || ProfileIcon}
                    alt="Profile"
                />
                <span
                    className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold text-white ${request.status === "accepted"
                        ? "bg-blue-600"
                        : request.status === "completed"
                            ? "bg-green-600"
                            : request.status === "rejected"
                                ? "bg-red-600"
                                : request.status === "rated"
                                    ? "bg-gray-600"
                                    : "bg-yellow-500"
                        }`}
                >
                    {request.status || "Pending"}
                </span>
            </div>

            <div className="p-3">
                <h4 className="text-lg font-semibold text-gray-900">
                    {request.name || "Unknown User"}
                </h4>
                <div className="flex justify-between text-sm mt-2">
                    <p className="text-orange-600">
                        {request.businessCategory?.join(", ") || "N/A"}
                    </p>
                    <p className="text-gray-500">
                        {format(new Date(request.date), "PPpp")}
                    </p>
                </div>

                <div className="flex items-center mt-2 text-sm gap-1">
                    <span className="text-gray-700 pe-1">Provider:</span>
                    {renderStars(request?.providerRatingbySender?.value || 0)}
                    <span>{request?.providerRatingbySender?.value || 0}</span>
                </div>

                <div className="flex items-center mt-1 text-sm gap-1">
                    <span className="text-gray-700 pe-1">User:</span>
                    {renderStars(request?.userRatingbyprovider?.value || 0)}
                    <span>{request?.userRatingbyprovider?.value || 0}</span>
                </div>

                <div className="mt-4 flex flex-col sm:flex-row gap-2">
                    {request.status === "pending" && userRole === "sender" && (
                        <>
                            <a
                                href={`tel:${request.phone}`}
                                className="w-full text-sm flex items-center justify-center gap-2 p-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
                            >
                                <FaPhone /> Contact Now
                            </a>
                            <button
                                className="w-full text-sm p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                onClick={() => cancelRequest(request.requestId)}
                            >
                                Delete
                            </button>
                        </>
                    )}

                    {request.status === "pending" && userRole === "receiver" && (
                        <>
                            <button
                                className="w-full text-sm p-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                onClick={() =>
                                    handleAction(request.senderId, request.requestId, "accepted")
                                }
                            >
                                Accept
                            </button>
                            <button
                                className="w-full text-sm p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                onClick={() =>
                                    handleAction(request.senderId, request.requestId, "rejected")
                                }
                            >
                                Reject
                            </button>
                        </>
                    )}


                    {request.status === "accepted" && (
                        <>
                            <a
                                href={`tel:${request.phone}`}
                                className="w-full text-sm flex items-center justify-center gap-2 p-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
                            >
                                <FaPhone /> Contact Now
                            </a>
                            <button
                                className="w-full text-sm p-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                                onClick={onRate}
                            >
                                Completed
                            </button>
                        </>
                    )}


                    {showRateBtn && (
                        <button
                            className="p-2 text-sm bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                            onClick={onRate}
                        >
                            Rate {userRole === "sender" ? "Provider" : "User"}
                        </button>
                    )}

                    {(request.status === "rejected" || request.status === "rated") && (
                        <button
                            className="p-2 text-sm bg-gray-600 text-white rounded-lg hover:bg-red-900"
                            onClick={() => cancelRequest(request.requestId)}
                        >
                            Remove
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RequestCard;
