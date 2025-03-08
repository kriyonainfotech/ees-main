import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AdminHeader from "../admincomponents/AdminHeader";
import AdminSidebar from "../admincomponents/AdminSidebar";

const backend_API = import.meta.env.VITE_API_URL;

const YearlyInvestors = () => {
  const [investors, setInvestors] = useState([]);
  const [plans, setPlans] = useState([]);
  const [phone, setPhone] = useState("");
 const [selectedPlan, setSelectedPlan] = useState("");
 const [isModalOpen, setIsModalOpen] = useState(false);
 const [searchTerm, setSearchTerm] = useState("");
 const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    fetchYearlyInvestors();
  }, []);

  const fetchYearlyInvestors = async () => {
    try {
      const response = await axios.get(
        `${backend_API}/invest/getyearlyInvestors`
      );
      console.log(response.data);
      setInvestors(response.data.investors);
    } catch (error) {
      console.error("Error fetching investors:", error);
    }
  };

  // Fetch Yearly Plans when Modal opens
  useEffect(() => {
    if (isModalOpen) {
      fetchPlans();
    }
  }, [isModalOpen]);

  const fetchPlans = async () => {
    try {
      const response = await axios.get(`${backend_API}/invest/plans/monthly`);
      console.log(response.data);
      setPlans(response.data.plans);
    } catch (error) {
      console.error("Error fetching plans:", error);
    }
  };

  const handleAssignPlan = async () => {
    if (!phone || !selectedPlan) return alert("Please fill all fields!");

    try {
      const response = await axios.post(`${backend_API}/invest/assign-plan`, {
        phone,
        planId: selectedPlan,
      });
      console.log(response.data,'reponse+_=-=-=-');
      if (response.data.success) {
        alert("Plan assigned successfully!");
      } else {
        alert("Failed to assign plan.");
      }
      setIsModalOpen(false);
      fetchYearlyInvestors(); // Refresh the list
    } catch (error) {
      console.error("Error assigning plan:", error);
      alert("Failed to assign plan.");
    }
  };

  return (
    <>
      <AdminHeader />
      <AdminSidebar />
      <div className="mt-40">
        <div className="p-6 bg-white shadow-lg rounded-lg">
          {/* Header with Assign Investment Button */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">
              Yearly Investors
            </h2>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 float-right"
              onClick={() => setIsModalOpen(true)}
            >
              Assign Investment Plan
            </button>
          </div>

          {/* Investors Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="border p-3 text-center">#</th>
                  <th className="border p-3 text-center">Investor Name</th>
                  <th className="border p-3 text-center">Phone</th>
                  <th className="border p-3 text-center">Investment Amount</th>
                  <th className="border p-3 text-center">Return Amount</th>
                  <th className="border p-3 text-center">Start Date</th>
                  <th className="border p-3 text-center">Next Payout Date</th>
                  <th className="border p-3 text-center">Duration</th>
                  <th className="border p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {investors?.length > 0 ? (
                  investors.map((investor, index) => (
                    <tr key={investor._id} className="text-center">
                      <td className="border p-3">{index + 1}</td>
                      <td className="border p-3">{investor.userName}</td>
                      <td className="border p-3">{investor.phone}</td>
                      <td className="border p-3">₹{investor.amount}</td>
                      <td className="border p-3">₹{investor.returnAmount}</td>
                      <td className="border p-3">
                        {new Date(investor.startDate).toLocaleDateString()}
                      </td>
                      <td className="border p-3">
                        {new Date(investor.nextPayoutDate).toLocaleDateString()}
                      </td>
                      <td className="border p-3">
                        {investor.duration >= 12
                          ? `${investor.duration / 12} Years`
                          : `${investor.duration} Months`}
                      </td>

                      <td className="border p-3">
                        <span
                          className={`px-2 py-1 rounded-lg text-white ${
                            investor.status === "active"
                              ? "bg-green-500"
                              : "bg-gray-500"
                          }`}
                        >
                          {investor.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="border p-3 text-center text-gray-500"
                    >
                      No investors found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
              <h2 className="text-xl font-semibold mb-4">
                Assign Investment Plan
              </h2>

              {/* Phone Number Input */}
              <label className="block text-sm font-medium">Phone Number:</label>
              <input
                type="text"
                className="border w-full p-2 rounded mb-3"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter User Phone"
              />

              {/* Select Plan (Dropdown with Search) */}
              <label className="block text-sm font-medium">Select Plan:</label>
              <div className="relative">
                <div
                  className="border w-full p-2 rounded mb-3 cursor-pointer bg-white"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  {selectedPlan
                    ? plans
                        .find((plan) => plan._id === selectedPlan)
                        ?.type.toUpperCase() +
                      " - " +
                      plans.find((plan) => plan._id === selectedPlan)
                        ?.investmentAmount +
                      " ₹"
                    : "Choose a Plan"}
                </div>

                {isDropdownOpen && (
                  <div className="absolute w-full bg-white border rounded shadow-lg z-10">
                    {/* Search Input */}
                    <input
                      type="text"
                      className="border-b w-full p-2"
                      placeholder="Search Plan..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    {/* Plan List */}
                    <ul className="max-h-64 overflow-y-auto">
                      {plans
                        .filter((plan) =>
                          plan.investmentAmount.toString().includes(searchTerm)
                        )
                        .map((plan) => (
                          <li
                            key={plan._id}
                            className="p-2 cursor-pointer hover:bg-gray-100"
                            onClick={() => {
                              setSelectedPlan(plan._id);
                              setIsDropdownOpen(false);
                            }}
                          >
                            {plan.type.toUpperCase()} - {plan.investmentAmount}{" "}
                            ₹
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-2">
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                  onClick={handleAssignPlan}
                >
                  Assign Plan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default YearlyInvestors;
