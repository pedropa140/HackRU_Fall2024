import React, { useState, useEffect, useCallback } from 'react';
import './DashboardPage.css';
import NavBarNotSignedIn from '../NavBar/NavBar_NotSignedIn/NavBar';
import NavBarSignedIn from '../NavBar/NavBar_SignedIn/NavBar';
import Footer from '../Footer/Footer';
import LoadingPage from '../LoadingPage/LoadingPage';
import ErrorPage from '../ErrorPage/ErrorPage';
import MapComponent from '../MapComponent/MapComponent';

const CaregiverDashboardPage = ({ toggleDarkMode, isDarkMode }) => {
    const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
    const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
    const isUserSignedIn = sessionStorage.getItem('userEmail') !== null;

    const toggleSignInModal = () => {
        setIsSignInModalOpen(!isSignInModalOpen);
    };

    const toggleSignUpModal = () => {
        setIsSignUpModalOpen(!isSignUpModalOpen);
    };

    const userEmail = sessionStorage.getItem('userEmail');
    const [userInfo, setUserInfo] = useState(null);
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formattedTime, setFormattedTime] = useState('');
    const [newPatientEmail, setNewPatientEmail] = useState('');

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
                console.log(data)
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

    const fetchPatients = useCallback(async () => {
        if (userEmail) {
            try {
                const response = await fetch(`/api/getPatients?email=${userEmail}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch patients');
                }
                const data = await response.json();
                setPatients(data.patients);
            } catch (err) {
                setError(err.message);
            }
        }
    }, [userEmail]);

    const addPatient = async (e) => {
        e.preventDefault();
        if (newPatientEmail) {
            try {
                const response = await fetch('/api/addPatientToCaregiver', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        caregiver_email: "koolkusum10@gmail.com",
                        patient_email: newPatientEmail,
                    }),
                });
                if (!response.ok) {
                    throw new Error('Failed to add patient');
                }
                const data = await response.json();
                setPatients((prevPatients) => [...prevPatients, newPatientEmail]);
                setNewPatientEmail('');
            } catch (err) {
                setError(err.message);
            }
        }
    };

    useEffect(() => {
        fetchUserInfo();
        fetchPatients();
    }, [fetchUserInfo, fetchPatients]);

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
                <h2>Find the ones who care! </h2>
            </div>

            <div className='DashboardPage_content'>
                <MapComponent />
                <h3>Patients you are treating:</h3>
                <ul>
                    {patients.map((patientEmail, index) => (
                        <li key={index}>{patientEmail}</li>
                    ))}
                </ul>
                <form onSubmit={addPatient}>
                    <input
                        type="email"
                        value={newPatientEmail}
                        onChange={(e) => setNewPatientEmail(e.target.value)}
                        placeholder="Enter patient email"
                        required
                    />
                    <button type="submit">Add Patient</button>
                </form>
            </div>
            <Footer />
        </section>
    );
};

export default CaregiverDashboardPage;