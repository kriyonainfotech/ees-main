import React, { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom';
import { UserContext } from '../UserContext';


const ProtectedRoute = () => {
     const { user } = useContext(UserContext);
      
    const token = localStorage.getItem('token');
   // return token ? <Outlet /> : <Navigate to="login" />
    return user ? <Outlet /> : <Navigate to="login" />
}

export default ProtectedRoute