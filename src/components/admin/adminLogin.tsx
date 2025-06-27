// src/components/admin/adminLogin.tsx - Updated with authentication fixes
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Card } from "../common/card";
import { Car, User, Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { Button } from "../common/button";
import apiClient from '../../services/apiClient';

interface AdminLoginProps {
    onLogin: (username?: string, password?: string) => Promise<boolean>;
}

interface LoginResponse {
    token: string;
    user: {
        id: string;
        username: string;
        email: string;
        firstName: string;
        lastName: string;
        role: string;
    };
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [loginMode, setLoginMode] = useState<'demo' | 'manual'>('demo');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [showDebug, setShowDebug] = useState(false);
    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });

    // Store authentication data in multiple formats for compatibility
    const storeAuthData = (token: string, user: LoginResponse['user']) => {
        const tokenKeys = ['jajiautos_token', 'token', 'authToken'];
        const userKeys = ['jajiautos_user', 'user', 'currentUser'];

        tokenKeys.forEach(key => {
            localStorage.setItem(key, token);
        });

        userKeys.forEach(key => {
            localStorage.setItem(key, JSON.stringify(user));
        });

        console.log('💾 Authentication data stored with keys:', [...tokenKeys, ...userKeys]);
    };

    // Enhanced demo login with actual API call
    const handleDemoLogin = async () => {
        setIsLoading(true);
        setError('');

        try {
            console.log('🧪 Attempting demo login...');

            // Try demo credentials
            const demoCredentials = [
                { username: 'admin@jajiautos.ng', password: 'admin123' },
                { username: 'admin', password: 'admin123' },
                { username: 'demo', password: 'demo123' },
                { username: 'test', password: 'test123' }
            ];

            let loginSuccess = false;
            let lastError = '';

            for (const creds of demoCredentials) {
                try {
                    console.log(`🔑 Trying demo credentials: ${creds.username}`);

                    const response = await apiClient.post<LoginResponse>('/auth/login', creds);
                    const { token, user } = response.data;

                    console.log('✅ Demo login successful:', {
                        token: token.substring(0, 20) + '...',
                        user: user.username
                    });

                    storeAuthData(token, user);

                    // Call parent handler
                    await onLogin(creds.username, creds.password);

                    loginSuccess = true;
                    navigate('/admin/dashboard');
                    break;

                } catch (err: unknown) {
                    if (err && typeof err === "object" && "message" in err) {
                        lastError = (err as { message?: string }).message ?? '';
                    } else {
                        lastError = String(err);
                    }
                    console.log(`❌ Demo credentials failed: ${creds.username}`);
                    continue;
                }
            }

            if (!loginSuccess) {
                // Fallback to original demo login logic
                console.log('📝 Falling back to original demo login...');
                const success = await onLogin();
                if (success) {
                    navigate('/admin/dashboard');
                } else {
                    throw new Error(lastError || 'Demo login failed');
                }
            }

        } catch (error: unknown) {
            console.error('❌ Demo login error:', error);
            if (error && typeof error === "object" && "message" in error) {
                setError((error as { message?: string }).message || 'Demo login failed. Please try manual login.');
            } else {
                setError('Demo login failed. Please try manual login.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Enhanced manual login with API integration
    const handleManualLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!credentials.username || !credentials.password) {
            setError('Please enter both username and password');
            return;
        }

        setIsLoading(true);
        try {
            console.log('🔑 Attempting manual login:', { username: credentials.username });

            // Try API login first
            try {
                const response = await apiClient.post<LoginResponse>('/auth/login', {
                    username: credentials.username,
                    password: credentials.password
                });

                const { token, user } = response.data;

                console.log('✅ Manual login successful:', {
                    token: token.substring(0, 20) + '...',
                    user: user.username
                });

                storeAuthData(token, user);

                // Call parent handler
                await onLogin(credentials.username, credentials.password);
                navigate('/admin/dashboard');

            } catch (apiError: unknown) {
                console.log('📝 API login failed, trying parent handler...');

                // Fallback to parent handler
                const success = await onLogin(credentials.username, credentials.password);
                if (success) {
                    navigate('/admin/dashboard');
                } else {
                    throw apiError;
                }
            }

        } catch (error: unknown) {
            console.error('❌ Manual login error:', error);

            let errorMessage = 'Login failed. Please try again.';

            if (
                typeof error === 'object' &&
                error !== null &&
                'response' in error &&
                typeof (error as { response?: unknown }).response === 'object'
            ) {
                const response = (error as { response?: { status?: number } }).response;
                if (response?.status === 401) {
                    errorMessage = 'Invalid username or password';
                } else if (response?.status === 400) {
                    errorMessage = 'Please check your credentials';
                }
            } else if (
                typeof error === 'object' &&
                error !== null &&
                'message' in error &&
                typeof (error as { message?: string }).message === 'string'
            ) {
                errorMessage = (error as { message: string }).message;
            }

            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    // Debug info component
    const DebugInfo = () => {
        const storageKeys = Object.keys(localStorage);
        const tokenKeys = storageKeys.filter(key => key.toLowerCase().includes('token'));

        return (
            <div className="mt-6 p-4 bg-gray-50 rounded-xl text-xs text-gray-600">
                <div className="flex items-center justify-between mb-2">
                    <p className="font-medium">Debug Info:</p>
                    <button
                        type="button"
                        onClick={() => setShowDebug(!showDebug)}
                        className="text-blue-600 hover:text-blue-800"
                    >
                        {showDebug ? 'Hide' : 'Show'}
                    </button>
                </div>

                {showDebug && (
                    <div className="space-y-1">
                        <p>API URL: {apiClient.defaults.baseURL}</p>
                        <p>Tokens in storage: {tokenKeys.length}</p>
                        <p>Total localStorage items: {storageKeys.length}</p>
                        {tokenKeys.length > 0 && (
                            <div>
                                <p className="font-medium">Token keys found:</p>
                                {tokenKeys.map(key => (
                                    <p key={key} className="ml-2">• {key}</p>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <Card className="max-w-md w-full p-8">
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Car className="w-10 h-10 text-red-600" />
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-red-600 bg-clip-text text-transparent">
                            JajiAutos
                        </h2>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Admin Access</h3>
                    <p className="mt-2 text-gray-600">Sign in to access the management dashboard</p>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                        <div className="flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-red-600" />
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                    </div>
                )}

                {/* Login Mode Toggle */}
                <div className="mb-6">
                    <div className="flex rounded-lg bg-gray-100 p-1">
                        <button
                            onClick={() => setLoginMode('demo')}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${loginMode === 'demo'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Demo Access
                        </button>
                        <button
                            onClick={() => setLoginMode('manual')}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${loginMode === 'manual'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Manual Login
                        </button>
                    </div>
                </div>

                {loginMode === 'demo' ? (
                    <div className="space-y-6">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h4 className="font-semibold text-blue-900 mb-2">Demo Accounts Available:</h4>
                            <div className="space-y-2 text-sm text-blue-800">
                                <div>
                                    <strong>Super Admin:</strong> admin@jajiautos.ng / admin123
                                    <span className="block text-xs text-blue-600">Full access to all features</span>
                                </div>
                                <div>
                                    <strong>Sales Personnel:</strong> sales@jajiautos.ng / sales123
                                    <span className="block text-xs text-blue-600">Sales management access</span>
                                </div>
                                <div>
                                    <strong>Inventory Manager:</strong> inventory@jajiautos.ng / inventory123
                                    <span className="block text-xs text-blue-600">Inventory management access</span>
                                </div>
                            </div>
                        </div>

                        <Button
                            onClick={handleDemoLogin}
                            className="w-full"
                            size="lg"
                            icon={User}
                            loading={isLoading}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Connecting...' : 'Access Demo Dashboard'}
                        </Button>

                        <div className="text-center">
                            <p className="text-sm text-gray-500">
                                Demo will try multiple credentials automatically
                            </p>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleManualLogin} className="space-y-6">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                                Username or Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    id="username"
                                    type="text"
                                    value={credentials.username}
                                    onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    placeholder="Enter username or email"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={credentials.password}
                                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    placeholder="Enter password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            size="lg"
                            icon={User}
                            loading={isLoading}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Signing In...' : 'Sign In'}
                        </Button>

                        <div className="text-center">
                            <p className="text-sm text-gray-500">
                                Use your assigned credentials to access the system
                            </p>
                        </div>
                    </form>
                )}

                {/* Debug Section */}
                <DebugInfo />

                {/* Help Section */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="text-center">
                        <p className="text-xs text-gray-500 mb-2">Need help accessing your account?</p>
                        <p className="text-xs text-gray-400">Contact your system administrator</p>
                    </div>
                </div>
            </Card>
        </div>
    );
}