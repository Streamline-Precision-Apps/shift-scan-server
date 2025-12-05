This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## iOS CI / fastlane (important CI secret)

If you run the iOS Fastlane lanes in CI (GitHub Actions), Fastlane's `match` uses a git-backed storage mode to fetch certificates and profiles. You must add a repository secret named `MATCH_GIT_URL` (in your repo Settings → Secrets & variables → Actions) so the workflow can provide the URL to the private certs repo.

- For GitHub private repos, the recommended format is:

```
https://x-access-token:${{ secrets.PAT_FOR_MATCH }}@github.com/your-org/fastlane-certs.git
```

Where `PAT_FOR_MATCH` is a Personal Access Token stored as a separate secret. If your CI is read-only (recommended), the PAT only needs read access; if you expect CI to write to the certs repo (not recommended for most setups), the PAT will need write permissions.

Add `MATCH_GIT_URL` to your Actions environment (the workflow has been updated to use this secret) so `match` won't fail with "No value found for 'git_url'".
