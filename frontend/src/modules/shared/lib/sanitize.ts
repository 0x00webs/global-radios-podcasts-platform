/**
 * Sanitize HTML by removing dangerous tags and attributes
 */
export const sanitizeHtml = (html: string): string => {
  if (!html) return '';
  
  // Remove script tags and their content
  let sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove event handlers
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*"[^"]*"/gi, '');
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*'[^']*'/gi, '');
  
  return sanitized;
};

/**
 * Sanitize URL to prevent XSS via javascript: protocol
 */
export const sanitizeUrl = (url?: string): string => {
  if (!url) return '';
  
  try {
    // Only allow http/https
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return '';
    }
    
    new URL(url);
    return url;
  } catch {
    return '';
  }
};

/**
 * Strip HTML tags and decode HTML entities
 */
export function stripHtmlTags(html: string): string {
  if (!html) return '';
  
  // First, replace common HTML entities
  let text = html
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');
  
  // Remove script and style elements
  text = text.replace(/<script[^>]*>.*?<\/script>/gi, '');
  text = text.replace(/<style[^>]*>.*?<\/style>/gi, '');
  
  // Remove HTML tags
  text = text.replace(/<[^>]+>/g, '');
  
  // Remove extra whitespace
  text = text.replace(/\s+/g, ' ').trim();
  
  return text;
}

/**
 * Truncate text to a maximum length with ellipsis
 */
export function truncateText(text: string, maxLength: number = 150): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

/**
 * Clean and truncate HTML description
 */
export function cleanDescription(html: string, maxLength: number = 150): string {
  const stripped = stripHtmlTags(html);
  return truncateText(stripped, maxLength);
}
