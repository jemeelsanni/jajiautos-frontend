// src/components/common/errorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { Button } from './button';

interface Props {
    children?: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
    isRetrying: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null,
        isRetrying: false
    };

    public static getDerivedStateFromError(error: Error): State {
        // Update state so the next render will show the fallback UI
        return {
            hasError: true,
            error,
            errorInfo: null,
            isRetrying: false
        };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Log error to console and external service
        console.error('ErrorBoundary caught an error:', error, errorInfo);

        this.setState({
            error,
            errorInfo
        });

        // Report to error reporting service (e.g., Sentry, LogRocket, etc.)
        if (process.env.NODE_ENV === 'production') {
            this.reportError(error, errorInfo);
        }
    }

    private reportError = (error: Error, errorInfo: ErrorInfo) => {
        // Report error to external service
        // Example: Sentry.captureException(error, { extra: errorInfo });
        console.log('Reporting error to external service:', { error, errorInfo });
    };

    private handleRetry = () => {
        this.setState({ isRetrying: true });

        setTimeout(() => {
            this.setState({
                hasError: false,
                error: null,
                errorInfo: null,
                isRetrying: false
            });
        }, 1000);
    };

    private handleReload = () => {
        window.location.reload();
    };

    private handleGoHome = () => {
        window.location.href = '/';
    };

    private copyErrorToClipboard = () => {
        const errorText = `
Error: ${this.state.error?.message}
Stack: ${this.state.error?.stack}
Component Stack: ${this.state.errorInfo?.componentStack}
    `.trim();

        navigator.clipboard.writeText(errorText).then(() => {
            alert('Error details copied to clipboard');
        }).catch(() => {
            console.log('Failed to copy error details');
        });
    };

    public render() {
        if (this.state.hasError) {
            // Custom fallback UI
            if (this.props.fallback) {
                return this.props.fallback;
            }

            const isDevelopment = process.env.NODE_ENV === 'development';

            return (
                <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
                    <div className="max-w-2xl w-full">
                        {/* Error Card */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                            {/* Header */}
                            <div className="bg-red-50 border-b border-red-100 p-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                        <AlertTriangle className="w-6 h-6 text-red-600" />
                                    </div>
                                    <div>
                                        <h1 className="text-xl font-bold text-gray-900">
                                            Oops! Something went wrong
                                        </h1>
                                        <p className="text-gray-600 mt-1">
                                            We're sorry for the inconvenience. The page encountered an unexpected error.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                {/* User-friendly message */}
                                <div className="mb-6">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-2">
                                        What can you do?
                                    </h2>
                                    <ul className="text-gray-600 space-y-2">
                                        <li className="flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                                            Try refreshing the page or going back to the homepage
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                                            Check your internet connection
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                                            If the problem persists, please contact our support team
                                        </li>
                                    </ul>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-wrap gap-3 mb-6">
                                    <Button
                                        onClick={this.handleRetry}
                                        loading={this.state.isRetrying}
                                        icon={RefreshCw}
                                        variant="primary"
                                    >
                                        {this.state.isRetrying ? 'Retrying...' : 'Try Again'}
                                    </Button>

                                    <Button
                                        onClick={this.handleReload}
                                        icon={RefreshCw}
                                        variant="outline"
                                    >
                                        Reload Page
                                    </Button>

                                    <Button
                                        onClick={this.handleGoHome}
                                        icon={Home}
                                        variant="ghost"
                                    >
                                        Go Home
                                    </Button>
                                </div>

                                {/* Development Error Details */}
                                {isDevelopment && this.state.error && (
                                    <div className="border-t border-gray-200 pt-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                                <Bug className="w-5 h-5" />
                                                Development Error Details
                                            </h3>
                                            <Button
                                                onClick={this.copyErrorToClipboard}
                                                size="sm"
                                                variant="ghost"
                                            >
                                                Copy Error
                                            </Button>
                                        </div>

                                        <div className="space-y-4">
                                            {/* Error Message */}
                                            <div>
                                                <h4 className="font-medium text-gray-900 mb-2">Error Message:</h4>
                                                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                                    <code className="text-red-800 text-sm break-all">
                                                        {this.state.error.message}
                                                    </code>
                                                </div>
                                            </div>

                                            {/* Stack Trace */}
                                            {this.state.error.stack && (
                                                <div>
                                                    <h4 className="font-medium text-gray-900 mb-2">Stack Trace:</h4>
                                                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 max-h-48 overflow-auto">
                                                        <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                                                            {this.state.error.stack}
                                                        </pre>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Component Stack */}
                                            {this.state.errorInfo?.componentStack && (
                                                <div>
                                                    <h4 className="font-medium text-gray-900 mb-2">Component Stack:</h4>
                                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 max-h-48 overflow-auto">
                                                        <pre className="text-xs text-blue-800 whitespace-pre-wrap">
                                                            {this.state.errorInfo.componentStack}
                                                        </pre>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Production Error ID */}
                                {!isDevelopment && (
                                    <div className="border-t border-gray-200 pt-6">
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <h4 className="font-medium text-gray-900 mb-2">Error Reference</h4>
                                            <p className="text-sm text-gray-600 mb-2">
                                                If you need to contact support, please reference this error ID:
                                            </p>
                                            <code className="text-sm bg-white px-2 py-1 rounded border">
                                                ERR-{Date.now()}-{Math.random().toString(36).substr(2, 9)}
                                            </code>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="bg-gray-50 border-t border-gray-200 px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-gray-500">
                                        JajiAutos • Premium Collection
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        Need help? Contact support
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

// Higher-order component for functional components
export const withErrorBoundary = <P extends object>(
    Component: React.ComponentType<P>,
    fallback?: ReactNode
) => {
    const WrappedComponent = (props: P) => (
        <ErrorBoundary fallback={fallback}>
            <Component {...props} />
        </ErrorBoundary>
    );

    WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

    return WrappedComponent;
};

// Hook for error reporting in functional components
export const useErrorHandler = () => {
    const reportError = (error: Error, errorInfo?: ErrorInfo) => {
        console.error('Manual error report:', error, errorInfo);

        if (process.env.NODE_ENV === 'production') {
            // Report to external service
            console.log('Reporting error to external service:', { error, errorInfo });
        }
    };

    return { reportError };
};

// Simple error boundary for specific components
interface SimpleErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

export const SimpleErrorBoundary: React.FC<SimpleErrorBoundaryProps> = ({
    children,
    fallback,
    onError
}) => {
    const errorBoundaryRef = React.useRef<ErrorBoundary>(null);

    React.useEffect(() => {
        if (onError && errorBoundaryRef.current) {
            const originalDidCatch = errorBoundaryRef.current.componentDidCatch;
            errorBoundaryRef.current.componentDidCatch = (error, errorInfo) => {
                onError(error, errorInfo);
                originalDidCatch.call(errorBoundaryRef.current, error, errorInfo);
            };
        }
    }, [onError]);

    return (
        <ErrorBoundary
            ref={errorBoundaryRef}
            fallback={
                fallback || (
                    <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                        <div className="flex items-center gap-2 text-red-700">
                            <AlertTriangle size={16} />
                            <span className="font-medium">Something went wrong</span>
                        </div>
                        <p className="text-red-600 text-sm mt-1">
                            Please try refreshing the page.
                        </p>
                    </div>
                )
            }
        >
            {children}
        </ErrorBoundary>
    );
};

export default ErrorBoundary;