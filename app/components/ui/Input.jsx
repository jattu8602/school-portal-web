import React from 'react'

const Input = ({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`
          block w-full px-3 py-2
          border ${error ? 'border-red-300' : 'border-gray-300'}
          rounded-md shadow-sm
          placeholder-gray-400
          focus:outline-none focus:ring-primary-500 focus:border-primary-500
          sm:text-sm
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}

export default Input
