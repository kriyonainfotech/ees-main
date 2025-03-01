import { useContext, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Webcam from "react-webcam";
import AdminSidebar from '../admincomponents/AdminSidebar';
import AdminHeader from '../admincomponents/AdminHeader';
import ProfileIcon from "../../public/User_icon.webp";
import { FiCamera } from "react-icons/fi";
import { FCMContext } from '../context/FCMContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Font Awesome icons for show/hide

import { toast } from 'react-toastify';


const backend_API = import.meta.env.VITE_API_URL;

const CreatUser = () => {
    const { fcmToken } = useContext(FCMContext);

    const [categories, setCategories] = useState([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmpassword, setConfirmpassword] = useState('');
    const [pincode, setPincode] = useState('');
    const [area, setArea] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [country, setCountry] = useState('');
    const [error, setError] = useState('');
    const [address, setAddress] = useState('');
    const [businessCategory, setBusinessCategory] = useState([]);
    const [businessName, setBusinessName] = useState('');
    const [businessAddress, setBusinessAddress] = useState('');
    const [businessDetaile, setBusinessDetaile] = useState('');

    const [frontAadhar, setFrontAadhar] = useState(null);
    const [backAadhar, setBackAadhar] = useState(null);
    const [profilePic, setProfilePic] = useState(null);

    const [frontAadharPreview, setFrontAadharPreview] = useState(null);
    const [backAadharPreview, setBackAadharPreview] = useState(null);
    const [profilePicPreview, setProfilePicPreview] = useState(null);

    const [isWebcamOpen, setIsWebcamOpen] = useState(false);
    const [webcamMode, setWebcamMode] = useState(""); // Track which field (front/back/profile) is using the webcam
    const webcamRef = useRef(null);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [loading, setLoading] = useState(false);  // New loading state
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    const [referralCode, setReferralCode] = useState(null); // For referral code
    const location = useLocation();
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    // Fetch Categories only once when the component mounts
    const fetchCategory = async () => {
        try {
            const response = await axios.get(`${backend_API}/category/getAllCategory`);
            const sortedCategories = response.data.category.sort((a, b) => a.categoryName.localeCompare(b.categoryName));
            setCategories(sortedCategories);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    useEffect(() => {
        fetchCategory();
        if (location?.state) {
            setName(location.state.name || '');
            setEmail(location.state.email || '');
            setPhone(location.state.phone || '');
            setArea(location.state.address?.area || '');
            setCity(location.state.address?.city || '');
            setState(location.state.address?.state || '');
            setCountry(location.state.address?.country || '');
            setPincode(location.state.address?.pincode || '');
            setBusinessCategory(location.state.businessCategory || []);
            setBusinessName(location.state.businessName || '');
            setBusinessAddress(location.state.businessAddress || '');
            setBusinessDetaile(location.state.businessDetaile || '');
        }
    }, [location]);

    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

    const selectCategory = (category) => {
        setBusinessCategory(category);
        setIsDropdownOpen(false);
    };

    const fetchLocationDetails = async (pincode) => {
        try {
            const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
            const data = await response.json();
            if (data[0].Status === 'Success') {
                const postOffice = data[0].PostOffice[0];
                setArea(postOffice.Name || '');
                setCity(postOffice.District || '');
                setState(postOffice.State || '');
                setCountry(postOffice.Country || '');
                setError('');
            } else {
                setError('Invalid Pincode! Please enter a valid one.');
                resetLocationFields();
            }
        } catch (err) {
            setError('Failed to fetch location details. Try again later.');
            resetLocationFields();
        }
    };

    const resetLocationFields = () => {
        setArea('');
        setCity('');
        setState('');
        setCountry('');
    };

    const handlePincodeChange = (e) => {
        const inputPincode = e.target.value.trim();
        setPincode(inputPincode);
        if (inputPincode.length === 6) {
            fetchLocationDetails(inputPincode);
        } else {
            resetLocationFields();
            setError('');
        }
    };


    const handleImageChange = (e, setImageState, setPreviewState) => {
        const file = e.target.files[0];

        if (file) {
            const blobUrl = URL.createObjectURL(file);
            console.log(blobUrl)
            // Dynamically update state based on the section
            setImageState(file);
            setPreviewState(blobUrl);
        };
    }
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
                    const file = new File([blob], `${webcamMode}.jpeg`, { type: "image/jpeg" });
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
                    setIsWebcamOpen(false);
                });
        }
    };
    const validateInputs = () => {
        const newErrors = {};

        if (!name) {
            newErrors.name = 'Name is required.';
        }

        if (!email) {
            newErrors.email = 'Email is required.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Please enter a valid email address.';
        } else if (!email.endsWith('@gmail.com')) {
            newErrors.email = 'Please use your @gmail.com.com email.';
        }

        if (!phone) {
            newErrors.phone = 'Phone number is required.';
        } else if (!/^\d{10}$/.test(phone)) {
            newErrors.phone = 'Phone number must be exactly 10 digits.';
        }

        if (!password) {
            newErrors.password = 'Password is required.';
        } else if (password.length < 4) {
            newErrors.password = 'Password must be at least 4 characters long.';
        } 

        if (password !== confirmpassword) {
            newErrors.confirmpassword = 'Passwords do not match.';
        }

        if (!area) {
            newErrors.area = 'Area is required.';
        }
        if (!city) {
            newErrors.city = 'City is required.';
        }
        if (!state) {
            newErrors.state = 'State is required.';
        }
        if (!country) {
            newErrors.country = 'Country is required.';
        }
        if (!pincode) {
            newErrors.pincode = 'Pincode is required.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateInputs()) {
            setLoading(false);
            return;
        }
        if (!frontAadhar || !backAadhar || !profilePic) {
            alert("Please upload all required files: Front Aadhar, Back Aadhar, and Profile Picture.");
            return; // Stop further execution if any file is missing
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('phone', phone);
        formData.append("password", password);
        formData.append("confirmpassword", confirmpassword);
        formData.append('address', JSON.stringify({ area, city, state, country, pincode }));
        formData.append('businessCategory', businessCategory);
        formData.append('businessName', businessName);
        formData.append('businessAddress', businessAddress);
        formData.append('businessDetaile', businessDetaile);
        formData.append("referralCode", referralCode);
        formData.append("fcmToken", fcmToken);

        if (frontAadhar) formData.append("frontAadhar", frontAadhar);
        if (backAadhar) formData.append("backAadhar", backAadhar);
        if (profilePic) formData.append("profilePic", profilePic);

        for (const [key, value] of formData.entries()) {
            console.log(`${key}:`, value, "dat");
        }

        setLoading(true);  // Show loading spinner or disable the button

        try {
            const registerResponse = await axios.post(`${backend_API}/auth/registerUserweb`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            if (registerResponse.status === 200) {
                console.log(registerResponse.data ,"register");
                
                toast.success(registerResponse.data.message || "Registration successful! Your account is awaiting admin approval.");
                navigate("/admin/aprove");

            } else {
                toast.error(registerResponse.data.message || "Registration failed.");
            }
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || 'Failed to Register user. Please try again.');
        } finally {
            setLoading(false);  // Hide loading spinner
        }
    };

    return (
        <>
            <AdminHeader />
            <AdminSidebar />
            <div className="bg-gray-200 pt-15 flex items-center mt-24 justify-center">
                <div className="w-[600px] bg-white rounded-lg overflow-hidden shadow-md mt-5 mx-2">
                    <div className="py-3 px-6 grid grid-cols-1 gap-6">
                        <div className="flex flex-col items-center">
                            <h3 className="text-3xl font-semibold text-red-500 pt-3">Create User</h3>
                        </div>
                        <form onSubmit={handleSubmit} method='post' className="space-y-4 dark:text-white">
                            <div>
                                <label className="block text-sm font-medium">raffrar phone</label>
                                <input
                                    type="text"
                                    value={referralCode}
                                    onChange={(e) => setReferralCode(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"

                                />

                            </div>
                            <div>
                                <label className="block text-sm font-medium">Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"

                                />
                                {errors.name && <span className="error text-orange text-sm">{errors.name}</span>}

                            </div>
                            <div>
                                <label className="block text-sm font-medium">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"

                                />
                                {errors.email ? (<span className="error text-orange text-sm">{errors.email}</span>) : (<span className='  text-gray text-sm'>Email must end with @gmail.com.</span>)}

                            </div>
                            <div>
                                <label className="block text-sm font-medium">Contact</label>
                                <input
                                    type="text"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"

                                />
                                {errors.phone ? (<span className="error text-orange text-sm">{errors.phone}</span>) : (<span className=' text-gray text-sm'>Phone number must be at least 10 digits.</span>)}
                            </div>

                            <div className="relative">
                                <label className="block text-sm font-medium">Password</label>
                                <input
                                    value={password}
                                    type={showPassword ? "text" : "password"}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"

                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute right-4 top-9"
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                                {errors.password ? (<span className="error text-orange text-sm">{errors.password}</span>) : (<span className='  text-gray text-sm'>Password must be at least 4 characters.</span>)}
                  
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Confirmpassword</label>
                                <input
                                    type="password"
                                    value={confirmpassword}
                                    onChange={(e) => setConfirmpassword(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"

                                />
                                {errors.confirmpassword && <span className="error text-orange text-sm">{errors.confirmPassword}</span>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Area</label>
                                <input
                                    type="text"
                                    value={area}
                                    onChange={(e) => setArea(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"

                                />
                                {errors.area && <span className="error text-orange text-orange text-sm">{errors.area}</span>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Pincode</label>
                                <input
                                    type="text"
                                    value={pincode}
                                    onChange={handlePincodeChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                />
                                {errors.pincode && <span className="error text-orange text-orange text-sm">{errors.pincode}</span>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium">City</label>
                                <input
                                    type="text"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"

                                />
                                {errors.city && <span className="error text-orange text-orange text-sm">{errors.city}</span>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium">State</label>
                                <input
                                    type="text"
                                    value={state}
                                    onChange={(e) => setState(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"

                                />
                                {errors.state && <span className="error text-orange text-orange text-sm">{errors.state}</span>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Country</label>
                                <input
                                    type="text"
                                    value={country}
                                    onChange={(e) => setCountry(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"

                                />
                                {errors.country && <span className="error text-orange text-orange text-sm">{errors.country}</span>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Business Name</label>
                                <input
                                    type="text"
                                    value={businessName}
                                    onChange={(e) => setBusinessName(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"

                                />
                            </div>

                            <div className="w-full mt-10">
                                <label className="block text-sm font-medium">Select Business Categories:</label>
                                <div className="mt-3 w-full">
                                    <div
                                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                        onClick={toggleDropdown}
                                    >
                                        {businessCategory.length > 0 ? (
                                            <span className="inline-block text-black py-1">{businessCategory}</span>
                                        ) : (
                                            <span className="py-1">Select a category</span>
                                        )}
                                    </div>
                                    {isDropdownOpen && (
                                        <ul className="z-10 border border-gray-300 bg-white w-full mt-2 rounded-md max-h-40 overflow-y-auto">
                                            {categories.map((category, i) => (
                                                <li
                                                    key={i}
                                                    className={`cursor-pointer px-4 py-2 hover:bg-green-200 ${businessCategory === category.categoryName ? 'bg-green-200' : ''}`}
                                                    onClick={() => selectCategory(category.categoryName)}
                                                >
                                                    {category.categoryName}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Business Address</label>
                                <input
                                    type="text"
                                    value={businessAddress}
                                    onChange={(e) => setBusinessAddress(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"

                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Business Detaile</label>
                                <input
                                    type="text"
                                    value={businessDetaile}
                                    onChange={(e) => setBusinessDetaile(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"

                                />
                            </div>

                            <div>
                                <div className="mx-auto max-w-full">
                                    <h4 className='pt-3 ps-2 py-3'>Aadhaar KYC</h4>
                                    <div className="d-flex " style={{ position: "relative" }}>
                                        <div className="col-6 p-1">
                                            <div className="">
                                                {/* <h5>Front Aadhaar</h5> */}
                                                <div
                                                    className="upload-box adhaar-front h-[100px] border rounded-2 d-flex justify-content-center align-items-center position-reletive"
                                                    onClick={() => document.getElementById("frontAadharInput").click()}
                                                >
                                                    {frontAadharPreview ? <img src={frontAadharPreview} className="w-100 h-100 img-fluid" alt="Front Aadhaar" /> : <h4>Front</h4>}
                                                </div>

                                                <input
                                                    type="file"
                                                    id="frontAadharInput"
                                                    accept="image/*"
                                                    onChange={(e) => handleImageChange(e, setFrontAadhar, setFrontAadharPreview)}
                                                    hidden
                                                />
                                                <button type="button" className="btn d-none d-md-flex bg-green text-white position-absolute  p-2 rounded-5 top-[63%]" onClick={() => toggleWebcam("frontAadhar")}>
                                                    <FiCamera />
                                                </button>
                                                <div className='d-flex d-md-none'>
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
                                                        // onChange={(e) => handleImageChange(e, "frontAadhar")}
                                                        onChange={(e) =>
                                                            handleImageChange(e, setFrontAadhar, setFrontAadharPreview)
                                                        }
                                                        className="hidden"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-6 p-1">
                                            <div className="" style={{ position: "relative" }}>
                                                {/* <h5>Back Aadhaar</h5> */}
                                                <div
                                                    className="upload-box adhaar-back h-[100px] border rounded-2 d-flex justify-content-center align-items-center position-reletive"
                                                    onClick={() => document.getElementById("backAadharInput").click()}
                                                >
                                                    {backAadharPreview ? <img src={backAadharPreview} className="w-100 h-100 img-fluid" alt="Back Aadhaar" /> : <h4>Back</h4>}
                                                </div>
                                                <input
                                                    type="file"
                                                    id="backAadharInput"
                                                    accept="image/*"
                                                    onChange={(e) => handleImageChange(e, setBackAadhar, setBackAadharPreview)}

                                                    hidden
                                                />
                                                <button type="button" className="btn d-none d-md-flex bg-green text-white position-absolute p-2 rounded-5 top-[63%]" onClick={() => toggleWebcam("backAadhar")}>
                                                    <FiCamera />
                                                </button>
                                                <div className='d-flex d-md-none'>
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
                                                        // onChange={(e) => handleImageChange(e, "backAadhar")}
                                                        onChange={(e) =>
                                                            handleImageChange(e, setBackAadhar, setBackAadharPreview)
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
                                                onClick={() => document.getElementById("profilePicInput").click()}
                                            >
                                                {profilePicPreview ? <img src={profilePicPreview} alt="Profile" className="w-100 h-100 rounded-full img-fluid" /> : <img src={ProfileIcon} alt="Profile" className="w-100 h-100 img-fluid" />}
                                            </div>
                                            <input
                                                type="file"
                                                id="profilePicInput"
                                                accept="image/*"
                                                onChange={(e) => handleImageChange(e, setProfilePic, setProfilePicPreview)}

                                                hidden
                                            />
                                            <button type="button" className="btn d-none d-md-flex bg-green p-0 p-2 text-white rounded-5 position-absolute bottom-[10%]" onClick={() => toggleWebcam("profile")}>
                                                <FiCamera />
                                            </button>
                                            <div className='d-flex d-md-none'>
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
                                                    onChange={(e) => handleImageChange(e, setProfilePic, setProfilePicPreview)
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
                                                    <button type="button" onClick={captureWebcamImage} className="btn btn-primary mt-2">
                                                        Capture
                                                    </button>
                                                    <button type="button" onClick={() => setIsWebcamOpen(false)} className="btn btn-secondary mt-2">
                                                        Close
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                    </div>
                                </div>
                            </div>
                            <button
                                type="submit"
                                className={`w-full py-2 rounded-md ${loading ? 'bg-gray-500' : 'bg-red-600'} text-white font-bold`}
                                disabled={loading} // Disable button when loading
                            >
                                {loading ? 'regiter...' : 'Register User'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CreatUser;