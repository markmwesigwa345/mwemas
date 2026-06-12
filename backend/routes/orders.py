from flask import Blueprint, current_app, jsonify, request

from models import Order, OrderItem, OrderStatusEvent, Product, db
from utils import (
    delivery_fee_for_district,
    generate_order_number,
    normalize_phone,
    rate_limit_track,
)

bp = Blueprint("orders", __name__, url_prefix="/api")


def add_status_event(order, status, message=None):
    event = OrderStatusEvent(order_id=order.id, status=status, message=message)
    db.session.add(event)
    order.status = status


@bp.post("/orders")
def create_order():
    data = request.get_json(silent=True) or {}
    required = ["customer_name", "phone", "district", "address", "payment_method", "items"]
    missing = [field for field in required if not data.get(field)]
    if missing:
        return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400

    items_data = data.get("items") or []
    if not items_data:
        return jsonify({"error": "Cart is empty"}), 400

    payment_method = data["payment_method"]
    if payment_method not in ("cod", "mobile_money"):
        return jsonify({"error": "Invalid payment method"}), 400

    phone = normalize_phone(data["phone"])
    if len(phone) < 12:
        return jsonify({"error": "Invalid phone number"}), 400

    subtotal = 0
    order_items = []

    for item in items_data:
        product_id = item.get("product_id")
        quantity = int(item.get("quantity", 1))
        if quantity < 1:
            return jsonify({"error": "Invalid quantity"}), 400

        product = Product.query.filter_by(id=product_id, is_active=True).first()
        if not product:
            return jsonify({"error": f"Product {product_id} not found"}), 400
        if product.stock_qty < quantity:
            return jsonify({"error": f"{product.name} is out of stock or insufficient quantity"}), 400

        line_total = product.price_ugx * quantity
        subtotal += line_total
        order_items.append((product, quantity))

    delivery_fee = delivery_fee_for_district(data["district"], current_app.config)
    total = subtotal + delivery_fee

    if payment_method == "mobile_money":
        initial_status = "awaiting_payment"
        payment_status = "pending"
    else:
        initial_status = "received"
        payment_status = "not_required"

    order = Order(
        order_number=generate_order_number(),
        customer_name=data["customer_name"].strip(),
        phone=phone,
        email=(data.get("email") or "").strip() or None,
        district=data["district"].strip(),
        address=data["address"].strip(),
        payment_method=payment_method,
        payment_status=payment_status,
        status=initial_status,
        subtotal_ugx=subtotal,
        delivery_fee_ugx=delivery_fee,
        total_ugx=total,
        notes=(data.get("notes") or "").strip() or None,
    )
    db.session.add(order)
    db.session.flush()

    add_status_event(
        order,
        initial_status,
        "Order placed successfully."
        if initial_status == "received"
        else "Please complete mobile money payment to proceed.",
    )

    for product, quantity in order_items:
        db.session.add(
            OrderItem(
                order_id=order.id,
                product_id=product.id,
                product_name=product.name,
                unit_price_ugx=product.price_ugx,
                quantity=quantity,
            )
        )
        product.stock_qty -= quantity

    db.session.commit()

    return jsonify(
        {
            "success": True,
            "order": order.to_dict(include_items=True, include_events=True),
            "payment_instructions": build_payment_instructions(order, current_app.config)
            if payment_method == "mobile_money"
            else None,
        }
    ), 201


@bp.post("/orders/track")
def track_order():
    if not rate_limit_track():
        return jsonify({"error": "Too many attempts. Please wait a minute."}), 429

    data = request.get_json(silent=True) or {}
    order_number = (data.get("order_number") or "").strip().upper()
    phone = normalize_phone(data.get("phone", ""))

    if not order_number or not phone:
        return jsonify({"error": "Order number and phone are required"}), 400

    order = Order.query.filter_by(order_number=order_number).first()
    if not order or order.phone != phone:
        return jsonify({"error": "Order not found. Check your order number and phone."}), 404

    return jsonify(
        {
            "order": order.to_dict(include_items=True, include_events=True),
            "timeline": [event.to_dict() for event in order.events],
        }
    )


@bp.get("/orders/<order_number>/summary")
def order_summary(order_number):
    order = Order.query.filter_by(order_number=order_number.upper()).first()
    if not order:
        return jsonify({"error": "Order not found"}), 404
    return jsonify(
        {
            "order": order.to_dict(include_items=True, include_events=True),
            "payment_instructions": build_payment_instructions(order, current_app.config)
            if order.payment_method == "mobile_money" and order.payment_status == "pending"
            else None,
        }
    )


@bp.post("/enquiries")
def create_enquiry():
    data = request.get_json(silent=True) or {}
    name = (data.get("name") or "").strip()
    phone = normalize_phone(data.get("phone", ""))
    if not name or not phone:
        return jsonify({"error": "Name and phone are required"}), 400

    from models import Enquiry

    enquiry = Enquiry(
        name=name,
        phone=phone,
        email=(data.get("email") or "").strip() or None,
        need=(data.get("need") or "").strip() or None,
        budget=(data.get("budget") or "").strip() or None,
        message=(data.get("message") or "").strip() or None,
    )
    db.session.add(enquiry)
    db.session.commit()
    return jsonify({"success": True, "message": "Enquiry received. We will respond within 24 hours."})


def build_payment_instructions(order, config):
    return {
        "amount_ugx": order.total_ugx,
        "amount_display": order.to_dict()["total_display"],
        "reference": order.order_number,
        "mtn": config.MTN_NUMBER,
        "airtel": config.AIRTEL_NUMBER,
        "instructions": (
            f"Send {order.to_dict()['total_display']} to MTN {config.MTN_NUMBER} "
            f"or Airtel {config.AIRTEL_NUMBER}. Use order ID {order.order_number} as the reference."
        ),
    }
