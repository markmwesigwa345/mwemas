import json

from models import Product, db
from pathlib import Path
from models import Product, db

def seed_products(config):
    path = Path(config["PRODUCTS_JSON"])
    if not path.exists():
        return 0

    with open(path, encoding="utf-8") as f:
        products = json.load(f)

    count = 0
    for item in products:
        existing = Product.query.filter_by(sku=item["sku"]).first()
        if existing:
            existing.brand = item["brand"]
            existing.name = item["name"]
            existing.type = item["type"]
            existing.condition = item["condition"]
            existing.specs = item.get("specs", [])
            existing.price_ugx = item["price_ugx"]
            existing.image_url = item.get("image_url", "")
            existing.stock_qty = item.get("stock_qty", 0)
            existing.is_active = True
        else:
            product = Product(
                sku=item["sku"],
                brand=item["brand"],
                name=item["name"],
                type=item["type"],
                condition=item["condition"],
                price_ugx=item["price_ugx"],
                image_url=item.get("image_url", ""),
                stock_qty=item.get("stock_qty", 0),
                is_active=True,
            )
            product.specs = item.get("specs", [])
            db.session.add(product)
        count += 1

    db.session.commit()
    return count
