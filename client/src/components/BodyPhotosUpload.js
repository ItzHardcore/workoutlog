import React, { useState } from 'react';
import { Camera } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';

const BodyPhotosUpload = ({ token }) => { // Destructuring token from props
  const [step, setStep] = useState(1);
  const [photoStep1, setPhotoStep1] = useState(null);
  const [photoStep2, setPhotoStep2] = useState(null);

  const handlePhotoCaptureStep1 = (dataUri) => {
    setPhotoStep1(dataUri);
  };

  const handlePhotoCaptureStep2 = (dataUri) => {
    setPhotoStep2(dataUri);
  };

  const handleStepChange = () => {
    setStep(step + 1);
  };

  const handleSubmit = async () => {
    // Check if both photos are captured
    if (!photoStep1 || !photoStep2) {
      console.error('Both photos are required');
      return;
    }
  
    // Extract base64 data from data URI
    const base64Data1 = photoStep1.split(',')[1];
    const base64Data2 = photoStep2.split(',')[1];
  
    // Send both photos to backend
    try {
      const response = await fetch('http://localhost:3001/upload-body-photos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Assuming token is your JWT token
        },
        body: JSON.stringify({ photoStep1: base64Data1, photoStep2: base64Data2 })
      });
      // Handle response as needed
    } catch (error) {
      console.error('Error uploading photos:', error);
    }
  };
  

  return (
    <div>
      {step === 1 && (
        <div>
          <h2>Step 1: Capture Photo</h2>
          <Camera
            idealResolution={{ width: 640, height: 480 }}
            isImageMirror={false}
            onTakePhoto={(dataUri) => handlePhotoCaptureStep1(dataUri)}
          />
          <button onClick={handleStepChange}>Next</button>
        </div>
      )}
      {step === 2 && (
        <div>
          <h2>Step 2: Capture Another Photo</h2>
          <Camera
            idealResolution={{ width: 640, height: 480 }}
            isImageMirror={false}
            onTakePhoto={(dataUri) => handlePhotoCaptureStep2(dataUri)}
          />
          <button onClick={handleSubmit}>Submit</button>
        </div>
      )}
    </div>
  );
};

export default BodyPhotosUpload;
