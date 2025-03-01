import axios from "axios";
import React, { useContext, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../../public/ees-logo.png";
import { UserContext } from "../UserContext";
import { FCMContext } from "../context/FCMContext";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Font Awesome icons for show/hide

const backend_API = import.meta.env.VITE_API_URL;

console.log(backend_API);

const Login = () => {
  const { user } = useContext(UserContext);
  const { fcmToken } = useContext(FCMContext);

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("token");
  if (user) {
    // Redirect to a protected page if already logged in
    return <Navigate to="/" />;
  }
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phone || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        `${backend_API}/auth/loginUserweb`,
        {
          phone,
          password,
          fcmToken,
        },
        {
          withCredentials: true, // Important: send cookies with the request
        }
      );
      // console.log( response.data.message ,"Login Successful");
      console.log(response.data.message, "Login response");
      console.log(response.data, "data");
      if (response.status === 200) {
        localStorage.setItem("token", JSON.stringify(response.data.token));
        navigate("/");
        window.location.reload();
        toast("Login Successful");
        console.log(response.data.message, "Login Successful...");
      }
    } catch (error) {
      console.log(error, "login error");
      toast(error?.response?.data?.message);
      console.log(error?.response?.data?.message, "fetch error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="sm:m-10  sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-6/12 p-6 sm:p-12 pt-0">
          <div className="flex flex-col items-center">
            <div className="w-full flex-1 mt-8">
              <div className="flex flex-col items-center">
                <div className="mb-12">
                  <img src={logo} width={100} />
                </div>
              </div>
              <form action="" onSubmit={handleSubmit}>
                <div className="mx-auto max-w-xs">
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white "
                    placeholder="Phone"
                  />
                  <div className="relative">
                    <input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-3"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-4 top-11"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  <p className="mt-4 text-sm text-gray-600">
                    <Link
                      to={"/forgotPassword"}
                      className="text-success text-bold hover:underline"
                    >
                      Forgot Password
                    </Link>
                  </p>
                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-5 tracking-wide font-semibold bg-green-600 text-white w-full py-3 rounded-lg hover:bg-green-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                  >
                    <svg
                      className="w-6 h-6 -ml-2"
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
                    <span className="ml-4 text-lg">
                      {loading ? (
                        <div
                          className="spinner-border text-white"
                          role="status"
                        >
                          <span className="sr-only">Loading...</span>
                        </div>
                      ) : (
                        "Login"
                      )}
                    </span>
                  </button>
                  <p className="mt-4 text-sm text-center text-gray-600">
                    Don't have an account?{" "}
                    <Link
                      to={"/register"}
                      className="text-success font-semibold hover:underline text-lg ml-1"
                    >
                      Signup
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="flex-1 bg-green-100 text-center hidden lg:flex">
          <div className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat">
            <img src="https://readymadeui.com/signin-image.webp" alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
