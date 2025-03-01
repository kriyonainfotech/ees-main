import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import logo from "../../public/ees-logo.png";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getFcmToken } from "../Firebaseconfig";
import { FCMContext } from "../context/FCMContext";
import { UserContext } from "../UserContext";

// import { categories } from '../ServiceCategory'

const backend_API = import.meta.env.VITE_API_URL;
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;

const RegisterNextPage = () => {
  const { user } = useContext(UserContext);
  const { fcmToken } = useContext(FCMContext);

  const [businessCategory, setBusinessCategory] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [businessName, setBusinessName] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [businessDetaile, setBusinessDetaile] = useState("");
  const [categories, setCategories] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const isAuthenticated = localStorage.getItem("token");
  const navigate = useNavigate();
  const location = useLocation();
  const previousData = location.state || {};
  if (user) {
    // Redirect to a protected page if already logged in
    return <Navigate to="/" />;
  }

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const selectCategory = (category) => {
    setBusinessCategory(category); // Set selected category
    setIsDropdownOpen(false); // Close dropdown
  };

  const fetchCategory = async () => {
    try {
      const response = await axios.get(
        `${backend_API}/category/getAllCategory`
      );
      const sortedCategories = response.data.category.sort((a, b) =>
        a.categoryName.localeCompare(b.categoryName)
      );

      setCategories(sortedCategories);
      // console.log(sortedCategories, "sortedCategories");
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  useEffect(() => {
    fetchCategory();
  }, []);
  const handleSubmits = async (e) => {
    e.preventDefault();
    setLoading(true);

    const fullData = {
      ...previousData,
      businessName,
      businessCategory,
      businessAddress,
      businessDetaile,
      fcmToken,
    };
    navigate("/RegisterAadhar", { state: fullData });
  };

  return (
    <>
      <div className="container flex justify-center items-center min-h-screen">
        <div className="w-full max-w-full overflow-hidden flex flex-col lg:flex-row">
          <div className="w-full lg:w-1/2 p-8 flex flex-col justify-center">
            <div className="flex flex-col items-center">
              <img src={logo} width={100} className="mb-6" />
              <h2 className="text-2xl font-semibold text-gray-800">
                Create Your Business Account
              </h2>
            </div>
            <form className="mt-6" onSubmit={handleSubmits}>
              <div className="space-y-4">
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-300 text-gray-800 focus:ring focus:ring-green-300 focus:outline-none"
                  placeholder="Business Name"
                />

                <div className="relative">
                  <div
                    className="border border-gray-300 bg-gray-100 rounded-lg p-3 cursor-pointer"
                    onClick={toggleDropdown}
                  >
                    {businessCategory.length > 0 ? (
                      <span className="text-gray-800">{businessCategory}</span>
                    ) : (
                      <span className="text-gray-500">Select a category</span>
                    )}
                  </div>
                  {isDropdownOpen && (
                    <ul className="absolute left-0 right-0 border bg-white mt-1 rounded-lg shadow-md max-h-40 overflow-y-auto">
                      {categories.map((category, i) => (
                        <li
                          key={i}
                          className={`cursor-pointer px-4 py-2 hover:bg-green-200 ${
                            businessCategory === category.categoryName
                              ? "bg-green-200"
                              : ""
                          }`}
                          onClick={() => selectCategory(category.categoryName)}
                        >
                          {category.categoryName}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <input
                  type="text"
                  value={businessAddress}
                  onChange={(e) => setBusinessAddress(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-300 text-gray-800 focus:ring focus:ring-green-300 focus:outline-none"
                  placeholder="Business Address"
                />

                <textarea
                  value={businessDetaile}
                  onChange={(e) => setBusinessDetaile(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-300 text-gray-800 focus:ring focus:ring-green-300 focus:outline-none"
                  placeholder="Business Details"
                ></textarea>

                <button
                  type="submit"
                  className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all flex items-center justify-center focus:ring focus:ring-green-300"
                >
                  <svg
                    className="w-6 h-6 mr-2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                    <circle cx="8.5" cy={7} r={4} />
                    <path d="M20 8v6M23 11h-6" />
                  </svg>
                  Sign Up
                </button>
              </div>
            </form>
            <p className="mt-4 text-sm text-center text-gray-600">
              Already have an account?{" "}
              <Link
                to={"/login"}
                className="text-green-600 font-semibold hover:underline"
              >
                Login
              </Link>
            </p>
          </div>

          <div className="d-none d-lg-flex col-lg-6 bg-success align-items-center justify-content-center p-4">
            <img
              src="https://readymadeui.com/signin-image.webp"
              alt="Sign In"
              className="img-fluid"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterNextPage;
