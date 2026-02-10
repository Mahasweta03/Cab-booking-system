import React, { useEffect, useState } from 'react';
import Popup from 'reactjs-popup';
import { useNavigate } from 'react-router-dom';
import { rideAPI, authAPI } from '../../../services/api';
import '../DriverCss/NewRide.css';

const NewRide = () => {
  const [open, setOpen] = useState(false);
  const [availableRides, setAvailableRides] = useState([]);
  const [currentRide, setCurrentRide] = useState(null);
  const [loading, setLoading] = useState(false);
  const [shownRides, setShownRides] = useState(() => {
    const saved = localStorage.getItem('shownRides');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const navigate = useNavigate();

  const driverVehicleType = localStorage.getItem('vehicleType') || 'Auto';
  const driverLocation = localStorage.getItem('location') || 'Chennai';
  
  // Temporarily disabled driver status updates due to 405 errors
  // useEffect(() => {
  //   const setDriverAvailable = async () => {
  //     try {
  //       await authAPI.updateDriverStatus(localStorage.getItem('userId'), 'Available');
  //       console.log('Driver status set to Available');
  //     } catch (error) {
  //       console.log('Failed to set driver status:', error);
  //     }
  //   };
  //   setDriverAvailable();
  // }, []);

  const fetchAvailableRides = async () => {
    try {
      setLoading(true);
      console.log('Fetching available rides for:', { driverLocation, driverVehicleType });
      const response = await rideAPI.getAvailableRides(driverLocation, driverVehicleType);
      const rides = response.data;
      console.log('Available rides response:', rides);
      
      setAvailableRides(rides || []);
      
      // Show popup for new rides
      if (rides && rides.length > 0 && !open) {
        const newRide = rides.find(ride => !shownRides.has(ride.rideId));
        if (newRide) {
          const updatedShownRides = new Set([...shownRides, newRide.rideId]);
          setShownRides(updatedShownRides);
          localStorage.setItem('shownRides', JSON.stringify([...updatedShownRides]));
          setCurrentRide(newRide);
          setOpen(true);
        }
      }
    } catch (error) {
      console.error('Failed to fetch available rides:', error);
      console.error('Error details:', error.response?.data);
      setAvailableRides([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailableRides();
  }, []);

  const handleAccept = async () => {
    if (!currentRide) return;
    
    try {
      console.log('✅ ACCEPTING RIDE:', currentRide.rideId);
      
      localStorage.removeItem('currentRideId');
      localStorage.removeItem('currentRideData');
      localStorage.removeItem('currentRide');
      localStorage.removeItem('completedRideData');
      
      await rideAPI.acceptRide(currentRide.rideId);
      
      const driverName = localStorage.getItem('name') || 'Driver';
      const rideWithDriver = {
        ...currentRide,
        driverName: driverName,
        acceptedAt: new Date().toISOString(),
        status: 'Accepted'
      };
      
      localStorage.setItem('currentRideId', currentRide.rideId);
      localStorage.setItem('currentRideData', JSON.stringify(rideWithDriver));
      localStorage.setItem('currentRide', JSON.stringify(rideWithDriver));
      
      navigate('/driver/rideOtp');
      setOpen(false);
      setCurrentRide(null);
    } catch (error) {
      console.error('Failed to accept ride:', error);
      alert('Failed to accept ride. Please try again.');
    }
  };

  const handleDismiss = () => {
    setOpen(false);
    setCurrentRide(null);
  };
  


  return (
    <>
      {currentRide && (
        <Popup open={open} modal className="driver-alert">
          <div className="driver-alert-content">
            <h3>New Ride Request</h3>
            <p><strong>Customer:</strong> {currentRide.customerName}</p>
            <p><strong>Pickup:</strong> {currentRide.pickupLocation}</p>
            <p><strong>Drop:</strong> {currentRide.dropLocation}</p>
            <p><strong>Distance:</strong> {currentRide.distance} km</p>
            <p><strong>Fare:</strong> ₹{currentRide.fare}</p>
            <p><strong>Requested:</strong> {new Date(currentRide.requestedAt).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
            
            <div className="button-group">
              <button className="accept-btn" onClick={handleAccept}>Accept</button>
              <button className="close-btn" onClick={handleDismiss}>Dismiss</button>
            </div>
          </div>
        </Popup>
      )}
      

    </>
  );
};

export default NewRide;
