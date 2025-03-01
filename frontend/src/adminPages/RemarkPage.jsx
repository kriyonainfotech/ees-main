import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "../UserContext.jsx";
import AdminHeader from "../admincomponents/AdminHeader.jsx";
import AdminSidebar from "../admincomponents/AdminSidebar.jsx";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const backend_API = import.meta.env.VITE_API_URL;

const RemarkPage = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate()
  const location = useLocation();
  const userId = location.state?.userId || user._id; // Use the user ID from state or context
  const [remarks, setRemarks] = useState([]);
  const [newRemark, setNewRemark] = useState("");

  useEffect(() => {
    fetchRemarks();
  }, [userId]);

  const fetchRemarks = async () => {
    console.log(userId, 'uid')
    try {
      const response = await axios.get(`${backend_API}/remark/user/${userId}`);
      console.log(response.data.remarks, 'data');
      if (response.status === 200) {
        const remarksWithDefaultStatus = response?.data?.remarks?.map(remark => ({
          ...remark,
          // Ensure userStatus is always an array, even if it's a single object for the user
          userStatus: Array.isArray(remark.userStatus)
            ? remark.userStatus.map(status => ({
              ...status,
              is_completed: status?.is_completed || false, // Ensure is_completed is always false if undefined
            }))
            : [remark.userStatus], // Wrap userStatus object in an array if it's a single object
        }));

        setRemarks(remarksWithDefaultStatus);
      }
    } catch (error) {
      console.log("Error fetching remarks:", error);
    }
  };

  const handleAddRemark = async () => {
    try {
      const response = await axios.post(`${backend_API}/remark/create`, {
        userId,
        remark: newRemark,
      });
      if (response.status === 200) {
        const addedRemark = response.data.remarks;
        // Process the remark to ensure correct structure
        const processedRemark = {
          ...addedRemark,
          userStatus: addedRemark.userStatus.map(status => ({
            ...status,
            is_completed: status?.is_completed || false,
          })),
        };
        // Add the new remark to the state immediately
        setRemarks(prev => [...prev, processedRemark]);
      }
      fetchRemarks();
      setNewRemark("");
    } catch (error) {
      console.log("Error adding remark:", error);
    }
  };

  const handleUpdateStatus = async (remarkId, isCompleted) => {
    console.log(remarkId, isCompleted, userId, "ss");
    try {
      const response = await axios.put(`${backend_API}/remark/update-status/${remarkId}`, {
        is_completed: isCompleted,
        userId: userId,
      });
      console.log(response, "res.update");
      if (response.status === 200) {
        setRemarks((prevRemarks) =>
          prevRemarks.map((r) =>
            r._id === remarkId
              ? {
                ...r,
                userStatus: r.userStatus.map((status) =>
                  status.userId.toString() === userId
                    ? { ...status, is_completed: isCompleted }
                    : status
                ),
              }
              : r
          )
        );
        toast.success("remark status updated!!");
      }
    } catch (error) {
      console.error("Error updating remark status:", error);
    }
  };

  const handleDeleteRemark = async (remarkId) => {
    try {
      const response = await axios.delete(`${backend_API}/remark/delete/${remarkId}`);
      console.log(response, "response");
      if (response.status === 200) {
        toast("remark deleted successfully !!");
      }
      setRemarks((prevRemarks) => prevRemarks.filter((r) => r._id !== remarkId));
    } catch (error) {
      console.log("Error deleting remark:", error);
      toast.error("server error deleting remark !!");
    }
  };

  return (
    <div className="container-fluid mt-40">
      <AdminHeader />
      <AdminSidebar />
      <div className="row g-0">
        <div className="p-4 bg-light" style={{ minHeight: "100vh" }}>
          <div className="container">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="text-dark mb-0">Remark Checklist</h2>
              <button onClick={() => navigate(-1)} className="btn btn-dark btn-sm btn-primary">Back</button>
            </div>

            {/* Add Remark Input */}
            <div className="mb-3 d-flex">
              <input
                type="text"
                className="form-control"
                placeholder="Add a new remark..."
                value={newRemark}
                onChange={(e) => setNewRemark(e.target.value)}
              />
              <button className="btn btn-sm btn-primary ms-2" onClick={handleAddRemark}>
                Add
              </button>
            </div>

            {/* Remark List */}
            <div className="row g-4">
              {remarks?.map((remark) => (
                <div key={remark?._id} className="col-12">
                  <div className={`card shadow-sm ${remark?.userStatus[0]?.is_completed ? "bg-light" : ""}`}>
                    <div className="card-body d-flex justify-content-between align-items-center">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id={`remark-${remark?._id}`}
                          checked={remark?.userStatus[0]?.is_completed}
                          onChange={() =>
                            handleUpdateStatus(remark._id, !remark?.userStatus[0]?.is_completed)
                          }
                          style={{ width: "1.2em", height: "1.2em" }}
                        />
                      </div>
                      <span className={`flex-grow-1 mx-3 ${remark?.userStatus[0]?.is_completed ? "text-muted" : ""}`}>
                        {remark.remark}
                      </span>
                      <span
                        className={`badge ${remark?.userStatus[0]?.is_completed ? "bg-success" : "bg-secondary"}`}
                      >
                        {remark?.userStatus[0]?.is_completed ? "Completed" : "Pending"}
                      </span>
                      <button
                        className="btn btn-sm btn-danger ms-3"
                        onClick={() => handleDeleteRemark(remark._id)}
                      >
                        delete
                        {/* ❌ */}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default RemarkPage;
