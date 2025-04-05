import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdOutlineDeleteOutline, MdDateRange } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import AdminHeader from "../admincomponents/AdminHeader";
import AdminSidebar from "../admincomponents/AdminSidebar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import { SiTicktick } from "react-icons/si";
import { RxCrossCircled } from "react-icons/rx";

const backend_API = import.meta.env.VITE_API_URL;

const UserDetailsModal = ({ user, onClose, onApprove, setSelectedUser }) => {
  const [zoomedIndex, setZoomedIndex] = useState(null);
  const [zoomedProfile, setZoomedProfile] = useState(false);
  const [permanentAddress, setPermanentAddress] = useState(
    user.permanentAddress || ""
  );
  const [aadharNumber, setAadharNumber] = useState(user.aadharNumber || "");
  const [loading, setLoading] = useState(false);
  const [profilePic, setProfilePic] = useState(user.profilePic);
  const [userId, setUserId] = useState(user._id);
  const paymentHistory = user?.paymentHistory || [];
  const paymentStatus =
    paymentHistory.length > 0 ? paymentHistory[0]?.status : "N/A";

  const aadharImages = [user.frontAadhar, user.backAadhar];

  if (!user) return null;

  const handleSave = async () => {
    console.log(
      permanentAddress,
      aadharNumber,
      userId,
      "permanentAddress, aadharNumber"
    );
    try {
      setLoading(true);
      const response = await axios.put(
        `${backend_API}/auth/updateUserAddressAndAadhar`,
        {
          permanentAddress,
          aadharNumber,
          userId,
        }
      );
      console.log(response.data);
      if (response.status === 200) {
        toast.success(response?.data?.message);
      }
    } catch (error) {
      console.log("Error updating user details:", error);
      toast.error(
        error?.response?.data?.message || "Failed to update user details"
      );
    } finally {
      setLoading(false);
    }
  };

  const openZoomModal = (index) => {
    setZoomedIndex(index);
  };

  const closeZoomModal = () => {
    setZoomedIndex(null);
  };

  const handlePrevNext = (step) => {
    setZoomedIndex(
      (prevIndex) =>
        (prevIndex + step + aadharImages.length) % aadharImages.length
    );
  };

  // const handleDeleteAadhar = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await axios.post(`${backend_API}/auth/reset-ekyc`, {
  //       data: { userId }, // ✅ Correct way to send data in DELETE request
  //     });
  //     if (response.status === 200) {
  //       toast.success(response?.data?.message);
  //       onClose(); // Close modal after successful deletion
  //     }
  //   } catch (error) {
  //     console.error("Error deleting Aadhar:", error);
  //     toast.error(
  //       error?.response?.data?.message || "Failed to delete Aadhar images"
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleReseteKYC = () => {
    toast.info(
      <div>
        Are you sure you want to reset eKYC? This action will permanently remove
        all KYC related data.
        <div className="flex gap-4 mt-2">
          <button
            className="bg-red-600 text-white px-3 py-1 rounded-md"
            onClick={confirmDeleteAadhar}
          >
            Yes
          </button>
          <button
            className="bg-gray-400 text-white px-3 py-1 rounded-md"
            onClick={() => toast.dismiss()}
          >
            No
          </button>
        </div>
      </div>,
      { autoClose: false, closeOnClick: false }
    );
  };

  const confirmDeleteAadhar = async () => {
    toast.dismiss(); // Close the confirmation toast
    try {
      setLoading(true);
      const response = await axios.post(`${backend_API}/auth/reset-ekyc`, {
        userId: userId,
      });

      if (response.status === 200) {
        toast.success(response?.data?.message);
        const updatedUser = {
          ...user,
          ekyc: null,
          frontAadhar: null,
          backAadhar: null,
        };
        setSelectedUser(updatedUser);
        onClose(); // Close modal after successful deletion
      }
    } catch (error) {
      console.error("Error deleting Aadhar:", error);
      toast.error(
        error?.response?.data?.message || "Failed to delete Aadhar images"
      );
    } finally {
      setLoading(false);
    }
  };

  const updateProfilePic = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${backend_API}/auth/update-profile-pic`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user._id,
          profilePic:
            "https://res.cloudinary.com/dcfm0aowt/image/upload/v1739604108/user/phnbhd4onynoetzdxqjp.jpg",
        }),
      });

      const data = await response.json();
      console.log(data, "response of allow reset");
      if (response.ok) {
        setProfilePic(data.profilePic); // Update UI
        toast.success("Profile picture updated successfully!");
      } else {
        toast.error(data.message || "Failed to update profile picture.");
      }
    } catch (error) {
      console.log("API Error:", error);
      toast.error("Something went wrong while updating profile picture.");
    } finally {
      setLoading(false);
    }
  };

  const resetProfilePic = () => {
    setProfilePic(user.profilePic); // Reset to original
    toast.info("Profile picture reset.");
  };

  const capturePayment = async (paymentId) => {
    try {
      const res = await axios.post(`${backend_API}/payment/capture-payment`, {
        paymentId,
        userId,
      });
      console.log(res, "data");
      alert(res.data.message);
    } catch (error) {
      alert("Error capturing payment");
    }
  };

  const handleVerifyPayment = async () => {
    try {
      const response = await axios.post(
        `${backend_API}/payment/verify-capture-payment`,
        {
          userId: user._id,
          // paymentId
        }
      );

      if (response.data.success) {
        toast("Payment verified successfully!");
        // setUser((prevUser) => ({ ...prevUser, paymentVerified: true })); // Update state
      } else {
        alert("Error: " + response.data.message);
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      toast("Something went wrong!");
    }
  };

  return (
    <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="modal-content bg-white p-2 rounded shadow-lg w-full sm:w-3/4 md:w-1/2 lg:w-1/3 max-w-4xl h-[80vh] overflow-hidden">
        <h2 className="text-xl font-bold py-3 text-center border">
          User Details
        </h2>
        <div className="modal-body overflow-y-auto">
          <table className="table-auto w-full border-collapse border border-gray-300 bg-light">
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-semibold">
                  Profile Picture
                </td>
                <td className="border border-gray-300 px-4 py-2 flex items-center justify-between gap-2">
                  <img
                    src={profilePic}
                    width={50}
                    alt="Profile"
                    className="cursor-pointer"
                    onClick={() => setZoomedProfile(true)}
                  />
                  <button
                    onClick={updateProfilePic}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "Allow Update"}
                  </button>
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-semibold">
                  Name
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {user.name}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-semibold">
                  Email
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {user.email}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-semibold">
                  Contact
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {user.phone}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-semibold">
                  Payment Status
                </td>
                <td className="border border-gray-300 px-4 py-2 flex justify-between font-semibold text-blue-600">
                  <p>{paymentStatus || "N/A"}</p>
                  {paymentStatus === "authorized" && (
                    <div className="flex gap-2 align-items-center">
                      <button
                        onClick={() =>
                          capturePayment(paymentHistory[0]?.paymentId)
                        }
                        className="bg-green-500 text-white px-3 py-1 rounded"
                      >
                        Capture Payment
                      </button>
                    </div>
                  )}
                  {!user.paymentVerified && (
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded"
                      onClick={handleVerifyPayment}
                    >
                      Verify Payment
                    </button>
                  )}
                </td>
              </tr>
              {/* {paymentStatus === "authorized" && (
                <tr>
                  <td
                    colSpan="2"
                    className="border border-gray-300 px-4 py-2 text-center"
                  >
                    <button
                      onClick={capturePayment}
                      className="bg-green-500 text-white px-3 py-1 rounded"
                    >
                      Capture Payment
                    </button>
                  </td>
                </tr>
              )} */}
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-semibold">
                  Address
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {`${user?.address?.area} ${user?.address?.city} ${user?.address?.state} ${user?.address?.country} ${user?.address?.pincode}`}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-semibold">
                  Business Name
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {user.businessName}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-semibold">
                  Business Category
                </td>
                <td className="border border-gray-300 px-4 py-2 capitalize">
                  {user.businessCategory}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-semibold">
                  Business Address
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {user.businessAddress}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-semibold">
                  Aadhar
                </td>
                <td className="border border-gray-300 px-4 py-2 flex items-center justify-between gap-2">
                  {aadharImages.filter(Boolean).length > 0 ? (
                    <div className="flex gap-2">
                      {aadharImages.map(
                        (img, index) =>
                          img && (
                            <img
                              key={index}
                              src={img}
                              width={50}
                              alt={`Aadhar ${index + 1}`}
                              className="cursor-pointer"
                              onClick={() => openZoomModal(index)}
                            />
                          )
                      )}
                    </div>
                  ) : (
                    <span className="">N/A</span>
                  )}
                  {aadharImages.filter(Boolean).length > 0 && (
                    <div className="flex flex-col justify-center">
                      <button
                        onClick={handleReseteKYC}
                        className="bg-yellow-500 text-white btn-sm px-4 py-1 rounded"
                        disabled={loading}
                      >
                        {loading ? "Deleting..." : "Reset e-KYC"}
                      </button>
                    </div>
                  )}
                </td>
              </tr>

              <tr>
                <td className="border border-gray-300 px-4 py-2 font-semibold">
                  Permanent Address
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {permanentAddress ? permanentAddress : "N/A"}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-semibold">
                  Aadhar Number
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {aadharNumber ? aadharNumber : "N/A"}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-semibold">
                  Account Holder Name
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {user?.ekyc?.accountHolderName || "N/A"}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-semibold">
                  Bank Account Number
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {user?.ekyc?.bankAccountNumber || "N/A"}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-semibold">
                  IFSC Code
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {user?.ekyc?.ifscCode || "N/A"}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-semibold">
                  Bank Proof
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {user?.ekyc?.bankProof ? (
                    <img
                      src={user.ekyc.bankProof}
                      width={50}
                      alt="Bank Proof"
                      className="cursor-pointer"
                    />
                  ) : (
                    <span className="">N/A</span>
                  )}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-semibold">
                  PAN Card Front
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {user?.ekyc?.panCardfront ? (
                    <img
                      src={user.ekyc.panCardfront}
                      width={50}
                      alt="PAN Card Front"
                      className="cursor-pointer"
                    />
                  ) : (
                    <span className="text-gray-800">N/A</span>
                  )}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-semibold">
                  PAN Card Back
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {user?.ekyc?.panCardback ? (
                    <img
                      src={user.ekyc.panCardback}
                      width={50}
                      alt="PAN Card Back"
                      className="cursor-pointer"
                    />
                  ) : (
                    <span className="">N/A</span>
                  )}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-semibold">
                  eKYC Status
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {user?.ekyc ? user?.ekyc?.status : "N/A"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="flex justify-end m-0 gap-1 ">
          <button
            onClick={onClose}
            className="btn btn-secondary w-full sm:w-auto"
          >
            Close
          </button>
        </div>
      </div>
      {zoomedIndex !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-[60]">
          <div className="bg-white p-4 rounded-lg flex relative">
            <button
              onClick={closeZoomModal}
              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full"
            >
              ✖
            </button>
            <div className="flex items-center">
              <button
                onClick={() => handlePrevNext(-1)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                ⬅
              </button>
              <img
                src={aadharImages[zoomedIndex]}
                className="max-w-[70%] max-h-[90vh] object-contain mx-4"
                alt="Zoomed Aadhar"
              />
              <button
                onClick={() => handlePrevNext(1)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                ➡
              </button>
            </div>
            <div className="flex flex-col gap-4 w-1/3 p-4">
              <input
                type="text"
                className="border p-2 w-full"
                placeholder="Aadhar Number"
                value={aadharNumber}
                onChange={(e) => setAadharNumber(e.target.value)}
              />
              <input
                type="text"
                className="border p-2 w-full"
                placeholder="Permanent Address"
                value={permanentAddress}
                onChange={(e) => setPermanentAddress(e.target.value)}
              />
              <button
                onClick={handleSave}
                className="bg-blue-500 text-white px-4 py-2 rounded"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {zoomedProfile && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-[60]">
          <div className="bg-white p-4 rounded-lg relative">
            <button
              onClick={() => setZoomedProfile(false)}
              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full"
            >
              ✖
            </button>
            <img
              src={user.profilePic}
              className="max-w-full max-h-[90vh] object-contain"
              alt="Zoomed Profile"
            />
          </div>
        </div>
      )}
    </div>
  );
};

const AllUsers = () => {
  const [userList, setUserList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("");
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await axios.get(`${backend_API}/auth/getAllUser`);
      console.log(response.data, "response.data");
      const filteredUsers = response.data.user.filter(
        (user) => user.isAdminApproved === true
      );
      // console.log(filteredUsers, "filteredUsers");
      setUserList(filteredUsers);
    } catch (error) {
      console.error("Error:", error.message);
      toast(error?.response?.data?.message);
    }
  };

  const deleteUser = async (uid) => {
    toast.info(
      <div>
        <p>Are you sure you want to delete?</p>
        <div className="d-flex justify-content-center gap-2">
          <button
            className="btn btn-danger btn-sm"
            onClick={() => confirmDelete(uid)}
          >
            Yes
          </button>
          <button className="btn btn-secondary btn-sm" onClick={toast.dismiss}>
            No
          </button>
        </div>
      </div>,
      { autoClose: true, closeOnClick: true }
    );
  };

  const confirmDelete = async (uid) => {
    toast.dismiss();
    try {
      const response = await axios.delete(`${backend_API}/auth/deleteUser`, {
        headers: { "Content-Type": "application/json" },
        data: { id: uid },
      });
      if (response.status === 200) {
        toast(response?.data?.message);
        fetchData();
      }
    } catch (error) {
      console.error("Error:", error.message);
      toast(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredUsers = userList
    .filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm) ||
        user.businessCategory.some((category) =>
          category.toLowerCase().includes(searchTerm.toLowerCase())
        ) // Check all categories
    )
    .sort((a, b) => {
      if (filter === "A-Z") {
        return b.name.localeCompare(a.name);
      } else if (filter === "Z-A") {
        return a.name.localeCompare(b.name);
      } else if (filter === "oldest-newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (filter === "newest-oldest") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      return 0;
    });

  const handleReferredUserClick = async (referredById) => {
    console.log(referredById, "referredById");
    if (!referredById) return;

    try {
      const response = await axios.get(
        `${backend_API}/auth/getUserById/${referredById}`
      );
      setSelectedUser(response.data.user);
    } catch (error) {
      console.error("Error fetching referred user:", error.message);
      toast(
        error?.response?.data?.message ||
          "Failed to fetch referred user details"
      );
    }
  };

  return (
    <>
      <AdminHeader />
      <AdminSidebar />
      <div className="my-32">
        <section>
          <div className="container-fluid">
            <div className="card bg-base-100 shadow-xl mt-5">
              <div className="card-header text-xl font-bold py-3">
                All Users
              </div>
              <div className="p-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by Name, Email, Phone or Buisness Category"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                  className="form-select mt-2"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="">Sort By</option>
                  <option value="A-Z">A-Z</option>
                  <option value="Z-A">Z-A</option>
                  <option value="oldest-newest">Oldest-Newest</option>
                  <option value="newest-oldest">Newest-Oldest</option>
                </select>
              </div>
              <div className="table-container">
                <table className="table table-bordered border">
                  <thead className="text-bold text-[15px] text-black bg-gray-100">
                    <tr>
                      <th>SrNo</th>
                      <th>DateTime</th>
                      <th>Name</th>
                      <th>BuisnessCategory</th>
                      {/* <th>Email</th> */}
                      <th>Contact</th>
                      <th>Address</th>
                      <th>Referred By</th>
                      <th>UserStatus</th>
                      <th>Payment Status</th>
                      <th>Action</th>
                      <th>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.reverse().map((user, index) => (
                      <tr key={user._id}>
                        <th>{index + 1}</th>
                        <td className="text-sm">
                          {new Date(user.createdAt).toLocaleString()}
                        </td>
                        <td className="text-sm">{user.name}</td>
                        <td className="text-sm capitalize">
                          {user.businessCategory[0]}
                        </td>
                        {/* <td className="text-sm">{user.email}</td> */}
                        <td className="text-sm">{user.phone}</td>
                        <td className="text-sm">{`${user?.address?.area}, ${user?.address?.city}, ${user?.address?.state}, ${user?.address?.country}, ${user?.address?.pincode}`}</td>
                        <td className="text-sm">
                          <button
                            className="btn btn-light border border-gray-300 btn-sm"
                            onClick={() =>
                              handleReferredUserClick(user?.referredBy[0]?._id)
                            }
                          >
                            {user?.referredBy?.length > 0
                              ? user?.referredBy[0]?.name
                              : "N/A"}
                          </button>
                        </td>
                        <td className="text-sm">
                          {" "}
                          {user?.userstatus === "available" ? (
                            <span className="btn btn-sm btn-success">
                              available
                            </span>
                          ) : (
                            <span className="btn btn-sm btn-danger">
                              unavailable
                            </span>
                          )}
                        </td>
                        <td className="text-sm">
                          {user.paymentVerified ? (
                            <>
                              <button className="btn btn-success btn-sm">
                                <span className="text-white flex items-center gap-2">
                                  Payment <SiTicktick />
                                </span>
                              </button>
                              <button></button>
                            </>
                          ) : (
                            <button className="btn btn-danger btn-sm">
                              <span className="text-white flex items-center gap-2">
                                Payment{" "}
                                <RxCrossCircled size={17} className="" />
                              </span>
                            </button>
                          )}
                        </td>
                        <td className="d-flex">
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => setSelectedUser(user)}
                          >
                            Details
                          </button>
                          <button
                            className="btn btn-danger btn-sm ml-2"
                            onClick={() => deleteUser(user._id)}
                          >
                            Delete
                          </button>
                          <button
                            className="btn btn-warning text-white btn-sm ml-2"
                            onClick={() =>
                              navigate(`/admin/editUser`, { state: user })
                            }
                          >
                            Edit
                          </button>
                        </td>
                        <td className="text-sm">
                          <Link
                            to="/admin/users/addremark"
                            state={{ userId: user._id }}
                            className="btn btn-sm btn-info"
                          >
                            Add Remarks
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
        {selectedUser && (
          <UserDetailsModal
            user={selectedUser}
            setSelectedUser={setSelectedUser}
            onClose={() => setSelectedUser(null)}
          />
        )}
      </div>
    </>
  );
};

export default AllUsers;
