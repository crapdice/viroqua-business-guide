export interface SocialPost {
    id: string;
    businessName: string;
    niche: string;
    avatarUrl: string;
    imageUrl: string;
    caption: string;
    timestamp: string;
    source: 'instagram' | 'facebook';
    postUrl: string;
}

export const MOCK_SOCIAL_POSTS: SocialPost[] = [
    {
        id: '1',
        businessName: 'Wonderstate Coffee',
        niche: 'Coffee Shops',
        avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Wonderstate',
        imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
        caption: 'Misty mornings in the Driftless perfectly matched with a fresh pour-over of our seasonal Ethiopia single origin. ☕️🌲',
        timestamp: '2h ago',
        source: 'instagram',
        postUrl: 'https://www.instagram.com/wonderstatecoffee/'
    },
    {
        id: '2',
        businessName: 'Viroqua Food Co+op',
        niche: 'Agriculture & Food Systems',
        avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Coop',
        imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
        caption: 'Local harvest alert! Fresh ramps and fiddleheads just arrived from the valley. Get them before they disappear! 🥗✨',
        timestamp: '4h ago',
        source: 'facebook',
        postUrl: 'https://www.facebook.com/ViroquaFoodCoop/'
    },
    {
        id: '3',
        businessName: 'The Temple Theatre',
        niche: 'Theatres',
        avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Temple',
        imageUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80',
        caption: 'Sold out crowd tonight for the Driftless Music Festival kickoff! 🎟️🎸',
        timestamp: '1d ago',
        source: 'instagram',
        postUrl: 'https://www.instagram.com/templetheatreviroqua/'
    },
    {
        id: '4',
        businessName: 'Driftless Provisions',
        niche: 'Local Food Producers',
        avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Provisions',
        imageUrl: 'https://images.unsplash.com/photo-1534120247760-c44c3e4a62f1?auto=format&fit=crop&w=800&q=80',
        caption: 'New batch of Elk salami is out of the curing room. Smoky, earthy, and perfectly paired with a sharp cheddar. 🧀🥓',
        timestamp: '6h ago',
        source: 'instagram',
        postUrl: 'https://www.instagram.com/driftlessprovisions/'
    },
    {
        id: '5',
        businessName: 'Viroqua Public Market',
        niche: 'Shopping & Retail',
        avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Market',
        imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
        caption: 'Treasures found at the Market today. 🏺📖 Every corner has a story.',
        timestamp: '3h ago',
        source: 'facebook',
        postUrl: 'https://www.facebook.com/viroquapublicmarket/'
    },
    {
        id: '6',
        businessName: 'LuSa Organics',
        niche: 'Personal Care & Wellness',
        avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=LuSa',
        imageUrl: 'https://images.unsplash.com/photo-1556228578-8c7c0f44bb0b?auto=format&fit=crop&w=800&q=80',
        caption: 'The shop smells like lavender and sunshine today. 🛁🌿 Hand-crafting a fresh batch of our classic soap.',
        timestamp: '5h ago',
        source: 'instagram',
        postUrl: 'https://www.instagram.com/lusaorganics/'
    }
];
