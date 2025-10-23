FROM node:18-alpine
WORKDIR /app
COPY package*.json pnpm-lock.yaml ./
RUN apk add --no-cache bash curl
RUN npm install -g pnpm@7
RUN pnpm install --frozen-lockfile --prod=false
COPY . .
RUN pnpm build
EXPOSE 3000
CMD ["pnpm","start"]
