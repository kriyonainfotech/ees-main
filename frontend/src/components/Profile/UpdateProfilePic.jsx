// import axios from 'axios';
// import React, { useState, useRef } from 'react';
// import { FiCamera } from 'react-icons/fi';
// import { toast } from 'react-toastify';
// import Webcam from 'react-webcam';
// import ProfileIcon from "../../../public/User_icon.webp"
// const backend_API = import.meta.env.VITE_API_URL;

// const UpdateProfilePic = ({ user }) => {
//     const token = JSON.parse(localStorage.getItem('token'));
//     const [profilePic, setProfilePic] = useState(null);
//     const [profilePicPreview, setProfilePicPreview] = useState(null);
//     const [isWebcamOpen, setIsWebcamOpen] = useState(false);
//     const [webcamImage, setWebcamImage] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const webcamRef = useRef(null);

//     const uploadImage = async (file) => {
//         const formData = new FormData();
//         formData.append('profilePic', file);
//         setLoading(true);
//         try {
//             const response = await axios.post(`${backend_API}/auth/updateProfile`, formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                     'Authorization': `Bearer ${token}`,
//                 },
//             });
//             const data = await response.data;
//             console.log(data.message, "Image uploaded");
//             if (response.status === 200) {
//                 // window.location.reload();
//                 toast("Profile Updated Successfully");
//             }
//         } catch (error) {
//             console.error("Error uploading image:", error);
//             // toast("Failed to update profile picture");
//             toast(error?.response?.data?.message)
//         } finally {
//             setLoading(false);
//         }
//     };
//     const handleProfilePictureChange = async (e) => {
//         const file = e.target.files[0];

//         if (file) {
//             if (file.size > 2 * 1024 * 1024) { // 2MB limit
//                 toast.error("File size should be less than 2MB.");
//                 setTimeout(() => window.location.reload(), 3000); // Delay reload to let toast show
//                 return;
//             }

//             const blobUrl = URL.createObjectURL(file);
//             setProfilePic(file);
//             setProfilePicPreview(blobUrl);

//             await uploadImage(file);
//         }
//     };

//     const captureWebcamImage = async () => {
//         const imageSrc = webcamRef.current.getScreenshot();
//         setWebcamImage(imageSrc);
//         setIsWebcamOpen(false);
//         setProfilePicPreview(imageSrc);

//         const blob = await (await fetch(imageSrc)).blob();
//         await uploadImage(blob);
//     };

//     const toggleWebcam = () => {
//         setIsWebcamOpen((prev) => !prev);
//     };

//     return (
//         <>
//             <div className="position-absolute overflow-hidden  w-[150px] h-[150px] top-[120px] start-[50px] ring-green ring-offset-base-100 w-32 rounded-full ring ring-offset-2">
//                 <label
//                     htmlFor="profilePictureInput"
//                     className={`rounded-md cursor-pointer z-90 ${isWebcamOpen ? 'disabled' : ''}`}
//                     style={{ width: "150px", height: "150px", objectFit: "cover", objectPosition: "center" }}
//                 >
//                     <img
//                         src={profilePicPreview || user.profilePic || ProfileIcon}
//                         alt="Profile"
//                         className="rounded-md img-fluid w-100 h-100"
//                     />
//                 </label>
//             </div>
//             <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleProfilePictureChange}
//                 className=""
//                 name='profilePic hidden'
//                 id="profilePictureInput"
//                 disabled={isWebcamOpen}
//             />

//             <button
//                 type="button"
//                 onClick={toggleWebcam}
//                 className="position-absolute top-60 start-36 p-2 bg-orange text-white rounded-full mx-2"
//             >
//                 <FiCamera />
//             </button>

//             <div className="d-flex d-md-none">
//                 <label
//                     htmlFor="cameraInput"
//                     className="position-absolute top-60 start-36 p-2 bg-orange text-white rounded-full mx-2 cursor-pointer"
//                 >
//                     <FiCamera />
//                 </label>
//                 <input
//                     type="file"
//                     accept="image/*"
//                     capture="camera"
//                     id="cameraInput"
//                     onChange={handleProfilePictureChange}
//                     className="hidden"
//                 />
//             </div>

//             {isWebcamOpen && (
//                 <div className="webcam-overlay d-none d-md-flex">
//                     <div className="webcam-popup">
//                         <Webcam
//                             audio={false}
//                             ref={webcamRef}
//                             screenshotFormat="image/jpeg"
//                             className="webcam"
//                         />
//                         <button type="button" onClick={captureWebcamImage} className="btn btn-primary mt-2">
//                             Capture
//                         </button>
//                         <button type="button" onClick={toggleWebcam} className="btn btn-secondary mt-2">
//                             Close
//                         </button>
//                     </div>
//                 </div>
//             )}
//         </>
//     );
// };

// export default UpdateProfilePic;
import React from 'react';
import ProfileIcon from '../../../public/User_icon.webp';

const UpdateProfilePic = ({ user }) => {
    return (
        <div className="position-relative w-[150px] h-[150px] top-[120px] start-[50px] ring-green ring-offset-base-100 w-32 rounded-full ring ring-offset-2">

        </div>
    );
};

export default UpdateProfilePic;