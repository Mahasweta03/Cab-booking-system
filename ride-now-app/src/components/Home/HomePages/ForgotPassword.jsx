// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import '../../User/UserScss/ForgotPassword.scss';

// const ForgotPassword = () => {
//   const [step, setStep] = useState('email'); // 'email', 'otp', 'reset'
//   const [email, setEmail] = useState('');
//   const [otp, setOtp] = useState('');
//   const [generatedOtp, setGeneratedOtp] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const navigate = useNavigate();

//   const handleEmailSubmit = (e) => {
//     e.preventDefault();
//     // SECURITY WARNING: Storing user data in local storage is not secure.
//     // This should be handled by a proper backend authentication system.
//     const users = JSON.parse(localStorage.getItem('users')) || [];
//     const userExists = users.some(user => user.email === email);

//     if (!userExists) {
//       alert('No user found with this email address.');
//       return;
//     }

//     // Simulate sending OTP
//     // SECURITY WARNING: Hardcoded OTP is not secure. This should be generated on the server-side.
//     const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
//     setGeneratedOtp(newOtp);
//     alert(`Your OTP is: ${newOtp}`); // For testing purposes
//     setStep('otp');
//   };

//   const handleOtpSubmit = (e) => {
//     e.preventDefault();
//     if (otp === generatedOtp) {
//       setStep('reset');
//     } else {
//       alert('Invalid OTP. Please try again.');
//     }
//   };

//   const handleResetSubmit = (e) => {
//     e.preventDefault();
//     if (newPassword !== confirmPassword) {
//       alert('Passwords do not match.');
//       return;
//     }
//     if (newPassword.length < 6) {
//       alert('Password must be at least 6 characters long.');
//       return;
//     }

//     // SECURITY WARNING: Storing user data in local storage is not secure.
//     // This should be handled by a proper backend authentication system.
//     const users = JSON.parse(localStorage.getItem('users')) || [];
//     const userIndex = users.findIndex(user => user.email === email);

//     if (userIndex !== -1) {
//       users[userIndex].password = newPassword;
//       localStorage.setItem('users', JSON.stringify(users));
//       alert('Password has been reset successfully. Please log in.');
//       navigate('/');
//     } else {
//       alert('An error occurred.Please Sign Up.');
//     }
//   };

//   const renderStep = () => {
//     switch (step) {
//       case 'email':
//         return (
//           <form onSubmit={handleEmailSubmit}>
//             <h2>Forgot Password</h2>
//             <p>Enter your registered email address to receive an OTP.</p>
//             <input
//               type="email"
//               className="input"
//               placeholder="Email Address"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//             <button type="submit" className="button">Send OTP</button>
//           </form>
//         );
//       case 'otp':
//         return (
//           <form onSubmit={handleOtpSubmit}>
//             <h2>Verify OTP</h2>
//             <p>An OTP has been sent to your email address.</p>
//             <input
//               type="text"
//               className="input"
//               placeholder="Enter 6-digit OTP"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value)}
//               required
//             />
//             <button type="submit" className="button">Verify OTP</button>
//           </form>
//         );
//       case 'reset':
//         return (
//           <form onSubmit={handleResetSubmit}>
//             <h2>Reset Password</h2>
//             <p>Create a new password for your account.</p>
//             <input
//               type="password"
//               className="input"
//               placeholder="New Password"
//               value={newPassword}
//               onChange={(e) => setNewPassword(e.target.value)}
//               required
//             />
//             <input
//               type="password"
//               className="input"
//               placeholder="Confirm New Password"
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               required
//             />
//             <button type="submit" className="button">Reset Password</button>
//           </form>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="app-container">
//       <div className="center-card forgot-password-card">
//         {renderStep()}
//         <div className="back-to-login">
//           <Link to="/user/login">Back to Login</Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ForgotPassword;




import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../../User/UserScss/ForgotPassword.scss';
import bcrypt from 'bcryptjs';

const ForgotPassword = () => {
  const [step, setStep] = useState('email'); // 'email', 'otp', 'reset'
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const validatePassword = (password) => {
    // Criteria: At least 3 characters, one uppercase letter, and at least two numbers.
    const regex = /^(?=.*[A-Z])(?=(?:.*\d){2,}).{3,}$/;
    return regex.test(password);
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userExists = users.some(user => user.email === email);

    if (!userExists) {
      alert('No user found with this email address.');
      return;
    }

    // Simulate sending OTP
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    alert(`Your OTP is: ${newOtp}`); // For testing purposes
    setStep('otp');
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    if (otp === generatedOtp) {
      setStep('reset');
    } else {
      alert('Invalid OTP. Please try again.');
    }
  };

  const handleResetSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
    if (!validatePassword(newPassword)) {
      alert('Password must be at least 3 characters long, contain one uppercase letter, and at least two numbers.');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(user => user.email === email);

    if (userIndex !== -1) {
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(newPassword, salt);
      users[userIndex].password = hashedPassword;
      localStorage.setItem('users', JSON.stringify(users));
      alert('Password has been reset successfully. Please log in.');
      navigate('/');
    } else {
      alert('An error occurred. Please try again.');
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
    <div className="app-container">
      <div className="center-card forgot-password-card">
        {renderStep()}
        <div className="back-to-login">
          <Link to="/">Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;