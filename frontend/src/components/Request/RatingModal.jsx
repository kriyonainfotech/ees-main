// 📁 components/Request/RatingModal.jsx
import React, { useState } from "react";
import starGold from "../../../public/starRating.png";
import starSilver from "../../../public/startSilver.png";
import axios from "axios";
import { toast } from "react-toastify";

const backend_API = import.meta.env.VITE_API_URL;

const RatingModal = ({ target, onClose, setData, userRole }) => {

    // console.log("🚀 setData is", setData, typeof setData);

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const token = JSON.parse(localStorage.getItem("token"));

    const renderStars = (value = 0, max = 10) => {
        return Array.from({ length: max }, (_, i) => (
            <img
                key={i}
                src={i < value ? starGold : starSilver}
                alt="star"
                width={18}
                className="cursor-pointer hover:opacity-80"
                onClick={() => setRating(i + 1)}
            />
        ));
    };

    const submitRating = async () => {
        try {
            const payload = {
                requestId: target.requestId,
                receiverId: userRole === "sender" ? target.receiverId : target.senderId,
                ratingValue: rating,
                comment,
            };

            const response = await axios.post(`${backend_API}/user/rate`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });

            if (response.status === 200) {
                toast.success(response.data.message || "Rating submitted");
                setData((prev) =>
                    prev.map((req) =>
                        req.requestId === target.requestId
                            ? { ...req, status: "rated", userRating: rating }
                            : req
                    )
                );
                onClose();
            } else {
                toast.error("Rating failed");
            }
        } catch (err) {
            console.log(err);
            toast.error("Server error while rating");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white p-5 rounded-lg w-96">
                <h3 className="text-lg font-bold mb-3">Rate {target.name}</h3>

                <div className="flex gap-1 mb-4">{renderStars(rating)}</div>

                <textarea
                    rows="3"
                    className="w-full border border-gray-300 rounded p-2 mb-4"
                    placeholder="Write a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />

                <div className="flex justify-end gap-2">
                    <button className="px-3 py-1 bg-gray-400 text-white rounded" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={submitRating}>
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RatingModal;