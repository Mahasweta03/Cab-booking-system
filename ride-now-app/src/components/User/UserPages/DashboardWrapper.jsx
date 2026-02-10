import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Topbar from '../UserPages/Topbar.jsx';
import Sidebar from '../UserPages/Sidebar.jsx';
import '../UserScss/DashboardWrapper.scss';

const DashboardWrapper = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const navigate = useNavigate();
 
  const toggleDropdown = () => setShowDropdown(!showDropdown);
  const toggleSidebar = () => setShowSidebar(!showSidebar);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const role = localStorage.getItem('role');
    if (!isLoggedIn || role !== 'User') {
      navigate('/user/login', { replace: true });
    } else {
      // Prevent back navigation to previous pages
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
    <div className={!showSidebar ? "sidebar-hidden" : ""}>
      <Topbar
        toggleSidebar={toggleSidebar}
        showDropdown={showDropdown}
        toggleDropdown={toggleDropdown}
      />
      <div className="dashboard-container">
        <Sidebar toggleSidebar={toggleSidebar} />
          
        <div className="main-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
 
export default DashboardWrapper;
 