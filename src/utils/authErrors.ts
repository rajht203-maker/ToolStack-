/**
 * Human-friendly error mapper for Firebase Authentication codes and messages.
 */

export function getFriendlyAuthErrorMessage(error: any): string {
  if (!error) return 'An unexpected authentication error occurred. Please try again.';

  const code: string = error?.code || '';
  const rawMsg: string = error?.message || (typeof error === 'string' ? error : '');
  const hostname = typeof window !== 'undefined' ? window.location.hostname : 'current domain';

  // 1. Wrong Password / Invalid Credentials
  if (
    code === 'auth/wrong-password' ||
    code === 'auth/invalid-credential' ||
    rawMsg.includes('auth/wrong-password') ||
    rawMsg.includes('auth/invalid-credential')
  ) {
    return 'Invalid email or password. Please check your credentials or reset your password.';
  }

  // 2. User Not Found
  if (
    code === 'auth/user-not-found' ||
    rawMsg.includes('auth/user-not-found')
  ) {
    return 'No account found with this email. Please check your email or click Sign Up to create an account.';
  }

  // 3. Email Already in Use
  if (
    code === 'auth/email-already-in-use' ||
    rawMsg.includes('auth/email-already-in-use')
  ) {
    return 'An account already exists with this email address. Please switch to Sign In.';
  }

  // 4. Invalid Email Address
  if (
    code === 'auth/invalid-email' ||
    rawMsg.includes('auth/invalid-email')
  ) {
    return 'Please enter a valid email address (e.g. name@example.com).';
  }

  // 5. Weak Password
  if (
    code === 'auth/weak-password' ||
    rawMsg.includes('auth/weak-password')
  ) {
    return 'Password is too weak. Please use at least 6 characters.';
  }

  // 6. Popup Blocked / Window Blocked
  if (
    code === 'auth/popup-blocked' ||
    rawMsg.includes('auth/popup-blocked')
  ) {
    return 'The sign-in popup was blocked by your browser. Please allow popups for this site or open the app in a new tab.';
  }

  // 7. Popup Closed / Cancelled
  if (
    code === 'auth/popup-closed-by-user' ||
    rawMsg.includes('auth/popup-closed-by-user')
  ) {
    return 'Sign-in was cancelled because the popup window was closed before completion. Please try again.';
  }

  if (
    code === 'auth/cancelled-popup-request' ||
    rawMsg.includes('auth/cancelled-popup-request')
  ) {
    return 'Another authentication request was already pending. Please try again.';
  }

  // 8. Network Error
  if (
    code === 'auth/network-request-failed' ||
    rawMsg.includes('auth/network-request-failed') ||
    rawMsg.toLowerCase().includes('network')
  ) {
    return 'Network connection failed. Please check your internet connection and try again.';
  }

  // 9. Unauthorized Domain (Live hosted domain compatibility!)
  if (
    code === 'auth/unauthorized-domain' ||
    rawMsg.includes('auth/unauthorized-domain')
  ) {
    return `Hosted domain "${hostname}" is not authorized for Firebase Auth. In Firebase Console, go to Authentication > Settings > Authorized domains, and add "${hostname}".`;
  }

  // 10. Operation Not Allowed (Sign-in provider disabled in console)
  if (
    code === 'auth/operation-not-allowed' ||
    rawMsg.includes('auth/operation-not-allowed')
  ) {
    return 'This sign-in method is currently disabled in your Firebase project. In Firebase Console, go to Authentication > Sign-in method, and enable Email/Password and Google.';
  }

  // 11. Too Many Requests (Rate limit / temporary lockout)
  if (
    code === 'auth/too-many-requests' ||
    rawMsg.includes('auth/too-many-requests')
  ) {
    return 'Access temporarily disabled due to multiple failed login attempts. Please wait a few minutes or reset your password.';
  }

  // 12. User Disabled
  if (
    code === 'auth/user-disabled' ||
    rawMsg.includes('auth/user-disabled')
  ) {
    return 'This account has been disabled by an administrator. Please contact support.';
  }

  // 13. Invalid API Key / Configuration error
  if (
    code === 'auth/invalid-api-key' ||
    code === 'auth/configuration-not-found' ||
    code === 'auth/app-not-authorized' ||
    rawMsg.includes('auth/invalid-api-key') ||
    rawMsg.includes('auth/configuration-not-found')
  ) {
    return 'Firebase configuration error. Please verify the Firebase project configuration in firebase-applet-config.json.';
  }

  // 14. Requires Recent Login
  if (
    code === 'auth/requires-recent-login' ||
    rawMsg.includes('auth/requires-recent-login')
  ) {
    return 'Please sign out and sign in again before performing this sensitive action.';
  }

  // Default fallback with cleaned message
  if (rawMsg) {
    // Strip "Firebase: Error (" and trailing ")."
    const cleaned = rawMsg
      .replace(/^Firebase:\s*Error\s*\(([^)]+)\)\.?/i, '$1')
      .replace(/^Error:\s*/i, '');
    return cleaned;
  }

  return 'Authentication failed. Please verify your credentials and try again.';
}
