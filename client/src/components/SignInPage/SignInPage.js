import React, { useState, useEffect } from 'react';
import '../../App.css';
import './SignInPage.css';
import Footer from '../Footer/Footer';
import NavBar from '../NavBar/NavBar_NotSignedIn/NavBar';
import SignUpModal from '../SignUpModal/SignUpModal';
import NotificationModal from '../NotificationModal/NotificationModal'; 
import { useNavigate } from 'react-router-dom';

const SignInPage = ({ toggleDarkMode, isDarkMode }) => {
    const navigate = useNavigate();
    const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [notificationMessage, setNotificationMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [showNotification, setShowNotification] = useState(false);

    const toggleSignUpModal = () => {
        setIsSignUpModalOpen(!isSignUpModalOpen);
    };

    useEffect(() => {
        document.title = 'Sign In';
    }, []);

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
                setNotificationMessage(data.message);
                setErrorMessage('');
                setIsSuccess(true);
                setShowNotification(true);
            } else {
                setErrorMessage('Failed to sign in. Please check your credentials.');
                setNotificationMessage('Failed to sign in. Please check your credentials.');
                setIsSuccess(false);
                setShowNotification(true);
            }
        } catch (error) {
            setErrorMessage('An error occurred while trying to sign in.');
            setNotificationMessage('An error occurred while trying to sign in.');
            setIsSuccess(false);
            setShowNotification(true);
        }
    };

    const handleNotificationClose = () => {
        setShowNotification(false);
        if (isSuccess) {
            navigate('/dashboard');
        }
    };

    return (
        <section id='SignInPage' className={isDarkMode ? 'dark-mode' : ''}>
            <NavBar toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} toggleSignUpModal={toggleSignUpModal} />

            <SignUpModal isOpen={isSignUpModalOpen} onClose={toggleSignUpModal} isDarkMode={isDarkMode} />

            <div className='SignInPage_hero'>
                <h1 className='hero_title'>Sign In</h1>

                <div className={`signin_modal-content modal-content ${isDarkMode ? 'dark-mode' : ''}`}>
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
                        {isSuccess && <p className="success-message">{notificationMessage}</p>}

                        <button type="submit" className="signin-button">Sign In</button>
                    </form>
                    <p className="signup-prompt">
                        Don't have an account? <a href="/signup" className="signup-link">Sign up here</a>.
                    </p>
                </div>
            </div>

            <Footer />

            <NotificationModal
                isOpen={showNotification}
                message={notificationMessage}
                isSuccess={isSuccess}
                onClose={handleNotificationClose}
                isDarkMode={isDarkMode}
                okButtonText="OK"
            />
        </section>
    );
}

export default SignInPage;
