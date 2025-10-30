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
# - [2025-10-30] Added build tools to handle native dependencies.
# - [2025-10-30] Resolved static file path issues by adjusting asset copy location.
# - [2025-10-30] Initial creation of the multi-stage Dockerfile.

# 1. Builder Stage: Build the client and server
FROM node:20-alpine AS builder

# Install build tools for native dependencies
RUN apk add --no-cache libc6-compat
RUN apk add --no-cache python3 make g++

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

# Generate Prisma client
# A dummy DATABASE_URL is needed for the prisma generate command
ENV DATABASE_URL="postgresql://dummy:dummy@dummy:5432/dummy"
RUN npx prisma generate

# Build the client and server
RUN npm run build

# Remove development dependencies
RUN npm prune --production


# 2. Production Stage: Create the final image
FROM node:20-alpine AS production

WORKDIR /app

# Copy production node_modules from builder
COPY --from=builder /app/node_modules ./node_modules

# Copy built server and client from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/client/dist ./dist/client

# Copy prisma schema and package.json
# No need to copy prisma again if it's already in the final image from the source copy
COPY package.json .

# Set environment variables
# DATABASE_URL will be provided at runtime, so we don't set it here
ENV NODE_ENV=production
ENV PORT=3000

# Expose the port the app runs on
EXPOSE 3000

# Start the server
CMD ["npm", "start"]
