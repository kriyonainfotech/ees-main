import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { MdOutlineDeleteOutline } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import AdminHeader from '../admincomponents/AdminHeader';
import AdminSidebar from '../admincomponents/AdminSidebar';
import UpdateRole from '../admincomponents/UpdateRole ';
import { toast } from 'react-toastify';

const backend_API = import.meta.env.VITE_API_URL;

const ManageAdmin = () => {
   
    const [userList, setUserList] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const fetchData = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`${backend_API}/auth/getAllUser`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.data;

            // Filter users by role "admin"
            const adminUsers = data.user.filter(user => user.role === 'Admin');

            setUserList(adminUsers)

            console.log(adminUsers, "AllUser");
            if (response.status === 200) {
                toast(response?.data?.message)
                console.log("All User Successful...");
            }
        } catch (error) {
            console.error('Error:', error.message);
                toast(error?.response?.data?.message)
        } finally {
            setLoading(false);
        }

    }

    useEffect(() => {
        fetchData()
    }, [])

    const DeletUser = async (uid) => {
        toast.info(
            <div>
              <p>Are you sure you want to delete this request?</p>
              <div className="d-flex justify-content-center gap-2">
                <button className="btn btn-danger btn-sm" onClick={() => confirmDelete(uid)}>Yes</button>
                <button className="btn btn-secondary btn-sm" onClick={toast.dismiss}>No</button>
              </div>
            </div>,
            { autoClose: true, closeOnClick: true }
          );
        };
        const confirmDelete = async(uid) => {
            toast.dismiss(); // Close the confirmation toast
          
        try {
            const response = await axios.delete(`${backend_API}/auth/deleteUser`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                data: { id: uid },
            });
            console.log(response.data, "delet data");
            if (response.status === 200) {
                toast(response?.data?.message)
                console.log("User deleted successfully")
                fetchData();
            }

        } catch (error) {
            console.log(error);
            toast(error?.response?.data?.message)
        }

    }

    return (
        <>
            <AdminHeader />
            <AdminSidebar />
            <div className='mt-40'>
            <UpdateRole />
            </div>
          
            <section className=''>
                <div className="container-fluid">
                    <div className=' card bg-base-100 shadow-xl mt-5'>
                        <div className="card-header text-xl text-bold z-30 py-3">Admins</div>
                        <div className="overflow-x-auto ">

                            {/* <h1 className='text-center text-xl text-bold z-30 py-3'>All Users</h1> */}
                            <table className="table table-bordered  flex  z-0 border  p-5">
                                {/* head */}
                                <thead className='text-bold text-[15px] text-black z-30'>
                                    <tr>
                                        <th >SrNo</th>
                                        <th >Name</th>
                                        <th >Email</th>
                                        <th >Contect</th>
                                        <th >Address</th>
                                        <th >businessCategory</th>
                                        <th >Role</th>
                                        <th >Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        userList.map((user, i) => {
                                            return (
                                                <tr key={i}>
                                                    <th>{++i}</th>
                                                    <td>{user.name}</td>
                                                    <td>{user.email}</td>
                                                    <td>{user.phone}</td>
                                                    <td>{user?.address?.area} {user?.address?.city} {user?.address?.state} {user?.address?.country} {user?.address?.pincode}</td>
                                                    <td>{user.businessCategory}</td>
                                                    <td>{user.role}</td>
                                                    <td className='d-flex'>
                                                        <button onClick={() => DeletUser(user._id)} className='btn-xl m-1 fs-3 text-primary'><MdOutlineDeleteOutline /></button>
                                                        <button onClick={() => navigate(`/admin/editUser`, { state: user })} className='btn-xl fs-4 text-green-500'><FaEdit /></button>
                                                    </td>

                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>
           
        </>
    )
}

export default ManageAdmin
