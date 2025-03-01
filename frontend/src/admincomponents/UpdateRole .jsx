import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const backend_API = import.meta.env.VITE_API_URL;

const UpdateRole = () => {
    const [email, setEmail] = useState('');
    const [newRole, setNewRole] = useState('User');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false); // New loading state

    const handleUpdateRole = async () => {
        if (!email) {
            setError('Email is required');
            return;
        }

        // Basic email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address');
            return;
        }

        setError(null); // Clear previous errors
        setLoading(true); // Start loading

        try {
            const response = await axios.put(`${backend_API}/auth/updateRoleByEmail`, {
                email: email,
                role: newRole,
            });

            if (response.status === 200) {
                toast.success('User role updated successfully'); // Success toast
                setEmail(''); // Clear the email field
                setNewRole('User'); // Reset role to default
            }
        } catch (error) {
            if (error.response) {
                setError(error.response.data.message || 'Something went wrong');
            } else {
                setError('Network error or timeout');
            }
        } finally {
            setLoading(false); // Stop loading after the request
        }
    };

    return (
        <>
            <section>
                <div className="container mt-5">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="card">
                                <div className="card-body">
                                    <h4 className="card-title mb-4">Update User Role</h4>

                                    <div className="d-flex gap-3">
                                        {/* Email Input */}
                                        <div>
                                            <label htmlFor="email" className="form-label">Email</label>
                                            <input
                                                type="email"
                                                id="email"
                                                className="form-control"
                                                placeholder="Enter Email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </div>

                                        {/* Role Selection */}
                                        <div>
                                            <label htmlFor="role" className="form-label">Select Role</label>
                                            <select
                                                id="role"
                                                className="form-select"
                                                value={newRole}
                                                onChange={(e) => setNewRole(e.target.value)}
                                            >
                                                <option value="Admin">Admin</option>
                                                <option value="User">User</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Error Message */}
                                    {error && <p className="text-danger">{error}</p>}

                                    {/* Update Button */}
                                    <button
                                        className="btn bg-blue text-white mt-3"
                                        onClick={handleUpdateRole}
                                        disabled={loading} // Disable button when loading
                                    >
                                        {loading ? 'Updating...' : 'Update Role'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default UpdateRole;
