/**
 * Not Found (404) Page Tests
 * 
 * These tests verify that the 404 page:
 * 1. Shows a clear "not found" message
 * 2. Provides navigation back to safety
 * 3. Matches the Driftless aesthetic
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import NotFound from '@/app/not-found';

describe('Not Found (404) Component', () => {
    it('renders without crashing', () => {
        const { container } = render(<NotFound />);
        expect(container).toBeInTheDocument();
    });

    it('displays a clear not found message', () => {
        render(<NotFound />);

        // Should indicate the page wasn't found
        expect(screen.getByText(/not found|404|lost|trail.*end/i)).toBeInTheDocument();
    });

    it('has a heading for accessibility', () => {
        render(<NotFound />);

        const heading = screen.getByRole('heading');
        expect(heading).toBeInTheDocument();
    });

    it('provides a link to return home', () => {
        render(<NotFound />);

        const homeLink = screen.getByRole('link', { name: /home|guide|back|return/i });
        expect(homeLink).toHaveAttribute('href', '/');
    });

    it('uses Driftless typography (serif font classes)', () => {
        const { container } = render(<NotFound />);

        // Should use serif typography for headings
        const html = container.innerHTML;
        expect(html).toMatch(/font-serif/);
    });

    it('maintains consistent color scheme', () => {
        const { container } = render(<NotFound />);

        const html = container.innerHTML;
        // Should use earthy colors from the design system
        const hasDesignColors =
            html.includes('#FDFCFB') ||
            html.includes('#3E5C3D') ||
            html.includes('#2D2825') ||
            html.includes('bg-[#');

        expect(hasDesignColors).toBe(true);
    });
});
