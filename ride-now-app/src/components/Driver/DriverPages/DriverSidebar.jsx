import React from 'react';
import { FaHome, FaCar } from 'react-icons/fa';
import { TbLogout } from "react-icons/tb";
import { MdOutlineQrCodeScanner } from "react-icons/md";
import { GiMoneyStack } from "react-icons/gi";
import { useNavigate } from 'react-router-dom';
import '../DriverCss/DriverSidebar.scss';
 
const DriverSidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <h2 className="sidebar-title"> Welcome <span className='driver-name'> </span></h2>
      <ul className="sidebar-menu">
        <li onClick={() => navigate('/driver/profile')}><FaHome /> Profile</li>
        {/* <li onClick={() => navigate('/upi')}><MdOutlineQrCodeScanner /> UPI Code</li> */}
        <li onClick={() => navigate('/driver/earning')}><GiMoneyStack /> Rides</li>
        <li onClick={() => {
          localStorage.clear();
          navigate('/driver/login', { replace: true });
        }}><TbLogout /> Logout</li>
      </ul>
    </div>
  );
};
 
export default DriverSidebar;