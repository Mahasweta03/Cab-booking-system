import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { rideAPI, paymentAPI, feedbackAPI } from '../../../services/api';
import '../DriverCss/Receipt.css';

function DriverReceipt() {
  const navigate = useNavigate();
  const [rideData, setRideData] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [driverFeedback, setDriverFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchRideData();
    
    // Prevent back navigation from receipt page
    const handlePopState = (event) => {
      event.preventDefault();
      navigate('/driver', { replace: true });
    };
    
    window.addEventListener('popstate', handlePopState);
    window.history.pushState(null, null, window.location.pathname);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate]);

  const fetchRideData = async () => {
    try {
      // Use completed ride data from payment flow
      const completedRide = localStorage.getItem('completedRideData');
      if (completedRide) {
        const ride = JSON.parse(completedRide);
        setRideData(ride);
        setPaymentData({
          paymentMethod: 'Cash',
          status: 'Completed',
          transactionId: `TXN${Date.now()}`
        });
        await fetchFeedback(ride.rideId);
        setLoading(false);
        return;
      }

      // Fallback to current ride data
      const storedRide = localStorage.getItem('currentRide');
      if (storedRide) {
        const ride = JSON.parse(storedRide);
        setRideData(ride);
        await fetchPaymentData(ride.rideId);
        await fetchFeedback(ride.rideId);
      }
    } catch (error) {
      console.error('Failed to fetch ride data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentData = async (rideId) => {
    try {
      // Try to get actual payment record first
      try {
        const response = await paymentAPI.getRidePayment(rideId);
        if (response.data) {
          const displayMethod = response.data.paymentMethod.toLowerCase() === 'upiid' ? 'UPI' : 
                               response.data.paymentMethod.toLowerCase() === 'qrcode' ? 'QR Code' : 'Cash';
          setPaymentData({
            ...response.data,
            paymentMethod: displayMethod,
            status: 'Completed',
            transactionId: `TXN${Date.now()}`
          });
          return;
        }
      } catch (paymentError) {
        console.log('No payment record found');
      }
      
      // Get the selected payment method from localStorage if available
      const selectedPaymentMethod = localStorage.getItem('selectedPaymentMethod');
      console.log('DriverReceipt - selectedPaymentMethod from localStorage:', selectedPaymentMethod);
      if (selectedPaymentMethod) {
        const displayMethod = selectedPaymentMethod === 'UPI' ? 'UPI' : 
                             selectedPaymentMethod === 'Scanner' ? 'QR Code' : 'Cash';
        console.log('DriverReceipt - using selected payment method:', displayMethod);
        setPaymentData({
          paymentMethod: displayMethod,
          status: 'Completed',
          transactionId: `TXN${Date.now()}`
        });
        return;
      }
      
      // Final fallback to Cash
      setPaymentData({
        paymentMethod: 'Cash',
        status: 'Completed',
        transactionId: `TXN${Date.now()}`
      });
    } catch (error) {
      console.error('Failed to fetch payment data:', error);
      setPaymentData({
        paymentMethod: 'Cash',
        status: 'Completed',
        transactionId: `TXN${Date.now()}`
      });
    }
  };

  const fetchFeedback = async (rideId) => {
    try {
      const response = await rideAPI.getRideFeedback(rideId);
      if (response.data) {
        setFeedback(response.data);
      }
    } catch (error) {
      console.log('No feedback found for this ride');
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Please provide a rating before submitting.");
      return;
    }
    
    const driverId = localStorage.getItem('userId') || localStorage.getItem('driverId');
    
    try {
      await feedbackAPI.createFeedback({
        rideId: rideData.rideId,
        driverId: driverId,
        rating,
        comment: driverFeedback,
        feedbackType: 'DriverToUser'
      });
      setSubmitted(true);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      console.error('Error details:', error.response?.data);
      alert('Failed to submit feedback. Please try again.');
    }
  };

  const dateStr = new Date().toLocaleString("en-IN", { hour12: true });
  const driverName = localStorage.getItem('name') || 'Driver';
  const driverIdDisplay = localStorage.getItem('email') || 'DR12345';

  if (loading) {
    return (
      <div className="receipt-wrapper">
        <div className="receipt-card">
          <p>Loading receipt...</p>
        </div>
      </div>
    );
  }

  if (!rideData) {
    return (
      <div className="receipt-wrapper">
        <div className="receipt-card">
          <p>No ride data found</p>
          <button onClick={() => navigate("/driver")} className="close-btn">Back to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="receipt-wrapper">
      <div className="receipt-card">
        <h2 className="receipt-heading">Driver Trip Summary</h2>
        {!submitted ? (
          <form onSubmit={handleFeedbackSubmit} className="feedback-form">
            <h3>Rate your passenger:</h3>
            <div className="star-rating">
              {[1,2,3,4,5].map(i => (
                <span
                  key={i}
                  className={rating >= i ? "active" : ""}
                  onClick={() => setRating(i)}
                >★</span>
              ))}
            </div>
            <input
              type="text"
              className="input"
              placeholder="Share your feedback about the passenger (optional)"
              value={driverFeedback}
              onChange={e => setDriverFeedback(e.target.value)}
            />
            <button className="button" type="submit" disabled={rating === 0}>
              Submit Rating
            </button>
          </form>
        ) : (
          <div className="thank-you-message">
            <b>Thank you for rating the passenger!</b>
          </div>
        )}

        <div className="receipt-details">
          <p><b>Date & Time:</b> {dateStr}</p>
          <p><b>Driver Name:</b> {driverName}</p>
          <p><b>Driver ID:</b> {driverIdDisplay}</p>

          <p><b>Passenger Name:</b> {rideData.customerName || 'Customer'}</p>
          <p><b>Source:</b> {rideData.pickupLocation || rideData.source}</p>
          <p><b>Destination:</b> {rideData.dropLocation || rideData.destination}</p>
          <p><b>Distance Traveled:</b> {rideData.distanceKm || rideData.distance} km</p>
          <p><b>Fare Collected:</b> ₹{rideData.fare}</p>
          <p><b>Transaction ID:</b> {paymentData?.transactionId || `TXN${Date.now()}`}</p>
          <p><b>Payment Method:</b> {paymentData?.paymentMethod || 'Cash'}</p>

          <p><b>Payment Status:</b> {paymentData?.status || 'Completed'}</p>

          {feedback && (
            <div className="feedback-section">
              <p><b>Customer Feedback:</b></p>
              <p><b>Rating:</b> {feedback.rating}/5 ⭐</p>
              {feedback.comment && <p><b>Comment:</b> "{feedback.comment}"</p>}
            </div>
          )}

          

          <div className="close-btn-container">
            <button onClick={() => {
              // Clear completed ride data and prevent back navigation
              localStorage.removeItem('completedRideData');
              localStorage.removeItem('currentRide');
              navigate('/driver', { replace: true });
              // Clear browser history to prevent going back to receipt
              window.history.pushState(null, null, '/driver');
            }} className="close-btn">Back to Dashboard</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DriverReceipt;
