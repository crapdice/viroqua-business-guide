/**
 * Normalizes business data for the Viroqua Directory.
 */

// Phone Cleaning: 6086377778 -> (608) 637-7778
function formatPhone(phone) {
    if (!phone) return null;
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length !== 10) return phone; // Return original if not 10 digits
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
}

// Slug Generation: "Driftless Café" -> "driftless-cafe"
function generateSlug(name) {
    if (!name) return null;
    return name
        .toString()
        .toLowerCase()
        .trim()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove accents
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-');  // Replace multiple - with single -
}

// URL Standardization: "example.com" -> "https://example.com"
function normalizeUrl(url) {
    if (!url) return null;
    let trimmed = url.trim();
    if (!/^https?:\/\//i.test(trimmed)) {
        trimmed = 'https://' + trimmed;
    }
    return trimmed;
}

module.exports = {
    formatPhone,
    generateSlug,
    normalizeUrl
};
