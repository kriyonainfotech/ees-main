import React from 'react'
import logo from "../../public/ess-121.png"
import { SlLocationPin, SlSocialFacebook, SlSocialGoogle, SlSocialInstagram, SlSocialYoutube } from 'react-icons/sl'
import { BsWhatsapp } from 'react-icons/bs'

const Footer = () => {
    return (
        <footer className="footer bg-gray py-3 pb-5">
            <div className="container">
                <div className="row">
                    <div className="col-12 d-flex justify-content-center">
                        <div className='col-8  d-flex justify-content-center text-center' >
                            <div>
                                <div className='logo-footer d-flex justify-content-center'>
                                    <img src={logo} width={100} alt="" />
                                </div>
                                <p>Our company is a leading provider of innovative solutions.</p>

                                <div className="d-flex justify-content-center py-3 ">
                                    <div className="social-links d-flex gap-2">
                                        <a href="https://www.google.com/maps/place/Enjoy+Enjoy+Sarvices/@21.1613536,72.8106195,18.54z/data=!4m6!3m5!1s0x3be04d98bee0eec3:0x87dc31f6feff27c9!8m2!3d21.1607677!4d72.8110705!16s%2Fg%2F11l315q58g?entry=tts&g_ep=EgoyMDI1MDEyMi4wIPu8ASoASAFQAw%3D%3D" className="s-icon d-flex align-items-center text-[20px] p-2 border" target='_blanck'>

                                            <SlSocialGoogle />
                                        </a>
                                        <a href="https://www.facebook.com/profile.php?id=61572393125569&rdid=K9qIibVPFmJ4iwrV&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1Ptdu1sZ1y%2F#" target='_blank' className="s-icon d-flex align-items-center  text-[20px] border  p-2">
                                            <SlSocialFacebook />
                                        </a>

                                        <a href="#" className="s-icon d-flex align-items-center fs-bold  text-[20px] border p-2">
                                            <BsWhatsapp />
                                        </a>
                                        <a href="https://www.instagram.com/ees_121_/?igsh=N2h1N3F6Nnc0ZmUy#" target='_blank' className="s-icon d-flex align-items-center fs-bold  text-[20px] border  p-2">
                                            <SlSocialInstagram />
                                        </a>
                                        <a href="https://www.youtube.com/@ees121official" target='_blank' className="s-icon d-flex align-items-center   text-[20px] border p-2">
                                            <SlSocialYoutube />
                                        </a>
                                    </div>
                                </div>
                                <div className='text-center text-sm pb-5 d-flex align-items-center justify-content-center flex-wrap gap-1'>
                                    <p className=" ">Copyright 2025 ees121.com</p>
                                    <p>All rights reserved</p>

                                </div>


                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer