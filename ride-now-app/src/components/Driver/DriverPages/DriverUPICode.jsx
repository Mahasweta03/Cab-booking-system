import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { paymentAPI } from '../../../services/api';
import PaymentProcessing from '../../Payment/PaymentPages/PaymentProcessing';

const DriverPayment = ({ rideId, amount = 150 }) => {
  const [qrCode, setQrCode] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateQR = async () => {
      try {
        if (rideId) {
          const response = await paymentAPI.generateUPIQR(rideId, amount);
          setQrCode(response.data.qrCode);
        } else {
          const driverName = localStorage.getItem('name') || 'Driver';
          setQrCode(`upi://pay?pa=pay.${driverName.toLowerCase().replace(' ', '')}@okhdfcbank&pn=${driverName}&am=${amount}&cu=INR`);
        }
      } catch (error) {
        console.error('QR generation failed:', error);
        const driverName = localStorage.getItem('name') || 'Driver';
        setQrCode(`upi://pay?pa=pay.${driverName.toLowerCase().replace(' ', '')}@okhdfcbank&pn=${driverName}&am=${amount}&cu=INR`);
      } finally {
        setLoading(false);
      }
    };

    generateQR();
  }, [rideId, amount]);

  if (loading) {
    return (
      <div className="payment-container">
        <div className="payment-card">
          <h2>Generating QR Code...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-container">
      <div className="payment-card">
        <h2>Payment Info</h2>
        <QRCode value={qrCode} size={180} />
        <p className="upi-id">Amount: ₹{amount}</p>
        <PaymentProcessing paymentMethod="UPI" />
      </div>
    </div>
  );
};

export default DriverPayment;
