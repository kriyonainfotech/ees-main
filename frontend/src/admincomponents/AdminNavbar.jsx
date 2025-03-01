import React, { useEffect, useState, Suspense, useContext } from 'react';
import logo from "../../public/ess-121.png";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiHome, FiSearch, FiUser } from "react-icons/fi";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { VscCircuitBoard } from "react-icons/vsc";
import { SlBriefcase, SlWallet } from "react-icons/sl";
import { MdClose } from "react-icons/md";
import { PiLineVertical } from "react-icons/pi";
import { UserContext } from '../UserContext';

// Lazy load components
const UserDropdown = React.lazy(() => import('../components/UserDropdown'));
const SearchBox = React.lazy(() => import('../components/SearchBox'));
const BellNotification = React.lazy(() => import('../components/BellNotification'));

const AdminNavbar = () => {
    const { user } = useContext(UserContext);
    const token = JSON.parse(localStorage.getItem('token'));
    const [auth, setAuth] = useState(false);
    const [sticky, setSticky] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const navigate = useNavigate();
    const location = useLocation(); // Get the current location

    const navManu = [
        {
            title: 'Home',
            link: '/',
            icon: <PiLineVertical />
        },
        {
            title: 'Services',
            link: '/servises',
            icon: <PiLineVertical />
        },
        {
            title: 'Work',
            link: '/work',
            icon: <PiLineVertical />
        },
        {
            title: 'Profile',
            link: '/profile',
            icon: <PiLineVertical />
        },

        // Conditionally render AboutUs based on login status
        ...(!user ? [
            {
                title: 'AboutUs',
                link: '/aboutus',
            }
        ] : []),
    ];

    const toggleSearch = () => {
        setShowSearch(!showSearch);
    };

    const navManuBottom = [
        { title: 'Home', link: '/', icon: <FiHome />, action: () => navigate('/') },
        { title: 'Search', link: '/servises', icon: <FiSearch />, action: () => { toggleSearch(); navigate('/servises'); } },
        { title: 'Wallet', link: '/wallete', icon: <SlWallet />, action: () => navigate('/wallete') },
        { title: 'Work', link: '/work', icon: <SlBriefcase />, action: () => navigate('/work') },
        { title: 'Profile', link: '/profile', icon: <FiUser />, action: () => navigate('/profile') },
    ];

    useEffect(() => {
        if (user) {
            setAuth(true);
        } else {
            setAuth(false);
        }
    }, [user]);


    return (
        <>
            <nav className={`navbar-expand-lg bg-white w-100 px-3 py-2 shadow-sm z-20 fixed left-0 top-0 ${sticky ? "sticky-navbar shadow-md bg-white dark:bg-slate-600 dark:text-white duration-300 transition-all ease-in-out" : " bg-base-100 "}`}>
                <div className="container">
                    <div className="row">
                        <div className="col-12 d-flex flex-wrap align-items-center justify-content-between">
                            <div className="col-1 d-flex d-lg-none">
                                <div className="dropdown">
                                    <button className="" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div className="col-md-8 col-lg-6 col-xl-6 d-flex align-items-center">
                                <div className='w-100 d-flex justify-content-center justify-content-lg-start  justify-content-xl-start align-items-center'>
                                    <div className="logo d-flex justify-content-center p">
                                        <Link to={'/'}>
                                            <img src={logo} width={70} alt="logo" loading="lazy" />
                                        </Link>
                                    </div>

                                    <div className='w-[300px] d-none d-lg-flex px-3'>
                                        <Suspense fallback={<div>Loading Search...</div>}>
                                            <SearchBox />
                                        </Suspense>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6 col-xl-6 d-flex align-items-center">
                                <div className='w-full d-flex justify-content-end align-items-center'>
                                    <div className="manu d-flex d-none d-lg-flex">
                                        <ul className='d-flex gap-1'>
                                            {
                                                navManu.map((val, i) => {
                                                    return (
                                                        <li key={i}>
                                                            <Link className={`d-flex align-items-center gap-1 ${location.pathname === val.link ? 'text-orange' : 'text-black'}`} to={val.link}>
                                                                {val.title} {val.icon}
                                                            </Link>
                                                        </li>
                                                    );
                                                })
                                            }
                                        </ul>
                                    </div>

                                    <div className='w-100 d-flex justify-content-center ps-3 justify-content-start'>
                                        <Suspense fallback={<div>Loading Notifications...</div>}>
                                            <BellNotification />
                                        </Suspense>
                                    </div>
                                    <div className='w-full d-none d-lg-flex'>
                                        {
                                            auth ? (
                                                <Suspense fallback={<div>Loading User Info...</div>}>
                                                    <UserDropdown />
                                                </Suspense>
                                            ) : (
                                                <div className="">
                                                    <Link to={"/login"} className="bg-orange text-white px-3 py-2 rounded-md hover:bg-slate-800 duration-300 cursor-pointer">Login</Link>
                                                </div>
                                            )
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Top Search Bar */}
            {showSearch && (
                <div className="fixed top-0 left-0 w-full bg-white shadow-sm py-4 px-4 z-30">
                    <div className='d-flex justify-content-center'>
                        <Suspense fallback={<div>Loading Search...</div>}>
                            <SearchBox />
                        </Suspense>
                        <button onClick={toggleSearch} className="btn btn-link text-muted ">
                            <MdClose className='fs-3' />
                        </button>
                    </div>
                </div>
            )}

            {/* Bottom Navigation */}
            <nav className={`d-lg-none navbar-expand-lg bg-white w-full md:px-20 shadow-sm py-2 z-20 fixed left-0 bottom-0 ${sticky ? "sticky-navbar shadow-md bg-white duration-300 transition-all ease-in-out" : " bg-base-100 "}`}>
                <div className="container">
                    <div className="row justify-content-center overflow-hidden px-2">
                        <ul className='d-flex justify-content-between'>
                            {
                                navManuBottom.map((val, i) => {
                                    return (
                                        <li key={i} className='w-full text-center'>
                                            <Link to={val.link} onClick={val.action} className={`${location.pathname === val.link ? 'text-orange' : 'text-black'}`}>
                                                <div className='fs-3 d-flex justify-content-center w-full text-center'>
                                                    {val.icon}
                                                </div>
                                                <span style={{ fontSize: "14px" }}>{val.title} </span>
                                            </Link>
                                        </li>
                                    );
                                })
                            }
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    );
}

export default AdminNavbar;
