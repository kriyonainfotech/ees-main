import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { FCMContext } from "../context/FCMContext";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import starGold from "../../public/starRating.png";
import starSilver from "../../public/startSilver.png";
import ProfileIcon from "../../public/User_icon.webp";

const backend_API = import.meta.env.VITE_API_URL;

const SearchResult = ({ Usersdata, token }) => {
  console.log(Usersdata, "Usersdata");

  const { fcmToken } = useContext(FCMContext);
  const { user } = useContext(UserContext);
  const [requestStatus, setRequestStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [allRequest, setAllRequest] = useState([]);
  const [message, setMessage] = useState("I NEED YOUR SERVICE");
  const [rating, setRating] = useState(0);
  // const [hasPendingOrAcceptedRequest, setHasPendingOrAcceptedRequest] = useState(false);
  const navigate = useNavigate();

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

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${backend_API}/request/getUserRequests`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(response.data.requests);

        if (response.status === 200 && response.data.requests) {
          setAllRequest(response.data.requests);

          // const sendedRequests = response.data.requests.sended_requests || [];
          // const receivedRequests = response.data.requests.received_requests || [];

          // Check if ANY request is pending or accepted
          // const hasPendingOrAcceptedRequest = sendedRequests.some(
          //     req => req.status === "pending" || req.status === "accepted"
          // );

          // Determine the correct request status for the selected user
          // let status = null;
          // const userRequests = sendedRequests.filter(req => req.user?._id === Usersdata?._id);
          // if (userRequests.some(req => req.status === "pending")) {
          //     status = "pending";
          // } else if (userRequests.some(req => req.status === "accepted")) {
          //     status = "accepted";
          // } else if (userRequests.some(req => req.status === "completed" || req.status === "rated")) {
          //     status = "completed";
          // }

          setRequestStatus(status);
          // setHasPendingOrAcceptedRequest(hasPendingOrAcceptedRequest); // Store global pending/accepted status
          // console.log("Updated Request Status:", status);
          // console.log("Global Pending/Accepted Request Exists:", hasPendingOrAcceptedRequest);
        }
      } catch (error) {
        console.error(
          "Error fetching requests:",
          error.response?.data || error.message
        );
        toast(error?.response?.data?.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [Usersdata, token]);

  const sendRequest = async (
    userId,
    requestMessage = "I NEED YOUR SERVICE"
  ) => {
    if (Usersdata?.userstatus === "unavailable") {
      toast("User is unavailable");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${backend_API}/request/sentRequest`,
        { receiverId: Usersdata._id, message: requestMessage },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setRequestStatus("pending");
        toast(response.data.message || "Request Sent Successfully!");
        navigate("/work");
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(
        "Error sending request:",
        error.response?.data || error.message
      );
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  if (!Usersdata) return <p>Loading user data...</p>;

  return (
    <>
      <div className="col-12 col-md-6 col-xl-4 p-2 cursor-pointer">
        <div className="flex flex-col border overflow-hidden rounded-lg shadow-lg relative bg-white w-full h-full">
          {/* Profile Image & Status Badge */}
          <div className="relative p-2">
            <div className="flex justify-center items-center w-full h-70 border rounded-md overflow-hidden bg-gray-100">
              <img
                src={Usersdata?.profilePic || ProfileIcon}
                alt="User Profile"
                className="w-full h-full object-cover object-center"
              />
            </div>
            <div className="absolute top-3 right-3">
              <span
                className={`px-3 py-1 shadow-md rounded-full text-xs font-medium 
          ${Usersdata?.userstatus === "available"
                    ? "bg-green-600 text-white"
                    : "bg-red-600 text-white"
                  }`}
              >
                {Usersdata?.userstatus}
              </span>
            </div>
          </div>

          {/* User Info */}
          <div className="p-4 text-start">
            <div className="flex justify-between items-center pb-3">
              <h4 className="font-bold text-lg capitalize">
                {Usersdata?.name}
              </h4>
              <h6 className="font-medium text-gray-700 py-1 capitalize">
                {Usersdata?.businessCategory.join(", ")}
              </h6>
            </div>
            <p className="text-gray-500 text-sm">
              {`${Usersdata?.address?.area}, ${Usersdata?.address?.city}, ${Usersdata?.address?.state}, ${Usersdata?.address?.country}`}{" "}
              <br />
              {`${Usersdata?.address?.pincode}`}
            </p>

            {/* Ratings */}
            <div className="py-2 flex justify-start items-center">
              <p className="text-xs font-medium flex justify-center items-center">
                User :{" "}
                <span className="flex ">
                  {renderStars(Usersdata?.userAverageRating || 0, 10)}
                </span>
              </p>
              <span className="ml-2 text-sm font-medium">
                {" "}
                {Usersdata.userAverageRating > 0
                  ? Usersdata.userAverageRating.toFixed(1)
                  : "0.0"}
              </span>
            </div>
            <div className="py-2 flex justify-start items-center">
              <p className="text-xs font-medium flex justify-center items-center">
                Provider :
                <span className="flex ">
                  {renderStars(Usersdata?.providerAverageRating || 0, 10)}
                </span>
              </p>
              <span className="ml-2 text-sm font-medium">
                {" "}
                {Usersdata.providerAverageRating > 0
                  ? Usersdata.providerAverageRating.toFixed(1)
                  : "0.0"}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="mt-3">
              {requestStatus === "pending" || requestStatus === "accepted" ? (
                <div className="flex gap-2 mt-3">
                  <Link
                    href={`tel:${Usersdata?.phone}`}
                    className="bg-green-600 text-white font-semibold px-4 py-2 rounded-md shadow-md hover:bg-green-700 w-1/2 text-center"
                  >
                    Contact Now
                  </Link>
                  <button
                    className="bg-warning text-white font-semibold px-4 py-2 rounded-md shadow-md hover:bg-orange-700 transition duration-200 w-1/2"
                    onClick={() => navigate("/work")} // Redirect to request details page
                  >
                    View Request
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <button
                    className={`font-semibold px-4 py-2 w-full rounded-md shadow-md transition duration-200 bg-blue-600 text-white hover:bg-blue-700 `}
                    data-bs-toggle="modal"
                    data-bs-target={`#modal-${Usersdata._id}`}
                  // disabled={hasPendingOrAcceptedRequest}
                  >
                    Send Request
                  </button>
                  {/* {hasPendingOrAcceptedRequest && ( 
                                        <p className="text-sm text-red-600 mt-1">⚠️ You already have a request in progress.</p>
                                    )} */}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal */}
        <div
          className="modal fade"
          id={`modal-${Usersdata._id}`}
          tabIndex={-1}
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-lg shadow-lg">
              <div className="modal-header border-b">
                <h5 className="text-xl font-semibold">
                  Send Request to {Usersdata.name}
                </h5>
                <button
                  type="button"
                  className="btn-close text-white p-3"
                  data-bs-dismiss="modal"
                ></button>
              </div>
              <div className="modal-body py-4">
                <h4 className="text-lg capitalize font-medium mb-2">
                  {Usersdata.businessCategory.join(", ")}
                </h4>
                <textarea
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring focus:ring-blue-300 resize-none"
                  rows="1"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your message..."
                />
              </div>
              <div className="modal-footer border-t pt-3 flex justify-end">
                <button
                  type="button"
                  className="bg-gray-500 text-white px-4 py-2 rounded-md"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button
                  type="button"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200 ml-2"
                  onClick={() => sendRequest(Usersdata._id)}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm text-white"></span>
                  ) : (
                    "Send Request"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchResult;
