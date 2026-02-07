'use client';

import { useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { clsx } from 'clsx';

// Curated list of icons suitable for business categories
const CATEGORY_ICONS = [
    'Utensils', 'Coffee', 'Beer', 'Wine', 'Pizza', 'Salad', 'IceCream', 'Cake',
    'ShoppingBag', 'ShoppingCart', 'Gift', 'Shirt', 'Gem', 'Watch',
    'Palette', 'Camera', 'Music', 'Mic', 'Theater', 'Clapperboard',
    'Hammer', 'Wrench', 'HardHat', 'Zap', 'Droplet', 'Thermometer',
    'Heart', 'Activity', 'Stethoscope', 'Pill', 'Brain', 'Dumbbell', 'Bike',
    'Scissors', 'Sparkles', 'Brush', 'Smile',
    'Car', 'Truck', 'Fuel', 'Cog',
    'Book', 'GraduationCap', 'Lightbulb', 'Landmark',
    'Home', 'Building2', 'Building', 'Store', 'Warehouse',
    'Leaf', 'Trees', 'Flower2', 'Sprout', 'Apple',
    'Dog', 'Cat', 'Bird', 'Fish', 'PawPrint',
    'Briefcase', 'Calculator', 'FileText', 'Scale', 'Gavel',
    'Wifi', 'Monitor', 'Smartphone', 'Laptop', 'Server', 'Code',
    'Plane', 'MapPin', 'Compass', 'Mountain', 'Tent', 'Backpack',
    'Church', 'Cross', 'Moon', 'Sun', 'Star',
];

interface IconPickerProps {
    value: string;
    onChange: (iconName: string) => void;
}

export function IconPicker({ value, onChange }: IconPickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');

    const filteredIcons = CATEGORY_ICONS.filter(name =>
        name.toLowerCase().includes(search.toLowerCase())
    );

    const SelectedIcon = value ? (LucideIcons as any)[value] : null;

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 w-full px-4 py-3 border border-[#EBE3D5] rounded-xl bg-white hover:border-[#3E5C3D] transition-colors"
            >
                {SelectedIcon ? (
                    <>
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E2E8D4] text-[#3E5C3D]">
                            <SelectedIcon size={20} />
                        </div>
                        <span className="text-[#2D2825] font-medium">{value}</span>
                    </>
                ) : (
                    <span className="text-[#9A8F85]">Select an icon...</span>
                )}
            </button>

            {isOpen && (
                <div className="absolute z-50 mt-2 w-full max-h-80 overflow-auto bg-white border border-[#EBE3D5] rounded-xl shadow-xl">
                    <div className="sticky top-0 bg-white p-3 border-b border-[#EBE3D5]">
                        <input
                            type="text"
                            placeholder="Search icons..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full px-3 py-2 border border-[#EBE3D5] rounded-lg text-sm focus:outline-none focus:border-[#3E5C3D]"
                        />
                    </div>
                    <div className="p-3 grid grid-cols-6 gap-2">
                        {filteredIcons.map((iconName) => {
                            const Icon = (LucideIcons as any)[iconName];
                            if (!Icon) return null;
                            return (
                                <button
                                    key={iconName}
                                    type="button"
                                    onClick={() => {
                                        onChange(iconName);
                                        setIsOpen(false);
                                        setSearch('');
                                    }}
                                    className={clsx(
                                        'flex flex-col items-center justify-center p-2 rounded-lg transition-colors',
                                        value === iconName
                                            ? 'bg-[#3E5C3D] text-white'
                                            : 'hover:bg-[#E2E8D4] text-[#2D2825]'
                                    )}
                                    title={iconName}
                                >
                                    <Icon size={20} />
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
