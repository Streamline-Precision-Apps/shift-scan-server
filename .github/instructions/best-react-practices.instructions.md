---
applyTo: "**/*.ts"
---

# Best Practices for Writing React Applications

Following best practices in React development ensures maintainable, scalable, and performant applications. Here’s a concise guide:

## 1. Structure and Organization

- **Keep components small and focused.** Each component should do one thing well.
- **Organize by feature, not by type.** Group related files (component, styles, tests) together.
- **Use index.js for module entry points** for easier imports.

## 2. Functional Components & Hooks

- **Prefer functional components** over class components.
- **Use React hooks** (`useState`, `useEffect`, `useMemo`, etc.) for state and lifecycle management.
- **Custom hooks** can encapsulate reusable logic.

## 3. State Management

- **Lift state up** only when needed. Keep state local as much as possible.
- **Use context for global state** sparingly; consider libraries like Redux or Zustand for complex state.
- **Normalize state shape** (avoid deeply nested structures).

## 4. Props and Data Flow

- **Use PropTypes or TypeScript** for type safety.
- **Pass only necessary props** to child components.
- **Avoid prop drilling** by using context or composition patterns.

## 5. Performance Optimization

- **Memoize components** with `React.memo` and hooks like `useMemo`/`useCallback`.
- **Lazy load components** with `React.lazy` and `Suspense`.
- **Avoid unnecessary renders** by splitting components and using keys correctly.

## 6. Side Effects and Data Fetching

- **Use `useEffect` for side effects**, and clean up after them.
- **Fetch data in effects** and handle loading, error, and success states.
- **Prefer SWR/React Query** for data fetching and caching.

## 7. Styling

- **Use CSS Modules, CSS-in-JS, or utility libraries** for scoped and maintainable styles.
- **Avoid global styles leakage.**
- **Name classes descriptively.**

## 8. Testing

- **Write tests for components** using React Testing Library or Enzyme.
- **Test user interactions and outcomes**, not implementation details.
- **Aim for high coverage but focus on critical paths.**

## 9. Accessibility (a11y)

- **Use semantic HTML elements** and ARIA attributes where needed.
- **Ensure keyboard navigation** and screen reader compatibility.
- **Test with accessibility tools.**

## 10. Code Quality

- **Use ESLint and Prettier** for consistent code style.
- **Keep dependencies updated** and review third-party packages.
- **Document components** and logic with comments or Storybook.

## 11. Deployment and Optimization

- **Minimize bundle size** with code splitting and tree shaking.
- **Use environment variables** for config.
- **Monitor and optimize performance** with tools like Lighthouse.

---

_Adhering to these practices will help you write clean, efficient, and scalable React applications._
