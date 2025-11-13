---
applyTo: "**/*.ts"
---

Coding standards, domain knowledge, and preferences that AI should follow.

# General Coding Principles

-   Write clean, maintainable, and efficient code.
-   Follow the DRY (Don't Repeat Yourself) principle.
-   Prioritize readability, scalability, and maintainability.
-   Enforce strict TypeScript settings (strict, noImplicitAny, strictNullChecks, etc.).
-   Follow SOLID principles and functional programming patterns where appropriate.
-   Avoid over-engineering; solve with the simplest viable architecture.
-   Use camelCase for variables/functions, PascalCase for components/types, UPPER_SNAKE_CASE for constants.
-   All files must have a single export (default or named) unless it's a utility file.
-   Limit function files to <100 LOC where possible.
-   Prefer immutability—use spread operators or utility libraries like immer.
-   One file per component/service/hook.
-   Group code by feature, not by type (domain-driven folder structure).
-   Avoid deeply nested folder structures (>3 levels).
-   Use barrel files (index.ts) for module exports.
    🧠 Architectural Guidelines
-   Use dependency injection for services (where supported, like in NestJS).
-   Business logic lives outside of controllers/components.
-   Keep side-effects isolated and testable (e.g., in services or utils).
-   API consumers must handle all response statuses and errors explicitly.
    🛠️ Performance & Optimization
-   Lazy-load components with React.lazy() or Next.js dynamic imports.
-   Avoid anonymous functions in JSX when not memoized.
-   Memoize expensive computations using useMemo, useCallback.
    💬 Documentation & Comments
-   Functions >10 LOC should have JSDoc comments.
-   Types/interfaces should include a purpose description.

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
-   Don't create summary md files without the user asking for one.
-   Never create documentation files, summaries, or README files unless explicitly requested by the user.
-   Focus on implementing requested functionality rather than documenting it unless documentation is specifically asked for.

# Project Structure Suggestions

```
src/
  app/           # Next.js app router pages
  components/    # Reusable UI components
  features/      # Feature-based slices
  lib/           # Pure utilities
  services/      # API & business logic (Prisma lives here)
  types/         # Shared TypeScript types
  hooks/         # Custom React hooks
  styles/        # Global CSS/SCSS
  middleware.ts  # Edge Middleware
prisma/
  schema.prisma
  migrations/
```
