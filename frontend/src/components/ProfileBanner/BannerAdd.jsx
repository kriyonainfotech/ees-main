import axios from 'axios';
import React, { useState } from 'react'
import { toast } from 'react-toastify';
const backend_API = import.meta.env.VITE_API_URL;
// console.log(backend_API);

const BannerAdd = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null); // To show preview
  const token = JSON.parse(localStorage.getItem('token'))
  const [loading, setLoading] = useState(false);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file)); // Generate a preview URL
  };

  const hendleSubmitIng = async (e) => {
    e.preventDefault();

    if (!image) {
      alert("Please upload an image");
      return;
    }

    const formData = new FormData();
    formData.append('banner', image); // Matches the backend field name
    console.log('FormData:', Object.fromEntries(formData));

    try {
      setLoading(true)
      const response = await axios.post(`${backend_API}/banner/addBanner`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`, // Pass the token in headers
        },
      }
      );
      // alert(response.data.message)
      toast("Banner Added Successfully")
      window.location.reload()
      setImage(null);
      setPreview(null);

    } catch (error) {
      console.error("Error details:", error);
      toast(error.response.data.message);
    } finally {
      setLoading(false)
    }

  }


  return (
    <>
      <form onSubmit={hendleSubmitIng} className="flex flex-col items-center gap-4 p-4 border border-gray-300 rounded-lg shadow-md bg-white">
        <label htmlFor="file-upload" className="cursor-pointer flex items-center justify-center w-full max-w-xs h-24 border-2 border-dashed border-orange-500 text-orange-600 font-semibold rounded-lg hover:bg-orange-50 transition">
          Add Offer Banner
        </label>
        <input type="file" id="file-upload" name="banner" onChange={handleImageChange} className="hidden" />

        {preview && (
          <img src={preview} alt="Preview" className="w-48 h-auto rounded-md shadow-sm" />
        )}

        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition disabled:opacity-50" disabled={loading}>
          {loading ? (
            <div className="spinner-border text-white w-5 h-5 animate-spin" role="status"></div>
          ) : (
            "Add"
          )}
        </button>
      </form>


    </>
  )
}

export default BannerAdd
