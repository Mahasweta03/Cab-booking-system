import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import UPIQRDisplay from '../../Payment/PaymentPages/UPIQRDisplay.jsx';
import { paymentAPI, rideAPI } from '../../../services/api';
import '../UserScss/PaymentPage.scss';

function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [bookingInfo, setBookingInfo] = useState(location.state?.bookingInfo);
  const [showCamera, setShowCamera] = useState(false);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [upiQR, setUpiQR] = useState('');
  const [processing, setProcessing] = useState(false);
  const [currentRide, setCurrentRide] = useState(null);

  useEffect(() => {
    if (!bookingInfo) {
      // Check if user has an active ride
      checkCurrentRide();
    }
  }, [bookingInfo, navigate]);

  const checkCurrentRide = async () => {
    try {
      console.log('Checking for current ride...');
      const response = await rideAPI.getCurrentUserRide();
      console.log('Current ride response:', response.data);
      
      if (response.data && (response.data.status === 'Completed' || response.data.status === 'InProgress')) {
        console.log('Found ride for payment:', response.data);
        setCurrentRide(response.data);
        setBookingInfo({
          rideId: response.data.rideId,
          fare: response.data.fare,
          source: response.data.pickupLocation,
          destination: response.data.dropLocation,
          selectedCab: { type: response.data.vehicleType }
        });
      } else {
        console.log('No suitable ride found for payment');
        alert("No active ride found for payment. Redirecting to home.");
        navigate("/user", { replace: true });
      }
    } catch (error) {
      console.error('Failed to fetch current ride:', error);
      alert("Booking information is missing. Redirecting to booking page.");
      navigate("/user", { replace: true });
    }
  };

  if (!bookingInfo) {
    return null; // Render nothing while redirecting
  }

  const { paymentMethod, driverUpiId, source, destination, selectedCab } =
    bookingInfo;

  const handlePaymentSelect = async (method) => {
    setBookingInfo({ ...bookingInfo, paymentMethod: method });
    
    // Store payment method in localStorage for driver access
    localStorage.setItem('selectedPaymentMethod', method);
    
    // Notify driver about payment method selection
    try {
      await paymentAPI.selectPaymentMethod({
        rideId: bookingInfo.rideId,
        paymentMethod: method,
        upiId: method === 'UPI' ? bookingInfo.driverUpiId : null
      });
    } catch (error) {
      console.error('Failed to select payment method:', error);
    }
    
    if (method === "Scanner") {
      try {
        const response = await paymentAPI.generateUPIQR(bookingInfo.rideId, bookingInfo.fare);
        setUpiQR(response.data.qrCode);
        setShowCamera(true);
      } catch (error) {
        console.error('Failed to generate UPI QR:', error);
        alert('Failed to generate QR code');
      }
    } else {
      setShowCamera(false);
    }
  };

  const handleUpiChange = (e) => {
    setBookingInfo({ ...bookingInfo, driverUpiId: e.target.value });
  };

  const confirmPayment = async () => {
    console.log('Confirming payment with method:', paymentMethod);
    console.log('Booking info:', bookingInfo);
    
    if (!paymentMethod) {
      return alert("Please select a payment method.");
    }

    if (paymentMethod === "UPI") {
      if (!driverUpiId) {
        return alert("Please enter the Driver's UPI ID");
      }
      const upiRegex = /^[a-zA-Z0-9.\-_]+@[a-zA-Z0-9.\-_]+$/;
      if (!upiRegex.test(driverUpiId)) {
        return alert("Please enter a valid UPI ID format (e.g., name@bank).");
      }
    }

    setProcessing(true);
    try {
      // Ensure we have a valid rideId
      if (!bookingInfo.rideId) {
        alert('No ride ID found. Please try again.');
        return;
      }

      const paymentData = {
        rideId: bookingInfo.rideId,
        amount: bookingInfo.fare,
        paymentMethod: paymentMethod === 'Cash' ? 'Cash' : paymentMethod === 'UPI' ? 'UpiId' : 'QrCode',
        upiId: paymentMethod === 'UPI' ? driverUpiId : null
      };

      console.log('Processing payment with data:', paymentData);
      await paymentAPI.processPayment(paymentData);
      
      // Update payment selection status to completed
      console.log('Updating payment status to Completed for ride:', bookingInfo.rideId);
      try {
        await paymentAPI.selectPaymentMethod({
          rideId: bookingInfo.rideId,
          paymentMethod: 'Completed',
          upiId: null
        });
        console.log('Payment completion notification sent to driver');
      } catch (selectionError) {
        console.warn('Failed to update payment selection, but payment was processed:', selectionError);
      }
      
      setShowCamera(false);
      setShowPaymentSuccess(true);

      setTimeout(() => {
        setShowPaymentSuccess(false);
        navigate("/user/receipt", { replace: true, state: { bookingInfo } });
      }, 2000);
    } catch (error) {
      console.error('Payment failed:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      let errorMessage = 'Payment failed. Please try again.';
      if (error.response?.data) {
        errorMessage = typeof error.response.data === 'string' 
          ? error.response.data 
          : error.response.data.message || errorMessage;
      }
      
      alert(errorMessage);
    } finally {
      setProcessing(false);
    }
  };

  if (!selectedCab || !source || !destination) {
    return null;
  }

  return (
    <div className="app-container">
      {showPaymentSuccess && (
        <div className="popup receipt-popup-fade">
          <div className="popup-content receipt-anim">
            <span
              role="img"
              aria-label="success"
              style={{
                fontSize: "2.5em",
                color: "#37b37e",
                display: "inline-block",
                marginBottom: "16px",
              }}
            >
              ✅
            </span>
            <div style={{ fontWeight: "700", fontSize: "1.2em" }}>
              Payment Completed!
            </div>
          </div>
        </div>
      )}

      <div className="center-card">
        <h3>Select Payment Method</h3>
        <div className="payment-options">
          <label>
            <input
              type="radio"
              name="payment"
              value="Cash"
              checked={paymentMethod === "Cash"}
              onChange={() => handlePaymentSelect("Cash")}
            />
            <span>Cash</span>
          </label>
          <label>
            <input
              type="radio"
              name="payment"
              value="UPI"
              checked={paymentMethod === "UPI"}
              onChange={() => handlePaymentSelect("UPI")}
            />
            <span>UPI</span>
          </label>
          <label>
            <input
              type="radio"
              name="payment"
              value="Scanner"
              checked={paymentMethod === "Scanner"}
              onChange={() => handlePaymentSelect("Scanner")}
            />
            <span>Scan</span>
          </label>
        </div>
        {paymentMethod === "UPI" && (
          <div style={{ width: "100%", margin: "10px 0" }}>
            <input
              className="input"
              placeholder="Enter driver's UPI ID"
              value={driverUpiId || ""}
              onChange={handleUpiChange}
            />
          </div>
        )}
        {paymentMethod === "Scanner" && showCamera && upiQR && (
          <UPIQRDisplay 
            qrCode={upiQR} 
            amount={bookingInfo.fare} 
            onClose={() => setShowCamera(false)} 
          />
        )}
        {paymentMethod && paymentMethod !== "Scanner" && (
          <p>
            You have selected{" "}
            <b>
              {paymentMethod === "UPI" && driverUpiId
                ? `UPI (${driverUpiId})`
                : paymentMethod}
            </b>
            . Please proceed.
          </p>
        )}
        <button className="button" onClick={confirmPayment} disabled={processing}>
          {processing ? 'Processing...' : 'Confirm Payment'}
        </button>
        <button className="back-btn" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>
    </div>
  );
}

export default PaymentPage;