import React, { useContext } from 'react';
import { UserContext } from '../UserContext';
import ProfileIcon from "../../public/User_icon.webp"
import { useNavigate } from 'react-router-dom';

function UserDropdown() {
   const { user } = useContext(UserContext);
   const navigate = useNavigate()

   // Fallback image if user doesn't have a profile pic
   const profilePic = user?.profilePic || ProfileIcon;

  return (
    <>
      <div className="dropdown dropstart m-3 w-[60px] h-[60px] rounded-full overflow-hidden">
        <button
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasRight"
          aria-controls="offcanvasRight"
          aria-label="User Profile"
          className="p-0 border-0 w-100 h-100 bg-transparent"
        >
         
            <img 
              src={profilePic} 
              alt={user?.name || "User Profile"} 
              className="w-100 h-100 img-fluid"
              style={{objectFit : "cover" , objectPosition: "center"}}
            />
        
        </button>
      </div>
    </>
  );
}

export default UserDropdown;
