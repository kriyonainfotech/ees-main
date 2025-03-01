import React, { useEffect, useState, Suspense } from 'react'
import logo from "../../public/ess-121.png"
import { Link, useNavigate } from 'react-router-dom'
import { FaPlus } from "react-icons/fa6";
import { GoBell } from "react-icons/go";

// Lazy load components
const UserDropdown = React.lazy(() => import('../components/UserDropdown'));

const AdminHeader = () => {
    const token = JSON.parse(localStorage.getItem('token'))
    const [auth, setAuth] = useState(false)
    const [sticky, setSticky] = useState(false);
    const navigate = useNavigate();

    const navManu = [
        {
            title: 'Home',
            link: '/',
            icon: <FaPlus />
        },
        {
            title: 'Services',
            link: '/servises',
            icon: <FaPlus />
        },
    ]

    useEffect(() => {
        if (token) {
            setAuth(true)
        } else {
            setAuth(false)
        }
    }, [token])

    return (
        <>
            <nav className={`navbar-expand-lg bg-white w-full md:px-20 shadow-sm px-4 py-2 z-20 fixed left-0 top-0 ${sticky ? "sticky-navbar shadow-md bg-white dark:bg-slate-600 dark:text-white duration-300 transition-all ease-in-out" : " bg-base-100 "}`}>
                <div className="container-fluid px-3">
                    <div className="col-12 d-flex align-items-center">
                        <div className="col-4">
                            <div className="dropdown d-flex">
                                <button className=" " type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasScrolling" aria-controls="offcanvasScrolling">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-7 w-7"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4 6h16M4 12h8m-8 6h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="col-4 d-flex align-items-center justify-contebt-center">

                            <div className="logo w-100 navbar-brand d-flex align-items-center justify-content-center">
                                <Link to={'/'}>
                                    <img src={logo} width={80} alt="logo" loading="lazy" />
                                </Link>
                            </div>


                        </div>
                        <div className="col-5 col-md-4 d-flex align-items-center justify-content-end">
                            <div className='w-100 d-flex justify-content-end align-items-center px-3'>
                                {/* Lazy load UserDropdown */}
                                {
                                    auth ? (
                                        <Suspense fallback={<></>}>
                                            <div onClick={() => navigate("/")}>
                                                <UserDropdown />
                                            </div>

                                        </Suspense>
                                    ) :
                                        <div className="">
                                            <Link to={"/login"} className="bg-orange text-white px-3 py-2 rounded-md hover:bg-slate-800 duretion-300 cursor-pointer">Login</Link>
                                        </div>
                                }

                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default AdminHeader;
