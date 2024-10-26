import React from 'react';
import './FeedbackModal.css';

const FeedbackModal = ({ message, onClose, isDarkMode }) => {
  return (
    <div className={isDarkMode ? 'feedback-overlay dark-mode' : 'feedback-overlay'}>
      <div className="feedback-content">
        <p>{message}</p>
        <button onClick={onClose}>OK</button>
      </div>
    </div>
  );
};

export default FeedbackModal;
