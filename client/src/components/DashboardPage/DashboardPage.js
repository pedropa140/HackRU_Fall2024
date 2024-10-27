import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardPage.css';
import NavBarNotSignedIn from '../NavBar/NavBar_NotSignedIn/NavBar';
import NavBarSignedIn from '../NavBar/NavBar_SignedIn/NavBar';
import Footer from '../Footer/Footer';
import LoadingPage from '../LoadingPage/LoadingPage';
import ErrorPage from '../ErrorPage/ErrorPage';
import MapComponent from '../MapComponent/MapComponent';

const DashboardPage = ({ toggleDarkMode, isDarkMode }) => {
    const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
    const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
    const isUserSignedIn = sessionStorage.getItem('userEmail') !== null;
    const navigate = useNavigate();

    const toggleSignInModal = () => {
        setIsSignInModalOpen(!isSignInModalOpen);
    };

    const toggleSignUpModal = () => {
        setIsSignUpModalOpen(!isSignUpModalOpen);
    };

    const userEmail = sessionStorage.getItem('userEmail');
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formattedTime, setFormattedTime] = useState('');

    const fetchUserInfo = useCallback(async () => {
        setLoading(true);
        setError(null);

        if (userEmail) {
            try {
                const response = await fetch(`/api/userinfo?email=${userEmail}`);
                if (!response.ok) {
                    throw new Error('User not found');
                }
                const data = await response.json();
                console.log(data);
                setUserInfo(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    }, [userEmail]);

    useEffect(() => {
        fetchUserInfo();
    }, [fetchUserInfo]);

    useEffect(() => {
        document.title = 'Dashboard';
    }, []);

    const updateFormattedTime = () => {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        setFormattedTime(`${hours}:${minutes}:${seconds}`);
    };

    useEffect(() => {
        updateFormattedTime();

        const intervalId = setInterval(updateFormattedTime, 1000);

        return () => clearInterval(intervalId);
    }, []);

    const now = new Date();
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const dayOfWeek = days[now.getDay()];
    const day = now.getDate();
    const month = months[now.getMonth()];
    const year = now.getFullYear();
    const formattedDate = `${dayOfWeek}, ${month} ${day}, ${year}`;

    if (loading) {
        return <LoadingPage toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
    }

    if (error) {
        return <ErrorPage message={error} onRetry={fetchUserInfo} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
    }

    return (
        <section id="DashboardPage" className={isDarkMode ? 'dark-mode' : ''}>
            {isUserSignedIn ? (
                <NavBarSignedIn
                    toggleDarkMode={toggleDarkMode}
                    isDarkMode={isDarkMode}
                    toggleSignInModal={toggleSignInModal}
                    toggleSignUpModal={toggleSignUpModal}
                />
            ) : (
                <NavBarNotSignedIn
                    toggleDarkMode={toggleDarkMode}
                    isDarkMode={isDarkMode}
                    toggleSignInModal={toggleSignInModal}
                    toggleSignUpModal={toggleSignUpModal}
                />
            )}

            <div className='DashboardPage_hero'>
                <h1 className='hero_title'>Hello, {userInfo ? userInfo.firstname : 'User'} {userInfo ? userInfo.lastname : 'User'}!</h1>
                <p className='hero_subtitle'>
                    Today is {formattedDate} {formattedTime}
                </p>

                <button className="button" onClick={() => navigate('/primary-provider')}>
                     <span>View Primary Provider</span>
                </button>
            </div>

            <div className='DashboardPage_content'><MapComponent /></div>
            <Footer />
        </section>
    );
};

export default DashboardPage;

