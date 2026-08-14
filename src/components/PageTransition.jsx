import React from 'react';

export default function PageTransition({ children, className = '' }) {
  return (
    <div className={`animate-fade-in-up transition-all duration-300 ${className}`}>
      {children}
    </div>
  );
}
