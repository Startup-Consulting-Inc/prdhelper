# Dockerfile for PRD Helper full-stack application
#
# This is a multi-stage build that prepares the application for production.
# - The 'builder' stage installs dependencies, compiles TypeScript, and builds the client.
# - The 'production' stage creates a minimal image with only the necessary production artifacts.
#
# Key Behaviors:
# - Builds both the server and the client.
# - Handles native dependencies.
# - Exposes port 3000 for the server.
# - Uses Firebase/Firestore (no database migrations needed)
#
# Recent Changes:
# - [2025-11-26] Migrated from Prisma/PostgreSQL to Firebase/Firestore.
# - [2025-11-18] Switched from Alpine to Debian Slim for better reliability.
# - [2025-11-18] Added retry logic with exponential backoff for dependency downloads.
# - [2025-10-30] Added build tools to handle native dependencies.
# - [2025-10-30] Initial creation of the multi-stage Dockerfile.

# 1. Builder Stage: Build the client and server
FROM node:20-slim AS builder

# Install build tools for native dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package.json and package-lock.json for both root and client
COPY package*.json ./
COPY client/package*.json ./client/

# Install all dependencies
RUN npm install
RUN npm install --prefix client

# Rebuild native dependencies
RUN npm rebuild

# Copy the rest of the source code
COPY . .

# --- Build Arguments for Production ---
# Frontend Sentry DSN (passed via --build-arg during production build)
ARG VITE_SENTRY_DSN
ENV VITE_SENTRY_DSN=$VITE_SENTRY_DSN

# Firebase configuration for client build
ARG VITE_FIREBASE_API_KEY
ARG VITE_FIREBASE_AUTH_DOMAIN
ARG VITE_FIREBASE_PROJECT_ID
ARG VITE_FIREBASE_STORAGE_BUCKET
ARG VITE_FIREBASE_MESSAGING_SENDER_ID
ARG VITE_FIREBASE_APP_ID

ENV VITE_FIREBASE_API_KEY=$VITE_FIREBASE_API_KEY
ENV VITE_FIREBASE_AUTH_DOMAIN=$VITE_FIREBASE_AUTH_DOMAIN
ENV VITE_FIREBASE_PROJECT_ID=$VITE_FIREBASE_PROJECT_ID
ENV VITE_FIREBASE_STORAGE_BUCKET=$VITE_FIREBASE_STORAGE_BUCKET
ENV VITE_FIREBASE_MESSAGING_SENDER_ID=$VITE_FIREBASE_MESSAGING_SENDER_ID
ENV VITE_FIREBASE_APP_ID=$VITE_FIREBASE_APP_ID

# Build the client and server
RUN npm run build

# Remove development dependencies
RUN npm prune --production


# 2. Production Stage: Create the final image
FROM node:20-slim AS production

# Install OpenSSL (for general cryptographic operations)
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy production node_modules from builder
COPY --from=builder /app/node_modules ./node_modules

# Copy built server and client from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/client/dist ./dist/client

# Copy package.json
COPY package.json .

# Copy Firebase service account key (will be mounted as secret at runtime)
# Note: The actual key is injected via Cloud Run secrets, not baked into the image

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose the port the app runs on
EXPOSE 3000

# Start the server
CMD ["npm", "start"]
