# Setup Base Nuxt Project Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Scaffold a robust Nuxt 3 base project configured with Vanilla CSS to serve as the frontend for the Location Catalog.

**Architecture:** Nuxt 3 application (Server-Side Rendering enabled for SEO) utilizing Vanilla CSS for styling (no Tailwind, per PRD). Project will be initialized in the root directory. 

**Tech Stack:** Nuxt 3, Vue 3, Vanilla CSS.

---

### Task 1: Bootstrap Nuxt Application

**Files:**
- Create: `package.json`
- Create: `nuxt.config.ts`
- Create: `app.vue`

**Step 1: Write the failing test**
Run: `npm run dev`
Expected: FAIL with "missing script: dev"

**Step 2: Write minimal implementation (Scaffold)**
Run: `npx -y nuxi@latest init ./ --force` (Initializing in root directory, forcing overwrite to keep existing docs/scripts)

**Step 3: Install Dependencies**
Run: `npm install`

**Step 4: Run test to verify it passes**
Run: `npx nuxi typecheck` (or just check that package.json exists and scripts work)
Expected: PASS

**Step 5: Commit**
```bash
git add .
git commit -m "chore: scaffold base nuxt 3 project"
```

---

### Task 2: Configure Global Vanilla CSS

**Files:**
- Create: `assets/css/main.css`
- Modify: `nuxt.config.ts`

**Step 1: Write the failing test**
Run: `grep "assets/css/main.css" nuxt.config.ts`
Expected: FAIL (no output)

**Step 2: Write minimal implementation**
Create `assets/css/main.css`:
```css
:root {
  --primary-color: #000000;
  --secondary-color: #ffffff;
  --bg-color: #f8f9fa;
  --text-color: #333333;
  --font-family: 'Inter', sans-serif;
}

body {
  margin: 0;
  font-family: var(--font-family);
  background-color: var(--bg-color);
  color: var(--text-color);
}
```

Update `nuxt.config.ts` to include the CSS:
```typescript
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css']
})
```

**Step 3: Run test to verify it passes**
Run: `grep "assets/css/main.css" nuxt.config.ts`
Expected: PASS

**Step 4: Commit**
```bash
git add assets/css/main.css nuxt.config.ts
git commit -m "feat: configure global vanilla CSS"
```
