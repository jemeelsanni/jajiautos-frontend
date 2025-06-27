import type { ReactNode } from 'react';

export const Card = ({ children, className = '', hover = true, gradient = false }: { children: ReactNode; className?: string; hover?: boolean; gradient?: boolean }) => {
    return (
        <div className={`
      bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden
      ${hover ? 'hover:shadow-2xl hover:-translate-y-2 transition-all duration-300' : ''}
      ${gradient ? 'bg-gradient-to-br from-white to-gray-50' : ''}
      ${className}
    `}>
            {children}
        </div>
    );
};