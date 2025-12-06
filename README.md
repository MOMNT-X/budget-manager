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
- The production server uses `serve` with SPA mode (`-s` flag) to handle routing. This ensures all routes are served through `index.html`, preventing 404s when a user refreshes or deep-links to a nested page such as `/app/transactions`.
- A `serve.json` configuration file provides additional routing rules and cache headers for optimal performance.
- Render deployments are managed via `render.yaml`. The service runs `npm start` which uses the `serve` package with SPA support.

After every deploy:
1. Run `npm run build && npm run start` locally to test the production bundle with the same server that runs in production.
2. Deploy the updated build (Render automatically runs `npm run build`).
3. Test direct URLs (`/signup`, `/app/transactions`, etc.) in the hosted environment to confirm routing works correctly.

With the `serve` package handling SPA routing, nested routes will work correctly on Render without 404 errors.
