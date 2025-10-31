# ========================
# Stage 1: Build
# ========================
FROM node:18-alpine AS builder

# Enable Corepack and prepare pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

ARG NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL

# Build the Next.js app
RUN pnpm build

# ========================
# Stage 2: Production
# ========================
FROM node:18-alpine AS runner

ENV NODE_ENV=production
WORKDIR /app

# Enable Corepack here as well
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy necessary build artifacts
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# Expose port
EXPOSE 3000

# Start Next.js
CMD ["pnpm", "start"]
