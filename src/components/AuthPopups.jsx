import { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';

// A mock visual button for Google Sign In to remove the OAuth dependency
const MockGoogleButton = ({ text }) => (
    <button className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
        <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
        {text === 'continue_with' ? 'Continue with Google' : 'Sign up with Google'}
    </button>
);

export const LoginPopup = ({ onClose, onSwitchToSignup }) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md">
            <div className="relative w-full max-w-md rounded-lg bg-white p-8 shadow-xl">
                <button onClick={onClose} className="absolute right-4 top-4 text-gray-500 hover:text-gray-700">
                    <X size={24} />
                </button>

                <h2 className="mb-6 text-center text-2xl font-bold">Welcome Back</h2>

                <div className="space-y-4">
                    <MockGoogleButton text="continue_with" />

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-white px-2 text-gray-500">Or continue with email</span>
                        </div>
                    </div>

                    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="Enter your email"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-end">
                            <button type="button" className="text-sm text-blue-600 hover:text-blue-500">
                                Forgot Password?
                            </button>
                        </div>

                        <button type="submit" className="w-full rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700">
                            Sign In
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-600">
                        Don&apos;t have an account?{' '}
                        <button onClick={onSwitchToSignup} className="font-medium text-blue-600 hover:text-blue-800">
                            Sign up
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export const SignupPopup = ({ onClose, onSwitchToLogin }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md">
            <div className="relative w-full max-w-md rounded-lg bg-white p-8 shadow-xl">
                <button onClick={onClose} className="absolute right-4 top-4 text-gray-500 hover:text-gray-700">
                    <X size={24} />
                </button>

                <h2 className="mb-6 text-center text-2xl font-bold">Create Account</h2>

                <div className="space-y-4">
                    <MockGoogleButton text="signup_with" />

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-white px-2 text-gray-500">Or sign up with email</span>
                        </div>
                    </div>

                    <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Full Name</label>
                            <input type="text" className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Enter your full name" />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
                            <input type="email" className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Enter your email" />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Confirm Password</label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder="Confirm your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="mt-2 w-full rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700">
                            Create Account
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <button onClick={onSwitchToLogin} className="font-medium text-blue-600 hover:text-blue-800">
                            Sign in
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};