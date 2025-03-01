import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa'; // Icons for filled and empty stars
import starGold from "../../../public/starRating.png"
import starSilver from "../../../public/startSilver.png"
import { toast } from 'react-toastify';
const backend_API = import.meta.env.VITE_API_URL;

const GetUserRating = () => {
  const [rating, setRating] = useState([]); // Rating as a number
  const [average, setAverageRating] = useState([]); // Rating as a number
  const token = JSON.parse(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRatings = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${backend_API}/user/getrate`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          console.log(response?.data?.ratings, "Ratings data");
          console.log(response.data.averages, "Ratings averages");
          setRating(response.data.ratings); // Set the average rating
          setAverageRating(response.data.averages); // Set the average rating
        } else {
          console.error("Failed to fetch Ratings");
         
        }
      } catch (error) {
        console.error("Error fetching Ratings:", error);
        toast(error?.response?.data?.message)
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, []);

  const renderStars = (ratings = [], maxRating = 10) => {
    const ratingValue = ratings.length > 0 ? ratings.reduce((acc, cur) => acc + cur, 0) / ratings.length : 0;
    const stars = [];
    for (let i = 1; i <= maxRating; i++) {
      stars.push(
        <img
          key={i}
          src={i <= ratingValue ? starGold : starSilver}
          alt={i <= ratingValue ? 'Filled Star' : 'Empty Star'}
          width={15}
        />
      );
    }
    return stars;
  };
  const renderStar = (ratings = [], maxRating = 10) => {
    const ratingValue = ratings.length > 0 ? ratings.reduce((acc, cur) => acc + cur, 0) / ratings.length : 0;
    const stars = [];
    for (let i = 1; i <= maxRating; i++) {
      stars.push(
        <img
          key={i}
          src={i <= ratingValue ? starGold : starSilver}
          alt={i <= ratingValue ? 'Filled Star' : 'Empty Star'}
          width={15}
        />
      );
    }
    return stars;
  };

  return (
    <>
      <div>
        <div className="rating rating-sm d-flex flex-column ">
          <strong className='text-sm' >Provider :</strong>
          <div>
            {
              rating.providerRatings ? (
                <div className=' d-flex align-items-center'>
                  {renderStars(rating?.providerRatings.map((r) => {
                    return r.rating
                  }), 10,)}
                  <span className="ps-2 ">{rating?.providerAverageRatings
                  }</span>
                  {/* <FaStar className= {` ${Usersdata.ratings ? "d-flex" : "d-none"}`}  /> */}
                </div>
              ) : (<></>)
            }
          </div>

        </div>
        <div className="rating rating-sm d-flex flex-column ">
          <strong className='text-sm' >User :</strong>
          <div>
            {
              rating?.userRatings ? (
                <div className=' d-flex align-items-center'>
                  {renderStar(rating?.userRatings.map((r) => {
                    return r.rating
                  }), 10,)}
                  <span className="ps-2 "></span>
                  {/* <FaStar className= {` ${Usersdata.ratings ? "d-flex" : "d-none"}`}  /> */}
                </div>
              ) : (<></>)
            }
          </div>

        </div>
      </div>


    </>
  );
};

export default GetUserRating;
