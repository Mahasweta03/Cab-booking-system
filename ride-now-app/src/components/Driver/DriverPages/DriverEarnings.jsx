import React, { useState, useEffect } from 'react';
import Chart from 'react-google-charts';
import { feedbackAPI } from '../../../services/api';
import '../DriverCss/DriverEarnings.css';

const DriverEarnings = () => {
  const [earningsData, setEarningsData] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      // Try multiple possible driver ID keys
      let driverId = localStorage.getItem('driverId') || 
                    localStorage.getItem('userId') || 
                    localStorage.getItem('id');
      
      console.log('All localStorage keys:', Object.keys(localStorage));
      console.log('Fetching earnings for driverId:', driverId);
      
      if (driverId) {
        const response = await feedbackAPI.getDriverEarningsWithFeedback(driverId);
        console.log('Earnings with feedback API response:', response.data);
        if (response.data) {
          setEarningsData(response.data.earnings || []);
          setTotalEarnings(response.data.totalEarnings || 0);
        }
      } else {
        console.log('No driver ID found in localStorage');
      }
    } catch (error) {
      console.error('Failed to fetch earnings:', error);
      console.error('Error details:', error.response?.data);
      setEarningsData([]);
      setTotalEarnings(0);
    } finally {
      setLoading(false);
    }
  };



  const chartData = [
    ['Ride ID', 'Fare', { role: 'tooltip', type: 'string' }],
    ...earningsData.map((earning) => [
      earning.rideId?.toString().substring(0, 8) || 'N/A',
      earning.fare || 0,
      `Date: ${new Date(earning.date).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })}\nFare: ₹${earning.fare}\nStatus: ${earning.status || 'Completed'}\nCustomer: ${earning.customerName || 'Unknown'}`,
    ]),
  ];

  const chartOptions = {
    title: 'Earnings per Ride',
    chartArea: { width: '50%' },
    colors:["FFD700"],
    vAxis: {
      title: 'Fare (₹)',
      minValue: 0,
    },
    hAxis: {
      title: 'Ride ID',
    },
    animation: {
      duration: 1000,
      easing: 'out',
    },
    tooltip: { isHtml: false },
    width: '100%',
    height: 300,
  };

  if (loading) {
    return <div className="driver-earnings-container"><div>Loading earnings...</div></div>;
  }

  return (
    <div className="driver-earnings-container">
      
      <div className="driver-earnings-card">
      <h1>Driver Ride History</h1>
        <div style={{ marginBottom: '20px' }}>
          <h3>Total Earnings: ₹{totalEarnings}</h3>
        </div>
        
        {earningsData.length > 0 && (
          <Chart
            chartType="ColumnChart"
            width="100%"
            height="300px"
            data={chartData}
            options={chartOptions}
          />
        )}

        <div className="earnings-table-container">
          <table className="earnings-table">
            <thead>
              <tr>
                <th>Ride ID</th>
                <th>Date</th>
                <th>Fare</th>
                <th>Payment Method</th>
                <th>Status</th>
                <th>Customer Feedback</th>
              </tr>
            </thead>
            <tbody>
              {earningsData.length > 0 ? earningsData.map((earning) => {
                return (
                  <tr key={earning.earningId || earning.rideId}>
                    <td>{earning.rideId?.toString().substring(0, 8) || 'N/A'}</td>
                    <td>{new Date(earning.date).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })}</td>
                    <td>₹{earning.fare}</td>
                    <td>{earning.paymentMethod || 'Cash'}</td>
                    <td>{earning.status || 'Completed'}</td>
                    <td>
                      {earning.feedback ? (
                        <div>
                          <div>{'★'.repeat(earning.feedback.rating)}{'☆'.repeat(5-earning.feedback.rating)}</div>
                          {earning.feedback.comment && <small>{earning.feedback.comment}</small>}
                          <br/><small><em>- {earning.feedback.customerName}</em></small>
                        </div>
                      ) : (
                        <em>No feedback</em>
                      )}
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center' }}>No earnings data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>


      </div>
    </div>
  );
};

export default DriverEarnings;
