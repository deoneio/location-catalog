# Location Catalog (ShareLoc)

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Available Routes

The application uses file-based routing. The following placeholder pages are currently available:

- `/` - Homepage
- `/catalog` - Catalog / Listing Page
- `/catalog/[slug]` - Location Detail Page (e.g. `/catalog/industrial-loft`)
- `/testimonials` - Testimonials Page
- `/contact` - Contact Us Page

## API Mocking & Proxy

The application supports both a real Directus API connection via proxy and local mock endpoints for development without a CMS instance.

To configure this, copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

### 1. Using the Mock API (Default)
By default, the `.env` contains `USE_MOCK=true`. In this mode, Nuxt will serve hardcoded mock data for locations and testimonials via its internal server routes (`/server/api/items/...`).

### 2. Using the Real Directus API
To connect to your real Directus instance, update your `.env` file:
- Set `USE_MOCK=false` (or remove the line entirely)
- Set `DIRECTUS_URL=http://your-directus-instance:8055`

When `USE_MOCK` is disabled, Nuxt will automatically proxy all `/api/**` requests to your Directus instance.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
