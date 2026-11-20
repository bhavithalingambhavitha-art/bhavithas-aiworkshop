import os

from dotenv import load_dotenv
from flask import Flask, jsonify, request
from postgrest import APIError
from supabase import Client, create_client

load_dotenv()

app = Flask(__name__)

supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_PUBLISHABLE_KEY")
supabase: Client | None = (
    create_client(supabase_url, supabase_key)
    if supabase_url and supabase_key
    else None
)


@app.after_request
def enable_cors(response):
    """Allow browser clients from any origin to call this unauthenticated API."""
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    return response


def database():
    if supabase is None:
        return None, (jsonify(error="Database is not configured"), 500)
    return supabase, None


def db_error(error):
    return jsonify(error=getattr(error, "message", str(error))), 500


@app.route("/", methods=["GET"])
def index():
    return jsonify(service="CampusPulse API", status="ok")


@app.route("/api/events", methods=["GET"])
def list_events():
    client, error_response = database()
    if error_response:
        return error_response
    try:
        result = client.table("events").select("*").execute()
        return jsonify(result.data)
    except APIError as error:
        return db_error(error)


@app.route("/api/events/<event_id>", methods=["GET"])
def get_event(event_id):
    client, error_response = database()
    if error_response:
        return error_response
    try:
        result = client.table("events").select("*").eq("id", event_id).limit(1).execute()
        if not result.data:
            return jsonify(error="Event not found"), 404
        return jsonify(result.data[0])
    except APIError as error:
        return db_error(error)


@app.route("/api/registrations", methods=["POST"])
def create_registration():
    payload = request.get_json(silent=True)
    if not isinstance(payload, dict):
        return jsonify(error="Request body must be a JSON object"), 400
    user_id = payload.get("user_id")
    event_id = payload.get("event_id")
    if not user_id or not event_id:
        return jsonify(error="user_id and event_id are required"), 400

    client, error_response = database()
    if error_response:
        return error_response
    try:
        # Avoid duplicate registrations and return the documented 409 response.
        existing = (client.table("registrations").select("id")
                    .eq("user_id", user_id).eq("event_id", event_id)
                    .limit(1).execute())
        if existing.data:
            return jsonify(error="User is already registered for this event"), 409

        event_result = (client.table("events").select("id,capacity")
                        .eq("id", event_id).limit(1).execute())
        if not event_result.data:
            return jsonify(error="Event not found"), 404
        capacity = event_result.data[0].get("capacity")
        if capacity is not None:
            count_result = (client.table("registrations").select("id", count="exact")
                            .eq("event_id", event_id).execute())
            if count_result.count is not None and count_result.count >= capacity:
                return jsonify(error="Event is full"), 409

        result = client.table("registrations").insert({
            "user_id": user_id,
            "event_id": event_id,
        }).execute()
        return jsonify(result.data[0] if result.data else {}), 201
    except APIError as error:
        # Covers unique-constraint conflicts and database-level capacity constraints.
        message = getattr(error, "message", str(error))
        code = getattr(error, "code", None)
        if code == "23505":
            return jsonify(error="User is already registered for this event"), 409
        return jsonify(error=message), 500


@app.route("/api/me/registrations", methods=["GET"])
def list_user_registrations():
    user_id = request.args.get("user_id")
    if not user_id:
        return jsonify(error="user_id query parameter is required"), 400
    client, error_response = database()
    if error_response:
        return error_response
    try:
        result = (client.table("registrations").select("*")
                  .eq("user_id", user_id).execute())
        return jsonify(result.data)
    except APIError as error:
        return db_error(error)


@app.route("/api/events/<event_id>/registrations", methods=["GET"])
def list_event_registrations(event_id):
    client, error_response = database()
    if error_response:
        return error_response
    try:
        result = (client.table("registrations").select("*")
                  .eq("event_id", event_id).execute())
        return jsonify(result.data)
    except APIError as error:
        return db_error(error)


if __name__ == "__main__":
    app.run(debug=True)
