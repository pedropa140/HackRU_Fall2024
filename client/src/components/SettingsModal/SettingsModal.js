import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SettingsModal.css';

const SettingsModal = ({ isOpen, onClose, userEmail, toggleTheme, currentTheme, isDarkMode, onDeleteAccount }) => {
    const [isConfirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleDeleteClick = () => {
        setConfirmDeleteOpen(true);
    };

    const confirmDeleteAccount = async () => {
        try {
            const response = await fetch(`/api/deleteaccount?email=${userEmail}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                sessionStorage.clear();
                navigate('/account-deleted', { state: { currentTheme } });
            } else {
                const errorData = await response.json();
                console.error(errorData.message);
            }
        } catch (error) {
            console.error("Error deleting account:", error);
        } finally {
            setConfirmDeleteOpen(false);
        }
    };

    const cancelDeleteAccount = () => {
        setConfirmDeleteOpen(false);
    };

    return (
        <div className="settings-modal-overlay">
            <div className={isDarkMode ? 'settings-modal dark-mode' : 'settings-modal'}>
                <h2>Settings</h2>

                <div className="settings-option">
                    <label htmlFor="themeToggle">Theme</label>
                    <select id="themeToggle" onChange={toggleTheme} value={currentTheme}>
                        <option value="light-mode">Light</option>
                        <option value="dark-mode">Dark</option>
                    </select>
                </div>

                <div className="settings-option">
                    <label>Delete Account</label>
                    <button onClick={handleDeleteClick} className="delete-account-btn">Delete</button>
                </div>

                {isConfirmDeleteOpen && (
                    <div className="confirm-delete">
                        <p>Are you sure you want to delete your account? This action cannot be undone.</p>
                        <button onClick={confirmDeleteAccount} className="confirm-delete-btn">Confirm</button>
                        <button onClick={cancelDeleteAccount} className="cancel-delete-btn">Cancel</button>
                    </div>
                )}

                <button onClick={onClose} className="close-modal-btn close-right">Close</button>
            </div>
        </div>

    );
};

export default SettingsModal;
