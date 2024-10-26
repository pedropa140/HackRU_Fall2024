import React, { useState } from 'react';
import './ErrorPage.css';
import NavBar from '../NavBar/NavBar_SignedIn/NavBar';

const ErrorPage = ({ toggleDarkMode, isDarkMode, message, onRetry }) => {
    const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
    const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);

    const toggleSignInModal = () => {
        setIsSignInModalOpen(!isSignInModalOpen);
    };

    const toggleSignUpModal = () => {
        setIsSignUpModalOpen(!isSignUpModalOpen);
    };
    return (
        <section id="Error" className={isDarkMode ? 'dark-mode' : ''}>
            <NavBar toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode}
                toggleSignInModal={toggleSignInModal}
                toggleSignUpModal={toggleSignUpModal} />
            <h1>Oops! Something went wrong</h1>
            <p>{message || "We're having trouble loading the page right now."}</p>
            {onRetry && (
                <button onClick={onRetry} className="retry-button">
                    Try Again
                </button>
            )}
        </section>
    );
};

export default ErrorPage;