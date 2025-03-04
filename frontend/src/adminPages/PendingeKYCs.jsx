import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaMoneyCheckAlt } from "react-icons/fa";
import AdminHeader from "../admincomponents/AdminHeader";
import AdminSidebar from "../admincomponents/AdminSidebar";
import axios from "axios";
import { toast } from "react-toastify";
import { RiSecurePaymentFill } from "react-icons/ri";

const backend_API = import.meta.env.VITE_API_URL;

const PendingeKYCs = () => {
  const location = useLocation();
  const withdrawals = location.state?.withdrawals || [];
  console.log(withdrawals, "withdrawals");
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${backend_API}/auth/ekyc-pending`, {
        withCredentials: true,
      });
      console.log(res, "user paid");
      if (res.status === 200) {
        setUsers(res.data.users);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const confirmSubmit = async (kycId) => {
    console.log(kycId, "kycId");
    try {
      const response = await axios.post(`${backend_API}/withdrawal/verifyKyc`, {
        kycId,
      });
      console.log(response, "response+++++++++++++++++++++++++++++++");
      if (response.status === 200) {
        toast.success("KYC Verified Successfully!");
        // 🔄 Remove Verified User from State (Keep only Pending)
        setUsers((prevUsers) =>
          prevUsers.filter((user) => user.ekyc._id !== kycId)
        );
      }
    } catch (error) {
      console.log(error, "error+++++++++++++++++++++++++");
      toast.error(error.response?.data?.message || "Failed to verify KYC.");
    }
  };

  const handleVerifyKyc = async (kycId) => {
    toast.info(
      <div>
        <p>Are you sure you want to verify this KYC?</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
          <button
            onClick={() => confirmSubmit(kycId)}
            className="bg-green-600 text-white px-3 py-1 rounded-md"
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="bg-red-500 text-white px-3 py-1 rounded-md"
          >
            No
          </button>
        </div>
      </div>,
      { autoClose: false }
    );
  };

  return (
    <>
      <AdminHeader />
      <AdminSidebar />
      <div className="mt-40 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold mb-4">Pending e-KYCs</h2>
          <button
            onClick={() => navigate(-1)}
            className="mb-4 px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-md text-gray-800 font-semibold"
          >
            ⬅ Back
          </button>
        </div>
        {/* e-KYC Table */}
        {users.length === 0 ? (
          <p className="text-gray-600">No pending e-KYCs found.</p>
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="overflow-auto max-h-[500px]">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead className="bg-gray-500 text-white">
                  <tr>
                    <th className="p-3">Sr.no</th>
                    <th className="p-3">User</th>
                    <th className="p-3">Phone</th>
                    <th className="p-3">Bank Acc.</th>
                    {[
                      "bankProof",
                      "panCardfront",
                      "panCardback",
                      "frontAadhar",
                      "backAadhar",
                    ].map((key) => (
                      <th key={key} className="p-3 capitalize">
                        {key.replace(/([A-Z])/g, " $1")}
                      </th>
                    ))}
                    <th className="p-3">Status</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr
                      key={user._id}
                      className="border-b hover:bg-gray-100 transition"
                    >
                      <td className="p-3">{index + 1}</td>
                      <td className="p-3 flex items-center space-x-2">
                        <img
                          src={user.profilePic}
                          alt="Profile"
                          className="w-10 h-10 rounded-full border z-50 cursor-pointer "
                          onClick={() => setSelectedImage(user.profilePic)}
                        />
                        <span>{user.name || "N/A"}</span>
                      </td>
                      <td className="p-3">{user.phone || "N/A"}</td>
                      <td className="p-3">
                        {user.ekyc.bankAccountNumber || "N/A"}
                      </td>

                      {/* Image Previews */}
                      {[
                        "bankProof",
                        "panCardfront",
                        "panCardback",
                        "frontAadhar",
                        "backAadhar",
                      ].map((key) => (
                        <td key={key} className="p-3">
                          {key.includes("Aadhar") ? (
                            user[key] ? (
                              <img
                                src={user[key]}
                                alt={key}
                                className="w-12 h-12 cursor-pointer rounded-md border z-50"
                                onClick={() => setSelectedImage(user[key])}
                              />
                            ) : (
                              "N/A"
                            )
                          ) : user.ekyc[key] ? (
                            <img
                              src={user.ekyc[key]}
                              alt={key}
                              className="w-12 h-12 cursor-pointer rounded-md border z-50"
                              onClick={() => setSelectedImage(user.ekyc[key])}
                            />
                          ) : (
                            "N/A"
                          )}
                        </td>
                      ))}

                      <td className="p-3">
                        <span className="px-2 py-1 rounded bg-yellow-500 text-white">
                          {user.ekyc.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => handleVerifyKyc(user?.ekyc._id)}
                          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          Verify KYC
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Image Modal */}
        {selectedImage && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-75 z-50">
            <div className="relative">
              <button
                className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full"
                onClick={() => setSelectedImage(null)}
              >
                ✕
              </button>
              <img
                src={selectedImage}
                alt="Preview"
                className="max-w-full max-h-[90vh] rounded-lg shadow-lg"
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PendingeKYCs;
