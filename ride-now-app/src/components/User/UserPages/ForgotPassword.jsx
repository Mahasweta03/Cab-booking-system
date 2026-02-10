import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../../../services/api';
import '../UserScss/ForgotPassword.scss';

const ForgotPassword = () => {
  const [step, setStep] = useState('email'); // 'email', 'otp', 'reset'
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await authAPI.userForgotPassword(email);
      setGeneratedOtp(response.data.token);
      alert(`Reset token sent to ${email}. Token: ${response.data.token}`);
      setStep('otp');
    } catch (error) {
      console.error('Forgot password error:', error);
      alert(error.response?.data || 'An error occurred. Please try again.');
    }
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    if (otp === generatedOtp) {
      setStep('reset');
    } else {
      alert('Invalid OTP. Please try again.');
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters long.');
      return;
    }

    try {
      await authAPI.userResetPassword(email, generatedOtp, newPassword);
      alert('Password has been reset successfully. Please log in.');
      navigate('/user/login', { replace: true });
    } catch (error) {
      console.error('Reset password error:', error);
      alert(error.response?.data || 'An error occurred. Please try again.');
    }
  };

  const renderStep = () => {
    switch (step) {
      case 'email':
        return (
          <form onSubmit={handleEmailSubmit}>
            <h2>Forgot Password</h2>
            <p>Enter your registered email address to receive an OTP.</p>
            <input
              type="email"
              className="input"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="button">Send OTP</button>
          </form>
        );
      case 'otp':
        return (
          <form onSubmit={handleOtpSubmit}>
            <h2>Verify OTP</h2>
            <p>An OTP has been sent to your email address.</p>
            <input
              type="text"
              className="input"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <button type="submit" className="button">Verify OTP</button>
          </form>
        );
      case 'reset':
        return (
          <form onSubmit={handleResetSubmit}>
            <h2>Reset Password</h2>
            <p>Create a new password for your account.</p>
            <input
              type="password"
              className="input"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <input
              type="password"
              className="input"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button type="submit" className="button">Reset Password</button>
          </form>
        );
      default:
        return null;
    }
  };

  return (
    <div className="app-container1">
      <div className="center-card forgot-password-card">
        {renderStep()}
        <div className="back-to-login">
          <Link to="/user/login">Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;