import React from 'react';
import './LogoutModal.css';

const LogoutModal = ({ isOpen, onClose, onConfirm, isDarkMode }) => {
  if (!isOpen) return null;

  return (
    <div className="logout-modal-overlay">
      <div className={`logout-modal-content ${isDarkMode ? 'dark-mode' : ''}`}>
        <h2>Confirm Logout</h2>
        <p>Are you sure you want to log out?</p>
        <div className="logout-modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={onConfirm} className="logout-confirm-logout">Yes, Logout</button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
