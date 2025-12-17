/**
 * Parse an environment value into a number (seconds).
 * Supports:
 *  - plain numbers: "3600"
 *  - simple math expressions with digits and + - * / ( ) and spaces: "30 * 24 * 60 * 60"
 *  - unit suffixes: s (seconds), m (minutes), h (hours), d (days), w (weeks). Examples: "30d", "15m"
 *
 * The expression evaluator is guarded with a regex to only allow numeric characters and math operators.
 */

import dotenv from "dotenv";
dotenv.config();
import parseEnvSeconds from "./tokenExpirationParser.js";

// Validate JWT_SECRET on startup
function validateJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  const nodeEnv = process.env.NODE_ENV || "development";

  if (!secret || secret.trim() === "") {
    throw new Error(
      "CRITICAL: JWT_SECRET is not set in environment variables. " +
        "Set JWT_SECRET in your .env file to a strong random string (32+ characters minimum)."
    );
  }

  if (secret.includes("your_jwt_secret")) {
    throw new Error(
      "CRITICAL: JWT_SECRET contains placeholder text 'your_jwt_secret'. " +
        "Replace it with a strong random string (32+ characters minimum)."
    );
  }

  if (nodeEnv === "production" && secret.length < 32) {
    throw new Error(
      `CRITICAL: JWT_SECRET must be at least 32 characters in production. Current length: ${secret.length}. ` +
        "Generate a strong random string using: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\""
    );
  }

  return secret;
}

// Default to 8080 for Cloud Run compatibility
const config = {
  port: parseInt(process.env.PORT || "8080", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  databaseUrl: process.env.POSTGRES_PRISMA_URL || "",
  jwtSecret: validateJwtSecret(),
  jwtExpiration: parseEnvSeconds(process.env.JWT_EXPIRATION, 30 * 24 * 60 * 60), // seconds
} as const;

export default config;
