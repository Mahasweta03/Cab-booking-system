import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import MyMap from '../RideBookingPages/map.jsx'; // Use the dedicated map component
import { getCoords, getDistanceKm, formatPlaceName } from "../../User/UserPages/utils.js";
import { cabRates } from "../../Home/HomePages/Constants.jsx";
import { rideAPI } from '../../../services/api';
import "leaflet/dist/leaflet.css"; // It's better to import this in your main.jsx or App.jsx
import { FaMotorcycle, FaCar } from "react-icons/fa6"; // Removed FaScooter to resolve the import error.

// Cab type images
import bike from '../../User/UserAssests/bike.avif';
// import scooty from './Scooty.png';
import auto from '../../User/UserAssests/auto.png';
import cabXL from '../../User/UserAssests/cabXL.png';
import cabPremium from '../../User/UserAssests/cabPremium.png';

// Moved outside the component to prevent re-creation on every render
const cabTypes = [
  { name: 'Bike', image: bike, icon: <FaMotorcycle/> },
  { name: 'Auto', image: auto, icon: <FaCar/> },
  { name: 'Cab XL', image: cabXL, icon: <FaCar/> },
  { name: 'Cab Premium', image: cabPremium, icon: <FaCar/> }
];

function CabDetails({ bookingInfo, setBookingInfo }) {
  const navigate = useNavigate();
  const [sourceCoords, setSourceCoords] = useState(null);
  const [destCoords, setDestCoords] = useState(null);
  const [distanceKm, setDistanceKm] = useState(0);
  const [showWait, setShowWait] = useState(true);
  const [showFound, setShowFound] = useState(false);

  useEffect(() => {
    if (!bookingInfo || !bookingInfo.source || !bookingInfo.destination) {
      alert("Please enter a source and destination to continue.");
      navigate("/user", { replace: true });
    }
  }, [bookingInfo, navigate]);
 
  useEffect(() => {
    // Animate: show searching, then found, then map
    setShowWait(true);
    setTimeout(() => {
      setShowWait(false);
      setShowFound(true);
      setTimeout(() => setShowFound(false), 1500);
    }, 2000);
  }, []);
 
  useEffect(() => {
    const fetchCoords = async () => {
      if (bookingInfo && bookingInfo.source && bookingInfo.destination) {
        const src = await getCoords(bookingInfo.source);
        const dst = await getCoords(bookingInfo.destination);
        setSourceCoords(src);
        setDestCoords(dst);
        const km = getDistanceKm(src, dst);
        setDistanceKm(km);
        setBookingInfo(currentInfo => ({ ...currentInfo, sourceCoords: src, destCoords: dst, distanceKm: km }));
      }
    };
    fetchCoords();
  }, [bookingInfo, setBookingInfo]);
 
  if (!bookingInfo || !bookingInfo.source || !bookingInfo.destination) {
    return null;
  }

  const handleCabSelect = async (cab) => {
    try {
      const rate = cabRates[cab.name] || 15;
      const fare = Math.round(distanceKm * rate);
      
      // Create ride request in backend
      const rideRequestData = {
        pickupLocation: bookingInfo.source,
        dropLocation: bookingInfo.destination,
        pickupLatitude: sourceCoords?.lat || 0,
        pickupLongitude: sourceCoords?.lng || 0,
        dropLatitude: destCoords?.lat || 0,
        dropLongitude: destCoords?.lng || 0,
        vehicleType: cab.name
      };
      
      console.log('Creating ride request:', rideRequestData);
      const rideResponse = await rideAPI.requestRide(rideRequestData);
      
      // Create a compatible selectedCab object for downstream components
      const finalCabSelection = {
        ...cab,
        type: cab.name,
        driverName: "Driver Assigned", // Placeholder
        distToUser: Math.floor(Math.random() * 4) + 1, // Random distance 1-5km
      };

      const updatedBookingInfo = {
        ...bookingInfo,
        selectedCab: finalCabSelection,
        rideId: rideResponse.data.rideId,
        otp: rideResponse.data.otp,
        fare: rideResponse.data.fare,
        distance: rideResponse.data.distance
      };
      
      setBookingInfo(updatedBookingInfo);
      navigate("/user/fare", { state: { bookingInfo: updatedBookingInfo }, replace: true });
    } catch (error) {
      console.error('Failed to create ride request:', error);
      alert('Failed to create ride request. Please try again.');
    }
  };
 
  return (
    <div className="app-container">
      <div className="center-card">
        <h3>Select a Ride</h3>
        {/* Popups/animation */}
        {showWait && (
          <div className="popup slide-down">
            <div className="popup-content">
              <p>Please wait a few minutes while we find cabs near you...</p>
            </div>
          </div>
        )}
        {showFound && (
          <div className="popup slide-up">
            <div className="popup-content">
              <p>Ride options found!</p>
            </div>
          </div>
        )}
        {/* Map and Details */}
        {sourceCoords && destCoords && !showWait && !showFound && (
          <>
            <div
              style={{
                height: "300px",
                width: "100%",
                marginBottom: 16,
                borderRadius: "12px"
              }}
            >
              <MyMap pickupCoords={sourceCoords} dropCoords={destCoords} />
            </div>
            <div style={{ fontWeight: 600, marginBottom: 8, width: '90%', textAlign: 'left' }}>
              Distance: {distanceKm.toFixed(2)} km
            </div>
          </>
        )}
        {/* Cab List */}
        {!showWait && !showFound && (
          <div className="cab-list">
            {cabTypes.map((cab) => {
              const rate = cabRates[cab.name] || 15;
              const estimatedFare = Math.round(distanceKm * rate);
              return(
              <div
                key={cab.name}
                className="cab-item-detailed"
                onClick={() => handleCabSelect(cab)}
              >
                <div className="cab-info">
                  <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
                    <img src={cab.image} alt={cab.name} style={{ width: '50px', height: '50px', objectFit: 'contain' }} />
                    <div>
                      <span className="cab-driver">{cab.name}</span>
                      <span className="cab-model">₹{rate}/km</span>
                    </div>
                  </div>
                </div>
                <div className="cab-distance">
                  ~ ₹{estimatedFare}
                </div>
              </div>
            )})}
          </div>
        )}
        <button className="back-btn" onClick={() => navigate("/user", { replace: true })}>Back</button>
      </div>
    </div>
  );
}
 
export default CabDetails;