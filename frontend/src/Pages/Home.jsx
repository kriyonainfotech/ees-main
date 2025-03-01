import React, { useContext, useEffect, useState, useMemo } from "react";
import Card from "../components/Profile/Card";
import ServieceCategories from "../components/ServieceCategories";
import Benner from "../components/Benner";
import AdminNavbar from "../admincomponents/AdminNavbar";
import UserSideBar from "../components/UserSideBar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getFcmToken, messaging } from "../Firebaseconfig";
import { onMessage } from "firebase/messaging";
import ProfileSidebar from "../components/ProfileSidebar";
import { UserContext } from "../UserContext";
import Footer from "../components/Footer";
import "../assets/Veryfymodal.css";
import { toast } from "react-toastify";
import { FCMContext } from "../context/FCMContext";
import Banner from "../components/Benner";
import OneSignal from "react-onesignal";
import KYCReminderModal from "../components/KYCReminderModal";

const backend_API = import.meta.env.VITE_API_URL;
const KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;
const KEY_SECRET = import.meta.env.VITE_RAZORPAY_KEY_SECRET;

// console.log(KEY_ID, KEY_SECRET);

const DEFAULT_PROFILE_PIC =
  "https://res.cloudinary.com/dcfm0aowt/image/upload/v1739604108/user/phnbhd4onynoetzdxqjp.jpg";

const Home = () => {
  const { user, setUser } = useContext(UserContext);
  console.log(user, "user");
  const { fcmToken } = useContext(FCMContext);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [bannerImage, setBannerImage] = useState([]);
  const [auth, setAuth] = useState(Boolean(user));
  const [showModal, setShowModal] = useState(user?.paymentVerified === false);
  const [showProfileUpdateModal, setShowProfileUpdateModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAadharUpdateModal, setShowAadharUpdateModal] = useState(false);
  const [showKYCModal, setShowKYCModal] = useState(false);

  useEffect(() => {
    if (
      user?.paymentVerified &&
      !user?.ekyc &&
      !localStorage.getItem("kyc_modal_shown")
    ) {
      setTimeout(() => setShowKYCModal(true), 500); // Show modal after 0.5s
    }
  }, [user]);

  const closeModal = () => {
    setShowKYCModal(false);
    localStorage.setItem("kyc_modal_shown", "true"); // Prevent reopening
  };

  // Fetch Categories and Banners
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${backend_API}/category/getAllCategory`
        );

        // Just set the categories directly - they should already be unique from backend
        setCategories(response.data.category);
      } catch (error) {
        console.error("[ERROR] Failed to fetch categories:", error);
        toast.error("Error fetching categories");
      }
    };

    fetchCategories();
  }, []);

  // Simplified grouping logic
  const groupedCategoriesAndBanners = useMemo(() => {
    if (!categories.length) return [];

    // Single group with all categories
    return [
      {
        categories: categories,
        BannerImage: bannerImage,
      },
    ];
  }, [categories, bannerImage]);

  // Handle Payment Verification
  const handlePaymentVerify = async (userId) => {
    setLoading(true);
    try {
      const orderResponse = await axios.post(
        `${backend_API}/payment/create-order`,
        {
          amount: "121",
          currency: "INR",
        }
      );

      if (orderResponse.data.success) {
        const order = orderResponse.data.data.order;
        const options = {
          key: KEY_ID,
          amount: order.amount,
          currency: order.currency,
          name: "Enjoy Enjoy Services",
          description: "Service Payment",
          order_id: order.id,
          handler: async (response) => {
            try {
              const verifyResponse = await axios.post(
                `${backend_API}/payment/verify-payment`,
                {
                  payment_id: response.razorpay_payment_id,
                  user_id: userId,
                }
              );

              if (verifyResponse.data.success) {
                toast.success("Payment verified successfully");
                setUser((prevUser) => ({ ...prevUser, paymentVerified: true }));
                setShowModal(false);
              } else {
                toast.error("Payment verification failed.");
              }
            } catch (error) {
              console.error("Error verifying payment:", error);
              toast.error("An error occurred during payment verification.");
            }
          },
        };

        const rzp1 = new Razorpay(options);
        rzp1.open();
      }
    } catch (error) {
      console.error("Error during payment process:", error);
      toast.error(error?.response?.data?.message || "Payment process failed");
    } finally {
      setLoading(false);
    }
  };

  // Handle Profile Picture Update
  const handleProfileUpdate = () => {
    navigate("/profile"); // Redirect user to profile update page
  };
  // Authentication State Management
  useEffect(() => {
    setAuth(Boolean(user));
    if (user?.paymentVerified === false) {
      setShowModal(true);
    }
  }, [user]);

  // Check Profile Picture and Show Popup if Default
  useEffect(() => {
    if (user?.profilePic === DEFAULT_PROFILE_PIC) {
      setShowProfileUpdateModal(true);
    } else {
      setShowProfileUpdateModal(false);
    }
  }, [user]);

  useEffect(() => {
    if (
      user?.frontAadhar === DEFAULT_PROFILE_PIC ||
      user?.backAadhar === DEFAULT_PROFILE_PIC
    ) {
      setShowAadharUpdateModal(true);
    } else {
      setShowAadharUpdateModal(false);
    }
  }, [user]);

  return (
    <>
      <AdminNavbar />
      <UserSideBar />
      <ProfileSidebar />

      {/* Payment Verification Modal */}
      {showModal && (
        <div className="modals">
          <div className="modal-contents text-center">
            <h5 className="py-3">Payment Verification</h5>
            <p className="pb-3">
              Your payment is not verified. Please complete the verification.
            </p>
            <button
              className="btn bg-green text-white"
              onClick={() => handlePaymentVerify(user._id)}
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify Payment"}
            </button>
          </div>
        </div>
      )}

      {/* Profile Picture Update Modal */}
      {showProfileUpdateModal && (
        <div className="modals">
          <div className="modal-contents text-left">
            <h5 className="pb-4 text-center">Update Profile Picture</h5>
            <p className="py-2">
              <span style={{ fontWeight: "bold" }}>Step 1:</span> Go to your{" "}
              <strong>Profile Page</strong> and click the{" "}
              <strong>Edit Profile</strong> button at end of Profile page.
            </p>
            <p className="py-3">
              <span style={{ fontWeight: "bold" }}>Step 2:</span> Select a new
              image by clicking on the profile picture, choose the image you
              want to upload, and click <strong>Save</strong> to update your
              profile picture.
            </p>
            <p>
              <em>Note:</em> You can only change your profile picture if the
              current one is the <span style={{ color: "gray" }}>default</span>{" "}
              image.
            </p>

            <div className="text-center">
              <button
                className="btn bg-blue text-white mt-3"
                onClick={handleProfileUpdate}
              >
                Update Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Aadhaar Update Modal */}
      {showAadharUpdateModal && (
        <div className="modals">
          <div className="modal-contents">
            <h5>Update Aadhaar Photos</h5>
            <p className="pt-3">
              Please upload your Aadhaar front and back photos to continue. To
              upload adhaar Click on Edit Profile button on Profile Page
            </p>
            <button
              className="btn bg-blue text-white mt-3"
              onClick={() => navigate("/profile")}
            >
              Upload Now
            </button>
          </div>
        </div>
      )}

      <div className="my-28">
        {auth && <Card />}
        <div className="container pt-4">
          <h4>Popular Offers</h4>
        </div>
        {showKYCModal && <KYCReminderModal onClose={closeModal} />}
        {/* Single render of categories */}
        {groupedCategoriesAndBanners.length > 0 && (
          <React.Fragment>
            <Banner BannerImage={bannerImage} setBannerImage={setBannerImage} />
            <ServieceCategories categories={categories} />
          </React.Fragment>
        )}
      </div>

      <Footer />
    </>
  );
};

export default Home;
