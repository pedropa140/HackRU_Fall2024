import React, { useState } from 'react';
import './LoadingPage.css';
import NavBar from '../NavBar/NavBar_SignedIn/NavBar';

const LoadingPage = ({ toggleDarkMode, isDarkMode }) => {
    const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
    const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);

    const toggleSignInModal = () => {
        setIsSignInModalOpen(!isSignInModalOpen);
    };

    const toggleSignUpModal = () => {
        setIsSignUpModalOpen(!isSignUpModalOpen);
    };

    return (
        <section id="Loading" className={isDarkMode ? 'dark-mode' : ''}>
            <NavBar toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode}
                toggleSignInModal={toggleSignInModal}
                toggleSignUpModal={toggleSignUpModal} />
            <div className="spinner"></div>
            <p>Loading, please wait...</p>
        </section>
    );
};

export default LoadingPage;
