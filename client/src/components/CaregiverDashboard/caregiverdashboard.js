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
    const [patients, setPatients] = useState([
        {
            _id: '1',
            firstname: 'John',
            lastname: 'Doe',
            email: 'john.doe@example.com',
            DOB: '1985-03-15',
            insurance: 'Blue Cross Blue Shield'
        },
        {
            _id: '2',
            firstname: 'Jane',
            lastname: 'Smith',
            email: 'jane.smith@example.com',
            DOB: '1992-07-22',
            insurance: 'Aetna'
        },
        {
            _id: '3',
            firstname: 'Robert',
            lastname: 'Johnson',
            email: 'robert.j@example.com',
            DOB: '1978-11-30',
            insurance: 'UnitedHealthcare'
        },
        {
            _id: '4',
            firstname: 'Maria',
            lastname: 'Garcia',
            email: 'maria.g@example.com',
            DOB: '1990-05-18',
            insurance: 'Cigna'
        },
        {
            _id: '5',
            firstname: 'David',
            lastname: 'Williams',
            email: 'david.w@example.com',
            DOB: '1988-09-25',
            insurance: 'Medicare'
        }
    ]);
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

    // Simulating adding a patient with fake data
    const addPatient = async (e) => {
        e.preventDefault();
        if (newPatientEmail) {
            // Generate fake data for the new patient
            const newPatient = {
                _id: `${patients.length + 1}`,
                firstname: `Patient ${patients.length + 1}`,
                lastname: 'Test',
                email: newPatientEmail,
                DOB: '1995-01-01',
                insurance: 'Sample Insurance'
            };

            setPatients(prevPatients => [...prevPatients, newPatient]);
            setNewPatientEmail('');
        }
    };

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
                <h2>Find the ones who care! </h2>
            </div>

            <div className='DashboardPage_content'>
                <div className="patients-section">
                    <h3>Patients you are treating:</h3>
                    <div className="patients-list">
                        {patients.map((patient) => (
                            <div key={patient._id} className="patient-card">
                                <h4>{patient.firstname} {patient.lastname}</h4>
                                <p><strong>Email:</strong> {patient.email}</p>
                                <p><strong>Date of Birth:</strong> {patient.DOB}</p>
                                <p><strong>Insurance:</strong> {patient.insurance}</p>
                            </div>
                        ))}
                    </div>
                    <form onSubmit={addPatient} className="add-patient-form">
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
                
                <div className="map-section">
                    <MapComponent />
                </div>
            </div>
            <Footer />
        </section>
    );
};

export default CaregiverDashboardPage;