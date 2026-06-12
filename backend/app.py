import sys
from pathlib import Path

from flask import jsonify
from dotenv import load_dotenv

BACKEND_DIR = Path(__file__).resolve().parent
ROOT_DIR = BACKEND_DIR.parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

load_dotenv(ROOT_DIR / ".env")

from config import Config
from models import db
from routes.admin import bp as admin_bp
from routes.orders import bp as orders_bp
from routes.pages import bp as pages_bp
from routes.products import bp as products_bp
from seed import seed_products
from flask import Flask


def create_app():
    app = Flask(
        __name__,
        template_folder=str(ROOT_DIR / "templates"),
        static_folder=str(ROOT_DIR / "static"),
        static_url_path="/static",
    )
    app.config.from_object(Config)

    db.init_app(app)

    app.register_blueprint(pages_bp)
    app.register_blueprint(products_bp)
    app.register_blueprint(orders_bp)
    app.register_blueprint(admin_bp)

    @app.get("/api/health")
    def health():
        return jsonify({"status": "ok", "service": "Mwema Solutions API"})

    with app.app_context():
        db.create_all()
        seed_products(app.config)

    return app


app = create_app()


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
