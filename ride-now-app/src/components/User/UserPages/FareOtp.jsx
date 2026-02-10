import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { FaCar, FaRupeeSign, FaRoad, FaKey, FaClock } from "react-icons/fa";
import { rideAPI } from '../../../services/api';
import  '../UserScss/FareOtp.scss';
 
const FareOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentBookingInfo, setCurrentBookingInfo] = useState(location.state?.bookingInfo || null);

  // Initialize booking info
  useEffect(() => {
    if (location.state?.bookingInfo) {
      setCurrentBookingInfo(location.state.bookingInfo);
    }
  }, [location.state?.bookingInfo]);

  // Check for ride updates every 3 seconds (as per document)
  useEffect(() => {
    const checkRideUpdates = async () => {
      if (!currentBookingInfo?.rideId) return;
      
      const token = localStorage.getItem('token');
      const userRole = localStorage.getItem('role');
      
      if (!token || userRole !== 'User') {
        console.log('Invalid token or wrong role for user ride updates');
        return;
      }
      
      try {
        const response = await rideAPI.getCurrentUserRide();
        if (response.data) {
          console.log('Ride status update:', response.data.status);
          
          // Update booking info when driver is assigned
          if (response.data.status === 'Accepted' && response.data.driverName) {
            setCurrentBookingInfo(prev => ({
              ...prev,
              selectedCab: {
                ...prev.selectedCab,
                driverName: response.data.driverName,
                status: 'Accepted'
              },
              driverAssigned: true
            }));
          }
        }
      } catch (error) {
        if (error.response?.status === 403) {
          localStorage.clear();
          navigate('/user/login');
        }
      }
    };

    checkRideUpdates();
    const interval = setInterval(checkRideUpdates, 3000); // 3 seconds as per document
    return () => clearInterval(interval);
  }, [currentBookingInfo?.rideId, navigate]);

  // This check is crucial. If a user refreshes the page or navigates
  // directly, location.state will be null. This redirects them back.
  if (!location.state?.bookingInfo || !currentBookingInfo) {
    return <Navigate to="/user" replace />;
  }

  const { source, destination, fare, selectedCab, distanceKm, otp } = currentBookingInfo;

  // This check is for robustness in case the bookingInfo object is incomplete
  if (!selectedCab || !source || !destination) {
    return <Navigate to="/user" replace />;
  }

  // Assume average speed of 30 km/h to calculate arrival time
  const arrivalTimeMinutes = Math.ceil((selectedCab.distToUser / 30) * 60); 
 
  return (
    <div className="fare-otp-container">
      <div className="fare-otp-card">
        <h3>Your Ride is Confirmed!</h3>
        <div className="fare-details">
          
          {/* <div className="fare-item">
            <FaCar className="fare-icon" />
            <span>{selectedCab.type}</span>
            <b>{currentBookingInfo.driverAssigned ? selectedCab.driverName : 'Finding driver...'}</b>
          </div> */}
          {/* {!currentBookingInfo.driverAssigned && (
            <div className="waiting-message" style={{ color: '#ff6b35', fontSize: '14px', textAlign: 'center', margin: '10px 0' }}>
              🔍 Searching for available drivers...
            </div>
          )} */}
          <div className="fare-item">
            <FaRoad className="fare-icon" />
            <span>Distance</span>
            <b>{distanceKm ? distanceKm.toFixed(2) : 'N/A'} km</b>
          </div>
          <div className="fare-item">
            <FaRupeeSign className="fare-icon" />
            <span>Fare</span>
            <b>₹{fare}</b>
          </div>
          <div className="fare-item otp-item">
            <FaKey className="fare-icon" />
            <span>Your OTP is</span>
            <b>{otp}</b>
          </div>
        </div>
        <button className="button-proceed" onClick={() => {
          navigate("/user/ride-details", { state: { bookingInfo: currentBookingInfo }, replace: true });
        }}>
          Proceed to Ride Details
        </button>
        <button className="button-back" onClick={() => navigate('/user/cab-details', { state: { bookingInfo: currentBookingInfo }, replace: true })}>
          Back
        </button>
      </div>
    </div>
  );
};
 
export default FareOtp; 
