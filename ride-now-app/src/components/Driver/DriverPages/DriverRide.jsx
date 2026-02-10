import React, { useState, useEffect } from 'react';
import '../DriverCss/DriverRide.css';
import { useNavigate } from 'react-router-dom';
import { rideAPI, earningsAPI } from '../../../services/api';

const DriverRide = () => {
  const [rideData, setRideData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRideData();
    const interval = setInterval(fetchRideData, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchRideData = async () => {
    try {
      const response = await rideAPI.getCurrentDriverRide();
      console.log('=== DriverRide API Response ===');
      console.log('Full response:', response);
      console.log('Response data:', response.data);
      console.log('Response status:', response.data?.status);
      console.log('Status type:', typeof response.data?.status);
      
      if (response.data) {
        console.log('✅ SHOWING ALL RIDES FOR DEBUG:', response.data);
        setRideData(response.data);
      } else {
        console.log('❌ No ride data received');
        setRideData(null);
      }
    } catch (error) {
      console.error('❌ Failed to fetch ride:', error);
      setRideData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteRide = async () => {
    if (!rideData) return;
    
    try {
      await rideAPI.completeRide(rideData.rideId);
      
      // Save ride to driver earnings
      const driverId = localStorage.getItem('userId') || localStorage.getItem('driverId');
      if (driverId) {
        // Get the actual payment method selected by user
        const selectedPaymentMethod = localStorage.getItem('selectedPaymentMethod') || 'Cash';
        const earningData = {
          driverId: driverId,
          rideId: rideData.rideId,
          fare: rideData.fare,
          pickupLocation: rideData.pickupLocation,
          dropLocation: rideData.dropLocation,
          customerName: rideData.user?.name || rideData.customerName,
          distance: rideData.distance,
          vehicleType: rideData.vehicleType,
          paymentMethod: selectedPaymentMethod,
          status: 'Completed',
          date: new Date().toISOString()
        };
        
        try {
          await earningsAPI.addDriverEarning(earningData);
          console.log('Ride saved to earnings successfully');
        } catch (earningError) {
          console.error('Failed to save ride to earnings:', earningError);
        }
      }
      
      const completedRide = {
        rideId: rideData.rideId,
        fare: rideData.fare,
        pickupLocation: rideData.pickupLocation,
        dropLocation: rideData.dropLocation,
        customerName: rideData.user?.name || rideData.customerName,
        distance: rideData.distance,
        vehicleType: rideData.vehicleType
      };
      
      localStorage.setItem('completedRideData', JSON.stringify(completedRide));
      
      // Prevent back navigation after ride completion
      window.history.pushState(null, null, '/driver/payment');
      navigate('/driver/payment', { replace: true });
      
      // Clear current ride to update status back to Available
      setTimeout(() => {
        localStorage.removeItem('currentRide');
      }, 1000);
    } catch (error) {
      console.error('Failed to complete ride:', error);
      alert('Failed to complete ride');
    }
  };

  if (loading) {
    return <div className="driver-ride"><div>Loading...</div></div>;
  }

  if (!rideData) {
    return (
      <div className="driver-ride">
        <div className="no-ride">
          <h3>No Active Ride</h3>
          <p>Accept a new ride to start driving</p>
        </div>
      </div>
    );
  }

  return (
    <div className="driver-ride">
      <h2>Current Ride</h2>
      <div className="ride-details-container">
        <div className="ride-info">
          <p className='label'>Customer: <span className='value'>{rideData.user?.name || rideData.customerName}</span></p>
          <p className='label'>Pickup: <span className='value'>{rideData.pickupLocation}</span></p>
          <p className='label'>Drop: <span className='value'>{rideData.dropLocation}</span></p>
          <p className='label'>Distance: <span className='value'>{rideData.distance} km</span></p>
          <p className='label'>Fare: <span className='value'>₹{rideData.fare}</span></p>
          <p className='label'>Status: <span className='value'>{rideData.status || rideData.Status}</span></p>
          
          <div className="buttons">
            <button className="end-trip" onClick={handleCompleteRide}>
              END RIDE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverRide;