import React, { useContext, useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import "../assets/Banner/Banner.css";
import axios from 'axios';
import OfferModal from './OfferModal';
import { UserContext } from '../UserContext';

const backend_API = import.meta.env.VITE_API_URL;

const Banner = ({ BannerImage, setBannerImage }) => {
    const { user } = useContext(UserContext);

    const token = JSON.parse(localStorage.getItem('token'));
    const [BannerUser, setBannerUser] = useState({});
    const [offerImage, setOfferImage] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false); // For controlling modal visibility
    const [clickedBannerId, setClickedBannerId] = useState(null);
    // console.log(BannerUser, "BannerUser");
    const GetBanner = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${backend_API}/banner/getAllBanners`, {
                headers: { 'Content-Type': 'application/json' },
            });
            if (response.status === 200) {
                const filteredBanners = response.data.banners.filter(banner => {
                    return (
                        banner?.userId?._id !== user?._id
                        //   banner.userId.address.city.toLowerCase() === user.address.city.toLowerCase()
                    );
                });

                setBannerImage(filteredBanners);
                // setBannerImage(response.data.banners);
            }
        } catch (err) {
            setError(error?.response?.data?.message || "Failed to fetch banners. Please try again later.");
            console.log(err, "Failed to fetch banners. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handleOfferBanner = async (bannerId, imageUrl) => {

        try {
            const response = await axios.get(`${backend_API}/banner/getUserByBanner/${bannerId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(response.data.user, "response.data.user");
            if (response.status === 200) {
                setBannerUser(response.data.user);
                setOfferImage(imageUrl)
                setClickedBannerId(bannerId);
                setIsModalOpen(true); // Open the modal after fetching user data
            }
        } catch (error) {
            console.error("Error fetching banner user data:", error);
        }
    };

    useEffect(() => {
        GetBanner();
    }, []);

    return (
        <section className="py-4">
            <div className="container">
                {loading ? (
                    <div className="spinner-border text-secondary text-center" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                ) : error ? (
                    <p className="error-message">{error}</p>
                ) : (
                    <div className="slider-container">
                        <Swiper
                            effect="coverflow"
                            grabCursor
                            centeredSlides
                            loop={BannerImage.length > 3}
                            autoplay={{
                                delay: 3000,
                                disableOnInteraction: false,
                            }}
                            slidesPerView="auto"
                            breakpoints={{
                                320: { slidesPerView: 3, spaceBetween: -30 },
                                640: { slidesPerView: 3, spaceBetween: 30 },
                                768: { slidesPerView: 3, spaceBetween: -30 },
                                1024: { slidesPerView: 5, spaceBetween: -30 },
                            }}
                            coverflowEffect={{
                                rotate: 0,
                                stretch: -55,
                                depth: 150,
                                modifier: 1.2,
                                slideShadows: false,
                            }}
                            navigation={{
                                nextEl: '.swiper-button-next',
                                prevEl: '.swiper-button-prev',
                                clickable: true,
                            }}
                            modules={[EffectCoverflow, Navigation, Autoplay]}
                        >
                            {BannerImage.map((image, index) => (
                                <SwiperSlide key={index}>
                                    <img
                                        src={image.imageUrl}
                                        alt={`Slide ${index + 1}`}
                                        onClick={() => handleOfferBanner(image._id, image.imageUrl)}
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                )}
            </div>

            {/* Conditionally render the modal */}
            {isModalOpen && (
                <OfferModal
                    BannerUser={BannerUser}
                    offerImage={offerImage}
                    closeModal={() => setIsModalOpen(false)}
                    allBanners={BannerImage}
                    initialBannerId={clickedBannerId} // Pass the clicked banner ID
                />
            )}
        </section>
    );
};


export default Banner;

