import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../UserScss/UserLogin.scss';
import { authAPI } from '../../../services/api';
import taxi from '../UserAssests/Taxi.jpg';
import logo from '../../Home/HomeAssets/logo3.png'

const validatePassword = (password) => {
  const hasMinLength = password.length >= 6;
  return hasMinLength;
};

const UserLogin = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if already logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const role = localStorage.getItem('role');
    if (isLoggedIn && role === 'User') {
      navigate('/user', { replace: true });
      return;
    }
    
    const rememberedEmail = localStorage.getItem('email');
    if (rememberedEmail) {
      setFormData(prevData => ({ ...prevData, email: rememberedEmail }));
    }
  }, [navigate]);

  const toggleForm = () => setIsLogin(!isLogin);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^\d{10}$/.test(phone);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isLogin) {
        // --- LOGIN LOGIC ---
        const response = await authAPI.userLogin(formData.email, formData.password);
        
        // Store token and user data
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('email', response.data.email);
        localStorage.setItem('name', response.data.name);
        localStorage.setItem('userId', response.data.userId);
        localStorage.setItem('role', 'User');
        
        navigate('/user', { replace: true });
      } else {
        // --- SIGN UP LOGIC ---
        if (!validateEmail(formData.email)) {
          alert('Please enter a valid email address.');
          return;
        }
        if (!validatePhone(formData.phone)) {
          alert('Please enter a valid 10-digit phone number.');
          return;
        }
        if (!validatePassword(formData.password)) {
          alert('Password must be at least 6 characters long.');
          return;
        }
        if (formData.password !== formData.confirmPassword) {
          alert('Passwords do not match.');
          return;
        }
        if (!formData.gender) {
          alert('Please select a gender.');
          return;
        }

        const userData = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          gender: formData.gender,
          password: formData.password
        };

        const response = await authAPI.userRegister(userData);
        
        // Store token and user data after registration
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('email', response.data.email);
        localStorage.setItem('name', response.data.name);
        localStorage.setItem('userId', response.data.userId);
        localStorage.setItem('role', 'User');
        
        alert('Registration successful! Please login.');
        setIsLogin(true);
        setFormData({
          name: '',
          phone: '',
          email: formData.email,
          password: '',
          confirmPassword: '',
          gender: ''
        });
      }
    } catch (error) {
      console.error('Auth error:', error);
      alert(error.response?.data || 'Authentication failed. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-topbar">
        <Link to="/" className="navbar-brand d-flex align-items-center">
          <img src={logo} alt="logo" height="45" className="me-2" />
        </Link>
        <button onClick={toggleForm}>
          {isLogin ? 'Sign Up' : 'Login'}
        </button>
      </div>
      <div className="auth-content">
        <form className="auth-form" onSubmit={handleSubmit}>
          {isLogin ? (
            <>
              <h2>Login</h2>
              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mail-box"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mail-box"
              />
              <div className="forgot-password">
                <Link to="/forgot-password">Forgot Password?</Link>
              </div>
              <button type="submit" className="submit-btn">Login</button>
            </>
          ) : (
            <>
              <h2>Sign Up</h2>
              <input
                type="text"
                name="name"
                placeholder="Name"
                required
                value={formData.name}
                onChange={handleChange}
                className="mail-box"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                required
                value={formData.phone}
                onChange={handleChange}
                className="mail-box"
              />
              <select
                name="gender"
                required
                onChange={handleChange}
                className="mail-box"
                value={formData.gender}
              >
                <option value="" disabled>Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mail-box"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mail-box"
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="mail-box"
              />
              <button type="submit" className="submit-btn">Register</button>
            </>
          )}
        </form>
        <div className="auth-image">
          <img src={taxi} alt="Taxi" />
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
