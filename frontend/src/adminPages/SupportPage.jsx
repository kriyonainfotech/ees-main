import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminHeader from '../admincomponents/AdminHeader';
import AdminSidebar from '../admincomponents/AdminSidebar';
import { toast } from 'react-toastify';

const backend_API = import.meta.env.VITE_API_URL;

const SupportPage = () => {
    const [tickets, setTickets] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [resolutionMessages, setResolutionMessages] = useState({}); // Store resolutions for each ticket
    const token = JSON.parse(localStorage.getItem('token'));

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${backend_API}/support/getTickets`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            console.log(response.data, 'tickets')
            setTickets(response.data);
        } catch (error) {
            setErrorMessage(error?.response?.data?.message || 'Failed to fetch tickets.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    const updateStatus = async (id) => {
        try {
            const response = await axios.put(
                `${backend_API}/support/updateTicketStatus/${id}/status`,
                { status: 'Resolved', resolutionMessage: resolutionMessages[id] || '' },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );
            toast.success('Ticket marked as resolved!');
            fetchTickets(); // Refresh tickets after update
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to update the ticket status.');
        }
    };

    const deleteTicket = async (ticketId) => {
        toast.info(
            <div>
                <p>Are you sure you want to delete this request?</p>
                <div className="d-flex justify-content-center gap-2">
                    <button className="btn btn-danger btn-sm" onClick={() => confirmDelete(ticketId)}>Yes</button>
                    <button className="btn btn-secondary btn-sm" onClick={toast.dismiss}>No</button>
                </div>
            </div>,
            { autoClose: false, closeOnClick: false }
        );
    };

    const confirmDelete = async (ticketId) => {
        toast.dismiss();
        setLoading(true);
        try {
            const response = await axios.delete(`${backend_API}/support/deleteTicket`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                data: { id: ticketId },
            });

            if (response.status === 200) {
                toast.success(response?.data?.message || 'Ticket deleted successfully.');
                fetchTickets();
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Error deleting ticket.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <AdminHeader />
            <AdminSidebar />
            <div className='py-36'>
                <div className="container">
                    <h2>All Tickets</h2>
                    {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                    <div className='overflow-x-auto'>
                        <table className="table table-striped border mx-auto overflow-hidden">
                            <thead>
                                <tr>
                                    <th>Sr.no</th>
                                    <th>User</th>
                                    <th>Phone</th>
                                    <th>mail</th>
                                    <th>Issue</th>
                                    <th>Description</th>
                                    <th>Resolution Message</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tickets.map((ticket, index) => (
                                    <tr key={ticket._id}>
                                        <th>{++index}</th>
                                        <td>
                                            <span>{ticket?.userId?.name}</span>
                                        </td>
                                        <td>{ticket?.userId?.phone}</td>
                                        <td>
                                            <span>{ticket?.userId?.email}</span>
                                        </td>
                                        <td>{ticket.issue}</td>
                                        <td>{ticket.description}</td>
                                        <td>{ticket.resolutionMessage || 'No resolution yet'}</td>
                                        <td>{ticket.status}</td>
                                        <td>
                                            {ticket.status === 'Pending' ? (
                                                <div className='d-flex flex-column'>
                                                    <input
                                                        type="text"
                                                        value={resolutionMessages[ticket._id] || ''}
                                                        onChange={(e) => setResolutionMessages({
                                                            ...resolutionMessages,
                                                            [ticket._id]: e.target.value
                                                        })}
                                                        placeholder="Enter resolution message"
                                                        className='form-control m-1'
                                                    />
                                                    <button
                                                        className="btn btn-warning"
                                                        onClick={() => updateStatus(ticket._id)}
                                                    >
                                                        Mark as Resolved
                                                    </button>
                                                </div>
                                            ) : (
                                                <button className='btn btn-sm text-white bg-orange' onClick={() => deleteTicket(ticket._id)}>
                                                    Delete
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SupportPage;
