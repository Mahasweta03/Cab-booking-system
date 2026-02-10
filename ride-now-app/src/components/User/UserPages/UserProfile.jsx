import React, { useState, useEffect } from 'react';
import '../UserScss/UserProfile.scss';
import profilePic from '../UserAssests/profile-pic.jpg'
import { userService } from '../../../services/userService';
 
function UserProfile() {
  const [user, setUser] = useState({
    name: '',
    phone: '',
    gender: '',
    email: '',
  });
 
  const [isEditing, setIsEditing] = useState(false);
 
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await userService.getProfile();
        setUser(response.data);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        
        // Handle 401 Unauthorized - redirect to login
        if (error.response?.status === 401) {
          localStorage.clear();
          window.location.href = '/user/login';
          return;
        }
        
        // Fallback to localStorage for other errors
        const name = localStorage.getItem('name') || 'User';
        const phone = localStorage.getItem('phone') || 'N/A';
        const email = localStorage.getItem('email') || 'N/A';
        const gender = localStorage.getItem('gender') || 'N/A';
        setUser({ name, phone, email, gender });
      }
    };
    
    fetchUserProfile();
  }, []);

  const handleChange = (e, field) => {
    setUser({ ...user, [field]: e.target.value });
  };
 
  const toggleEdit = async () => {
    if (isEditing) {
      try {
        await userService.updateProfile({
          name: user.name,
          phone: user.phone,
          email: user.email,
          gender: user.gender
        });
        // Update localStorage as backup
        localStorage.setItem('name', user.name);
        localStorage.setItem('phone', user.phone);
        localStorage.setItem('email', user.email);
        localStorage.setItem('gender', user.gender);
        alert('Profile updated successfully!');
      } catch (error) {
        console.error('Failed to update profile:', error);
        // Fallback to localStorage only
        localStorage.setItem('name', user.name);
        localStorage.setItem('phone', user.phone);
        localStorage.setItem('email', user.email);
        localStorage.setItem('gender', user.gender);
        alert('Profile updated locally!');
      }
    }
    setIsEditing(!isEditing);
  };
 
  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-pic">
            <img src={profilePic} alt='User profile' />
          </div>
          <h1>User Profile</h1>
        </div>
        
        <div className="profile-content">
          <div className="profile-field">
            <label>Name:</label>
            {isEditing ? (
              <input
                type="text"
                value={user.name}
                onChange={(e) => handleChange(e, "name")}
              />
            ) : (
              <span>{user.name}</span>
            )}
          </div>
          
          <div className="profile-field">
            <label>Gender:</label>
            {isEditing ? (
              <select
                value={user.gender}
                onChange={(e) => handleChange(e, "gender")}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            ) : (
              <span>{user.gender}</span>
            )}
          </div>
          
          <div className="profile-field">
            <label>Phone:</label>
            {isEditing ? (
              <input
                type="tel"
                value={user.phone}
                onChange={(e) => handleChange(e, "phone")}
              />
            ) : (
              <span>{user.phone}</span>
            )}
          </div>
          
          <div className="profile-field">
            <label>Email:</label>
            {isEditing ? (
              <input
                type="email"
                value={user.email}
                onChange={(e) => handleChange(e, "email")}
              />
            ) : (
              <span>{user.email}</span>
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
  );
}

export default UserProfile;