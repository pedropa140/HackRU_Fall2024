import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignInModal.css';
import NotificationModal from '../NotificationModal/NotificationModal';

const SignInModal = ({ isOpen, onClose, isDarkMode }) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showNotification, setShowNotification] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            email: email,
            password: password,
        };

        try {
            const response = await fetch('/api/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const data = await response.json();
                sessionStorage.setItem('userEmail', email);
                setSuccessMessage(data.message);
                setErrorMessage('');
                setShowNotification(true);
            } else {
                setErrorMessage('Failed to sign in. Please check your credentials.');
                setSuccessMessage('');
                setShowNotification(true);
            }
        } catch (error) {
            setErrorMessage('An error occurred while trying to sign in.');
            setSuccessMessage('');
            setShowNotification(true);
        }
    };

    const handleNotificationClose = () => {
        setShowNotification(false);
        if (successMessage) {
            navigate('/dashboard');
        }
    };

    return (
        <>
            <div className="modal-overlay">
                <div className={`modal-content ${isDarkMode ? 'dark-mode' : ''}`}>
                    <button className="close-button" onClick={onClose}>&times;</button>
                    <h2 className="modal-title">Sign In</h2>
                    <form className="signin-form" onSubmit={handleSubmit}>
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                        />
                        {errorMessage && <p className="error-message">{errorMessage}</p>}
                        {successMessage && <p className="success-message">{successMessage}</p>}
                        <button type="submit" className="signin-button">Sign In</button>
                    </form>
                    <p className="signup-prompt">
                        Don't have an account? <a href="/signup" className="signup-link">Sign up here</a>.
                    </p>
                </div>
            </div>
            <NotificationModal
                isOpen={showNotification}
                message={successMessage || errorMessage}
                isSuccess={!!successMessage}
                onClose={handleNotificationClose}
                isDarkMode={isDarkMode}
                okButtonText="OK"
            />
        </>
    );
};

export default SignInModal;
