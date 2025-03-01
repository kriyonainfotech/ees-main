import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminNavbar from '../../admincomponents/AdminNavbar';
import AdminSidebar from '../../admincomponents/AdminSidebar';
import ProfileSidebar from '../ProfileSidebar';
import UserSideBar from '../UserSideBar';

const backend_API = import.meta.env.VITE_API_URL;

const SupportTicket = () => {
    const [tickets, setTickets] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const token = JSON.parse(localStorage.getItem('token'));

    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const fetchTickets = async () => {
            setLoading(true)
            try {
                const response = await axios.get(`${backend_API}/support/userTickets`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });
                setTickets(response.data);
            } catch (error) {
                // setErrorMessage('Failed to fetch tickets.');
                setErrorMessage(error?.response?.data?.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
    }, []);

    // Function to format date into a human-readable format
    const formatDate = (date) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
        return new Date(date).toLocaleString('en-US', options);
    };

    return (
        <>
            <AdminNavbar />
            <UserSideBar />
            <ProfileSidebar />

            <section className='py-32'>
                <div className="container">
                    <div className="row">
                        <h4 className='pb-3'>Your Support Tickets</h4>
                        <div className="px-0 border-2 rounded-3">
                            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                            <table className="table table-striped ">
                                <thead>
                                    <tr>
                                        {/* <th>Sr.no</th> */}
                                        <th>Issue</th>
                                        <th>Description</th>
                                        <th>Status</th>
                                        <th>Resolution Message</th>
                                        <th>Created At</th>
                                        {/* <th>Updated At</th> */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {tickets.map((ticket) => (
                                        <tr key={ticket._id}>
                                            <td>{ticket.issue}</td>
                                            <td>{ticket.description}</td>
                                            <td>{ticket.status}</td>
                                            <td>
                                                {ticket.status === 'Resolved' && ticket.resolutionMessage ? (
                                                    <p>{ticket.resolutionMessage}</p>
                                                ) : (
                                                    <p>No resolution yet</p>
                                                )}
                                            </td>
                                            <td>{formatDate(ticket.createdAt)}</td>
                                            {/* <td>{ticket.updatedAt ? formatDate(ticket.updatedAt) : "Not updated yet"}</td> */}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>
            </section>

        </>
    );
};

export default SupportTicket;
