import React, { InputHTMLAttributes, forwardRef } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-semibold text-dark-olive-green">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`flex h-11 w-full rounded-lg border border-dark-sea-green/50 bg-alice-blue/50 px-3 py-2 text-sm text-gray-900 transition-all placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-dark-green focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 ${
            error ? 'border-red-500 focus:ring-red-500' : ''
          } ${className}`}
          {...props}
        />
        {error && <span className="text-xs font-medium text-red-500">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
export { Input };
