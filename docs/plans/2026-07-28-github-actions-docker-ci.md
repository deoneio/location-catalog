# GitHub Actions Docker Multi-Arch CI Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Create a GitHub Actions workflow to build and push multi-architecture (`linux/amd64` and `linux/arm64`) Docker images to GitHub Container Registry (`ghcr.io`) on `main` and `develop` branches.

**Architecture:** The workflow activates on pushes to `main` and `develop`. It sets up QEMU and Docker Buildx for dual-platform compilation. `develop` builds publish to `ghcr.io/<repo>:test`. `main` builds automatically bump the SemVer tag (e.g. `v1.0.0` -> `v1.0.1`) and publish `ghcr.io/<repo>:<version>` and `latest`.

**Tech Stack:** GitHub Actions, Docker Buildx, QEMU, GitHub Container Registry (`ghcr.io`).

---

### Task 1: Create `.github/workflows/docker-ci.yml`

**Files:**
- Create: `.github/workflows/docker-ci.yml`

**Step 1: Create `.github/workflows/docker-ci.yml`**

```yaml
name: Docker Multi-Arch Build & Publish

on:
  push:
    branches:
      - main
      - develop

permissions:
  contents: write
  packages: write

jobs:
  build-and-push:
    name: Build & Push Docker Image
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Calculate SemVer tag for main branch
        if: github.ref_name == 'main'
        id: tag_version
        uses: anothrNick/github-tag-action@1.71.0
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          WITH_V: true
          DEFAULT_BUMP: patch
          INITIAL_VERSION: 1.0.0

      - name: Set up QEMU (for multi-arch amd64/arm64)
        uses: docker/setup-qemu-action@v3

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Determine Docker Image Tags
        id: meta
        run: |
          IMAGE_ID=ghcr.io/${{ github.repository }}
          IMAGE_ID=$(echo $IMAGE_ID | tr '[A-Z]' '[a-z]')
          
          if [ "${{ github.ref_name }}" = "main" ]; then
            TAG="${{ steps.tag_version.outputs.new_tag }}"
            echo "tags=${IMAGE_ID}:${TAG},${IMAGE_ID}:latest" >> $GITHUB_OUTPUT
          else
            echo "tags=${IMAGE_ID}:test" >> $GITHUB_OUTPUT
          fi

      - name: Build and Push Docker Image
        uses: docker/build-push-action@v6
        with:
          context: .
          file: ./Dockerfile
          platforms: linux/amd64,linux/arm64
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

**Step 2: Commit**

```bash
git add .github/workflows/docker-ci.yml
git commit -m "ci(github-actions): add multi-arch Docker build and push workflow for main and develop branches"
```

---

### Task 2: Update Documentation and Script Reference

**Files:**
- Modify: `README.md`

**Step 1: Add CI / Registry information to `README.md`**

Add details under the `Docker Setup` section in `README.md` explaining how images are automatically built for `amd64`/`arm64` and pushed to `ghcr.io` on `main` and `develop`.

**Step 2: Commit**

```bash
git add README.md
git commit -m "docs(ci): document GitHub Actions Docker workflow and GHCR image tags"
```

---

### Task 3: Push to `develop` & `main` and Verify Workflow Execution

**Step 1: Create local `develop` branch if not existing and push**

Run:
```bash
git checkout -b develop 2>/dev/null || git checkout develop
git push -u origin develop
```

**Step 2: Verify Github Workflow status**

Run: `gh run list --workflow=docker-ci.yml` or check `git log`.
Expected: Workflow successfully triggers and completes for branch push.
