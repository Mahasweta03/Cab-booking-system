import React from 'react';
import { CgProfile } from 'react-icons/cg';
import { useNavigate } from 'react-router-dom';
import '../UserScss/Topbar.scss';
import logo from '../../Home/HomeAssets/logo3.png'
import { Link } from 'react-router-dom';

 
const Topbar = ({ toggleSidebar, showDropdown, toggleDropdown }) => {
  const navigate = useNavigate();
  

  return (
    <div className="topbar">
      <div className="menu-section" onClick={toggleSidebar}>
        <span className="menu-icon">☰</span>
         <Link to="/" className="navbar-brand d-flex align-items-center">
                  <img src={logo} alt="logo" height="45" className="me-2" />
                 
                </Link>
      </div>
 
      <div className="profile-section" onClick={toggleDropdown}>
        <CgProfile style={{ height: '30px', width: '82px' }} />
        {showDropdown && (
          <div className="dropdown-menu">
            <div className="dropdown-item" onClick={() => navigate('/user/profile')}>Profile</div>
            <div className="dropdown-item" onClick={() => {
              // Remove authentication tokens and user data
              localStorage.removeItem('token');
              localStorage.removeItem('isLoggedIn');
              localStorage.removeItem('email');
              localStorage.removeItem('name');
              localStorage.removeItem('userId');
              localStorage.removeItem('role');
              localStorage.removeItem('currentRide');
              navigate('/user/login', { replace: true });
            }}>Logout</div>
          </div>
        )}
      </div>
    </div>
  );
};
 
export default Topbar;
 
 