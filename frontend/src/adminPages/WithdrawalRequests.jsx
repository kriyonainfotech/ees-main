import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaMoneyCheckAlt } from "react-icons/fa";
import AdminHeader from "../admincomponents/AdminHeader";
import AdminSidebar from "../admincomponents/AdminSidebar";
import axios from "axios";
import { toast } from "react-toastify";

const backend_API = import.meta.env.VITE_API_URL;

const WithdrawalRequests = () => {
  const location = useLocation();
  const withdrawals = location.state?.withdrawals || [];
  console.log(withdrawals, 'withdrawals')
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();


  const handleVerifyKyc = async (kycId) => {
    try {
      const { data } = await axios.post(`${backend_API}/withdrawal/verifyKyc`, { kycId });
      console.log(data, 'data verify kyc')
      if (data.success === 200) {
        toast.success("KYC Verified Successfully!");
      }
      // Refresh or update state
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to verify KYC.");
    }
  };

  const approvePayout = async (kycId, amount) => {
    try {
      const { data } = await axios.post(`${backend_API}/withdrawal/approveKyc`, { kycId, amount });

      console.log(data, 'resposne ')
      if (data.success === 200) {
        toast.success("Payout Approved Successfully!");
      }
      // Refresh or update state
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to approve payout.");
    }
  }

  const handleApprovePayout = async (kycId, amount) => {
    toast.info(
      <div>
        <p>Are you sure you want to approve this payout?</p>
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => {
              toast.dismiss();
              approvePayout(kycId, amount); // Call your API function
            }}
            className="px-3 py-1 bg-green-500 text-white rounded"
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="px-3 py-1 bg-gray-400 text-white rounded"
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
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold mb-4">Withdrawal Requests</h2>
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="mb-4 px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-md text-gray-800 font-semibold"
          >
            ⬅ Back
          </button>
        </div>
        {withdrawals.length === 0 ? (
          <p className="text-gray-600">No withdrawal requests found.</p>
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="overflow-auto max-h-[500px]">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead className="bg-gray-500 text-white">
                  <tr>
                    <th className="p-3">Sr.no</th>
                    <th className="p-3">UserName</th>
                    <th className="p-3">Phone</th>
                    <th className="p-3">Bank ACC.NO</th>
                    <th className="p-3">IFSC Code</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Bank Proof</th>
                    <th className="p-3">PAN Front</th>
                    <th className="p-3">PAN Back</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {withdrawals.map((withdrawal, index) => (
                    <tr key={index} className="border-b hover:bg-gray-100 transition">
                      <td className="p-3">{index + 1}</td>
                      <td className="p-3">{withdrawal.userId.name || "N/A"}</td>
                      <td className="p-3">{withdrawal.userId.phone || "N/A"}</td>
                      <td className="p-3">{withdrawal.bankAccountNumber}</td>
                      <td className="p-3">{withdrawal.ifscCode}</td>
                      <td className="p-3">₹{withdrawal.amount}</td>
                      <td className="p-3">
                        <img
                          src={withdrawal.bankProof}
                          alt="Bank Proof"
                          className="w-12 h-12 cursor-pointer rounded-md border"
                          onClick={() => setSelectedImage(withdrawal.bankProof)}
                        />
                      </td>
                      <td className="p-3">
                        <img
                          src={withdrawal.panCardfront}
                          alt="PAN Front"
                          className="w-12 h-12 cursor-pointer rounded-md border"
                          onClick={() => setSelectedImage(withdrawal.panCardfront)}
                        />
                      </td>
                      <td className="p-3">
                        <img
                          src={withdrawal.panCardback}
                          alt="PAN Back"
                          className="w-12 h-12 cursor-pointer rounded-md border"
                          onClick={() => setSelectedImage(withdrawal.panCardback)}
                        />
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded ${withdrawal.status === "pending"
                            ? "bg-yellow-500 text-white"
                            : "bg-green-500 text-white"
                            }`}
                        >
                          {withdrawal.status}
                        </span>
                      </td>
                      <td className="p-3 gap-2">
                        {withdrawal.verified ? (
                          <button
                            onClick={() => handleApprovePayout(withdrawal._id, withdrawal.amount)}
                            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                          >
                            Approve Payout
                          </button>
                        ) : (
                          <button
                            onClick={() => handleVerifyKyc(withdrawal._id)}
                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                          >
                            Verify KYC
                          </button>
                        )}
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
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-75">
            <div className="relative">
              <button
                className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full"
                onClick={() => setSelectedImage(null)}
              >
                ✕
              </button>
              <img src={selectedImage} alt="Preview" className="max-w-full max-h-[90vh] rounded-lg shadow-lg" />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default WithdrawalRequests;
