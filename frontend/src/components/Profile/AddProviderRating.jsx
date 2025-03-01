import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import { toast } from 'react-toastify';

const backend_API = import.meta.env.VITE_API_URL;

const AddProviderRating = ({ serviceProviderId }) => {
    const [loading, setLoading] = useState(false);
    const token = JSON.parse(localStorage.getItem('token'));
    
    // Check if the token exists before proceeding
    if (!token) {
        alert("You are not logged in!");
        return null;
    }

    const [providerRating, setProviderRating] = useState(0);

    const [comment, setComment] = useState("THANK YOU");

    const [isSubmitting, setIsSubmitting] = useState(false); // For managing submit button state

    // Handle provider rating click
    const handleProviderRatingClick = (rating) => {
        setProviderRating(rating);
        // localStorage.setItem("providerRating", JSON.stringify(rating)); // Store provider rating in localStorage
    };

    const renderStars = (rating, maxRating = 10, onClick) => {
        return Array.from({ length: maxRating }, (_, i) => (
            <FaStar
                key={i + 1}
                className={`${i + 1 <= rating ? "text-warning" : ""}`}
                onClick={() => onClick(i + 1)}
                style={{ cursor: "pointer" }}
            />
        ));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Basic validation before submission
        if (!providerRating) {
            alert("Please provide a rating before submitting.");
            return;
        }
        setLoading(true);
        setIsSubmitting(true); // Disable submit button

        try {
            const response = await axios.post(`${backend_API}/user/rateProvider`, {
                providerId : serviceProviderId,
                ratingValue: providerRating,
                    comment,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                console.log(response.data,"ratings")                ;
                
                // Clear stored values after successful submission
                // localStorage.setItem("providerRating", JSON.stringify(response.data.averageRating));
                setProviderRating(0);
                setComment("");
                window.location.reload()
            } else {
                alert("Failed to submit rating. Please try again.");
            }
        } catch (error) {
            console.error("Error submitting rating:", error.response?.data || error.message);
            toast(error?.response?.data?.message)

        } finally {
            setIsSubmitting(false); // Re-enable submit button
            setLoading(true);
        }
    };

    // Save comment to localStorage as user types
    useEffect(() => {
        localStorage.setItem("comment", comment);
    }, [comment]);

    return (
        <div className="modal fade" id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">Rate User {serviceProviderId}</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            {/* Provider Rating */}
                            <div className="rating rating-sm py-3 w-full text-center d-flex align-items-center justify-content-center fs-2">
                                {renderStars(providerRating, 10, handleProviderRatingClick)}
                            </div>
                            <div className="my-3">
                                <label className="block text-md fs-4 p-2 text-bold">Comment</label>
                                {/* <input
                                    type="text"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    className="w-100 p-2 rounded border"
                                    placeholder="Write your comment here..."
                                    required
                                /> */}
                                 <textarea
                                        className="w-100 p-2 rounded border"
                                        type="text"
                                        value={comment}
                                        defaultValue="THANK YOU"
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="Write your comment here..."
                                        required
                                    />
                            </div>
                            <div className="modal-footer">
                                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                    {isSubmitting ? "Submitting..." : "Submit"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddProviderRating;
