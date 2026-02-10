
import React, { useState } from 'react';
import Vehicle from './Vehicle';
import Welcome from './Welcome';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';


const SignUpFlow = () => {
  const [step, setStep] = useState('vehicle'); // Start with vehicle selection
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    location: '',
    vehicle: ''
  });

  const location = useLocation();

  useEffect(() => {
    // When the component mounts, check for signup data from the previous page
    if (location.state?.signupData) {
      setFormData(prevData => ({ ...prevData, ...location.state.signupData }));
    }
  }, [location.state]);

  const nextStep = () => {
    // if (step === 'location') setStep('vehicle');
     if (step === 'vehicle') setStep('welcome');
  };

  return (
    <>
      {/* {step === 'location' && (
        <Location formData={formData} setFormData={setFormData} onNext={nextStep} />
      )} */}
      {step === 'vehicle' && (
        <Vehicle formData={formData} setFormData={setFormData} onNext={nextStep} />
      )}
      {step === 'welcome' && <Welcome formData={formData} />}
    </>
  );
};

export default SignUpFlow;
