'use client';

import { memo } from 'react';

function Button({ children, variant = 'primary', size = 'medium', className = '', onClick }) {
  const variantClasses = {
    primary: 'aesthetic-button-primary',
    secondary: '',
    outline: '',
    ghost: '',
  }[variant] || 'aesthetic-button-primary';

  const sizeClasses = {
    small: 'aesthetic-button-small',
    medium: 'aesthetic-button-medium',
    large: 'aesthetic-button-large',
  }[size] || 'aesthetic-button-medium';

  return (
    <button
      type="button"
      className={`aesthetic-button ${variantClasses} ${sizeClasses} ${className}`.trim()}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default memo(Button);
