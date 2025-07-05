import React, { useEffect, useState } from "react";
import AdminHeader from "../admincomponents/AdminHeader";
import AdminSidebar from "../admincomponents/AdminSidebar";
import UserCount from "../admincomponents/dashboardCpmponent/UserCount";
import axios from "axios";
import PandingCount from "../admincomponents/dashboardCpmponent/PandingCount";
import {
  AdminCount,
  Investments,
} from "../admincomponents/dashboardCpmponent/AdminCount";
import AssignReferal from "../admincomponents/dashboardCpmponent/AssignReferal";
import { FaUserCheck } from "react-icons/fa";
import { Link } from "react-router-dom";
import {
  PendingWithdrwals,
  PaidUsersCtn,
  PendingKYCs,
  ActiveRequestsTab,
} from "../admincomponents/dashboardCpmponent/pendingWithdrwals";
import ActiveRequestsTable from "./ActiveRequestsTable";

const backend_API = import.meta.env.VITE_API_URL;

const Dashboard = () => {
  const [Users, setUsers] = useState([]);
  const [pandingcnt, setPandincnt] = useState([]); // Make sure this is a number
  const [admincnt, setAdminCnt] = useState([]); // Make sure this is a number

  const fetchData = async () => {
    try {
      const response = await axios.get(`${backend_API}/auth/getAllUser`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.data;
      setUsers(data.user);
      console.log(data, "AllUser");

      // Set counts for approved and pending users
      if (response.status === 200) {
        const aprovedUser = data.user.filter(
          (user) => user.isAdminApproved === true
        );
        const pendingaprovalUsers = data.user.filter(
          (user) => user.isAdminApproved === false
        );
        const admins = data.user.filter((user) => user.role === "Admin");
        setUsers(aprovedUser);
        setAdminCnt(admins);
        setPandincnt(pendingaprovalUsers);

        console.log("All User Successful...");
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <AdminHeader />
      <AdminSidebar />

      <div className="my-32">
        <section>
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <h3 className="">Dashboard</h3>
              </div>
              <div className="col-12 d-flex flex-wrap pt-3">
                {/* <div className="col-12 p-1">
                  <Investments label="Investments" />
                </div> */}
                <div className="col-12 col-md-6 col-lg-4 p-1">
                  <PandingCount
                    pandingcnt={pandingcnt}
                    label="Approved Admins"
                  />
                </div>
                <div className="col-12 col-md-6 col-lg-4 p-1">
                  <UserCount Users={Users} label="Pending Admins" />
                </div>
                <div className="col-12 col-md-6 col-lg-4 p-1">
                  <AdminCount admincnt={admincnt} label="Total Users" />
                </div>
                <div className="col-12 col-md-6 col-lg-4 p-1">
                  <PendingWithdrwals label="Total Users" />
                </div>
                <div className="col-12 col-md-6 col-lg-4 p-1">
                  <PendingKYCs label="Pending e-KYC" />
                </div>
                <div className="col-12 col-md-6 col-lg-4 p-1">
                  <PaidUsersCtn label="Payment Invoices" />
                </div>
                <div className="col-12 col-md-6 col-lg-4 p-1">
                  {/* <ActiveRequestsTab label="Active Requests" /> */}
                  <ActiveRequestsTab label="Active Requests" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Dashboard;
