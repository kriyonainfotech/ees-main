import React, { useState } from 'react';
import AdminNavbar from '../admincomponents/AdminNavbar';
import UserSideBar from '../components/UserSideBar';
import ProfileSidebar from '../components/ProfileSidebar';
import Reffrale from '../components/Team/Reffrale';
import ReferredBy from '../components/Team/ReferredBy';
import Footer from '../components/Footer';

const Team = () => {
  const [activeSection, setActiveSection] = useState('referral');

  const handleSectionClick = (section) => {
    setActiveSection(section);
  };

  return (
    <>
      <AdminNavbar />
      <UserSideBar />
      <ProfileSidebar />
      <div className="py-28">
        <section className="">
          <div className="container">
            <div className="row">
              <div className="raffral w-100">
                <Reffrale />
                <ReferredBy />
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Team;
