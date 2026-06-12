const MwemaCart = {
  key: 'mwema_cart',

  getItems() {
    try {
      return JSON.parse(localStorage.getItem(this.key) || '[]');
    } catch {
      return [];
    }
  },

  saveItems(items) {
    localStorage.setItem(this.key, JSON.stringify(items));
    this.updateBadge();
    window.dispatchEvent(new CustomEvent('mwema:cart-updated'));
  },

  add(product, qty = 1) {
    const items = this.getItems();
    const existing = items.find(i => i.product_id === product.id);
    if (existing) {
      existing.quantity += qty;
    } else {
      items.push({
        product_id: product.id,
        name: product.name,
        brand: product.brand,
        price_ugx: product.price_ugx,
        price_display: product.price_display,
        image_url: product.image_url,
        quantity: qty,
      });
    }
    this.saveItems(items);
  },

  remove(productId) {
    this.saveItems(this.getItems().filter(i => i.product_id !== productId));
  },

  setQuantity(productId, qty) {
    const items = this.getItems();
    const item = items.find(i => i.product_id === productId);
    if (!item) return;
    if (qty <= 0) {
      this.remove(productId);
      return;
    }
    item.quantity = qty;
    this.saveItems(items);
  },

  clear() {
    localStorage.removeItem(this.key);
    this.updateBadge();
  },

  count() {
    return this.getItems().reduce((sum, i) => sum + i.quantity, 0);
  },

  subtotal() {
    return this.getItems().reduce((sum, i) => sum + i.price_ugx * i.quantity, 0);
  },

  updateBadge() {
    const el = document.getElementById('cartCount');
    if (!el) return;
    const count = this.count();
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  },

  formatUgx(amount) {
    return `UGX ${amount.toLocaleString()}`;
  },
};

window.MwemaCart = MwemaCart;

document.addEventListener('DOMContentLoaded', () => MwemaCart.updateBadge());
