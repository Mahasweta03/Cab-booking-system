import React, { useState, useEffect } from 'react';
import DriverSidebar from './DriverSidebar';
import DriverNavbar from './DriverNavbar';
import { Outlet, useNavigate } from 'react-router-dom';

const DriverDashboardLayout = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const navigate = useNavigate();

  const toggleDropdown = () => setShowDropdown(!showDropdown);
  const toggleSidebar = () => setShowSidebar(!showSidebar);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const role = localStorage.getItem('role');
    if (!isLoggedIn || role !== 'Driver') {
      navigate('/driver/login', { replace: true });
    } else {
      // Prevent back navigation to previous pages after driver login
      window.history.pushState(null, null, window.location.pathname);
      const handlePopState = (event) => {
        event.preventDefault();
        window.history.pushState(null, null, window.location.pathname);
      };
      window.addEventListener('popstate', handlePopState);
      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [navigate]);

  return (
    <div className='driver-dashboard-container'>
      <DriverNavbar
        toggleSidebar={toggleSidebar}
        showDropdown={showDropdown}
        toggleDropdown={toggleDropdown}
        className="driver-dashboard-navbar"
      />
      <div className={`dashboard-container ${showSidebar ? 'sidebar-visible' : 'sidebar-collapsed'}`}>
        {showSidebar && <DriverSidebar />}
         <main className={`outlet-container ${showSidebar ? 'expanded' : 'collapsed'}`}>
          <Outlet />
         </main> 
      </div>
    </div>
  );
};

export default DriverDashboardLayout;
