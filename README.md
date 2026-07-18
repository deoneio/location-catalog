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
