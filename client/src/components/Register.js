//Register.js
import React, { useState } from 'react';
import RegistrationForm from './RegistrationForm';

function Register() {
  const [errorMessage, setErrorMessage] = useState('');
  const [buttonHidden, setButtonHidden] = useState(false);

  return (
    <div className="container ">
      <div className="row justify-content-center">
        <div className="col-md-6 mt-5">
          <h1 className="text-center">Register</h1>

          <RegistrationForm
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
