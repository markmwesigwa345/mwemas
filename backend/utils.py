import random
import re
import string
from datetime import date, datetime, timezone
from functools import wraps
from flask import jsonify, request, session

_track_attempts = {}

def normalize_phone(phone):
    if not phone:
        return ""
    digits = re.sub(r"\D", "", phone)
    if digits.startswith("256"):
        return "+" + digits
    if digits.startswith("0"):
        return "+256" + digits[1:]
    if len(digits) == 9:
        return "+256" + digits
    return "+" + digits if not phone.startswith("+") else phone

def generate_order_number():
    today = date.today().strftime("%Y%m%d")
    suffix = "".join(random.choices(string.ascii_uppercase + string.digits, k=4))
    return f"MW-{today}-{suffix}"

def delivery_fee_for_district(district, config):
    name = (district or "").strip().lower()
    if name in config["KAMPALA_DISTRICTS"] or "kampala" in name:
        return config["DELIVERY_FEE_KAMPALA"]
    return config["DELIVERY_FEE_UPCOUNTRY"]

def admin_required(view):
    @wraps(view)
    def wrapped(*args, **kwargs):
        if not session.get("admin_logged_in"):
            return jsonify({"error": "Unauthorized"}), 401
        return view(*args, **kwargs)
    return wrapped

def rate_limit_track(max_attempts=5, window_seconds=60):
    ip = request.remote_addr or "unknown"
    now = datetime.now(timezone.utc)
    attempts = _track_attempts.get(ip, [])
    attempts = [t for t in attempts if (now - t).total_seconds() < window_seconds]
    if len(attempts) >= max_attempts:
        return False
    attempts.append(now)
    _track_attempts[ip] = attempts
    return True
