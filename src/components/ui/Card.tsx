import React, { HTMLAttributes, forwardRef } from 'react';

const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col ${className}`}
        {...props}
      />
    );
  }
);
Card.displayName = 'Card';

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`flex flex-col space-y-1.5 p-6 ${className}`}
        {...props}
      />
    );
  }
);
CardHeader.displayName = 'CardHeader';

const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className = '', ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={`font-semibold text-lg leading-none tracking-tight text-dark-green ${className}`}
        {...props}
      />
    );
  }
);
CardTitle.displayName = 'CardTitle';

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => {
    return (
      <div ref={ref} className={`p-6 pt-0 flex-grow ${className}`} {...props} />
    );
  }
);
CardContent.displayName = 'CardContent';

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`flex items-center p-6 pt-0 ${className}`}
        {...props}
      />
    );
  }
);
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardContent, CardFooter };
