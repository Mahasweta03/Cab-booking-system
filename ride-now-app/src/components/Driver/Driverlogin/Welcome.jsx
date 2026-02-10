import React, { useState, useEffect } from 'react';
import '../DriverCss/DriverAuthCss.scss';
import { useNavigate , Link} from 'react-router-dom';
import { authAPI } from '../../../services/api';
import api from '../../../services/api';
import logo from '../../Driver/DriverAssets/logo3.png';
const Welcome = ({ formData }) => {
  const [details, setDetails] = useState({
    gender: '',
    licenseNumber: '',
    licenseExpiryDate: '',
    bloodGroup: '',
    address: ''
  });
  const [licenseError, setLicenseError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await api.get('/api/drivers/profile');
        if (response.data) {
          setDetails({
            gender: response.data.gender || '',
            licenseNumber: response.data.licenseNumber || '',
            licenseExpiryDate: response.data.licenseExpiryDate || '',
            bloodGroup: response.data.bloodGroup || '',
            address: response.data.address || ''
          });
        }
      } catch (error) {
        console.log('No existing profile data found');
      }
    };
    
    fetchProfileData();
  }, []);
  const handleChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const validateLicenseNumber = (license) => {
    // Validates for a common Indian driving license format:
    // 2 uppercase letters for the state, followed by 13 digits.
    // Example: MH1234567890123
    const licenseRegex = /^[A-Z]{2}[0-9]{13}$/;
    return licenseRegex.test(license);
  };

  const handleSave = async () => {
    if (!validateLicenseNumber(details.licenseNumber)) {
      const errorMsg = 'Invalid format. Must be 2 uppercase letters and 13 digits (e.g., MH1234567890123).';
      setLicenseError(errorMsg);
      return;
    }
    
    if (!details.gender || !details.licenseExpiryDate) {
      alert('Please fill in all required fields.');
      return;
    }
    
    setLicenseError('');
    
    try {
      // Complete driver profile via backend API
      await authAPI.driverCompleteProfile({
        gender: details.gender,
        licenseNumber: details.licenseNumber,
        licenseExpiryDate: details.licenseExpiryDate,
        bloodGroup: details.bloodGroup || null,
        address: details.address || null
      });
      
      // Store profile details in localStorage before clearing login data
      localStorage.setItem('gender', details.gender);
      localStorage.setItem('licenseNumber', details.licenseNumber);
      localStorage.setItem('licenseExpiryDate', details.licenseExpiryDate);
      localStorage.setItem('bloodGroup', details.bloodGroup || '');
      localStorage.setItem('address', details.address || '');
      
      // Clear any stored login data
      localStorage.removeItem('token');
      localStorage.removeItem('isLoggedIn');
      
      alert('Registration completed successfully! Please login to continue.');
      navigate("/driver/login");
    } catch (error) {
      console.error('Failed to complete profile:', error);
      alert('Failed to save profile. Please try again.');
    }
  };

  return (
    <div className="welcome-container-wrapper">
      <div className="auth-topbar">
        <div className="app-name"> <Link to="/" className="navbar-brand d-flex align-items-center">
          <img src={logo} alt="logo" height="45" className="me-2" />
        </Link></div>
      </div>
      <div className="welcome-container">
        <div className="welcome-message">
          <h2>Welcome, {formData.name}!</h2>
          <p>
            Please provide a few more details to complete your profile.
          </p>
          <div className="additional-info">
              <label>
                Gender:
                <select name="gender" value={details.gender} onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </label>

              <label>
                License Number:
                <input
                  type="text"
                  name="licenseNumber"
                  value={details.licenseNumber}
                  onChange={handleChange}
                  required
                />
              </label>
              {licenseError && <p style={{ color: 'red', fontSize: '12px', marginTop: '0' }}>{licenseError}</p>}

              <label>
                License Expiry Date:
                <input
                  type="date"
                  name="licenseExpiryDate"
                  value={details.licenseExpiryDate || ''}
                  onChange={handleChange}
                  required
                />
              </label>
              
              <label>
                Blood Group (Optional):
                <select name="bloodGroup" value={details.bloodGroup} onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </label>
              
              {/* <label>
                Address (Optional):
                <textarea
                  name="address"
                  value={details.address}
                  onChange={handleChange}
                  placeholder="Enter your address"
                  rows="3"
                />
              </label> */}
              
              <button className="Profile" onClick={handleSave}>Complete Profile</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
