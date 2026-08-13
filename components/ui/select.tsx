'use client';

import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  requiredStar?: boolean;
  children: React.ReactNode;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, requiredStar, className = '', children, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className={`text-xs font-semibold uppercase tracking-wider font-body ${error ? 'text-red-700 font-bold' : 'text-text-muted'}`}>
            {label} {requiredStar && <span className="text-secondary">*</span>}
          </label>
        )}
        <select
          ref={ref}
          className={`w-full min-h-[44px] bg-surface border-2 ${
            error
              ? 'border-red-500 bg-red-50/40 text-red-950 ring-2 ring-red-500/20 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 focus:ring-primary focus:border-primary'
          } rounded-lg px-4 py-2.5 text-text-main text-sm font-body focus:ring-2 focus:outline-none transition-all duration-200 ${className}`}
          {...props}
        >
          {children}
        </select>
        {error && (
          <span className="text-red-600 text-xs font-semibold font-body flex items-center gap-1 mt-0.5">
            ⚠️ {error}
          </span>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
