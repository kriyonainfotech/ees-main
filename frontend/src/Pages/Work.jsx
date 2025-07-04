// import React, { useEffect, useState, useCallback, useContext } from "react";
// import AdminNavbar from "../admincomponents/AdminNavbar";
// import UserSideBar from "../components/UserSideBar";
// import Recievedrequest from "../components/Recievedrequest";
// import Senedrequest from "../components/Senedrequest";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import ProfileSidebar from "../components/ProfileSidebar";
// import Footer from "../components/Footer";
// import { TailSpin } from "react-loader-spinner";
// import toast from "react-hot-toast";
// import { UserContext } from "../UserContext";

// const backend_API = import.meta.env.VITE_API_URL;

// const Work = () => {
//   const token = JSON.parse(localStorage.getItem("token")) || null;
//   const [receivedRequest, setReceivedRequest] = useState([]);
//   const [sendedRequest, setSendedRequest] = useState([]);
//   const [currentRequest, setCurrentRequest] = useState(
//     localStorage.getItem("currentRequest") || "Sended Request"
//   );
//   const [loading, setLoading] = useState(true);
//   const [showContent, setShowContent] = useState(false);
//   const { user } = useContext(UserContext);
//   useEffect(() => {
//     setTimeout(() => setShowContent(true), 50);
//   }, []);

//   console.log(receivedRequest, "receivedRequest");

//   // Save currentRequest to localStorage
//   useEffect(() => {
//     localStorage.setItem("currentRequest", currentRequest);
//   }, [currentRequest]);

//   const requests = [
//     { id: 1, name: "Sended Request" },
//     { id: 2, name: "Received Request" },
//   ];

//   const fetchRequests = useCallback(
//     async (currentRequest) => {
//       if (!token) {
//         console.warn("⚠️ No authentication token found.");
//         toast.error("Authentication required!");
//         setLoading(false);
//         return;
//       }
//       console.log("Fetching requests...", currentRequest);
//       setLoading(true);
//       let endpoint =
//         currentRequest === "Sended Request"
//           ? `${backend_API}/request/getSentRequests` // Corrected typo
//           : `${backend_API}/request/getReceivedRequests`;

//       try {
//         const response = await axios.get(endpoint, {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         console.log(response.data, "response----------------------------.data");

//         if (response.status === 200 && response.data) {
//           const priority = {
//             pending: 1,
//             accepted: 2,
//             completed: 3,
//             rated: 4,
//             rejected: 5,
//           };

//           const sortedRequests =
//             (currentRequest === "Sended Request"
//               ? response.data.sendedRequests
//               : response.data.receivedRequests
//             )?.sort((a, b) => {
//               // Sort by status priority first, then by createdAt (most recent first)
//               const statusComparison =
//                 (priority[a.status] || 99) - (priority[b.status] || 99);
//               if (statusComparison !== 0) return statusComparison;
//               return new Date(b.date) - new Date(a.date); // Recent requests first
//             }) || [];

//           if (currentRequest === "Sended Request") {
//             setSendedRequest(sortedRequests);
//           } else {
//             setReceivedRequest(sortedRequests);
//           }
//         } else {
//           toast.error(response?.data?.message || "Error fetching requests");
//         }
//       } catch (error) {
//         console.log(error, "error");
//         toast.error(error?.response?.data?.message || "Server error");
//       } finally {
//         setLoading(false);
//       }
//     },
//     [token, currentRequest]
//   );

//   useEffect(() => {
//     fetchRequests(currentRequest);
//   }, [currentRequest]);

//   return showContent ? (
//     <>
//       <AdminNavbar />
//       <UserSideBar />
//       <ProfileSidebar />

//       <div className="mt-40">
//         <section className="bg-gray-50 py-5">
//           <div className="container">
//             <div className="row">
//               {/* Sticky Buttons in Current Position */}
//               <div
//                 className="col-12 d-flex gap-3  "
//                 style={{
//                   position: "sticky",
//                   top: "0",
//                   zIndex: 10,
//                   padding: "20px 10px",
//                 }}
//               >
//                 {requests.map((req) => (
//                   <div key={req.id} className="receivReqBtn">
//                     <Link
//                       className={`btn rounded-lg ${currentRequest === req.name
//                         ? "btn-success text-white"
//                         : "bg-none border-black text-black"
//                         }`}
//                       onClick={() => setCurrentRequest(req.name)}
//                     >
//                       {req.name}
//                     </Link>
//                   </div>
//                 ))}
//               </div>

//               {/* Scrollable Requests */}
//               <div              >
//                 {loading ? (
//                   <div
//                     className="d-flex justify-content-center align-items-center"
//                     style={{ minHeight: "300px" }}
//                   >
//                     <TailSpin color="#00BFFF" height={50} width={50} />
//                   </div>
//                 ) : currentRequest === "Received Request" ? (
//                   <Recievedrequest
//                     receivedRequest={receivedRequest}
//                     setReceivedRequest={setReceivedRequest}
//                     user={user}
//                   />
//                 ) : (
//                   <Senedrequest
//                     sendedRequest={sendedRequest}
//                     setSendedRequest={setSendedRequest}
//                   />
//                 )}
//               </div>
//             </div>
//           </div>
//         </section>
//       </div>

//       <Footer />
//     </>
//   ) : null;
// };

// export default Work;
import RequestTabs from "../components/Request/RequestTabs";
import SendedRequest from "../components/Request/SendedRequest";
import ReceivedRequest from "../components/Request/ReceivedRequest";
import useRequestFetcher from "../components/Request/useRequestFetcher";
import AdminNavbar from "../admincomponents/AdminNavbar";
import ProfileSidebar from "../components/ProfileSidebar";
import UserSideBar from "../components/UserSideBar";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";

const Work = () => {
  const { currentTab, setCurrentTab, sendedRequest, receivedRequest, loading, user } = useRequestFetcher();

  const [showContent, setShowContent] = useState(false);
  const [data, setData] = useState([]); // 🆕 added for tracking updated data

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 50); // small delay
    return () => clearTimeout(timer); // cleanup
  }, []);

  return showContent ? (
    <>
      <AdminNavbar />
      <UserSideBar />
      <ProfileSidebar />

      <div className="mt-40">
        <section className="bg-gray-50 py-5">
          <div className="container">
            <RequestTabs currentTab={currentTab} setCurrentTab={setCurrentTab} />

            {loading ? (
              // <LoadingSpinner />
              <p className="loader"></p>
            ) : currentTab === "Received Request" ? (
              <ReceivedRequest data={receivedRequest} user={user} setData={setData} />
            ) : (
              <SendedRequest data={sendedRequest} user={user} setData={setData} />
            )}
          </div>
        </section>
      </div>

      <Footer />
    </>
  ) : null;
};

export default Work;