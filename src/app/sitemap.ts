import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://viroqua.guide';

    // 1. Static Routes
    const staticRoutes = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 1,
        },
        {
            url: `${baseUrl}/pulse`,
            lastModified: new Date(),
            changeFrequency: 'hourly' as const,
            priority: 0.8,
        },
    ];

    // 2. Category Routes
    const { data: categories } = await supabase
        .from('categories')
        .select('slug');

    const categoryRoutes = (categories || []).map((cat) => ({
        url: `${baseUrl}/categories/${cat.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    // 3. Business Routes
    const { data: businesses } = await supabase
        .from('businesses')
        .select('slug, updated_at')
        .eq('is_active', true);

    const businessRoutes = (businesses || []).map((biz) => ({
        url: `${baseUrl}/businesses/${biz.slug}`,
        lastModified: new Date(biz.updated_at || new Date()),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
    }));

    return [...staticRoutes, ...categoryRoutes, ...businessRoutes];
}
