import React, { useState } from "react";
import '../UserScss/ridebooking.scss';
import LocationForm from "../UserPages/LocationForm.jsx";


function Ridebooking() {
  return (
    <>
      <div className="Booking-container">
        
        <div className="left-container">
          <h1>Ride. Tap. Go.</h1>

          <LocationForm />

         
        </div>

       
      </div>
    </>
  );
}

export default Ridebooking;
