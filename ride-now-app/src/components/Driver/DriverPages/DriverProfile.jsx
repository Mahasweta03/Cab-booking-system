import React, { useState, useEffect } from 'react';
import NewRide from './NewRide';
import api from '../../../services/api';
import '../DriverCss/DriverProfile.scss';
import profilePic from '../DriverAssets/image.png';
 
function DriverProfile() {
  const [driver, setDriver] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDriverProfile = async () => {
      try {
        const response = await api.get('/api/drivers/profile');
        console.log('Backend profile data:', response.data);
        
        // Merge backend data with localStorage data
        const mergedData = {
          driverId: response.data.driverId || localStorage.getItem('userId') || 'N/A',
          name: response.data.name || localStorage.getItem('name') || 'Driver',
          email: response.data.email || localStorage.getItem('email') || 'N/A',
          phone: response.data.phone || localStorage.getItem('phone') || 'N/A',
          gender: response.data.gender || localStorage.getItem('gender') || 'N/A',
          licenseNumber: response.data.licenseNumber || localStorage.getItem('licenseNumber') || null,
          licenseExpiryDate: response.data.licenseExpiryDate || localStorage.getItem('licenseExpiryDate') || null,
          bloodGroup: response.data.bloodGroup || localStorage.getItem('bloodGroup') || null,
          address: response.data.address || localStorage.getItem('address') || null,
          location: response.data.location || localStorage.getItem('location') || null,
          vehicleType: response.data.vehicleType || localStorage.getItem('vehicleType') || null,
          isActive: response.data.isActive || true,
          createdAt: response.data.createdAt || new Date().toISOString()
        };
        setDriver(mergedData);
      } catch (error) {
        console.error('Failed to fetch driver profile:', error);
        console.log('Using localStorage fallback data');
        
        // Fallback to localStorage - match DriverProfileDto structure
        const driverData = {
          driverId: localStorage.getItem('userId') || 'N/A',
          name: localStorage.getItem('name') || 'Driver',
          email: localStorage.getItem('email') || 'N/A',
          phone: localStorage.getItem('phone') || 'N/A',
          gender: localStorage.getItem('gender') || 'N/A',
          licenseNumber: localStorage.getItem('licenseNumber') || null,
          licenseExpiryDate: localStorage.getItem('licenseExpiryDate') || null,
          bloodGroup: localStorage.getItem('bloodGroup') || null,
          address: localStorage.getItem('address') || null,
          location: localStorage.getItem('location') || null,
          vehicleType: localStorage.getItem('vehicleType') || null,
          isActive: true,
          createdAt: new Date().toISOString()
        };
        setDriver(driverData);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDriverProfile();
  }, []);
 
  const handleChange = (e, field) => {
    setDriver({ ...driver, [field]: e.target.value });
  };
 
  const toggleEdit = async () => {
    if (isEditing) {
      try {
        // Send only fields that match UpdateDriverProfileDto
        await api.put('/api/drivers/profile', {
          name: driver.name,
          phone: driver.phone,
          gender: driver.gender,
          bloodGroup: driver.bloodGroup || null,
          address: driver.address || null
        });
        
        // Update localStorage on success
        localStorage.setItem('name', driver.name);
        localStorage.setItem('phone', driver.phone);
        localStorage.setItem('gender', driver.gender);
        localStorage.setItem('bloodGroup', driver.bloodGroup || '');
        localStorage.setItem('address', driver.address || '');
        localStorage.setItem('licenseNumber', driver.licenseNumber || '');
        localStorage.setItem('licenseExpiryDate', driver.licenseExpiryDate || '');
        localStorage.setItem('vehicleType', driver.vehicleType || '');
        
        alert('Profile updated successfully!');
      } catch (error) {
        console.error('Failed to update profile:', error);
        alert('Failed to update profile. Please try again.');
        return;
      }
    }
    setIsEditing(!isEditing);
  };
 
  if (loading) return <div className="loading">Loading driver profile...</div>;
  if (!driver) return <div className="error">No driver profile found.</div>;

  return (
    <>
      <NewRide />
      <div className="driver-profile-container">
        <div className="driver-profile-card">
          <div className="profile-header">
            <div className="profile-pic">
              <img src={profilePic} alt='Driver profile' />
            </div>
            <h1>Driver Profile</h1>
          </div>
          
          <div className="profile-content">
            <div className="profile-row">
              <div className="profile-field">
                <label>Name:</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={driver.name}
                    onChange={(e) => handleChange(e, 'name')}
                  />
                ) : (
                  <span>{driver.name}</span>
                )}
              </div>
              
              <div className="profile-field">
                <label>Driver ID:</label>
                <span>{driver.driverId || driver.DriverId}</span>
              </div>
            </div>
            
            <div className="profile-row">
              <div className="profile-field">
                <label>Gender:</label>
                {isEditing ? (
                  <select
                    value={driver.gender}
                    onChange={(e) => handleChange(e, 'gender')}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                ) : (
                  <span>{driver.gender}</span>
                )}
              </div>
              
              <div className="profile-field">
                <label>Blood Group:</label>
                {isEditing ? (
                  <select
                    value={driver.bloodGroup || ''}
                    onChange={(e) => handleChange(e, 'bloodGroup')}
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                ) : (
                  <span>{driver.bloodGroup || 'Not Available'}</span>
                )}
              </div>
            </div>
            
            <div className="profile-row">
              <div className="profile-field">
                <label>Email:</label>
                <span>{driver.email}</span>
              </div>
              
              <div className="profile-field">
                <label>Phone:</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={driver.phone}
                    onChange={(e) => handleChange(e, 'phone')}
                  />
                ) : (
                  <span>{driver.phone}</span>
                )}
              </div>
            </div>
            
            <div className="profile-row">
              <div className="profile-field">
                <label>License Number:</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={driver.licenseNumber || ''}
                    onChange={(e) => handleChange(e, 'licenseNumber')}
                  />
                ) : (
                  <span>{driver.licenseNumber || 'Not Available'}</span>
                )}
              </div>
              
              <div className="profile-field">
                <label>License Expiry:</label>
                {isEditing ? (
                  <input
                    type="date"
                    value={driver.licenseExpiryDate || ''}
                    onChange={(e) => handleChange(e, 'licenseExpiryDate')}
                  />
                ) : (
                  <span>{driver.licenseExpiryDate ? new Date(driver.licenseExpiryDate).toLocaleDateString() : 'Not Available'}</span>
                )}
              </div>
            </div>
            
            <div className="profile-row">
              <div className="profile-field">
                <label>Vehicle Type:</label>
                {isEditing ? (
                  <select
                    value={driver.vehicleType || ''}
                    onChange={(e) => handleChange(e, 'vehicleType')}
                  >
                    <option value="Auto">Auto</option>
                    <option value="Car">Car</option>
                    <option value="Bike">Bike</option>
                  </select>
                ) : (
                  <span>{driver.vehicleType || 'Not Available'}</span>
                )}
              </div>
            </div>
            
            <div className="profile-field full-width">
              <label>Address:</label>
              {isEditing ? (
                <textarea
                  value={driver.address || ''}
                  onChange={(e) => handleChange(e, 'address')}
                  rows="3"
                />
              ) : (
                <span>{driver.address || 'Not Available'}</span>
              )}
            </div>
          </div>
          
          <div className="profile-actions">
            <button onClick={toggleEdit} className="edit-btn">
              {isEditing ? 'Save Changes' : 'Edit Profile'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default DriverProfile;