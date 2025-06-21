// 📁 components/Request/ReceivedRequest.jsx
import React, { useContext, useEffect, useState } from "react";
import RequestCard from "./RequestCard";
import RatingModal from "./RatingModal";
import { UserContext } from "../../UserContext";

const ReceivedRequest = ({ data, setData }) => {

    const [selectedRequest, setSelectedRequest] = useState(null);
    const { user } = useContext(UserContext);
    // console.log(user, 'user')

    return (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mt-4">
            {data.length ? (
                data.map((request, i) => (
                    <RequestCard
                        key={i}
                        request={request}
                        userRole="receiver"
                        setData={setData}
                        onRate={() => setSelectedRequest(request)}
                    />
                ))
            ) : (
                <div className="col-span-12 text-center py-12">
                    <h5>No Requests Found</h5>
                    <p className="text-gray-500">Your received requests will appear here.</p>
                </div>
            )}

            {selectedRequest && (
                <RatingModal
                    target={selectedRequest}
                    setData={setData}
                    userRole="receiver"
                    onClose={() => setSelectedRequest(null)}
                />
            )}
        </div>
    );
};

export default ReceivedRequest;
