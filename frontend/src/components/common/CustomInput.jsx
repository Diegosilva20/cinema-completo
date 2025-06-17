function CustomInput({ id, label, type = 'text', value, onChange, required = false, icon, ...props }) {
  return (
    <div className="mb-4 position-relative">
      <label htmlFor={id} className="form-label fw-semibold">{label}</label>
      {icon && <i className={`bi ${icon} position-absolute`} style={{ top: '38px', left: '10px', color: '#dc3545' }}></i>}
      <input
        type={type}
        className="form-control ps-5"
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        required={required}
        style={{ borderRadius: '8px', paddingLeft: icon ? '40px' : '12px' }}
        {...props}
      />
    </div>
  );
}

export default CustomInput;