// RegistrationForm.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PasswordStrengthMeter from './PasswordStrengthMeter';

function RegistrationForm({ onSubmit, isButtonHidden, errorMessage, setErrorMessage, setIsButtonHidden }) {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [timer, setTimer] = useState(5);
    const navigate = useNavigate();

    useEffect(() => {
        let timerInterval;

        if (timer > 0 && isSubmitting) {
            timerInterval = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        }

        if (timer === 0) {
            setIsSubmitting(false);
        }

        return () => {
            clearInterval(timerInterval);
        };
    }, [timer, isSubmitting]);

    const validateForm = () => {
        if (!name || !username || !email || !phoneNumber || !password || !repeatPassword || termsAccepted === undefined) {
            setErrorMessage('All fields are required');
            return false;
        }

        if (!/^\d+$/.test(phoneNumber)) {
            setErrorMessage('Phone number must contain only numbers');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setErrorMessage('Invalid email format');
            return false;
        }

        const upperCaseRegex = /[A-Z]/;
        const symbolRegex = /[!@#$%^&*(),.?":{}|<>]/;
        const numberRegex = /[0-9]/;

        if (!upperCaseRegex.test(password) || !symbolRegex.test(password) || !numberRegex.test(password) || password.length <= 8) {
            setErrorMessage('Password needs 1 uppercase letter, 1 symbol, 1 number, and length > 8 characters.');
            return false;
        }

        if (password !== repeatPassword) {
            setErrorMessage('Passwords do not match');
            return false;
        }

        return true;
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        if (!termsAccepted) {
            setErrorMessage('Please accept the Terms of Service to register.');
            return;
        }

        if (isButtonHidden) {
            setErrorMessage('Please wait 30 minutes before trying again.');
            return;
        }

        if (isSubmitting) {
            setErrorMessage(`Please wait ${timer} seconds before clicking again.`);
            return;
        }

        try {
            setIsSubmitting(true);
            setTimer(5);

            const response = await fetch('http://localhost:3001/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    username,
                    email,
                    phoneNumber,
                    password,
                    repeatPassword,
                    termsAccepted,
                }),
            });

            if (!response.ok) {
                console.log(response);
                if (response.status === 429) {
                    const errorData = await response.json();
                    setIsButtonHidden(true);
                    setErrorMessage(errorData.error);
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Registration failed');
                }
            } else {
                navigate('/login');
            }

        } catch (error) {
            console.error('Registration failed:', error);
            setErrorMessage(error.message || 'Registration failed');
        }
    };

    return (<>
        <form onSubmit={handleRegister} onChange={() => setErrorMessage('')}>
            <div className="mb-3">
                <label htmlFor="name" className="form-label">
                    Name:
                </label>
                <input
                    type="text"
                    id="name"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div className="mb-3">
                <label htmlFor="username" className="form-label">
                    Username:
                </label>
                <input
                    type="text"
                    id="username"
                    className="form-control"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div className="mb-3">
                <label htmlFor="email" className="form-label">
                    Email:
                </label>
                <input
                    type="email"
                    id="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div className="mb-3">
                <label htmlFor="phoneNumber" className="form-label">
                    Phone Number:
                </label>
                <input
                    type="tel"
                    id="phoneNumber"
                    className="form-control"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                />
            </div>
            <div className="mb-3">
                <label htmlFor="password" className="form-label">
                    Password:
                </label>
                <input
                    type="password"
                    id="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <PasswordStrengthMeter password={password} />
            <div className="mb-3">
                <label htmlFor="repeatPassword" className="form-label">
                    Repeat Password:
                </label>
                <input
                    type="password"
                    id="repeatPassword"
                    className="form-control"
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                />
            </div>
            <div className="mb-3 form-check">
                <input
                    type="checkbox"
                    className="form-check-input"
                    id="termsAccepted"
                    checked={termsAccepted}
                    onChange={() => {
                        setTermsAccepted(!termsAccepted);
                    }}
                />
                <label className="form-check-label" htmlFor="termsAccepted">
                    I accept the <a href='/terms'>Terms of Service</a>
                </label>
            </div>

            {/* Display error message if it exists */}
            {errorMessage && (
                <div className="alert alert-danger" role="alert">
                    {errorMessage}
                </div>
            )}

            {/* Conditionally render the button based on isButtonHidden */}
            {!isButtonHidden && (
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? `Wait ${timer} seconds` : 'Register'}
                </button>
            )}
        </form>
        <p className="mt-3 text-center">Already a member? <Link to="/login">Login</Link></p>
    </>
    );
}

export default RegistrationForm;
