import { memo } from 'react';

function Badge({ children, className = '' }) {
  return (
    <span className={`aesthetic-badge ${className}`}>
      {children}
    </span>
  );
}

export default memo(Badge);
