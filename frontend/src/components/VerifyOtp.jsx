import axios from 'axios';
import React, { useContext, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import logo from "../../public/ees-logo.png"
import { UserContext } from '../UserContext';
import { FCMContext } from '../context/FCMContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Font Awesome icons for show/hide

const backend_API = import.meta.env.VITE_API_URL;

console.log(backend_API);

const VerifyOtp = () => {
  const { user } = useContext(UserContext);
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("token");
  if (user) {
    // Redirect to a protected page if already logged in
    return <Navigate to="/" />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code || !email) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true)
    try {
      const response = await axios.post(`${backend_API}/auth/verify-code`, {
        email,
        code,

      })
      // console.log( response.data.message ,"Login Successful");
      console.log(response.data.message, "Login response");
      if (response.status === 200) {
        navigate("/resetPassword")
        toast(response.data.message)
        console.log(response.data.message, "Login Successful...");
      }
    } catch (error) {
      console.log(error, 'forgot error')
      toast(error?.response?.data?.message)
      console.log(error?.response?.data?.message, "fetch error");
    } finally {
      setLoading(false)
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="  text-gray-900 flex justify-center">
          <div className=" sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
            <div className="lg:w-1/2 xl:w-6/12 p-6 sm:p-12">
              <div className="flex flex-col items-center">
                <div className="w-full flex-1 mt-8">
                  <div className="flex flex-col items-center">
                    <div className='mb-12'>
                      <img src={logo} width={100} />
                    </div>
                    {/* <button className="w-full max-w-xs font-bold shadow-sm rounded-lg py-3 bg-green-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline">
                    <div className="bg-white p-2 rounded-full">
                      <svg className="w-4" viewBox="0 0 533.5 544.3">
                        <path d="M533.5 278.4c0-18.5-1.5-37.1-4.7-55.3H272.1v104.8h147c-6.1 33.8-25.7 63.7-54.4 82.7v68h87.7c51.5-47.4 81.1-117.4 81.1-200.2z" fill="#4285f4" />
                        <path d="M272.1 544.3c73.4 0 135.3-24.1 180.4-65.7l-87.7-68c-24.4 16.6-55.9 26-92.6 26-71 0-131.2-47.9-152.8-112.3H28.9v70.1c46.2 91.9 140.3 149.9 243.2 149.9z" fill="#34a853" />
                        <path d="M119.3 324.3c-11.4-33.8-11.4-70.4 0-104.2V150H28.9c-38.6 76.9-38.6 167.5 0 244.4l90.4-70.1z" fill="#fbbc04" />
                        <path d="M272.1 107.7c38.8-.6 76.3 14 104.4 40.8l77.7-77.7C405 24.6 339.7-.8 272.1 0 169.2 0 75.1 58 28.9 150l90.4 70.1c21.5-64.5 81.8-112.4 152.8-112.4z" fill="#ea4335" />
                      </svg>
                    </div>
                    <span className="ml-4">
                      Sign In with Google
                    </span>
                  </button> */}
                  </div>
                  {/* <div className="my-12 border-b text-center">
                  <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                    Or sign In with Cartesian E-mail
                  </div>
                </div> */}

                  <form action="" onSubmit={handleSubmit}>
                    <div className="mx-auto max-w-xs">
                      <h5 className='text-center pb-3'>Veryfy Otp</h5>

                      <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-3"
                        type='text'
                        placeholder="Email"
                      />


                      <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-3" placeholder="code" />

                      <button type='submit' disabled={loading} className="mt-5 tracking-wide font-semibold bg-green-600 text-white w-full py-4 rounded-lg hover:bg-green-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none">
                        <svg className="w-6 h-6 -ml-2" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                          <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                          <circle cx="8.5" cy={7} r={4} />
                          <path d="M20 8v6M23 11h-6" />
                        </svg>
                        <span className="ml-4">
                          {loading ?
                            <div className="spinner-border text-white" role="status">
                              <span className="sr-only">Loading...</span>
                            </div> : 'Verify'}
                       
                        </span>
                      </button>
                      {/* <p className="mt-4 text-sm text-center text-gray-600">
                        Don't have an account? <Link to={'/register'} className="text-success text-bold hover:underline">Sign up </Link>
                      </p>
                       */}
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="flex-1 bg-green-100 text-center hidden lg:flex">
              <div className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat" >
                <img src="https://readymadeui.com/signin-image.webp" alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
