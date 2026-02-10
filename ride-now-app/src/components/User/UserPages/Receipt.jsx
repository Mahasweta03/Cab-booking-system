import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { formatPlaceName } from "../UserPages/utils.js";
import { feedbackAPI } from '../../../services/api';
import '../UserScss/Receipt.scss';
import {
  FaMapMarkerAlt,
  FaLocationArrow,
  FaRoute,
  FaRupeeSign,
  FaCreditCard,
  FaCalendarAlt,
} from "react-icons/fa";

function Receipt() {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingInfo = location.state?.bookingInfo;

  useEffect(() => {
    if (!bookingInfo) {
      alert("Booking information is missing. Redirecting to booking page.");
      navigate("/user", { replace: true });
      return;
    }

    const { source, destination, selectedCab, paymentMethod } = bookingInfo;
    if (!selectedCab || !source || !destination || !paymentMethod) {
        alert("Incomplete booking data. Please start over.");
        navigate("/user", { replace: true });
    }
  }, [bookingInfo, navigate]);

  // Prevent back navigation from receipt page
  useEffect(() => {
    const handlePopState = (event) => {
      event.preventDefault();
      navigate('/user', { replace: true });
    };
    
    window.addEventListener('popstate', handlePopState);
    window.history.pushState(null, null, window.location.pathname);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate]);

  const dateStr = new Date().toLocaleString("en-IN", { hour12: true });

  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const hasSavedRide = useRef(false);

  useEffect(() => {
    if (hasSavedRide.current || !bookingInfo) {
      return;
    }
    const email = localStorage.getItem("email");
    if (email && bookingInfo.source) {
      const historyKey = `rideHistory_${email}`;
      const history = JSON.parse(localStorage.getItem(historyKey)) || [];

      const newRide = {
        rideID: `RIDE${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toLocaleString("en-IN", {
          dateStyle: "short",
          timeStyle: "short",
          hour12: true,
        }),
        source: formatPlaceName(bookingInfo.source),
        destination: formatPlaceName(bookingInfo.destination),
        distance: bookingInfo.distanceKm,
        fare: bookingInfo.fare,
      };

      history.unshift(newRide);
      localStorage.setItem(historyKey, JSON.stringify(history));
      hasSavedRide.current = true;
    }
  }, [bookingInfo]);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Please provide a rating before submitting.");
      return;
    }
    
    // Generate a temporary ride ID if not available
    const rideId = bookingInfo.rideId || `temp-${Date.now()}`;
    
    try {
      await feedbackAPI.createFeedback({
        rideId: rideId,
        rating,
        comment: feedback
      });
      setSubmitted(true);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      console.error('Error details:', error.response?.data);
      alert('Failed to submit feedback. Please try again.');
    }
  };

  if (!bookingInfo) {
    return null;
  }
    
  const { source, destination, distanceKm, fare, paymentMethod } =
  bookingInfo;

  return (
    <div className="app-container">
      <div className="center-card receipt-card">
        <h2 className="receipt-heading">Trip Completed!</h2>
        <div className="receipt-summary">
          <div className="receipt-row">
            <div className="receipt-item">
              <span className="receipt-label"><FaMapMarkerAlt /> Source</span>
              <span className="receipt-value">{formatPlaceName(source)}</span>
            </div>
            <div className="receipt-item">
              <span className="receipt-label"><FaLocationArrow /> Destination</span>
              <span className="receipt-value">{formatPlaceName(destination)}</span>
            </div>
          </div>
          <div className="receipt-row">
            <div className="receipt-item">
              <span className="receipt-label"><FaRoute /> Distance</span>
              <span className="receipt-value">{distanceKm} km</span>
            </div>
            <div className="receipt-item">
              <span className="receipt-label"><FaRupeeSign /> Fare Paid</span>
              <span className="receipt-value">₹{fare}</span>
            </div>
          </div>
          <div className="receipt-row">
            <div className="receipt-item">
              <span className="receipt-label"><FaCreditCard /> Payment</span>
              <span className="receipt-value">{paymentMethod}</span>
            </div>
            <div className="receipt-item">
              <span className="receipt-label"><FaCalendarAlt /> Date & Time</span>
              <span className="receipt-value">{dateStr}</span>
            </div>
          </div>
        </div>

        {!submitted ? (
          <form onSubmit={handleFeedbackSubmit} className="feedback-form">
            <h3 style={{margin:"15px 0 8px 0"}}>Rate your ride:</h3>
            <div className="star-rating">
              {[1,2,3,4,5].map(i => (
                <span
                  key={i}
                  className={rating >= i ? "active" : ""}
                  onClick={() => setRating(i)}
                  aria-label={`Rate ${i} star`}
                >★</span>
              ))}
            </div>
            <input
              type="text"
              className="input"
              placeholder="Share your feedback (optional)"
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
            />
            <button className="button" type="submit" disabled={rating === 0}>
              Submit Feedback
            </button>
          </form>
        ) : (
          <div className="feedback-submission-container">
            <div className="thank-you-message"><b>Thank you for your feedback!</b></div>
            <button className="button" onClick={() => {
              // Clear ride data and prevent back navigation
              localStorage.removeItem('currentRide');
              navigate('/user', { replace: true });
              // Clear browser history to prevent going back to receipt
              window.history.pushState(null, null, '/user');
            }}>Back to Home</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Receipt;