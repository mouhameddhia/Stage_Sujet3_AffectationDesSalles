import React from 'react';
import './ErrorMessage.css';

const ErrorMessage = ({ message, onClose, type = 'error' }) => {
  if (!message) return null;

  return (
    <div className={`error-message error-${type}`}>
      <div className="error-content">
        <span className="error-icon">
          {type === 'error' ? '⚠️' : type === 'warning' ? '⚠️' : 'ℹ️'}
        </span>
        <span className="error-text">{message}</span>
      </div>
      {onClose && (
        <button className="error-close" onClick={onClose}>
          ×
        </button>
      )}
    </div>
  );
};

export default ErrorMessage; 