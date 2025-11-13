---
applyTo: "**/api/**"
---

# Next.js API Route Fetching, Caching, and Revalidating Best Practices

This guide provides best practices for agents creating or updating API call routes in Next.js (App Router), focusing on data fetching, caching, revalidation, and the use of the extended fetch API in API routes.

## 1. Fetching Data

### Server Components & Route Handlers

-   Use the native `fetch` API or direct database/ORM calls in server components and route handlers.
-   Make handlers `async` and `await` the fetch or database call.
-   For external APIs, use `fetch`. For internal data, use your ORM/database client.

### API Route Fetch Calls (Best Practices)

-   Use the extended Next.js `fetch` API in API routes to control caching and revalidation on the server.
-   Always use `async/await` for fetch calls in API routes.
-   Use the `cache` option to control how the request interacts with the Next.js Data Cache:
    -   `cache: 'force-cache'`: Use the persistent data cache (returns cached data if available and fresh, otherwise fetches and updates the cache).
    -   `cache: 'no-store'`: Always fetch fresh data from the remote server (never cache).
    -   Default (`auto no cache`): In development, fetches on every request; in production, fetches once at build unless dynamic APIs are detected.
-   Use the `next.revalidate` option to set cache lifetime (in seconds):
    -   `revalidate: false` or `Infinity`: Cache indefinitely (subject to eviction).
    -   `revalidate: 0`: Do not cache.
    -   `revalidate: number`: Cache for at most `n` seconds.
-   Use the `next.tags` option to tag cache entries for on-demand revalidation with `revalidateTag`.
    -   Tags must be strings (max 256 chars, up to 128 tags).
-   Do not use conflicting options (e.g., `{ revalidate: 3600, cache: 'no-store' }`); both will be ignored and a warning will be shown in development.
-   If multiple fetches to the same URL in a route have different `revalidate` values, the lowest value is used.
-   In development, HMR may cache fetch responses for performance. Use a hard refresh or navigation to clear.
-   If the request includes `cache-control: no-cache` (e.g., via browser dev tools), all fetch cache options are ignored and the request is served from the source.

### Client Components

-   Use libraries like SWR or React Query for client-side fetching, caching, and revalidation.
-   For streaming data, use React’s `use` hook and `<Suspense>` for granular loading states.

### Parallel and Sequential Fetching

-   Initiate independent fetches in parallel using `Promise.all` for performance.
-   Use sequential fetching only when later requests depend on earlier results.

### Preloading

-   Preload data by calling fetch functions before rendering components that depend on them.

## 2. Caching Data

### fetch API Caching in API Routes

-   Use `fetch(url, { cache: 'force-cache' })` to enable persistent data caching for API route fetches.
-   Use `fetch(url, { cache: 'no-store' })` to always fetch fresh data (never cache).
-   Use `fetch(url, { next: { revalidate: 3600 } })` to set cache lifetime (in seconds) for the fetched resource.
-   Use `fetch(url, { next: { tags: ['tag1', 'tag2'] } })` to tag cache entries for on-demand revalidation.

## 3. Advanced Caching: unstable_cache

-   Use `unstable_cache` to cache results of async functions (e.g., database queries):
    ```js
    import { unstable_cache } from "next/cache";
    const getCachedUser = unstable_cache(
        async (id) => getUserById(id),
        [userId], // cache key
        { tags: ["user"], revalidate: 3600 }
    );
    ```
-   Use tags to group cache entries for bulk revalidation.

## 4. Revalidating Data

### revalidateTag

-   Use `revalidateTag('tag')` in route handlers or server actions to revalidate all cache entries with a given tag after a mutation.

### revalidatePath

-   Use `revalidatePath('/route')` to revalidate a specific route after a mutation.

## 5. Streaming and Loading States

-   Use `loading.js` files or `<Suspense>` boundaries to provide instant loading states and enable streaming.
-   Design meaningful loading UIs (skeletons, spinners, etc.) for better UX.

## 6. Deduplication

-   Next.js deduplicates identical `fetch` requests within a single render pass.
-   For custom data fetching (e.g., ORM), use React’s `cache` utility to memoize and deduplicate.

## 7. General Best Practices

-   Always handle errors and loading states.
-   Use environment variables for secrets and API keys.
-   Prefer static or cached data when possible for performance.
-   Use tags and revalidation for cache consistency after mutations.
-   Keep API route handlers pure and side-effect free except for intended mutations.

## 8. Troubleshooting fetch in API Routes

-   In development, fetch responses may be cached across Hot Module Replacement (HMR) for performance. Use navigation or a hard refresh to clear.
-   If `cache-control: no-cache` is present in the request, all fetch cache and revalidate options are ignored.
-   Avoid conflicting fetch options (e.g., `cache: 'no-store'` with `revalidate`).
-   If two fetches to the same URL in a route have different `revalidate` values, the lowest value is used.

**References:**

-   https://nextjs.org/docs/app/getting-started/fetching-data
-   https://nextjs.org/docs/app/getting-started/caching-and-revalidating
-   https://nextjs.org/docs/app/api-reference/functions/fetch
-   https://nextjs.org/docs/app/api-reference/functions/unstable_cache
-   https://nextjs.org/docs/app/api-reference/functions/revalidateTag
-   https://nextjs.org/docs/app/api-reference/functions/revalidatePath
