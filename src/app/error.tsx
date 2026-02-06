'use client';

import Link from 'next/link';
import { RefreshCw, Home, AlertTriangle } from 'lucide-react';

interface ErrorBoundaryProps {
    error: Error & { digest?: string };
    reset: () => void;
}

/**
 * Global Error Boundary
 * 
 * Catches runtime errors and displays a user-friendly message
 * with options to retry or navigate home.
 */
export default function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
    return (
        <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center px-6 py-24">
            <div className="max-w-lg text-center">
                {/* Decorative Icon */}
                <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-[#E2E8D4] text-[#3E5C3D]">
                    <AlertTriangle size={36} strokeWidth={1.5} />
                </div>

                {/* Heading */}
                <h1 className="font-serif text-4xl font-bold text-[#2D2825] mb-4">
                    Something Went Wrong
                </h1>

                {/* User-friendly message (not raw error) */}
                <p className="text-lg text-[#6B5E55] mb-8 leading-relaxed">
                    We encountered some trouble loading this page.
                    The issue has been noted, and we're working on it.
                </p>

                {/* DEBUG INFO */}
                <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-xl text-left overflow-auto max-h-48">
                    <p className="text-xs font-mono text-red-800 break-all">
                        <strong>Error:</strong> {error.message || 'Unknown error'}
                    </p>
                    {error.digest && (
                        <p className="text-xs font-mono text-red-600 mt-2">
                            <strong>Digest:</strong> {error.digest}
                        </p>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                        onClick={reset}
                        className="inline-flex items-center gap-3 rounded-2xl bg-[#3E5C3D] px-8 py-4 font-bold text-white shadow-lg transition-all hover:bg-[#2D2825] focus:outline-none focus:ring-2 focus:ring-[#3E5C3D] focus:ring-offset-2"
                    >
                        <RefreshCw size={18} />
                        Try Again
                    </button>

                    <Link
                        href="/"
                        className="inline-flex items-center gap-3 rounded-2xl border border-[#EBE3D5] bg-white px-8 py-4 font-bold text-[#3E5C3D] transition-all hover:border-[#3E5C3D] focus:outline-none focus:ring-2 focus:ring-[#3E5C3D] focus:ring-offset-2"
                    >
                        <Home size={18} />
                        Back to Guide
                    </Link>
                </div>

                {/* Subtle branding */}
                <p className="mt-16 text-xs uppercase tracking-[0.2em] text-[#9A8F85]">
                    Viroqua Business Guide
                </p>
            </div>
        </div>
    );
}
