// src/PrivacyPolicy.js
import React from 'react';
import AdminNavbar from '../admincomponents/AdminNavbar';
import UserSideBar from '../components/UserSideBar';
import ProfileSidebar from '../components/ProfileSidebar';
import { FaDotCircle } from 'react-icons/fa';
import { GoDotFill } from 'react-icons/go';
import Footer from '../components/Footer';

const PrivacyPolicy = () => {
    return (
        <>
            <AdminNavbar />
            <UserSideBar />
            <ProfileSidebar />
            <div className='my-28'>
                <section>
                    <div className="container">
                        <div className="row">
                            <h1>Privacy Policy</h1>
                            <p>Last updated: June 04, 2025</p>
                            <p className='py-3'>This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.</p>
                            <p className='pb-5'>We use Your Personal data to provide and improve the Service. By using the Service, You agree to the collection and use of information in accordance with this Privacy Policy. This Privacy Policy has been created with the help of the <a href="https://www.termsfeed.com/privacy-policy-generator/" target="_blank">Privacy Policy Generator</a>.</p>
                            <div className="my-10 px-4 md:px-6 lg:px-8 text-gray-800">
                                <h2 className="text-2xl font-bold mb-4">Interpretation and Definitions</h2>

                                <h3 className="text-xl font-semibold mt-6 mb-2">Interpretation</h3>
                                <p className="mb-4">
                                    The words of which the initial letter is capitalized have meanings defined under the following conditions.
                                    The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.
                                </p>

                                <h3 className="text-xl font-semibold mt-6 mb-2">Definitions</h3>
                                <p className="mb-4">For the purposes of this Privacy Policy:</p>

                                <ul className="space-y-4 list-disc list-inside">
                                    <li className='flex flex-wrap'>
                                        <p className=''><strong>Account</strong> - means a unique account created for You to access our Service or parts of our Service.</p>
                                    </li>
                                    <li className='flex flex-wrap'>
                                        <p><strong>Affiliate</strong> - means an entity that controls, is controlled by or is under common control with a party, where "control" means ownership of 50% or more of the shares, equity interest or other securities entitled to vote for election of directors or other managing authority.</p>
                                    </li>
                                    <li className='flex flex-wrap'>
                                        <p><strong>Company</strong> - (referred to as either "the Company", "We", "Us" or "Our" in this Agreement) refers to Corporation, 1002 Swapnadeep Complex, Althan Rd, near CNG Pump, Uma Bhawan Society, Althan Bhatar Char Rasta, Surat, Gujarat.</p>
                                    </li>
                                    <li className='flex flex-wrap'>
                                        <p><strong>Cookies</strong> - are small files that are placed on Your computer, mobile device or any other device by a website, containing the details of Your browsing history on that website among its many uses.</p>
                                    </li>
                                    <li className='flex flex-wrap'>
                                        <p><strong>Country</strong> - refers to: Gujarat, India</p>
                                    </li>
                                    <li className='flex flex-wrap'>
                                        <p><strong>Device</strong> - means any device that can access the Service such as a computer, a cellphone or a digital tablet.</p>
                                    </li>
                                    <li className='flex flex-wrap'>
                                        <p><strong>Personal Data</strong> - is any information that relates to an identified or identifiable individual.</p>
                                    </li>
                                    <li className='flex flex-wrap'>
                                        <p><strong>Service</strong> - refers to the Website.</p>
                                    </li>
                                    <li className='flex flex-wrap'>
                                        <p><strong>Service Provider</strong> - means any natural or legal person who processes the data on behalf of the Company. It refers to third-party companies or individuals employed by the Company to facilitate the Service, to provide the Service on behalf of the Company, to perform services related to the Service or to assist the Company in analyzing how the Service is used.</p>
                                    </li>
                                    <li className='flex flex-wrap'>
                                        <p><strong>Usage Data</strong> - refers to data collected automatically, either generated by the use of the Service or from the Service infrastructure itself (for example, the duration of a page visit).</p>
                                    </li>
                                    <li className='flex flex-wrap'>
                                        <p><strong>Website</strong> - refers to ees121, accessible from <a href="https://ees121.com/" className="text-gray-600 underline" target="_blank" rel="noopener noreferrer">https://ees121.com/</a></p>
                                    </li>
                                    <li className='flex flex-wrap'>
                                        <p><strong>You</strong> - means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.</p>
                                    </li>
                                </ul>
                            </div>

                            <div className="my-10 px-4 md:px-6 lg:px-8 text-gray-800">
                                <h2 className="text-2xl font-bold mb-4">Collecting and Using Your Personal Data</h2>

                                <h3 className="text-xl font-semibold mt-6 mb-2">Types of Data Collected</h3>

                                <h4 className="text-lg font-medium mt-4 mb-2">Personal Data</h4>
                                <p className="mb-4">
                                    While using Our Service, We may ask You to provide Us with certain personally identifiable information
                                    that can be used to contact or identify You. Personally identifiable information may include, but is not limited to:
                                </p>

                                <ul className="space-y-2 mb-6">
                                    <li>
                                        <p>Email address</p>
                                    </li>
                                    <li>
                                        <p>First name and last name</p>
                                    </li>
                                    <li>
                                        <p>Phone number</p>
                                    </li>
                                    <li>
                                        <p>Address, State, Province, ZIP/Postal code, City</p>
                                    </li>
                                    <li>
                                        <p>Usage Data</p>
                                    </li>
                                </ul>
                            </div>

                            <div className="my-8 px-4 md:px-6 lg:px-8 text-gray-800">
                                <h4 className="text-lg font-medium mt-4 mb-2">Usage Data</h4>

                                <p className="mb-4">
                                    Usage Data is collected automatically when using the Service.
                                </p>

                                <p className="mb-4">
                                    Usage Data may include information such as Your Device's Internet Protocol address (e.g. IP address), browser type, browser version,
                                    the pages of our Service that You visit, the time and date of Your visit, the time spent on those pages, unique device identifiers,
                                    and other diagnostic data.
                                </p>

                                <p className="mb-4">
                                    When You access the Service by or through a mobile device, We may collect certain information automatically, including, but not limited to,
                                    the type of mobile device You use, Your mobile device unique ID, the IP address of Your mobile device, Your mobile operating system,
                                    the type of mobile Internet browser You use, unique device identifiers, and other diagnostic data.
                                </p>

                                <p className="mb-4">
                                    We may also collect information that Your browser sends whenever You visit our Service or when You access the Service by or through a mobile device.
                                </p>
                            </div>

                            <div className="my-10 px-4 md:px-6 lg:px-8 text-gray-800">
                                <h4 className="font-semibold text-xl mt-4 mb-2">Tracking Technologies and Cookies</h4>

                                <p className="mb-4">
                                    We use Cookies and similar tracking technologies to track the activity on Our Service and store certain information.
                                    Tracking technologies used are beacons, tags, and scripts to collect and track information and to improve and analyze Our Service.
                                    The technologies We use may include:
                                </p>

                                <ul className="space-y-4 mb-6">
                                    <li>
                                        <p><strong>Cookies or Browser Cookies.</strong> A cookie is a small file placed on Your Device.
                                            You can instruct Your browser to refuse all Cookies or to indicate when a Cookie is being sent.
                                            However, if You do not accept Cookies, You may not be able to use some parts of our Service.
                                            Unless you have adjusted Your browser setting so that it will refuse Cookies, our Service may use Cookies.</p>
                                    </li>
                                    <li>
                                        <p><strong>Web Beacons.</strong> Certain sections of our Service and our emails may contain small electronic files known as
                                            web beacons (also referred to as clear gifs, pixel tags, and single-pixel gifs) that permit the Company, for example,
                                            to count users who have visited those pages or opened an email and for other related website statistics (for example,
                                            recording the popularity of a certain section and verifying system and server integrity).</p>
                                    </li>
                                </ul>

                                <p className="mb-4">
                                    Cookies can be <em>"Persistent"</em> or <em>"Session"</em> Cookies. Persistent Cookies remain on Your personal computer or
                                    mobile device when You go offline, while Session Cookies are deleted as soon as You close Your web browser.
                                    You can learn more about cookies on the
                                    <a href="https://www.termsfeed.com/blog/cookies/#What_Are_Cookies"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-600 underline ml-1">
                                        TermsFeed website
                                    </a>.
                                </p>

                                <p className="mb-4">
                                    We use both Session and Persistent Cookies for the purposes set out below:
                                </p>

                                <ul className="space-y-6 mb-6">
                                    <li>
                                        <p><strong>Necessary / Essential Cookies</strong></p>
                                        <p className="text-sm">Type: Session Cookies</p>
                                        <p className="text-sm">Administered by: Us</p>
                                        <p className="mt-1">
                                            Purpose: These Cookies are essential to provide You with services available through the Website and to enable You
                                            to use some of its features. They help to authenticate users and prevent fraudulent use of user accounts. Without
                                            these Cookies, the services that You have asked for cannot be provided, and We only use these Cookies to provide
                                            You with those services.
                                        </p>
                                    </li>
                                    <li>
                                        <p><strong>Cookies Policy / Notice Acceptance Cookies</strong></p>
                                        <p className="text-sm">Type: Persistent Cookies</p>
                                        <p className="text-sm">Administered by: Us</p>
                                        <p className="mt-1">
                                            Purpose: These Cookies identify if users have accepted the use of cookies on the Website.
                                        </p>
                                    </li>
                                    <li>
                                        <p><strong>Functionality Cookies</strong></p>
                                        <p className="text-sm">Type: Persistent Cookies</p>
                                        <p className="text-sm">Administered by: Us</p>
                                        <p className="mt-1">
                                            Purpose: These Cookies allow us to remember choices You make when You use the Website, such as remembering your
                                            login details or language preference. The purpose of these Cookies is to provide You with a more personal experience
                                            and to avoid You having to re-enter your preferences every time You use the Website.
                                        </p>
                                    </li>
                                </ul>

                                <p className="mb-4">
                                    For more information about the cookies we use and your choices regarding cookies, please visit our Cookies Policy or the Cookies section of our Privacy Policy.
                                </p>
                            </div>

                            <div className="my-10 px-4 md:px-6 lg:px-8 text-gray-800">
                                <h3 className="text-xl font-semibold mt-6 mb-4">Use of Your Personal Data</h3>

                                <p className="mb-4">
                                    The Company may use Personal Data for the following purposes:
                                </p>

                                <div className="space-y-4 mb-6">
                                    <p><strong>To provide and maintain our Service</strong>, including to monitor the usage of our Service.</p>

                                    <p><strong>To manage Your Account:</strong> to manage Your registration as a user of the Service.
                                        The Personal Data You provide can give You access to different functionalities of the Service
                                        that are available to You as a registered user.
                                    </p>

                                    <p><strong>For the performance of a contract:</strong> the development, compliance and undertaking of the purchase contract
                                        for the products, items or services You have purchased or of any other contract with Us through the Service.
                                    </p>

                                    <p><strong>To contact You:</strong> To contact You by email, telephone calls, SMS, or other equivalent forms of electronic communication,
                                        such as a mobile application's push notifications regarding updates or informative communications related to the functionalities,
                                        products or contracted services, including the security updates, when necessary or reasonable for their implementation.
                                    </p>

                                    <p><strong>To provide You</strong> with news, special offers and general information about other goods, services and events
                                        which we offer that are similar to those that you have already purchased or enquired about unless You have opted not to receive such information.
                                    </p>

                                    <p><strong>To manage Your requests:</strong> To attend and manage Your requests to Us.</p>

                                    <p><strong>For business transfers:</strong> We may use Your information to evaluate or conduct a merger, divestiture, restructuring, reorganization,
                                        dissolution, or other sale or transfer of some or all of Our assets, whether as a going concern or as part of bankruptcy, liquidation, or similar proceeding,
                                        in which Personal Data held by Us about our Service users is among the assets transferred.
                                    </p>

                                    <p><strong>For other purposes</strong>: We may use Your information for other purposes, such as data analysis, identifying usage trends,
                                        determining the effectiveness of our promotional campaigns and to evaluate and improve our Service, products, services, marketing and your experience.
                                    </p>
                                </div>

                                <p className="mb-4">We may share Your personal information in the following situations:</p>

                                <div className="space-y-4 mb-6">
                                    <p><strong>With Service Providers:</strong> We may share Your personal information with Service Providers to monitor and analyze the use of our Service, to contact You.</p>

                                    <p><strong>For business transfers:</strong> We may share or transfer Your personal information in connection with, or during negotiations of,
                                        any merger, sale of Company assets, financing, or acquisition of all or a portion of Our business to another company.
                                    </p>

                                    <p><strong>With Affiliates:</strong> We may share Your information with Our affiliates, in which case we will require those affiliates to honor this Privacy Policy.
                                        Affiliates include Our parent company and any other subsidiaries, joint venture partners or other companies that We control or that are under common control with Us.
                                    </p>

                                    <p><strong>With business partners:</strong> We may share Your information with Our business partners to offer You certain products, services or promotions.</p>

                                    <p><strong>With other users:</strong> when You share personal information or otherwise interact in the public areas with other users,
                                        such information may be viewed by all users and may be publicly distributed outside.
                                    </p>

                                    <p><strong>With Your consent:</strong> We may disclose Your personal information for any other purpose with Your consent.</p>
                                </div>
                            </div>

                            <div className="my-10 px-4 md:px-6 lg:px-8 text-gray-800">
                                <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
                                    Retention of Your Personal Data
                                </h3>
                                <p className="mb-4">
                                    The Company will retain Your Personal Data only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use Your Personal Data to the extent necessary to comply with our legal obligations (for example, if we are required to retain your data to comply with applicable laws), resolve disputes, and enforce our legal agreements and policies.
                                </p>
                                <p className="mb-4">
                                    The Company will also retain Usage Data for internal analysis purposes. Usage Data is generally retained for a shorter period of time, except when this data is used to strengthen the security or to improve the functionality of Our Service, or We are legally obligated to retain this data for longer time periods.
                                </p>

                                <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-4">
                                    Transfer of Your Personal Data
                                </h3>
                                <p className="mb-4">
                                    Your information, including Personal Data, is processed at the Company's operating offices and in any other places where the parties involved in the processing are located. It means that this information may be transferred to — and maintained on — computers located outside of Your state, province, country or other governmental jurisdiction where the data protection laws may differ than those from Your jurisdiction.
                                </p>
                                <p className="mb-4">
                                    Your consent to this Privacy Policy followed by Your submission of such information represents Your agreement to that transfer.
                                </p>
                                <p className="mb-4">
                                    The Company will take all steps reasonably necessary to ensure that Your data is treated securely and in accordance with this Privacy Policy and no transfer of Your Personal Data will take place to an organization or a country unless there are adequate controls in place including the security of Your data and other personal information.
                                </p>

                                <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-4">
                                    Delete Your Personal Data
                                </h3>
                                <p className="mb-2">
                                    You have the right to delete or request that We assist in deleting the Personal Data that We have collected about You.
                                </p>
                                <p className="mb-2">
                                    Our Service may give You the ability to delete certain information about You from within the Service.
                                </p>
                                <p className="mb-2">
                                    You can update, amend, or delete your information at any time by signing in to Your Account, if you have one, and visiting the account settings section that allows you to manage your personal information. To do this, click on the profile icon at the top right corner, navigate to your Profile page, and scroll to the bottom where you will find options to edit or delete your account. You may also contact Us to request access to, correct, or delete any personal information that You have provided to Us.

                                </p>
                                <p className="pb-9">
                                    Please note, however, that We may need to retain certain information when we have a legal obligation or lawful basis to do so.
                                </p>

                                <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-4">
                                    Disclosure of Your Personal Data
                                </h3>

                                <h4 className="text-lg font-medium italic text-gray-600 mt-6 mb-2">
                                    Business Transactions
                                </h4>
                                <p className="mb-4">
                                    If the Company is involved in a merger, acquisition or asset sale, Your Personal Data may be transferred. We will provide notice before Your Personal Data is transferred and becomes subject to a different Privacy Policy.
                                </p>

                                <h4 className="text-lg font-medium italic text-gray-600 mt-6 mb-2">
                                    Law enforcement
                                </h4>
                                <p className="mb-4">
                                    Under certain circumstances, the Company may be required to disclose Your Personal Data if required to do so by law or in response to valid requests by public authorities (e.g. a court or a government agency).
                                </p>

                                <h4 className="text-lg font-medium italic text-gray-600 mt-6 mb-2">
                                    Other legal requirements
                                </h4>
                                <p className="mb-2">
                                    The Company may disclose Your Personal Data in the good faith belief that such action is necessary to:
                                </p>
                                <ul className="list-disc list-inside mb-6 text-gray-700">
                                    <li>Comply with a legal obligation</li>
                                    <li>Protect and defend the rights or property of the Company</li>
                                    <li>Prevent or investigate possible wrongdoing in connection with the Service</li>
                                    <li>Protect the personal safety of Users of the Service or the public</li>
                                    <li>Protect against legal liability</li>
                                </ul>

                                <h3 className="text-lg font-medium italic text-gray-600 pt-6 mb-2">
                                    Security of Your Personal Data
                                </h3>
                                <p className="mb-4">
                                    The security of Your Personal Data is important to Us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While We strive to use commercially acceptable means to protect Your Personal Data, We cannot guarantee its absolute security.
                                </p>

                                <h2 className="text-2xl font-bold text-gray-900 py-3">
                                    Children's Privacy
                                </h2>
                                <p className="mb-4">
                                    Our Service does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from anyone under the age of 13. If You are a parent or guardian and You are aware that Your child has provided Us with Personal Data, please contact Us. If We become aware that We have collected Personal Data from anyone under the age of 13 without verification of parental consent, We take steps to remove that information from Our servers.
                                </p>
                                <p className="mb-4">
                                    If We need to rely on consent as a legal basis for processing Your information and Your country requires consent from a parent, We may require Your parent's consent before We collect and use that information.
                                </p>

                                <h2 className="text-2xl font-bold text-gray-900 py-3">
                                    Changes to this Privacy Policy
                                </h2>
                                <p className="mb-2">
                                    We may update Our Privacy Policy from time to time. We will notify You of any changes by posting the new Privacy Policy on this page.
                                </p>
                                <p className="mb-2">
                                    We will let You know via email and/or a prominent notice on Our Service, prior to the change becoming effective and update the &quot;Last updated&quot; date at the top of this Privacy Policy.
                                </p>
                                <p className="mb-4">
                                    You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
                                </p>

                                <h2 className="text-2xl font-bold text-gray-900 py-3">
                                    Contact Us
                                </h2>
                                <p className="mb-2">If you have any questions about this Privacy Policy, You can contact us:</p>
                                <ul className="list-disc list-inside mb-8 text-gray-700">
                                    <li className="mb-2">By email: <a href="mailto:eesofficial@gmail.com" className="text-gray-600 underline">eesofficial@gmail.com</a></li>
                                    <li>
                                        By visiting this page on our website:{" "}
                                        <a
                                            href="https://ees121.com/support"
                                            target="_blank"
                                            rel="noopener noreferrer nofollow"
                                            className="text-gray-600 underline"
                                        >
                                            https://ees121.com/support
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="row">
                            {/* <div className="policy bg-gray">
                                <div className='p-2 text-gray border-b'>
                                    <h4>PrivacyPolicy</h4>
                                </div>
                                <div className='text-muted p-1'>
                                    <p className='py-3'>This website is operated by ees121. Throughout the site, the terms we refer to ees121. ees121 offers this website, including all information, tools and services available from this site to you, the user, conditioned upon your acceptance of all terms, conditions, policies and notices stated here.</p>
                                    <p>By visiting our site and/ or purchasing something from us, you engage in our “Service” and agree to be bound by the following terms and conditions , including those additional terms and conditions and policies referenced herein and/or available by hyperlink. These Terms of Service apply  to all users of the site, including without limitation users who are browsers, vendors, customers, merchants, and/ or contributors of conten</p>
                                    <p className='py-3'>Please read these Terms of Service carefully before accessing or using our website. By accessing or using any part of the site, you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions of this agreement, then you may not access the website or use any services. If these Terms of Service are considered an offer, acceptance is expressly limited to these Terms of Service.
                                        .</p>
                                    <p>Any new features or tools which are added to the current store shall also be subject to the Terms of Service. You can review the most current version of the Terms of Service at any time on this page. We reserve the right to update, change or replace any part of these Terms of Service by posting updates and/or changes to our website. It is your responsibility to check this page periodically for changes. Your continued use of or access to the website following the posting of any changes constitutes acceptance of those changes.
                                    </p>
                                </div>
                                <div className='text-muted  '>
                                    <h6 className='text-gray'>Consent</h6>
                                    <p className='py-3'>By using our website, you hereby consent to our Privacy Policy and agree to its terms.</p>
                                    <h6 className='text-gray'> ONLINE STORE TERMS</h6>
                                    <p className='py-3'>By agreeing to these Terms of Service, you represent that you are at least the age of majority in your state or province of residence, or that you are the age of majority in your state or province of residence and you have given us your consent to allow any of your minor dependents to use this site.

                                        You may not use our products for any illegal or unauthorized purpose nor may you, in the use of the Service, violate any laws in your jurisdiction (including but not limited to copyright laws).

                                        You must not transmit any worms or viruses or any code of a destructive nature.

                                        A breach or violation of any of the Terms will result in an immediate termination of your Services.
                                    </p>
                                    <h6 className='text-gray'>GENERAL CONDITIONS</h6>
                                    <p className='py-3'>We reserve the right to refuse service to anyone for any reason at any time.
                                    </p>
                                    <p>You understand that your content (not including credit card information), may be transferred unencrypted and involve (a) transmissions over various networks; and (b) changes to conform and adapt to technical requirements of connecting networks or devices. Credit card information is always encrypted during transfer over networks.
                                    </p>
                                    <p className='py-3'>
                                        You agree not to reproduce, duplicate, copy, sell, resell or exploit any portion of the Service, use of the Service, or access to the Service or any contact on the website through which the service is provided, without express written permission by us.
                                    </p>
                                    <p>The headings used in this agreement are included for convenience only and will not limit or otherwise affect these Terms.
                                    </p>

                                </div>
                                <div className='py-3'>
                                    <h6 className='text-gray'> ACCURACY, COMPLETENESS AND TIMELINESS OF INFORMATION</h6>
                                    <p className='py-3'>We are not responsible if information made available on this site is not accurate, complete or current. The material on this site is provided for general information only and should not be relied upon or used as the sole basis for making decisions without consulting primary, more accurate, more complete or more timely sources of information. Any reliance on the material on this site is at your own risk.
                                    </p>
                                    <p>This site may contain certain historical information. Historical information, necessarily, is not current and is provided for your reference only. We reserve the right to modify the contents of this site at any time, but we have no obligation to update any information on our site. You agree that it is your responsibility to monitor changes to our site.
                                    </p>
                                    <h6 className='text-gray'> MODIFICATIONS TO THE SERVICE AND PRICES</h6>
                                    <p className='py-3'>Prices for our products are subject to change without notice.
                                    </p>
                                    <p className='py-3'>We reserve the right at any time to modify or discontinue the Service (or any part or content thereof) without notice at any time.

                                    </p>
                                    <p className='py-3'>We shall not be liable to you or to any third-party for any modification, price change, suspension or discontinuance of the Service.
                                    </p>

                                    <h6 className='text-gray'>PRODUCTS OR SERVICES
                                    </h6>
                                    <p className='py-3'>Certain products or services may be available exclusively online through the website. These products or services may have limited quantities and are subject to return or exchange only according to our Return Policy.
                                    </p>
                                    <p className='py-3'>We have made every effort to display as accurately as possible the colors and images of our products that appear at the store. We cannot guarantee that your computer monitor's display of any color will be accurate.
                                    </p>
                                    <p className='py-3'>We reserve the right, but are not obligated, to limit the sales of our products or Services to any person, geographic region or jurisdiction. We may exercise this right on a case-by-case basis. We reserve the right to limit the quantities of any products or services that we offer. All descriptions of products or product pricing are subject to change at anytime without notice, at the sole discretion of us. We reserve the right to discontinue any product at any time. Any offer for any product or service made on this site is void where prohibited.
                                    </p>
                                    <p>We do not warrant that the quality of any products, services, information, or other material purchased or obtained by you will meet your expectations, or that any errors in the Service will be corrected.
                                    </p>
                                    <ul className='list-unstyled py-2'>
                                        <li className='d-flex gap-2'> <GoDotFill className='mt-1' />Google</li>
                                        <li className='d-flex '><a className='ps-4' href="https://policies.google.com/technologies/ads">https://policies.google.com/technologies/ads</a></li>

                                    </ul>

                                </div>
                                <div className='py-3'>
                                    <h6 className='text-gray'>ACCURACY OF BILLING AND ACCOUNT INFORMATION
                                    </h6>
                                    <p className='py-3'>We reserve the right to refuse any order you place with us. We may, in our sole discretion, limit or cancel quantities purchased per person, per household or per order. These restrictions may include orders placed by or under the same customer account, the same credit card, and/or orders that use the same billing and/or shipping address. In the event that we make a change to or cancel an order, we may attempt to notify you by contacting the e-mail and/or billing address/phone number provided at the time the order was made. We reserve the right to limit or prohibit orders that, in our sole judgment, appear to be placed by dealers, resellers or distributors.</p>
                                    <p>You agree to provide current, complete and accurate purchase and account information for all purchases made at our store. You agree to promptly update your account and other information, including your email address and credit card numbers and expiration dates, so that we can complete your transactions and contact you as needed.
                                    </p>
                                    <p>For more detail, please review our Returns Policy</p>

                                    <h6 className='text-gray py-3'>Third Party Privacy Policies</h6>
                                    <p>ees121's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.</p>
                                    <p>You can choose to disable cookies through your individual browser options. To know more detailed information about cookie management with specific web browsers, it can be found at the browsers' respective websites.</p>
                                </div>
                                <div>
                                    <h6 className='text-gray'>USER COMMENTS, FEEDBACK AND OTHER SUBMISSIONS</h6>
                                    <p className=' py-3'>If, at our request, you send certain specific submissions (for example contest entries) or without a request from us you send creative ideas, suggestions, proposals, plans, or other materials, whether online, by email, by postal mail, or otherwise (collectively, 'comments'), you agree that we may, at any time, without restriction, edit, copy, publish, distribute, translate and otherwise use in any medium any comments that you forward to us. We are and shall be under no obligation (1) to maintain any comments in confidence; (2) to pay compensation for any comments; or (3) to respond to any comments.
                                    </p>
                                    <p>We may, but have no obligation to, monitor, edit or remove content that we determine in our sole discretion are unlawful, offensive, threatening, libelous, defamatory, pornographic, obscene or otherwise objectionable or violates any party’s intellectual property or these Terms of Service.

                                    </p>
                                    <p className='py-2'>You agree that your comments will not violate any right of any third-party, including copyright, trademark, privacy, personality or other personal or proprietary right. You further agree that your
                                    </p>
                                    <p>comments will not contain libelous or otherwise unlawful, abusive or obscene material, or contain any computer virus or other malware that could in any way affect the operation of the Service or any related website. You may not use a false e-mail address, pretend to be someone other than yourself, or otherwise mislead us or third-parties as to the origin of any comments. You are solely responsible for any comments you make and their accuracy. We take no responsibility and assume no liability for any comments posted by you or any third-party.

                                    </p>

                                    <h6 className='text-gray  py-3'> PERSONAL INFORMATION</h6>
                                    <p>Your submission of personal information through the store is governed by our Privacy Policy.
                                    </p>
                                </div>
                                <div>
                                    <h6 className='text-gray  py-3'>ERRORS, INACCURACIES AND OMISSIONS</h6>
                                    <p>Occasionally there may be information on our site or in the Service that contains typographical errors, inaccuracies or omissions that may relate to product descriptions, pricing, promotions, offers, product shipping charges, transit times and availability. We reserve the right to correct any errors, inaccuracies or omissions, and to change or update information or cancel orders if any information in the Service or on any related website is inaccurate at any time without prior notice (including after you have submitted your order).
                                    </p>
                                    <p>We undertake no obligation to update, amend or clarify information in the Service or on any related website, including without limitation, pricing information, except as required by law. No specified update or refresh date applied in the Service or on any related website, should be taken to indicate that all information in the Service or on any related website has been modified or updated</p>
                                    <h6 className='text-gray  py-3'>Data Use Related to Transactions:</h6>
                                    <p>We collect personal information, including payment details, when you make a purchase. This information is processed securely in accordance with our privacy practices.
                                    </p>
                                    <h6 className='text-gray  py-3'>PROHIBITED USES</h6>
                                    <p>In addition to other prohibitions as set forth in the Terms of Service, you are prohibited from using the site or its content: (a) for any unlawful purpose; (b) to solicit others to perform or participate in any unlawful acts; (c) to violate any international, federal, provincial or state regulations, rules, laws, or local ordinances; (d) to infringe upon or violate our intellectual property rights or the intellectual property rights of others; (e) to harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate based on gender, sexual orientation, religion, ethnicity, race, age, national origin, or disability; (f) to submit false or misleading information; (g) to upload or transmit viruses or any other type of malicious code that will or may be used in any way that will affect the functionality or operation of the Service or of any related website, other websites, or the Internet; (h) to collect or track the personal information of others; (i) to spam, phish, pharm, pretext, spider, crawl, or scrape; (j) for any obscene or immoral purpose; or (k) to interfere with or circumvent the security features of the Service or any related website, other websites, or the Internet. We reserve the right to terminate your use of the Service or any related website for violating any of the prohibited uses.

                                    </p>
                                    <h6 className='text-gray  py-3'> DISCLAIMER OF WARRANTIES; LIMITATION OF LIABILITY
                                    </h6>
                                    <p>We do not guarantee, represent or warrant that your use of our service will be uninterrupted, timely, secure or error-free. </p>
                                    <p className='py-2'>We do not warrant that the results that may be obtained from the use of the service will be accurate or reliable. </p>
                                    <p>You agree that from time to time we may remove the service for indefinite periods of time or cancel the service at any time, without notice to you.</p>
                                    <p className='py-2'>You expressly agree that your use of, or inability to use, the service is at your sole risk. The service and all products and services delivered to you through the service are (except as expressly stated by us) provided 'as is' and 'as available' for your use, without any representation, warranties or conditions of any kind, either express or implied, including all implied warranties or conditions of merchantability, merchantable quality, fitness for a particular purpose, durability, title, and non-infringement.
                                    </p>
                                    <p>In no case shall ees121, our directors, officers, employees, affiliates, agents, contractors, interns, suppliers, service providers or licensors be liable for any injury, loss, claim, or any direct, indirect, incidental, punitive, special, or consequential damages of any kind, including, without limitation lost profits, lost revenue, lost savings, loss of data, replacement costs, or any similar damages, whether based in contract, tort (including negligence), strict liability or otherwise, arising from your use of any of the service or any products procured using the service, or for any other claim related in any way to your use of the service or any product, including, but not limited to, any errors or omissions in any content, or any loss or damage of any kind incurred as a result of the use of the service or any content (or product) posted, </p>
                                    <p className='py-2'>transmitted, or otherwise made available via the service, even if advised of their possibility. Because some states or jurisdictions do not allow the exclusion or the limitation of liability for consequential or incidental damages, in such states or jurisdictions, our liability shall be limited to the maximum extent permitted by law.
                                    </p>
                                    <h6 className='text-gray  py-3'>INDEMNIFICATIO</h6>
                                    <p className='pb-2'>In the event that any provision of these Terms of Service is determined to be unlawful, void or unenforceable, such provision shall nonetheless be enforceable to the fullest extent permitted by applicable law, and the unenforceable portion shall be deemed to be severed from these Terms of Service, such determination shall not affect the validity and enforceability of any other remaining provisions.</p>
                                    <h6 className='text-gray py-2 '>TERMINATION</h6>
                                    <p className='pb-2'>The obligations and liabilities of the parties incurred prior to the termination date shall survive the termination of this agreement for all purposes.
                                    </p>
                                    <p className='py-2'>These Terms of Service are effective unless and until terminated by either you or us. You may terminate these Terms of Service at any time by notifying us that you no longer wish to use our Services, or when you cease using our site.
                                    </p>
                                    <p>If in our sole judgment you fail, or we suspect that you have failed, to comply with any term or provision of these Terms of Service, we also may terminate this agreement at any time without notice and you will remain liable for all amounts due up to and including the date of termination; and/or accordingly may deny you access to our Services (or any part thereof).</p>
                                    <h6 className='text-gray  py-3'>ENTIRE AGREEMENT</h6>
                                    <p className='pb-5'>The failure of us to exercise or enforce any right or provision of these Terms of Service shall not constitute a waiver of such right or provision.
                                    </p>
                                    <p>These Terms of Service and any policies or operating rules posted by us on this site or in respect to The Service constitutes the entire agreement and understanding between you and us and govern your use of the Service, superseding any prior or contemporaneous agreements, communications and proposals, whether oral or written, between you and us (including, but not limited to, any prior versions of the Terms of Service).
                                    </p>
                                    <p >Any ambiguities in the interpretation of these Terms of Service shall not be construed against the drafting party.</p>
                                    <h6 className='text-gray  py-3'>GOVERNING LAW</h6>
                                    <p className='pb-2'>These Terms of Service and any separate agreements whereby we provide you Services shall be governed by and construed in accordance with the laws of India and jurisdiction of Jaipur, Rajasthan</p>
                                    <h6 className='text-gray  py-3'>CHANGES TO TERMS OF SERVICE</h6>
                                    <p className='pb-2'>You can review the most current version of the Terms of Service at any time at this page.</p>
                                    <p>We reserve the right, at our sole discretion, to update, change or replace any part of these Terms of Service by posting updates and changes to our website. It is your responsibility to check our website periodically for changes. Your continued use of or access to our website or the Service following the posting of any changes to these Terms of Service constitutes acceptance of those changes.
                                    </p>
                                    <h6 className='text-gray  py-3'>REFUND AND CANCELATION POLICY</h6>
                                    <p className='pb-2'>Refunds will be provided only if the service was not delivered as promised due to an issue on our end.</p>
                                    <p>No refunds will be issued for completed services or if the service has been substantially delivered as per the agreed terms.</p>
                                    <p className='py-3'>Refund requests must be submitted within a day of the issue arising or the service being delivered, whichever comes first.</p>
                                    <h6 className='text-gray  py-3'>Non-Refundable Cases:</h6>
                                    <p className='pb-2'>Any service already in progress or completed as per the agreement will not be eligible for a refund.</p>
                                    <p>Cancellations initiated by the customer after work has begun will not be refunded.</p>
                                    <h6 className='text-gray  py-3'>To request a refund or cancel a service</h6>
                                    <p className='pb-2'>Provide your  details (e.g. service details) and the reason for the request.</p>
                                    <p>Our team will review your request and respond within a day</p>

                                    <h6 className='text-gray py-3'>Affordable Services</h6>
                                    <p className='pb-2'>Affordable business services at just ₹121, empowering growth with efficiency and reliability!</p>


                                    <h6 className='text-gray pt-4'>Contact Us</h6>
                                    <p className='pb-1'>If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us.</p>
                                    <p className='pb-4'>Join <b>Enjoy Enjoy Sarvices</b> today and experience the convenience of a trusted platform designed for everyone!</p>
                                    <div>
                                        <h6>Email :</h6>
                                        <p className=''> <a href="mailto:eesofficial@gmail.com">eesofficial@gmail.com</a></p>

                                    </div>
                                    <div className='py-2'>
                                        <h6>Address :</h6>
                                        <p className='py-2'><a href="">
                                            1002 Swapnadeep Complex Althan Rd near CNG Pump Uma Bhawan Society Althan Bhatar char Rasta, surat, gujrat. </a></p>

                                    </div>

                                </div>
                            </div> */}
                        </div>

                    </div>
                </section>
            </div>
            <Footer />
        </>
    );
};

export default PrivacyPolicy;
