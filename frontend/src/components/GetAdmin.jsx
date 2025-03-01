import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FaUserAltSlash } from 'react-icons/fa'
import { Link, Navigate } from 'react-router-dom'

const backend_API = import.meta.env.VITE_API_URL;

const GetAdmin = () => {
    return (
        <>
                <li className=' p-2 rounded hover:bg-primary hover:text-white focus:text-white '>
                    <Link to={'/admin'} className=' text-md d-flex justify-content-start justify-content-lg-start align-items-center'>
                        <span className='inline-block mr-3 text-lg '><FaUserAltSlash /></span>
                        Admin</Link>
                </li>
        </>
    )
}

export default GetAdmin
