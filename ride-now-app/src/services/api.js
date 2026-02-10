import axios from 'axios';

const API_BASE_URL = 'https://localhost:7207';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Token refresh function
const refreshToken = async () => {
  const refreshTokenValue = localStorage.getItem('refreshToken');
  const accessToken = localStorage.getItem('token');
  
  if (!refreshTokenValue) throw new Error('No refresh token');
  
  const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {
    refreshToken: refreshTokenValue,
    accessToken: accessToken
  });
  
  localStorage.setItem('token', response.data.accessToken);
  localStorage.setItem('refreshToken', response.data.refreshToken);
  return response.data.accessToken;
};

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const newToken = await refreshToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.clear();
        window.location.href = '/';
        return Promise.reject(refreshError);
      }
    }
    
    if (error.response?.status === 500) {
      console.error('Server Error:', error.response.data);
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  userLogin: async (email, password) => {
    const response = await api.post('/api/user/login', { email, password });
    if (response.data.refreshToken) {
      localStorage.setItem('refreshToken', response.data.refreshToken);
    }
    return response;
  },
  userRegister: (userData) => api.post('/api/user/register', userData),
  driverLogin: async (email, password) => {
    const response = await api.post('/api/driver/login', { email, password });
    if (response.data.refreshToken) {
      localStorage.setItem('refreshToken', response.data.refreshToken);
    }
    return response;
  },
  driverRegister: (driverData) => api.post('/api/driver/register', driverData),
  driverSetPreferences: (preferences) => api.put('/api/driver/preferences', preferences),
  driverCompleteProfile: (profileData) => api.put('/api/driver/complete-profile', profileData),
  userForgotPassword: (email) => api.post('/api/user/forgot-password', { email }),
  userResetPassword: (email, token, newPassword) => api.post('/api/user/reset-password', { email, token, newPassword }),
  driverForgotPassword: (email) => api.post('/api/driver/forgot-password', { email }),
  driverResetPassword: (email, token, newPassword) => api.post('/api/driver/reset-password', { email, token, newPassword }),
  getDriverStatus: (driverId) => api.get(`/api/drivers/status/${driverId}`),
  updateDriverStatus: async (driverId, status) => {
    try {
      console.log('Updating driver status:', { driverId, status });
      
      // Try PUT first, then POST if it fails
      try {
        const response = await api.put(`/api/drivers/status/${driverId}`, { status });
        console.log('Driver status updated successfully (PUT)');
        return response;
      } catch (putError) {
        console.log('PUT failed, trying POST:', putError.response?.status);
        const response = await api.post(`/api/drivers/status/${driverId}`, { status });
        console.log('Driver status updated successfully (POST)');
        return response;
      }
    } catch (error) {
      console.error('Failed to update driver status:', error);
      throw error;
    }
  },
};

// Ride APIs
export const rideAPI = {
  requestRide: (rideData) => api.post('/api/rides/request', rideData),
  getAvailableRides: (location, vehicleType) => api.get(`/api/rides/available?location=${location}&vehicleType=${vehicleType}`),
  acceptRide: (rideId) => api.put(`/api/rides/${rideId}/accept`),
  verifyOTP: (rideId, otp) => api.post(`/api/rides/${rideId}/verify-otp`, { otp }),
  completeRide: (rideId) => api.put(`/api/rides/${rideId}/complete`),
  getCurrentUserRide: () => api.get('/api/rides/user/current'),
  getCurrentDriverRide: () => api.get('/api/rides/driver/current'),
  getRideDetails: (rideId) => api.get(`/api/rides/${rideId}`),
  getRideFeedback: (rideId) => api.get(`/api/feedback/ride/${rideId}`),
};

// Location APIs
export const locationAPI = {
  calculateFare: (fareData) => api.post('/api/location/calculate-fare', fareData),
  calculateDistance: (distanceData) => api.post('/api/location/calculate-distance', distanceData),
};

// Payment APIs
export const paymentAPI = {
  generateUPIQR: (rideId, amount) => api.post('/api/payments/upi/generate-qr', { rideId, amount }),
  processPayment: (paymentData) => api.post('/api/payments/process', paymentData),
  getRidePayment: (rideId) => api.get(`/api/payments/ride/${rideId}`),
  selectPaymentMethod: (selectionData) => api.post('/api/payments/select', selectionData),
  getPaymentSelection: (rideId) => api.get(`/api/payments/selection/${rideId}`),
};

// Feedback APIs
export const feedbackAPI = {
  createFeedback: (feedbackData) => api.post('/api/feedback', feedbackData),
  getDriverFeedback: (driverId) => api.get(`/api/feedback/driver/${driverId}`),
  getRideFeedback: (rideId) => api.get(`/api/feedback/ride/${rideId}`),
  getDriverEarningsWithFeedback: (driverId) => api.get(`/api/feedback/driver/${driverId}/earnings`),
  createDriverEarning: (earningsData) => api.post('/api/earnings', earningsData),
};

// Earnings APIs
export const earningsAPI = {
  getDriverEarnings: (driverId) => api.get(`/api/earnings/driver/${driverId}`),
  createEarning: (earningsData) => api.post('/api/earnings', earningsData),
  addDriverEarning: (earningsData) => api.post('/api/earnings', earningsData),
};

export default api;