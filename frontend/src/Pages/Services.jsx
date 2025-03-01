import React, { useState } from 'react'
import UserSideBar from '../components/UserSideBar'
import SearchScreen from './SearchScreen '
import AdminNavbar from '../admincomponents/AdminNavbar'
import ProfileSidebar from '../components/ProfileSidebar';
import SearchBox from '../components/SearchBox';
import Footer from '../components/Footer';

const Services = () => {
  const [loading, setLoading] = useState(false);

  return (
    <>

      <AdminNavbar />
      <UserSideBar />
      <ProfileSidebar />
      <div className='my-32'>
        <section>
          <div className="container">
            <div className="row">
              <div className="col-12 d-lg-none pb-3">
                <SearchBox />
              </div>
            </div>
          </div>
        </section>
        {loading ?
      <div className="spinner-border text-white" role="status">
      <span className="sr-only">Loading...</span>
       </div> : <SearchScreen />}

   

      </div>
      <Footer/>

    </>
  )
}

export default Services
