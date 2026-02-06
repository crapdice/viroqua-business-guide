/**
 * Error Boundary Tests
 * 
 * These tests verify that the global error boundary component:
 * 1. Renders a user-friendly error message
 * 2. Provides a reset/retry action
 * 3. Matches the Driftless design aesthetic
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary from '@/app/error';

describe('Error Boundary Component', () => {
    const mockError = new Error('Test database connection failed');
    const mockReset = vi.fn();

    beforeEach(() => {
        mockReset.mockClear();
    });

    it('renders an error message to the user', () => {
        render(<ErrorBoundary error={mockError} reset={mockReset} />);

        // Should have a heading indicating something went wrong
        expect(screen.getByRole('heading')).toBeInTheDocument();
    });

    it('displays user-friendly text, not raw error messages', () => {
        render(<ErrorBoundary error={mockError} reset={mockReset} />);

        // Should NOT show raw error stack traces to users
        expect(screen.queryByText(/Test database connection failed/)).not.toBeInTheDocument();

        // Should show helpful guidance - matches "Something Went Wrong"
        const heading = screen.getByRole('heading');
        expect(heading.textContent).toMatch(/went wrong|trouble|error/i);
    });

    it('provides a retry/reset button', () => {
        render(<ErrorBoundary error={mockError} reset={mockReset} />);

        const retryButton = screen.getByRole('button', { name: /try again|retry|reset/i });
        expect(retryButton).toBeInTheDocument();
    });

    it('calls reset function when retry button is clicked', () => {
        render(<ErrorBoundary error={mockError} reset={mockReset} />);

        const retryButton = screen.getByRole('button', { name: /try again|retry|reset/i });
        fireEvent.click(retryButton);

        expect(mockReset).toHaveBeenCalledTimes(1);
    });

    it('provides a link back to the homepage', () => {
        render(<ErrorBoundary error={mockError} reset={mockReset} />);

        const homeLink = screen.getByRole('link', { name: /home|guide|back/i });
        expect(homeLink).toHaveAttribute('href', '/');
    });

    it('uses the Driftless design aesthetic (sage green accent)', () => {
        const { container } = render(<ErrorBoundary error={mockError} reset={mockReset} />);

        // Check that sage green (#3E5C3D) or similar is used somewhere
        const html = container.innerHTML;
        expect(html).toMatch(/#3E5C3D|text-\[#3E5C3D\]|bg-\[#3E5C3D\]/i);
    });
});
