import React, { useState } from 'react';
import { useNavigate  , Link} from 'react-router-dom';
import { authAPI } from '../../../services/api';
import taxi from '../DriverAssets/DriversCar.jpg';
import logo from '../../Home/HomeAssets/logo3.png';

// import taxi from './DriversCar.jpg';

const validatePassword = (password) => {
  return password.length >= 6;
};

const DriverAuthPage = () => {
  const [authMode, setAuthMode] = useState('login');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [forgotPasswordStep, setForgotPasswordStep] = useState(1);
  const [otp, setOtp] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(true);
  const navigate = useNavigate();

  const toggleForm = () => setAuthMode(authMode === 'login' ? 'signup' : 'login');
  const showForgotPassword = (e) => {
    e.preventDefault();
    setAuthMode('forgot');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);
    if (name === 'password' || name === 'confirmPassword') {
      setPasswordMatch(updatedFormData.password === updatedFormData.confirmPassword);
    }
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^\d{10}$/.test(phone);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (authMode === 'signup') {
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
        if (!passwordMatch) {
          alert('Passwords do not match.');
          return;
        }

        const driverData = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password
        };

        const response = await authAPI.driverRegister(driverData);
        
        // Store token and driver data
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('email', response.data.email);
        localStorage.setItem('name', response.data.name);
        localStorage.setItem('phone', formData.phone);
        localStorage.setItem('userId', response.data.userId);
        localStorage.setItem('role', 'Driver');
        
        navigate('/signup-flow', { state: { signupData: formData } });
      } else {
        const response = await authAPI.driverLogin(formData.email, formData.password);
        
        // Store token and driver data
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('email', response.data.email);
        localStorage.setItem('name', response.data.name);
        localStorage.setItem('phone', response.data.phone || '');
        localStorage.setItem('userId', response.data.userId);
        localStorage.setItem('role', 'Driver');
        
        navigate('/driver', { state: { signupData: response.data } });
      }
    } catch (error) {
      console.error('Auth error:', error);
      console.error('Error details:', error.response?.data);
      

      if (error.response?.status === 500) {
        alert('Server error: ' + (error.response.data || 'Internal server error'));
      } else if (error.response?.status === 400) {
        alert('Invalid data: ' + (error.response.data || 'Bad request'));
      } else if (error.response?.data) {
        alert(error.response.data);
      } else {
        alert('Authentication failed. Please try again.');
      }
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    
    try {
      if (forgotPasswordStep === 1) {
        if (!validateEmail(formData.email)) {
          alert('Please enter a valid email address.');
          return;
        }
        
        const response = await authAPI.driverForgotPassword(formData.email);
        alert(`Reset token sent to ${formData.email}. Token: ${response.data.token}`);
        setForgotPasswordStep(2);
      } else {
        if (!validatePassword(formData.password)) {
          alert('Password must be at least 6 characters long.');
          return;
        }
        if (!passwordMatch) {
          alert('Passwords do not match.');
          return;
        }
        
        await authAPI.driverResetPassword(formData.email, otp, formData.password);
        alert('Password has been reset successfully. Please login.');
        setAuthMode('login');
        setForgotPasswordStep(1);
        setFormData({ name: '', phone: '', email: '', password: '', confirmPassword: '' });
        setOtp('');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      alert(error.response?.data || 'An error occurred. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-topbar">
   
        <Link to="/" className="navbar-brand d-flex align-items-center">
          <img src={logo} alt="logo" height="45" className="me-2" />
        </Link>
        {authMode !== 'forgot' && (
          <button onClick={toggleForm}>
            {authMode === 'login' ? 'Sign Up' : 'Login'}
          </button>
        )}
      </div>
      <div className="auth-content">
        {authMode === 'login' && (
          <form className="auth-form" onSubmit={handleSubmit}>
            <>
              <h2>Driver Login</h2>
              <input type="email" name="email" placeholder="Email" required value={formData.email} onChange={handleChange} className="mail-box" />
              <input type="password" name="password" placeholder="Password" required value={formData.password} onChange={handleChange} className="mail-box" />
              <button type="button" onClick={showForgotPassword} style={{ marginTop: "10px", cursor: "pointer", textDecoration: "none", background: "none", border: "none", color: "blue" }}>
                Forgot Password?
              </button>
              <button type="submit" className="submit-btn">Login</button>
            </>
          </form>
        )}
        {authMode === 'signup' && (
          <form className="auth-form" onSubmit={handleSubmit}>
            <>
              <h2>Driver Sign Up</h2>
              <input type="text" name="name" placeholder="Name" required value={formData.name} onChange={handleChange} className="mail-box" />
              <input type="tel" name="phone" placeholder="Phone Number" required value={formData.phone} onChange={handleChange} className="mail-box" />
              <input type="email" name="email" placeholder="Email" required value={formData.email} onChange={handleChange} className="mail-box" />
              <input type="password" name="password" placeholder="New Password" required value={formData.password} onChange={handleChange} className="mail-box" />
              <input type="password" name="confirmPassword" placeholder="Confirm Password" required value={formData.confirmPassword} onChange={handleChange} className="mail-box" />
              {!passwordMatch && <p style={{ color: 'red', marginTop: '5px' }}>Passwords do not match</p>}
              <button type="submit" className="submit-btn">Register</button>
            </>
          </form>
        )}
        {authMode === 'forgot' && (
          <form className="auth-form" onSubmit={handleForgotPassword}>
            <h2>Reset Password</h2>
            {forgotPasswordStep === 1 ? (
              <>
                <p>Enter your email to receive an OTP.</p>
                <input type="email" name="email" placeholder="Email" required value={formData.email} onChange={handleChange} className="mail-box" />
                <button type="submit" className="submit-btn">Send OTP</button>
              </>
            ) : (
              <>
                <p>Enter the OTP sent to your email and set a new password.</p>
                <input type="text" name="otp" placeholder="OTP" required value={otp} onChange={(e) => setOtp(e.target.value)} className="mail-box" />
                <input type="password" name="password" placeholder="New Password" required value={formData.password} onChange={handleChange} className="mail-box" />
                <input type="password" name="confirmPassword" placeholder="Confirm New Password" required value={formData.confirmPassword} onChange={handleChange} className="mail-box" />
                {!passwordMatch && <p style={{ color: 'red', marginTop: '5px' }}>Passwords do not match</p>}
                <button type="submit" className="submit-btn">Reset Password</button>
              </>
            )}
            <button type="button" onClick={() => setAuthMode('login')} style={{ background: 'none', border: 'none', color: 'blue', textDecoration: 'underline', cursor: 'pointer', marginTop: '10px' }}>
              Back to Login
            </button>
          </form>
        )}
        <div className="auth-image">
          <img src={taxi} alt="CabDriver" />
        </div>
      </div>
    </div>
  );
};

export default DriverAuthPage;