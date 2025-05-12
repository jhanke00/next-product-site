# Use official Node.js image
FROM node:18-alpine

# Install pnpm globally
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY pnpm-lock.yaml ./
COPY package.json ./
RUN pnpm install

# Copy the rest of the code
COPY . .

# Expose port
EXPOSE 3000

# Start the app
CMD ["pnpm", "dev"]
