/**
 * Production Security Utilities for ToolStack
 * 
 * Provides robust input sanitization, XSS mitigation, URL validation,
 * safe filename handling, and file size validation.
 */

/**
 * Escapes unsafe HTML characters to prevent XSS injection.
 */
export function escapeHtml(str: string | null | undefined): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Validates and sanitizes a URL to ensure it uses safe protocols.
 * Explicitly blocks javascript:, vbscript:, file:, data: (unless explicitly allowed), and control characters.
 */
export function sanitizeUrl(
  url: string | null | undefined, 
  allowedProtocols: string[] = ['http:', 'https:', 'mailto:']
): string {
  if (!url) return '';
  const trimmed = String(url).trim();
  
  // Neutralize common protocol-spoofing tricks (e.g. "java\0script:", "javascript :")
  const normalized = trimmed.replace(/[\u0000-\u001F\u007F-\u009F\s]/g, '').toLowerCase();
  if (normalized.startsWith('javascript:') || normalized.startsWith('vbscript:') || normalized.startsWith('data:text/html')) {
    return '#';
  }

  try {
    // Relative paths are generally safe for internal navigation
    if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
      return trimmed;
    }

    const parsed = new URL(trimmed, 'https://toolstack-placeholder.internal');
    if (!allowedProtocols.includes(parsed.protocol)) {
      return '#';
    }

    // If data URL is allowed, only allow safe image MIME types
    if (parsed.protocol === 'data:') {
      if (/^data:image\/(png|jpeg|jpg|webp|gif|svg\+xml);base64,/i.test(trimmed)) {
        return trimmed;
      }
      return '#';
    }

    return trimmed;
  } catch {
    return '#';
  }
}

/**
 * Sanitizes an SVG string by stripping dangerous tags (script, iframe, object, foreignObject, etc.),
 * inline event handlers (onload, onerror, onclick, etc.), and javascript: references.
 */
export function sanitizeSvg(rawSvg: string | null | undefined): string {
  if (!rawSvg) return '';
  let svg = String(rawSvg).trim();

  // 1. Remove XML declarations and DOCTYPE entities to mitigate XXE
  svg = svg.replace(/<\?xml[\s\S]*?\?>/gi, '');
  svg = svg.replace(/<!DOCTYPE[\s\S]*?>/gi, '');
  svg = svg.replace(/<!ENTITY[\s\S]*?>/gi, '');

  // 2. Remove script, foreignObject, object, embed, iframe, link, meta, style tags
  svg = svg.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  svg = svg.replace(/<foreignObject\b[^<]*(?:(?!<\/foreignObject>)<[^<]*)*<\/foreignObject>/gi, '');
  svg = svg.replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '');
  svg = svg.replace(/<embed\b[^>]*>/gi, '');
  svg = svg.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
  svg = svg.replace(/<link\b[^>]*>/gi, '');
  svg = svg.replace(/<meta\b[^>]*>/gi, '');

  // 3. Remove inline event handlers (on[a-z]+ attributes, e.g. onload, onerror, onclick)
  svg = svg.replace(/\s+on[a-z]+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi, '');

  // 4. Remove javascript: in href or xlink:href attributes
  svg = svg.replace(/(?:href|xlink:href)\s*=\s*["']?\s*javascript:[^"'>\s]*["']?/gi, 'href="#"');

  // 5. Ensure root tag is <svg
  if (!/<svg\b/i.test(svg)) {
    return '';
  }

  return svg;
}

/**
 * Sanitizes a file name to prevent path traversal, null byte injections,
 * and dangerous executable extensions.
 */
export function sanitizeFileName(name: string | null | undefined, defaultFallback: string = 'document'): string {
  if (!name) return defaultFallback;

  // Remove directory traversal sequences and control characters
  let clean = String(name)
    .replace(/[\/\\]/g, '_')
    .replace(/\.\.+/g, '.')
    .replace(/[\x00-\x1f\x80-\x9f]/g, '')
    .trim();

  // Block dangerous executable extensions
  const dangerousExts = /\.(exe|bat|cmd|sh|vbs|msi|dll|scr|pif|reg|ps1|com|bin)$/i;
  if (dangerousExts.test(clean)) {
    clean = clean.replace(dangerousExts, '.txt');
  }

  return clean || defaultFallback;
}

/**
 * Validates uploaded file size and extension to prevent browser memory exhaustion.
 */
export function validateUploadedFile(
  file: File, 
  maxSizeBytes: number = 50 * 1024 * 1024,
  allowedMimePrefixes: string[] = ['application/pdf', 'image/', 'text/']
): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: 'No file provided.' };
  }

  if (file.size > maxSizeBytes) {
    const mbLimit = Math.round(maxSizeBytes / (1024 * 1024));
    return { valid: false, error: `File size exceeds the safe maximum limit of ${mbLimit}MB.` };
  }

  if (file.size === 0) {
    return { valid: false, error: 'File is empty.' };
  }

  const isMimeAllowed = allowedMimePrefixes.some(prefix => file.type.startsWith(prefix));
  if (file.type && !isMimeAllowed) {
    return { valid: false, error: `Unsupported file format: ${file.type}` };
  }

  return { valid: true };
}
