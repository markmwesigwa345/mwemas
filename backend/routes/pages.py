from flask import Blueprint, render_template

bp = Blueprint("pages", __name__)


@bp.get("/")
def index():
    return render_template("index.html", active_page="home")


@bp.get("/services")
def services():
    return render_template("services.html", active_page="services")


@bp.get("/about")
def about():
    return render_template("about.html", active_page="about")


@bp.get("/products")
def products():
    return render_template("products.html", active_page="products")


@bp.get("/contact")
def contact():
    return render_template("contact.html", active_page="contact")


@bp.get("/checkout")
def checkout():
    return render_template("checkout.html", active_page="checkout")


@bp.get("/track")
def track():
    return render_template("track.html", active_page="track")


@bp.get("/order-confirmation")
def order_confirmation():
    return render_template("order-confirmation.html", active_page="order")
