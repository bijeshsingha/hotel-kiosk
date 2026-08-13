'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'default' | 'sm' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'default', fullWidth = false, className = '', children, disabled, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-body font-semibold rounded-lg min-h-[44px] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 active:scale-[0.99] text-center select-none';

    const variants = {
      primary: 'bg-primary text-white shadow-md hover:shadow-lg',
      secondary: 'bg-secondary text-white shadow-md hover:shadow-lg',
      outline: 'border border-gray-300 bg-surface text-text-main hover:bg-gray-50 shadow-sm',
    };

    const sizes = {
      sm: 'px-3.5 py-1.5 text-xs min-h-[38px]',
      default: 'px-5 py-2.5 text-sm min-h-[44px]',
      lg: 'px-7 py-3.5 text-base min-h-[50px]',
    };

    const widthStyle = fullWidth ? 'w-full' : '';

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthStyle} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
