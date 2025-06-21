import React from 'react';
import ProfileIcon from "../../../public/User_icon.webp";
import starGold from "../../../public/starRating.png";
import starSilver from "../../../public/startSilver.png";

const BannerCard = ({ banner, onClick }) => {
    const user = banner?.userId;

    const getRating = () => {
        if (!user?.ratings?.length) return 0;
        const total = user.ratings.reduce((sum, r) => sum + r.rating, 0);
        return total / user.ratings.length;
    };

    const renderStars = (max = 10) => {
        const avg = getRating();
        return [...Array(max)].map((_, i) => (
            <img
                key={i}
                src={i < avg ? starGold : starSilver}
                alt="star"
                width={12}
                className="inline-block"
            />
        ));
    };

    return (
        <div
            className="w-56 sm:w-64 bg-white rounded-xl overflow-hidden shadow-md cursor-pointer hover:shadow-lg transition-all duration-300 p-3 flex flex-col gap-2"
            onClick={onClick}
        >
            {/* Banner Image */}
            <div className="aspect-square w-full overflow-hidden rounded-lg">
                <img
                    src={banner.imageUrl}
                    alt="Banner"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* User Info */}
            <div className="flex flex-col items-center text-center mt-2">
                <div className="w-12 h-12 rounded-full overflow-hidden border">
                    <img
                        src={user?.profilePic || ProfileIcon}
                        alt="Profile"
                        className="w-full h-full object-cover"
                    />
                </div>
                <h5 className="font-medium text-sm mt-1">{user?.name}</h5>
                <p className="text-xs text-gray-500">{user?.email}</p>
                <p className="text-xs text-gray-400 italic">{user?.businessCategory}</p>

                {user?.ratings?.length > 0 && (
                    <div className="flex items-center justify-center gap-1 mt-1">
                        {renderStars(10)}
                        <span className="text-xs text-gray-700 font-semibold">
                            ({getRating().toFixed(1)})
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BannerCard;
