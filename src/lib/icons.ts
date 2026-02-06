import {
    Utensils, Coffee, ShoppingBag, Briefcase, HeartPulse,
    Palette, Wrench, Bed, Calculator, Tractor,
    Sprout, Landmark, Book, Shirt, Users,
    Laptop, Hammer, Stethoscope, Wine, Beer,
    Sparkles, GraduationCap, Home, Smartphone, Film,
    ShoppingBasket, Mic2, Microscope, Building2, Store,
    Package, Scissors, Truck, Zap, Baby,
    Camera, Map, HelpCircle, AlertTriangle, Dumbbell,
    Heart, ShieldCheck, Newspaper, HeartHandshake,
    Printer, Code2, Tent, Warehouse, Building,
    Flower2, Globe2, School, Footprints, ClipboardList,
    ChefHat, Trees, Gavel
} from 'lucide-react';

const GavelIcon = Gavel;


export const CategoryIconMap: Record<string, any> = {
    // Top Level & Catch-alls
    'services': ClipboardList,
    'professional-services': Briefcase,
    'civic': Building2,
    'community': Users,
    'non-profits': HeartHandshake,

    // Food & Drink
    'eat-and-drink': ShoppingBasket,
    'dining-hospitality': Utensils,
    'dining-full': Utensils,
    'coffee': Coffee,
    'bars': Beer,
    'wineries': Wine,
    'bakeries': Coffee,
    'catering': ChefHat,
    'local-food': Sprout,
    'coops': ShoppingBasket,

    // Retail
    'shopping-and-retail': ShoppingBag,
    'specialty-retail': Store,
    'fashion': Shirt,
    'antiques': Landmark,
    'bookstores': Book,
    'home-goods': Home,
    'outdoor': Tent,
    'public-market': Store,

    // Trade & Industry
    'trade': Wrench,
    'agriculture': Sprout,
    'agri-business': Tractor,
    'construction': Hammer,
    'automotive': Truck,
    'energy': Zap,
    'wholesale': Warehouse,
    'print': Printer,
    'cleaning': Wrench,
    'farm-supply': Trees,
    'greenhouse': Flower2,

    // Health & Wellness
    'health-wellness': HeartPulse,
    'wellness': Sparkles,
    'fitness': Dumbbell,
    'dental': HeartPulse,
    'hospitals': Microscope,
    'elder-care': HeartHandshake,
    'vet': Heart,
    'spas': Scissors,

    // Professional Services (Specific)
    'accounting': Calculator,
    'legal': GavelIcon, // Need to import or use fallback
    'finance': Landmark,
    'insurance': ShieldCheck,
    'marketing': Newspaper,
    'consulting': Users,

    // Technology
    'it': Laptop,
    'software': Code2,
    'telecom': Smartphone,
    'technology': Laptop,

    // Culture & Lifestyle
    'arts-culture': Palette,
    'galleries': Camera,
    'museums': Building,
    'theatres': Film,
    'home-lifestyle': Map,
    'real-estate': Home,
    'schools': GraduationCap,
    'family-services': Footprints
};


export function getCategoryIcon(slug: string) {
    return CategoryIconMap[slug] || HelpCircle;
}

