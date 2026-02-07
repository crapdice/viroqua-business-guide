'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Loader2 } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface DeleteButtonProps {
    table: string;
    id: string;
    name: string;
}

export function DeleteButton({ table, id, name }: DeleteButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const { error } = await supabase.from(table).delete().eq('id', id);
            if (error) throw error;
            router.refresh();
        } catch (err) {
            console.error('Delete error:', err);
            alert('Failed to delete. It may have related records.');
        } finally {
            setIsDeleting(false);
            setShowConfirm(false);
        }
    };

    if (showConfirm) {
        return (
            <div className="flex items-center gap-2">
                <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="px-3 py-1 text-xs bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
                >
                    {isDeleting ? <Loader2 size={14} className="animate-spin" /> : 'Confirm'}
                </button>
                <button
                    onClick={() => setShowConfirm(false)}
                    className="px-3 py-1 text-xs bg-[#EBE3D5] text-[#2D2825] rounded-lg hover:bg-[#E2E8D4]"
                >
                    Cancel
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={() => setShowConfirm(true)}
            className="p-2 text-[#6B5E55] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title={`Delete ${name}`}
        >
            <Trash2 size={16} />
        </button>
    );
}
