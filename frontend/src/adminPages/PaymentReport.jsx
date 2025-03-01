import { useState, useEffect } from "react";
import axios from 'axios';
const backend_API = import.meta.env.VITE_API_URL;

const PaymentReport = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${backend_API}/auth/paidusers`, {
        withCredentials: true
      });
      console.log(res, 'user paid')
      if (res.status === 200) {
        setUsers(res.data.users);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const downloadUserReport = async (userId) => {
    try {
      const response = await axios.post(`${backend_API}/payment/reports`,
        { userId: userId },
        { responseType: "blob" } // Important: Treat response as a file
      );

      console.log("Response:", response);

      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = `user_${userId}_report.pdf`; // Set filename
      document.body.appendChild(a);
      a.click();
      a.remove(); // Clean up

    } catch (error) {
      console.error("Failed to download report:", error);
    }
  };


  const downloadAllReports = () => {
    window.location.href = `/api/payments/report?year=${year}`;
  };

  return (
    <div className="p-5">
      <h1 className="text-xl font-bold">Admin - Payment Reports</h1>
      <div className="mt-3">
        <label className="mr-2">Select Year:</label>
        <select value={year} onChange={(e) => setYear(e.target.value)}>
          {[...Array(5)].map((_, i) => {
            const yr = new Date().getFullYear() - i;
            return <option key={yr} value={yr}>{yr}</option>;
          })}
        </select>
      </div>
      {/* Download All Reports Button */}
      <div className="mt-5 ">
        <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={downloadAllReports}>
          Download All Users Report
        </button>
      </div>
      {/* Users Table */}
      <div className="mt-5 p-3 border rounded-lg shadow-md">
        <h2 className="text-lg font-semibold">Users</h2>
        <table className="w-full border-collapse border border-gray-300 mt-3">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">User ID</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Phone</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Payment History</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr key={user._id}>
                  <td className="border p-2">{++index}</td>
                  <td className="border p-2">{user.name}</td>
                  <td className="border p-2">{user.phone}</td>
                  <td className="border p-2">{user.email}</td>
                  <td className="border p-2">
                    {user.paymentHistory && user.paymentHistory.length > 0 ? (
                      <ul>
                        {user.paymentHistory
                          .filter((payment) => payment.status === "captured")
                          .map((payment) => (
                            <li key={payment.paymentId} className="text-sm">
                              <strong>ID:</strong> {payment.paymentId} | <strong>Amount:</strong>{" "}
                              {payment.amount} {payment.currency} | <strong>Status:</strong>{" "}
                              {payment.status}
                            </li>
                          ))}
                      </ul>
                    ) : (
                      "No Payment History"
                    )}
                  </td>
                  <td className="border p-2">
                    <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={() => downloadUserReport(user._id)}>
                      Download Report
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="border p-2 text-center">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>


    </div>
  );
};

export default PaymentReport;