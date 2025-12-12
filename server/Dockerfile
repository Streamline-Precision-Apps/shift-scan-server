# Stage 1: Builder (includes devDependencies for Prisma generation)
FROM node:24-alpine AS builder

# Set working directory
WORKDIR /server

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install all dependencies (dev + prod)
RUN npm ci

# Copy tsconfig.json so tsc can find it
COPY tsconfig.json ./

# Copy source code and Prisma schema
COPY src ./src
COPY prisma/schema.prisma ./prisma/
COPY prisma/models ./prisma/models

# Merge models into single schema before generating client
RUN cat prisma/schema.prisma prisma/models/*.prisma > prisma/generated-schema.prisma

# Generate Prisma client with output files for v6.18.0
RUN npx prisma generate --schema prisma/generated-schema.prisma && \
    mkdir -p /server/node_modules/.prisma

# Set an env variable to skip Sentry during Docker build
ENV SKIP_SENTRY=true

# Compile TypeScript to JavaScript, skip Sentry if SKIP_SENTRY is true
RUN npm run build || echo "Skipping Sentry build step"

# Stage 2: Production image (smaller)
FROM node:24-alpine

# Install OpenSSL for Prisma
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /server

# Copy only package.json & package-lock.json
COPY package*.json ./

# Install only production dependencies
RUN npm install --production

# Copy built app and Prisma client from builder
COPY --from=builder /server/dist ./dist
COPY --from=builder /server/src/instrument.mjs ./dist/
COPY --from=builder /server/prisma ./prisma
COPY --from=builder /server/prisma/generated-schema.prisma ./prisma/
# Copy generated Prisma client output files
COPY --from=builder /server/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /server/generated ./generated

# Copy entrypoint script
COPY entrypoint.sh /server/entrypoint.sh
RUN chmod +x /server/entrypoint.sh

# Expose port 8080 for Cloud Run
EXPOSE 8080

# Use entrypoint script
CMD ["/server/entrypoint.sh"]