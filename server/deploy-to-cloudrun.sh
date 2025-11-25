#!/bin/bash
set -e

# Load environment variables from .env file if it exists
if [ -f .env ]; then
  set -a
  source .env
  set +a
fi

# Build and push Docker image
echo "Building Docker image..."
docker build --platform linux/amd64 -t gcr.io/fcm-shift-scan/shift-scan-server .

echo "Pushing Docker image to GCR..."
docker push gcr.io/fcm-shift-scan/shift-scan-server

echo "Deploying to Cloud Run..."

# Deploy using set-env-vars with proper quoting
gcloud run deploy shift-scan-server \
  --image gcr.io/fcm-shift-scan/shift-scan-server \
  --platform managed \
  --region us-west3 \
  --allow-unauthenticated \
  --timeout 900 \
  --memory 1Gi \
  --cpu 1000m \
  --min-instances 0 \
  --max-instances 20 \
  --concurrency 80 \
  --cpu-boost \
  --set-env-vars "NODE_ENV=${NODE_ENV}" \
  --set-env-vars "BUILD_TOKEN=${BUILD_TOKEN}" \
  --set-env-vars "CORS_ORIGIN=${CORS_ORIGIN}" \
  --set-env-vars "CORS_ORIGIN_LOCAL=${CORS_ORIGIN_LOCAL}" \
  --set-env-vars "POSTGRES_PRISMA_URL=${POSTGRES_PRISMA_URL}" \
  --set-env-vars "POSTGRES_URL_NON_POOLING=${POSTGRES_URL_NON_POOLING}" \
  --set-env-vars "JWT_SECRET=${JWT_SECRET}" \
  --set-env-vars "JWT_EXPIRATION=${JWT_EXPIRATION}" \
  --set-env-vars "AUTH_RESEND_KEY=${AUTH_RESEND_KEY}" \
  --set-env-vars "FIREBASE_FCM_VAPID_KEY=${FIREBASE_FCM_VAPID_KEY}" \
  --set-env-vars "FIREBASE_API_KEY=${FIREBASE_API_KEY}" \
  --set-env-vars "FIREBASE_AUTH_DOMAIN=${FIREBASE_AUTH_DOMAIN}" \
  --set-env-vars "FIREBASE_STORAGE_BUCKET=${FIREBASE_STORAGE_BUCKET}" \
  --set-env-vars "FIREBASE_APP_ID=${FIREBASE_APP_ID}" \
  --set-env-vars "FIREBASE_MEASUREMENT_ID=${FIREBASE_MEASUREMENT_ID}" \
  --set-env-vars "FIREBASE_SERVICE_JSON_TYPE=${FIREBASE_SERVICE_JSON_TYPE}" \
  --set-env-vars "FIREBASE_SERVICE_JSON_PROJECT_ID=${FIREBASE_SERVICE_JSON_PROJECT_ID}" \
  --set-env-vars "FIREBASE_SERVICE_JSON_PRIVATE_KEY_ID=${FIREBASE_SERVICE_JSON_PRIVATE_KEY_ID}" \
  --set-env-vars "FIREBASE_SERVICE_JSON_CLIENT_EMAIL=${FIREBASE_SERVICE_JSON_CLIENT_EMAIL}" \
  --set-env-vars "FIREBASE_SERVICE_JSON_CLIENT_ID=${FIREBASE_SERVICE_JSON_CLIENT_ID}" \
  --set-env-vars "FIREBASE_SERVICE_JSON_AUTH_URI=${FIREBASE_SERVICE_JSON_AUTH_URI}" \
  --set-env-vars "FIREBASE_SERVICE_JSON_TOKEN_URI=${FIREBASE_SERVICE_JSON_TOKEN_URI}" \
  --set-env-vars "FIREBASE_SERVICE_JSON_AUTH_PROVIDER_X509_CERT_URL=${FIREBASE_SERVICE_JSON_AUTH_PROVIDER_X509_CERT_URL}" \
  --set-env-vars "FIREBASE_SERVICE_JSON_CLIENT_X509_CERT_URL=${FIREBASE_SERVICE_JSON_CLIENT_X509_CERT_URL}" \
  --set-env-vars "FIREBASE_SERVICE_JSON_UNIVERSE_DOMAIN=${FIREBASE_SERVICE_JSON_UNIVERSE_DOMAIN}" \
  --set-env-vars "FIREBASE_SERVICE_JSON_PRIVATE_KEY=${FIREBASE_SERVICE_JSON_PRIVATE_KEY}" \
  --set-env-vars "SENTRY_AUTH_TOKEN=${SENTRY_AUTH_TOKEN}"

echo "Deployment complete!"