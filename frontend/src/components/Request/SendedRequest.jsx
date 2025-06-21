// 📁 components/Request/SendedRequest.jsx
import React, { useContext, useEffect, useState } from "react";
import RatingModal from "./RatingModal";
import RequestCard from "./RequestCard";
import { UserContext } from "../../UserContext";

const SendedRequest = ({ data, setData }) => {
    const { user } = useContext(UserContext);
    // console.log(user, 'user')
    const [selectedRequest, setSelectedRequest] = useState(null);

    return (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mt-4">
            {data.length ? (
                data.map((request, i) => (
                    <RequestCard
                        key={i}
                        request={request}
                        userRole="sender"
                        setData={setData}
                        onRate={() => setSelectedRequest(request)}
                    />
                ))
            ) : (
                <div className="col-span-12 text-center py-12">
                    <h5>No Requests Found</h5>
                    <p className="text-gray-500">Your sent requests will appear here.</p>
                </div>
            )}

            {selectedRequest && (
                <RatingModal
                    target={selectedRequest}
                    setData={setData}
                    userRole="sender"
                    onClose={() => setSelectedRequest(null)}
                />
            )}
        </div>
    );
};

export default SendedRequest;