import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ size = 'medium', message = 'Chargement...' }) => {
  return (
    <div className="loading-container">
      <div className={`spinner spinner-${size}`}>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
      </div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
};

export default LoadingSpinner; 