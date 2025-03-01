import React, { memo, useContext, useRef, useState, useEffect } from "react";
import axios from "axios";
import AdminNavbar from "../admincomponents/AdminNavbar";
import UserSideBar from "../components/UserSideBar";
import ProfileSidebar from "../components/ProfileSidebar";
import Footer from "../components/Footer";
import { UserContext } from "../UserContext";
import { toast } from "react-toastify";
import Webcam from "react-webcam";

const backend_API = import.meta.env.VITE_API_URL;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const WithdrawalModal = ({ onClose, onSubmit }) => {
  const token = localStorage.getItem("token");
  const [step, setStep] = useState(1);
  const [selectedAmount, setSelectedAmount] = useState("");
  const [upiId, setUpiId] = useState("");
  const [bankDetails, setBankDetails] = useState({
    bankAccountNumber: "",
    ifscCode: "",
    accountHolderName: "", // New field
  });
  const [amount, setAmount] = useState(0);
  const [isWebcamOpen, setIsWebcamOpen] = useState(false);
  const [webcamMode, setWebcamMode] = useState(null);
  const [files, setFiles] = useState({
    bankProof: null,
    panFront: null,
    panBack: null,
  });

  const webcamRef = useRef(null);
  const presetAmounts = [121, 200, 300, 400, 500];

  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];

    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        // 2MB limit
        toast.error("File size should not exceed 2MB.");
        return;
      }

      const blobURL = URL.createObjectURL(file);
      setFiles((prev) => ({ ...prev, [type]: file }));
    }
  };

  const openWebcam = (mode) => {
    setWebcamMode(mode);
    setIsWebcamOpen(true);
  };

  const captureWebcamImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      fetch(imageSrc)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], `${webcamMode}.jpeg`, {
            type: "image/jpeg",
          });
          if (file.size > MAX_FILE_SIZE) {
            toast.error("Captured image is too large. Please try again.");
            return;
          }

          setFiles((prev) => ({ ...prev, [webcamMode]: file }));
          setIsWebcamOpen(false);
        });
    }
  };

  const handleNext = () => {
    if (step === 1) {
      if (!upiId && (!bankDetails.bankAccountNumber || !bankDetails.ifscCode)) {
        toast.error("Please provide either UPI ID or complete bank details.");
        return;
      }
    } else if (step === 2) {
      const finalAmount = selectedAmount
        ? parseInt(selectedAmount, 10)
        : selectedAmount;
      if (finalAmount < 120) {
        toast.error("Minimum withdrawal amount is ₹120");
        return;
      }
      setAmount(finalAmount);
    }
    setStep(step + 1);
  };

  const handleSubmit = async () => {
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(bankDetails.ifscCode)) {
      toast.error("Invalid IFSC code. It must be 11 characters long.");
    }

    if (!files.bankProof || !files.panFront || !files.panBack) {
      toast.error("Please upload or capture all required documents.");
      return;
    }

    const formData = new FormData();
    formData.append("bankProof", files.bankProof);
    formData.append("panCardfront", files.panFront);
    formData.append("panCardback", files.panBack);
    formData.append("upiId", upiId || "");
    formData.append("bankAccountNumber", bankDetails.bankAccountNumber || "");
    formData.append("accountHolderName", bankDetails.accountHolderName || "");
    formData.append("ifscCode", bankDetails.ifscCode || "");
    formData.append("amount", amount);

    try {
      const response = await axios.post(
        `${backend_API}/withdrawal/request`,
        formData,
        {
          withCredentials: true, // Important: send cookies with the request
        }
      );

      console.log(response, "response of withdrawe request");
      if (response.status === 200) {
        toast.success("Withdrawal request submitted successfully!");
        onSubmit(payload);
        onClose();
      } else {
        toast.error(response.message || "Failed to submit request");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-5 ">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-4 relative lg:mt-20">
        <div className="max-h-[50vh] lg:max-h-[60vh] overflow-y-auto p-2">
          <button
            className="absolute top-2 right-4 bg-gray-200 hover:bg-gray-300 text-black rounded-full w-8 h-8 flex items-center justify-center"
            onClick={onClose}
          >
            ✕
          </button>

          <h2 className="text-xl font-semibold mb-4">
            {step === 1
              ? "Enter Payment Details"
              : step === 2
              ? "Select Withdrawal Amount"
              : "Upload Documents"}
          </h2>

          {step === 1 && (
            <div>
              <label className="block mb-2">
                <input
                  type="radio"
                  checked={!!upiId}
                  onChange={() => setUpiId("")}
                />{" "}
                Use UPI
              </label>
              <input
                type="text"
                className="w-full border p-2 mb-4"
                placeholder="Enter UPI ID"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
              />

              <label className="block mb-2">
                <input
                  type="radio"
                  checked={!upiId}
                  onChange={() => setUpiId(null)}
                />{" "}
                Use Bank Details
              </label>
              {!upiId && (
                <>
                  <input
                    type="text"
                    className="w-full border p-2 mb-2"
                    placeholder="Account Number"
                    value={bankDetails.bankAccountNumber}
                    onChange={(e) =>
                      setBankDetails({
                        ...bankDetails,
                        bankAccountNumber: e.target.value,
                      })
                    }
                  />
                  <input
                    type="text"
                    className="w-full border p-2 mb-2"
                    placeholder="IFSC Code"
                    value={bankDetails.ifscCode}
                    onChange={(e) =>
                      setBankDetails({
                        ...bankDetails,
                        ifscCode: e.target.value,
                      })
                    }
                  />
                  <input
                    type="text"
                    className="w-full border p-2 mb-2"
                    placeholder="Account Holder Name"
                    value={bankDetails.accountHolderName}
                    onChange={(e) =>
                      setBankDetails({
                        ...bankDetails,
                        accountHolderName: e.target.value,
                      })
                    }
                  />
                </>
              )}
            </div>
          )}

          {step === 2 && (
            <div>
              <div className="grid grid-cols-3 gap-2">
                {presetAmounts.map((amt) => (
                  <button
                    key={amt}
                    className={`px-4 py-2 rounded-md border ${
                      selectedAmount === amt
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200"
                    }`}
                    onClick={() => setSelectedAmount(amt)}
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>
              <input
                type="number"
                value={selectedAmount}
                onChange={(e) => setSelectedAmount(e.target.value)}
                className="border rounded-md p-2 mt-3 w-full"
              />
            </div>
          )}

          {step === 3 && (
            <div>
              {/* Bank Proof - Capture or Upload */}
              <button
                className="w-full p-2 bg-blue-600 text-white mb-2"
                onClick={() => openWebcam("bankProof")}
              >
                Capture Bank Proof
              </button>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, "bankProof")}
                className="w-full border p-2 mb-2"
              />
              {files.bankProof && (
                <img
                  src={URL.createObjectURL(files.bankProof)}
                  alt="Bank Proof"
                  className="w-20 h-20 mt-2 rounded-md"
                />
              )}

              {/* PAN Front - Capture or Upload */}
              <button
                className="w-full p-2 bg-blue-600 text-white mb-2"
                onClick={() => openWebcam("panFront")}
              >
                Capture PAN Front
              </button>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, "panFront")}
                className="w-full border p-2 mb-2"
              />
              {files.panFront && (
                <img
                  src={URL.createObjectURL(files.panFront)}
                  alt="PAN Front"
                  className="w-20 h-20 mt-2 rounded-md"
                />
              )}

              {/* PAN Back - Capture or Upload */}
              <button
                className="w-full p-2 bg-blue-600 text-white mb-2"
                onClick={() => openWebcam("panBack")}
              >
                Capture PAN Back
              </button>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, "panBack")}
                className="w-full border p-2 mb-2"
              />
              {files.panBack && (
                <img
                  src={URL.createObjectURL(files.panBack)}
                  alt="PAN Back"
                  className="w-20 h-20 mt-2 rounded-md"
                />
              )}
            </div>
          )}

          {isWebcamOpen && (
            <div className="mt-4">
              <Webcam
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="w-full h-48"
              />
              <button
                className="w-full p-2 bg-green-600 text-white mt-2"
                onClick={captureWebcamImage}
              >
                Capture Image
              </button>
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
            {step < 3 ? (
              <button
                className="p-2 bg-blue-600 text-white rounded"
                onClick={handleNext}
              >
                Next
              </button>
            ) : (
              <button
                className="p-2 bg-green-600 text-white rounded"
                onClick={handleSubmit}
              >
                Submit Request
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Wallete = () => {
  const { user } = useContext(UserContext);
  console.log(user, "user");
  const [walletBalance, setWalletBalance] = useState(0);
  const [earningsHistory, setEarningsHistory] = useState([]);
  const [earnings, setEarnings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchWalletData = async () => {
      if (!user?._id) {
        setError("User is not authenticated");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${backend_API}/referal/getUserWalletBalance/${user._id}`
        );
        console.log(response.data, "wallete");
        setWalletBalance(response.data.walletBalance);
        setEarningsHistory(response.data.earningsHistory || []);
      } catch (error) {
        setError(
          error?.response?.data?.message || "Error fetching wallet balance"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, [user?._id]);

  const handleWithdraw = () => {
    if (user?.ekyc?.status === "pending") {
      toast.warning("Your KYC details are waiting for admin's approval.");
      return;
    }

    if (user?.ekyc?.status !== "approved") {
      toast.error("Your KYC is not approved yet. Please complete your KYC.");
      return;
    }

    if (walletBalance < 120) {
      toast.warning("Minimum withdrawal amount is ₹120");
      return;
    }

    setIsModalOpen(true); // Open modal only if KYC is approved
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchEarnings = async () => {
      if (!user?._id) return;

      try {
        setLoading(true);
        const response = await axios.get(
          `${backend_API}/referal/earnings/${user._id}`,
          { signal: controller.signal }
        );

        if (isMounted && response.status === 200) {
          setEarnings(response.data.earnings);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          console.error("[ERROR] Failed to fetch earnings:", err);
          if (!axios.isCancel(err)) {
            setError(err.response?.data?.message || "Failed to fetch earnings");
            toast.error("Error loading earnings data.");
          }
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchEarnings();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [user?._id]);

  return (
    <>
      {/* Navigation */}
      <AdminNavbar />
      <UserSideBar />
      <ProfileSidebar />

      {/* Main Section */}
      <div className="mt-40">
        <div className="container">
          <section className="">
            <div className="row">
              <div className="wallete px-0">
                {/* Wallet Overview */}
                <div className="w-full flex flex-col items-center justify-center p-6 my-5 bg-red-100 rounded-lg shadow-md">
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="spinner-border text-danger" role="status">
                        <span className="sr-only">Loading...</span>
                      </div>
                    </div>
                  ) : error ? (
                    <div className="w-full text-center p-3 bg-red-200 text-red-800 rounded-lg">
                      {error}
                    </div>
                  ) : (
                    <>
                      {/* Withdraw Button */}
                      <div className="w-full flex justify-end mb-4">
                        <button
                          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md disabled:bg-gray-400"
                          onClick={handleWithdraw}
                        >
                          {loading
                            ? "Loading..."
                            : `Withdraw ₹${
                                walletBalance >= 120 ? walletBalance : 0
                              }`}
                        </button>
                      </div>

                      {isModalOpen && (
                        <WithdrawalModal
                          onClose={() => setIsModalOpen(false)}
                          onSubmit={(data) => {
                            console.log("Withdrawal Request Data:", data);
                            setIsModalOpen(false);
                            toast.success("Withdrawal request submitted!");
                          }}
                        />
                      )}

                      {/* Wallet Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                        {/* Wallet Balance Card */}
                        <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center justify-center">
                          <span className="text-lg font-medium">
                            Total Wallet Balance
                          </span>
                          {loading ? (
                            <div className="animate-spin h-6 w-6 border-t-4 border-blue-500 rounded-full mt-2"></div>
                          ) : (
                            <h3 className="text-3xl font-bold text-blue-600">
                              ₹{walletBalance || 0}
                            </h3>
                          )}
                        </div>

                        {/* Total Earnings Card */}
                        <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center justify-center">
                          <span className="text-lg font-medium">
                            Total Earnings
                          </span>
                          {loading ? (
                            <div className="animate-spin h-6 w-6 border-t-4 border-green-500 rounded-full mt-2"></div>
                          ) : (
                            <h3 className="text-3xl font-bold text-green-600">
                              ₹{earnings || 0}
                            </h3>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default memo(Wallete);
