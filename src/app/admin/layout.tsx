'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, Store, MapPin, FolderTree, Home } from 'lucide-react';
import { clsx } from 'clsx';

const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutGrid },
    { href: '/admin/categories', label: 'Categories', icon: FolderTree },
    { href: '/admin/businesses', label: 'Businesses', icon: Store },
    { href: '/admin/trails', label: 'Trails', icon: MapPin },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="min-h-screen bg-[#FAF9F6] flex">
            {/* Sidebar */}
            <aside className="w-64 bg-[#2D2825] text-white flex flex-col">
                <div className="p-6 border-b border-white/10">
                    <Link href="/" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm">
                        <Home size={16} />
                        Back to Site
                    </Link>
                    <h1 className="mt-4 font-serif text-2xl font-bold">
                        Admin<span className="text-[#3E5C3D]">Panel</span>
                    </h1>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href ||
                            (item.href !== '/admin' && pathname.startsWith(item.href));
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={clsx(
                                    'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                                    isActive
                                        ? 'bg-[#3E5C3D] text-white shadow-lg'
                                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                                )}
                            >
                                <Icon size={18} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/10 text-xs text-white/40">
                    Viroqua Business Guide v0.1
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
