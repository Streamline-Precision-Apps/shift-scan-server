/**
 * Parse an environment value into a number (seconds).
 * Supports:
 *  - plain numbers: "3600"
 *  - simple math expressions with digits and + - * / ( ) and spaces: "30 * 24 * 60 * 60"
 *  - unit suffixes: s (seconds), m (minutes), h (hours), d (days), w (weeks). Examples: "30d", "15m"
 *
 * The expression evaluator is guarded with a regex to only allow numeric characters and math operators.
 */

!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="862e760c-8895-5bd2-a1de-02b83b505e54")}catch(e){}}();
import parseEnvSeconds from "./tokenExpirationParser.js";
// Default to 8080 for Cloud Run compatibility
const config = {
    port: parseInt(process.env.PORT || "8080", 10),
    nodeEnv: process.env.NODE_ENV || "development",
    databaseUrl: process.env.POSTGRES_PRISMA_URL || "",
    jwtSecret: process.env.JWT_SECRET || "your_jwt_secret",
    jwtExpiration: parseEnvSeconds(process.env.JWT_EXPIRATION, 30 * 24 * 60 * 60), // seconds
};
export default config;
//# sourceMappingURL=config.js.map
//# debugId=862e760c-8895-5bd2-a1de-02b83b505e54
