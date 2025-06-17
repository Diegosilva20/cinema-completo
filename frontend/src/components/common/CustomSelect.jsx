function CustomSelect({ id, label, value, onChange, options, required = false, icon }) {
  return (
    <div className="mb-4 position-relative">
      <label htmlFor={id} className="form-label fw-semibold">{label}</label>
      {icon && <i className={`bi ${icon} position-absolute`} style={{ top: '38px', left: '10px', color: '#dc3545' }}></i>}
      <select
        className="form-select ps-5"
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        required={required}
        style={{ borderRadius: '8px', paddingLeft: icon ? '40px' : '12px' }}
      >
        <option value="">{`Selecione ${label}`}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default CustomSelect;