import React from 'react'
import { Route, Routes } from 'react-router-dom'
import EditUser from '../admincomponents/EditUser'
import AdminHeader from '../admincomponents/AdminHeader'
import AdminSidebar from '../admincomponents/AdminSidebar'
import AllUsers from '../adminPages/AllUsers'
import ManageCatagory from '../adminPages/ManageCatagory'

const Admin = () => {
  return (
    <>
      <div className=''>
        <AdminHeader />
        <AdminSidebar />
        <AllUsers />
        <Routes>
          <Route path="/admin/editUser" element={<EditUser />} />
          <Route path="/admin/manageCategory" element={<ManageCatagory />} />
        </Routes>
      </div>
    </>
  )
}

export default Admin
