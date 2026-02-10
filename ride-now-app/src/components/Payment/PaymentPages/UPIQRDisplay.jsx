import React from 'react';

const UPIQRDisplay = ({ qrCode, amount, onClose }) => {
  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0, 
      backgroundColor: 'rgba(0,0,0,0.5)', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '10px', 
        textAlign: 'center',
        maxWidth: '300px',
        width: '90%'
      }}>
        <h3>Scan to Pay ₹{amount}</h3>
        <div style={{ margin: '20px 0' }}>
          <img 
            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrCode)}`} 
            alt="UPI QR Code" 
            style={{ maxWidth: '200px', border: '1px solid #ccc', padding: '10px' }} 
          />
        </div>
        <p style={{ fontSize: '12px', color: '#666' }}>
          Open any UPI app and scan this QR code to pay
        </p>
        <button 
          onClick={onClose}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default UPIQRDisplay;