/**
 * HTML Sanitization Utilities
 * Remove HTML tags from descriptions and truncate text
 */

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
