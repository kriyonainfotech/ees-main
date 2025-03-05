import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { FaPhone, FaStar } from "react-icons/fa6";
import { toast } from "react-toastify";
import { format } from "date-fns";
import starGold from "../../public/starRating.png";
import starSilver from "../../public/startSilver.png";
import ProfileIcon from "../../public/User_icon.webp";
import { UserContext } from "../UserContext";

const backend_API = import.meta.env.VITE_API_URL;

const ReceivedRequest = ({ receivedRequest, setReceivedRequest, user }) => {
  console.log(user, "useewr");
  ``;
  console.log(receivedRequest, "receivedRequest");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [status, setStatus] = useState(null);
  const [rating, setRating] = useState(0);

  const token = JSON.parse(localStorage.getItem("token"));

  const handleAction = async (id, requestId, status) => {
    console.log(id, status, requestId, "id, status, requestId");
    try {
      const endpoint =
        status === "cancelled" ? "cancelRequest" : "updateRequestStatus";
      const response = await axios.post(
        `${backend_API}/request/${endpoint}`,
        { userId: id, requestId, status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response, "response");
      if (response.status === 200) {
        toast.success(`Request ${status}`);
        setStatus(status);
        setReceivedRequest((prev) =>
          prev.map((req) =>
            req.requestId === requestId ? { ...req, status } : req
          )
        );
      } else {
        toast.error("Failed to update request");
      }
    } catch (error) {
      console.log(error, "error");
      toast.error("Failed to update request");
    }
  };
  const openModal = (request) => {
    setSelectedRequest(request);
  };

  const closeModal = () => {
    setSelectedRequest(null);
    setRating(0);
  };
  const submitRating = async (
    requestId,
    receiverId,
    ratingValue,
    comment = ""
  ) => {
    console.log(
      requestId,
      receiverId,
      ratingValue,
      comment,
      "requestId, receiverId, ratingValue, comment"
    );
    if (!requestId || !receiverId || !ratingValue) {
      console.error("Missing rating data");
      return;
    }

    try {
      const response = await axios.post(
        `${backend_API}/user/rate`,
        {
          requestId,
          receiverId,
          ratingValue,
          comment,
        },
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        } // ✅ Ensures cookies (if using JWT authentication),
      );
      console.log("Rating submitted successfully:", response.data);
      if (response.status === 200) {
        toast.success(response.data.message || "Rating submitted successfully");
        // handleAction(receiverId, requestId, "rated", ratingValue); // ✅ Mark request as rated
        closeModal();
      } else {
        toast.error("Failed to submit rating");
      }
    } catch (error) {
      console.log("Error submitting rating:", error || error.message);
      toast.error("Failed to submit rating");
    }
  };

  const renderStars = (
    ratingValue = 0,
    maxRating = 10,
    isClickable = false
  ) => {
    return Array.from({ length: maxRating }, (_, i) => (
      <img
        key={i}
        src={i < ratingValue ? starGold : starSilver}
        alt={i < ratingValue ? "Filled Star" : "Empty Star"}
        width={16}
        className={`cursor-pointer ${isClickable ? "hover:opacity-80" : ""}`}
        onClick={isClickable ? () => setRating(i + 1) : undefined}
      />
    ));
  };

  const cancelRequest = (requestId) => {
    const userId = user?._id;

    if (!userId) {
      toast.error("User not found!");
      return;
    }

    toast.info(
      <div>
        <p>Are you sure you want to cancel this request?</p>
        <div className="flex justify-end gap-3 mt-2">
          <button
            className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
            onClick={async () => {
              toast.dismiss(); // Close toast before making API call
              try {
                const { data } = await axios.delete(
                  `${backend_API}/request/deleteRequest`,
                  {
                    data: { requestId, userId },
                  }
                );

                if (data.success) {
                  toast.success("Request deleted successfully!");
                  setTimeout(() => {
                    window.location.reload(); // Reload the page after 5 seconds
                  }, 4000); // 5000ms = 5 seconds
                  // Optionally update UI (e.g., remove request from state)
                } else {
                  toast.error(data.message || "Failed to delete request.");
                }
              } catch (error) {
                console.error("Error deleting request:", error);
                toast.error(
                  error.response?.data?.message ||
                    "An error occurred while deleting the request."
                );
              }
            }}
          >
            Yes
          </button>
          <button
            className="px-3 py-1 bg-gray-400 text-white rounded-md hover:bg-gray-500"
            onClick={() => toast.dismiss()} // Close toast if No is clicked
          >
            No
          </button>
        </div>
      </div>,
      { autoClose: false, closeOnClick: false }
    );
  };

  return (
    <div className="mt-0">
      <section>
        <div className="grid  grid-cols-2 xl:grid-cols-4 gap-4 mt-4">
          {receivedRequest?.length ? (
            receivedRequest.map((request, i) => (
              <div
                key={i}
                title={
                  request.status === "cancelled"
                    ? "Sender has cancelled the request."
                    : request.status === "rejected"
                    ? "Receiver has rejected the request."
                    : request.status === "completed"
                    ? "Request completed, rate the user."
                    : request.status === "accepted"
                    ? "Request accepted, contact the user."
                    : ""
                }
                className={`bg-white rounded-xl border  overflow-hidden`}
              >
                <div className="relative">
                  <img
                    className="w-full h-[250px] md:h-[400px] object-cover object-top"
                    src={request.profilePic || ProfileIcon}
                    alt="Profile"
                  />
                  <span
                    className={`absolute top-4 right-4 py-2 px-3 text-xs rounded-full font-semibold text-white ${
                      request.status === "accepted"
                        ? "bg-blue-600"
                        : request.status === "completed"
                        ? "bg-green-600"
                        : "bg-yellow-500"
                    }`}
                  >
                    {request.status || "Pending"}
                  </span>
                </div>

                {/* <div className="p-3 ">
                  <h4 className="text-lg font-semibold text-gray-900">
                    {request.name || "Unknown User"}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {request.email || "No email provided"}
                  </p>

                  <div className="flex justify-between items-center mt-2">
                    <p className="text-orange-600 text-sm font-medium capitalize">
                      {request.businessCategory?.join(", ") || "N/A"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(request.date), "PPpp")}
                    </p>
                  </div>

                  <div className="flex items-center mt-2">
                    <span className="text-gray-800 text-sm pe-2">
                      User Rating:
                    </span>
                    {renderStars(request?.userrating?.value || 0, 10)}
                    <span className="text-gray-700">
                      {request?.userrating?.value || 0}
                    </span>
                  </div>

                  <div className="mt-4 flex gap-2">
                    {request.status === "pending" && (
                      <>
                        <button
                          className="p-2 text-sm flex-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                          onClick={() =>
                            handleAction(
                              request.senderId,
                              request.requestId,
                              "accepted"
                            )
                          }
                        >
                          Accept
                        </button>
                        <button
                          className="p-2 text-sm flex-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                          onClick={() =>
                            handleAction(
                              request.senderId,
                              request.requestId,
                              "rejected"
                            )
                          }
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {request.status === "accepted" && (
                      <>
                        <a
                          href={`tel:${request.phone}`}
                          className="flex-1 flex items-center justify-center gap-2 p-2 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700 transition"
                        >
                          <FaPhone /> Contact Now
                        </a>
                        <button
                          className="p-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                          onClick={() =>
                            handleAction(
                              request.senderId,
                              request.requestId,
                              "completed"
                            )
                          }
                        >
                          Completed
                        </button>
                      </>
                    )}
                    {request.status === "completed" && (
                      <button
                        className="p-2 text-sm bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition"
                        onClick={() => openModal(request)}
                      >
                        Rate User
                      </button>
                    )}
                  </div>
                </div> */}

                <div className="p-3 sm:w-full">
                  <h4 className="text-lg font-semibold text-gray-900 sm:w-full block">
                    {request.name || "Unknown User"}
                  </h4>

                  <div className="flex  flex-col sm:flex-row justify-between items-center">
                    <p className="text-orange-600 text-sm font-medium capitalize w-full block mt-2">
                      {request.businessCategory?.join(", ") || "N/A"}
                    </p>
                    <p className="text-xs text-gray-500 w-full block mt-1">
                      {format(new Date(request.date), "PPpp")}
                    </p>
                  </div>

                  <div className="flex justify-between items-center  mt-2">
                    <span className="text-gray-800 text-sm  ">
                      User Rating:
                    </span>
                    <div className="flex gap-1 overflow-auto  mt-1">
                      {renderStars(request?.userrating?.value || 0, 10)}
                    </div>
                    <span className="text-gray-700 block mt-1">
                      {request?.userrating?.value || 0}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-col md:flex-row gap-2">
                    {request.status === "pending" && (
                      <>
                        <button
                          className="p-2 text-sm w-full md:flex-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                          onClick={() =>
                            handleAction(
                              request.senderId,
                              request.requestId,
                              "accepted"
                            )
                          }
                        >
                          Accept
                        </button>
                        <button
                          className="p-2 text-sm w-full md:flex-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                          onClick={() =>
                            handleAction(
                              request.senderId,
                              request.requestId,
                              "rejected"
                            )
                          }
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {request.status === "accepted" && (
                      <>
                        <a
                          href={`tel:${request.phone}`}
                          className="w-full md:flex-1 flex items-center justify-center gap-2 p-2 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700 transition"
                        >
                          <FaPhone /> Contact Now
                        </a>
                        <button
                          className="p-2 text-sm w-full md:flex-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                          onClick={() =>
                            handleAction(
                              request.senderId,
                              request.requestId,
                              "completed"
                            )
                          }
                        >
                          Completed
                        </button>
                      </>
                    )}
                    {request.status === "completed" && (
                      <button
                        className="p-2 text-sm w-full bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition"
                        onClick={() => openModal(request)}
                      >
                        Rate User
                      </button>
                    )}
                    {request.status === "rated" && (
                      <button
                        className="w-full sm:w-auto p-2 bg-gray-600 text-white rounded-lg hover:bg-red-900 transition"
                        onClick={() => cancelRequest(request.requestId)}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <h5>No Requests Found</h5>
              <p className="text-gray-500">
                Your received requests will appear here.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Rating Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">
              Rate {selectedRequest.name}
            </h3>
            <div className="flex justify-center mb-4">
              {renderStars(rating, 10, true)}
            </div>
            <div className="flex justify-end gap-2">
              <button
                className="p-2 text-sm bg-gray-400 text-white rounded-lg"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className="p-2 text-sm bg-blue-600 text-white rounded-lg"
                onClick={() =>
                  submitRating(
                    selectedRequest.requestId,
                    selectedRequest.senderId,
                    rating
                  )
                }
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceivedRequest;
