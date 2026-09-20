import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  AlertCircle, 
  ShieldAlert, 
  Sparkles, 
  Check, 
  ArrowLeft,
  Loader2, 
  Globe,
  KeyRound,
  CheckCircle2
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup' | 'forgot_password';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'signin'
}) => {
  const { 
    signInWithEmail, 
    signUpWithEmail, 
    signInWithGoogle, 
    sendPasswordReset, 
    error, 
    clearError 
  } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot_password'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [resetSuccessMessage, setResetSuccessMessage] = useState<string | null>(null);

  // Sync mode when modal opens
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setLocalError(null);
      setResetSuccessMessage(null);
      clearError();
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const currentDomain = typeof window !== 'undefined' ? window.location.hostname : '';
  const displayedError = localError || error;
  const isUnauthorizedDomain = displayedError?.toLowerCase().includes('authorized domain') || 
                                displayedError?.toLowerCase().includes('unauthorized-domain');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setResetSuccessMessage(null);
    clearError();
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (!displayName.trim()) {
          setLocalError('Please enter your full name.');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setLocalError('Password must be at least 6 characters.');
          setLoading(false);
          return;
        }
        await signUpWithEmail(email, password, displayName);
        onClose();
      } else if (mode === 'signin') {
        await signInWithEmail(email, password);
        onClose();
      } else if (mode === 'forgot_password') {
        if (!email.trim()) {
          setLocalError('Please enter your registered email address.');
          setLoading(false);
          return;
        }
        await sendPasswordReset(email);
        setResetSuccessMessage(`Password reset link sent to ${email.trim()}! Please check your inbox.`);
      }
    } catch (err: any) {
      setLocalError(err.message || 'Authentication operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLocalError(null);
    setResetSuccessMessage(null);
    clearError();
    setLoading(true);
    try {
      await signInWithGoogle();
      onClose();
    } catch (err: any) {
      setLocalError(err.message || 'Google Sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  // Quick fill for test admin account
  const fillAdminTest = () => {
    setMode('signin');
    setEmail('rajht203@gmail.com');
    setPassword('AdminSecure123!');
    setDisplayName('Raj H (Admin)');
    setLocalError(null);
    setResetSuccessMessage(null);
  };

  return (
    <div 
      id="auth-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div 
        id="auth-modal-card"
        className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-150"
      >
        {/* Close button */}
        <button
          id="auth-modal-close-btn"
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-1 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Cloud Sync & History</span>
          </div>
          <h2 id="auth-modal-title" className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {mode === 'signup' && 'Create your Account'}
            {mode === 'signin' && 'Welcome to ToolStack'}
            {mode === 'forgot_password' && 'Reset Password'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
            {mode === 'signup' && 'Save favorite tools, track history, and access exclusive member tools.'}
            {mode === 'signin' && 'Sign in to sync your presets, favorites, and audit logs across devices.'}
            {mode === 'forgot_password' && 'Enter your email address and we will send you a password reset link.'}
          </p>
        </div>

        {/* Reset Success Message */}
        {resetSuccessMessage && (
          <div 
            id="auth-reset-success-alert"
            className="mb-4 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300 text-xs flex items-start gap-2.5 leading-relaxed"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
            <div>
              <p className="font-semibold">{resetSuccessMessage}</p>
              <button
                type="button"
                onClick={() => setMode('signin')}
                className="mt-1.5 inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-300 underline font-bold"
              >
                Back to Sign In
              </button>
            </div>
          </div>
        )}

        {/* Error notification banner */}
        {displayedError && (
          <div 
            id="auth-error-alert"
            className="mb-4 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs space-y-2 leading-relaxed"
          >
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <span className="font-medium break-words">{displayedError}</span>
              </div>
            </div>

            {/* If error is related to Unauthorized Domain, provide clear console guidance */}
            {isUnauthorizedDomain && currentDomain && (
              <div className="p-2 bg-rose-100/70 dark:bg-rose-900/40 rounded-xl text-[11px] text-rose-800 dark:text-rose-200 font-mono space-y-1">
                <div className="flex items-center gap-1 font-sans font-bold">
                  <Globe className="w-3.5 h-3.5" />
                  <span>Firebase Console Setup Required:</span>
                </div>
                <div className="text-[10px] break-all font-sans">
                  Firebase Console &gt; Authentication &gt; Settings &gt; Authorized domains &gt; Add Domain:
                </div>
                <code className="block p-1 bg-white/80 dark:bg-slate-900/80 rounded border border-rose-200 dark:border-rose-800 font-bold select-all">
                  {currentDomain}
                </code>
              </div>
            )}
          </div>
        )}

        {/* Form */}
        <form id="auth-main-form" onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'signup' && (
            <div>
              <label 
                htmlFor="auth-fullname-input" 
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1"
              >
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  id="auth-fullname-input"
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Alex Rivers"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label 
              htmlFor="auth-email-input" 
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                id="auth-email-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {mode !== 'forgot_password' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label 
                  htmlFor="auth-password-input" 
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider"
                >
                  Password
                </label>
                {mode === 'signin' && (
                  <button
                    id="auth-forgot-password-link"
                    type="button"
                    onClick={() => {
                      setMode('forgot_password');
                      setLocalError(null);
                      setResetSuccessMessage(null);
                    }}
                    className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  id="auth-password-input"
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors"
                />
              </div>
            </div>
          )}

          <button
            id="auth-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>
                  {mode === 'signup' && 'Creating Account...'}
                  {mode === 'signin' && 'Authenticating...'}
                  {mode === 'forgot_password' && 'Sending Reset Link...'}
                </span>
              </>
            ) : (
              <span>
                {mode === 'signup' && 'Create Free Account'}
                {mode === 'signin' && 'Sign In'}
                {mode === 'forgot_password' && 'Send Password Reset Link'}
              </span>
            )}
          </button>
        </form>

        {/* Mode toggle / Google sign-in (shown in signin/signup modes) */}
        {mode !== 'forgot_password' && (
          <>
            {/* Divider */}
            <div className="my-5 flex items-center">
              <div className="flex-1 border-t border-slate-200 dark:border-slate-700" />
              <span className="px-3 text-xs text-slate-400">or</span>
              <div className="flex-1 border-t border-slate-200 dark:border-slate-700" />
            </div>

            {/* Google sign-in button */}
            <button
              id="auth-google-btn"
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-2.5 px-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-60 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-2 transition-colors shadow-2xs cursor-pointer"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              <span>Continue with Google</span>
            </button>

            {/* Toggle sign in / sign up */}
            <div className="mt-4 text-center">
              <button
                id="auth-mode-toggle-btn"
                type="button"
                onClick={() => {
                  setMode(mode === 'signup' ? 'signin' : 'signup');
                  setLocalError(null);
                  setResetSuccessMessage(null);
                }}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
              >
                {mode === 'signup'
                  ? 'Already have an account? Sign in'
                  : "Don't have an account? Sign up free"}
              </button>
            </div>
          </>
        )}

        {/* Back to sign in button (in forgot_password mode) */}
        {mode === 'forgot_password' && (
          <div className="mt-5 text-center">
            <button
              id="auth-back-to-signin-btn"
              type="button"
              onClick={() => {
                setMode('signin');
                setLocalError(null);
                setResetSuccessMessage(null);
              }}
              className="inline-flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Sign In</span>
            </button>
          </div>
        )}

        {/* Quick Admin test login helper */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
          <button
            id="auth-quick-admin-fill-btn"
            type="button"
            onClick={fillAdminTest}
            className="text-[11px] text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center justify-center gap-1 mx-auto transition-colors"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Fill Admin Credentials (rajht203@gmail.com)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
