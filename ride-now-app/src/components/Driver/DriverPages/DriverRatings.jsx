import React, { useState, useEffect } from 'react';
import { feedbackAPI } from '../../../services/api';
import '../DriverCss/DriverEarnings.css';

const DriverRatings = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const driverId = localStorage.getItem('userId');
      if (!driverId) {
        console.error('Driver ID not found');
        return;
      }

      const response = await feedbackAPI.getDriverFeedback(driverId);
      setFeedbacks(response.data.feedbacks);
      setAverageRating(response.data.averageRating);
    } catch (error) {
      console.error('Failed to fetch feedbacks:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  if (loading) {
    return <div className="driver-earnings-container"><div>Loading ratings...</div></div>;
  }

  return (
    <div className="driver-earnings-container">
      <h1>Driver Ratings & Feedback</h1>
      <div className="driver-earnings-card">
        <div style={{ marginBottom: '30px', textAlign: 'center' }}>
          <h2>Overall Rating</h2>
          <div style={{ fontSize: '48px', color: '#ffd700', margin: '10px 0' }}>
            {renderStars(Math.round(averageRating))}
          </div>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>
            {averageRating.toFixed(1)} / 5.0
          </p>
          <p style={{ color: '#666' }}>
            Based on {feedbacks.length} review{feedbacks.length !== 1 ? 's' : ''}
          </p>
        </div>

        <h2>Customer Feedback</h2>
        <div className="feedback-list">
          {feedbacks.length > 0 ? (
            feedbacks.map((feedback) => (
              <div 
                key={feedback.feedbackId} 
                style={{ 
                  border: '1px solid #ddd', 
                  padding: '20px', 
                  margin: '15px 0', 
                  borderRadius: '8px',
                  backgroundColor: '#f9f9f9'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div>
                    <strong>{feedback.customerName}</strong>
                    <div style={{ color: '#ffd700', fontSize: '18px', margin: '5px 0' }}>
                      {renderStars(feedback.rating)}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '12px', color: '#666' }}>
                    {new Date(feedback.createdAt).toLocaleDateString()}
                  </div>
                </div>
                
                {feedback.comment && (
                  <div style={{ 
                    backgroundColor: 'white', 
                    padding: '10px', 
                    borderRadius: '4px', 
                    fontStyle: 'italic',
                    margin: '10px 0'
                  }}>
                    "{feedback.comment}"
                  </div>
                )}
                
                <div style={{ fontSize: '12px', color: '#888', marginTop: '10px' }}>
                  <strong>Ride:</strong> {feedback.rideDetails.pickupLocation} → {feedback.rideDetails.dropLocation}
                  <br />
                  <strong>Completed:</strong> {new Date(feedback.rideDetails.completedAt).toLocaleDateString()}
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              <p>No feedback received yet.</p>
              <p>Complete more rides to receive customer feedback!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DriverRatings;