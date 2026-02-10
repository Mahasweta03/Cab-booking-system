import React, { useEffect, useState } from 'react';
import '../RatingCss/DriverRating.css';

const DriverRating = () => {
  const [ratings, setRatings] = useState([]);

  useEffect(() => {
    // Example: Fetching from localStorage or API
    const storedRatings = JSON.parse(localStorage.getItem('driverRatings')) || [
      {
        customerName: 'John Doe',
        rating: 4,
        feedback: 'Very polite and punctual.',
        date: '2025-08-20'
      },
      {
        customerName: 'Jane Smith',
        rating: 5,
        feedback: 'Excellent service!',
        date: '2025-08-22'
      }
    ];
    setRatings(storedRatings);
  }, []);

  return (
    <div className="ratings-container">
      <h2>Driver Ratings & Feedback</h2>
      <table className="ratings-table">
        <thead>
          <tr>
            <th>Customer Name</th>
            <th>Rating</th>
            <th>Feedback</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {ratings.length > 0 ? (
            ratings.map((entry, index) => (
              <tr key={index}>
                <td>{entry.customerName}</td>
                <td>{entry.rating} ⭐</td>
                <td>{entry.feedback}</td>
                <td>{entry.date}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No ratings available.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DriverRating;
