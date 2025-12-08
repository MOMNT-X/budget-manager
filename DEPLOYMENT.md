# Deployment Guide - SPA Routing Fix

## Problem
Nested routes (like `/app/transactions`, `/app/expenses`, etc.) were returning 404 errors when accessed directly on Render, even though they worked fine in local development.

## Root Cause
The `vite preview` command doesn't properly handle Single Page Application (SPA) routing. When a user directly accesses a nested route or refreshes the page, the server tries to find a file at that path instead of serving `index.html` and letting React Router handle the routing.

## Solution
We've replaced `vite preview` with the `serve` package, which is specifically designed for serving static sites with proper SPA support.

## Changes Made

### 1. Updated `package.json`
- Changed the `start` script from `vite preview` to `serve dist -s -n -l ${PORT:-10000}`
- Added `serve` package (v14.2.4) as a dependency
- The `-s` flag enables SPA mode (rewrites all 404s to `/index.html`)
- The `-n` flag disables clipboard operations (better for production)
- The `-l` flag specifies the port (defaults to 10000, matches Render's configuration)

### 2. Created `serve.json`
Added a configuration file with:
- Rewrite rules to redirect all requests to `/index.html`
- Cache headers for static assets (1 year cache for JS, CSS, images, fonts)

### 3. Updated `README.md`
Updated deployment instructions to reflect the new server configuration.

## How to Test Locally

1. **Install the new dependency:**
   ```bash
   npm install
   ```

2. **Build the application:**
   ```bash
   npm run build
   ```

3. **Test with the production server:**
   ```bash
   npm run start
   ```

4. **Test nested routes directly:**
   - Open `http://localhost:10000/app/transactions`
   - Refresh the page
   - Navigate to other routes like `/app/expenses`, `/app/budget`, etc.
   - All routes should work without 404 errors

## Deployment to Render

1. **Commit and push the changes:**
   ```bash
   git add .
   git commit -m "Fix nested routes 404 error - switch to serve package"
   git push
   ```

2. **Render will automatically:**
   - Run `npm install` (installs the `serve` package)
   - Run `npm run build` (builds the production bundle)
   - Run `npm start` (starts the `serve` server with SPA support)

3. **Test on Render:**
   After deployment, test these URLs directly:
   - `https://your-app.onrender.com/app/transactions`
   - `https://your-app.onrender.com/app/expenses`
   - `https://your-app.onrender.com/app/budget`
   - `https://your-app.onrender.com/signup`
   - `https://your-app.onrender.com/login`

All routes should now work correctly without 404 errors!

## Technical Details

### Why `serve` Works
The `serve` package with the `-s` (SPA) flag:
1. Serves static files from the `dist` directory
2. Catches all requests that don't match a file
3. Returns `index.html` for those requests
4. Lets React Router handle the routing on the client side

### Configuration Files
- `serve.json` - Additional configuration for caching and rewrites
- `render.yaml` - Render deployment configuration (uses `npm start`)
- `public/_redirects` - Fallback for static hosting providers

### Benefits
- ✅ Proper SPA routing in production
- ✅ Direct access to nested routes works
- ✅ Page refreshes work correctly
- ✅ Better caching for static assets
- ✅ Optimized for production deployment

## Troubleshooting

If you still see 404 errors:

1. **Clear Render's cache:**
   - Go to Render dashboard
   - Select your service
   - Click "Manual Deploy" → "Clear build cache & deploy"

2. **Check the build logs:**
   - Ensure `npm install` completes successfully
   - Verify `serve` package is installed
   - Check that `npm run build` creates the `dist` directory

3. **Verify environment variables:**
   - The PORT variable should be set to 10000 in `render.yaml`
   - This matches Render's internal routing

4. **Test locally first:**
   - Always run `npm run build && npm run start` locally
   - Test nested routes before deploying

## Additional Resources
- [serve documentation](https://github.com/vercel/serve)
- [React Router documentation](https://reactrouter.com/)
- [Render deployment documentation](https://render.com/docs/deploy-create-react-app)
