# Stage 1: Build TypeScript application
FROM node:20-bookworm-slim AS builder

WORKDIR /app

# Install git (required by npm ci for git-based dependencies)
RUN apt-get update && apt-get install -y --no-install-recommends git ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Copy dependency manifests
COPY package*.json tsconfig.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy source files
COPY src/ ./src/

# Compile TypeScript and copy static assets
RUN npm run build

# Stage 2: Production Runtime
FROM node:20-bookworm-slim

WORKDIR /app

# Install system dependencies: python3 (required for yt-dlp), ffmpeg, curl, git, ca-certificates
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    ffmpeg \
    curl \
    git \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Install latest official yt-dlp standalone binary (yt-dlp_linux bundle includes complete dependencies)
RUN curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_linux -o /usr/local/bin/yt-dlp \
    && chmod a+rx /usr/local/bin/yt-dlp

# Environment variables
ENV NODE_ENV=production
ENV PORT=10000
ENV HOST=0.0.0.0

# Install production dependencies only
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy compiled files and static assets from builder stage
COPY --from=builder /app/dist ./dist

# Create temp directory for API downloads
RUN mkdir -p /tmp/anythingdown_api

# Expose port (Render automatically routes traffic to $PORT)
EXPOSE 10000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:${PORT}/api/health || exit 1

# Start REST API and Web Interface (and optional Telegram Bot if TELEGRAM_BOT_TOKEN is set)
CMD ["node", "dist/api/server.js"]
