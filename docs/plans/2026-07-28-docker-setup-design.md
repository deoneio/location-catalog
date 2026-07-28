# Full-Stack Docker Setup Design for ShareLoc

**Date:** 2026-07-28
**Status:** Approved

---

## 1. Overview

This design outlines the full-stack containerization of the ShareLoc web project using Docker Compose and Nginx as a reverse proxy. 
The setup serves both the Nuxt 3 web application and the Directus CMS (API & Admin) on a single Nginx proxy instance using dual-domain / path-based proxying.

---

## 2. Architecture & Domain Routing

### **Docker Services**
1. **`nginx`**: Reverse proxy gateway exposed on port `80` (and/or `443`).
2. **`nuxt`**: Containerized Nuxt 3 web application running production Nitro Node build on internal port `3000`.
3. **`directus`**: Directus Headless CMS container on internal port `8055` using SQLite for data storage.

### **Nginx Routing Rules**

- **Main Application Domain (`app.local` / primary domain / default host)**:
  - `/api/*` $\rightarrow$ Proxied to `http://directus:8055/*` (Directus API)
  - `/*` $\rightarrow$ Proxied to `http://nuxt:3000/*` (Nuxt 3 Web App)

- **CMS Admin Domain (`cms.local` / secondary domain)**:
  - `/*` $\rightarrow$ Proxied to `http://directus:8055/*` (Directus Admin Dashboard & API)

---

## 3. Container Configuration & Data Persistence

### **Nuxt 3 Dockerfile (`Dockerfile`)**
- Multi-stage build (`node:20-alpine`):
  - Stage 1 (`builder`): Dependency installation & `npm run build` producing `.output/`.
  - Stage 2 (`runner`): Lightweight execution of `.output/server/index.mjs`.

### **Directus Container (`docker-compose.yml`)**
- Image: `directus/directus:11`
- Persistent Volumes:
  - `./data/directus/database:/directus/database`
  - `./data/directus/uploads:/directus/uploads`
- Environment settings configured via `.env` (database client set to `sqlite3`).

### **Nginx Configuration (`docker/nginx/conf.d/default.conf`)**
- Dedicated `server` blocks for main application domain and CMS admin domain.
- Standard proxy header forwarding (`Host`, `X-Real-IP`, `X-Forwarded-For`, `X-Forwarded-Proto`).

---

## 4. Developer Experience & Scripts

- Convenience scripts added to `package.json`:
  - `npm run docker:up`
  - `npm run docker:down`
  - `npm run docker:logs`
- Directus schema management via existing `schema.yaml` and `scripts/directus-schema/setup.js`.

---

## 5. Verification Plan

1. Build and start containers: `docker compose up -d --build`.
2. Verify Nuxt application response on `http://localhost/`.
3. Verify Directus API proxying on `http://localhost/api/items/locations`.
4. Verify Directus Admin dashboard on `http://cms.localhost/` (or designated admin host).
