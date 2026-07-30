# How-To: Automated Local CD with GitHub Actions Self-Hosted Runner

This guide explains how to set up continuous deployment (CD) for the **Location Catalog (ShareLoc)** project using a **GitHub Actions Self-Hosted Runner**.

When code is pushed to the `develop` branch, the `docker-ci.yml` workflow builds and pushes a new multi-arch Docker image to GitHub Container Registry (GHCR). Once the build finishes, the self-hosted runner automatically pulls the latest `develop` branch code, pulls the newly updated Docker image, and restarts the local Docker containers.

---

## 1. Overview & Architecture

```
[ Developer ] --( git push )--> [ GitHub Repo: develop ]
                                      |
                                      v
                        [ GitHub Actions Cloud Runner ]
                        - Runs `build-and-push` job
                        - Pushes `ghcr.io/deoneio/location-catalog:test`
                                      |
                                      v (Triggers next job)
                        [ Local Machine: Self-Hosted Runner ]
                        - Runs `deploy-local` job
                        - `git pull origin develop`
                        - `docker compose pull nuxt`
                        - `docker compose up -d --remove-orphans`
```

### Benefits of this approach
* **No Open Ports Required:** The runner maintains an outbound long-poll connection to GitHub. No public IP, firewall rule, or Cloudflare Tunnel endpoint is needed for deployment.
* **Native GitHub Logs:** Deployment progress and status appear directly inside the GitHub Actions workflow tab.
* **Automated & Secure:** Executes automatically upon successful image build using standard GitHub permissions.

---

## 2. Prerequisites

1. **Host Environment:** Linux (Ubuntu/Debian recommended) with Docker & Docker Compose installed.
2. **Access Rights:** Admin or repository write access to your GitHub repository to generate a runner token.
3. **Repository Directory:** Local clone located at `/home/audias/docker/location-catalog-test` (or your specific path).

---

## 3. Step-by-Step Setup Guide

### Step 1: Register the Self-Hosted Runner on your Host Machine

1. In your GitHub repository, navigate to:
   `Settings` → `Actions` → `Runners` → Click **New self-hosted runner**.
2. Select **Linux** and target architecture (e.g. `x64` or `ARM64`).
3. Open a terminal on your host machine and run the setup commands provided by GitHub:

```bash
# Create a folder for the runner
mkdir -p ~/actions-runner && cd ~/actions-runner

# Download the latest runner package (adjust version as shown in GitHub UI)
curl -o actions-runner-linux-x64-2.317.0.tar.gz -L https://github.com/actions/runner/releases/download/v2.317.0/actions-runner-linux-x64-2.317.0.tar.gz

# Extract the installer
tar xzf ./actions-runner-linux-x64-2.317.0.tar.gz

# Configure the runner (Paste the token command from GitHub UI)
./config.sh --url https://github.com/<your-org-or-username>/location-catalog --token <YOUR_RUNNER_TOKEN>
```

When prompted during configuration:
* **Runner group:** Press Enter (Default).
* **Runner name:** Press Enter or give it a custom name (e.g., `local-dev-server`).
* **Runner labels:** Press Enter (Default labels: `self-hosted`, `Linux`, `X64`).
* **Work folder:** Press Enter (`_work`).

---

### Step 2: Install and Start the Runner as a Systemd Service

To ensure the runner stays active in the background and restarts automatically on system boot:

```bash
cd ~/actions-runner

# Install as systemd service
sudo ./svc.sh install

# Start the service
sudo ./svc.sh start

# Check service status
sudo ./svc.sh status
```

---

### Step 3: Configure User Permissions for Docker & Git

The user running the GitHub runner service must have permission to interact with the Docker daemon without `sudo`:

```bash
# Add current user to the docker group
sudo usermod -aG docker $USER

# Apply group changes immediately (or log out and back in)
newgrp docker

# Verify docker works without sudo
docker ps
```

Ensure your local repository directory allows access to the runner user:
```bash
# Mark directory as safe for Git (if running as another system user)
git config --global --add safe.directory /home/audias/docker/location-catalog-test
```

---

### Step 4: Update `.github/workflows/docker-ci.yml`

Update your GitHub Actions workflow file to include the deployment job targeting `runs-on: self-hosted`:

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
    timeout-minutes: 30
    outputs:
      image_tag: ${{ steps.meta.outputs.tags }}

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

  deploy-local:
    name: Deploy to Local Host
    needs: build-and-push
    if: github.ref_name == 'develop'
    runs-on: self-hosted

    steps:
      - name: Log in to GHCR on host
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Pull latest code & update docker containers
        run: |
          cd /home/audias/docker/location-catalog-test
          git fetch origin develop
          git reset --hard origin/develop
          docker compose pull nuxt
          docker compose up -d --remove-orphans
```

---

## 4. Operational Best Practices & Safety

1. **Avoid Merge Conflicts on Deployment:**
   The deployment step uses `git reset --hard origin/develop` to prevent deployment failures caused by untracked changes to tracked files.
   * **Will `.env` or `./data` be deleted?** **No!** Standard ignored files specified in `.gitignore` (such as `.env`, `.env.production`, `./data/directus/`, and `node_modules/`) are **never touched or removed** by `git reset --hard`. Git reset only affects tracked files.

2. **Container Health Checks:**
   After restarting the containers with `docker compose up -d`, you can verify running status with:
   ```bash
   docker compose ps
   ```
3. **Viewing Logs:**
   To view runtime logs for Nuxt or Directus after deployment:
   ```bash
   docker compose logs -f nuxt
   ```

---

## 5. Troubleshooting

| Issue | Root Cause | Solution |
| :--- | :--- | :--- |
| `permission denied while trying to connect to the Docker daemon socket` | Runner user lacks docker socket privileges | Run `sudo usermod -aG docker $USER` and restart the runner service (`sudo ./svc.sh restart`). |
| `fatal: detected dubious ownership in repository` | Git ownership check failed | Run `git config --global --add safe.directory /home/audias/docker/location-catalog-test`. |
| Runner shows `Offline` in GitHub UI | Runner service stopped | Run `cd ~/actions-runner && sudo ./svc.sh status`. If stopped, run `sudo ./svc.sh start`. |
| Docker pull fails with `unauthorized` | GHCR credentials expired or missing | Ensure `docker/login-action@v3` is present in `deploy-local` job. |

---
