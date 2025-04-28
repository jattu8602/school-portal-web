import React from 'react'

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  type = 'button',
  onClick,
  className = '',
  ...props
}) => {
  const variantClasses = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
    outline: 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
  }

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`
        ${variantClasses[variant] || variantClasses.primary}
        ${sizeClasses[size] || sizeClasses.md}
        rounded-md font-medium transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
