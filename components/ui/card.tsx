'use client';

import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function Card({ children, className = '', noPadding = false, ...props }: CardProps) {
  return (
    <div
      className={`bg-surface border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden ${
        noPadding ? '' : 'p-4 sm:p-6'
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-gray-100 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <h3 className={`text-lg sm:text-xl font-bold text-text-main font-heading ${className}`}>{children}</h3>;
}

export function CardDescription({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <p className={`text-xs sm:text-sm text-text-muted font-body mt-0.5 ${className}`}>{children}</p>;
}
