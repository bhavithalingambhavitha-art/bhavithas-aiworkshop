# CampusPulse

CampusPulse is a React frontend and Flask/Supabase API for campus events. The frontend lives in `frontend/` and calls the backend configured in `frontend/.env.local`.

## Run locally

Start the API from `backend/`: install packages with `pip install -r requirements.txt`, set `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` in `backend/.env`, then run `python app.py`.

In another terminal, start the React app from `frontend/` with `npm install` and `npm run dev`. Open the Vite URL shown in the terminal. The default `VITE_BACKEND_URL` is `http://127.0.0.1:5000`; set it in `frontend/.env.local` to use a deployed backend.

The interface includes event discovery, personal registrations, organizer summaries, and analytics. There are no login or authentication flows. Enter a database user ID in the top bar to view or create registrations. Organizer summaries match that value to `events.organizer_id`.

## Deploy

Connect this repository to Render using the root `render.yaml` Blueprint. Provide `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` when prompted. See [backend/README.md](backend/README.md) for details.
