import { useContext, useState } from "react";
import '../assets/adharfile.css'
import { UserContext } from "../UserContext";
const backend_API = import.meta.env.VITE_API_URL;
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'

const AadharCardUpload = () => {
  const { user } = useContext(UserContext)
  const token = JSON.parse(localStorage.getItem('token'));
  console.log(user)
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [User, setUser] = useState()
  const navigate = useNavigate()

  // Handle the file input for front image
  const handleFrontImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFrontImage(URL.createObjectURL(file)); // Create a temporary URL for the image preview
    }
  };

  // Handle the file input for back image
  const handleBackImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setBackImage(URL.createObjectURL(file)); // Create a temporary URL for the image preview
    }
  };


  const handleUploadAadhar = async (e) => {
    e.preventDefault();
    if (!frontImage || !backImage) {
      toast.error("Please upload both Aadhaar images!");
      return;
    }

    const formData = new FormData();
    formData.append("userId", user._id);
    formData.append("frontAadhar", frontImage);
    formData.append("backAadhar", backImage);
    // Log FormData
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }
    try {
      const response = await axios.put(`${backend_API}/auth/updateUserProfile`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`, // Include token
        },
        withCredentials: true,
      });
      console.log(response, 'response-adaarh')
      if (response.data.success) {
        toast.success("Aadhaar photos updated successfully!");
        setUser({ ...user, frontAadhar: response.data.frontAadharUrl, backAadhar: response.data.backAadharUrl });
        navigate("/");
      }
    } catch (error) {
      console.log("Error updating Aadhaar images:", error);
      toast.error(error?.response?.data?.message || "Something went wrong. Please try again.");
    }
  };


  return (
    <div className="">
      <div className="container mt-5">
        <h2 className="mb-4 text-center">Upload Aadhar Card KYC</h2>
        <form className="" onSubmit={handleUploadAadhar}>
          <div className="row">
            {/* Front Image */}
            <div className="col-12 col-md-6 mb-4">
              <label htmlFor="frontImage" className="form-label cursor-pointer p-2 bg-primary text-white rounded-lg">
                <i className="bi bi-card-image"></i> Click here to Upload Aadhar Front Image
              </label>
              <div className="custom-file-box">
                <input
                  type="file"
                  className="form-control-file"
                  id="frontImage"
                  accept="image/*"
                  onChange={handleFrontImageChange}
                  required
                />
                {frontImage && (
                  <div className="mt-3">
                    <img
                      src={frontImage}
                      alt="Front Image Preview"
                      className="img-fluid"
                      style={{ maxHeight: "200px", objectFit: "contain" }}
                    />
                  </div>
                )}
                {!frontImage && <small className="form-text text-muted">Choose a file to upload</small>}
              </div>
            </div>

            {/* Back Image */}
            <div className="col-12 col-md-6 mb-4">
              <label htmlFor="backImage" className="form-label cursor-pointer p-2 bg-primary text-white rounded-lg">
                <i className="bi bi-card-image"></i>Click here to Upload Aadhar Back Image
              </label>
              <div className="custom-file-box">
                <input
                  type="file"
                  className="form-control-file"
                  id="backImage"
                  accept="image/*"
                  onChange={handleBackImageChange}
                  required
                />
                {backImage && (
                  <div className="mt-3">
                    <img
                      src={backImage}
                      alt="Back Image Preview"
                      className="img-fluid"
                      style={{ maxHeight: "200px", objectFit: "contain" }}
                    />
                  </div>
                )}
                {!backImage && <small className="form-text text-muted">Choose a file to upload</small>}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="d-flex justify-content-center">
            <button type="submit" className="btn btn-primary mt-4">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AadharCardUpload;
