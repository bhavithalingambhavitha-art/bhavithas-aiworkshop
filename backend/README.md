# CampusPulse backend

## Deploy to Render

1. Push this repository to a Git provider supported by Render.
2. In Render, choose **New → Blueprint** and connect the repository. Render will use the root `render.yaml` to create the web service.
3. Set `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` when prompted, using the values from your Supabase project.
4. Deploy. Render installs `requirements.txt` and starts the app with Gunicorn.

The app also runs locally from this directory with `python app.py` after installing `requirements.txt` and setting those two variables in `backend/.env`.

The frontend lives in `frontend/`. It provides event discovery, registrations, organizer summaries, and analytics. With authentication disabled, enter a database user UUID in the header to view personal registrations and register for events. The organizer view matches the same value to `events.organizer_id`.

## API routes

- `GET /api/events`
- `GET /api/events/<id>`
- `POST /api/registrations`
- `GET /api/me/registrations?user_id=<uuid>`
- `GET /api/events/<id>/registrations`

The API allows cross-origin requests from any origin, as configured in `app.py`.
