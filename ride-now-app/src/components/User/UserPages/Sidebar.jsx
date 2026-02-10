import React from 'react';
import { FaHome, FaCar } from 'react-icons/fa';
import { MdOutlineSupportAgent } from "react-icons/md";
import { VscFeedback } from "react-icons/vsc";
import { TbLogout } from "react-icons/tb";
import '../UserScss/Sidebar.scss';
import { useNavigate } from 'react-router-dom';
 
const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    localStorage.clear();
    navigate('/user/login', { replace: true });
  };
 
  return (
    <div className="sidebar">
      <h2 className="sidebar-title">User Dashboard</h2>
      <ul className="sidebar-menu">
        <li onClick={() => navigate('/user')}><FaHome /> Home</li>
        <li onClick={() => navigate('/user/myRides')}><FaCar /> My Rides</li>
        <li onClick={handleLogout}> <TbLogout /> Logout</li>
      </ul>
    </div>
  );
};
 
export default Sidebar;