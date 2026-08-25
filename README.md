# Location Catalog (ShareLoc)

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Prerequisites

Before setting up the project, ensure you have the following installed on your machine:

- **Node.js**: v18.0.0 or newer (v20+ recommended)
- **Git**: For version control
- **Package Manager**: npm (v9+), pnpm, yarn, or bun

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

**To add or update mock data:**
- Open `server/api/items/locations.get.ts` to add, edit, or remove mocked locations. The data structure mimics the Directus schema response.
- Open `server/api/items/testimonials.get.ts` to add or edit testimonials.

### 2. Using the Real Directus API
To connect to your real Directus instance, update your `.env` file:
- Set `USE_MOCK=false` (or remove the line entirely)
- Set `DIRECTUS_URL=http://your-directus-instance:8055`

When `USE_MOCK` is disabled, Nuxt will automatically proxy all `/api/**` requests to your Directus instance.

## Google Analytics

The site can report page views, clicks, and location-card impressions to Google Analytics 4.

1. Create a GA4 property and copy its **Measurement ID** (`G-XXXXXXX`) from **Admin → Data Streams → your web stream**.
2. Set it in `.env`:
   ```bash
   GA_MEASUREMENT_ID=G-XXXXXXX
   ```
3. Tracking only loads when running in production (`NODE_ENV=production`) **and** `GA_MEASUREMENT_ID` is set — local `npm run dev` and mock-data sessions are never tracked, so they won't pollute your analytics data. Leave the variable blank to disable tracking entirely.

What gets sent, once enabled:
- **Page views** — on initial load and every client-side route change (`app/plugins/gtag.client.ts`).
- **Clicks** — every link/button click site-wide, via a single delegated listener; carries the element's text, `href`, and a `data-track-id` when clicking inside a location card (`app/plugins/gtag.client.ts`).
- **Impressions** — a `location_impression` event the first time a location card scrolls into view, on both the catalog page and the homepage's featured section (`app/plugins/impression.ts`, applied via the `v-impression` directive in `app/components/LocationCard.vue`).

**Deploying with the prebuilt Docker image** (`docker compose up`, e.g. `ghcr.io/deoneio/location-catalog:test` built by CI): set `GA_MEASUREMENT_ID` in your shell or `.env` before starting the stack — `docker-compose.yml` passes it into the container as `NUXT_PUBLIC_GA_MEASUREMENT_ID`, which is the only form of this variable Nuxt re-reads *after* the image has already been built. Changing it just needs a container restart (`docker compose up -d`), not an image rebuild.

If you instead run `npm run build` yourself (no Docker), plain `GA_MEASUREMENT_ID` in `.env` is read directly at build time — no `NUXT_PUBLIC_` prefix needed in that case.

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

## Recommended VS Code Extensions

For the best development experience with this project stack, install the following VS Code extensions:

1. **Vue - Official** (`Vue.volar`): Essential for Vue 3 SFC syntax highlighting and TypeScript support. (Note: Disable the built-in TypeScript extension for Vue workspaces or use Volar's Takeover mode).
2. **Nuxtr** (`nuxtr.nuxtr-vscode`): Deep integration with Nuxt 3, providing snippets, auto-completion, and handy commands.
3. **ESLint** (`dbaeumer.vscode-eslint`): For JavaScript/TypeScript linting and formatting.
4. **Prettier** (`esbenp.prettier-vscode`): For consistent code formatting.
5. **SQLite Viewer** (`qwtel.sqlite-viewer`): Very useful for viewing and debugging the local Directus database (`scripts/directus-schema/database/data.db`) directly in your editor.

## Docker Setup

The application and CMS can be launched together using Docker Compose with an Nginx reverse proxy:

```bash
# Start all containers (Nginx, Nuxt 3, Directus CMS)
npm run docker:up

# View live container logs
npm run docker:logs

# Stop containers
npm run docker:down
```

### Access Endpoints:
- **Web App**: `http://localhost/`
- **Directus Public API**: `http://localhost/api/items/locations`
- **CMS Admin Interface**: `http://cms.localhost/`

## CI/CD Pipeline (GitHub Actions)

Multi-architecture (`linux/amd64`, `linux/arm64`) Docker images are automatically built and published to **GitHub Container Registry (`ghcr.io`)**:

- **`develop` branch:** Builds and pushes to `ghcr.io/<owner>/shareloc-web:test` on every commit/merge.
- **`main` branch:** Automatically bumps Semantic Version (e.g. `v1.0.0` $\rightarrow$ `v1.0.1`), tags the Git commit, and pushes to `ghcr.io/<owner>/shareloc-web:v1.0.x` and `latest`.


