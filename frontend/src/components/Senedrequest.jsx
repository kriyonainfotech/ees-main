import React, { useContext, useState } from "react";
import { FaPhone } from "react-icons/fa6";
import { toast } from "react-toastify";
import { format } from "date-fns";
import starGold from "../../public/starRating.png";
import starSilver from "../../public/startSilver.png";
import ProfileIcon from "../../public/User_icon.webp";
import axios from "axios";
import { UserContext } from "../UserContext";
const backend_API = import.meta.env.VITE_API_URL;

const Senedrequest = ({ sendedRequest, setSendedRequest }) => {
  const { user } = useContext(UserContext);

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [status, setStatus] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const token = JSON.parse(localStorage.getItem("token"));
  console.log(sendedRequest, "sendedRequest");

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
  const handleAction = async (id, requestId, newStatus) => {
    try {
      const response = await axios.post(
        `${backend_API}/request/updateRequestStatus`,
        { userId: id, requestId, status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        toast.success(`Request ${newStatus}`);
        setStatus(newStatus);
        setSendedRequest((prev) =>
          prev.map((req) =>
            req.requestId === requestId ? { ...req, status: newStatus } : req
          )
        );
      } else {
        toast.error("Failed to update request status");
      }
    } catch (error) {
      toast.error("Failed to update request status");
    }
  };
  const openModal = (request) => {
    setSelectedRequest(request);
  };
  const closeModal = () => {
    setSelectedRequest(null);
    setRating(0);
  };
  const submitRating = async (senderId, requestId, ratingValue, comment) => {
    console.log(
      senderId,
      requestId,
      ratingValue, comment,
      "senderId, requestId, ratingValue, comment"
    );
    if (!selectedRequest) return;

    try {
      const response = await axios.post(
        `${backend_API}/user/rate`,
        {
          receiverId: senderId,
          requestId: requestId,
          ratingValue: ratingValue,
          comment: comment,
        },
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        toast.success(response.data.message || "Rating submitted successfully");
        setSendedRequest((prev) =>
          prev.map((req) =>
            req.requestId === requestId
              ? { ...req, userRating: ratingValue, status: "rated" } // ✅ Update status
              : req
          )
        );
        closeModal();
      } else {
        console.log(response, "response");
        toast.error("Failed to submit rating.");
      }
    } catch (error) {
      console.log(error, "error");
      toast.error(error?.response?.data?.message || "Failed to submit rating.");
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

  return (
    <div className="mt-0">
      <section>
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mt-4">
          {sendedRequest?.length ? (
            sendedRequest.map((send, i) => (
              <div
                key={i}
                title={
                  send.status === "rejected"
                    ? "Receiver has rejected the request."
                    : send.status === "completed"
                      ? "Request completed, rate the user"
                      : send.status === "accepted"
                        ? "Request accepted, contact the user"
                        : ""
                }
                className={`bg-white rounded-xl border overflow-hidden`}
              >
                <div className="relative">
                  <img
                    className="w-full h-[250px] md:h-[350px] object-cover object-center"
                    src={send.profilePic || ProfileIcon}
                    alt="Profile"
                  />
                  <span
                    className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${send.status === "accepted"
                      ? "bg-blue-600"
                      : send.status === "completed"
                        ? "bg-green-600"
                        : send.status === "rejected"
                          ? "bg-red-600"
                          : "bg-yellow-500"
                      } text-white`}
                  >
                    {send.status || "Pending"}
                  </span>
                </div>

                <div className="p-3 w-full sm:w-full">
                  <h4 className="text-lg font-semibold text-gray-900">
                    {send.name || "Unknown User"}
                  </h4>

                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-2">
                    <p className="text-orange-600 text-sm font-medium capitalize">
                      {send.businessCategory?.join(", ") || "N/A"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(send.date), "PPpp")}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center mt-2 text-sm">
                    <span className="text-gray-800 pe-2 whitespace-nowrap">
                      Provider Rating
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {renderStars(send?.providerRatingbySender?.value || 0, 10)}
                    </div>
                    <span className="ml-1 text-gray-700">
                      {send?.providerRatingbySender?.value || 0}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center mt-2 text-sm">
                    <span className="text-gray-800 pe-2 whitespace-nowrap">
                      User Rating:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {renderStars(send?.userRatingbyprovider?.value || 0, 10)}
                    </div>
                    <span className="ml-1 text-gray-700">
                      {send?.userRatingbyprovider?.value || 0}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-col sm:flex-row gap-2 w-full">
                    {send.status === "pending" && (
                      <>
                        <a
                          href={`tel:${send.phone}`}
                          className="w-full sm:flex-1 text-sm flex items-center justify-center gap-2 p-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <FaPhone /> Contact Now
                        </a>
                        <button
                          className="w-full sm:w-auto p-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                          onClick={() => cancelRequest(send.requestId)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                    {send.status === "accepted" && (
                      <>
                        <a
                          href={`tel:${send.phone}`}
                          className="w-full sm:flex-1 flex items-center justify-center gap-2 p-2 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <FaPhone /> Contact Now
                        </a>
                        <button
                          className="w-full sm:w-auto p-2 bg-blue-600 text-sm text-white rounded-lg hover:bg-blue-700 transition"
                          onClick={() =>
                            handleAction(
                              send.receiverId,
                              send.requestId,
                              "completed"
                            )
                          }
                        >
                          Completed
                        </button>
                      </>
                    )}
                    {send.status === "completed" && (
                      <button
                        className="p-2 text-sm w-full bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition"
                        onClick={() => openModal(send)}
                      >
                        Rate Service Provider
                      </button>
                    )}
                    {send.status === "cancelled" && (
                      <button
                        className="w-full sm:w-auto p-2 bg-red-600 text-white rounded-lg hover:bg-red-900 transition"
                        onClick={() => cancelRequest(send.requestId)}
                      >
                        Delete Request
                      </button>
                    )}
                    {(send.status === "rejected" ||
                      send.status === "rated") && (
                        <button
                          className="w-full sm:w-auto p-2 bg-gray-600 text-white rounded-lg hover:bg-red-900 transition"
                          onClick={() => cancelRequest(send.requestId)}
                        >
                          Remove
                        </button>
                      )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-12 text-center py-12">
              <h5>No Requests Found</h5>
              <p className="text-gray-500">
                Your sent requests will appear here.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Rating Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <div className="flex flex-wrap items-center justify-between pb-2">
              <h3 className="text-lg font-semibold mb-1">
                Rate {selectedRequest.name}
              </h3>

              {/* Star Rating */}
              <div className="flex justify-center">
                {renderStars(rating, 10, true)}
              </div>
            </div>

            {/* Comment Input */}
            <textarea
              className="w-full border border-gray-300 rounded-md p-2 mb-4 resize-none"
              rows={3}
              placeholder="Write a comment ..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />


            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-400 text-white rounded-lg"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                onClick={() =>
                  submitRating(
                    selectedRequest.receiverId,
                    selectedRequest.requestId,
                    rating, comment
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

export default Senedrequest;
