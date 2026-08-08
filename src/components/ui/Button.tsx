import React, { ButtonHTMLAttributes, forwardRef } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-full font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer';
    
    const variants = {
      primary: 'bg-dark-green text-white hover:bg-dark-olive-green focus:ring-dark-green shadow-sm hover:shadow-md hover:scale-105 active:scale-95',
      secondary: 'bg-dark-sea-green text-white hover:bg-dark-green focus:ring-dark-sea-green',
      outline: 'border-2 border-dark-green text-dark-green hover:bg-alice-blue focus:ring-dark-green',
      ghost: 'text-dark-green hover:bg-alice-blue focus:ring-dark-green',
    };

    const sizes = {
      sm: 'h-9 px-4 text-sm',
      md: 'h-11 px-6 text-base',
      lg: 'h-14 px-8 text-lg',
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
export { Button };
