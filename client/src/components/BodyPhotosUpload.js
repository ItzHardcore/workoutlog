import React, { useState } from 'react';
import { Camera } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const BodyPhotosUpload = ({ token }) => {
  const [step, setStep] = useState(1);
  const [photoStep1, setPhotoStep1] = useState(null);
  const [photoStep2, setPhotoStep2] = useState(null);
  const [photoStep3, setPhotoStep3] = useState(null);
  const [photoStep4, setPhotoStep4] = useState(null);
  const [fileStep1, setFileStep1] = useState(null);
  const [fileStep2, setFileStep2] = useState(null);
  const [fileStep3, setFileStep3] = useState(null);
  const [fileStep4, setFileStep4] = useState(null);
  const [date, setDate] = useState(new Date());
  const [weight, setWeight] = useState('');
  const [showCamera, setShowCamera] = useState(false); // State to toggle camera display
  const [errorMessage, setErrorMessage] = useState('');
  const BASE_URL = require('./baseUrl');

  const handlePhotoCaptureStep = (dataUri, step) => {
    switch (step) {
      case 1:
        setPhotoStep1(dataUri);
        break;
      case 2:
        setPhotoStep2(dataUri);
        break;
      case 3:
        setPhotoStep3(dataUri);
        break;
      case 4:
        setPhotoStep4(dataUri);
        break;
      default:
        break;
    }
    setShowCamera(false); // Hide camera when photo is captured
  };

  const handleFileChangeStep = (e, step) => {
    const selectedFile = e.target.files[0];
    switch (step) {
      case 1:
        setFileStep1(selectedFile);
        // Preview the selected file
        const reader1 = new FileReader();
        reader1.onloadend = () => {
          setPhotoStep1(reader1.result);
        };
        reader1.readAsDataURL(selectedFile);
        break;
      case 2:
        setFileStep2(selectedFile);
        // Preview the selected file
        const reader2 = new FileReader();
        reader2.onloadend = () => {
          setPhotoStep2(reader2.result);
        };
        reader2.readAsDataURL(selectedFile);
        break;
      case 3:
        setFileStep3(selectedFile);
        // Preview the selected file
        const reader3 = new FileReader();
        reader3.onloadend = () => {
          setPhotoStep3(reader3.result);
        };
        reader3.readAsDataURL(selectedFile);
        break;
      case 4:
        setFileStep4(selectedFile);
        // Preview the selected file
        const reader4 = new FileReader();
        reader4.onloadend = () => {
          setPhotoStep4(reader4.result);
        };
        reader4.readAsDataURL(selectedFile);
        break;
      default:
        break;
    }
  };

  const handleTakePhoto = () => {
    setShowCamera(true); // Show camera when "Take Photo" button is clicked
  };

  const handleSubmit = async () => {
    // Move to the next step
    if (step < 4) {
      setStep(step + 1);
      return;
    }

    if ((!fileStep1 && !photoStep1) || (!fileStep2 && !photoStep2) || (!fileStep3 && !photoStep3) || (!fileStep4 && !photoStep4) || !weight) {
      setErrorMessage('Please select a file or capture a photo for all steps and fill weight');
      return;
    }

    try {
      setErrorMessage('');

      const formData = new FormData();
      handleAppendFileOrPhoto(formData, fileStep1, photoStep1, 'photoFileStep1');
      handleAppendFileOrPhoto(formData, fileStep2, photoStep2, 'photoFileStep2');
      handleAppendFileOrPhoto(formData, fileStep3, photoStep3, 'photoFileStep3');
      handleAppendFileOrPhoto(formData, fileStep4, photoStep4, 'photoFileStep4');
      formData.append('date', date.toISOString());
      formData.append('weight', weight);

      const response = await fetch(`${BASE_URL}/upload-body-photos`, {
        method: 'POST',
        headers: {
          'Authorization': `${token}`,
        },
        body: formData
      });
      if (!response.ok) {
        throw new Error('Failed to upload files');
      }
      //for (const pair of formData.entries()) {
      //  console.log(pair[0] + ', ' + pair[1]);
      //}
      alert('Files uploaded successfully');
    } catch (error) {
      console.error('Error uploading:', error);
      alert('Failed to upload');
    }
  };

  const handleAppendFileOrPhoto = (formData, file, photo, fieldName) => {
    if (file) {
      formData.append(fieldName, file);
    } else if (photo) {
      formData.append(fieldName, photo.split(',')[1]);
    }
  };

  const handleGoBack = () => {
    setStep(step - 1); // Go back to the previous step
  };

  return (
    <div>
      {step === 1 && (
        <div>
          <h2 className='mb-4'>Step 1: Upload a Front Photo</h2>
          {!showCamera && !photoStep1 && (
            <div>
              <input className='form-control mb-3' type="file" onChange={(e) => handleFileChangeStep(e, 1)} />
              <p>OR</p>
              <button className='btn btn-primary mb-3' onClick={handleTakePhoto}>Take Photo</button>
            </div>
          )}
          {(showCamera && !photoStep1) && (
            <div className='my-3'>
              <Camera
                idealResolution={{ width: 640, height: 480 }}
                isImageMirror={false}
                onTakePhoto={(dataUri) => handlePhotoCaptureStep(dataUri, 1)}
                imageType="jpg"
              />
            </div>
          )}
          {photoStep1 && (
            <div className='text-center'>
              <div className='d-inline-grid text-center mb-4'>
                <img src={photoStep1} alt="Preview" style={{ maxWidth: '100%', maxHeight: '300px' }} />
                <button className='btn btn-warning rounded-0' onClick={() => { setPhotoStep1(null) }}>Retake Photo</button>
              </div>
            </div>
          )}
        </div>
      )}
      {step === 2 && (
        <div>
          <h2 className='mb-4'>Step 2:  Upload a Back Photo</h2>
          {!showCamera && !photoStep2 && (
            <div>
              <input className='form-control mb-3' type="file" onChange={(e) => handleFileChangeStep(e, 2)} />
              <p>OR</p>
              <button className='btn btn-primary mb-3' onClick={handleTakePhoto}>Take Photo</button>
            </div>
          )}
          {(showCamera && !photoStep2) && (
            <div className='my-3'>
              <Camera
                idealResolution={{ width: 640, height: 480 }}
                isImageMirror={false}
                onTakePhoto={(dataUri) => handlePhotoCaptureStep(dataUri, 2)}
                imageType="jpg"
              />
            </div>
          )}
          {photoStep2 && (
            <div className='text-center'>
              <div className='d-inline-grid text-center mb-4'>
                <img src={photoStep2} alt="Preview" style={{ maxWidth: '100%', maxHeight: '300px' }} />
                <button className='btn btn-warning rounded-0' onClick={() => { setPhotoStep2(null) }}>Retake Photo</button>
              </div>
            </div>
          )}
        </div>
      )}
      {step === 3 && (
        <div>
          <h2 className='mb-4'>Step 3:  Upload a Left Photo</h2>
          {!showCamera && !photoStep3 && (
            <div>
              <input className='form-control mb-3' type="file" onChange={(e) => handleFileChangeStep(e, 3)} />
              <p>OR</p>
              <button className='btn btn-primary mb-3' onClick={handleTakePhoto}>Take Photo</button>
            </div>
          )}
          {(showCamera && !photoStep3) && (
            <div className='my-3'>
              <Camera
                idealResolution={{ width: 640, height: 480 }}
                isImageMirror={false}
                onTakePhoto={(dataUri) => handlePhotoCaptureStep(dataUri, 3)}
                imageType="jpg"
              />
            </div>
          )}
          {photoStep3 && (
            <div className='text-center'>
              <div className='d-inline-grid text-center mb-4'>
                <img src={photoStep3} alt="Preview" style={{ maxWidth: '100%', maxHeight: '300px' }} />
                <button className='btn btn-warning rounded-0' onClick={() => { setPhotoStep3(null) }}>Retake Photo</button>
              </div>
            </div>
          )}
        </div>
      )}
      {step === 4 && (
        <div>
          <h2 className='mb-4'>Step 4:  Upload a Right Photo</h2>
          {!showCamera && !photoStep4 && (
            <div>
              <input className='form-control mb-3' type="file" onChange={(e) => handleFileChangeStep(e, 4)} />
              <p>OR</p>
              <button className='btn btn-primary mb-3' onClick={handleTakePhoto}>Take Photo</button>
            </div>
          )}
          {(showCamera && !photoStep4) && (
            <div className='my-3'>
              <Camera
                idealResolution={{ width: 640, height: 480 }}
                isImageMirror={false}
                onTakePhoto={(dataUri) => handlePhotoCaptureStep(dataUri, 4)}
                imageType="jpg"
              />
            </div>
          )}
          {photoStep4 && (
            <div className='text-center'>
              <div className='d-inline-grid text-center mb-4'>
                <img src={photoStep4} alt="Preview" style={{ maxWidth: '100%', maxHeight: '300px' }} />
                <button className='btn btn-warning rounded-0' onClick={() => { setPhotoStep4(null) }}>Retake Photo</button>
              </div>
            </div>
          )}
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
      {errorMessage && (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      )}
      <button className='btn btn-secondary me-2' onClick={handleGoBack} disabled={step === 1}>Go Back</button>
      <button className='btn btn-primary' onClick={handleSubmit}>
        {step === 4 ? 'Submit' : 'Next'}
      </button>
    </div>
  );
};

export default BodyPhotosUpload;
