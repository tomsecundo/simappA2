import React from "react";

function ErrorBanner({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="alert alert-danger d-flex justify-content-between align-items-center">
      <span>{message}</span>
      <button onClick={onClose} className="btn-close"></button>
    </div>
  );
}

export default ErrorBanner;
