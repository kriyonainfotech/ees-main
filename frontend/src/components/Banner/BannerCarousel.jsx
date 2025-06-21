import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import BannerCard from './BannerCard';
import axios from 'axios';
const backend_API = import.meta.env.VITE_API_URL;
const BannerCarousel = ({ banners, onClickBanner }) => {

    const token = JSON.parse(localStorage.getItem('token'));

    const handleOfferBanner = async (bannerId, imageUrl) => {
        try {
            const res = await axios.get(`${backend_API}/banner/getUserByBanner/${bannerId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setBannerUser(res.data.user);
            setOfferImage(imageUrl);
            setClickedBannerId(bannerId);
            setIsModalOpen(true);
        } catch (err) {
            console.error("Error fetching banner user:", err);
        }
    };

    return (
        <div className="slider-container">
            <Swiper
                effect="coverflow"
                grabCursor
                centeredSlides
                loop={banners.length > 3}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
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
                modules={[EffectCoverflow, Navigation, Autoplay]}
            >
                {banners.map((banner, index) => (
                    <SwiperSlide key={banner._id || index}>
                        <BannerCard banner={banner}
                            onClick={() => handleOfferBanner(banner._id, banner.imageUrl)} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default BannerCarousel;
