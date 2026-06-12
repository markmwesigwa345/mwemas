from flask import Blueprint, jsonify, request

from models import Product

bp = Blueprint("products", __name__, url_prefix="/api")


@bp.get("/products")
def list_products():
    query = Product.query.filter_by(is_active=True)
    product_type = request.args.get("type")
    condition = request.args.get("condition")
    featured = request.args.get("featured")

    if product_type and product_type != "all":
        if product_type == "refurb":
            query = query.filter_by(condition="refurb")
        else:
            query = query.filter_by(type=product_type)
    if condition:
        query = query.filter_by(condition=condition)

    products = query.order_by(Product.id).all()
    if featured:
        try:
            limit = int(featured)
            products = products[:limit]
        except ValueError:
            products = products[:3]

    return jsonify([p.to_dict() for p in products])


@bp.get("/products/<int:product_id>")
def get_product(product_id):
    product = Product.query.filter_by(id=product_id, is_active=True).first()
    if not product:
        return jsonify({"error": "Product not found"}), 404
    return jsonify(product.to_dict())
