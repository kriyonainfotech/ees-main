import React, { useContext, useEffect, useState } from "react";
import logo from "../../public/ees-logo.png";
import { Link, Navigate, useNavigate } from "react-router-dom";
import "react-country-state-city/dist/react-country-state-city.css";
import { UserContext } from "../UserContext";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Font Awesome icons for show/hide

function Registration() {
  const { user } = useContext(UserContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [phone, setPhone] = useState("");
  // for address
  const [pincode, setPincode] = useState("");
  const [area, setArea] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [error, setError] = useState("");
  const [address, setAddress] = useState([]);

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [referralCode, setReferralCode] = useState(null); // For referral code
  const [showPassword, setShowPassword] = useState(false);

  const isAuthenticated = localStorage.getItem("token");
  const navigete = useNavigate();
  if (user) {
    // Redirect to a protected page if already logged in
    return <Navigate to="/" />;
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  useEffect(() => {
    // Extract referral code from URL
    const queryParams = new URLSearchParams(location.search);
    // console.log(queryParams, "queryParams");
    const code = queryParams.get("referralCode");
    // console.log(code, "code");
    if (code) setReferralCode(code);
  }, []);

  // console.log(referralCode, "referralCode");

  const validateInputs = () => {
    const newErrors = {};

    if (!name) {
      newErrors.name = "Name is required.";
    }

    if (!email) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    } else if (!email.endsWith("@gmail.com")) {
      newErrors.email = "Please use your @gmail.com.com email.";
    }

    if (!phone) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^\d{10}$/.test(phone)) {
      newErrors.phone = "Phone number must be exactly 10 digits.";
    }

    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 4) {
      newErrors.password = "Password must be at least 4 characters long.";
    }

    if (password !== confirmpassword) {
      newErrors.confirmpassword = "Passwords do not match.";
    }

    if (!area) {
      newErrors.area = "Area is required.";
    }
    if (!city) {
      newErrors.city = "City is required.";
    }
    if (!state) {
      newErrors.state = "State is required.";
    }
    if (!country) {
      newErrors.country = "Country is required.";
    }
    if (!pincode) {
      newErrors.pincode = "Pincode is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchLocationDetails = async (pincode) => {
    try {
      const response = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`
      );
      const data = await response.json();
      console.log(data);

      if (data[0].Status === "Success") {
        const postOffice = data[0].PostOffice[0]; // Get the first result
        setArea(postOffice.Name || ""); // Set Area (e.g., Kamrej)
        setCity(postOffice.District || ""); // Set City (e.g., Surat)
        setState(postOffice.State || ""); // Set State (e.g., Gujarat)
        setCountry(postOffice.Country || ""); // Set Country (e.g., India)
        setError("");
      } else {
        setError("Invalid Pincode! Please enter a valid one.");
        setArea("");
        setCity("");
        setState("");
        setCountry("");
      }
    } catch (err) {
      setError("Failed to fetch location details. Try again later.");
    }
  };

  // Handle pincode input change
  const handlePincodeChange = (e) => {
    const inputPincode = e.target.value.trim();
    setPincode(inputPincode);

    if (inputPincode.length === 6) {
      fetchLocationDetails(inputPincode);
    } else {
      setArea("");
      setCity("");
      setState("");
      setCountry("");
      setError("");
    }
  };

  const handleSubmits = async (e) => {
    setLoading(true);
    e.preventDefault();

    if (!validateInputs()) {
      setLoading(false);
      return;
    }

    let newadd = {
      area,
      city,
      state,
      country,
      pincode,
    };
    setAddress(newadd);
    console.log(address, "address");

    navigete("/registernext", {
      state: {
        name: name,
        email: email,
        password: password,
        confirmpassword: password,
        phone: phone,
        address: newadd,
        referralCode,
      },
    });
  };

  return (
    <>
      <div className=" min-h-screen flex items-center justify-center">
        <div className="sm:m-10 sm:rounded-lg flex justify-center flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left Side (Logo & Illustration) */}
            <div className="flex flex-col items-center justify-center bg-gray-100 p-8">
              <img src={logo} width={100} alt="Logo" className="mb-6" />
              <img
                src="https://readymadeui.com/signin-image.webp"
                width={300}
                alt="Sign Up Illustration"
                className="max-w-xs"
              />
            </div>

            {/* Right Side (Form) */}
            <div className="p-8">
              <h2 className="text-2xl font-semibold text-gray-800 text-center pb-4">
                Create an Account
              </h2>
              <form onSubmit={handleSubmits}>
                {/* Referral Code (If available) */}
                {referralCode && (
                  <div className="mb-4">
                    <label className="text-gray-600 text-sm">
                      Referral Code:
                    </label>
                    <input
                      type="text"
                      value={referralCode}
                      disabled
                      className="w-full px-4 py-2 border rounded-md bg-gray-200"
                    />
                  </div>
                )}

                {/* Name & Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-400"
                      placeholder="Full Name"
                    />
                    {errors.name && (
                      <span className="text-red-500 text-sm">
                        {errors.name}
                      </span>
                    )}
                  </div>
                  <div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-400"
                      placeholder="Email"
                    />
                    {errors.email ? (
                      <span className="text-red-500 text-sm">
                        {errors.email}
                      </span>
                    ) : (
                      <span className="text-gray-500 text-xs">
                        Email must end with @gmail.com
                      </span>
                    )}
                  </div>
                </div>

                {/* Password & Confirm Password */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-400"
                      placeholder="Password"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-4 top-3 text-gray-600"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                    {errors.password && (
                      <span className="text-red-500 text-sm">
                        {errors.password}
                      </span>
                    )}
                  </div>
                  <div>
                    <input
                      type="password"
                      value={confirmpassword}
                      onChange={(e) => setConfirmpassword(e.target.value)}
                      className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-400"
                      placeholder="Confirm Password"
                    />
                    {errors.confirmpassword && (
                      <span className="text-red-500 text-sm">
                        {errors.confirmpassword}
                      </span>
                    )}
                  </div>
                </div>

                {/* Phone */}
                <div className="mt-4">
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-400"
                    placeholder="Phone Number"
                  />
                  {errors.phone && (
                    <span className="text-red-500 text-sm">{errors.phone}</span>
                  )}
                </div>

                {/* Address Fields */}
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <input
                    type="text"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-400"
                    placeholder="Area"
                  />
                  <input
                    type="text"
                    value={pincode}
                    onChange={handlePincodeChange}
                    maxLength="6"
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-400"
                    placeholder="Pincode"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4 mt-4">
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-400"
                    placeholder="City"
                  />
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-400"
                    placeholder="State"
                  />
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-400"
                    placeholder="Country"
                  />
                </div>

                {/* Submit Button */}
                <div className="mt-6 flex justify-center">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300 flex items-center gap-2"
                  >
                    <svg
                      className="w-5 h-5"
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

                {/* Login Link */}
                <p className="mt-4 text-sm text-center text-gray-600">
                  Already have an account?
                  <Link
                    to="/login"
                    className="text-success link-underline-success font-semibold hover:underline text-lg ml-1"
                  >
                    Log in
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Registration;
