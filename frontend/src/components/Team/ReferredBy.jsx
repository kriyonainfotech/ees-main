import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "../../UserContext";
import "../../assets/team.css";
import { Link } from "react-router-dom";

const backend_API = import.meta.env.VITE_API_URL;

const ReferredBy = () => {
  const { user } = useContext(UserContext);
  const [referrals, setReferrals] = useState([]);
  const [filteredReferrals, setFilteredReferrals] = useState([]);
  const [referralCounts, setReferralCounts] = useState({ direct: 0, total: 0 });
  const [loadingReferrals, setLoadingReferrals] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // Search query state

  useEffect(() => {
    const fetchData = async () => {
      if (!user?._id) {
        setError("User is not authenticated");
        setLoadingReferrals(false);
        return;
      }

      try {
        const response = await axios.get(
          `${backend_API}/referal/getreferrals/${user._id}`
        );
        console.log(response.data, "Referral Data");

        setReferrals(response.data.referredUsers);
        setReferralCounts(response.data.referralCounts); // Get direct & total referral count
        setLoadingReferrals(false);
        setFilteredReferrals(response.data.referredUsers); // Initially show all referrals
      } catch (err) {
        setError("Error fetching data");
        setLoadingReferrals(false);
      }
    };

    fetchData();
  }, [user?._id]);

  // Search function
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter referrals by name or phone number
    const filteredData = referrals.filter(
      (referral) =>
        referral.name.toLowerCase().includes(query) ||
        referral.phone.includes(query)
    );

    setFilteredReferrals(filteredData);
  };

  return (
    <div className="mt-2">
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="text-start">
        {/* Referrals Section */}
        <div className="d-flex justify-content-between align-items-end pb-2">
          <div>
            <p className="text-lg lg:text-2xl font-semibold">Your Referrals</p>
          </div>
          {/* Search Box */}
          <div className="search-container">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search by name or phone"
              className="form-control custom-search-input"
            />
          </div>
        </div>

        {loadingReferrals ? (
          <div>
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <p>Loading referrals...</p>
          </div>
        ) : (
          <div className="list-group">
            {filteredReferrals.length > 0 ? (
              filteredReferrals.map((referral, index) => (
                <div
                  className="alert alert-success p-4 rounded-lg shadow-md mb-3"
                  key={index}
                >
                  <div className="d-flex justify-content-between">
                    {/* Left Section */}
                    <div>
                      <p className="">
                        <strong>User Name:</strong> {referral.name}
                      </p>
                      <p>
                        <a
                          href={`tel:${referral.phone}`}
                          className="text-md text-blue-600 hover:underline"
                        >
                          <strong>Call: </strong>
                          {referral.phone}
                        </a>
                      </p>
                    </div>

                    {/* Right Section */}
                    <div className="text-end">
                      <p>
                        <strong>Referrals:</strong>{" "}
                        {referral.secondLevelReferralCount}
                      </p>
                      <p>
                        <strong>Payment Verified:</strong>{" "}
                        {referral.paymentVerified ? "✅ Yes" : "❌ No"}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="alert alert-warning text-center p-4 rounded-lg">
                No referrals found.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReferredBy;
