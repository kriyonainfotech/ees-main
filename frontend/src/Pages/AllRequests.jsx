import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaPhone, FaStar } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

const backend_API = import.meta.env.VITE_API_URL;

const AllRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true); // To manage the loading state

    const fetchUserRequests = async () => {
        setLoading(true)
        try {
            const response = await axios.get(`${backend_API}/request/getAllRequests`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                setRequests(response.data.data); // Set the fetched requests
                console.log("Requests fetched successfully:", response.data.data);
            } else {
                console.error("Failed to fetch requests:", response.data.message);
            }
        } catch (error) {
            console.error("Error fetching user requests:", error);
            toast(error?.response?.data?.message)
        } finally {
            setLoading(false); // Stop the loading spinner
        }
    };

    useEffect(() => {
        fetchUserRequests();
    }, []); // Empty dependency array to run this effect only once

    return (
        <>
            <section>
                <div className="container">
                    <div className="row">
                        <div className="col-12 d-flex gap-3">
                            <div className="receivReqBtn">
                                <button className='btn btn-success'>
                                    Sended Request
                                </button>
                            </div>
                            <div className="receivReqBtn">
                                <button className='btn btn-success'>
                                    Received Request
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <div className="container">
                    <div className="row">
                        <div className="col-12 pt-3">
                            <h4>All Requests</h4>
                        </div>

                        {/* Loading state */}
                        {loading ? (
                            <></>
                        ) : (
                            <div className="col-12 flex flex-wrap py-2">
                                {requests.map((req) => (
                                    <div key={req.id} className="col-12 col-md-6 w-full col-lg-4 p-1">
                                        <div className="bg-white border rounded-md overflow-hidden d-flex shadow flex-md-column" style={{ position: "relative" }}>
                                            <div className='col-5 col-md-12 d-flex'>
                                                <div className="img p-2" style={{ height: "200px", width: "100%" }}>
                                                    <img
                                                        className='img-fluid'
                                                        src={req.image || "https://img.daisyui.com/images/profile/demo/5@94.webp"}
                                                        alt={req.name}
                                                        style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
                                                    />
                                                </div>
                                                <span className={`position-absolute rounded-full top-5 end-5 p-1 text-sm text-white px-2 ${req.status === 'open' ? 'bg-success' : 'bg-orange'}`}>
                                                    {req.status}
                                                </span>
                                            </div>
                                            <div className="p-3 col-10 col-md-12">
                                                <h4>{req.name}</h4>
                                                <h6 className='pt-2'>{req.category}</h6>
                                                <p>{req.address}</p>
                                                <div className="rating rating-sm d-flex align-items-center">
                                                    {[...Array(5)].map((_, index) => (
                                                        <FaStar key={index} className='text-warning' />
                                                    ))}
                                                    <span className='ps-2'>{req.rating}</span>
                                                </div>

                                                <div className='pt-2 d-flex justify-content-between'>
                                                    {req.contact ? (
                                                        <Link className='btn pt-2 gap-2 d-flex align-items-center rounded-1 text-semibold text-success'>
                                                            <FaPhone /> Contact Now
                                                        </Link>
                                                    ) : (
                                                        <Link className='btn pt-2 gap-2 d-flex align-items-center rounded-1 text-semibold text-danger'>
                                                            No Contact Available
                                                        </Link>
                                                    )}
                                                    <Link className='btn pt-2 bg-orange rounded-1 text-semibold text-white'>
                                                        {req.status === 'open' ? 'Cancel' : 'View Profile'}
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
};

export default AllRequests;
