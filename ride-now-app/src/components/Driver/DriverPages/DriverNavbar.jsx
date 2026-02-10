
import React, { useState, useEffect } from 'react';
import { FaHome, FaCar, FaBars } from 'react-icons/fa';
import { CgProfile } from 'react-icons/cg';
import { MdOutlineQrCodeScanner } from "react-icons/md";
import { GiMoneyStack } from "react-icons/gi";
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../../services/api';

import logo from '../../Home/HomeAssets/logo3.png';

import { Link } from 'react-router-dom';
import '../DriverCss/DriverNavbar.scss';

const DriverNavbar = ({ toggleSidebar, showDropdown, toggleDropdown }) => {
  const navigate = useNavigate();
 
  const [availability, setAvailability] = useState('Available');

  useEffect(() => {
    updateDriverStatus();
    const interval = setInterval(updateDriverStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const updateDriverStatus = async () => {
    try {
      const currentRide = localStorage.getItem('currentRide');
      const newStatus = currentRide ? 'Riding' : 'Available';
      
      if (newStatus !== availability) {
        console.log('Updating driver status from', availability, 'to', newStatus);
        setAvailability(newStatus);
        
        const driverId = localStorage.getItem('userId');
        if (driverId) {
          console.log('Making API call to update status:', driverId, newStatus);
          const response = await authAPI.updateDriverStatus(driverId, newStatus);
          console.log('Driver status API response:', response);
          console.log('Driver status successfully updated to:', newStatus);
        }
      }
    } catch (error) {
      console.error('Failed to update driver status:', error);
      console.error('Error details:', error.response?.data);
      console.error('Error status:', error.response?.status);
    }
  };
  return (
    <div className="topbar">
      <div className="menu-section" onClick={toggleSidebar}>
        <span className="menu-icon">☰</span>
      </div>
         <Link to="/" className="navbar-brand d-flex align-items-center">
                          <img src={logo} alt="logo" height="45" className="me-2" />
        </Link>
        
      <div className="status-display">
        <label style={{ fontSize: "15px", marginBottom: "5%" }}>STATUS</label>
        <div className={`status-badge ${availability.toLowerCase()}`}>
          {availability}
        </div>
      </div>

      <div className="profile-section" onClick={toggleDropdown}>
        <CgProfile style={{ height: '30px', width: '82px', marginRight: "20%" }} />
        {showDropdown && (
          <div className="dropdown-menu">
            <div className="dropdown-item" onClick={() => { navigate("/driver/profile") }}>Profile</div>
            <div className="dropdown-item" onClick={() => {
              // Remove authentication tokens and user data
              localStorage.removeItem('token');
              localStorage.removeItem('isLoggedIn');
              localStorage.removeItem('email');
              localStorage.removeItem('name');
              localStorage.removeItem('userId');
              localStorage.removeItem('role');
              localStorage.removeItem('driverId');
              localStorage.removeItem('completedRideData');
              localStorage.removeItem('currentRide');
              navigate("/driver/login", { replace: true });
            }}>Logout</div>
          </div>
        )}
      </div>
    </div>
  );
};


export default DriverNavbar;