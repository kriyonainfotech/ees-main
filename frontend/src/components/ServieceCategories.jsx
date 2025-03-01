import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const backend_API = import.meta.env.VITE_API_URL;
const ServieceCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${backend_API}/category/getAllCategory`);
            console.log(response.data, 'catehome')
            setCategories(response.data.category);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching categories:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // Handle category click
    const handleCategoryClick = (categoryName) => {
        navigate('/serviceDetail', { state: categoryName });
    };

    if (loading) {
        return (
            <div className="text-center py-5">
                <h5>Loading categories...</h5>
            </div>
        );
    }

    if (!categories || categories.length === 0) {
        return (
            <div className="text-center py-5">
                <h5>No categories available</h5>
            </div>
        );
    }

    return (
        <section className="mt-2">
            <div className="container">
                <div className="row row-cols-3 row-cols-lg-5 g-3">

                    {categories.map((item, index) => (
                        <div
                            key={index}
                            className="col text-center"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleCategoryClick(item.categoryName)}
                        >
                            <div className="border-0 w-100 h-100 rounded-md">
                                <figure className="w-100 m-0 p-2 mb-2 border-orange rounded-4 d-flex justify-content-center align-items-center">
                                    <img
                                        className="img-fluid  overflow-hidden"
                                        style={{
                                            width: "100%",
                                            aspectRatio: "1/1", // Ensures square shape
                                            objectFit: "cover",
                                            maxWidth: "150px" // Prevents oversized images
                                        }}
                                        src={item.image}
                                        alt={item.categoryName}
                                    />
                                </figure>
                                <h6 className="text-md text-capitalize">{item.categoryName}</h6>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ServieceCategories;
