from flask import Blueprint, current_app, jsonify, redirect, render_template, request, session, url_for

from models import ORDER_STATUSES, Order, OrderStatusEvent, Product, db
from seed import seed_products
from utils import admin_required, normalize_phone

bp = Blueprint("admin", __name__, url_prefix="/admin")


@bp.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        if request.is_json:
            data = request.get_json(silent=True) or {}
            username = data.get("username", "")
            password = data.get("password", "")
        else:
            username = request.form.get("username", "")
            password = request.form.get("password", "")

        if (
            username == current_app.config["ADMIN_USERNAME"]
            and password == current_app.config["ADMIN_PASSWORD"]
        ):
            session["admin_logged_in"] = True
            if request.is_json:
                return jsonify({"success": True})
            return redirect(url_for("admin.dashboard"))

        if request.is_json:
            return jsonify({"error": "Invalid credentials"}), 401
        return render_template("admin/login.html", error="Invalid username or password")

    return render_template("admin/login.html")


@bp.post("/logout")
def logout():
    session.pop("admin_logged_in", None)
    if request.is_json:
        return jsonify({"success": True})
    return redirect(url_for("admin.login"))


@bp.route("/")
@bp.route("/dashboard")
def dashboard():
    if not session.get("admin_logged_in"):
        return redirect(url_for("admin.login"))

    status_filter = request.args.get("status", "")
    query = Order.query.order_by(Order.created_at.desc())
    if status_filter:
        query = query.filter_by(status=status_filter)

    orders = query.limit(100).all()
    low_stock = Product.query.filter(Product.stock_qty < 2, Product.is_active.is_(True)).all()
    pending_payment = Order.query.filter_by(payment_status="pending").count()

    return render_template(
        "admin/dashboard.html",
        orders=orders,
        statuses=ORDER_STATUSES,
        status_filter=status_filter,
        low_stock=low_stock,
        pending_payment=pending_payment,
    )


@bp.route("/orders/<int:order_id>")
def order_detail(order_id):
    if not session.get("admin_logged_in"):
        return redirect(url_for("admin.login"))

    order = Order.query.get_or_404(order_id)
    return render_template(
        "admin/order_detail.html",
        order=order,
        statuses=ORDER_STATUSES,
    )


@bp.patch("/orders/<int:order_id>")
@admin_required
def update_order(order_id):
    order = Order.query.get_or_404(order_id)
    data = request.get_json(silent=True) or {}

    new_status = data.get("status")
    if new_status and new_status in ORDER_STATUSES:
        message = data.get("message") or f"Status updated to {new_status.replace('_', ' ')}."
        event = OrderStatusEvent(order_id=order.id, status=new_status, message=message)
        db.session.add(event)
        order.status = new_status

    if data.get("admin_note") is not None:
        order.admin_note = data.get("admin_note")

    if data.get("confirm_payment"):
        order.payment_status = "confirmed"
        if order.status == "awaiting_payment":
            event = OrderStatusEvent(
                order_id=order.id,
                status="payment_confirmed",
                message="Mobile money payment verified by admin.",
            )
            db.session.add(event)
            order.status = "payment_confirmed"

    db.session.commit()
    return jsonify({"success": True, "order": order.to_dict(include_items=True, include_events=True)})


@bp.get("/api/orders")
@admin_required
def api_orders():
    orders = Order.query.order_by(Order.created_at.desc()).limit(200).all()
    return jsonify([o.to_dict(include_items=True) for o in orders])


@bp.route("/products")
def products_page():
    if not session.get("admin_logged_in"):
        return redirect(url_for("admin.login"))
    products = Product.query.order_by(Product.id).all()
    return render_template("admin/products.html", products=products)


@bp.post("/products")
@admin_required
def create_product():
    data = request.get_json(silent=True) or {}
    product = Product(
        sku=data["sku"],
        brand=data["brand"],
        name=data["name"],
        type=data["type"],
        condition=data["condition"],
        price_ugx=int(data["price_ugx"]),
        image_url=data.get("image_url", ""),
        stock_qty=int(data.get("stock_qty", 0)),
        is_active=bool(data.get("is_active", True)),
    )
    product.specs = data.get("specs", [])
    db.session.add(product)
    db.session.commit()
    return jsonify(product.to_dict()), 201


@bp.patch("/products/<int:product_id>")
@admin_required
def update_product(product_id):
    product = Product.query.get_or_404(product_id)
    data = request.get_json(silent=True) or {}

    for field in ("sku", "brand", "name", "type", "condition", "image_url"):
        if field in data:
            setattr(product, field, data[field])
    if "price_ugx" in data:
        product.price_ugx = int(data["price_ugx"])
    if "stock_qty" in data:
        product.stock_qty = int(data["stock_qty"])
    if "is_active" in data:
        product.is_active = bool(data["is_active"])
    if "specs" in data:
        product.specs = data["specs"]

    db.session.commit()
    return jsonify(product.to_dict())


@bp.post("/seed")
@admin_required
def run_seed():
    count = seed_products(current_app.config)
    return jsonify({"success": True, "seeded": count})
