import React, { useState, useEffect } from 'react';
import '../../Driver/DriverCss/DriverPayment.css';
import { useNavigate } from 'react-router-dom';
import { paymentAPI } from '../../../services/api';
import PaymentProcessing from './PaymentProcessing';

const RidePayment = () => {
  const [paymentSelection, setPaymentSelection] = useState(null);
  const [currentRide, setCurrentRide] = useState(null);
  const [waitingForSelection, setWaitingForSelection] = useState(true);
  const [showProcessing, setShowProcessing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedRide = localStorage.getItem('completedRideData');
    if (storedRide) {
      setCurrentRide(JSON.parse(storedRide));
    }

    const interval = setInterval(checkPaymentSelection, 2000);
    return () => clearInterval(interval);
  }, []);

  const checkPaymentSelection = async () => {
    if (!currentRide) return;
    
    try {
      const response = await paymentAPI.getPaymentSelection(currentRide.rideId);
      if (response.data && response.data.paymentMethod) {
        setPaymentSelection(response.data);
        setWaitingForSelection(false);
        setShowProcessing(true); // Show processing component which will wait for confirmation
      }
    } catch (error) {
      console.error('Failed to check payment selection:', error);
    }
  };

  if (!currentRide) {
    return <div className="payment-confirmation-container"><div className="payment-card">No ride data found</div></div>;
  }

  return (
    <div className="payment-confirmation-container">
      <div className="payment-card">
        <h2>Payment Processing</h2>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <p><strong>Ride Completed!</strong></p>
          <p>Fare: ₹{currentRide.fare}</p>
          
          {waitingForSelection ? (
            <>
              <p>⏳ Waiting for customer to select payment method...</p>
              <div style={{ margin: '20px 0', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                <p>Available payment options for customer:</p>
                <p>💵 Cash • 📱 UPI • 📷 QR Scan</p>
              </div>
            </>
          ) : showProcessing && paymentSelection ? (
            <>
              <p style={{ color: 'blue', fontSize: '16px' }}>💳 Customer selected: {paymentSelection.paymentMethod}</p>
              
              <PaymentProcessing 
                paymentMethod={paymentSelection.paymentMethod} 
                rideId={currentRide.rideId} 
                amount={currentRide.fare} 
              />
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default RidePayment;