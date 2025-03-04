import React, { useState, useContext, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import { UserContext } from "../UserContext";
import { FCMContext } from "../../src/context/FCMContext";
import { toast } from "react-toastify";
import axios from "axios";
import { FiCamera } from "react-icons/fi";
import logo from "../../public/ees-logo.png";
import ProfileIcon from "../../public/User_icon.webp";

const backend_API = import.meta.env.VITE_API_URL;

const MAX_FILE_SIZE = 5 * 1024 * 1024; // **2MB file size limit**
// const MAX_FILE_SIZE = 50 * 1024; // 50KB
const RegisterAadhar = () => {
  const { user } = useContext(UserContext);
  const { fcmToken } = useContext(FCMContext);

  const [frontAadhar, setFrontAadhar] = useState(null);
  const [backAadhar, setBackAadhar] = useState(null);
  const [profilePic, setProfilePic] = useState(null);

  const [frontAadharPreview, setFrontAadharPreview] = useState(null);
  const [backAadharPreview, setBackAadharPreview] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(null);

  const [isWebcamOpen, setIsWebcamOpen] = useState(false);
  const [webcamMode, setWebcamMode] = useState(""); // Track which field (front/back/profile) is using the webcam
  const webcamRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const previousData = location.state || {};
  const navigate = useNavigate();

  const handleImageChange = (e, setImageState, setPreviewState) => {
    const file = e.target.files[0];

    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        toast.error("Captured image is too large. Please try again.");
        return;
      }

      const blobUrl = URL.createObjectURL(file);
      console.log(blobUrl);

      setImageState(file);
      setPreviewState(blobUrl);
    }
  };

  const toggleWebcam = (mode) => {
    setWebcamMode(mode);
    setIsWebcamOpen(!isWebcamOpen);
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
          console.log(file.size);
          if (webcamMode === "frontAadhar") {
            setFrontAadhar(file);
            setFrontAadharPreview(imageSrc);
          } else if (webcamMode === "backAadhar") {
            setBackAadhar(file);
            setBackAadharPreview(imageSrc);
          } else if (webcamMode === "profile") {
            setProfilePic(file);
            setProfilePicPreview(imageSrc);
          }
          if (webcamMode === "profile") {
            setProfilePic(file);
            setProfilePicPreview(imageSrc);
          }
          setIsWebcamOpen(false);
        });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!profilePic) {
        toast.error("Please upload your profile selfie");
        setLoading(false);
        return;
      }
      if (!frontAadhar || !backAadhar || !profilePic) {
        toast.error("Please upload all required documents");
        setLoading(false);
        return;
      }

      const formData = {
        name: previousData.name,
        email: previousData.email,
        phone: previousData.phone,
        password: previousData.password,
        confirmpassword: previousData.confirmpassword,
        address: JSON.stringify(previousData.address),
        businessCategory: previousData.businessCategory,
        businessName: previousData.businessName,
        businessAddress: previousData.businessAddress,
        businessDetaile: previousData.businessDetaile,
        referralCode: previousData.referralCode,
        fcmToken: fcmToken,
      };

      // Add files
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });

      formDataToSend.append("frontAadhar", frontAadhar);
      formDataToSend.append("backAadhar", backAadhar);
      formDataToSend.append("profilePic", profilePic);

      const response = await axios.post(
        `${backend_API}/auth/registerUserweb`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        toast.success(
          "Registration successful! Please wait for admin approval."
        );
        navigate("/login");
      }
    } catch (error) {
      console.error("Registration error:", error);

      if (error.response?.data) {
        const errorData = error.response.data;

        // Handle validation errors
        if (errorData.errors) {
          errorData.errors.forEach((err) => toast.error(err.msg));
          return;
        }

        // Handle specific error messages
        if (errorData.message) {
          switch (errorData.message) {
            case "Email already exists":
              toast.error(
                "This email is already registered. Please use a different email."
              );
              break;
            case "Phone number already exists":
              toast.error(
                "This phone number is already registered. Please use a different number."
              );
              break;
            case "Invalid file type":
              toast.error("Please upload valid image files only (JPG, PNG)");
              break;
            case "File too large":
              toast.error("File size too large. Please upload smaller images");
              break;
            default:
              toast.error(errorData.message);
          }
          return;
        }
      }

      // Handle network errors
      if (!error.response) {
        toast.error(
          "Network error. Please check your connection and try again"
        );
        return;
      }

      // Handle other errors
      toast.error("Registration failed. Please try again later");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="sm:m-10  sm:rounded-lg flex justify-center flex-1">
        <div className="text-gray-900 w-full flex justify-center">
          <div className="sm:m-10  w-full flex justify-center flex-1">
            <div className="lg:w-1/2 xl:w-6/12 p-6 sm:p-12">
              <div className="flex flex-col items-center">
                <div className="w-full flex-1">
                  <div className="flex flex-col items-center">
                    <div>
                      <img src={logo} width={100} alt="Logo" />
                    </div>
                  </div>
                  <div className="my-3 border-b text-center">
                    <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2"></div>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="mx-auto max-w-full">
                      <h4 className="py-4 text-center">Aadhaar KYC</h4>
                      <div className="d-flex " style={{ position: "relative" }}>
                        <div className="col-6 p-1">
                          <div className="">
                            <div
                              className="upload-box adhaar-front h-[100px] border rounded-2 d-flex justify-content-center align-items-center position-reletive"
                              onClick={() =>
                                document
                                  .getElementById("frontAadharInput")
                                  .click()
                              }
                            >
                              {frontAadharPreview ? (
                                <img
                                  src={frontAadharPreview}
                                  className="w-100 h-100 img-fluid"
                                  alt="Front Aadhaar"
                                />
                              ) : (
                                <h4>Front</h4>
                              )}
                            </div>

                            <input
                              type="file"
                              id="frontAadharInput"
                              accept="image/*"
                              onChange={(e) =>
                                handleImageChange(
                                  e,
                                  setFrontAadhar,
                                  setFrontAadharPreview
                                )
                              }
                              hidden
                            />
                            <button
                              type="button"
                              className="btn d-none d-md-flex bg-green text-white position-absolute  p-2 rounded-5 bottom-[-5%] left-[3%]"
                              onClick={() => toggleWebcam("frontAadhar")}
                            >
                              <FiCamera />
                            </button>
                            <div className="d-flex d-md-none">
                              <label
                                htmlFor="cameraInputt"
                                className="position-absolute top-[80%] start-[-5%] p-2 bg-green text-white rounded-full mx-2 cursor-pointer"
                              >
                                <FiCamera />
                              </label>
                              <input
                                type="file"
                                accept="image/*"
                                capture="camera"
                                name=""
                                id="cameraInputt"
                                onChange={(e) =>
                                  handleImageChange(
                                    e,
                                    setFrontAadhar,
                                    setFrontAadharPreview
                                  )
                                }
                                className="hidden"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-6 p-1">
                          <div className="" style={{ position: "relative" }}>
                            <div
                              className="upload-box adhaar-back h-[100px] border rounded-2 d-flex justify-content-center align-items-center position-reletive"
                              onClick={() =>
                                document
                                  .getElementById("backAadharInput")
                                  .click()
                              }
                            >
                              {backAadharPreview ? (
                                <img
                                  src={backAadharPreview}
                                  className="w-100 h-100 img-fluid"
                                  alt="Back Aadhaar"
                                />
                              ) : (
                                <h4>Back</h4>
                              )}
                            </div>
                            <input
                              type="file"
                              id="backAadharInput"
                              accept="image/*"
                              onChange={(e) =>
                                handleImageChange(
                                  e,
                                  setBackAadhar,
                                  setBackAadharPreview
                                )
                              }
                              hidden
                            />
                            <button
                              type="button"
                              className="btn d-none d-md-flex bg-green text-white position-absolute p-2 rounded-5 bottom-[-9%] left-[5%]"
                              onClick={() => toggleWebcam("backAadhar")}
                            >
                              <FiCamera />
                            </button>
                            <div className="d-flex d-md-none">
                              <label
                                htmlFor="cameraInputs"
                                className="position-absolute top-[80%] start-[-10%]   p-2 bg-green text-white rounded-full mx-2 cursor-pointer"
                              >
                                <FiCamera />
                              </label>
                              <input
                                type="file"
                                accept="image/*"
                                capture="camera"
                                id="cameraInputs"
                                onChange={(e) =>
                                  handleImageChange(
                                    e,
                                    setBackAadhar,
                                    setBackAadharPreview
                                  )
                                }
                                className="hidden"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-12 d-flex justify-content-center">
                        <div className=" py-3" style={{ position: "relative" }}>
                          <h5 className="py-4">Profile Selfie</h5>
                          <div
                            className="upload-box w-[150px] h-[150px] border rounded-full d-flex justify-content-center align-items-center"
                            onClick={() =>
                              document.getElementById("profilePicInput").click()
                            }
                          >
                            {profilePicPreview ? (
                              <img
                                src={profilePicPreview}
                                alt="Profile"
                                className="w-100 h-100 rounded-full img-fluid"
                              />
                            ) : (
                              <img
                                src={ProfileIcon}
                                alt="Profile"
                                className="w-100 h-100 img-fluid"
                              />
                            )}
                          </div>
                          <input
                            type="file"
                            id="profilePicInput"
                            accept="image/*"
                            onChange={(e) =>
                              handleImageChange(
                                e,
                                setProfilePic,
                                setProfilePicPreview
                              )
                            }
                            hidden
                          />
                          <button
                            type="button"
                            className="btn  bg-green p-2 text-white rounded-5 position-absolute bottom-[10%]"
                            onClick={() => toggleWebcam("profile")}
                          >
                            <FiCamera />
                          </button>
                          <div className="d-flex d-none ">
                            <label
                              htmlFor="cameraInput"
                              className="position-absolute top-[80%]  p-2 bg-green text-white rounded-full mx-2 cursor-pointer"
                            >
                              <FiCamera />
                            </label>
                            <input
                              type="file"
                              accept="image/*"
                              capture="camera"
                              id="cameraInput"
                              // onChange={(e) => handleImageChange(e, setProfilePic, setProfilePicPreview)}
                              onChange={(e) =>
                                handleImageChange(
                                  e,
                                  setProfilePic,
                                  setProfilePicPreview
                                )
                              }
                              className="hidden"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        {isWebcamOpen && (
                          <div className="webcam-overlay">
                            <div className="webcam-popup">
                              <Webcam
                                audio={false}
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                                className="webcam"
                              />
                              <button
                                type="button"
                                onClick={captureWebcamImage}
                                className="btn btn-primary mt-2"
                              >
                                Capture
                              </button>
                              <button
                                type="button"
                                onClick={() => setIsWebcamOpen(false)}
                                className="btn btn-secondary mt-2"
                              >
                                Close
                              </button>
                            </div>
                          </div>
                        )}
                        <div className="flex flex-wrap justify-center">
                          <div className="w-full sm:w-auto flex flex-col items-center">
                            <button
                              type="submit"
                              className="flex items-center justify-center w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg shadow-sm hover:shadow-lg font-medium transition ease-in duration-200"
                              disabled={loading}
                            >
                              {loading ? (
                                <div
                                  className="spinner-border text-white"
                                  role="status"
                                >
                                  <span className="sr-only">Loading...</span>
                                </div>
                              ) : (
                                "Sign Up"
                              )}
                            </button>
                            <p className="mt-4 text-sm text-gray-600">
                              Already have an account?{" "}
                              <Link
                                to={"/login"}
                                className="text-success font-semibold hover:underline text-lg ml-1"
                              >
                                login
                              </Link>
                            </p>
                          </div>
                        </div>
                      </div>
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
      </div>
    </div>
  );
};

export default RegisterAadhar;
