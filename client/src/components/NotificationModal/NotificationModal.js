import React from 'react';
import './NotificationModal.css';

const NotificationModal = ({ isOpen, message, isSuccess, onClose, isDarkMode }) => {
  if (!isOpen) return null;

  return (
    <div className="notification-modal-overlay">
      <div className={`notification-modal-content ${isDarkMode ? 'dark-mode' : ''}`}>
        {/* <button className="close-button" onClick={onClose}>&times;</button> */}
        <h2 className={`notification-title ${isSuccess ? 'success' : 'failure'}`}>
          {isSuccess ? 'Success' : 'Error'}
        </h2>
        <p className="notification-message">{message}</p>
        <button className="ok-button" onClick={onClose}>OK</button>
      </div>
    </div>
  );
};

export default NotificationModal;
