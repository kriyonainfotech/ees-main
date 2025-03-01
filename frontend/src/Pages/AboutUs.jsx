import React from 'react'
import AdminNavbar from '../admincomponents/AdminNavbar'
import UserSideBar from '../components/UserSideBar'
import ProfileSidebar from '../components/ProfileSidebar'
import Aboutus from '../../public/Aboutus.jpg'
import Footer from '../components/Footer'

const AboutUs = () => {
    return (
        <>
            <AdminNavbar />
            <UserSideBar />
            <ProfileSidebar />
            <div className='py-32'>
                <div className="section">
                    <div className="container">
                        <div className="row">
                            <div className="col-12 d-flex justify-content-center align-items-center">
                                <div className="col-md-12">
                                    <div className="py-3">
                                        <h2 className="text-center">About Us</h2>
                                        <p className="text-center py-3">Welcome to Enjoy Enjoy Sarvices (EES) – your ultimate platform for connecting service seekers and providers across 146 diverse categories, including AC repair, beauty parlors, mechanics, tailors, plumbers, teachers, dance instructors, DJs, and more.</p>
                                    </div>
                                </div>
                               
                            </div>
                            <div className="col-12 d-flex flex-wrap">
                                    <div className="col-12 col-md-6 p-2">
                                       <div className='img-about w-100 h-100 p-4  shadow-xl'>
                                        <img src={Aboutus} className='w-100 h-100' alt="" />
                                       </div>
                                    </div>
                                   
                                    <div className="col-12 col-md-6 p-2">
                                       <div className='p-4  shadow-xl text-gray'>
                                        <p>At EES, we believe in creating opportunities for everyone. Whether you're a service provider looking to expand your reach or a user searching for trusted professionals, our platform bridges the gap with ease and reliability. To maintain quality and accountability, both service seekers and providers are required to register with us by paying a nominal fee of ₹121. This one-time registration unlocks unlimited access to request or offer services across all categories.
                                        </p>
                                       <p className=' py-3' >
                                       We prioritize safety, transparency, and user satisfaction. Our secure KYC process ensures that all registered users are verified, and our mutual rating system helps maintain trust and accountability between users and service providers. With EES, you can enjoy a seamless experience connecting with the right people for your needs.  </p>

                                       <button>
                                        <a href="#" className="btn bg-orange text-white">Get Started</a>
                                       </button>
                                       </div>
                                    </div>
                                   

                                </div>

                                <div className="col-12 py-5 text-center ">
                                    <div>
                                    <strong className=' w-100'>Join Enjoy Enjoy Sarvices today and experience the convenience of a trusted platform designed for everyone!</strong>

                                    </div>
                                        
                                </div>
                               <div className="col-12 d-flex justify-content-center ">
                               <div className="col-12 col-md-8 text-center">
                                <div className='w-100 d-flex flex-column bg-gray p-2'>
                                    <p className=''> <a href="mailto:eesofficial@gmail.com">eesofficial@gmail.com</a></p>
                                    <p className='py-2 '><a href="">
                                            1002 Swapnadeep Complex Althan Rd near CNG Pump Uma Bhawan Society Althan Bhatar char Rasta, surat, gujrat. </a></p>

                                    </div>
                                </div>
                               </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </>
    )
}

export default AboutUs