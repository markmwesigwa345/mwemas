import json
from datetime import datetime, timezone

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

ORDER_STATUSES = [
    "received",
    "confirmed",
    "awaiting_payment",
    "payment_confirmed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
]

STATUS_LABELS = {
    "received": "Order Received",
    "confirmed": "Order Confirmed",
    "awaiting_payment": "Awaiting Payment",
    "payment_confirmed": "Payment Confirmed",
    "processing": "Processing",
    "shipped": "Shipped",
    "delivered": "Delivered",
    "cancelled": "Cancelled",
}


class Product(db.Model):
    __tablename__ = "products"

    id = db.Column(db.Integer, primary_key=True)
    sku = db.Column(db.String(64), unique=True, nullable=False)
    brand = db.Column(db.String(64), nullable=False)
    name = db.Column(db.String(200), nullable=False)
    type = db.Column(db.String(32), nullable=False)
    condition = db.Column(db.String(32), nullable=False)
    specs_json = db.Column(db.Text, nullable=False, default="[]")
    price_ugx = db.Column(db.Integer, nullable=False)
    image_url = db.Column(db.String(500), nullable=False, default="")
    stock_qty = db.Column(db.Integer, nullable=False, default=0)
    is_active = db.Column(db.Boolean, nullable=False, default=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    @property
    def specs(self):
        return json.loads(self.specs_json or "[]")

    @specs.setter
    def specs(self, value):
        self.specs_json = json.dumps(value or [])

    def to_dict(self):
        return {
            "id": self.id,
            "sku": self.sku,
            "brand": self.brand,
            "name": self.name,
            "type": self.type,
            "condition": self.condition,
            "specs": self.specs,
            "price_ugx": self.price_ugx,
            "price_display": format_ugx(self.price_ugx),
            "image_url": self.image_url,
            "stock_qty": self.stock_qty,
            "in_stock": self.stock_qty > 0,
            "is_active": self.is_active,
        }


class Order(db.Model):
    __tablename__ = "orders"

    id = db.Column(db.Integer, primary_key=True)
    order_number = db.Column(db.String(32), unique=True, nullable=False, index=True)
    customer_name = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(20), nullable=False, index=True)
    email = db.Column(db.String(120), nullable=True)
    district = db.Column(db.String(80), nullable=False)
    address = db.Column(db.String(300), nullable=False)
    payment_method = db.Column(db.String(32), nullable=False)
    payment_status = db.Column(db.String(32), nullable=False, default="pending")
    status = db.Column(db.String(32), nullable=False, default="received")
    subtotal_ugx = db.Column(db.Integer, nullable=False)
    delivery_fee_ugx = db.Column(db.Integer, nullable=False)
    total_ugx = db.Column(db.Integer, nullable=False)
    notes = db.Column(db.Text, nullable=True)
    admin_note = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    items = db.relationship("OrderItem", backref="order", lazy=True, cascade="all, delete-orphan")
    events = db.relationship(
        "OrderStatusEvent",
        backref="order",
        lazy=True,
        cascade="all, delete-orphan",
        order_by="OrderStatusEvent.created_at",
    )

    def to_dict(self, include_items=True, include_events=False):
        data = {
            "id": self.id,
            "order_number": self.order_number,
            "customer_name": self.customer_name,
            "phone": self.phone,
            "email": self.email,
            "district": self.district,
            "address": self.address,
            "payment_method": self.payment_method,
            "payment_status": self.payment_status,
            "status": self.status,
            "status_label": STATUS_LABELS.get(self.status, self.status),
            "subtotal_ugx": self.subtotal_ugx,
            "delivery_fee_ugx": self.delivery_fee_ugx,
            "total_ugx": self.total_ugx,
            "total_display": format_ugx(self.total_ugx),
            "notes": self.notes,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
        if include_items:
            data["items"] = [item.to_dict() for item in self.items]
        if include_events:
            data["events"] = [event.to_dict() for event in self.events]
        return data


class OrderItem(db.Model):
    __tablename__ = "order_items"

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey("orders.id"), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey("products.id"), nullable=True)
    product_name = db.Column(db.String(200), nullable=False)
    unit_price_ugx = db.Column(db.Integer, nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=1)

    product = db.relationship("Product")

    def to_dict(self):
        return {
            "product_id": self.product_id,
            "product_name": self.product_name,
            "unit_price_ugx": self.unit_price_ugx,
            "unit_price_display": format_ugx(self.unit_price_ugx),
            "quantity": self.quantity,
            "line_total_ugx": self.unit_price_ugx * self.quantity,
        }


class OrderStatusEvent(db.Model):
    __tablename__ = "order_status_events"

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey("orders.id"), nullable=False)
    status = db.Column(db.String(32), nullable=False)
    message = db.Column(db.String(300), nullable=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            "status": self.status,
            "status_label": STATUS_LABELS.get(self.status, self.status),
            "message": self.message,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


class Enquiry(db.Model):
    __tablename__ = "enquiries"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(120), nullable=True)
    need = db.Column(db.String(120), nullable=True)
    budget = db.Column(db.String(80), nullable=True)
    message = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "phone": self.phone,
            "email": self.email,
            "need": self.need,
            "budget": self.budget,
            "message": self.message,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


def format_ugx(amount):
    if amount >= 1_000_000:
        value = amount / 1_000_000
        text = f"{value:.1f}".rstrip("0").rstrip(".")
        return f"UGX {text}M"
    if amount >= 1_000:
        value = amount / 1_000
        text = f"{value:.0f}" if amount % 1000 == 0 else f"{value:.1f}".rstrip("0").rstrip(".")
        return f"UGX {text}K"
    return f"UGX {amount:,}"
