import React from 'react';
import backgroundImage from '../images/backgroundImage.jpg';
import { useNavigate } from 'react-router-dom';

function LandingPage() {

  const navigate = useNavigate();

  return (
    <div className="container-fluid text-center mt-5 pt-5">
      <div className="row">
        <div className="col">
          <img
            src={backgroundImage} // Replace with your image URL
            className="img-fluid"
            alt="Workout"
          />
        </div>
      </div>
      <div className="row mt-3">
        <div className="col text-center">
          <h1>Welcome to Your Workout Logger</h1>
          <p className="lead">Track your progress and achieve your fitness goals!</p>
          <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>Get Started</button>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
