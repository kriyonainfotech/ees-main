import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminNavbar from '../admincomponents/AdminNavbar';
import UserSideBar from '../components/UserSideBar';
import ProfileSidebar from '../components/ProfileSidebar';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import SearchBox from '../components/SearchBox';
import { ContectUs } from './ContectUs';
import Footer from '../components/Footer';

const backend_API = import.meta.env.VITE_API_URL;

const Support = () => {
    const [issue, setIssue] = useState('');
    const [description, setDescription] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [activeTicket, setActiveTicket] = useState(null);
    const token = JSON.parse(localStorage.getItem('token'));
    const [loading, setLoading] = useState(false);

    // Fetch user's active ticket on component mount
    useEffect(() => {
        const fetchActiveTicket = async () => {
            setLoading(true)
            try {
                const response = await axios.get(`${backend_API}/support/getActiveTicket`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });
                if (response.data) {
                    setActiveTicket(response.data);

                }

            } catch (error) {
                setErrorMessage(error?.response?.data?.message || 'Failed to fetch active ticket.');
                // toast(error?.response?.data?.message)
            }
        };

        fetchActiveTicket();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            const response = await axios.post(`${backend_API}/support/addIssue`, { issue, description }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            toast('Your issue has been submitted successfully.');
            window.location.reload()
            setIssue('');
            setDescription('');
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'Failed to submit the issue. Please try again.');
        } finally {
            setLoading(false)
        }
    };

    return (
        <>
            <AdminNavbar />
            <UserSideBar />
            <ProfileSidebar />
            <div className="py-24">
                <ContectUs />
                <section>
                    <div className="container">
                        <div className="row">
                            <h4>Let us know about your issue, and we'll get back to you with the best solution</h4>
                        </div>
                        <Link to={"/ViewTickits"} className='btn bg-blue text-white mt-3'>
                            View All Ticket
                        </Link>
                        {/* Ticket submission form */}
                        {!activeTicket && (
                            <div className="row mt-4">
                                <div className="col-md-6">
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-3">
                                            <label htmlFor="issue" className="form-label">Issue</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="issue"
                                                value={issue}
                                                onChange={(e) => setIssue(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="description" className="form-label">Description</label>
                                            <textarea
                                                className="form-control"
                                                id="description"
                                                rows="4"
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                required
                                            ></textarea>
                                        </div>
                                        <button type="submit" className="btn btn-primary" disabled={activeTicket}>Submit</button>
                                    </form>
                                    {/* {successMessage && <div className="alert alert-success mt-3">{successMessage}</div>} */}
                                    {/* {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>} */}
                                </div>
                            </div>
                        )}

                        {/* Display active ticket if exists */}
                        {activeTicket && (
                            <div className="alert alert-info mt-4 col-md-6">
                                <h5>You have an active ticket:</h5>
                                <p><strong>Issue:</strong> {activeTicket.issue}</p>
                                <p><strong>Issue:</strong> {activeTicket.description}</p>
                                <p><strong>Status:</strong> {activeTicket.status}</p>
                                <p><strong>Submitted On:</strong> {new Date(activeTicket.createdAt).toLocaleString()}</p>
                                {/* <p><strong>Last Updated:</strong> {activeTicket.updatedAt ? new Date(activeTicket.updatedAt).toLocaleString() : 'Not updated yet'}</p> */}
                            </div>
                        )}

                    </div>
                </section>
            </div>
            <Footer />
        </>
    );
};

export default Support;
