import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { HiDotsHorizontal } from "react-icons/hi";
import Webcam from "react-webcam";
import { LuUserPen } from "react-icons/lu";
import { MdAlternateEmail } from "react-icons/md";
import { LuPhone } from "react-icons/lu";
import { FaCamera, FaRegAddressCard } from "react-icons/fa6";
import { CiEdit } from "react-icons/ci";
import UserSideBar from "./UserSideBar";
import AdminNavbar from "../admincomponents/AdminNavbar";
import { FiCamera } from "react-icons/fi";
import { toast } from "react-toastify";
import ProfileIcon from "../../public/User_icon.webp";

const backend_API = import.meta.env.VITE_API_URL;
const EditProfile = () => {
  const [profile, setProfile] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [area, setArea] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [pincode, setPincode] = useState("");
  const [address, setAddress] = useState();
  const [businessCategory, setBusinessCategory] = useState([]);
  const [businessName, setBusinessName] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [businessDetaile, setBusinessDetaile] = useState("");
  const [profilePic, setProfilePic] = useState(null); // Actual file object
  const [profilePicPreview, setProfilePicPreview] = useState(null); // Blob URL for preview
  // const [frontAadhar, setfrontAadhar] = useState(null); // Front image file
  // const [backAadhar, setbackAadhar] = useState(null); // Back image file
  // const [frontAadharPreview, setfrontAadharPreview] = useState(null); // Preview URL for front image
  // const [backAadharPreview, setbackAadharPreview] = useState(null); // Preview URL for back image
  const [isEditable, setIsEditable] = useState(true); // To check if the profilePic is editable
  const defaultProfilePic =
    "https://res.cloudinary.com/dcfm0aowt/image/upload/v1739604108/user/phnbhd4onynoetzdxqjp.jpg"; // Set this to your default profile picture URL
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [categories, setCategories] = useState([]);
  const [isWebcamOpen, setIsWebcamOpen] = useState(false); // Webcam toggle
  const [webcamImage, setWebcamImage] = useState(null); // Captured image from webcam
  const webcamRef = useState(null);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  console.log(location.state, "ls----------------");

  const navigete = useNavigate();
  const toggleSelection = (category) => {
    setBusinessCategory(category); // Set selected category
    setIsDropdownOpen(false); // Close dropdown
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // profile pic upload thaya badd open karva nu che
  // useEffect(() => {
  //   if (location?.state?.profilePic === defaultProfilePic) {
  //     setIsEditable(true); // If the profile picture is default, allow editing
  //   } else {
  //     setProfilePic(location?.state?.profilePic);
  //     setProfilePicPreview(location?.state?.profilePic);
  //     setIsEditable(false); // If the profile picture is not default, disable editing
  //   }
  // }, [location?.state]);

  const token = JSON.parse(localStorage.getItem("token"));

  const fetchLocationDetails = async (pincode) => {
    setLoading(true);
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
      } else {
        setError("Invalid Pincode! Please enter a valid one.");
        setArea("");
        setCity("");
        setState("");
        setCountry("");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to fetch location details. Try again later."
      );
    } finally {
      setLoading(false);
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

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const blobUrl = URL.createObjectURL(file);
      console.log(blobUrl);
      setProfilePic(file); // Save the file object to send to the backend
      setProfilePicPreview(blobUrl);
    }
  };

  // const handlefrontAadharChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     const blobUrl = URL.createObjectURL(file);
  //     setfrontAadhar(file); // Save the file object
  //     setfrontAadharPreview(blobUrl); // Preview URL
  //   }
  // };

  // const handlebackAadharChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     const blobUrl = URL.createObjectURL(file);
  //     setbackAadhar(file); // Save the file object
  //     setbackAadharPreview(blobUrl); // Preview URL
  //   }
  // };

  const toggleWebcam = () => {
    setIsWebcamOpen((prev) => !prev);
  };

  const captureWebcamImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setWebcamImage(imageSrc);
    setIsWebcamOpen(false);
    setProfilePicPreview(imageSrc);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newAddress = {
      area,
      city,
      state,
      country,
      pincode,
    };
    // const fullData = { name, email, phone, address: newAddress, businessCategory, businessName, businessAddress };
    const formData = new FormData();

    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append(
      "address",
      JSON.stringify({ area, city, state, country, pincode })
    );
    formData.append("businessCategory", businessCategory);
    formData.append("businessName", businessName);
    formData.append("businessAddress", businessAddress);
    formData.append("businessDetaile", businessDetaile);
    // formData.append("frontAadhar", frontAadhar);
    // formData.append("backAadhar", backAadhar);

    // Add the actual file to FormData
    // Add the actual file to FormData
    if (webcamImage) {
      const blob = await (await fetch(webcamImage)).blob();
      formData.append("profilePic", blob); // Change this to 'profilePic'
    } else if (profilePic) {
      formData.append("profilePic", profilePic); // Change this to 'profilePic'
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${backend_API}/auth/updateProfile`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.data;
      console.log(data.message, "adited data");

      setProfile(data);
      if (response.status === 200) {
        toast(response?.data?.message || "Profile Updated Successfully");
        navigete("/profile");
        setTimeout(() => {
          window.location.reload(); // Reload the page after 5 seconds
        }, 4000); // 5000ms = 5 seconds// This will reload the window
      }
    } catch (error) {
      console.log(error);
      toast(error?.response?.data?.message);

      return false;
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    setName(location?.state?.name);
    setEmail(location?.state?.email);
    setPhone(location?.state?.phone);
    setArea(location?.state?.address?.area);
    setCity(location?.state?.address?.city);
    setState(location?.state?.address?.state);
    setCountry(location?.state?.address?.country);
    setPincode(location?.state?.address?.pincode);
    setAddress(location?.state?.address || {});
    setBusinessCategory(location?.state?.businessCategory || []),
      setBusinessName(location?.state?.businessName),
      setBusinessAddress(location?.state?.businessAddress);
    setBusinessDetaile(location?.state?.businessDetaile);
    setProfilePic(location?.state?.profilePic);
  }, [location?.state]);

  return (
    <>
      <AdminNavbar />
      <UserSideBar />
      <section className="py-28">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h2 className="py-2">Profile Setting</h2>
              <div className="card border-0 bg-base-100 shadow-xl">
                <form action="" onSubmit={handleSubmit} className=" p-3">
                  <div className="profilepic d-flex justify-content-between">
                    <label
                      htmlFor="profilePictureInput"
                      className={`rounded-md m-3 cursor-pointer overflow-hidden ${
                        isWebcamOpen ? "disabled" : ""
                      }`}
                      style={{
                        position: "relative",
                        width: "150px",
                        height: "150px",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    >
                      <img
                        src={profilePicPreview || profilePic || ProfileIcon}
                        alt="Profile"
                        className="rounded-md img-flied w-100"
                      />
                    </label>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureChange}
                      className="hidden"
                      name="profilePic"
                      id="profilePictureInput"
                      disabled={!isEditable}
                    />

                    <button
                      type="button"
                      onClick={toggleWebcam}
                      disabled={!isEditable}
                      className="position-absolute top-36 start-36 p-2 bg-white rounded-full mx-2"
                    >
                      <FiCamera />
                    </button>
                    <div className="d-flex d-md-none">
                      <label
                        htmlFor="cameraInput"
                        className="position-absolute top-36 start-36 p-2 bg-white rounded-full mx-2 cursor-pointer"
                      >
                        <FiCamera />
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        capture="camera"
                        id="cameraInput"
                        onChange={handleProfilePictureChange}
                        className="hidden"
                      />
                    </div>

                    {/* Webcam component */}
                    {isWebcamOpen && (
                      <div className="webcam-overlay d-none d-md-flex">
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
                            onClick={toggleWebcam}
                            className="btn btn-secondary mt-2"
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="form-detaile d-flex flex-wrap w-full py-2 d-flex">
                    <div className="col-12 col-md-6 p-2 w-full">
                      <div className="my-1">
                        <label className="block text-md font-medium p-2 text-bold ">
                          {" "}
                          Name
                        </label>
                        <label
                          htmlFor=""
                          className="d-flex align-items-center border-2 rounded-md p-2"
                        >
                          <input
                            type="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className=" w-100 outline-0 "
                          />
                          <LuUserPen className="text-xl" />
                        </label>
                      </div>
                      <div className="my-1">
                        <label className="block text-md font-medium p-2 text-bold ">
                          {" "}
                          Email
                        </label>
                        <label
                          htmlFor=""
                          className="d-flex align-items-center border-2 rounded-md p-2"
                        >
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className=" w-100 outline-0 "
                          />
                          <MdAlternateEmail className="text-xl" />
                        </label>
                      </div>
                      <div className="my-1">
                        <label className="block text-md font-medium p-2 text-bold ">
                          Contact{" "}
                        </label>
                        <label
                          htmlFor=""
                          className="d-flex align-items-center border-2 rounded-md p-2"
                        >
                          <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className=" w-100 outline-0 "
                          />
                          <LuPhone className="text-xl" />
                        </label>
                      </div>
                      <div className="my-1">
                        <label className="block text-md font-medium p-2 text-bold ">
                          Address
                        </label>
                        <div className="col-12 d-flex flex-wrap">
                          <div className="col-6">
                            <div
                              htmlFor=""
                              className="d-flex align-items-center border-2 rounded-md p-2 m-1"
                            >
                              <input
                                type="text"
                                value={area}
                                onChange={(e) => setArea(e.target.value)}
                                className=" w-100 outline-0 "
                                placeholder="area"
                              />
                              <FaRegAddressCard className="text-xl" />
                            </div>
                          </div>
                          <div className="col-6">
                            <div
                              htmlFor=""
                              className="d-flex align-items-center border-2 rounded-md p-2 m-1"
                            >
                              <input
                                type="text"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                className=" w-100 outline-0 "
                                placeholder="city"
                              />
                              <FaRegAddressCard className="text-xl" />
                            </div>
                          </div>
                          <div className="col-6">
                            <div
                              htmlFor=""
                              className="d-flex align-items-center border-2 rounded-md p-2 m-1"
                            >
                              <input
                                type="text"
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                                className=" w-100 outline-0 "
                                placeholder="state"
                              />
                              <FaRegAddressCard className="text-xl" />
                            </div>
                          </div>
                          <div className="col-6">
                            <div
                              htmlFor=""
                              className="d-flex align-items-center border-2 rounded-md p-2 my-1"
                            >
                              <input
                                type="text"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                className=" w-100 outline-0 "
                                placeholder="country"
                              />
                              <FaRegAddressCard className="text-xl" />
                            </div>
                          </div>
                          <div className="col-6">
                            <div
                              htmlFor=""
                              className="d-flex align-items-center border-2 rounded-md p-2 m-1"
                            >
                              <input
                                type="text"
                                value={pincode}
                                onChange={handlePincodeChange}
                                maxLength="6"
                                className=" w-100 outline-0 bg-none"
                                placeholder="pincode"
                              />
                              <FaRegAddressCard className="text-xl" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-md-6 p-2 w-full">
                      <div className="my-1">
                        <label className="block text-md font-medium p-2 text-bold ">
                          Bussiness Name{" "}
                        </label>
                        <label
                          htmlFor=""
                          className="d-flex align-items-center border-2 rounded-md p-2"
                        >
                          <input
                            type="text"
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
                            className=" w-100 outline-0 "
                          />
                          <MdAlternateEmail className="text-xl" />
                        </label>
                      </div>
                      <div className="my-1">
                        <label className="block text-md font-medium p-2 text-bold ">
                          Bussiness Category
                        </label>
                        <div className="">
                          {/* Display Selected Category */}
                          <div
                            className=" border-2 text-capitalize rounded-md p-2 bg-white"
                            onClick={toggleDropdown}
                          >
                            {businessCategory.length > 0 ? (
                              <span className="inline-block px-3 text-black py-1  ">
                                {businessCategory}
                              </span>
                            ) : (
                              <span className="text-gray-500 ps-3 py-1">
                                Select a category
                              </span>
                            )}
                          </div>

                          {/* Dropdown Menu */}
                          {isDropdownOpen && (
                            <ul className="z-10 border border-gray-300 bg-white w-full mt-2 rounded-md  max-h-40 overflow-y-auto">
                              {categories.map((category, i) => (
                                <li
                                  key={i}
                                  className={`cursor-pointer px-4 py-2 text-capitalize hover:bg-green-200 ${
                                    businessCategory === category.categoryName
                                      ? "bg-green-200"
                                      : ""
                                  }`}
                                  onClick={() =>
                                    toggleSelection(category.categoryName)
                                  }
                                >
                                  {category.categoryName}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>

                      <div className="my-2">
                        <label className="block text-md font-medium p-2 text-bold ">
                          Bussiness Address
                        </label>
                        <label
                          htmlFor=""
                          className="d-flex align-items-center border-2 rounded-md p-2 m-1"
                        >
                          <input
                            type="text"
                            value={businessAddress}
                            onChange={(e) => setBusinessAddress(e.target.value)}
                            className=" w-100 outline-0 "
                          />
                          <FaRegAddressCard className="text-xl" />
                        </label>
                      </div>
                      <div className="my-2">
                        <label className="block text-md font-medium p-2 text-bold ">
                          Bussiness Detaile
                        </label>
                        <label
                          htmlFor=""
                          className="d-flex align-items-center border-2 rounded-md p-2 m-1"
                        >
                          <input
                            type="text"
                            value={businessDetaile}
                            onChange={(e) => setBusinessDetaile(e.target.value)}
                            className=" w-100 outline-0 "
                          />
                          <FaRegAddressCard className="text-xl" />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* <div>
                    <div className="my-1">
                      <label className="block text-md font-medium p-2 text-bold">
                        Aadhaar Front
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlefrontAadharChange}
                        className="w-full border-2 rounded-md p-2"
                      />
                      {frontAadharPreview && (
                        <img
                          src={frontAadharPreview}
                          alt="Aadhaar Front Preview"
                          className="mt-2"
                          style={{ width: "200px" }}
                        />
                      )}
                    </div>

                    <div className="my-1">
                      <label className="block text-md font-medium p-2 text-bold">
                        Aadhaar Back
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlebackAadharChange}
                        className="w-full border-2 rounded-md p-2"
                      />

                      {backAadharPreview && (
                        <img
                          src={backAadharPreview}
                          alt="Aadhaar Back Preview"
                          className="mt-2"
                          style={{ width: "200px" }}
                        />
                      )}
                    </div>

                    {frontAadhar && backAadhar && (
                      <div className="modal">
                        <h2>Upload Complete</h2>
                        <p>Aadhaar Front: {frontAadhar.name}</p>
                        <p>Aadhaar Back: {backAadhar.name}</p>
                      </div>
                    )}
                  </div> */}
                  <div className="d-flex justify-content-end mt-5">
                    <button
                      type="submit"
                      className="d-flex justify-content-center bg-orange text-white py-3 px-2 rounded-md hover:bg-primary "
                      disabled={loading}
                    >
                      {" "}
                      {loading ? (
                        <div
                          className="spinner-border text-white"
                          role="status"
                        >
                          <span className="sr-only">Loading...</span>
                        </div>
                      ) : (
                        " Save"
                      )}
                      <CiEdit className="text-xl text-bold mx-2" />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default EditProfile;
