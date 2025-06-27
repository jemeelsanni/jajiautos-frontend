import type { FC } from 'react';
import { InlineSpinner } from './spinner';

interface ButtonProps {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'success' | 'outline';
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
    onClick?: () => void;
    disabled?: boolean;
    icon?: React.ComponentType<{ size: number }>;
    loading?: boolean;
    type?: 'button' | 'submit' | 'reset';
}

export const Button: FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    onClick,
    disabled,
    icon: Icon,
    loading = false,
    type = 'button'
}) => {
    const baseClasses = 'font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-3 relative overflow-hidden transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2';

    const variants = {
        primary: 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-red-200 focus:ring-red-500',
        secondary: 'bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200 hover:border-gray-300 shadow-gray-200 focus:ring-gray-500',
        danger: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-red-200 focus:ring-red-500',
        ghost: 'hover:bg-gray-100 text-gray-700 shadow-none hover:shadow-md focus:ring-gray-500',
        success: 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-green-200 focus:ring-green-500',
        outline: 'border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white bg-transparent focus:ring-red-500'
    };

    const sizes = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
        xl: 'px-10 py-5 text-xl'
    };

    const isDisabled = disabled || loading;

    const getSpinnerColor = (): 'gray' | 'white' => {
        if (variant === 'secondary' || variant === 'ghost' || variant === 'outline') {
            return 'gray';
        }
        return 'white';
    };

    const getSpinnerSize = (): 'xs' | 'sm' | 'md' | 'lg' => {
        switch (size) {
            case 'sm': return 'xs';
            case 'md': return 'sm';
            case 'lg': return 'md';
            case 'xl': return 'lg';
            default: return 'sm';
        }
    };

    return (
        <button
            type={type}
            className={`
        ${baseClasses} 
        ${variants[variant]} 
        ${sizes[size]} 
        ${className} 
        ${isDisabled ? 'opacity-50 cursor-not-allowed transform-none hover:scale-100' : ''}
      `}
            onClick={onClick}
            disabled={isDisabled}
        >
            {loading ? (
                <>
                    <InlineSpinner
                        size={getSpinnerSize()}
                        color={getSpinnerColor()}
                    />
                    {typeof children === 'string' ? 'Loading...' : children}
                </>
            ) : (
                <>
                    {Icon && <Icon size={20} />}
                    {children}
                </>
            )}
        </button>
    );
};