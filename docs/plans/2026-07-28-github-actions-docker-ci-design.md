# GitHub Actions Docker Multi-Arch CI Design

**Date:** 2026-07-28
**Status:** Approved

---

## 1. Overview

This design specifies the GitHub Actions workflow for building and publishing multi-architecture Docker images (`linux/amd64` and `linux/arm64`) to GitHub Container Registry (`ghcr.io`).

---

## 2. Triggers & Scope

- **Workflow File:** `.github/workflows/docker-ci.yml`
- **Triggers:**
  - `push` events targeting `main` branch.
  - `push` events targeting `develop` branch.
- **Excluded:** PRs, non-target feature branches, and manual triggers (unless explicitly enabled via `workflow_dispatch`).

---

## 3. Architecture & Build Pipeline

### **Multi-Architecture Setup**
- QEMU (`docker/setup-qemu-action@v3`) for cross-platform emulation.
- Buildx (`docker/setup-buildx-action@v3`) for container image building across `linux/amd64` and `linux/arm64`.

### **Authentication**
- Log in to `ghcr.io` via `docker/login-action@v3` using `GITHUB_TOKEN`.

### **Branch-Specific Tagging & Versioning**

1. **`develop` Branch**:
   - Fixed tag: `ghcr.io/<owner>/<repo>:test`
   - Replaced on every build on `develop`.

2. **`main` Branch**:
   - Automated SemVer Tagging step: `anothrNick/github-tag-action` automatically calculates the next version tag (e.g. `v1.0.0` $\rightarrow$ `v1.0.1`), creates the Git tag, and pushes it.
   - Container tags: `ghcr.io/<owner>/<repo>:v1.0.1` and `ghcr.io/<owner>/<repo>:latest`.

---

## 4. Verification & Testing Plan

1. Commit `.github/workflows/docker-ci.yml`.
2. Push to `develop` branch $\rightarrow$ Verify GitHub Actions run triggers, builds `amd64` + `arm64`, and pushes `:test` tag to GHCR.
3. Push / Merge to `main` branch $\rightarrow$ Verify GitHub Actions run triggers, bumps SemVer tag, builds `amd64` + `arm64`, and pushes `:v1.0.x` and `:latest` tags to GHCR.
