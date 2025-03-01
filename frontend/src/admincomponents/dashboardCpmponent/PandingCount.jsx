import React from 'react'
import { FaUserClock } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const PandingCount = ({ pandingcnt }) => {
    const navigate = useNavigate()
    return (
        <div
            className="shadow-lg rounded-xl p-4 bg-white hover:shadow-xl transition duration-300 cursor-pointer"
            onClick={() => navigate("/admin/aprove")}
        >
            <div className="flex items-center space-x-4">
                {/* Icon */}
                <div className="w-14 h-14 flex items-center justify-center bg-yellow-500 text-white rounded-full">
                    <FaUserClock className="text-2xl" />
                </div>

                {/* Text Content */}
                <div>
                    <p className="text-gray-600 text-sm font-medium">Pending Approvals</p>
                    <h5 className="text-xl font-semibold">{pandingcnt.length}</h5>
                </div>
            </div>
        </div>
    );
}

export default PandingCount