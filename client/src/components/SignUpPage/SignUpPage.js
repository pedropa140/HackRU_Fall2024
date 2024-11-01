import React, { useState, useEffect } from 'react';
import '../../App.css';
import { Link } from 'react-router-dom';
import './SignUpPage.css';
import NavBar from '../NavBar/NavBar_NotSignedIn/NavBar';
import SignInModal from '../SignInModal/SignInModal';
import Footer from '../Footer/Footer';
import NotificationModal from '../NotificationModal/NotificationModal';
import { useNavigate } from 'react-router-dom';

const SignUpPage = ({ toggleDarkMode, isDarkMode }) => {
    const navigate = useNavigate();
    const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
    const [isAgreed, setIsAgreed] = useState(false);
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        dob: '',
        password: '',
        reenterpassword: '',
        insurancename: '',
        policy_number: '',
        group_number: ''
    });
    const [passwordError, setPasswordError] = useState('');
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const toggleSignInModal = () => setIsSignInModalOpen(!isSignInModalOpen);

    useEffect(() => { document.title = 'Sign Up'; }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password !== formData.reenterpassword) {
            setPasswordError('Password Does Not Match');
            return;
        }

        setPasswordError('');
        
        fetch('/api/patientSignup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })
            .then(response => response.json())
            .then(data => {
                setNotificationMessage(data.message);
                setIsSuccess(data.message === "User registered successfully!");
                setShowNotification(true);
            })
            .catch(error => {
                setNotificationMessage('An error occurred while trying to sign up.');
                setIsSuccess(false);
                setShowNotification(true);
                console.error('Error:', error);
            });
    };

    const handleNotificationClose = () => {
        setShowNotification(false);
        if (isSuccess) navigate('/signin');
    };

    return (
        <section id='SignUpPage' className={isDarkMode ? 'dark-mode' : ''}>
            <NavBar toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} toggleSignInModal={toggleSignInModal} />
            <SignInModal isOpen={isSignInModalOpen} onClose={toggleSignInModal} isDarkMode={isDarkMode} />

            <div className='SignUpPage_hero'>
                <h1 className='hero_title'>Sign Up</h1>
                <div className={`signup_modal-content modal-content ${isDarkMode ? 'dark-mode' : ''}`}>
                    <form className="signup-form" onSubmit={handleSubmit}>
                        {/* Form Fields */}
                        <label htmlFor="firstname">First Name<span style={{ color: "red" }}> *</span></label>
                        <input type="text" id="firstname" value={formData.firstname} onChange={handleChange} placeholder="Enter your first name" required />
                        <label htmlFor="lastname">Last Name<span style={{ color: "red" }}> *</span></label>
                        <input type="text" id="lastname" value={formData.lastname} onChange={handleChange} placeholder="Enter your last name" required />
                        <label htmlFor="email">Email<span style={{ color: "red" }}> *</span></label>
                        <input type="email" id="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" required />
                        <label htmlFor="dob">Date of Birth<span style={{ color: "red" }}> *</span></label>
                        <input type="date" id="dob" value={formData.dob} onChange={handleChange} required />
                        <label htmlFor="password">Password<span style={{ color: "red" }}> *</span></label>
                        <input type="password" id="password" value={formData.password} onChange={handleChange} placeholder="Enter your password" required />
                        <label htmlFor="reenterpassword">Re-Enter Password<span style={{ color: "red" }}> *</span></label>
                        <input type="password" id="reenterpassword" value={formData.reenterpassword} onChange={handleChange} placeholder="Re-enter your password" required />

                        {/* Insurance Fields */}
                        <label htmlFor="insurancename">Insurance Name<span style={{ color: "red" }}> *</span></label>
                        <input type="text" id="insurancename" value={formData.insurancename} onChange={handleChange} placeholder="Enter your insurance name" required />
                        <label htmlFor="policy_number">Policy Number<span style={{ color: "red" }}> *</span></label>
                        <input type="text" id="policy_number" value={formData.policy_number} onChange={handleChange} placeholder="Enter your policy number" required />
                        <label htmlFor="group_number">Group Number<span style={{ color: "red" }}> *</span></label>
                        <input type="text" id="group_number" value={formData.group_number} onChange={handleChange} placeholder="Enter your group number" required />

                        <div className="privacy-policy-checkbox">
                            <input type="checkbox" id="privacyPolicy" checked={isAgreed} onChange={() => setIsAgreed(!isAgreed)} required />
                            <label htmlFor="privacyPolicy">
                                I agree to the <a href="/privacypolicy" target="_blank" rel="noopener noreferrer">Privacy Policy</a> and <a href="/termsofservice" target="_blank" rel="noopener noreferrer">Terms of Service</a><span style={{ color: "red" }}> *</span>
                            </label>
                        </div>
                        {passwordError && <p style={{ color: 'red', textAlign: 'center' }}>{passwordError}</p>}

                        <button type="submit" className="signup-button">Sign Up</button>
                    </form>
                    <p className="signup-prompt">Already have an account? <Link to="/signin" className="signup-link">Sign in here</Link>.</p>
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
};

export default SignUpPage;
