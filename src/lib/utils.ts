/**
 * Normalizes URLs to ensure they're valid for Next.js Image component
 * - Converts protocol-relative URLs (//...) to absolute URLs (https://...)
 * - Returns null for invalid URLs
 */
export function normalizeImageUrl(url: string | null | undefined): string | null {
    if (!url) return null;

    // Handle protocol-relative URLs
    if (url.startsWith('//')) {
        return `https:${url}`;
    }

    return url;
}
