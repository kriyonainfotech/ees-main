import React from 'react'
import { FaUserCheck } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const UserCount = ({ Users }) => {
    const navigate = useNavigate()
    return (
        <div
            className="border rounded-xl p-4 bg-white hover:shadow-lg transition duration-300 cursor-pointer"
            onClick={() => navigate("/admin/users")}
        >
            <div className="flex items-center space-x-4">
                {/* Icon */}
                <div className="w-14 h-14 flex items-center justify-center bg-green-600 text-white rounded-full">
                    <FaUserCheck className="text-2xl" />
                </div>

                {/* Text Content */}
                <div>
                    <p className="text-gray-600 text-sm font-medium">Approved Users</p>
                    <h5 className="text-xl font-semibold">{Users.length}</h5>
                </div>
            </div>
        </div>
    );
}

export default UserCount