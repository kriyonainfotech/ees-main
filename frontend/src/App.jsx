import React, { useState, useEffect, Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserProvider } from "./UserContext";
import { FCMProvider } from "./context/FCMContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ProtectAdmin from "./components/ProtectAdmin";
import Notification from "./components/Notification";
import Loader from "./components/Loader";
import AproveRegister from "./adminPages/AproveRegister";
import Support from "./Pages/Support";
import SupportPage from "./adminPages/SupportPage";
import SupportTicket from "./components/Support/SupportTicket";
import RegisterAadhar from "./components/RegisterAadhar";
import PrivacyPolicy from "./Pages/PrivacyPolicy";
import ForgotPassword from "./components/ForgotPassword";
import VerifyOtp from "./components/VerifyOtp";
import ResetPassword from "./components/ResetPassword";
import AboutUs from "./Pages/AboutUs";
import CreatUser from "./adminPages/CreatUser";
import AssignReferrals from "./adminPages/AssignRefferal";
import RemarkPage from "./adminPages/RemarkPage";
import AadharUploadPage from "./adminPages/AadharUploadPage";
import WithdrawalRequests from "./adminPages/WithdrawalRequests";
import PaymentReport from "./adminPages/PaymentReport";
import PendingeKYCs from "./adminPages/PendingeKYCs";
import YearlyInvestors from "./Pages/YearlyInvestors";
import MonthlyInvestors from "./Pages/MonthlyInvestors";
import ActiveRequestsTable from "./adminPages/ActiveRequestsTable";

// Lazy-loaded components
const Login = lazy(() => import("./components/Login"));
const Registration = lazy(() => import("./components/Registration"));
const Profile = lazy(() => import("./Pages/Profile"));
const EditProfile = lazy(() => import("./components/EditProfile"));
const Admin = lazy(() => import("./Pages/Admin"));
const EditUser = lazy(() => import("./admincomponents/EditUser"));
const ServiceDetail = lazy(() => import("./Pages/ServiceDetail"));
const Services = lazy(() => import("./Pages/Services"));
const RegisterNextPage = lazy(() => import("./components/RegisterNextPage"));
const Work = lazy(() => import("./Pages/Work"));
const Senedrequest = lazy(() => import("./components/Senedrequest"));
const Home = lazy(() => import("./Pages/Home"));
const AllUsers = lazy(() => import("./adminPages/AllUsers"));
const ManageCatagory = lazy(() => import("./adminPages/ManageCatagory"));
const Dashboard = lazy(() => import("./adminPages/Dashboard"));
const Wallete = lazy(() => import("./Pages/Wallete"));
const Team = lazy(() => import("./Pages/Team"));
const ManageAdmin = lazy(() => import("./adminPages/ManageAdmin"));
const ONE_SIGNAL_APP_ID = "YOUR_ONESIGNAL_APP_ID";
const backend_API = import.meta.env.VITE_API_URL;

export default function App() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    window.OneSignal = window.OneSignal || [];
    OneSignal.push(() => {
      OneSignal.init({
        appId: "810605bf-f0d6-4214-b944-14307d1a5240",
        allowLocalhostAsSecureOrigin: true,
      });
    });
  }, []);

  useEffect(() => {
    // Simulate a data fetch
    setTimeout(() => {
      setLoading(false);
    }, 2000); // 2 seconds
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <UserProvider>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <FCMProvider>
          <Suspense
            fallback={
              <>
                <Loader />
              </>
            }
          >
            <Router>
              <Routes>
                <Route path="/register" element={<Registration />} />
                <Route path="/registernext" element={<RegisterNextPage />} />
                <Route path="/RegisterAadhar" element={<RegisterAadhar />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgotPassword" element={<ForgotPassword />} />
                <Route path="/verifyOtp" element={<VerifyOtp />} />
                <Route path="/resetPassword" element={<ResetPassword />} />
                <Route path="/customer-support" element={<Support />} />

                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/editprofile" element={<EditProfile />} />
                  <Route path="/serviceDetail" element={<ServiceDetail />} />
                  <Route path="/work" element={<Work />} />
                  <Route path="/wallete" element={<Wallete />} />
                  <Route path="/team" element={<Team />} />
                  <Route path="/ViewTickits" element={<SupportTicket />} />
                </Route>
                <Route path="/" element={<Home />} />
                <Route path="/servises" element={<Services />} />
                <Route path="/privacyPolicy" element={<PrivacyPolicy />} />
                <Route path="/aboutus" element={<AboutUs />} />
                <Route path="/work/sendrequest" element={<Senedrequest />} />
                <Route path="/upload-adhaar" element={<AadharUploadPage />} />

                {/* Admin Routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectAdmin>
                      <Dashboard />
                    </ProtectAdmin>
                  }
                />
                <Route path="/admin/activerequest" element={<ProtectAdmin>
                  <ActiveRequestsTable />
                </ProtectAdmin>} />
                <Route
                  path="/admin/users"
                  element={
                    <ProtectAdmin>
                      <AllUsers />
                    </ProtectAdmin>
                  }
                />
                <Route
                  path="/admin/editUser"
                  element={
                    <ProtectAdmin>
                      <EditUser />
                    </ProtectAdmin>
                  }
                />
                <Route
                  path="/admin/manageAdmin"
                  element={
                    <ProtectAdmin>
                      <ManageAdmin />
                    </ProtectAdmin>
                  }
                />
                <Route
                  path="/admin/assignRefferal"
                  element={
                    <ProtectAdmin>
                      <AssignReferrals />
                    </ProtectAdmin>
                  }
                />
                <Route
                  path="/admin/manageCategory"
                  element={
                    <ProtectAdmin>
                      <ManageCatagory />
                    </ProtectAdmin>
                  }
                />
                <Route
                  path="/admin/aprove"
                  element={
                    <ProtectAdmin>
                      <AproveRegister />
                    </ProtectAdmin>
                  }
                />
                <Route
                  path="/admin/support"
                  element={
                    <ProtectAdmin>
                      <SupportPage />
                    </ProtectAdmin>
                  }
                />
                <Route
                  path="/admin/creatUser"
                  element={
                    <ProtectAdmin>
                      <CreatUser />
                    </ProtectAdmin>
                  }
                />
                <Route
                  path="/admin/withdrawals"
                  element={
                    <ProtectAdmin>
                      <WithdrawalRequests />
                    </ProtectAdmin>
                  }
                />
                <Route
                  path="/admin/users/addremark"
                  element={
                    <ProtectAdmin>
                      <RemarkPage />
                    </ProtectAdmin>
                  }
                />
                <Route
                  path="/admin/payment-invoices"
                  element={
                    <ProtectAdmin>
                      <PaymentReport />
                    </ProtectAdmin>
                  }
                />
                <Route
                  path="/admin/pending-kycs"
                  element={
                    <ProtectAdmin>
                      <PendingeKYCs />
                    </ProtectAdmin>
                  }
                />
                <Route
                  path="/admin/investments/monthly"
                  element={<MonthlyInvestors />}
                />
                <Route
                  path="/admin/investments/yearly"
                  element={<YearlyInvestors />}
                />
              </Routes>
            </Router>
          </Suspense>
        </FCMProvider>
        <Notification />
      </UserProvider>
    </>
  );
}
