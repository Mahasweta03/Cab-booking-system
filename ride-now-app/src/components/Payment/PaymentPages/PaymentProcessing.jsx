import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentProcessing = ({ paymentMethod, rideId, amount }) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('waiting');
  const navigate = useNavigate();

  // Simulate waiting for user payment completion
  useEffect(() => {
    console.log('PaymentProcessing started, waiting for user payment...');
    
    // For now, let's wait 5 seconds to simulate user completing payment
    const timer = setTimeout(() => {
      console.log('User payment completed, starting progress bar...');
      setStatus('processing');
      startProgressBar();
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const startProgressBar = () => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 10;
        if (next >= 100) {
          clearInterval(interval);
          setStatus('success');
          setTimeout(() => navigate("/driver/receipt"), 1000);
        }
        return next >= 100 ? 100 : next;
      });
    }, 300);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      {status === 'waiting' && (
        <div>
          <p style={{ color: 'orange' }}>⏳ Waiting for customer to complete {paymentMethod} payment...</p>
          <div style={{ fontSize: '50px', margin: '20px 0' }}>💳</div>
          <p style={{ fontSize: '14px', color: '#666' }}>Please wait 5 seconds (simulating user payment)</p>
        </div>
      )}
      
      {status === 'processing' && (
        <div>
          <p>Processing {paymentMethod} payment...</p>
          <div style={{ width: '100%', height: '20px', backgroundColor: '#f0f0f0', borderRadius: '10px', margin: '20px 0' }}>
            <div style={{ width: `${progress}%`, height: '100%', backgroundColor: '#4CAF50', borderRadius: '10px', transition: 'width 0.3s' }} />
          </div>
          <p>{progress}%</p>
        </div>
      )}
      
      {status === 'success' && (
        <div style={{ color: "green", fontSize: "20px", fontWeight: "bold" }}>
          ✅ Payment Success!
        </div>
      )}
    </div>
  );
};

export default PaymentProcessing;