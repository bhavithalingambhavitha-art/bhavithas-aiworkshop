# CampusPulse frontend

This is a standalone React app built with Vite. It reads events and registrations from the Flask API and does not include login or authentication.

## Run locally

1. Start the API from `../backend` with `python app.py`.
2. Run `npm install` and `npm run dev` from this directory.
3. Open the local Vite URL printed in the terminal.

The frontend reads `VITE_BACKEND_URL` from `.env.local`. It defaults to `http://127.0.0.1:5000`. `local.env` contains the same local setting as a reference. Replace the value in `.env.local` with your deployed API origin when one is available.

Available API routes are documented in `../backend/README.md`. The current API supports listing events, viewing event registrations, listing a user's registrations, and creating registrations. Event creation is not currently exposed by the API.
