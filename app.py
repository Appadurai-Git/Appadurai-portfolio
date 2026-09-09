"""
Portfolio backend for Appadurai M.
Serves the single-page portfolio and a small JSON API for the contact form
and resume download.
"""
import json
import os
import re
from datetime import datetime, timezone

from flask import Flask, render_template, request, jsonify, send_from_directory

app = Flask(__name__)

DATA_DIR = os.path.join(app.root_path, "data")
MESSAGES_FILE = os.path.join(DATA_DIR, "messages.json")
EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")

PROFILE = {
    "name": "Appadurai M",
    "role": "Backend Developer & Data Analyst",
    "location": "Tirunelveli, Tamil Nadu, India",
    "email": "appadurai491@gmail.com",
    "phone": "+91 8637605252",
}


def _ensure_data_dir():
    os.makedirs(DATA_DIR, exist_ok=True)
    if not os.path.exists(MESSAGES_FILE):
        with open(MESSAGES_FILE, "w") as f:
            json.dump([], f)


@app.route("/")
def index():
    return render_template("index.html", profile=PROFILE)


@app.route("/api/contact", methods=["POST"])
def contact():
    payload = request.get_json(silent=True) or {}
    name = (payload.get("name") or "").strip()
    email = (payload.get("email") or "").strip()
    message = (payload.get("message") or "").strip()

    errors = {}
    if len(name) < 2:
        errors["name"] = "Enter your full name."
    if not EMAIL_RE.match(email):
        errors["email"] = "Enter a valid email address."
    if len(message) < 10:
        errors["message"] = "Message should be at least 10 characters."

    if errors:
        return jsonify({"ok": False, "errors": errors}), 400

    _ensure_data_dir()
    with open(MESSAGES_FILE, "r+") as f:
        records = json.load(f)
        records.append(
            {
                "name": name,
                "email": email,
                "message": message,
                "received_at": datetime.now(timezone.utc).isoformat(),
            }
        )
        f.seek(0)
        json.dump(records, f, indent=2)
        f.truncate()

    return jsonify({"ok": True, "message": "Thanks — message received. I'll reply by email soon."})


@app.route("/resume")
def resume():
    return send_from_directory(
        os.path.join(app.static_folder, "assets"),
        "Appadurai_M_Resume.pdf",
        as_attachment=True,
        download_name="Appadurai_M_Resume.pdf",
    )


if __name__ == "__main__":
    _ensure_data_dir()
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
