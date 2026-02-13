This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Features

- **Automatic Skin Sync**: Daily cron job syncs new Valorant skins from the official API
- **User Collections**: Track owned skins and create wishlists
- **Loadout Builder**: Create and manage custom weapon loadouts
- **Authentication**: Email-based authentication with NextAuth

## Getting Started

### Environment Setup

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Configure your environment variables:
   - `DATABASE_URL`: Your PostgreSQL database connection string
   - `NEXTAUTH_URL`: Your application URL (default: `http://localhost:3000`)
   - `NEXTAUTH_SECRET`: Random secret for NextAuth (generate with: `openssl rand -base64 32`)
   - `EMAIL_SERVER`: SMTP server for email authentication
   - `EMAIL_FROM`: Sender email address
   - `CRON_SECRET`: Secure secret for protecting the skin sync endpoint (generate with: `openssl rand -base64 32`)

### Database Setup

1. Initialize the database:
```bash
npx prisma migrate deploy
```

2. Seed initial skin data:
```bash
npx prisma db seed
```

### Run the Development Server

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

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Automatic Skin Sync

The application automatically syncs new Valorant skins daily using a scheduled cron job.

### How It Works

1. **Scheduled Execution**: A cron job runs daily at midnight (UTC) via Vercel Cron
2. **API Sync**: Fetches latest skin data from `https://valorant-api.com`
3. **Database Update**: Adds new skins and updates existing ones automatically
4. **Protected Endpoint**: The sync endpoint is secured with the `CRON_SECRET` environment variable

### Vercel Deployment

When deployed on Vercel, the cron job is configured in `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/sync/skins",
      "schedule": "0 0 * * *"
    }
  ]
}
```

**Important**: Make sure to add `CRON_SECRET` to your Vercel environment variables:
1. Go to your project settings on Vercel
2. Navigate to Environment Variables
3. Add `CRON_SECRET` with a secure random value

Vercel automatically includes the authorization header when calling cron endpoints.

### Alternative: Self-Hosted or External Cron

If not using Vercel, you can trigger the sync manually with:

```bash
curl -X POST https://your-domain.com/api/sync/skins \
  -H "Authorization: Bearer your-cron-secret"
```

#### Option 1: GitHub Actions

A GitHub Actions workflow is included at `.github/workflows/sync-skins.yml` that runs daily.

To enable it:
1. Go to your GitHub repository settings
2. Navigate to Secrets and Variables → Actions
3. Add two secrets:
   - `APP_URL`: Your deployed application URL (e.g., `https://your-app.vercel.app`)
   - `CRON_SECRET`: Same value as your application's `CRON_SECRET` environment variable
4. Enable GitHub Actions in your repository

The workflow runs daily at midnight UTC and can also be triggered manually from the Actions tab.

#### Option 2: External Cron Services

Set up a scheduled HTTP request with services like:
- **cron-job.org** (https://cron-job.org/)
- **EasyCron** (https://www.easycron.com/)
- **Your own server's crontab**

Example schedule: `0 0 * * *` (daily at midnight)

### Manual Sync

To manually trigger a sync during development:

```bash
curl -X POST http://localhost:3000/api/sync/skins \
  -H "Authorization: Bearer your-cron-secret"
```

The endpoint returns statistics about the sync:
```json
{
  "success": true,
  "stats": {
    "new": 5,
    "updated": 120,
    "skipped": 3,
    "total": 125,
    "duration": "2341ms"
  },
  "timestamp": "2026-02-13T10:30:00.000Z"
}
```
