import rateLimit from "express-rate-limit";

// Aggressive limit for login attempts (brute force protection)
// Allows 5 requests per 15 minutes per IP address
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per windowMs
  message: "Too many login attempts. Please try again after 15 minutes.",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skip: (req) => process.env.NODE_ENV === "development", // Disable in dev
  handler: (req: any, res) => {
    res.status(429).json({
      success: false,
      error: "Too many login attempts",
      message:
        "You have exceeded the maximum login attempts. Please try again after 15 minutes.",
      retryAfter: req.rateLimit?.resetTime
        ? new Date(req.rateLimit.resetTime).toISOString()
        : null,
    });
  },
});

/**
 * Standard rate limiter for general API usage
 * Allows 100 requests per 15 minutes per IP address
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // 100 requests per windowMs
  message: "Too many requests. Please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => process.env.NODE_ENV === "development",
  handler: (req: any, res) => {
    res.status(429).json({
      success: false,
      error: "Rate limit exceeded",
      message: "You have made too many requests. Please try again later.",
      retryAfter: req.rateLimit?.resetTime
        ? new Date(req.rateLimit.resetTime).toISOString()
        : null,
    });
  },
});

/**
 * Stricter rate limiter for password reset endpoints
 * Allows 3 requests per 1 hour per IP address
 */
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 requests per hour
  message: "Too many password reset attempts. Please try again in 1 hour.",
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => process.env.NODE_ENV === "development",
  handler: (req: any, res) => {
    res.status(429).json({
      success: false,
      error: "Too many password reset attempts",
      message:
        "You have exceeded the maximum password reset attempts. Please try again in 1 hour.",
      retryAfter: req.rateLimit?.resetTime
        ? new Date(req.rateLimit.resetTime).toISOString()
        : null,
    });
  },
});
