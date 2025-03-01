
import React, { useEffect, useState, useContext } from 'react';
import { IoClose } from 'react-icons/io5';
import { UserContext } from '../UserContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ProfileIcon from "../../public/User_icon.webp";
import starGold from "../../public/starRating.png";
import starSilver from "../../public/startSilver.png";
import '../assets/Modal/Modal.css';
import { FaArrowRight } from 'react-icons/fa'; import { FaArrowLeft } from "react-icons/fa6";
import axios from 'axios';
const backend_API = import.meta.env.VITE_API_URL;

const OfferModal = ({ BannerUser, offerImage, closeModal, allBanners, initialBannerId }) => {
  const { user } = useContext(UserContext);

  const token = JSON.parse(localStorage.getItem('token'));

  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentOffer, setCurrentOffer] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false); // 🔥 Contact Now modal state

  console.log("Current Offer:", BannerUser);
  console.log("User Data:", currentOffer?.userId);
  console.log("Profile Pic:", currentOffer?.userId?.profilePic);
  useEffect(() => {
    if (allBanners?.length > 0 && initialBannerId) {
      const foundIndex = allBanners.findIndex(b => b._id === initialBannerId);
      setCurrentIndex(foundIndex !== -1 ? foundIndex : 0);
    }
  }, [initialBannerId, allBanners]); // Use initialBannerId to find the correct banner

  useEffect(() => {
    if (allBanners?.length > 0) {
      setCurrentOffer(allBanners[currentIndex]);
    }
  }, [currentIndex, allBanners]);

  const navigateOffer = (direction) => {
    let newIndex = (currentIndex + direction + allBanners.length) % allBanners.length;
    setCurrentIndex(newIndex);
  };
  const handleContactNowClick = () => {
    setPopupVisible(true); // 🔥 Open Contact Now Modal
  };
  const handleClosePopup = () => {
    setPopupVisible(false); // 🔥 Close Contact Now Modal
  };

  const renderStars = (ratings = [], maxRating = 10) => {
    if (!ratings.length) return null; // Handle empty ratings

    const ratingValue = Array.isArray(currentOffer?.userId?.ratings)
      ? currentOffer?.userId?.ratings.reduce((acc, cur) => acc + cur.rating, 0) / currentOffer?.userId?.ratings.length
      : 0;



    return [...Array(maxRating)].map((_, i) => (
      <img
        key={i}
        src={i < ratingValue ? starGold : starSilver}
        alt={i < ratingValue ? 'Filled Star' : 'Empty Star'}
        width={15}
      />
    ));
  };


  const sendRequest = async (userId) => {
    console.log(user, "user");
    if (!user) {
      toast.error("Please login first");
      navigate('/login')
      return;
    }
    if (currentOffer?.userId?.userstatus === 'unavailable') {
      toast.error("User is unavailable");
      return;
    }
    try {
      const response = await axios.post(`${backend_API}/request/sentRequest`, { receiverId: userId }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      console.log(response, "banner");
      if (response.status === 200) {
        toast("Request Sent Successfully!");
        navigate('/work')
        setLoading(false);

      } else {
        toast.error(error?.response?.data?.message);
      }
    } catch (error) {
      console.log('Error sending request:', error.response?.data || error);
      toast.error(error?.response?.data?.message || 'error in sending request');
    } finally {
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-wrapper">
        <div className="modal fade show" tabIndex="-1" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">View Offer</h5>
                <button type="button" className="btn-close p-3" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                {currentOffer ? (
                  <div className="offer-details bg-white rounded-lg shadow-md p-4 flex flex-col sm:flex-row items-center sm:items-start gap-4">
                    {/* Left - Banner Image (col-6) */}
                    <div className="w-full sm:w-1/2 aspect-square rounded-lg overflow-hidden">
                      <img
                        src={currentOffer.imageUrl}
                        className="w-full h-full object-cover"
                        alt="Banner"
                      />

                    </div>

                    {/* Right - User Details (col-6) */}
                    <div className="w-full sm:w-1/2 flex flex-col items-center sm:items-start text-center sm:text-left">
                      {/* Profile Image */}
                      <div className="w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] rounded-full overflow-hidden border border-gray-300">
                        <img
                          src={currentOffer?.userId?.profilePic || ProfileIcon}
                          className="w-full h-full object-cover"
                          alt="User"
                        />
                      </div>

                      {/* User Details */}
                      <div className='flex flex-col items-center sm:items-start text-center sm:text-left '>
                        <h5 className="text-lg font-semibold text-gray-800 mt-2">{currentOffer.userId?.name}</h5>
                        <p className="text-sm text-gray-600">{currentOffer.userId?.email}</p>
                        <p className="text-sm text-gray-500">{currentOffer.userId?.businessCategory}</p>
                        <div className='py-2 flex flex-col items-center sm:items-start'>
                          <strong className='text-sm'>Provider</strong>
                          <div>
                            {currentOffer?.userId?.ratings?.length > 0 ? (
                              <div className='flex items-center'>
                                {renderStars(currentOffer?.userId?.ratings, 10)}
                                <span className="pl-2 text-sm text-gray-700">


                                  {((currentOffer?.userId?.ratings?.reduce((acc, r) => acc + r.rating, 0) / currentOffer?.userId?.ratings?.length).toFixed(1))}
                                </span>
                              </div>

                            ) : null}

                          </div>
                        </div>
                      </div>
                    </div>
                  </div>



                ) : (
                  <p>Loading user data...</p>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={() => navigateOffer(-1)}>
                  <FaArrowLeft />
                </button>
                <button className="btn btn-primary" onClick={() => navigateOffer(1)}><FaArrowRight /></button>
                <button className="btn btn-primary" onClick={handleContactNowClick}>Contact Now</button>
              </div>
            </div>

          </div>
        </div>
        {/* 🔥 Contact Now Modal (Inside OfferModal) */}
        {popupVisible && (
          <div className=''>
            <div className="contact-form-modal">
              <div className="modal-content shadow-lg bg-white p-3">
                <div className="modal-header flex justify-between items-center border-b pb-2">
                  <h5 className="modal-title text-lg font-semibold">Send Request</h5>
                  <button
                    type="button"
                    className="close-btn py-1 px-2 rounded-lg"
                    onClick={handleClosePopup}
                  >
                    <IoClose size={24} />
                  </button>
                </div>
                <div className="modal-body p-4">
                  <form>
                    <textarea
                      id="serviceRequest"
                      className="form-control w-100 mb-3"
                      placeholder="Enter your service request details..."
                      required
                    >I Need Your Service !</textarea>
                    <div className="text-right">
                      <button type="button" className="btn btn-secondary me-2" onClick={handleClosePopup}>
                        Cancel
                      </button>
                      <button type="button" className="btn bg-green text-white" onClick={() => sendRequest(currentOffer.userId._id)}>
                        Send Request
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div >
  );
};
export default OfferModal;

