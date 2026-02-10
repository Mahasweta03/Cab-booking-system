import React, { useEffect } from 'react';
import '../DriverCss/DriverAuthCss.scss';
import { authAPI } from '../../../services/api';
import api from '../../../services/api';
import location from '../DriverAssets/location.jpg';
import {useNaviagte, Link } from 'react-router-dom';
import logo from '../../Home/HomeAssets/logo3.png';
const Vehicle = ({ formData, setFormData, onNext }) => {
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await api.get('/api/drivers/profile');
        if (response.data) {
          setFormData(prev => ({
            ...prev,
            vehicle: response.data.vehicleType || '',
            location: response.data.location || ''
          }));
        }
      } catch (error) {
        console.log('No existing profile data found');
      }
    };
    
    fetchProfileData();
  }, [setFormData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.location && formData.vehicle) {
      try {
        // Save vehicle preferences to backend
        await authAPI.driverSetPreferences({
          location: formData.location,
          vehicleType: formData.vehicle
        });
        
        // Store preferences in localStorage
        localStorage.setItem('location', formData.location);
        localStorage.setItem('vehicleType', formData.vehicle);
        
        onNext();
      } catch (error) {
        console.error('Failed to save preferences:', error);
        alert('Failed to save preferences. Please try again.');
      }
    } else {
      alert('Please select a vehicle type and location.');
    }
  };

  return (
    <div className="auth-topbar">
     <div className="app-name"> <Link to="/" className="navbar-brand d-flex align-items-center">
          <img src={logo} alt="logo" height="45" className="me-2" />
        </Link></div>
      <div className="vehicle-container">
        <form className="vehicle-form" onSubmit={handleSubmit}>
          <h2>Choose Your Preferences</h2>

          <select name="vehicle" value={formData.vehicle} onChange={handleChange} required>
            <option value="">--Choose Vehicle--</option>
            <option value="Bike">Bike</option>
            <option value="Scooty">Scooty</option>
            <option value="Auto">Auto</option>
            <option value="Cab XL">Cab XL</option>
            <option value="Cab Premium">Cab Premium</option>
          </select>

          <select name="location" value={formData.location} onChange={handleChange} required>
            <option value="">--Choose Location--</option>
            <option value="Hyderabad">Hyderabad</option>
            <option value="Chennai">Chennai</option>
            <option value="Bangalore">Bangalore</option>
          </select>

          <button type="submit">Next</button>
        </form>

          <img src={location} alt="location" className='vehi-image'/>

      </div>
    </div>
  );
};

export default Vehicle;

// import React from 'react';
// import '../../scss/DriverAuthCss.scss';
// import location from '../../assets/location.jpg';

// const Vehicle = ({ formData, setFormData, onNext }) => {
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (formData.location && formData.vehicle) {
//       onNext();
//     } else {
//       alert('Please select a vehicle type and location.');
//     }
//   };

//   return (
//     <div className="auth-container">
//       <div className="auth-topbar">
//         <div className="app-name">RideNow.</div>
//       </div>
//       <div className="vehicle-container">
//         <form className="vehicle-form" onSubmit={handleSubmit}>
//           <h2>Choose Your Preferences</h2>

//           <select name="vehicle" value={formData.vehicle} onChange={handleChange} required>
//             <option value="">--Choose Vehicle--</option>
//             <option value="SUV">SUV</option>
//             <option value="Sedan">Sedan</option>
//             <option value="Hatchback">Hatchback</option>
//           </select>

//           <select name="location" value={formData.location} onChange={handleChange} required>
//             <option value="">--Choose Location--</option>
//             <option value="Hyderabad">Hyderabad</option>
//             <option value="Chennai">Chennai</option>
//             <option value="Bangalore">Bangalore</option>
//           </select>
//           <button type="submit">Next</button>
//         </form>
//         <img src={location} alt="Car location illustration" className='vehi-image'/>
//       </div>
//     </div>
//   );
// };

// export default Vehicle;
