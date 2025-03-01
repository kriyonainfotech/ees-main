import React, { useContext, useEffect, useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import AdminNavbar from '../admincomponents/AdminNavbar';
import UserSideBar from '../components/UserSideBar';
import SearchResult from '../components/SearchResult';
import { UserContext } from '../UserContext';
import ProfileSidebar from '../components/ProfileSidebar';
import Footer from '../components/Footer';
import Loader from "../components/Loader";

const backend_API = import.meta.env.VITE_API_URL;

const ServiceDetail = () => {
  const { user } = useContext(UserContext);
  const token = useMemo(() => JSON.parse(localStorage.getItem('token')), []);
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [category, setCategory] = useState(() => localStorage.getItem('selectedCategory') || null);
  const [service, setService] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(() =>
    user || JSON.parse(localStorage.getItem('loggedInUser')) || null
  );
  const [apiMessage, setApiMessage] = useState("");

  const fetchData = async (cat, loggedInUserCity) => {
    if (!cat || !loggedInUserCity) return;

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${backend_API}/auth/getUsersByBCategory`,
        {
          category: cat,
          city: loggedInUserCity,
          isAdminApproved: true,
          paymentVerified: true,
          sortByRating: 'desc',
        },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      console.log(response.data, "response");
      if (response.data.success) {
        const uniqueServices = Array.from(
          new Map(response.data.users.map(item => [item._id, item])).values()
        );
        setService(uniqueServices);
        setApiMessage(response.data.message);
      } else {
        console.error("Error fetching data:", response.data.message);
        setService([]);
        setApiMessage(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message || error);
      setService([]);
      setApiMessage("Failed to fetch providers. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Update category from location state
  useEffect(() => {
    if (location.state) {
      const newCategory = location.state;
      setCategory(newCategory);
      localStorage.setItem('selectedCategory', newCategory);
    }
  }, [location.state]);

  // Fetch data when dependencies change
  useEffect(() => {
    if (category && loggedInUser?.address?.city) {
      fetchData(category, loggedInUser.address.city);
    }
  }, [category, loggedInUser?.address?.city]);
  useEffect(() => {
    return () => {
      setService([]); // Clear service list on unmount
    };
  }, []);
  // Update logged-in user
  useEffect(() => {
    if (user) {
      setLoggedInUser(user);
      localStorage.setItem('loggedInUser', JSON.stringify(user));
    }
  }, [user]);

  return (
    <>
      <AdminNavbar />
      <UserSideBar />
      <ProfileSidebar />
      <section className=" mt-28">
        <div className="container">
          <div className="row">
            <div className="d-flex">
              <h3 className="py-4 text-capitalize">{category}</h3>
            </div>

            <div className="col-12 d-flex flex-wrap px-0">
              {isLoading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh", width: "100vw" }}>
                  <Loader color="#00BFFF" height={50} width={50} />
                </div>
              ) : service.length > 0 ? (
                service.map((Usersdata, i) => (
                  <SearchResult
                    key={Usersdata._id} // Use unique ID instead of index
                    Usersdata={Usersdata}
                    token={token}
                  />
                ))
              ) : (
                <h6 className="pt-3 px-3">{apiMessage}</h6>
              )}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default ServiceDetail;
