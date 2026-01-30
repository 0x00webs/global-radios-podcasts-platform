# Multi-stage Dockerfile using Bun
# Builder stage: install deps and build TypeScript
FROM oven/bun:1.3.8 AS builder

WORKDIR /app

# Copy package files first to leverage layer caching
COPY package.json tsconfig.json ./
# copy possible bun lock if present (will be ignored if absent)
COPY bun.lockb ./

# Copy source
COPY src ./src

# Install dependencies and build
RUN bun install --no-check && bun run build

# Runtime stage
FROM oven/bun:1.3.8 AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy built files and installed deps from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package.json ./

EXPOSE 3000

# Default command: run dev server when DOCKER_ENV or NODE_ENV=development, else run production start
CMD ["sh", "-lc", "if [ \"$DOCKER_ENV\" = \"true\" ] || [ \"$NODE_ENV\" = \"development\" ]; then bun run start:dev; else bun run start; fi"]
