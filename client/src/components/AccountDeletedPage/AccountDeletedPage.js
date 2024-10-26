import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './AccountDeletedPage.css';
import NavBarNotSignedIn from '../NavBar/NavBar_NotSignedIn/NavBar';

const AccountDeletedPage = ({ toggleDarkMode, isDarkMode }) => {
    useEffect(() => {
        document.title = 'Account Deleted';
    }, []);

    return (
        <section id='account-deleted-container' className={isDarkMode ? 'dark-mode' : ''}>
            <NavBarNotSignedIn
                toggleDarkMode={toggleDarkMode}
                isDarkMode={isDarkMode}
            />
            <h1 className='account-deleted-container-header'>Account Deleted</h1>
            <p>Your account has been successfully deleted. We're sorry to see you go.</p>
            <p>If this was a mistake, please reach out to our support team.</p>
            <Link to="/" className="home-link">Return to Home</Link>
        </section>
    );
};

export default AccountDeletedPage;
