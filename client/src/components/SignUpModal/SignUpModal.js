import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignUpModal.css';
import NotificationModal from '../NotificationModal/NotificationModal';

const SignUpModal = ({ isOpen, onClose, isDarkMode }) => {
    const navigate = useNavigate();
    const [isAgreed, setIsAgreed] = useState(false);
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        birthday: '',
        password: '',
        reenterpassword: '',
        insurance_name: '',
        insurance_provider: '',
        insurance_groupNumber: ''
    });

    const [passwordError, setPasswordError] = useState('');
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        document.title = 'Sign Up';
    }, []);

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
        console.log(formData)

        fetch('/api/patientSignup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
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
        if (isSuccess) {
            navigate('/signin');
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="modal-overlay">
                <div className={`modal-content ${isDarkMode ? 'dark-mode' : ''}`}>
                    <button className="close-button" onClick={onClose}>&times;</button>
                    <h2 className="modal-title">Sign Up</h2>
                    <form className="signup-form" onSubmit={handleSubmit}>
                        <label htmlFor="firstname">First Name<span style={{ color: "red" }}> *</span></label>
                        <input type="text" id="firstname" value={formData.firstname} onChange={handleChange} placeholder="Enter your first name" required />

                        <label htmlFor="lastname">Last Name<span style={{ color: "red" }}> *</span></label>
                        <input type="text" id="lastname" value={formData.lastname} onChange={handleChange} placeholder="Enter your last name" required />

                        <label htmlFor="email">Email<span style={{ color: "red" }}> *</span></label>
                        <input type="email" id="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" required />
                        
                        {/* DATE OF BIRTH */}
                        <label for="birthday">Date of Birth:</label>
                        <input type="date" id="birthday" name="birthday" value={formData.birthday} onChange={handleChange}/>

                        <label htmlFor="password">Password<span style={{ color: "red" }}> *</span></label>
                        <input type="password" id="password" value={formData.password} onChange={handleChange} placeholder="Enter your password" required />
                        
                        <label htmlFor="reenterpassword">Re-Enter Password<span style={{ color: "red" }}> *</span></label>
                        <input type="password" id="reenterpassword" value={formData.reenterpassword} onChange={handleChange} placeholder="Re-enter your password" required />


                        {/* INSURANCE */}
                        {/* name, provider, groupnumber*/}

                        <label htmlFor="insurance_name">Insurance Name<span style={{ color: "red" }}> *</span></label>
                        <input type="text" id="insurance_name" value={formData.insurance_name} onChange={handleChange} placeholder="Enter your insurance name" required />

                        <label htmlFor="insurance_provider">Insurance Provider<span style={{ color: "red" }}> *</span></label>
                        <input type="text" id="insurance_provider" value={formData.insurance_provider} onChange={handleChange} placeholder="Enter your insurance provider" required />

                        <label htmlFor="insurance_groupNumber">Insurance Group Number<span style={{ color: "red" }}> *</span></label>
                        <input type="text" id="insurance_groupNumber" value={formData.insurance_groupNumber} onChange={handleChange} placeholder="Enter your group number" required />

                        <div className="privacy-policy-checkbox">
                            <input
                                type="checkbox"
                                id="privacyPolicy"
                                checked={isAgreed}
                                onChange={() => setIsAgreed(!isAgreed)}
                                required
                            />
                            <label htmlFor="privacyPolicy">
                                I agree to the <a href="/privacypolicy" target="_blank" rel="noopener noreferrer">Privacy Policy</a> and <a href="/termsofservice" target="_blank" rel="noopener noreferrer">Terms of Service</a><span style={{ color: "red" }}> *</span>
                            </label>
                        </div>

                        <p style={{ color: 'red', marginTop: '0px', marginBottom: '10px', fontSize: '10px', textAlign: 'center' }}>{passwordError}</p>

                        <button type="submit" className="signup-button">Sign Up</button>
                    </form>
                    <p className="signup-prompt">
                        Already have an account? <a href="/signin" className="signup-link">Sign in here</a>.
                    </p>
                </div>
            </div>
            <NotificationModal
                isOpen={showNotification}
                message={notificationMessage}
                isSuccess={isSuccess}
                onClose={handleNotificationClose}
                isDarkMode={isDarkMode}
                okButtonText="OK"
            />
        </>
    );
};

export default SignUpModal;
