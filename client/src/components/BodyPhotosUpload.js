import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function BodyPhotosUpload({token}) {
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [leftImage, setLeftImage] = useState(null);
  const [rightImage, setRightImage] = useState(null);
  const [weight, setWeight] = useState('');
  const [date, setDate] = useState(new Date());

  const handleImageDrop = (file, setter) => {
    setter(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('frontImage', frontImage);
    formData.append('backImage', backImage);
    formData.append('leftImage', leftImage);
    formData.append('rightImage', rightImage);
    formData.append('weight', weight);
    formData.append('date', date);

    try {
        await fetch('http://localhost:3001/upload-body-photos', {
            method: 'POST',
            body: formData,
            headers: {
              'Authorization': `${token}`,
            },
          });
          // Handle success
    } catch (error) {
      // Handle error
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Front Image:</label>
              <input type="file" className="form-control" onChange={(e) => handleImageDrop(e.target.files[0], setFrontImage)} />
            </div>
            <div className="form-group">
              <label>Back Image:</label>
              <input type="file" className="form-control" onChange={(e) => handleImageDrop(e.target.files[0], setBackImage)} />
            </div>
            <div className="form-group">
              <label>Left Image:</label>
              <input type="file" className="form-control" onChange={(e) => handleImageDrop(e.target.files[0], setLeftImage)} />
            </div>
            <div className="form-group">
              <label>Right Image:</label>
              <input type="file" className="form-control" onChange={(e) => handleImageDrop(e.target.files[0], setRightImage)} />
            </div>
            <div className="form-group">
              <label>Weight:</label>
              <input
                type="number"
                className="form-control"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Date:</label>
              <DatePicker className="form-control" selected={date} onChange={(date) => setDate(date)} />
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default BodyPhotosUpload;
