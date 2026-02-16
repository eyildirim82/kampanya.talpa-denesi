
import React, { ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-talpa-navy focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-lg active:scale-[0.98]";
  
  const variants = {
    primary: "bg-talpa-navy text-white hover:bg-[#001F40] shadow-md shadow-talpa-navy/20 hover:shadow-lg hover:shadow-talpa-navy/30",
    secondary: "bg-white text-talpa-navy border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 shadow-sm",
    danger: "bg-deniz-red text-white hover:bg-deniz-dark shadow-md shadow-deniz-red/20",
    ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
    outline: "border-2 border-talpa-navy text-talpa-navy hover:bg-talpa-navy hover:text-white"
  };

  const sizes = {
    sm: "h-9 px-3 text-sm",
    md: "h-11 px-5 text-base",
    lg: "h-14 px-8 text-lg"
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {!isLoading && leftIcon && <span className="mr-2 opacity-90">{leftIcon}</span>}
      {children}
      {!isLoading && rightIcon && <span className="ml-2 opacity-90">{rightIcon}</span>}
    </button>
  );
};

export default Button;
