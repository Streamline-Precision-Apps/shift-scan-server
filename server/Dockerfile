# Stage 1: Builder (includes devDependencies for Prisma generation)
FROM node:20 AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies (dev + prod)
RUN npm install

# Copy tsconfig.json so tsc can find it
COPY tsconfig.json ./

# Copy source code and Prisma schema
COPY src ./src
COPY prisma/schema.prisma ./prisma/
COPY prisma/models ./prisma/models

# Merge models into single schema before generating client
RUN cat prisma/schema.prisma prisma/models/*.prisma > prisma/generated-schema.prisma

# Generate Prisma client with output files for v6.18.0
RUN npx prisma generate --schema prisma/generated-schema.prisma

# Set an env variable to skip Sentry during Docker build
ENV SKIP_SENTRY=true

# Compile TypeScript to JavaScript, skip Sentry if SKIP_SENTRY is true
RUN npm run build || echo "Skipping Sentry build step"

# Stage 2: Production image (smaller)
FROM node:20-slim

# Install OpenSSL for Prisma
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy only package.json & package-lock.json
COPY package*.json ./

# Install only production dependencies
RUN npm install --production

# Copy built app and Prisma client from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/instrument.mjs ./dist/
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma/generated-schema.prisma ./prisma/
# Copy generated Prisma client output files
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/generated ./generated

# Copy entrypoint script
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

# Expose port 8080 for Cloud Run
EXPOSE 8080

# Use entrypoint script
CMD ["/app/entrypoint.sh"]