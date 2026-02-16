
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  variant?: 'elevated' | 'outlined' | 'flat';
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  padding = 'md',
  variant = 'elevated' 
}) => {
  const paddings = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const variants = {
    elevated: 'bg-white shadow-md hover:shadow-xl border border-slate-100/50',
    outlined: 'bg-white border border-slate-200 shadow-sm',
    flat: 'bg-slate-50 border border-slate-100'
  };

  return (
    <div className={`rounded-2xl transition-all duration-300 ${variants[variant]} ${paddings[padding]} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
