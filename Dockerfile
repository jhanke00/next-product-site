# syntax=docker/dockerfile:1

FROM node:22-alpine AS deps
WORKDIR /app

ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0

COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm \
  && pnpm install --frozen-lockfile

FROM node:22-alpine AS builder
WORKDIR /app

ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-alpine AS prod-deps
WORKDIR /app

ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0

COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm \
  && pnpm install --frozen-lockfile --prod --ignore-scripts

FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY package.json pnpm-lock.yaml ./
COPY --from=prod-deps /app/node_modules ./node_modules

EXPOSE 3000

CMD ["node", "node_modules/.bin/next", "start"]

