# Dockerfile for PRD Helper full-stack application
#
# This is a multi-stage build that prepares the application for production.
# - The 'builder' stage installs dependencies, compiles TypeScript, and builds the client.
# - The 'production' stage creates a minimal image with only the necessary production artifacts.
#
# Key Behaviors:
# - Builds both the server and the client.
# - Handles native dependencies like bcryptjs.
# - Exposes port 3000 for the server.
#
# Recent Changes:
# - [2025-11-18] Switched from Alpine to Debian Slim for better Prisma CDN reliability.
# - [2025-11-18] Added retry logic with exponential backoff for Prisma generate step.
# - [2025-10-30] Added build tools to handle native dependencies.
# - [2025-10-30] Resolved static file path issues by adjusting asset copy location.
# - [2025-10-30] Initial creation of the multi-stage Dockerfile.

# 1. Builder Stage: Build the client and server
# Using Debian Slim instead of Alpine for better Prisma CDN reliability
# Debian uses glibc (linux-openssl-3.0.x) vs Alpine's musl (linux-musl-openssl-3.0.x)
FROM node:20-slim AS builder

# Install build tools for native dependencies (Debian equivalents)
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package.json and package-lock.json for both root and client
COPY package*.json ./
COPY client/package*.json ./client/
COPY prisma ./prisma

# Install all dependencies
RUN npm install
RUN npm install --prefix client

# Rebuild native dependencies
RUN npm rebuild

# Copy the rest of the source code
COPY . .

# --- IMPORTANT: This block is ONLY needed for 'docker build' time ---
# For local development: Prisma + Docker needs a DATABASE_URL at build time to generate the client.
# These dummy credentials are only used during the build step and do NOT affect runtime configuration.
# At runtime:
#   - For local/dev: real ENV vars come from .env.docker (docker-compose passes them in)
#   - For production: secrets are injected via gcloud Secret Manager (see cloudbuild.yaml)
ENV DATABASE_URL="postgresql://dummy:dummy@dummy:5432/dummy"
ENV DIRECT_URL="postgresql://dummy:dummy@dummy:5432/dummy"
ENV PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1
# ---------------------------------------------------------------
# Retry logic with exponential backoff for CDN resilience (1s, 2s, 4s delays)
RUN set -e; \
    for attempt in 1 2 3; do \
        if npx prisma generate; then \
            break; \
        fi; \
        if [ "$attempt" -eq 3 ]; then \
            echo "Prisma generate failed after ${attempt} attempts."; \
            exit 1; \
        fi; \
        case "$attempt" in \
            1) delay=1 ;; \
            2) delay=2 ;; \
            *) delay=4 ;; \
        esac; \
        echo "Prisma generate attempt ${attempt} failed, retrying in ${delay}s..."; \
        sleep "$delay"; \
    done

# Build the client and server
RUN npm run build

# Remove development dependencies
RUN npm prune --production


# 2. Production Stage: Create the final image
# Using Debian Slim for consistency with builder stage and better binary compatibility
FROM node:20-slim AS production

# Install OpenSSL for Prisma runtime
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy production node_modules from builder
COPY --from=builder /app/node_modules ./node_modules

# Copy built server and client from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/client/dist ./dist/client

# Copy package.json and Prisma schema
COPY package.json .
COPY --from=builder /app/prisma ./prisma

# Set environment variables
# DATABASE_URL will be provided at runtime, so we don't set it here
ENV NODE_ENV=production
ENV PORT=3000

# Expose the port the app runs on
EXPOSE 3000

# Start the server (migrations run in Cloud Build, not at startup)
CMD ["npm", "start"]
