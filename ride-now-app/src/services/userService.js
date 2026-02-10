import api from './api';

export const userService = {
  // Profile management
  getProfile: () => api.get('/api/users/profile'),
  updateProfile: (profileData) => api.put('/api/users/profile', profileData),
  
  // Ride history
  getRideHistory: () => api.get('/api/users/ride-history'),
  
  // Dashboard stats
  getDashboardStats: () => api.get('/api/users/dashboard-stats'),
  
  // Current ride
  getCurrentRide: () => api.get('/api/rides/user/current'),
  
  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('email');
    localStorage.removeItem('name');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    localStorage.removeItem('currentRide');
  }
};

export const driverService = {
  // Profile management
  getProfile: () => api.get('/api/drivers/profile'),
  updateProfile: (profileData) => api.put('/api/drivers/profile', profileData),
  
  // Status management
  updateStatus: (status) => api.put('/api/drivers/status', { status }),
  
  // Earnings
  getEarnings: () => api.get('/api/drivers/earnings'),
  
  // Feedback
  createFeedback: (feedbackData) => api.post('/api/drivers/feedback', feedbackData),
  getFeedback: () => api.get('/api/drivers/feedback'),
  
  // Ride history
  getRideHistory: () => api.get('/api/drivers/ride-history'),
  
  // Dashboard stats
  getDashboardStats: () => api.get('/api/drivers/dashboard-stats'),
  
  // Current ride
  getCurrentRide: () => api.get('/api/rides/driver/current'),
  
  // Available rides
  getAvailableRides: (location, vehicleType) => 
    api.get(`/api/rides/available?location=${location}&vehicleType=${vehicleType}`),
  
  // Accept ride
  acceptRide: (rideId) => api.put(`/api/rides/${rideId}/accept`),
  
  // Verify OTP and start ride
  verifyOTP: (rideId, otp) => api.post(`/api/rides/${rideId}/verify-otp`, { otp }),
  
  // Complete ride
  completeRide: (rideId) => api.put(`/api/rides/${rideId}/complete`),
  
  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('email');
    localStorage.removeItem('name');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    localStorage.removeItem('driverId');
    localStorage.removeItem('completedRideData');
    localStorage.removeItem('currentRide');
  }
};