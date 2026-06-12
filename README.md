# Mwema Solutions — Web Platform

Full-stack ordering and tracking platform for Mwema Solutions (Uganda). Customers browse products, place orders (COD or mobile money), and track orders by Order ID + phone. Admin dashboard for order and inventory management.

## Stack

- **Frontend:** HTML, CSS, JavaScript (Jinja2 templates)
- **Backend:** Python Flask + SQLAlchemy
- **Database:** SQLite (development) / PostgreSQL (production)

## Quick Start (Local)

### 1. Install dependencies

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
```

### 2. Configure environment

Copy `.env.example` to `.env` in the project root and update values:

```
SECRET_KEY=your-random-secret
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password
```

### 3. Run the server

```bash
cd backend
python app.py
```

Open **http://localhost:5000**

- **Admin:** http://localhost:5000/admin (use credentials from `.env`)
- **API health:** http://localhost:5000/api/health

## Project Structure

```
MWEMA SOLUTIONS/
├── backend/           # Flask app, models, API routes, admin
├── data/products.json # Product catalog seed data
├── templates/         # Jinja HTML pages
├── static/            # CSS, JS, images
└── mwema.db           # SQLite database (created on first run)
```

## Customer Flow

1. Browse products at `/products`
2. Add to cart → `/checkout`
3. Enter details, choose COD or mobile money
4. Receive order ID on confirmation page
5. Track at `/track` with Order ID + phone

## Admin Flow

1. Login at `/admin`
2. View and filter orders on dashboard
3. Open order → update status, confirm mobile money payment
4. Manage products (price, stock) at `/admin/products`
5. Re-seed catalog from `data/products.json`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List products (`?type=laptop&featured=3`) |
| POST | `/api/orders` | Create order |
| POST | `/api/orders/track` | Track by order_number + phone |
| POST | `/api/enquiries` | Contact form submission |
| GET | `/api/health` | Health check |

## Deployment (Render / Railway)

1. Push repo to GitHub
2. Create a **Web Service** with:
   - **Build command:** `pip install -r backend/requirements.txt`
   - **Start command:** `gunicorn --chdir backend app:app`
3. Set environment variables:
   - `SECRET_KEY`
   - `ADMIN_USERNAME` / `ADMIN_PASSWORD`
   - `DATABASE_URL` (PostgreSQL from host)
4. Deploy

For PostgreSQL on Render, add a database and link `DATABASE_URL`. The app auto-converts `postgres://` to `postgresql://`.

## Mobile Money Workflow

1. Customer selects Mobile Money at checkout
2. Confirmation page shows MTN/Airtel numbers and order ID as reference
3. Admin confirms payment in order detail → status advances to `payment_confirmed`

## License

Proprietary — Mwema Solutions © 2026
