import React from 'react'
import { FaUserShield } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const AdminCount = ({ admincnt }) => {
  const navigate = useNavigate();
  return (
    <div
      className="border rounded-xl p-4 bg-white hover:shadow-lg transition duration-300 cursor-pointer"
      onClick={() => navigate("/admin/manageAdmin")}
    >
      <div className="flex items-center space-x-4">
        {/* Icon */}
        <div className="w-14 h-14 flex items-center justify-center bg-blue-500 text-white rounded-full">
          <FaUserShield className="text-2xl" />
        </div>

        {/* Text Content */}
        <div>
          <p className="text-gray-600 text-sm font-medium">Total Admins</p>
          <h5 className="text-xl font-semibold">{admincnt.length}</h5>
        </div>
      </div>
    </div>
  );
};

const Investments = () => {
  const navigate = useNavigate();
  return (
    <div className="border rounded-xl p-4 bg-white hover:shadow-lg transition duration-300 cursor-pointer">
      <div className="flex items-center space-x-4">
        {/* Icon */}
        <div className="w-14 h-14 flex items-center justify-center bg-indigo-500 text-white rounded-full">
          <FaUserShield className="text-2xl" />
        </div>

        <div className="w-full flex justify-between items-center ">
          {/* Header Section */}
          <div className="col-3 ">
            <p className="text-gray-800 text-xl font-medium">Investments</p>
            <h5 className="text-xl font-semibold"></h5>
          </div>

          {/* Buttons for Yearly & Monthly Investments */}
          <div className="col-6 flex gap-4">
            <Link
              to="/admin/investments/yearly"
              className="bg-blue-500 text-white px-6 py-3 rounded-lg text-center flex-1"
            >
              Yearly Investors
            </Link>
            <Link
              to="/admin/investments/monthly"
              className="bg-green-500 text-white px-6 py-3 rounded-lg text-center flex-1"
            >
              Monthly Investors
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export { AdminCount, Investments };