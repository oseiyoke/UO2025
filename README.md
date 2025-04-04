# Wedding App

This is a Next.js application for a wedding event, allowing guests to view details and the program of events.

## PWA Support

This application has been configured as a Progressive Web App (PWA), which means users can install it on their devices and access it offline.

### Icons

For the PWA to work properly, you need to add the following icon files to the `public/icons` directory:

- icon-72x72.png (72x72 pixels)
- icon-96x96.png (96x96 pixels)
- icon-128x128.png (128x128 pixels)
- icon-144x144.png (144x144 pixels)
- icon-152x152.png (152x152 pixels)
- icon-192x192.png (192x192 pixels)
- icon-384x384.png (384x384 pixels)
- icon-512x512.png (512x512 pixels)

These should be square PNG images of the specified dimensions. You can use tools like [favicon.io](https://favicon.io/) to generate these icons from an image.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Supabase Integration

This application uses Supabase for data storage. To set up Supabase:

1. Create a Supabase account at [supabase.com](https://supabase.com)
2. Create a new project
3. Get your API credentials from the project settings
4. Create a `.env.local` file in the root directory with the following variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
5. Create the required database tables:
   - Create a `posts` table with columns:
     - `id` (integer, primary key)
     - `author` (text)
     - `message` (text)
     - `image_url` (text)
     - `created_at` (timestamp with timezone)
6. Set up Storage:
   - Create a new bucket called `wall-of-love` with public access enabled

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# UO2025
