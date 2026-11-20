# CampusPulse

CampusPulse is a Flask and Supabase campus events app. The responsive frontend is served by the Flask backend and uses the same API routes.

## Run locally

From `backend/`, install packages with `pip install -r requirements.txt`, set `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` in `backend/.env`, then start `python app.py`. Open `http://127.0.0.1:5000`.

The interface includes event discovery, personal registrations, organizer summaries, and database-backed analytics. Because the API has no authentication, enter a user's database UUID in the top bar to view or create registrations. Organizer summaries match that value to `events.organizer_id`.

## Deploy

Connect this repository to Render using the root `render.yaml` Blueprint. Provide `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` when prompted. See [backend/README.md](backend/README.md) for details.
