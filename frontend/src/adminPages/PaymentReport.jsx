import { useState, useEffect } from "react";
import axios from "axios";
const backend_API = import.meta.env.VITE_API_URL;

const PaymentReport = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${backend_API}/auth/paidusers`, {
        withCredentials: true,
      });
      console.log(res, "-----------------------------");
      if (res.status === 200) {
        setUsers(res.data.users);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const getMonthIndex = (monthName) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return months.indexOf(monthName);
  };

  const filteredUsers = users.filter((user) => {
    return user.paymentHistory?.some((payment) => {
      const paymentDate = new Date(payment.createdAt);
      if (isNaN(paymentDate)) return false;

      const paymentYear = paymentDate.getFullYear();
      const paymentMonth = paymentDate.getMonth();

      const matchesYear = paymentYear === parseInt(selectedYear);
      const matchesMonth = selectedMonth
        ? paymentMonth === getMonthIndex(selectedMonth)
        : true;
      const matchesDateRange =
        startDate && endDate
          ? paymentDate >= new Date(startDate) &&
            paymentDate <= new Date(endDate)
          : true;

      return matchesYear && matchesMonth && matchesDateRange;
    });
  });

  const downloadReport = async () => {
    try {
      const res = await axios.post(
        `${backend_API}/payment/reports`,
        { year: selectedYear, month: selectedMonth, startDate, endDate },
        { withCredentials: true, responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `Payment_Report_${selectedYear}_${selectedMonth || "All"}.pdf`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading report:", error);
    }
  };

  // const downloadCSV = (data) => {
  //   // Convert data to CSV format
  //   const csvRows = [];
  //   const headers = Object.keys(data[0]); // Extract headers

  //   csvRows.push(headers.join(",")); // Add header row

  //   data.forEach((row) => {
  //     const values = headers.map((header) => `"${row[header]}"`);
  //     csvRows.push(values.join(","));
  //   });

  //   const csvContent = csvRows.join("\n");
  //   const blob = new Blob([csvContent], { type: "text/csv" });
  //   const url = URL.createObjectURL(blob);

  //   // Create a download link
  //   const a = document.createElement("a");
  //   a.href = url;
  //   a.download = "payments.csv";
  //   document.body.appendChild(a);
  //   a.click();
  //   document.body.removeChild(a);
  //   URL.revokeObjectURL(url);
  // };

  return (
    <div className="p-5">
      <h1 className="text-xl font-bold mb-3">Admin - Payment Reports</h1>

      {/* Filters */}
      <div className="mb-3">
        <label className="mr-2">Select Year:</label>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="border p-2 rounded"
        >
          {[...Array(5)].map((_, i) => {
            const yr = new Date().getFullYear() - i;
            return (
              <option key={yr} value={yr}>
                {yr}
              </option>
            );
          })}
        </select>
      </div>

      <div className="mb-3">
        <label className="mr-2">Select Month:</label>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Months</option>
          {[
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ].map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3 flex items-center">
        <label className="mr-2">Select Date Range:</label>
        <input
          type="date"
          className="border p-2 rounded"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <span className="mx-2">to</span>
        <input
          type="date"
          className="border p-2 rounded"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      {/* Download Button */}
      <button
        onClick={downloadReport}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-3"
      >
        Download Invoice
      </button>

      {/* Users Table */}
      <div className="mt-5 p-3 border rounded-lg">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Users</h2>
          <button
            onClick={() => {
              setSelectedMonth("");
              setStartDate("");
              setEndDate("");
            }}
            className="bg-amber-500 text-white px-3 py-1 rounded"
          >
            Reset Filters
          </button>
        </div>
        <table className="w-full border-collapse border border-gray-300 mt-3">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">User ID</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Phone</th>
              <th className="border p-2">Payment History</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.filter((user) =>
              user.paymentHistory?.some(
                (payment) => payment.status === "captured"
              )
            ).length > 0 ? (
              filteredUsers
                .filter((user) =>
                  user.paymentHistory?.some(
                    (payment) => payment.status === "captured"
                  )
                )
                .map((user, index) => (
                  <tr key={user._id}>
                    <td className="border p-2">{index + 1}</td>
                    <td className="border p-2">{user.name}</td>
                    <td className="border p-2">{user.phone}</td>
                    <td className="border p-2">
                      {user.paymentHistory
                        ?.filter((payment) => payment.status === "captured")
                        .map((payment) => (
                          <div key={payment.paymentId}>
                            {payment.amount} {payment.currency} -{" "}
                            {payment.status}
                          </div>
                        ))}
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center p-3">
                  No users with captured payments found!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentReport;
