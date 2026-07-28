# Full-Stack Docker Setup Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Containerize the ShareLoc web project with Nuxt 3, Directus CMS, and Nginx reverse proxy using Docker Compose.

**Architecture:** Nginx acts as the single reverse proxy gateway. Main domain routes `/api/*` to Directus API and `/*` to Nuxt 3. Directus CMS admin is served via a dedicated CMS admin domain (`cms.local` / secondary server block).

**Tech Stack:** Docker, Docker Compose, Nginx, Nuxt 3 (Node 20 / Nitro engine), Directus 11 (SQLite).

---

### Task 1: Create Nuxt 3 Multi-Stage Dockerfile and `.dockerignore`

**Files:**
- Create: `Dockerfile`
- Create: `.dockerignore`

**Step 1: Create `.dockerignore`**

```gitignore
node_modules
.output
.nuxt
.git
.env
data
scripts/directus-schema/node_modules
README.md
docs
```

**Step 2: Create multi-stage `Dockerfile`**

```dockerfile
# Stage 1: Build Nuxt Application
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Production Nitro Server Runner
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

COPY --from=builder /app/.output ./.output

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
```

**Step 3: Test Docker build**

Run: `docker build -t shareloc-web:test .`
Expected: Build succeeds and produces `.output` server container.

**Step 4: Commit**

```bash
git add Dockerfile .dockerignore
git commit -m "feat(docker): add multi-stage Dockerfile and .dockerignore for Nuxt 3"
```

---

### Task 2: Create Nginx Reverse Proxy Configuration

**Files:**
- Create: `docker/nginx/nginx.conf`
- Create: `docker/nginx/conf.d/default.conf`

**Step 1: Create `docker/nginx/nginx.conf`**

```nginx
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;

    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;

    include /etc/nginx/conf.d/*.conf;
}
```

**Step 2: Create `docker/nginx/conf.d/default.conf`**

```nginx
# 1. Main Web Application Server Block (e.g. app.local or localhost)
server {
    listen 80;
    server_name localhost app.local _;

    client_max_body_size 64M;

    # Proxy Directus Public API (/api/* -> Directus Container)
    location /api/ {
        proxy_pass http://directus:8055/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Proxy Nuxt 3 Frontend Web App
    location / {
        proxy_pass http://nuxt:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# 2. CMS Admin Dashboard Server Block (e.g. cms.local / cms.localhost)
server {
    listen 80;
    server_name cms.localhost cms.local;

    client_max_body_size 64M;

    # Proxy directly to Directus CMS Admin & API
    location / {
        proxy_pass http://directus:8055;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Step 3: Commit**

```bash
git add docker/nginx/nginx.conf docker/nginx/conf.d/default.conf
git commit -m "feat(docker): add Nginx reverse proxy configuration for main app and cms admin"
```

---

### Task 3: Create Docker Compose and Environment Setup

**Files:**
- Create: `docker-compose.yml`
- Modify: `.env.example`

**Step 1: Create `docker-compose.yml`**

```yaml
version: '3.8'

services:
  nginx:
    image: nginx:alpine
    container_name: shareloc-nginx
    restart: unless-stopped
    ports:
      - "80:80"
    volumes:
      - ./docker/nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./docker/nginx/conf.d:/etc/nginx/conf.d:ro
    depends_on:
      - nuxt
      - directus
    networks:
      - shareloc-network

  nuxt:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: shareloc-nuxt
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - PORT=3000
      - HOST=0.0.0.0
      - USE_MOCK=false
      - DIRECTUS_URL=http://directus:8055
    networks:
      - shareloc-network
    depends_on:
      - directus

  directus:
    image: directus/directus:11
    container_name: shareloc-directus
    restart: unless-stopped
    environment:
      KEY: "${DIRECTUS_KEY:-shareloc-secret-key}"
      SECRET: "${DIRECTUS_SECRET:-shareloc-secret-value}"
      ADMIN_EMAIL: "${ADMIN_EMAIL:-admin@shareloc.local}"
      ADMIN_PASSWORD: "${ADMIN_PASSWORD:-Admin123456!}"
      DB_CLIENT: "sqlite3"
      DB_FILENAME: "/directus/database/data.db"
      CORS_ENABLED: "true"
      CORS_ORIGIN: "true"
    volumes:
      - ./data/directus/database:/directus/database
      - ./data/directus/uploads:/directus/uploads
    networks:
      - shareloc-network

networks:
  shareloc-network:
    driver: bridge
```

**Step 2: Update `.env.example`**

```env
USE_MOCK=true
DIRECTUS_URL=http://localhost:8055
DIRECTUS_KEY=shareloc-secret-key
DIRECTUS_SECRET=shareloc-secret-value
ADMIN_EMAIL=admin@shareloc.local
ADMIN_PASSWORD=Admin123456!
```

**Step 3: Commit**

```bash
git add docker-compose.yml .env.example
git commit -m "feat(docker): add docker-compose.yml and update .env.example"
```

---

### Task 4: Add Package.json Scripts & Documentation

**Files:**
- Modify: `package.json`
- Modify: `README.md`

**Step 1: Add Docker scripts to `package.json`**

Add the following to `"scripts"` in `package.json`:
```json
"docker:up": "docker compose up -d --build",
"docker:down": "docker compose down",
"docker:logs": "docker compose logs -f"
```

**Step 2: Update `README.md` with Docker instructions**

Append a section to `README.md` describing how to start the app via Docker Compose.

**Step 3: Commit**

```bash
git add package.json README.md
git commit -m "docs(docker): add docker npm scripts and usage instructions to README"
```

---

### Task 5: Launch Containers & Verification

**Step 1: Launch containers**

Run: `docker compose up -d --build`
Expected: `shareloc-directus`, `shareloc-nuxt`, and `shareloc-nginx` containers start cleanly.

**Step 2: Check status**

Run: `docker compose ps`
Expected: All 3 containers in `Up` state.

**Step 3: Verify Nginx Routing**

- Run: `curl -I http://localhost/`
  Expected: HTTP 200 (Nuxt 3 HTML output)
- Run: `curl -I http://localhost/api/items/locations` or `curl -I http://localhost/api/server/ping`
  Expected: HTTP 200 / 401 / valid JSON response from Directus
- Run: `curl -I -H "Host: cms.localhost" http://localhost/`
  Expected: HTTP 200 / Directus Admin interface output

**Step 4: Final Commit**

```bash
git commit --allow-empty -m "chore(docker): verify full-stack docker setup end-to-end"
```
