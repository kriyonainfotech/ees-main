import React, { useContext, useState } from 'react';
import { FaUser, FaUserFriends, FaPhone, FaPhoneAlt, FaAddressBook } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import Logout from './Logout';
import GetAdmin from './GetAdmin';
import { UserContext } from '../UserContext';
import { FaHandsBound, FaWallet } from 'react-icons/fa6';
import { MdPrivacyTip } from 'react-icons/md';
import  ProfileIcon from "../../public/User_icon.webp"
const UserSideBar = () => {
   const { user } = useContext(UserContext);
   const [profile, setProfile] = useState("");  // `profile` state is not used here, consider removing it
   const navigate = useNavigate();
   
   const sidebarMenu = [
     { title: 'Profile', icon: <FaUser />, path: '/profile' },
     { title: 'Wallete', icon: <FaWallet />, path: '/wallete' },
     { title: 'Team', icon: <FaUserFriends />, path: '/team' },
     { title: 'Customer Care', icon: <FaPhoneAlt />, path: '/support' },
     { title: 'PrivacyPolicy', icon: <MdPrivacyTip />, path: '/privacyPolicy' },
     {  title: 'About Us', icon: <FaAddressBook />,  path: '/aboutus' }
          
   ];

   return (
     <div>
       <div className="offcanvas bg-white offcanvas-end" data-bs-scroll="true" tabIndex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
       <div className="d-flex w-100 justify-content-center pt-4">
          <div className='  '>
           <div className='d-flex w-100 justify-content-center' >
           <div className="img w-[80px] h-[80px] rounded-full border overflow-hidden d-flex ">
              <img src={user?.profilePic || ProfileIcon} className='w-full h-full' style={{objectFit:"cover",objectPosition:"center"}} />
            </div>
           </div>
            <div className='text-center'>
              <h3>{user?.name}</h3>
              <p>{user?.email}</p>
            </div>
          </div>
          <div className='p-3 d-flex justify-content-end position-absolute top-0 end-0'>
            <button type="button" className="btn-close " data-bs-dismiss="offcanvas" aria-label="Close" />

          </div>
        </div>
         <hr />
         <div className="offcanvas-body p-0 p-2">
           <ul>
             {sidebarMenu.map((menuItem, index) => (
               <li key={index} className="w-100 p-2 rounded hover:bg-orange hover:text-white focus:text-white">
                 <Link to={menuItem.path} className="w-100 text-md d-flex align-items-center">
                   <span className="inline-block mr-3 text-lg">{menuItem.icon}</span>
                   {menuItem.title}
                 </Link>
               </li>
             ))}
             {user?.role === "Admin" ? <GetAdmin /> : <></>}
             <Logout />
           </ul>
         </div>
       </div>
     </div>
   );
};

export default UserSideBar;
