// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { paymentAPI } from '../../../services/api';
// // import '../../Driver/DriverCss/DriverPayment.css';

// const DriverPayment = () => {
//   const navigate = useNavigate();
//   const [paymentStatus, setPaymentStatus] = useState('waiting');
//   const [selectedMethod, setSelectedMethod] = useState('');
//   const [rideData, setRideData] = useState(null);

//   useEffect(() => {
//     const currentRide = JSON.parse(localStorage.getItem('completedRideData') || '{}');
//     setRideData(currentRide);
    
//     // Prevent back navigation after ride completion
//     const handlePopState = (event) => {
//       event.preventDefault();
//       window.history.pushState(null, null, window.location.pathname);
//     };
    
//     window.addEventListener('popstate', handlePopState);
//     window.history.pushState(null, null, window.location.pathname);
    
//     const cleanup = () => {
//       window.removeEventListener('popstate', handlePopState);
//     };

//     const checkPaymentStatus = async () => {
//       try {
//         if (currentRide.rideId) {
//           // Check payment selection status
//           const selectionResponse = await paymentAPI.getPaymentSelection(currentRide.rideId);

//           if (selectionResponse.data && selectionResponse.data.paymentMethod) {
//             const method = selectionResponse.data.paymentMethod;
//             setSelectedMethod(method);
            
//             // Store the payment method for driver receipt if it's not "Completed"
//             if (method !== 'Completed') {
//               localStorage.setItem('selectedPaymentMethod', method);
//               console.log('Stored payment method for driver receipt:', method);
//             }
            
//             // If payment method is "Completed", payment is done
//             if (method === 'Completed') {
//               setPaymentStatus('completed');
              
//               setTimeout(() => {
//                 console.log('Payment completed, navigating to receipt');
//                 navigate('/driver/receipt', { 
//                   state: { rideData: currentRide },
//                   replace: true 
//                 });
//               }, 2000);
//             } else {
//               setPaymentStatus('selected');
//             }
//           }
//         }
//       } catch (error) {
//         console.error('Failed to check payment status:', error);
//       }
//     };

//     const interval = setInterval(checkPaymentStatus, 1000);
//     checkPaymentStatus();

//     return () => {
//       clearInterval(interval);
//       cleanup();
//     };
//   }, [navigate]);

//   return (
//     <div className='payment-container'>
//       <div className='payment-card'>
//         <h2>Payment Status</h2>
//         <p ><strong>Status  </strong>: {paymentStatus} </p>
//         <p> <strong>RideId </strong>: {rideData?.rideId}</p>
        
//         {paymentStatus === 'waiting' && (
//           <div>
            
//             <h3>Waiting for Payment</h3>
            
//             <div style={{ marginTop: '20px', textAlign: 'left' }}>
//               <p><strong>Fare:</strong> ₹{rideData?.fare}</p>
//               <p><strong>From:</strong> {rideData?.pickupLocation}</p>
//               <p><strong>To:</strong> {rideData?.dropLocation}</p>
//             </div>
//           </div>
//         )}

//         {paymentStatus === 'selected' && (
//           <div>
//             <div style={{ fontSize: '50px', margin: '20px 0' }}>✅</div>
//             <h3>Payment Method Selected</h3>
//             <p>User selected: <strong>{selectedMethod || 'Loading...'}</strong></p>
//             <p>Waiting for payment completion...</p>
//           </div>
//         )}

//         {paymentStatus === 'completed' && (
//           <div>
//             <div style={{ fontSize: '50px', margin: '20px 0' }}>🎉</div>
//             <h3>Payment Completed!</h3>
//             <p>Payment received successfully</p>
//             <p>Redirecting to receipt...</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default DriverPayment;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { paymentAPI } from '../../../services/api';
import '../../Driver/DriverCss/DriverPayment.css';

const DriverPayment = () => {
  const navigate = useNavigate();
  const [paymentStatus, setPaymentStatus] = useState('waiting');
  const [selectedMethod, setSelectedMethod] = useState('');
  const [rideData, setRideData] = useState(null);

  useEffect(() => {
    const currentRide = JSON.parse(localStorage.getItem('completedRideData') || '{}');
    setRideData(currentRide);

    const handlePopState = (event) => {
      event.preventDefault();
      window.history.pushState(null, null, window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    window.history.pushState(null, null, window.location.pathname);

    const cleanup = () => {
      window.removeEventListener('popstate', handlePopState);
    };

    const checkPaymentStatus = async () => {
      try {
        if (currentRide.rideId) {
          const selectionResponse = await paymentAPI.getPaymentSelection(currentRide.rideId);

          if (selectionResponse.data?.paymentMethod) {
            const method = selectionResponse.data.paymentMethod;
            setSelectedMethod(method);

            if (method !== 'Completed') {
              localStorage.setItem('selectedPaymentMethod', method);
            }

            if (method === 'Completed') {
              setPaymentStatus('completed');
              setTimeout(() => {
                navigate('/driver/receipt', {
                  state: { rideData: currentRide },
                  replace: true,
                });
              }, 2000);
            } else {
              setPaymentStatus('selected');
            }
          }
        }
      } catch (error) {
        console.error('Failed to check payment status:', error);
      }
    };

    const interval = setInterval(checkPaymentStatus, 1000);
    checkPaymentStatus();

    return () => {
      clearInterval(interval);
      cleanup();
    };
  }, [navigate]);

  return (
    <div className='payment-container'>
      <div className='payment-card'>
        <h2>Payment Status</h2>
        <p><strong>Status</strong>: {paymentStatus}</p>
        <p><strong>RideId</strong>: {rideData?.rideId}</p>

        {paymentStatus === 'waiting' && (
          <div>
            <h3>Waiting for Payment</h3>
            <div>
              <p><strong>Fare:</strong> ₹{rideData?.fare}</p>
              <p><strong>From:</strong> {rideData?.pickupLocation}</p>
              <p><strong>To:</strong> {rideData?.dropLocation}</p>
            </div>
          </div>
        )}

        {paymentStatus === 'selected' && (
          <div>
            <div className='payment-status'>✅</div>
            <h3>Payment Method Selected</h3>
            <p>User selected: <span className='payment-method-selected'>{selectedMethod || 'Loading...'}</span></p>
            <p>Waiting for payment completion...</p>
          </div>
        )}

        {paymentStatus === 'completed' && (
          <div>
            
            <h3 className='payment-completed'>Payment Completed!</h3>
            <p>Payment received successfully</p>
            <p>Redirecting to receipt...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverPayment;
