---
applyTo: "**/*.ts"
---

Coding standards, domain knowledge, and preferences that AI should follow.

# Coding Standards

-   Use TypeScript for all code, with strict type checking.
-   Use ES6+ syntax and features.
-   Use camelCase for variables and functions, PascalCase for types, interfaces, and components.
-   Use single quotes for strings.
-   Use 2 spaces for indentation.
-   Always use semicolons.
-   Prefer arrow functions for anonymous functions and React components.
-   Use async/await for asynchronous code; avoid callbacks.
-   Use try/catch for error handling in async code.
-   Use JSDoc for function and class documentation.
-   Use eslint and prettier for linting and formatting.
-   Use tsconfig.json for TypeScript configuration.
-   Use package.json and npm for dependency management and scripts.
-   Write modular, reusable, and testable code.
-   Use environment variables for secrets and configuration.

# Next.js

-   Use file-based routing and organize pages under /app or /pages as appropriate.
-   Use server components for data fetching when possible (Next.js 14.25).
-   Use API routes for backend logic when needed.
-   Use UseEffect and UseState hooks for state management in client components and data fetching.
-   Use environment variables via process.env for configuration.

# Prisma

-   Use Prisma Client for all database access.
-   Define models in schema.prisma and keep them up to date.
-   Use migrations for schema changes; never edit the database schema manually.
-   Use type-safe queries and avoid raw SQL unless necessary.
-   Use Prisma's validation and relations for data integrity.
-   Seed the database using Prisma's seed scripts.
-   Keep database access in a lib/prisma.ts or similar utility file.

# React

-   Use functional components and React hooks.
-   Use state and effect hooks for local state and side effects.
-   Use context or state management libraries for global state if needed.
-   Use prop types and interfaces for all components.
-   Keep components small and focused; use composition over inheritance.
-   Use Tailwind CSS for styling; prefer utility classes over custom CSS.
-   Use accessibility best practices (aria labels, semantic HTML).

# Preferences

-   Prefer map, filter, and reduce for array operations.
-   Prefer const over let for variables that do not change.
-   Prefer === and !== for equality checks.
-   Prefer null over undefined for uninitialized values.
-   No Any, Object, or unknown types; always use specific types.
-   I don't want you to make any UI changes without my explicit request or permission.