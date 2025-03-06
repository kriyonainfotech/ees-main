import React, { useEffect, useState } from "react";
import { FaClock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { RiSecurePaymentFill } from "react-icons/ri";
import { HiOutlineDocumentSearch } from "react-icons/hi";
const backend_API = import.meta.env.VITE_API_URL;

const PendingWithdrwals = () => {
  const navigate = useNavigate();
  const [withdrawalCount, setWithdrawalCount] = useState(0);
  const [withdrawals, setWithdrawals] = useState();

  useEffect(() => {
    const fetchWithdrawals = async () => {
      try {
        const response = await axios.get(
          `${backend_API}/withdrawal/withdrawals`,
          {
            withCredentials: true,
          }
        ); // Adjust API URL if needed
        console.log("Full API Response:", response);
        console.log("Response Data:", response.data);

        if (response.data?.success) {
          console.log("✅ Success Condition Passed!");
          setWithdrawalCount(response.data.count);
          setWithdrawals(response.data.withdrawals);
        } else {
          console.warn("⚠️ Success condition did not pass.", response.data);
        }
      } catch (error) {
        console.error("❌ Error fetching withdrawals:", error);
      }
    };

    fetchWithdrawals();
  }, []);

  return (
    <div
      className="border rounded-xl p-4 bg-white hover:shadow-lg transition duration-300 cursor-pointer"
      onClick={() => navigate("/admin/withdrawals", { state: { withdrawals } })}
    >
      <div className="flex items-center space-x-4">
        {/* Icon */}
        <div className="w-14 h-14 flex items-center justify-center bg-teal-500 text-white rounded-full">
          <FaClock className="text-2xl" />
        </div>

        {/* Text Content */}
        <div>
          <p className="text-gray-600 text-sm font-medium">
            Pending Withdrawals
          </p>
          <h5 className="text-xl font-semibold">{withdrawalCount}</h5>
        </div>
      </div>
    </div>
  );
};

const PaidUsersCtn = () => {
  const navigate = useNavigate();
  const [paidUsersCount, setPaidUsersCount] = useState(0);

  useEffect(() => {
    const fetchPaidUsersCount = async () => {
      try {
        const { data } = await axios.get(`${backend_API}/auth/paidusers`, {
          withCredentials: true,
        });
        console.log(data, "data");
        if (data.success) {
          setPaidUsersCount(data.count);
        }
      } catch (error) {
        console.error("❌ Error fetching paid users:", error);
      }
    };

    fetchPaidUsersCount();
  }, []);

  return (
    <div
      className="border rounded-xl p-4 bg-white hover:shadow-lg transition duration-300 cursor-pointer"
      onClick={() => navigate("/admin/payment-invoices")}
    >
      <div className="flex items-center space-x-4">
        {/* Icon */}
        <div className="w-14 h-14 flex items-center justify-center bg-gray-500 text-white rounded-full">
          <RiSecurePaymentFill className="text-2xl" />
        </div>

        {/* Text Content */}
        <div>
          <p className="text-gray-600 text-sm font-medium">Payment History</p>
          <h5 className="text-xl font-semibold">{paidUsersCount}</h5>
        </div>
      </div>
    </div>
  );
};
const PendingKYCs = () => {
  const navigate = useNavigate();
  const [PendingKyc, setPendingKyc] = useState(0);

  useEffect(() => {
    const fetchPendingKyc = async () => {
      try {
        const { data } = await axios.get(`${backend_API}/auth/ekyc-pending`, {
          withCredentials: true,
        });
        console.log(data, "data0000000000000000000000000000");
        if (data.success) {
          setPendingKyc(data.count);
        }
      } catch (error) {
        console.error("❌ Error fetching paid users:", error);
      }
    };

    fetchPendingKyc();
  }, []);

  return (
    <div
      className="border rounded-xl p-4 bg-white hover:shadow-lg transition duration-300 cursor-pointer"
      onClick={() => navigate("/admin/pending-kycs")}
    >
      <div className="flex items-center space-x-4">
        {/* Icon */}
        <div className="w-14 h-14 flex items-center justify-center bg-orange-500 text-white rounded-full">
          <HiOutlineDocumentSearch className="text-2xl" />
        </div>

        {/* Text Content */}
        <div>
          <p className="text-gray-600 text-sm font-medium">Pending e-KYCs</p>
          <h5 className="text-xl font-semibold">{PendingKyc}</h5>
        </div>
      </div>
    </div>
  );
};

export { PendingWithdrwals, PaidUsersCtn, PendingKYCs };
