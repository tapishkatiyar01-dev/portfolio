'use client';

import { memo } from 'react';

function Button({ children, variant = 'primary', size = 'medium', className = '', onClick }) {
  const baseClasses = 'terminal-button';
  const variantClasses = {
    primary: 'terminal-button-primary',
    secondary: '',
    outline: '',
    ghost: '',
  }[variant] || 'terminal-button-primary';
  const sizeClasses = {
    small: 'text-xs px-3 py-1',
    medium: 'text-sm px-4 py-2',
    large: 'text-base px-5 py-3',
  }[size] || 'text-sm px-4 py-2';

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
      onClick={onClick}
    >
      [ {children} ]
    </button>
  );
}

export default memo(Button);
