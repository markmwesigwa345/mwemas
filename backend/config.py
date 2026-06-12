import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent


class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "mwema-dev-secret-change-in-production")
    _db_url = os.environ.get("DATABASE_URL", f"sqlite:///{(BASE_DIR / 'mwema.db').as_posix()}")
    if _db_url.startswith("postgres://"):
        _db_url = _db_url.replace("postgres://", "postgresql://", 1)
    SQLALCHEMY_DATABASE_URI = _db_url
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    ADMIN_USERNAME = os.environ.get("ADMIN_USERNAME", "admin")
    ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "mwema2026")
    MTN_NUMBER = os.environ.get("MTN_NUMBER", "+256701913028")
    AIRTEL_NUMBER = os.environ.get("AIRTEL_NUMBER", "+256784841119")
    WHATSAPP_NUMBER = os.environ.get("WHATSAPP_NUMBER", "256701913028")
    DELIVERY_FEE_KAMPALA = int(os.environ.get("DELIVERY_FEE_KAMPALA", "15000"))
    DELIVERY_FEE_UPCOUNTRY = int(os.environ.get("DELIVERY_FEE_UPCOUNTRY", "35000"))
    KAMPALA_DISTRICTS = {
        "kampala",
        "wakiso",
        "mukono",
        "entebbe",
    }
    PRODUCTS_JSON = BASE_DIR / "data" / "products.json"
