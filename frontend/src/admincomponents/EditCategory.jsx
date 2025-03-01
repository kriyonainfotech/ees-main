import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Modal } from 'bootstrap';

const backend_API = import.meta.env.VITE_API_URL;

const EditCategory = ({ editcategory, fetchCategory }) => {
    // console.log(editcategory, fetchCategory, "editcategory");
    const [categoryName, setCategoryName] = useState("");
    const [categoryImg, setCategoryImg] = useState("");
    const [preview, setPreview] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            // Restrict WebP format
            if (file.type === "image/webp") {
                setError("❌ WebP format is not allowed. Please upload JPG or PNG.");
                return;
            }

            setCategoryImg(file);
            setPreview(URL.createObjectURL(file)); // Generate preview
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log(categoryImg, "categoryImg");
        console.log(categoryName, "categoryName");
        if (!categoryName) {
            alert("Please fill all fields");
            return;
        }

        const formData = new FormData();
        formData.append("categoryName", categoryName);
        if (categoryImg) {
            formData.append("categoryImg", categoryImg);
        }
        formData.append("categorId", editcategory._id);

        try {
            setLoading(true);

            const response = await axios.post(`${backend_API}/category/updateCategory`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            // if (response.status === 200) {
            //     // Close modal using pure JavaScript
            //     const modalElement = document.getElementById('exampleModal');
            //     modalElement.classList.remove('show');
            //     modalElement.setAttribute('aria-hidden', 'true');
            //     modalElement.style.display = 'none';

            //     // Remove modal backdrop
            //     const modalBackdrops = document.getElementsByClassName('modal-backdrop');
            //     while (modalBackdrops.length > 0) {
            //         modalBackdrops[0].parentNode.removeChild(modalBackdrops[0]);
            //     }

            //     // Remove modal open class from body
            //     document.body.classList.remove('modal-open');
            //     document.body.style.overflow = '';
            //     document.body.style.paddingRight = '';

            //     toast.success("Category updated successfully");
            //     fetchCategory(currentPage);

            //     // Reset form
            //     setCategoryName("");
            //     setCategoryImg("");
            //     setPreview("");
            //     setError("");
            // } 

            if (response.status === 200) {
                const modalElement = document.getElementById('exampleModal');
                modalElement.classList.remove('show');
                modalElement.setAttribute('aria-hidden', 'true');
                modalElement.style.display = 'none';

                // Remove modal backdrop
                const modalBackdrops = document.getElementsByClassName('modal-backdrop');
                while (modalBackdrops.length > 0) {
                    modalBackdrops[0].parentNode.removeChild(modalBackdrops[0]);
                }

                // Remove modal open class from body
                document.body.classList.remove('modal-open');
                document.body.style.overflow = '';
                document.body.style.paddingRight = '';
                fetchCategory();
                toast.success("Category updated successfully");

                // Update preview to new image URL
                if (categoryImg) {
                    setPreview(URL.createObjectURL(categoryImg));
                }

                // Reset form
                setCategoryName("");
                setCategoryImg("");
                document.getElementById("file-upload").value = "";
            }
            else {
                setError(response.data.message || "Failed to update category. Please try again.");
            }

        } catch (error) {
            console.error("Error updating category:", error);
            setError(error?.response?.data?.message || "Failed to update category. Please try again.");
            if (error.response) {
                // Backend responded with an error (e.g., Multer error)
                alert(`❌ Error: ${error.response.data.message}`);
            } else if (error.request) {
                // Request was made but no response received
                alert("❌ Image not supported. Please try again.");
            } else {
                // Something else went wrong
                alert(`❌ Unexpected error: ${error.message}`);
            }
        } finally {
            setError('')
            setLoading(false);
        }
    };


    useEffect(() => {
        if (editcategory) {
            setCategoryName(editcategory.categoryName);
            setPreview(editcategory.image); // Initial preview
        }
    }, [editcategory]);

    return (
        <div className="modal-content">
            <div className="modal-header">
                <h1 className="modal-title fs-5">Edit Category</h1>
                <button type="button" className="btn-close p-3" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="modal-body">
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="mb-3">
                        <label htmlFor="category-name" className="col-form-label">Category Name:</label>
                        <input
                            type="text"
                            className="form-control"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                        />
                    </div>
                    {/* <div className="mb-3">
                        <label htmlFor="file-upload" className="col-form-label">Category Image:</label>
                        <label htmlFor="file-upload" className="btn d-inline-block border border-orange d-flex justify-content-start align-items-center">
                            Category Image
                        </label>
                        <input
                            type="file"
                            id="file-upload"
                            name="categoryImg"
                            onChange={handlefileChange}

                        />
                        {preview && <img src={preview} alt="Preview" width="100" />}
                    </div> */}
                    <div className="mb-3">
                        {preview && (
                            <img
                                src={preview}
                                alt="Preview"
                                className="w-24 h-24 object-cover rounded-full border"
                            />
                        )}

                        <div className='flex'> <input
                            id="imageUpload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                            <button
                                type="button"
                                onClick={() => document.getElementById("imageUpload").click()}
                                className="mt-2 px-4 py-1 text-sm bg-gray-200 rounded-md hover:bg-gray-300"
                            >
                                Change Photo
                            </button>
                        </div>
                    </div>
                    {error && <div className="alert alert-danger">{error}</div>}

                    <div className="modal-footer">
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? "Updating..." : "Update Category"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditCategory;
