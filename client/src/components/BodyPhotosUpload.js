import React, { useState } from 'react';
import { Camera } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const BodyPhotosUpload = ({ token }) => {
  const [step, setStep] = useState(1);
  const [photoStep1, setPhotoStep1] = useState(null);
  const [file, setFile] = useState(null);
  const [date, setDate] = useState(new Date());
  const [weight, setWeight] = useState('');
  const [showCamera, setShowCamera] = useState(false); // State to toggle camera display

  const handlePhotoCaptureStep1 = (dataUri) => {
    setPhotoStep1(dataUri);
    setShowCamera(false); // Hide camera when photo is captured
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    // Preview the selected file
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoStep1(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleTakePhoto = () => {
    setShowCamera(true); // Show camera when "Take Photo" button is clicked
  };

  const handleSubmit = async () => {
    if (!file && !photoStep1) {
      alert('Please select a file or capture a photo');
      return;
    }

    try {
      // Handle file upload
      if (file) {
        const formData = new FormData();
        formData.append('photoFile', file);
        formData.append('date', date.toISOString()); // Convert date to ISO string
        formData.append('weight', weight); // Include weight

        const response = await fetch('http://localhost:3001/upload-body-photo', {
          method: 'POST',
          headers: {
            'Authorization': `${token}`,
          },
          body: formData
        });

        if (!response.ok) {
          throw new Error('Failed to upload file');
        }

        alert('File uploaded successfully');
      }

      // Handle base64 data upload
      if (photoStep1 && !file) {
        const base64Data = photoStep1.split(',')[1];

        const response = await fetch('http://localhost:3001/upload-body-photo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}`,
          },
          body: JSON.stringify({ photo: base64Data, date: date.toISOString(), weight: weight }) // Include date and weight in JSON
        });

        if (!response.ok) {
          throw new Error('Failed to upload photo');
        }

        alert('Photo uploaded successfully');
      }
    } catch (error) {
      console.error('Error uploading:', error);
      alert('Failed to upload');
    }
  };

  return (
    <div>
      {step === 1 && (
        <div>
          <h2 className='mb-4'>Step 1: Upload a Photo or Take a Photo</h2>
          {!showCamera && !photoStep1 && (
            <div>
              <input className='form-control mb-3' type="file" onChange={handleFileChange} />
              <p>OR</p>
              <button className='btn btn-primary mb-3' onClick={handleTakePhoto}>Take Photo</button>
            </div>
          )}
          {(showCamera && !photoStep1) && (
            <div className='my-3'>
              <Camera
                idealResolution={{ width: 640, height: 480 }}
                isImageMirror={false}
                onTakePhoto={(dataUri) => handlePhotoCaptureStep1(dataUri)}
                imageType="jpg"
              />
            </div>
          )}
          {photoStep1 && (
            <div className='text-center'>
              <div className='d-inline-grid text-center mb-4'>
                <img src={photoStep1} alt="Preview" style={{ maxWidth: '100%', maxHeight: '300px' }}/>
                <button className='btn btn-warning rounded-0' onClick={() => { setPhotoStep1(null)}}>Retake Photo</button>
              </div>
            </div>

          )}
          <div className='row mb-3'>
            <div className='col mb-3 d-flex'>
              <label className='align-content-center me-2' >Weight:</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="form-control"
              />
            </div>
            <div className='col mb-3'>
              <label className='me-2'>Date:</label>
              <DatePicker
                id="date"
                selected={date}
                dateFormat="dd/MM/yyyy"
                onChange={(selectedDate) => setDate(selectedDate)}
                className="form-control"
              />
            </div>
          </div>
          <button className='btn btn-primary' onClick={handleSubmit}>Submit</button> {/* Submit after photo is captured */}
        </div>
      )}
    </div>
  );
};

export default BodyPhotosUpload;
