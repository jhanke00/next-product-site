FROM node:22.15.1-alpine
ENV PROJECT_DIR=/app
WORKDIR ${PROJECT_DIR}

# Create application user
ENV APPUSER=appuser
RUN addgroup -g 12000 ${APPUSER} && adduser -u 12000 -G ${APPUSER} -h ${PROJECT_DIR} -D ${APPUSER}
RUN mkdir -p ${PROJECT_DIR} && chmod -R 764 ${PROJECT_DIR}

# Install npm packages
COPY package.json ./
COPY pnpm-lock.yaml ./
RUN npm install -g pnpm;
RUN pnpm install;

# Copy all files
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
#ENV NEXT_TELEMETRY_DISABLED=1

# Run container
ARG PORT=3000
EXPOSE ${PORT}
ENV PORT=${PORT}
ENV NODE_ENV=development
CMD ["pnpm", "run", "dev"]
