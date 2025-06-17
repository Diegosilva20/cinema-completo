import { useEffect } from 'react';

function AlertMessage({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!message) return null;

  return (
    <div
      className={`alert alert-${type} mt-3 animate__animated animate__fadeIn`}
      role="alert"
      style={{ position: 'fixed', top: '80px', right: '20px', zIndex: 2000, minWidth: '300px' }}
    >
      <i className={`bi ${type === 'success' ? 'bi-check-circle' : 'bi-exclamation-circle'} me-2`}></i>
      {message}
    </div>
  );
}

export default AlertMessage;    