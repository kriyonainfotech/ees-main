import React, { useEffect, useState } from "react";
import axios from "axios";
import { backend_API } from "../utils/constants";
import AdminHeader from "../admincomponents/AdminHeader";
import AdminSidebar from "../admincomponents/AdminSidebar";

const statusColors = {
    pending: "bg-yellow-500",
    accepted: "bg-blue-600",
};

const ActiveRequestsTable = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = JSON.parse(localStorage.getItem("token"));

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const res = await axios.get(`${backend_API}/request/activerequests`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                setRequests(res.data);
            } catch (err) {
                console.error("Error fetching requests:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);

    if (loading) return <div className="p-4 text-center">Loading...</div>;

    return (
        <>
            <AdminHeader />
            <AdminSidebar />
            <div className="my-32">
                <div className="px-4 py-6 max-w-full mx-auto">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold text-gray-800">Active User Requests</h2>

                        <button
                            onClick={() => (window.location.href = "/admin")}
                            className="inline-flex items-center text-sm text-gray-100 bg-gray-500 px-2 py-2 rounded"
                        >
                            ← Back to Admin
                        </button>

                    </div>
                    {requests.length === 0 ? (
                        <p className="text-center text-gray-500">No active requests found.</p>
                    ) : (
                        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                            <table className="min-w-full text-sm text-gray-700">
                                <thead className="bg-gray-50 border-b text-xs font-semibold uppercase text-gray-600">
                                    <tr>
                                        <th className="px-4 py-3 text-left">#</th>
                                        <th className="px-4 py-3 text-left">Date</th>
                                        <th className="px-4 py-3 text-left">Sender</th>
                                        <th className="px-4 py-3 text-left">Receiver</th>
                                        <th className="px-4 py-3 text-left">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {requests.map((req, index) => (
                                        <tr key={req._id} className="hover:bg-gray-50 transition">
                                            <td className="px-4 py-3">{index + 1}</td>
                                            <td className="px-4 py-3">
                                                {new Date(req.createdAt).toLocaleDateString("en-IN", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            </td>
                                            <td className="px-4 py-3">{req.sender?.name || "-"}</td>
                                            <td className="px-4 py-3">{req.receiver?.name || "-"}</td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`inline-block rounded-full px-3 py-1 text-xs font-semibold text-white ${statusColors[req.status] || "bg-gray-500"
                                                        }`}
                                                >
                                                    {req.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

            </div>
        </>
    );
};

export default ActiveRequestsTable;
