import React, { useState, useEffect, useCallback } from 'react';
import './ProfileModal.css';
import FeedbackModal from '../FeedbackModal/FeedbackModal';

const ProfileModal = ({ isOpen, onClose, userEmail, onSave, isDarkMode }) => {
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: userEmail || '',
        oldPassword: '',
        newPassword: '',
        retypeNewPassword: ''
    });


    const [isFeedbackOpen, setFeedbackOpen] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [isProfileExpanded, setProfileExpanded] = useState(false);
    const [isPasswordExpanded, setPasswordExpanded] = useState(false);

    const fetchUserInfo = useCallback(async () => {
        try {
            const response = await fetch(`/api/userinfo?email=${userEmail}`);
            if (response.ok) {
                const userData = await response.json();
    
                const createdDate = new Date(userData.datecreated);
                const formattedCreatedDate = createdDate.toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true,
                });
    
                setFormData((prevState) => ({
                    ...prevState,
                    firstname: userData.firstname,
                    lastname: userData.lastname,
                    email: userData.email,
                }));
            } else {
                console.log('User not found');
            }
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
    }, [userEmail]);
    

    useEffect(() => {
        if (isOpen) {
            fetchUserInfo();
        }
    }, [isOpen, fetchUserInfo]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            const response = await fetch('/api/updateuserinfo', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstname: formData.firstname,
                    lastname: formData.lastname,
                    email: formData.email,
                }),
            });

            if (response.ok) {
                setFeedbackMessage('User information updated successfully!');
                onSave(formData);
            } else {
                setFeedbackMessage('Failed to update user information.');
            }
        } catch (error) {
            setFeedbackMessage('Error updating user information.');
            console.error('Error updating user information:', error);
        }

        setFeedbackOpen(true);
    };

    const handlePasswordSave = async () => {
        if (formData.newPassword !== formData.retypeNewPassword) {
            setFeedbackMessage('New password and retype password do not match.');
            setFeedbackOpen(true);
            return;
        }

        try {
            const response = await fetch('/api/updatepassword', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    oldPassword: formData.oldPassword,
                    newPassword: formData.newPassword,
                }),
            });

            if (response.ok) {
                setFeedbackMessage('Password updated successfully!');
            } else {
                setFeedbackMessage('Failed to update password. Please check your old password.');
            }
        } catch (error) {
            setFeedbackMessage('Error updating password.');
            console.error('Error updating password:', error);
        }

        setFeedbackOpen(true);
    };

    const clearCookies = () => {
        document.cookie.split(";").forEach((cookie) => {
            const [name] = cookie.split("=");
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
        });
    };

    const closeFeedback = () => {
        setFeedbackOpen(false);
        clearCookies();
        window.location.reload();
        onClose();
    };

    if (!isOpen) return null;

    const toggleProfileExpansion = () => {
        setProfileExpanded(!isProfileExpanded);
        if (!isProfileExpanded) {
            setPasswordExpanded(false);
        }
    };

    const togglePasswordExpansion = () => {
        setPasswordExpanded(!isPasswordExpanded);
        if (!isPasswordExpanded) {
            setProfileExpanded(false);
        }
    };

    return (
        <>
            <div className={isDarkMode ? 'dark-mode modal-overlay' : 'modal-overlay'}>
                <div className="modal-content">
                    <div className="modal-header">
                        <h1>Profile:</h1>
                        <button className="close-button" onClick={onClose}>X</button>
                    </div>

                    <div className={isDarkMode ? 'dark-mode user-info-display' : 'user-info-display'}>
                        <h3>User Info:</h3>
                        <p><strong>Name:</strong> {formData.firstname} {formData.lastname}</p>
                        <p><strong>Email:</strong> {formData.email}</p>
                    </div>

                    <div className={isDarkMode ? 'dark-mode update-profile' : 'update-profile'}>
                        <h2>
                            Update Profile
                            <button onClick={toggleProfileExpansion}>
                                {isProfileExpanded ? '-' : '+'}
                            </button>
                        </h2>

                        {isProfileExpanded && (
                            <div className='update-profile-content'>
                                <label>
                                    First Name:
                                    <input
                                        type="text"
                                        name="firstname"
                                        placeholder={formData.firstname}
                                        value={formData.firstname}
                                        onChange={handleChange}
                                    />
                                </label>
                                <label>
                                    Last Name:
                                    <input
                                        type="text"
                                        name="lastname"
                                        placeholder={formData.lastname}
                                        value={formData.lastname}
                                        onChange={handleChange}
                                    />
                                </label>
                                <label>
                                    Email:
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder={formData.email}
                                        value={formData.email}
                                        onChange={handleChange}
                                        disabled
                                    />
                                </label>
                            </div>
                        )}

                        {isProfileExpanded && (
                            <div className="modal-actions">
                                <button onClick={onClose} className="cancel-button">Cancel</button>
                                <button onClick={handleSave} className="save-button">Save Profile</button>
                            </div>
                        )}
                    </div>

                    <div className={isDarkMode ? 'dark-mode password-update' : 'password-update'}>
                        <h2>
                            Update Password
                            <button onClick={togglePasswordExpansion}>
                                {isPasswordExpanded ? '-' : '+'}
                            </button>
                        </h2>

                        {isPasswordExpanded && (
                            <div className='update-profile-content'>
                                <label>
                                    Old Password:
                                    <input
                                        type="password"
                                        name="oldPassword"
                                        placeholder="Enter old password"
                                        value={formData.oldPassword}
                                        onChange={handleChange}
                                    />
                                </label>
                                <label>
                                    New Password:
                                    <input
                                        type="password"
                                        name="newPassword"
                                        placeholder="Enter new password"
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                    />
                                </label>
                                <label>
                                    Retype New Password:
                                    <input
                                        type="password"
                                        name="retypeNewPassword"
                                        placeholder="Retype new password"
                                        value={formData.retypeNewPassword}
                                        onChange={handleChange}
                                    />
                                </label>
                                <button onClick={handlePasswordSave}>Update Password</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {isFeedbackOpen && (
                <FeedbackModal
                    message={feedbackMessage}
                    onClose={closeFeedback}
                    isDarkMode={isDarkMode}
                />
            )}
        </>
    );
};

export default ProfileModal;
