import Link from 'next/link';
import { MapPin, Home } from 'lucide-react';

/**
 * 404 Not Found Component
 * 
 * Displays when a page cannot be found.
 * Uses the Driftless design aesthetic with helpful navigation.
 */
export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center px-6 py-24">
            <div className="max-w-lg text-center">
                {/* Decorative Icon */}
                <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-[#E2E8D4] text-[#3E5C3D]">
                    <MapPin size={36} strokeWidth={1.5} />
                </div>

                {/* 404 Badge */}
                <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#EBE3D5] px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#9A8F85]">
                    404 — Page Not Found
                </div>

                {/* Heading */}
                <h1 className="font-serif text-4xl font-bold text-[#2D2825] mb-4">
                    End of the Trail
                </h1>

                {/* Description */}
                <p className="text-lg text-[#6B5E55] mb-8 leading-relaxed">
                    The path you're looking for doesn't exist in our guide.
                    Perhaps the page has moved, or the trail has yet to be blazed.
                </p>

                {/* Action Button */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-3 rounded-2xl bg-[#3E5C3D] px-8 py-4 font-bold text-white shadow-lg transition-all hover:bg-[#2D2825] focus:outline-none focus:ring-2 focus:ring-[#3E5C3D] focus:ring-offset-2"
                >
                    <Home size={18} />
                    Return to the Guide
                </Link>

                {/* Exploration suggestions */}
                <div className="mt-16 pt-8 border-t border-[#EBE3D5]">
                    <p className="text-sm text-[#9A8F85] mb-4">Or explore these paths:</p>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <Link
                            href="/trails"
                            className="text-[#3E5C3D] font-bold hover:underline"
                        >
                            Driftless Trails
                        </Link>
                        <span className="text-[#EBE3D5]">•</span>
                        <Link
                            href="/pulse"
                            className="text-[#3E5C3D] font-bold hover:underline"
                        >
                            Community Pulse
                        </Link>
                    </div>
                </div>

                {/* Subtle branding */}
                <p className="mt-12 text-xs uppercase tracking-[0.2em] text-[#9A8F85]">
                    Viroqua Business Guide
                </p>
            </div>
        </div>
    );
}
