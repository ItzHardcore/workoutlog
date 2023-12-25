// Register.js
import React, { useState } from 'react';
import RegistrationForm from './RegistrationForm';

function Register() {
  const [errorMessage, setErrorMessage] = useState('');
  const [buttonHidden, setButtonHidden] = useState(false);

  const handleRegister = (message) => {
    // Handle success or additional logic for registering
    console.log(message);
  };

  return (
    <div className="container w-50">
      <div className="row justify-content-center">
        <div className="col-md-6 mt-5">
          <h1 className="text-center">Register</h1>

          {/* Reuse the RegistrationForm component */}
          <RegistrationForm onSubmit={handleRegister}
            isButtonHidden={buttonHidden}
            errorMessage={errorMessage}
            setErrorMessage={setErrorMessage}
            setIsButtonHidden={setButtonHidden} />
        </div>
      </div>
    </div>
  );
}

export default Register;
