export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    public: {
        Tables: {
            businesses: {
                Row: {
                    address: string | null
                    booking_url: string | null
                    category_id: string | null
                    certifications: string[] | null
                    city: string | null
                    created_at: string
                    description: string | null
                    email: string | null
                    facebook_url: string | null
                    hero_image_url: string | null
                    id: string
                    instagram_url: string | null
                    is_active: boolean | null
                    latitude: number | null
                    logo_url: string | null
                    longitude: number | null
                    menu_url: string | null
                    name: string
                    opening_hours: Json | null
                    owner_id: string | null
                    owner_name: string | null
                    phone: string | null
                    slug: string
                    state: string | null
                    tagline: string | null
                    updated_at: string
                    website: string | null
                    year_established: number | null
                    zip: string | null
                }
                Insert: {
                    address?: string | null
                    booking_url?: string | null
                    category_id?: string | null
                    certifications?: string[] | null
                    city?: string | null
                    created_at?: string
                    description?: string | null
                    email?: string | null
                    facebook_url?: string | null
                    hero_image_url?: string | null
                    id?: string
                    instagram_url?: string | null
                    is_active?: boolean | null
                    latitude?: number | null
                    logo_url?: string | null
                    longitude?: number | null
                    menu_url?: string | null
                    name: string
                    opening_hours?: Json | null
                    owner_id?: string | null
                    owner_name?: string | null
                    phone?: string | null
                    slug: string
                    state?: string | null
                    tagline?: string | null
                    updated_at?: string
                    website?: string | null
                    year_established?: number | null
                    zip?: string | null
                }
                Update: {
                    address?: string | null
                    booking_url?: string | null
                    category_id?: string | null
                    certifications?: string[] | null
                    city?: string | null
                    created_at?: string
                    description?: string | null
                    email?: string | null
                    facebook_url?: string | null
                    hero_image_url?: string | null
                    id?: string
                    instagram_url?: string | null
                    is_active?: boolean | null
                    latitude?: number | null
                    logo_url?: string | null
                    longitude?: number | null
                    menu_url?: string | null
                    name?: string
                    opening_hours?: Json | null
                    owner_id?: string | null
                    owner_name?: string | null
                    phone?: string | null
                    slug?: string
                    state?: string | null
                    tagline?: string | null
                    updated_at?: string
                    website?: string | null
                    year_established?: number | null
                    zip?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "businesses_category_id_fkey"
                        columns: ["category_id"]
                        isOneToOne: false
                        referencedRelation: "categories"
                        referencedColumns: ["id"]
                    },
                ]
            }
            categories: {
                Row: {
                    created_at: string
                    description: string | null
                    id: string
                    name: string
                    parent_id: string | null
                    slug: string
                }
                Insert: {
                    created_at?: string
                    description?: string | null
                    id?: string
                    name: string
                    parent_id?: string | null
                    slug: string
                }
                Update: {
                    created_at?: string
                    description?: string | null
                    id?: string
                    name?: string
                    parent_id?: string | null
                    slug?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "categories_parent_id_fkey"
                        columns: ["parent_id"]
                        isOneToOne: false
                        referencedRelation: "categories"
                        referencedColumns: ["id"]
                    },
                ]
            }
            community_updates: {
                Row: {
                    business_id: string | null
                    content: string
                    created_at: string
                    id: string
                    type: string
                }
                Insert: {
                    business_id?: string | null
                    content: string
                    created_at?: string
                    id?: string
                    type: string
                }
                Update: {
                    business_id?: string | null
                    content?: string
                    created_at?: string
                    id?: string
                    type?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "community_updates_business_id_fkey"
                        columns: ["business_id"]
                        isOneToOne: false
                        referencedRelation: "businesses"
                        referencedColumns: ["id"]
                    },
                ]
            }
            trail_stops: {
                Row: {
                    business_id: string | null
                    created_at: string | null
                    id: string
                    position: number
                    tip: string | null
                    trail_id: string | null
                    travel_time_to_next: string | null
                }
                Insert: {
                    business_id?: string | null
                    created_at?: string | null
                    id?: string
                    position: number
                    tip?: string | null
                    trail_id?: string | null
                    travel_time_to_next?: string | null
                }
                Update: {
                    business_id?: string | null
                    created_at?: string | null
                    id?: string
                    position?: number
                    tip?: string | null
                    trail_id?: string | null
                    travel_time_to_next?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "trail_stops_business_id_fkey"
                        columns: ["business_id"]
                        isOneToOne: false
                        referencedRelation: "businesses"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "trail_stops_trail_id_fkey"
                        columns: ["trail_id"]
                        isOneToOne: false
                        referencedRelation: "trails"
                        referencedColumns: ["id"]
                    },
                ]
            }
            trails: {
                Row: {
                    cover_image_url: string | null
                    created_at: string | null
                    description: string | null
                    difficulty: string | null
                    duration_estimate: string | null
                    id: string
                    name: string
                    slug: string
                }
                Insert: {
                    cover_image_url?: string | null
                    created_at?: string | null
                    description?: string | null
                    difficulty?: string | null
                    duration_estimate?: string | null
                    id?: string
                    name: string
                    slug: string
                }
                Update: {
                    cover_image_url?: string | null
                    created_at?: string | null
                    description?: string | null
                    difficulty?: string | null
                    duration_estimate?: string | null
                    id?: string
                    name?: string
                    slug?: string
                }
                Relationships: []
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}

// Helper types for easier usage
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Insertable<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type Updateable<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];
