import React, { useState, useEffect } from 'react';
import '../UserScss/RideHistory.scss';
// import Chart from 'react-google-charts';
import { FaCarSide } from 'react-icons/fa';

 
const RideHistory = () => {
  const [rideHistoryData, setRideHistoryData] = useState([]);

  useEffect(() => {
    const email = localStorage.getItem('email');
    if (email) {
      const historyKey = `rideHistory_${email}`;
      const history = JSON.parse(localStorage.getItem(historyKey)) || [];
      setRideHistoryData(history);
    }

 
  }, []);

  if (rideHistoryData.length === 0) {
    return (
      <div className="ride-history-container">
        <div className="ride-history-card no-rides">
          <FaCarSide className="no-rides-icon" />
          <h1>No Ride History</h1>
          <p>You haven't taken any rides yet. Book your first trip to see your history here!</p>
        </div>
      </div>
    );
  }
 
 
  return (
    <div className="ride-history-container">
      <div className="ride-history-card">
        <h1>My Ride History</h1>
       
 
        <h2>Recent Rides</h2>
        <div className="earnings-table-container">
          <table className="earnings-table">
            <thead>
              <tr>
                <th>Ride ID</th>
                 <th>Date & Time</th>
                <th>From</th>
                <th>To</th>
                <th>Distance (km)</th>
                <th>Fare</th>
              </tr>
            </thead>
            <tbody>
              {rideHistoryData.map((ride) => (
                <tr key={ride.rideID}>
                  <td>{ride.rideID}</td>
                  <td>{ride.date}</td>
                  <td>{ride.source}</td>
                  <td>{ride.destination}</td>
                  <td>{ride.distance}</td>
                  <td>₹{ride.fare}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
 
export default RideHistory;