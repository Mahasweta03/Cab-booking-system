import React from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { FaKey } from "react-icons/fa";
import '../../Driver/DriverCss/DriverRide.css';

const RideDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingInfo = location.state?.bookingInfo;

  if (!bookingInfo) {
    return <Navigate to="/user" replace />;
  }

  const { source, destination, fare, selectedCab, distanceKm, otp } = bookingInfo;

  const handleProceedToPayment = () => {
    navigate("/user/payment", { state: { bookingInfo }, replace: true });
  };

  return (
    <div className="driver-ride">
      <h2>Your Ride Details</h2>
      <div className="ride-details-container">
        <div className="ride-info">
          <p className='label'>Driver: <span className='value'>{selectedCab.driverName || 'Assigned'}</span></p>
          <p className='label'>Vehicle: <span className='value'>{selectedCab.type}</span></p>
          <p className='label'>Pickup: <span className='value'>{source}</span></p>
          <p className='label'>Drop: <span className='value'>{destination}</span></p>
          <p className='label'>Distance: <span className='value'>{distanceKm ? distanceKm.toFixed(2) : 'N/A'} km</span></p>
          <p className='label'>Fare: <span className='value'>₹{fare}</span></p>
          <p className='label'>Your OTP: <span className='value'>{otp}</span></p>
          
          <div className="buttons">
            <button className="end-trip" onClick={handleProceedToPayment}>
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RideDetails;