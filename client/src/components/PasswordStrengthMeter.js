import React, { useState, useEffect } from 'react';

const PasswordStrengthMeter = ({ password }) => {
  const calculateStrength = () => {
    const patterns = [
      /[A-Z]/, // Uppercase letter
      /[!@#$%^&*(),.?":{}|<>]/, // Symbol
      /[0-9]/, // Number
      /.{9,}/, // Length greater than 8 characters
    ];

    return patterns.reduce((score, pattern) => (pattern.test(password) ? score + 1 : score), 0);
  };

  const strength = calculateStrength();

  const getProgressBarColor = () => {
    if (strength === 4) return 'bg-success';
    if (strength >= 2) return 'bg-warning';
    return 'bg-danger';
  };

  return (
    <div>
      <div className="progress">
        <div
          className={`progress-bar ${getProgressBarColor()}`}
          role="progressbar"
          style={{ width: `${25 * strength}%` }}
          aria-valuenow={25 * strength}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      <div className={`strength-message ${strength === 4 ? 'text-success' : strength >= 2 ? 'text-warning' : 'text-danger'}`}>
        {strength === 4 ? 'Strong Password!' : strength >= 2 ? 'Medium Password' : 'Password is too weak.'}
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;
