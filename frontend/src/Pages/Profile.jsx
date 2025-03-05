import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { PiShoppingBagLight } from "react-icons/pi";
import { FaStar } from "react-icons/fa";
import UserSideBar from "../components/UserSideBar";
import AdminNavbar from "../admincomponents/AdminNavbar";
import BannerAdd from "../components/ProfileBanner/BannerAdd";
import AllBannners from "../components/ProfileBanner/AllBannners";
import { UserContext } from "../UserContext";
import ProfileSidebar from "../components/ProfileSidebar";
import GetUserRating from "../components/Profile/GetUserRating";
import CurrentLocation from "../components/Profile/CurrentLocation";
import UpdateProfilePic from "../components/Profile/UpdateProfilePic";
import { toast } from "react-toastify";
import Footer from "../components/Footer";
import starGold from "../../public/starRating.png";
import starSilver from "../../public/startSilver.png";
import { BsClipboardCheckFill, BsClipboardCheck } from "react-icons/bs";
import { FaShare } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import axios from "axios";

const backend_API = import.meta.env.VITE_API_URL;

const KYCModal = ({ onClose, onSubmit }) => {
  const [step, setStep] = useState(1);

  const [bankDetails, setBankDetails] = useState({
    bankAccountNumber: "",
    ifscCode: "",
    accountHolderName: "",
  });
  const [files, setFiles] = useState({
    bankProof: null,
    panCardfront: null,
    panCardback: null,
    frontAadhar: null,
    backAadhar: null,
  });
  const [previews, setPreviews] = useState({
    bankProof: null,
    panCardfront: null,
    panCardback: null,
    frontAadhar: null,
    backAadhar: null,
  });

  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File size should not exceed 2MB.");
        return;
      }

      setFiles((prev) => ({ ...prev, [type]: file }));
      setPreviews((prev) => ({ ...prev, [type]: URL.createObjectURL(file) }));
    }
  };

  const uploadFields = [
    { name: "Bank Proof", field: "bankProof" },
    { name: "PAN Front", field: "panCardfront" },
    { name: "PAN Back", field: "panCardback" },
    { name: "Aadhar Front", field: "frontAadhar" },
    { name: "Aadhar Back", field: "backAadhar" },
  ];

  const handleSubmit = async () => {
    if (
      !files.bankProof ||
      !files.panCardfront ||
      !files.panCardback ||
      !files.frontAadhar ||
      !files.backAadhar
    ) {
      toast.error("Please upload all required documents.");
      return;
    }
    const formData = new FormData();
    formData.append("bankProof", files.bankProof);
    formData.append("panCardfront", files.panCardfront);
    formData.append("panCardback", files.panCardback);
    formData.append("frontAadhar", files.frontAadhar);
    formData.append("backAadhar", files.backAadhar);
    formData.append("bankAccountNumber", bankDetails.bankAccountNumber);
    formData.append("accountHolderName", bankDetails.accountHolderName);
    formData.append("ifscCode", bankDetails.ifscCode);

    try {
      const response = await axios.post(
        `${backend_API}/withdrawal/addkyc`,
        formData,
        {
          withCredentials: true,
        }
      );
      console.log(response.data, "response.data");
      if (response.status === 201) {
        toast.success("KYC details submitted successfully!");
        onSubmit();
        onClose();
        window.location.reload();
      } else {
        toast.error("Submission failed. Try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong!");
    }
  };

  const confirmSubmit = () => {
    toast.dismiss(); // Close the confirmation toast
    handleSubmit(); // Proceed with submission
  };

  const handleConfirmSubmit = () => {
    toast.info(
      <div>
        <p>Are you sure you want to submit?</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
          <button
            onClick={confirmSubmit}
            style={{
              color: "green",
              border: "none",
              background: "transparent",
              cursor: "pointer",
            }}
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss()}
            style={{
              color: "red",
              border: "none",
              background: "transparent",
              cursor: "pointer",
            }}
          >
            No
          </button>
        </div>
      </div>,
      { autoClose: false }
    );
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-5 z-50">
      <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6 relative">
        <button
          className="absolute top-2 right-4 bg-gray-200 hover:bg-gray-300 rounded-full p-2"
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="text-xl font-semibold mb-4">
          {step === 1 ? "Enter Bank Details" : "Upload Documents"}
        </h2>

        {step === 1 && (
          <div className="space-y-4">
            <label className="block text-gray-700 font-medium">
              Account Holder Name
              <input
                type="text"
                value={bankDetails.accountHolderName}
                onChange={(e) =>
                  setBankDetails({
                    ...bankDetails,
                    accountHolderName: e.target.value,
                  })
                }
                className="w-full p-2 border rounded mt-1"
              />
            </label>
            <label className="block text-gray-700 font-medium">
              Bank Account Number
              <input
                type="text"
                value={bankDetails.bankAccountNumber}
                onChange={(e) =>
                  setBankDetails({
                    ...bankDetails,
                    bankAccountNumber: e.target.value,
                  })
                }
                className="w-full p-2 border rounded mt-1"
              />
            </label>
            <label className="block text-gray-700 font-medium">
              IFSC Code
              <input
                type="text"
                value={bankDetails.ifscCode}
                onChange={(e) =>
                  setBankDetails({ ...bankDetails, ifscCode: e.target.value })
                }
                className="w-full p-2 border rounded mt-1"
              />
            </label>
          </div>
        )}

        {step === 2 && (
          <div className="grid grid-cols-2 gap-4">
            {uploadFields.map(({ name, field }) => (
              <label key={field} className="block text-gray-700 font-medium ">
                {name}
                <div className="mt-1 w-full border-2 border-dashed border-gray-300 p-4 rounded-lg flex flex-col items-center cursor-pointer hover:border-blue-500 transition relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, field)}
                    className="hidden"
                    id={field}
                  />
                  <label
                    htmlFor={field}
                    className="flex flex-col items-center text-gray-500 cursor-pointer"
                  >
                    {previews[field] ? (
                      <img
                        src={previews[field]}
                        alt={name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    ) : (
                      <>
                        <FaPlus className="text-2xl mb-2 text-gray-400" />
                        <span className="text-sm">Click to upload</span>
                      </>
                    )}
                  </label>
                </div>
              </label>
            ))}
          </div>
        )}

        <div className="flex justify-between mt-4">
          {step > 1 && (
            <button
              className="p-2 bg-gray-400 rounded"
              onClick={() => setStep(step - 1)}
            >
              Back
            </button>
          )}
          {step < 2 ? (
            <button
              className="p-2 bg-blue-600 text-white rounded"
              onClick={() => setStep(step + 1)}
            >
              Next
            </button>
          ) : (
            <button
              className="p-2 bg-green-600 text-white rounded"
              onClick={handleConfirmSubmit}
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const Profile = () => {
  const { user } = useContext(UserContext);
  console.log(user, "user---------------------------------");

  const [linkCopied, setLinkCopied] = useState(false);
  const location = useLocation();
  const [isKYCModalOpen, setIsKYCModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();

  const referralLink = `${window.location.origin}/register?referralCode=${user?._id}`;

  useEffect(() => {
    if (location.hash === "#kyc-section") {
      const section = document.getElementById("kyc-section");
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const renderStar = (ratings = [], maxRating = 10) => {
    const ratingValue =
      ratings.length > 0
        ? ratings.reduce((acc, cur) => acc + cur, 0) / ratings.length
        : 0;
    const stars = [];
    for (let i = 1; i <= maxRating; i++) {
      stars.push(
        <img
          key={i}
          src={i <= ratingValue ? starGold : starSilver}
          alt={i <= ratingValue ? "Filled Star" : "Empty Star"}
          width={15}
        />
      );
    }
    return stars;
  };
  const renderStars = (ratings = [], maxRating = 10) => {
    const ratingValue =
      ratings.length > 0
        ? ratings.reduce((acc, cur) => acc + cur, 0) / ratings.length
        : 0;
    const stars = [];
    for (let i = 1; i <= maxRating; i++) {
      stars.push(
        <img
          key={i}
          src={i <= ratingValue ? starGold : starSilver}
          alt={i <= ratingValue ? "Filled Star" : "Empty Star"}
          width={15}
        />
      );
    }
    return stars;
  };

  return (
    <>
      <AdminNavbar />
      <UserSideBar />
      <ProfileSidebar />
      <div className="my-24">
        <section className="">
          <div className="container">
            <div className="row">
              <div className="w-full bg-white p-6 rounded-lg shadow-md">
                {/* Banner with Profile Pic */}
                <div className="relative w-full">
                  <img
                    className="w-full h-[200px] object-cover rounded-md"
                    src="https://img.freepik.com/free-vector/colorful-watercolor-texture-background_1035-19319.jpg?ga=GA1.1.897959581.1731651336&semt=ais_hybrid"
                    alt="Banner"
                  />
                  <div className="absolute bottom-[-70px] right-14 w-[200px] h-[200px] rounded-full border-4 border-white ring-4 ring-orange-500 shadow-lg overflow-hidden">
                    <img
                      src={user.profilePic}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="px-3 md:px-5">
                  {/* Profile Details */}
                  <div className="mt-24 md:mt-8 text-left sm:text-left">
                    <h2 className="text-4xl font-bold text-gray-700">
                      {user?.name}
                    </h2>
                    {user?.profilePic ? null : (
                      <p className="text-orange text-sm">
                        You haven't set a profile picture yet.
                      </p>
                    )}

                    {/* Ratings Section */}
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <strong className="text-sm">User Rating:</strong>
                        {user?.userRatings && (
                          <div className="flex items-center">
                            {renderStars(
                              user?.userRatings.map((r) => r.rating),
                              10
                            )}
                            <span className="pl-2">
                              {user?.userAverageRating}.0
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <strong className="text-sm">Provider Rating:</strong>
                        {user?.providerRatings && (
                          <div className="flex items-center">
                            {renderStar(
                              user?.providerRatings.map((r) => r.rating),
                              10
                            )}
                            <span className="pl-2">
                              {user?.providerAverageRating}.0
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="mt-4 text-gray-700 space-y-2">
                      <p>
                        <strong>Email:</strong> {user?.email}
                      </p>
                      <p>
                        <strong>Phone:</strong> +91{user?.phone}
                      </p>
                      <CurrentLocation user={user} />
                    </div>
                  </div>

                  {/* Referral Section */}
                  <div className="mt-6 bg-gray-100 p-4 rounded-md">
                    <p className="text-gray-600 font-medium">
                      Your Referral Link:
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-blue-600 font-medium truncate">
                        {referralLink}
                      </span>
                      <button
                        onClick={copyToClipboard}
                        className="text-gray-500 hover:text-blue-500"
                      >
                        {linkCopied ? (
                          <BsClipboardCheck size={20} />
                        ) : (
                          <BsClipboardCheckFill size={20} />
                        )}
                      </button>
                      <Link
                        to={`whatsapp://send?text=${referralLink}`}
                        className="text-white bg-orange text-sm p-2 rounded-md flex items-center"
                      >
                        <FaShare size={16} />
                      </Link>
                    </div>
                    {linkCopied && (
                      <p className="text-green-500 text-sm">Copied!</p>
                    )}
                  </div>

                  {/* KYC Section */}
                  <div
                    id="kyc-section"
                    className="mt-6 bg-gray-100 p-6 rounded-lg shadow-sm"
                  >
                    <h3 className="text-2xl font-semibold text-gray-700 mb-4">
                      KYC Details
                    </h3>

                    {user.ekyc ? (
                      <>
                        <div className="space-y-2 text-gray-700">
                          <p>
                            <strong>Account Holder Name:</strong>{" "}
                            {user.ekyc.accountHolderName}
                          </p>
                          <p>
                            <strong>Bank Account Number:</strong>{" "}
                            {user.ekyc.bankAccountNumber}
                          </p>
                          <p>
                            <strong>IFSC Code:</strong> {user.ekyc.ifscCode}
                          </p>
                          <p>
                            <strong>Amount:</strong> ₹{user.ekyc.amount}
                          </p>
                          <p>
                            <strong>Status:</strong>
                            <span
                              className={`ml-2 text-sm ${
                                user.ekyc.status === "pending"
                                  ? "text-gray-600"
                                  : "text-green-600"
                              }`}
                            >
                              {user.ekyc.status === "pending"
                                ? "Pending (Your KYC Details are waiting for admin's approval)"
                                : user.ekyc.status}
                            </span>
                          </p>
                        </div>

                        {/* KYC Images */}
                        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                          {[
                            { label: "Bank Proof", src: user.ekyc.bankProof },
                            {
                              label: "PAN Card (Front)",
                              src: user.ekyc.panCardfront,
                            },
                            {
                              label: "PAN Card (Back)",
                              src: user.ekyc.panCardback,
                            },
                          ].map((item, index) => (
                            <div
                              key={index}
                              className="flex flex-col items-center"
                            >
                              <img
                                src={item.src}
                                alt={item.label}
                                className="w-[200px] rounded-md shadow-sm cursor-pointer"
                                onClick={() => setSelectedImage(item.src)}
                              />
                              <p className="mt-2 text-md font-medium">
                                {item.label}
                              </p>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-gray-600">
                          KYC details not uploaded yet.
                        </p>
                        <button
                          onClick={() => setIsKYCModalOpen(true)}
                          className="mt-3 bg-orange text-white py-2 px-4 rounded-md font-semibold hover:bg-orange-600 transition"
                        >
                          Complete KYC
                        </button>
                      </div>
                    )}
                    {selectedImage && (
                      <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-75 z-50">
                        <div className="relative">
                          <button
                            className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full"
                            onClick={() => setSelectedImage(null)}
                          >
                            ✕
                          </button>
                          <img
                            src={selectedImage}
                            alt="Preview"
                            className="max-w-full max-h-[90vh] rounded-lg shadow-lg cursor-pointer"
                          />
                        </div>
                      </div>
                    )}
                    {/* Aadhaar Images */}
                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 text-center">
                      {[
                        { label: "Aadhaar Front", src: user?.frontAadhar },
                        { label: "Aadhaar Back", src: user?.backAadhar },
                      ].map((item, index) => (
                        <div key={index} className="flex flex-col items-center">
                          {item.src ? (
                            <>
                              <img
                                src={item.src}
                                alt={item.label}
                                className="w-[200px] rounded-md shadow-sm cursor-pointer"
                                onClick={() => setSelectedImage(item.src)}
                              />
                              <p className="mt-2 text-md font-medium">
                                {item.label}
                              </p>
                            </>
                          ) : (
                            <p className="text-gray-600">
                              No {item.label} uploaded
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {isKYCModalOpen && (
                    <KYCModal
                      onClose={() => setIsKYCModalOpen(false)}
                      onSubmit={() => {
                        setIsKYCModalOpen(false);
                      }}
                    />
                  )}

                  {/* Aadhaar Section */}

                  {/* Additional Info */}
                  <div className="mt-4">
                    {user?.userId && (
                      <p className="text-gray-600 font-medium">
                        Unique ID:{" "}
                        <span className="text-gray-800 font-semibold">
                          EES121-{user?.userId}
                        </span>
                      </p>
                    )}
                    <p className="text-gray-600 font-medium">
                      Business Category:{" "}
                      <span className="text-gray-800 font-semibold">
                        {user?.businessCategory}
                      </span>
                    </p>
                    <p className="text-gray-600 font-medium">
                      Business Details:{" "}
                      <span className="text-gray-800 font-semibold">
                        {user?.businessDetaile}
                      </span>
                    </p>
                    <p className="text-gray-600 font-medium">
                      Business Address:{" "}
                      <span className="text-gray-800 font-semibold">
                        {user?.businessAddress}
                      </span>
                    </p>

                    <div className="py-3">
                      <span className="text-gray-600 font-medium">
                        Status:{" "}
                      </span>
                      <span
                        className={`font-semibold ${
                          user?.userstatus === "available"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {user?.userstatus}
                      </span>
                    </div>
                  </div>

                  {/* Edit Profile Button */}
                  <div className="mt-6 flex justify-center sm:justify-end">
                    <button
                      onClick={() => navigate(`/editprofile`, { state: user })}
                      className="bg-orange text-white py-2 px-4 rounded-full font-semibold uppercase text-sm"
                    >
                      Edit Profile
                    </button>
                  </div>

                  {/* Banner Ads */}
                  <div className="mt-6">
                    <BannerAdd />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <AllBannners />
      </div>
      <Footer />
    </>
  );
};

export default Profile;
{
  /* <div className="col-12">
    <div className="card rounded-md overflow-hidden border-0 bg-base-100 shadow-xl">
        <div className="w-full position-relative bg-orange flex items-center justify-center">
            <img
                className="h-[200px] w-full object-cover"
                src="https://img.freepik.com/free-vector/colorful-watercolor-texture-background_1035-19319.jpg?ga=GA1.1.897959581.1731651336&semt=ais_hybrid"
                alt="banner"
            />
            <div className="absolute bottom-[-80px] left-[70px] w-[200px] h-[200px] rounded-full border-4 border-white ring-4 ring-orange-500 shadow-lg overflow-hidden">
                <img
                    src={user.profilePic}
                    alt="profile"
                    className="w-full h-full object-cover"
                />


            </div>

        </div>

        <button onClick={() => navigate(`/editprofile`, { state: user })} className="text-orange py-3 rounded-full font-semibold uppercase text-sm">Edit Profile</button>
        <div>
            <div className="col-12 d-flex flex-wrap">
                <div className="col-12 p-5">
                    <div className="pt-5 text-orange">
                        {
                            !user.profilePic ? (
                                <p> You haven't set a profile picture yet.</p>

                            ) : (
                                <></>
                            )
                        }
                    </div>

                    <h2 className="text-3xl font-bold text-gray-700">{user?.name}</h2>
                    <div className=''>
                        <div className="rating rating-sm d-flex flex-column text-start">

                            <div className="flex items-center gap-2">
                                <strong className="text-sm">User :</strong>
                                {user?.userRatings && (
                                    <div className="flex items-center">
                                        {renderStars(user?.userRatings.map((r) => r.rating), 10)}
                                        <span className="pl-2">{user?.userAverageRating}.0</span>
                                    </div>
                                )}
                            </div>


                        </div>
                        <div className="flex items-center gap-2">
                            <strong className="text-sm">Provider :</strong>
                            {user?.providerRatings && (
                                <div className="flex items-center">
                                    {renderStar(user?.providerRatings.map((r) => r.rating), 10)}
                                    <span className="pl-2">{user?.providerAverageRating}.0</span>
                                </div>
                            )}
                        </div>

                    </div>
                    <h6 className='py-3'><span className='text-gray-600 font-medium'>Email :</span> <span className='text-gray-800 font-semibold'>{user?.email}</span></h6>
                    <p className='pb-3'> <span className='text-gray-600 font-medium'>Phone :</span> <span className='text-gray-800 font-semibold'>+91{user?.phone}</span></p>
                    <CurrentLocation user={user} />
                    <div className="flex">

                    </div>
                </div>
                <div className="col-12 d-flex justify-content-md-end justify-content-start">
                    <div className='p-5 w-full'>
                        <div className="">
                            <p className="text-gray-600 font-medium">Your Referral Link:</p>
                            <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 my-2 rounded-md w-full sm:w-auto">
                                <span className="text-blue-600 font-medium truncate">{referralLink}</span>

                                <button onClick={copyToClipboard} className="text-gray-500 hover:text-blue-500">
                                    {linkCopied ? <BsClipboardCheck size={20} /> : <BsClipboardCheckFill size={20} />}
                                </button>

                                <Link
                                    to={`whatsapp://send?text=${referralLink}`}
                                    className="text-white bg-orange text-sm p-2 rounded-md flex items-center"
                                >
                                    <FaShare size={16} />
                                </Link>
                            </div>

                            {linkCopied && <p className="text-green-500 text-sm">Copied!</p>}

                        </div>
                        {
                            user?.userId && (<div className='pt-3'>
                                <p className='text-gray-600 font-medium'>Unique Id : <span className="text-gray-800 font-semibold"> EES121-{user?.userId}</span></p>

                            </div>)
                        }


                        <p className='text-gray py-3'>
                            <span className='text-gray-600 font-medium'>Business Category : </span>
                            <span className='text-gray-800 font-semibold'>
                                {user?.businessCategory}
                            </span>

                        </p>

                        <div className="my-1">
                            <label className="block text-md font-medium p-2 text-bold">Aadhaar Front</label>
                            {user?.frontAadhar ? (
                                <img src={user?.frontAadhar} alt="Aadhaar Front" className="mt-2" style={{ width: "200px" }} />
                            ) : (
                                <p>No Aadhaar Front uploaded</p>
                            )}
                        </div>

                        <div className="my-1">
                            <label className="block text-md font-medium p-2 text-bold">Aadhaar Back</label>
                            {user?.backAadhar ? (
                                <img src={user?.backAadhar} alt="Aadhaar Back" className="mt-2" style={{ width: "200px" }} />
                            ) : (
                                <p>No Aadhaar Back uploaded</p>
                            )}
                        </div>


                        <div className='pt-4'>
                            <BannerAdd />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div> */
}
