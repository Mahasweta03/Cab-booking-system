import React, { useEffect, useState } from 'react';
import '../DriverCss/RideConfirmation.css';
import { useNavigate } from 'react-router-dom';
import { rideAPI } from '../../../services/api';

const DriverStartRide = () => {
  const [rideCodeInput, setRideCodeInput] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rideData, setRideData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get current ride data from localStorage
    const currentRideData = localStorage.getItem('currentRideData');
    if (currentRideData) {
      setRideData(JSON.parse(currentRideData));
    }
  }, []);

  const handleConfirm = async () => {
    if (!rideCodeInput.trim()) {
      setError('Please enter the OTP.');
      return;
    }

    const currentRideId = localStorage.getItem('currentRideId');
    if (!currentRideId) {
      setError('No active ride found.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      await rideAPI.verifyOTP(currentRideId, rideCodeInput);
      
      // Update ride data with InProgress status
      const currentRideData = localStorage.getItem('currentRideData');
      if (currentRideData) {
        const updatedRide = {
          ...JSON.parse(currentRideData),
          status: 'InProgress',
          startedAt: new Date().toISOString()
        };
        localStorage.setItem('currentRideData', JSON.stringify(updatedRide));
        localStorage.setItem('currentRide', JSON.stringify(updatedRide));
      }
      
      setIsConfirmed(true);
    } catch (error) {
      console.error('OTP verification failed:', error);
      setError('Invalid OTP. Please check with the passenger.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (isConfirmed) {
      const timer = setTimeout(() => {
        navigate('/driver/ride', { replace: true });
      }, 2000); 
     
      return () => clearTimeout(timer); 
    }
  }, [isConfirmed, navigate]);

  return (
    <div className="driver-start-container">
      <div className="driver-start-card">
        <h2>Start Ride</h2>
        {!isConfirmed ? (
          <>
            {rideData && (
              <div className="ride-info">
                <p><strong>Customer:</strong> {rideData.customerName}</p>
                <p><strong>Pickup:</strong> {rideData.pickupLocation}</p>
                <p><strong>Drop:</strong> {rideData.dropLocation}</p>
              </div>
            )}
            <p>Please enter the 4-digit OTP provided by the passenger:</p>
            <input
              type="text"
              value={rideCodeInput}
              onChange={(e) => setRideCodeInput(e.target.value)}
              placeholder="Enter 4-digit OTP"
              className="ride-code-input"
              maxLength="4"
            />
            <button 
              className="confirm-btn" 
              onClick={handleConfirm}
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Start Ride'}
            </button>
            {error && <p className="error">{error}</p>}
          </>
        ) : (
          <p className="success">Ride confirmed! You may now begin the trip...</p>
        )}
      </div>
    </div>
  );
};

export default DriverStartRide;
