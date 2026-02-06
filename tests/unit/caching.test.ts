/**
 * Caching Strategy Tests
 * 
 * These tests verify that pages use ISR (Incremental Static Regeneration)
 * instead of force-dynamic rendering. This improves performance by caching
 * pages and revalidating them periodically.
 * 
 * Expected behavior:
 * - Pages should NOT export `dynamic = 'force-dynamic'`
 * - Pages SHOULD export `revalidate` with a reasonable TTL
 */

import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

const SRC_DIR = path.join(__dirname, '../../src/app');

// Helper to read file contents
function readPageFile(relativePath: string): string {
    const fullPath = path.join(SRC_DIR, relativePath);
    return fs.readFileSync(fullPath, 'utf-8');
}

describe('Caching Strategy - ISR Configuration', () => {
    const pagesToCheck = [
        'page.tsx',                           // Homepage
        'trails/page.tsx',                    // Trails listing
        'trails/[slug]/page.tsx',             // Trail detail
        'categories/[slug]/page.tsx',         // Category listing
        'businesses/[slug]/page.tsx',         // Business detail
    ];

    describe.each(pagesToCheck)('%s', (pagePath) => {
        it('should NOT use force-dynamic', () => {
            const content = readPageFile(pagePath);

            // force-dynamic should not be present
            expect(content).not.toMatch(/export\s+const\s+dynamic\s*=\s*['"]force-dynamic['"]/);
        });

        it('should export a revalidate value for ISR', () => {
            const content = readPageFile(pagePath);

            // Should have a revalidate export
            const hasRevalidate = /export\s+const\s+revalidate\s*=\s*\d+/.test(content);
            expect(hasRevalidate).toBe(true);
        });

        it('should have a revalidate value between 60 and 86400 seconds', () => {
            const content = readPageFile(pagePath);

            // Extract the revalidate value
            const match = content.match(/export\s+const\s+revalidate\s*=\s*(\d+)/);
            expect(match).not.toBeNull();

            if (match) {
                const revalidateSeconds = parseInt(match[1], 10);
                // At least 1 minute, at most 24 hours
                expect(revalidateSeconds).toBeGreaterThanOrEqual(60);
                expect(revalidateSeconds).toBeLessThanOrEqual(86400);
            }
        });
    });
});
