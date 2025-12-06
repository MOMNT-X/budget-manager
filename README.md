# Budget Manager

A Vite + React application showcasing a modern personal finance experience with multiple dashboard-style routes.

## Local Development
- Install dependencies: `npm install`
- Start the dev server: `npm run dev`
- Create a production build: `npm run build`
- Preview the production bundle locally: `npm run preview`

`npm run preview` uses the same static server configuration that runs in production, so it is the quickest way to confirm that navigation and deep links work before deploying.

## Production Deployment
- Build artifacts are emitted to `dist/`. Use this directory for any "Publish Directory" or static hosting setting.
- A `_redirects` file in `public/` rewrites every request (`/*`) to `/index.html`. This guarantees React Router always receives the URL, preventing 404s when a user refreshes or deep-links to a nested page such as `/app/transactions`.
- Render deployments are managed via `render.yaml`. The service now includes a rewrite rule that mirrors the `_redirects` behavior, so both Docker-based and static Render services return the SPA shell for unknown paths.

After every deploy:
1. Run `npm run build && npm run preview` locally to ensure the bundle works.
2. Deploy the updated build (Render automatically runs `npm run build`).
3. Test a few direct URLs (`/signup`, `/app/transactions`, etc.) in the hosted environment to confirm the rewrite is active.

With the rewrite rules in place, you can safely demo the production site without encountering 404 errors on nested routes.
