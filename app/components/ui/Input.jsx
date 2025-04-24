export default function Input({
  label,
  type = 'text',
  id,
  name,
  placeholder = '',
  required = false,
  error = '',
  className = '',
  value,
  onChange,
  ...rest
}) {
  return (
    <div className="mb-4">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        required={required}
        className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
          error ? 'border-red-500' : ''
        } ${className}`}
        value={value}
        onChange={onChange}
        {...rest}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}
