import { useEffect, useRef, useState } from 'react';
import { m as Motion } from 'motion/react';
import { X, Eye, EyeOff } from 'lucide-react';
import { backdrop, modal } from '../lib/animationVariants';

// Focus management for modal dialogs: move focus in on open, trap Tab, restore on close
function useDialogFocus(onClose) {
    const dialogRef = useRef(null);

    useEffect(() => {
        const previouslyFocused = document.activeElement;
        const dialog = dialogRef.current;
        if (dialog) {
            const firstFocusable = dialog.querySelector(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            if (firstFocusable) firstFocusable.focus();
        }

        function onKeyDown(e) {
            if (e.key === 'Escape') {
                onClose();
                return;
            }
            if (e.key !== 'Tab') return;
            const dialogEl = dialogRef.current;
            if (!dialogEl) return;
            const focusables = [...dialogEl.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            )].filter((el) => !el.disabled && el.offsetParent !== null);
            if (focusables.length === 0) return;
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }

        window.addEventListener('keydown', onKeyDown);
        return () => {
            window.removeEventListener('keydown', onKeyDown);
            if (previouslyFocused && previouslyFocused.focus) {
                previouslyFocused.focus();
            }
        };
    }, [onClose]);

    return dialogRef;
}

// A mock visual button for Google Sign In to remove the OAuth dependency
const MockGoogleButton = ({ text }) => (
    <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-ink/20 bg-white px-4 py-2 text-sm font-medium text-ink transition hover:bg-surface-soft">
        <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
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
    const dialogRef = useDialogFocus(onClose);

    return (
        <Motion.div
            ref={dialogRef}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md"
            role="dialog"
            aria-modal="true"
            aria-labelledby="login-title"
            variants={backdrop}
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            <Motion.div
                className="relative w-full max-w-md rounded-lg bg-white p-8 shadow-xl"
                variants={modal}
                initial="hidden"
                animate="visible"
                exit="exit"
            >
                <button
                    onClick={onClose}
                    aria-label="Close login dialog"
                    className="absolute right-4 top-4 text-ink-muted transition hover:text-ink"
                >
                    <X size={24} />
                </button>

                <h2 id="login-title" className="mb-6 text-center text-2xl font-bold text-ink">Welcome Back</h2>

                <div className="space-y-4">
                    <MockGoogleButton text="continue_with" />

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-white px-2 text-ink-muted">Or continue with email</span>
                        </div>
                    </div>

                    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                        <div>
                            <label className="label" htmlFor="login-email">Email</label>
                            <input
                                id="login-email"
                                type="email"
                                className="input-sm"
                                placeholder="Enter your email"
                            />
                        </div>

                        <div>
                            <label className="label" htmlFor="login-password">Password</label>
                            <div className="relative">
                                <input
                                    id="login-password"
                                    type={showPassword ? "text" : "password"}
                                    className="input-sm pr-10"
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    aria-pressed={showPassword}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted transition hover:text-ink"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-end">
                            <button type="button" className="text-sm font-medium text-brand-secondary transition hover:text-brand-secondary/80">
                                Forgot Password?
                            </button>
                        </div>

                        <button type="submit" className="btn-brand w-full rounded-lg px-4 py-2">
                            Sign In
                        </button>
                    </form>

                    <p className="text-center text-sm text-ink-muted">
                        Don&apos;t have an account?{' '}
                        <button onClick={onSwitchToSignup} className="font-medium text-brand-secondary transition hover:text-brand-secondary/80">
                            Sign up
                        </button>
                    </p>
                </div>
            </Motion.div>
        </Motion.div>
    );
};

export const SignupPopup = ({ onClose, onSwitchToLogin }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const dialogRef = useDialogFocus(onClose);

    return (
        <Motion.div
            ref={dialogRef}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md"
            role="dialog"
            aria-modal="true"
            aria-labelledby="signup-title"
            variants={backdrop}
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            <Motion.div
                className="relative w-full max-w-md rounded-lg bg-white p-8 shadow-xl"
                variants={modal}
                initial="hidden"
                animate="visible"
                exit="exit"
            >
                <button
                    onClick={onClose}
                    aria-label="Close sign up dialog"
                    className="absolute right-4 top-4 text-ink-muted transition hover:text-ink"
                >
                    <X size={24} />
                </button>

                <h2 id="signup-title" className="mb-6 text-center text-2xl font-bold text-ink">Create Account</h2>

                <div className="space-y-4">
                    <MockGoogleButton text="signup_with" />

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-white px-2 text-ink-muted">Or sign up with email</span>
                        </div>
                    </div>

                    <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                        <div>
                            <label className="label" htmlFor="signup-name">Full Name</label>
                            <input id="signup-name" type="text" className="input-sm" placeholder="Enter your full name" />
                        </div>

                        <div>
                            <label className="label" htmlFor="signup-email">Email</label>
                            <input id="signup-email" type="email" className="input-sm" placeholder="Enter your email" />
                        </div>

                        <div>
                            <label className="label" htmlFor="signup-password">Password</label>
                            <div className="relative">
                                <input
                                    id="signup-password"
                                    type={showPassword ? "text" : "password"}
                                    className="input-sm pr-10"
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    aria-pressed={showPassword}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted transition hover:text-ink"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="label" htmlFor="signup-confirm-password">Confirm Password</label>
                            <div className="relative">
                                <input
                                    id="signup-confirm-password"
                                    type={showConfirmPassword ? "text" : "password"}
                                    className="input-sm pr-10"
                                    placeholder="Confirm your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                    aria-pressed={showConfirmPassword}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted transition hover:text-ink"
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="btn-brand mt-2 w-full rounded-lg px-4 py-2">
                            Create Account
                        </button>
                    </form>

                    <p className="text-center text-sm text-ink-muted">
                        Already have an account?{' '}
                        <button onClick={onSwitchToLogin} className="font-medium text-brand-secondary transition hover:text-brand-secondary/80">
                            Sign in
                        </button>
                    </p>
                </div>
            </Motion.div>
        </Motion.div>
    );
};
