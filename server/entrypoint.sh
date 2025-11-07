#!/bin/sh
set -e  # exit if any command fails

# Wait for database to be ready (useful for Cloud SQL connections)
echo "Waiting for database to be ready..."

# Set DATABASE_URL from POSTGRES_PRISMA_URL if needed
export POSTGRES_PRISMA_URL=${POSTGRES_PRISMA_URL}

export POSTGRES_URL_NON_POOLING=${POSTGRES_URL_NON_POOLING}


# Run Prisma migrations using the merged schema
npx prisma migrate deploy --schema prisma/generated-schema.prisma

# Make sure your app listens on the correct port
export PORT=${PORT:-8080}

# Start Node app
exec node dist/index.js