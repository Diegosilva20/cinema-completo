function CustomButton({ label, type = 'button', onClick, className = 'btn btn-primary shadow-sm', icon }) {
  return (
    <button type={type} className={className} onClick={onClick}>
      {icon && <i className={`bi ${icon} me-2`}></i>}
      {label}
    </button>
  );
}

export default CustomButton;