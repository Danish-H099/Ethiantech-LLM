import { useRef, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { AnimatePresence, m as Motion } from 'motion/react';
import { X, Eye, EyeOff } from 'lucide-react';
import { backdrop, modal } from 'src/lib/animationVariants';

// Focus handling for the modal dialogs: land on the first field on open (not
// the close button) and restore focus to the opener on close. The popups are
// opened by consumer buttons rather than Dialog.Trigger, so Radix cannot
// resolve the trigger on its own and we capture the previously focused element
// on open instead.
function useDialogFocusRestore() {
    const lastFocusedElementRef = useRef(null);

    const onOpenAutoFocus = (event) => {
        lastFocusedElementRef.current = document.activeElement;
        event.preventDefault();
        const firstField = event.currentTarget.querySelector('input');
        if (firstField) firstField.focus();
    };

    const onCloseAutoFocus = (event) => {
        event.preventDefault();
        const previous = lastFocusedElementRef.current;
        if (previous && previous.focus) previous.focus();
    };

    return { onOpenAutoFocus, onCloseAutoFocus };
}

// A mock visual button for Google Sign In to remove the OAuth dependency
const MockGoogleButton = ({ text }) => (
    <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-ink/20 bg-white px-4 py-2 text-sm-fluid font-medium text-ink transition hover:bg-surface-soft">
        <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
        {text === 'continue_with' ? 'Continue with Google' : 'Sign up with Google'}
    </button>
);

// Shared dialog shell: portal, animated backdrop/content, focus handling,
// backdrop click-to-close, a pinned close button, and the Google + divider
// header. Only the form body and switch-to-other-mode copy vary per popup.
function AuthDialog({
    title,
    closeLabel,
    googleText,
    dividerText,
    footerText,
    footerActionText,
    onFooterAction,
    onClose,
    children,
}) {
    const { onOpenAutoFocus, onCloseAutoFocus } = useDialogFocusRestore();

    return (
        <Dialog.Root open onOpenChange={(open) => { if (!open) onClose(); }}>
            <Dialog.Portal forceMount>
                <Dialog.Overlay asChild>
                    <Motion.div
                        variants={backdrop}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md"
                    />
                </Dialog.Overlay>

                <Dialog.Content
                    asChild
                    aria-describedby={undefined}
                    onOpenAutoFocus={onOpenAutoFocus}
                    onCloseAutoFocus={onCloseAutoFocus}
                >
                    <Motion.div
                        variants={modal}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <div className="relative w-full max-w-md overflow-hidden rounded-lg bg-white shadow-xl">
                            <Dialog.Close asChild>
                                <button
                                    aria-label={closeLabel}
                                    className="absolute right-4 top-4 z-10 text-ink-muted transition hover:text-ink"
                                >
                                    <X size={24} />
                                </button>
                            </Dialog.Close>

                            <div className="max-h-[calc(100vh-2rem)] overflow-y-auto p-8">
                                <Dialog.Title className="mb-6 text-center text-heading font-bold text-ink">{title}</Dialog.Title>

                                <div className="space-y-4">
                                    <MockGoogleButton text={googleText} />

                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-border"></div>
                                        </div>
                                        <div className="relative flex justify-center text-sm-fluid">
                                            <span className="bg-white px-2 text-ink-muted">{dividerText}</span>
                                        </div>
                                    </div>

                                    {children}

                                    <p className="text-center text-sm-fluid text-ink-muted">
                                        {footerText}{' '}
                                        <button onClick={onFooterAction} className="font-medium text-brand-secondary transition hover:text-brand-secondary/80">
                                            {footerActionText}
                                        </button>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Motion.div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}

export const LoginPopup = ({ onClose, onSwitchToSignup }) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <AuthDialog
            title="Welcome Back"
            closeLabel="Close login dialog"
            googleText="continue_with"
            dividerText="Or continue with email"
            footerText="Don&apos;t have an account?"
            footerActionText="Sign up"
            onFooterAction={onSwitchToSignup}
            onClose={onClose}
        >
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
                    <button type="button" className="text-sm-fluid font-medium text-brand-secondary transition hover:text-brand-secondary/80">
                        Forgot Password?
                    </button>
                </div>

                <button type="submit" className="btn-brand btn-brand-flat w-full rounded-lg px-4 py-2">
                    Sign In
                </button>
            </form>
        </AuthDialog>
    );
};

export const SignupPopup = ({ onClose, onSwitchToLogin }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <AuthDialog
            title="Create Account"
            closeLabel="Close sign up dialog"
            googleText="signup_with"
            dividerText="Or sign up with email"
            footerText="Already have an account?"
            footerActionText="Sign in"
            onFooterAction={onSwitchToLogin}
            onClose={onClose}
        >
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

                <button type="submit" className="btn-brand btn-brand-flat mt-2 w-full rounded-lg px-4 py-2">
                    Create Account
                </button>
            </form>
        </AuthDialog>
    );
};

// Renders whichever auth popup matches `state` ("login" | "signup" | "none").
// mode="wait" lets the outgoing dialog finish its exit before the next mounts,
// so login <-> signup switches never overlap two open dialogs.
export const AuthPopupGate = ({ state, onStateChange }) => (
    <AnimatePresence mode="wait">
        {state === "login" && (
            <LoginPopup
                key="login"
                onClose={() => onStateChange("none")}
                onSwitchToSignup={() => onStateChange("signup")}
            />
        )}
        {state === "signup" && (
            <SignupPopup
                key="signup"
                onClose={() => onStateChange("none")}
                onSwitchToLogin={() => onStateChange("login")}
            />
        )}
    </AnimatePresence>
);
