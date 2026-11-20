# CampusPulse frontend

This is a standalone React app built with Vite. It reads events and registrations from the Flask API and does not include login or authentication.

## Run locally

1. Start the API from `../backend` with `python app.py`.
2. Run `npm install` and `npm run dev` from this directory.
3. Open the local Vite URL printed in the terminal.

The frontend reads `VITE_BACKEND_URL` from `.env.local`. It defaults to `http://127.0.0.1:5000`. `local.env` contains the same local setting as a reference. Replace the value in `.env.local` with your deployed API origin when one is available.

## Deploy to Vercel

1. Import this repository into Vercel and set the project root directory to `frontend` (or this directory if it is already the repository root).
2. Use the default Vite settings: install command `npm install`, build command `npm run build`, and output directory `dist`.
3. Add `VITE_BACKEND_URL` in the Vercel project settings for Production and Preview, using the public origin of the deployed Flask API (for example, `https://api.example.com`). Do not include an API path such as `/api`.
4. Deploy. The included `vercel.json` serves the app entry point for direct visits to client-side paths.

The Flask API must be reachable over HTTPS and allow browser requests from the deployed Vercel domain through its CORS configuration. Vite embeds `VITE_` variables into the public frontend bundle, so this setting must contain only a public API URL, never a secret.

Available API routes are documented in `../backend/README.md`. The current API supports listing events, viewing event registrations, listing a user's registrations, and creating registrations. Event creation is not currently exposed by the API.
