/**
 * Loading State Tests
 * 
 * These tests verify that loading skeleton components:
 * 1. Render immediately (no flashing)
 * 2. Have accessible loading indicators
 * 3. Match the Driftless design aesthetic
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Loading from '@/app/loading';

describe('Global Loading Component', () => {
    it('renders without crashing', () => {
        const { container } = render(<Loading />);
        expect(container).toBeInTheDocument();
    });

    it('has an accessible loading indicator', () => {
        render(<Loading />);

        // Should have either aria-busy, aria-live, or role="status"
        const loadingElement = screen.getByRole('status')
            || screen.getByLabelText(/loading/i)
            || document.querySelector('[aria-busy="true"]');

        expect(loadingElement).toBeTruthy();
    });

    it('includes skeleton placeholders for content', () => {
        const { container } = render(<Loading />);

        // Should have animated skeleton elements (pulsing/shimmer)
        const skeletonElements = container.querySelectorAll('[class*="animate"]');
        expect(skeletonElements.length).toBeGreaterThan(0);
    });

    it('uses the parchment background color', () => {
        const { container } = render(<Loading />);

        // Should use the Driftless parchment color
        const html = container.innerHTML;
        expect(html).toMatch(/#FDFCFB|bg-\[#FDFCFB\]/i);
    });

    it('displays the app name or logo', () => {
        const { container } = render(<Loading />);

        // Should show something indicating this is the Viroqua Guide
        // Using container query since there are multiple text nodes matching
        const brandText = container.textContent;
        expect(brandText).toMatch(/viroqua/i);
        expect(brandText).toMatch(/guide/i);
    });
});
