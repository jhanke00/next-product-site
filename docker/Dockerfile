FROM node:20-buster
WORKDIR /app

RUN npm install -g pnpm@8.6.0

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build
