# Dockerfile
FROM node:20

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json pnpm-lock.yaml* ./
RUN npm install -g pnpm && pnpm install

# Copy project files
COPY . .

# Expose port and start the app
EXPOSE 3000
CMD ["pnpm", "dev"]