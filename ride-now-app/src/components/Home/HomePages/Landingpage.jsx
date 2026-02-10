import React from "react";
import background from '../HomeAssets/Background.jpg';
import RideBooking from '../../User/UserPages/ridebooking.jsx';
import '../HomeScss/landingpage.scss'
// import TopNavbar from "../../topnavbar.js";
// import Sidebar from "../HomeTopbar.js";
import cab2 from '../HomeAssets/cab2.png';
import Booking from '../HomeAssets/L1.jpg';
import Booking2 from '../HomeAssets/L4.png';
import Booking3 from '../HomeAssets/L5.jpg';
import Driving from '../HomeAssets/L2.jpg';
import safety from '../HomeAssets/L3.2.jpg';
import QR1 from '../HomeAssets/qr1.png';
import QR2 from '../HomeAssets/qr2.png';
import cabXL from '../../User/UserAssests/cabXL.png';
import cabPremium from'../../User/UserAssests/cabPremium.png';
import bike from '../../User/UserAssests/bike.avif';
import Scooty from '../../User/UserAssests/Scooty.png';
import Auto from '../../User/UserAssests/auto.png';
// import HomeTopbar from "./HomeTopbar.js";
import Footer from './Footer.jsx';
import HomeTopbar from "./HomeTopbar.jsx";


function LandingPage() {
    return(
        <>
        <div className="landing-container">
            <HomeTopbar/>
          
            <RideBooking/> 
            <div className="background"> 
                <img src={background} alt="background"/>
                <h1 className="bg-head">RideNow.</h1>
                <p className="bg-text">Your Ride, On Time—Every Time.</p>
                <img src={cab2} alt="cab"/> 
            </div>
            <div className="service-container">
                <h1>Our Services</h1>
                <div className="sc-img-con">
                    <img src={cabXL} alt="cabXL" className="service-image" />
                    <img src={cabPremium} alt="cabPremium" className="service-image" />
                    <img src={bike} alt="bike" className="service-image" />
                    <img src={Scooty} alt="scooty" className="service-image" />
                    <img src={Auto} alt="Auto" className="service-image" />
                </div>
            </div>

            <div className="about-container">
                <h1>Fast, affordable rides.</h1>
                <p>Get where you're going, <br/> quickly and affordably.</p>
                <div className="ac-img-con">
                    <img src={Booking2} alt="Bookings" className="img2"/>
                    <img src={Booking} alt="Bookings" className="img1"/>  
                    <img src={Booking3} alt="Bookings"className="img3"/>
                </div>    
            </div>
            <div className="feature-container-1">
                <div className="right-fc1">
                    <img src={Driving} alt="Drives"/>
                </div>
                <div className="left-fc1">     
                    <h1>Earn more, on your own schedule.</h1>
                    <p>Join the RideNow team and earn on your terms. Drive whenever you want.</p>
                </div>    
            </div>
            <div className="feature-container-2">
                <div className="left-fc2">
                    <h1>Your safety is our priority.</h1>
                    <p>At RideNow, your safety is our priority. We’re dedicated to making every ride safe and comfortable.</p>
                </div>
                <div className="right-fc2">
                    <img src={safety} alt="safety"/>
                </div> 
            </div>
            <div className="download-container">
                <h2>Download Now! </h2>

                <div className="dc-container">
                    <div className="left-dc1">
                        <img src={QR1} alt="Download"/>
                        <h3>Download the RideNow App<br/>
                        <span>Scan to download</span></h3>
                    </div>
                    <div className="right-dc2"> 
                        <img src={QR2} alt="Download"/>
                        <h3>Download the RideNow Driver App<br/>
                        <span>Scan to download</span></h3>
                    </div>
                </div> 
                <h2>It's easier in the apps</h2>   
            </div>
            <Footer/>
        </div>
        </>
    );
}

export default LandingPage;