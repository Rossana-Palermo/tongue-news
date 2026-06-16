/**
 * Converts a Unix timestamp (seconds) to a human-readable date string.
 * @param {number} timestamp - Unix timestamp in seconds
 * @returns {string} Formatted date string, e.g. "14 Jun 2025"
 */
export function formatDate(timestamp) {
  if (!timestamp || typeof timestamp !== 'number') return 'Date unknown';

  const date = new Date(timestamp * 1000);

  if (isNaN(date.getTime())) return 'Invalid date';

  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Extracts the domain from a URL for display purposes.
 * @param {string} url
 * @returns {string}
 */
export function extractDomain(url) {
  if (!url) return '';
  try {
    const { hostname } = new URL(url);
    return hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}