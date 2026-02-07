import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { Plus, Pencil, Clock, MapPin } from 'lucide-react';
import { DeleteButton } from '@/components/admin/DeleteButton';

export const dynamic = 'force-dynamic';

export default async function TrailsPage() {
    const { data: trails, error } = await supabase
        .from('trails')
        .select(`
            *,
            stops:trail_stops(id)
        `)
        .order('name');

    if (error) {
        console.error('Error fetching trails:', error);
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="font-serif text-4xl font-bold text-[#2D2825]">Trails</h1>
                    <p className="mt-2 text-[#6B5E55]">Manage curated itineraries through Viroqua</p>
                </div>
                <Link
                    href="/admin/trails/new"
                    className="flex items-center gap-2 px-5 py-3 bg-[#3E5C3D] text-white rounded-xl font-medium hover:bg-[#2D2825] transition-colors"
                >
                    <Plus size={18} />
                    Add Trail
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trails?.map((trail) => (
                    <div key={trail.id} className="bg-white rounded-2xl border border-[#EBE3D5] overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="relative aspect-video bg-[#FAF9F6]">
                            {trail.cover_image_url ? (
                                <Image
                                    src={trail.cover_image_url}
                                    alt={trail.name}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-[#9A8F85]">
                                    <MapPin size={48} />
                                </div>
                            )}
                        </div>
                        <div className="p-6">
                            <div className="flex items-center gap-3 mb-3 text-xs text-[#9A8F85]">
                                <span className="flex items-center gap-1">
                                    <Clock size={12} />
                                    {trail.duration_estimate || 'No duration'}
                                </span>
                                <span className="flex items-center gap-1">
                                    <MapPin size={12} />
                                    {trail.stops?.length || 0} stops
                                </span>
                            </div>
                            <h3 className="font-serif text-xl font-bold text-[#2D2825] mb-2">{trail.name}</h3>
                            <p className="text-sm text-[#6B5E55] line-clamp-2 mb-4">{trail.description || 'No description'}</p>

                            <div className="flex items-center justify-between pt-4 border-t border-[#EBE3D5]">
                                <span className={`px-2 py-1 text-xs font-medium rounded-lg ${trail.difficulty === 'Easy' ? 'bg-green-100 text-green-700' : trail.difficulty === 'Moderate' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                                    {trail.difficulty || 'Easy'}
                                </span>
                                <div className="flex items-center gap-2">
                                    <Link
                                        href={`/admin/trails/${trail.id}`}
                                        className="p-2 text-[#6B5E55] hover:text-[#3E5C3D] hover:bg-[#E2E8D4] rounded-lg transition-colors"
                                    >
                                        <Pencil size={16} />
                                    </Link>
                                    <DeleteButton
                                        table="trails"
                                        id={trail.id}
                                        name={trail.name}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {(!trails || trails.length === 0) && (
                    <div className="col-span-full py-12 text-center text-[#9A8F85] bg-white rounded-2xl border border-[#EBE3D5]">
                        No trails found. Create your first itinerary!
                    </div>
                )}
            </div>
        </div>
    );
}
