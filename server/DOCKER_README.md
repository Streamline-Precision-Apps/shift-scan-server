# Docker & Cloud Run Deployment Guide

This guide explains how to build, tag, push, and deploy your server using Docker and Google Cloud Run.

---

## 1. Update Environment for Production

- Ensure your server uses `process.env.PORT` or defaults to `8080` (Cloud Run default).
- Set `CORS_ORIGIN` and other environment variables for production in your Cloud Run deployment.

---

## 2. Docker Commands

### Build the Docker image

```
npm run docker:build
```

### Tag the Docker image for Google Container Registry

```
npm run docker:tag
```

### Push the Docker image to Google Container Registry

```
npm run docker:push
```

### Deploy or update your service on Google Cloud Run

```
npm run docker:deploy
```

> **Note:**
>
> - Replace `YOUR_PROJECT_ID`, `YOUR_REGION`, and `CORS_ORIGIN` in the scripts in `package.json` with your actual values.
> - You can also run the raw Docker commands directly if you prefer.

---

## 3. Manual Docker Commands (if not using npm scripts)

```sh
docker build -t shift-scan-server .
docker tag shift-scan-server gcr.io/YOUR_PROJECT_ID/shift-scan-server:latest
docker push gcr.io/YOUR_PROJECT_ID/shift-scan-server:latest
gcloud run deploy shift-scan-server \
  --image gcr.io/YOUR_PROJECT_ID/shift-scan-server:latest \
  --platform managed \
  --region YOUR_REGION \
  --allow-unauthenticated \
  --set-env-vars CORS_ORIGIN=https://your-production-frontend.com
```

---

## 4. Local Testing (Optional)

To test your container locally on the same port as Cloud Run:

```
docker run -p 8080:8080 -e PORT=8080 shift-scan-server
```

---

## 5. Environment Variables

- `PORT` (Cloud Run sets this automatically)
- `CORS_ORIGIN` (set to your frontend URL)
- Any other secrets or config needed for production

---

## 6. Updating the Server

1. Make your code changes.
2. Rebuild, tag, and push the Docker image.
3. Deploy to Cloud Run using the steps above.

---

For more details, see the main project README or Google Cloud Run documentation.
