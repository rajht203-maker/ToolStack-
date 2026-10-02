/**
 * Privacy utilities to protect user email and name across ToolStack
 */

export function maskEmail(email?: string | null): string {
  if (!email || !email.includes('@')) return '';
  const [localPart, domain] = email.split('@');
  if (localPart.length <= 1) {
    return `*@${domain}`;
  }
  if (localPart.length <= 3) {
    return `${localPart[0]}***@${domain}`;
  }
  return `${localPart.slice(0, 2)}***@${domain}`;
}

export function maskName(name?: string | null): string {
  if (!name || !name.trim()) return 'Anonymous Member';
  const clean = name.trim();
  if (clean.includes('@')) {
    return maskEmail(clean);
  }
  if (clean.length <= 2) {
    return `${clean[0]}*`;
  }
  return `${clean[0]}***${clean[clean.length - 1]}`;
}

const PRIVACY_MODE_KEY = 'toolstack_private_identity';

export function isPrivacyModeEnabled(): boolean {
  if (typeof window === 'undefined') return true;
  const stored = localStorage.getItem(PRIVACY_MODE_KEY);
  // Default to true (strict privacy protection enabled by default)
  return stored === null ? true : stored === 'true';
}

export function setPrivacyMode(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PRIVACY_MODE_KEY, String(enabled));
  window.dispatchEvent(new Event('toolstack_privacy_change'));
}
