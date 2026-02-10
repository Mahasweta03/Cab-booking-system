import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/Home/HomePages/Landingpage';
import AboutUs from './components/Home/HomePages/AboutUs';
import ContactPage from './components/Home/HomePages/ContactPage';
import BlogPage from './components/Home/HomePages/BlogPage';
import ForgotPassword from './components/User/UserPages/ForgotPassword.jsx';
import PaymentPage from './components/User/UserPages/PaymentPage';
import UserProfile from './components/User/UserPages/UserProfile';
import FareOtp from './components/User/UserPages/FareOtp';
import RideDetails from './components/User/UserPages/RideDetails';
import CabDetails from './components/RideBooking/RideBookingPages/CabDetails';
import RideHistory from './components/User/UserPages/RideHistory';
import Receipt from './components/User/UserPages/Receipt';
import DashboardWrapper from './components/User/UserPages/DashboardWrapper.jsx';
import UserLogin from './components/User/UserLogin/UserLogin.jsx';
import UserHome from './components/User/UserPages/UserHome.jsx';
import DriverDashboardLayout from './components/Driver/DriverPages/DriverDashboardLayout.jsx';
import DriverAuthPage from './components/Driver/Driverlogin/DriverAuthPage.jsx';
import NewRide from './components/Driver/DriverPages/NewRide.jsx';
import DriverRideConfirmation from './components/Driver/DriverPages/DriverRideConfirmation.jsx';
import DriverRide from './components/Driver/DriverPages/DriverRide.jsx';
import DriverReceipt from './components/Driver/DriverPages/DriverReceipt.jsx';
import DriverProfile from './components/Driver/DriverPages/DriverProfile.jsx';
import DriverRating from './components/Rating/RatingPages/DriverRating.jsx';
import DriverEarnings from './components/Driver/DriverPages/DriverEarnings.jsx';
import DriverRatings from './components/Driver/DriverPages/DriverRatings.jsx';
import DriverPayment from './components/Payment/PaymentPages/DriverPayment.jsx';
import DriverUPICode from './components/Driver/DriverPages/DriverUPICode.jsx';
import SignUpFlow from './components/Driver/Driverlogin/SignUpFlow.jsx';
// import SignUpFlow from './components/Driver/Driverlogin/SignUpFlow.jsx';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/aboutUs" element={<AboutUs />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* user side */}
          <Route path="/user/login" element={<UserLogin />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* user dashboard */}
          <Route path="/user" element={<DashboardWrapper />}>
            <Route index element={<UserHome />} />
            <Route path="myRides" element={<RideHistory />} />
            <Route path="cab-details" element={<CabDetails />} />
            <Route path="fare" element={<FareOtp />} />
            <Route path="ride-details" element={<RideDetails />} />
            <Route path="payment" element={<PaymentPage />} />
            <Route path="receipt" element={<Receipt />} />
            <Route path="profile" element={<UserProfile />} />
          </Route>

          {/* driver login */}
          <Route path="/driver/login" element={<DriverAuthPage />} />
          <Route path="/signup-flow" element={<SignUpFlow />} />
          <Route path="/driver" element={<DriverDashboardLayout />}>
            <Route path="ridePop" element={<NewRide />} />
            <Route path="rideOtp" element={<DriverRideConfirmation />} />
            <Route path="ride" element={<DriverRide />} />
            <Route path="receipt" element={<DriverReceipt />} />
            <Route path="profile" element={<DriverProfile />} />
            <Route index element={<DriverProfile />} />
            <Route path="rating" element={<DriverRating />} />
            <Route path="ratings" element={<DriverRatings />} />
            <Route path="earning" element={<DriverEarnings />} />
            <Route path="payment" element={<DriverPayment />} />
            <Route path="paymentUPI" element={<DriverUPICode />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
