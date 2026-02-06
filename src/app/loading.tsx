/**
 * Global Loading Component
 * 
 * Displays a skeleton loading state while pages are being fetched.
 * Uses the Driftless design aesthetic with animated placeholders.
 */
export default function Loading() {
    return (
        <div
            className="min-h-screen bg-[#FDFCFB] px-6 py-24"
            role="status"
            aria-label="Loading content"
            aria-busy="true"
        >
            <div className="mx-auto max-w-7xl">
                {/* Brand indicator */}
                <div className="mb-12 text-center">
                    <p className="font-serif text-2xl font-bold text-[#2D2825]">
                        Viroqua<span className="text-[#3E5C3D]">Guide</span>
                    </p>
                    <p className="mt-2 text-sm text-[#9A8F85]">Loading the Driftless...</p>
                </div>

                {/* Header skeleton */}
                <div className="mb-16">
                    <div className="h-4 w-32 animate-pulse rounded-full bg-[#EBE3D5]" />
                    <div className="mt-4 h-12 w-3/4 max-w-lg animate-pulse rounded-2xl bg-[#EBE3D5]" />
                    <div className="mt-4 h-6 w-1/2 max-w-md animate-pulse rounded-xl bg-[#EBE3D5]" />
                </div>

                {/* Content grid skeleton */}
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="rounded-2xl border border-[#EBE3D5] bg-white p-6">
                            {/* Image placeholder */}
                            <div className="aspect-[4/3] w-full animate-pulse rounded-xl bg-[#EBE3D5]" />

                            {/* Text placeholders */}
                            <div className="mt-6 space-y-3">
                                <div className="h-6 w-3/4 animate-pulse rounded-lg bg-[#EBE3D5]" />
                                <div className="h-4 w-full animate-pulse rounded-lg bg-[#EBE3D5]" />
                                <div className="h-4 w-2/3 animate-pulse rounded-lg bg-[#EBE3D5]" />
                            </div>

                            {/* Footer placeholder */}
                            <div className="mt-6 flex items-center justify-between pt-4 border-t border-[#EBE3D5]">
                                <div className="h-4 w-24 animate-pulse rounded-full bg-[#EBE3D5]" />
                                <div className="h-10 w-10 animate-pulse rounded-full bg-[#EBE3D5]" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
