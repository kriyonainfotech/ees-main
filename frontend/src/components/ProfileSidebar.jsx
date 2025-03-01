import React, { useContext } from 'react';
import { FaUser, FaUserFriends, FaPhone, FaAddressBook } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import GetAdmin from './GetAdmin';
import Logout from './Logout';
import { UserContext } from '../UserContext';
import { MdPrivacyTip } from 'react-icons/md';
import ProfileIcon from "../../public/User_icon.webp"

const ProfileSidebar = () => {
  const { user } = useContext(UserContext);

  const sidebarMenu = [
    {
      title: 'Profile',
      icon: <FaUser />,
      path: '/profile',
    },
    {
      title: 'Team',
      icon: <FaUserFriends />,
      path: '/team',
    },
    {
      title: 'About Us',
      icon: <FaAddressBook />,
      path: '/aboutus'
    },
    {
      title: 'Customer Care',
      icon: <FaPhone />,
      path: '/support',
    },
    {
      title: 'PrivacyPolicy',
      icon: <MdPrivacyTip />,
      path: '/privacyPolicy'
    },


  ];

  return (
    <>
      <div>
        <div className="offcanvas bg-white offcanvas-start" data-bs-scroll="true" tabIndex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
          <div className="d-flex w-100 justify-content-center pt-4">
            <div className='  '>
              <div className='d-flex w-100 justify-content-center' >
                <div className="img w-[80px] h-[80px] rounded-full border overflow-hidden d-flex ">
                  <img src={user?.profilePic || ProfileIcon} />
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

          <div className="offcanvas-body p-2">
            <ul>
              {sidebarMenu.map((menuItem, i) => (
                <li key={i} className="w-100 p-2 rounded hover:bg-orange hover:text-white focus:text-white">
                  <Link to={menuItem.path} className="w-100 text-md d-flex justify-content-start align-items-center">
                    <span className="inline-block mr-3 text-lg">{menuItem.icon}</span>
                    {menuItem.title}
                  </Link>
                </li>
              ))}

              {user?.role === "Admin" && <GetAdmin />}
              <Logout />
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileSidebar;
