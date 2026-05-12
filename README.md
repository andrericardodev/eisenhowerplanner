# Eisenhower Planner

SaaS MVP for personal and professional task planning with the Eisenhower Matrix.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Auth and Postgres
- dnd kit

## Local Setup

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the Supabase SQL editor.
3. Copy `.env.example` to `.env.local` and fill in the values.
4. Install dependencies and start the app.

```bash
npm install
npm run dev
```

## Supabase Auth

In Supabase, enable email confirmations under Authentication settings. Add these redirect URLs:

- `http://localhost:3000/auth/callback`
- `http://localhost:3000/reset-password`
- Your future Vercel production URLs.

## Google OAuth

1. In Google Cloud Console, create an OAuth 2.0 Client ID for a web app.
2. Add this authorized redirect URI:
   `https://<project-ref>.supabase.co/auth/v1/callback`
3. In Supabase Auth Providers, enable Google and paste the Client ID and Client Secret.
4. Add the app callback URLs in Supabase Auth URL configuration.
