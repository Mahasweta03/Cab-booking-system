import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../HomeScss/HomeTopbar.scss';
import logo from '../HomeAssets/logo3.png'

const HomeTopbar = () => {
  const navigate = useNavigate();
 
  const handleUserButtonClick = () => navigate('/user/login');
  const handleDriverButtonClick = () => navigate('/driver/login');
 
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top shadow-sm">
      <div className="container-fluid">
        {/* Logo and Brand */}
        <Link to="/" className="navbar-brand d-flex align-items-center">
          <img src={logo} alt="logo" height="30" className="me-2" />
         
        </Link>
 
        
        {/* Collapsible Content */}
        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link to="/" className="nav-link">
                <i className="bi bi-house me-2"></i>Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/aboutUs" className="nav-link">
                <i className="bi bi-person me-2"></i>About
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/blog" className="nav-link">
                <i className="bi bi-journal-text me-2"></i>Blog
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/contact" className="nav-link">
                <i className="bi bi-envelope me-2"></i>Contact
              </Link>
            </li>
          </ul>
 
          {/* Action Buttons */}
          <div className="d-flex ms-lg-3 mt-3 mt-lg-0" >
            <button className="btn btn-outline-secondary me-2" onClick={handleUserButtonClick}>
              User
            </button>
            <button className="btn btn-outline-success" onClick={handleDriverButtonClick} style={{top:"-4"}}>
            Driver
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
 
export default HomeTopbar;
 
 