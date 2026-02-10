import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { locationAPI, rideAPI } from '../../../services/api';
import bike from '../../User/UserAssests/bike.avif';
import scooty from '../../User/UserAssests/Scooty.png';
import auto from '../../User/UserAssests/auto.png';
import cabXL from '../../User/UserAssests/cabXL.png';
import cabPremium from '../../User/UserAssests/cabPremium.png';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../UserScss/LocationForm.scss';

const cabs = [
  { name: 'Bike', image: bike },
  { name: 'Scooty', image: scooty },
  { name: 'Auto', image: auto },
  { name: 'Cab XL', image: cabXL },
  { name: 'Cab Premium', image: cabPremium },
];

const cabRates = {
  Bike: 5,
  Scooty: 6,
  Auto: 8,
  'Cab XL': 12,
  'Cab Premium': 15,
};

const LocationForm = () => {
  const navigate = useNavigate();
  const [pickup, setPickup] = useState('');
  const [drop, setDrop] = useState('');
  const [pickupCoords, setPickupCoords] = useState(null);
  const [dropCoords, setDropCoords] = useState(null);
  const [selectedCab, setSelectedCab] = useState(null);
  const [price, setPrice] = useState(null);
  const [distance, setDistance] = useState(null);
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [dropSuggestions, setDropSuggestions] = useState([]);
  const [pickupCoordsLocal, setPickupCoordsLocal] = useState(null);
  const [dropCoordsLocal, setDropCoordsLocal] = useState(null);
  const debounceTimeout = useRef(null);

  const fetchSuggestions = useCallback((query, setSuggestions) => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(async () => {
      if (query.length > 2) {
        try {
          const res = await axios.get(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&countrycodes=in`
          );
          const suggestions = res.data.map((loc) => ({
            name: loc.display_name,
            lat: parseFloat(loc.lat),
            lon: parseFloat(loc.lon),
          }));
          setSuggestions(suggestions);
        } catch (err) {
          console.error('Error fetching suggestions:', err);
        }
      }
    }, 400);
  }, []);

  const reverseGeocode = async (lat, lon) => {
    try {
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
      );
      return {
        name: res.data.display_name,
        lat: parseFloat(lat),
        lon: parseFloat(lon),
      };
    } catch (err) {
      console.error('Error in reverse geocoding:', err);
      return null;
    }
  };

  const handleSelect = (loc, setInput, updateCoords, setSuggestions, setLocalCoords) => {
    setInput(loc.name);
    const coords = [loc.lat, loc.lon];
    updateCoords(coords);
    setLocalCoords(coords);
    setSuggestions([]);
  };

  const calculateDistance = (coord1, coord2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(coord2[0] - coord1[0]);
    const dLon = toRad(coord2[1] - coord1[1]);
    const lat1 = toRad(coord1[0]);
    const lat2 = toRad(coord2[0]);

    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  useEffect(() => {
    if (pickupCoordsLocal && dropCoordsLocal) {
      const dist = calculateDistance(pickupCoordsLocal, dropCoordsLocal);
      setDistance(dist);
    }
  }, [pickupCoordsLocal, dropCoordsLocal]);

  useEffect(() => {
    const calculateFareFromAPI = async () => {
      if (pickupCoordsLocal && dropCoordsLocal && selectedCab) {
        try {
          const response = await locationAPI.calculateFare({
            pickupLatitude: pickupCoordsLocal[0],
            pickupLongitude: pickupCoordsLocal[1],
            dropLatitude: dropCoordsLocal[0],
            dropLongitude: dropCoordsLocal[1],
            vehicleType: selectedCab.name
          });
          setDistance(response.data.distance);
          setPrice(response.data.fare);
        } catch (error) {
          console.error('Fare calculation failed:', error);
          // Fallback to local calculation
          if (distance && selectedCab) {
            const rate = cabRates[selectedCab.name];
            setPrice((distance * rate).toFixed(2));
          }
        }
      }
    };
    
    calculateFareFromAPI();
  }, [pickupCoordsLocal, dropCoordsLocal, selectedCab, distance]);

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const location = await reverseGeocode(latitude, longitude);
          if (location) {
            setPickup(location.name);
            const coords = [location.lat, location.lon];
            setPickupCoords(coords);
            setPickupCoordsLocal([location.lat, location.lon]);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          alert('Unable to fetch location. Please allow location access.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const handleConfirm = async () => {
    if (pickup && drop && selectedCab && price && distance && pickupCoordsLocal && dropCoordsLocal) {
      try {
        // Check if user is authenticated
        const token = localStorage.getItem('token');
        const userName = localStorage.getItem('name');
        const userRole = localStorage.getItem('role');
        
        console.log('Auth check - Token:', token ? 'Present' : 'Missing');
        console.log('Auth check - User:', userName);
        console.log('Auth check - Role:', userRole);
        
        if (!token) {
          alert('Please login to book a ride.');
          navigate('/user/login');
          return;
        }
        
        if (userRole !== 'User') {
          alert('Please login as a user to book rides.');
          navigate('/user/login');
          return;
        }
        
        const rideData = {
          customerName: userName || 'User',
          pickupLocation: pickup,
          dropLocation: drop,
          pickupLatitude: parseFloat(pickupCoordsLocal[0]),
          pickupLongitude: parseFloat(pickupCoordsLocal[1]),
          dropLatitude: parseFloat(dropCoordsLocal[0]),
          dropLongitude: parseFloat(dropCoordsLocal[1]),
          vehicleType: selectedCab.name
        };

        console.log('Booking ride with data:', rideData);
        const response = await rideAPI.requestRide(rideData);
        console.log('Ride booking response:', response.data);
        
        const bookingInfo = {
          rideId: response.data.rideId,
          source: pickup,
          destination: drop,
          fare: response.data.fare || price,
          selectedCab: {
            type: selectedCab.name,
            driverName: response.data.driverName || 'Searching for driver...', 
            distToUser: 0,
          },
          distanceKm: response.data.distance || distance,
          otp: response.data.otp,
        };

        navigate('/user/fare', {
          state: { bookingInfo },
          replace: true
        });
      } catch (error) {
        console.error('Ride booking failed:', error);
        console.error('Error details:', error.response?.data);
        console.error('Error status:', error.response?.status);
        console.error('Full error:', error);
        
        if (error.response?.status === 401) {
          alert('Please login to book a ride.');
          navigate('/user/login');
        } else if (error.response?.status === 400) {
          alert('Invalid booking data: ' + (error.response.data || 'Bad request'));
        } else if (error.response?.data) {
          alert('Booking failed: ' + error.response.data);
        } else {
          alert('Failed to book ride. Please check your connection and try again.');
        }
      }
    } else {
      alert('Please fill in all the details before confirming.');
    }
  };

  const handleCancel = () => {
    setPickup('');
    setDrop('');
    setPickupCoords(null);
    setDropCoords(null);
    setSelectedCab(null);
    setPrice(null);
    setDistance(null);
    setPickupSuggestions([]);
    setDropSuggestions([]);
    setPickupCoordsLocal(null);
    setDropCoordsLocal(null);
    navigate("/user");
  };


  return (
    <>
      {/* Pickup Input */}
      <div className="location-input-group">
        <div className="location-input-wrapper">
          <i className="bi bi-geo-alt-fill icon pickup-icon"></i>
          <input
            type="text"
            value={pickup}
            onChange={(e) => {
              setPickup(e.target.value);
              fetchSuggestions(e.target.value, setPickupSuggestions);
            }}
            placeholder="Enter pickup location"
            className="location-input"
          />
          <i className="bi bi-crosshair current-location-icon" onClick={handleUseCurrentLocation} title="Use Current Location"></i>
        </div>
        {pickupSuggestions.length > 0 && (
          <ul className="suggestions-list">
            {pickupSuggestions.map((loc, i) => (
              <li
                key={i}
                onMouseDown={() => handleSelect(loc, setPickup, setPickupCoords, setPickupSuggestions, setPickupCoordsLocal)}
              >
                {loc.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Drop Input */}
      <div className="location-input-group">
        <div className="location-input-wrapper">
          <i className="bi bi-pin-map-fill icon drop-icon"></i>
          <input
            type="text"
            value={drop}
            onChange={(e) => {
              setDrop(e.target.value);
              fetchSuggestions(e.target.value, setDropSuggestions);
            }}
            placeholder="Enter drop location"
            className="location-input"
          />
        </div>
        {dropSuggestions.length > 0 && (
          <ul className="suggestions-list">
            {dropSuggestions.map((loc, i) => (
              <li
                key={i}
                onMouseDown={() => handleSelect(loc, setDrop, setDropCoords, setDropSuggestions, setDropCoordsLocal)}
              >
                {loc.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Cab Selection */}
      <div className="cab-type-selector">
        {cabs.map((cab, i) => (
          <div
            key={i}
            onClick={() => setSelectedCab(cab)}
            className={`cab-type-item ${selectedCab?.name === cab.name ? "active" : ""}`}
          >
            <img src={cab.image} alt={cab.name} />
            <p style={{ fontSize: '12px', margin: 0 }}>{cab.name}</p>
          </div>
        ))}
      </div>

      {/* Price Display */}
      {price && (
        <div className="price-display">
          Price for {selectedCab.name}: ₹{price} <br/>
          Distance : {distance.toFixed(2)} km 
        </div>
      )}
      {/* Buttons are now part of this component */}
      <button type="submit" className="confirm-button"
        onClick={handleConfirm} > Confirm </button>
      <button type="submit" className="cancel-button" onClick={handleCancel}> Cancel </button>
    </>
  );
};

export default LocationForm;