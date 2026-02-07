'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, X, Check } from 'lucide-react';

interface Category {
    id: string;
    name: string;
}

interface CategorySelectProps {
    categories: Category[];
    value: string;
    onChange: (categoryId: string) => void;
    placeholder?: string;
}

export function CategorySelect({ categories, value, onChange, placeholder = 'Select a category...' }: CategorySelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const selectedCategory = categories.find(c => c.id === value);

    const filtered = categories.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
                setSearch('');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Focus input when opening
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const handleSelect = (categoryId: string) => {
        onChange(categoryId);
        setIsOpen(false);
        setSearch('');
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange('');
        setSearch('');
    };

    return (
        <div ref={containerRef} className="relative">
            {/* Trigger */}
            <div
                role="combobox"
                aria-expanded={isOpen}
                tabIndex={0}
                onClick={() => setIsOpen(!isOpen)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setIsOpen(!isOpen);
                    }
                }}
                className={`w-full px-4 py-3 border rounded-xl text-left flex items-center justify-between transition-colors cursor-pointer ${isOpen ? 'border-[#3E5C3D] ring-1 ring-[#3E5C3D]/20' : 'border-[#EBE3D5]'
                    } bg-white hover:border-[#3E5C3D]/50`}
            >
                <span className={selectedCategory ? 'text-[#2D2825]' : 'text-[#9A8F85]'}>
                    {selectedCategory?.name || placeholder}
                </span>
                <div className="flex items-center gap-2">
                    {value && (
                        <span
                            role="button"
                            tabIndex={0}
                            onClick={handleClear}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    handleClear(e as unknown as React.MouseEvent);
                                }
                            }}
                            className="p-1 hover:bg-[#E2E8D4] rounded transition-colors cursor-pointer"
                        >
                            <X size={14} className="text-[#9A8F85]" />
                        </span>
                    )}
                    <ChevronDown
                        size={18}
                        className={`text-[#9A8F85] transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    />
                </div>
            </div>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white border border-[#EBE3D5] rounded-xl shadow-lg overflow-hidden">
                    {/* Search Input */}
                    <div className="p-2 border-b border-[#EBE3D5]">
                        <div className="relative">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A8F85]" />
                            <input
                                ref={inputRef}
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search categories..."
                                className="w-full pl-9 pr-4 py-2 text-sm border border-[#EBE3D5] rounded-lg focus:outline-none focus:border-[#3E5C3D]"
                            />
                        </div>
                    </div>

                    {/* Options List */}
                    <div className="max-h-60 overflow-y-auto">
                        {filtered.length === 0 ? (
                            <div className="px-4 py-3 text-sm text-[#9A8F85] text-center">
                                No categories found
                            </div>
                        ) : (
                            filtered.map(category => (
                                <button
                                    key={category.id}
                                    type="button"
                                    onClick={() => handleSelect(category.id)}
                                    className={`w-full px-4 py-2.5 text-left text-sm flex items-center justify-between hover:bg-[#FAF9F6] transition-colors ${value === category.id ? 'bg-[#E2E8D4] text-[#3E5C3D]' : 'text-[#2D2825]'
                                        }`}
                                >
                                    <span>{category.name}</span>
                                    {value === category.id && (
                                        <Check size={16} className="text-[#3E5C3D]" />
                                    )}
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
