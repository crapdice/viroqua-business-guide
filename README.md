# Viroqua Business Guide

A curated business directory for Viroqua, Wisconsin and the Driftless region. Built with Next.js 16, Tailwind CSS 4, and Supabase.

## Features

- 🏪 **Business Directory** - 200+ local businesses organized by category
- 🥾 **Driftless Trails** - Curated itineraries through Viroqua
- 📱 **Social Pulse** - Real-time updates from local businesses
- 🎨 **Artisan Almanac Aesthetic** - Heritage-inspired design system

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS 4
- **Database**: Supabase (PostgreSQL)
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and fill in your Supabase credentials
4. Run the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key |

## Deployment

This app is optimized for Vercel deployment. Simply connect your GitHub repository and Vercel will auto-detect the Next.js configuration.

## License

Private - All rights reserved.
