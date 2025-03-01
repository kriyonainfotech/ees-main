import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MdOutlineDeleteOutline } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import AdminHeader from '../AdminHeader';
import AdminSidebar from '../AdminSidebar';

const backend_API = import.meta.env.VITE_API_URL;

const AssignReferral = () => {
  const [referrerPhone, setReferrerPhone] = useState('');
  const [referredPhone, setReferredPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // const fetchData = async () => {
  //   try {
  //     const response = await axios.get(`${backend_API}/auth/getAllUser`, {
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //     });
  //     const data = await response.data;
  //     const adminUsers = data.user.filter(user => user.role === 'Admin');
  //     setUserList(adminUsers);
  //   } catch (error) {
  //     console.error('Error:', error.message);
  //   }
  // };

  // useEffect(() => {
  //   fetchData();
  // }, []);

  const handleReferralSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${backend_API}/auth/setReferral`, {
        referrerPhone,
        referredPhone,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(response, 'res')

      if (response.status === 200) {
        setMessage('Referral assigned successfully');
        setReferrerPhone('');
        setReferredPhone('');
      }else{
        setMessage('Error assigning referral');
      }
    } catch (error) {
      setMessage(error?.response?.data?.message);
      console.log(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AdminHeader />
      <AdminSidebar />
      <section className="container-fluid py-3">
        <div className="card bg-base-100 shadow-xl mt-28">
          <div className="card-header text-xl font-bold text-center py-3">Assign Referrals</div>
          <div className="overflow-x-auto p-5">
            <form onSubmit={handleReferralSubmit}>
              <h1>hii</h1>
              <div className="input-group mb-4">
                <label htmlFor="referrerPhone" className="font-semibold">Referrer Phone Number:</label>
                <input
                  type="text"
                  id="referrerPhone"
                  value={referrerPhone}
                  onChange={(e) => setReferrerPhone(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-0  focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  placeholder="Enter Referrer Phone Number"
                  required
                />

              </div>
              <h1>hii</h1>
              <div className="input-group mb-4">
                <label htmlFor="referredPhone" className="font-semibold">Referred Phone Number:</label>
                <input
                  type="text"
                  id="referredPhone"
                  value={referredPhone}
                  onChange={(e) => setReferredPhone(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-0 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  placeholder="Enter Referred Phone Number"
                  required
                />

              </div>

              <button
                type="submit"
                className={`btn btn-success w-full ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Submit Referral'}
              </button>
            </form>

            {message && <p className="mt-4 text-center text-lg font-semibold text-green-500">{message}</p>}

          </div>
        </div>
      </section>
    </>
  );
};

export default AssignReferral;
