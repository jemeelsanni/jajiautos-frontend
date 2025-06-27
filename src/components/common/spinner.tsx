import React from 'react';

interface SpinnerProps {
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    color?: 'primary' | 'secondary' | 'white' | 'gray';
    className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
    size = 'md',
    color = 'primary',
    className = ''
}) => {
    const sizeClasses = {
        xs: 'w-3 h-3 border-[1.5px]',
        sm: 'w-4 h-4 border-[1.5px]',
        md: 'w-6 h-6 border-2',
        lg: 'w-8 h-8 border-2',
        xl: 'w-12 h-12 border-[3px]',
        '2xl': 'w-16 h-16 border-4'
    };

    const colorClasses = {
        primary: 'border-red-600 border-t-transparent',
        secondary: 'border-gray-600 border-t-transparent',
        white: 'border-white border-t-transparent',
        gray: 'border-gray-400 border-t-transparent'
    };

    return (
        <div
            className={`
        ${sizeClasses[size]} 
        ${colorClasses[color]} 
        rounded-full 
        animate-spin
        ${className}
      `}
        />
    );
};

interface LoadingProps {
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    text?: string;
    color?: 'primary' | 'secondary' | 'white' | 'gray';
    className?: string;
    overlay?: boolean;
    fullScreen?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({
    size = 'lg',
    text = 'Loading...',
    color = 'primary',
    className = '',
    overlay = false,
    fullScreen = false
}) => {
    const containerClasses = fullScreen
        ? 'fixed inset-0 z-50 bg-white'
        : overlay
            ? 'absolute inset-0 bg-white bg-opacity-90 z-40'
            : '';

    return (
        <div className={`
      flex flex-col items-center justify-center 
      ${containerClasses}
      ${fullScreen || overlay ? '' : 'p-8'}
      ${className}
    `}>
            <Spinner size={size} color={color} />
            {text && (
                <p className={`
          mt-4 text-gray-600 font-medium
          ${size === 'xs' || size === 'sm' ? 'text-sm' : 'text-base'}
        `}>
                    {text}
                </p>
            )}
        </div>
    );
};

// Inline spinner for buttons and small spaces
export const InlineSpinner: React.FC<SpinnerProps> = (props) => {
    return <Spinner {...props} className="inline-block" />;
};

// Page loading spinner
export const PageLoading: React.FC<{ text?: string }> = ({ text = 'Loading page...' }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
            <div className="text-center">
                <div className="mb-8">
                    <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">JajiAutos</h2>
                <p className="text-gray-600">{text}</p>
            </div>
        </div>
    );
};

// Component loading spinner (for lazy loaded components)
export const ComponentLoading: React.FC<{ text?: string }> = ({ text = 'Loading...' }) => {
    return (
        <div className="flex items-center justify-center py-16">
            <div className="text-center">
                <Spinner size="lg" />
                <p className="mt-4 text-gray-600">{text}</p>
            </div>
        </div>
    );
};

// Skeleton loading for cards and content
export const SkeletonCard: React.FC = () => {
    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden animate-pulse">
            <div className="h-64 bg-gray-200"></div>
            <div className="p-6 space-y-4">
                <div className="h-6 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="flex justify-between items-center">
                    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                    <div className="h-12 bg-gray-200 rounded"></div>
                    <div className="h-12 bg-gray-200 rounded"></div>
                    <div className="h-12 bg-gray-200 rounded"></div>
                </div>
                <div className="flex gap-2">
                    <div className="h-12 bg-gray-200 rounded flex-1"></div>
                    <div className="h-12 bg-gray-200 rounded w-16"></div>
                </div>
            </div>
        </div>
    );
};

// Table loading skeleton
export const SkeletonTable: React.FC<{ rows?: number; cols?: number }> = ({
    rows = 5,
    cols = 4
}) => {
    return (
        <div className="animate-pulse">
            <div className="grid grid-cols-1 gap-4">
                {/* Header */}
                <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
                    {Array.from({ length: cols }).map((_, i) => (
                        <div key={i} className="h-4 bg-gray-300 rounded"></div>
                    ))}
                </div>

                {/* Rows */}
                {Array.from({ length: rows }).map((_, rowIndex) => (
                    <div key={rowIndex} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
                        {Array.from({ length: cols }).map((_, colIndex) => (
                            <div key={colIndex} className="h-4 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Spinner;