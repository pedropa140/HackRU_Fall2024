import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoggedOutPage.css';

const LoggedOutPage = ({isDarkMode }) => {
    const navigate = useNavigate();

    const handleRedirectHome = () => {
        navigate('/');
    };

    useEffect(() => {
        document.title = 'Logged Out';
      }, []);
    

    return (
        <section id="logged-out-container" className={isDarkMode ? 'dark-mode' : ''}>
            <h1>You Have Been Logged Out</h1>
            <p>Thank you for using our platform. We hope to see you again soon!</p>
            <button onClick={handleRedirectHome}>Go to Home Page</button>
        </section>
    );
};

export default LoggedOutPage;
