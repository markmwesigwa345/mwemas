const DELIVERY_KAMPALA = 15000;
const DELIVERY_UPCOUNTRY = 35000;
const KAMPALA_DISTRICTS = ['kampala', 'wakiso', 'mukono', 'entebbe'];

function deliveryFee(district) {
  const d = (district || '').toLowerCase();
  if (KAMPALA_DISTRICTS.includes(d) || d.includes('kampala')) return DELIVERY_KAMPALA;
  return DELIVERY_UPCOUNTRY;
}

function renderCheckout() {
  const itemsEl = document.getElementById('checkoutCartItems');
  const items = MwemaCart.getItems();

  if (!items.length) {
    itemsEl.innerHTML = '<p class="checkout-empty">Your cart is empty. <a href="/products">Browse products</a></p>';
    document.getElementById('placeOrderBtn').disabled = true;
    return;
  }

  itemsEl.innerHTML = items.map(item => `
    <div class="checkout-item">
      <div>
        <strong>${item.name}</strong>
        <small>${item.price_display} x ${item.quantity}</small>
      </div>
      <div class="checkout-item-actions">
        <span>${MwemaCart.formatUgx(item.price_ugx * item.quantity)}</span>
        <button type="button" class="checkout-remove" data-remove="${item.product_id}">&times;</button>
      </div>
    </div>
  `).join('');

  itemsEl.querySelectorAll('[data-remove]').forEach(btn => {
    btn.addEventListener('click', () => {
      MwemaCart.remove(+btn.dataset.remove);
      renderCheckout();
    });
  });

  updateTotals();
}

function updateTotals() {
  const district = document.getElementById('coDistrict')?.value || '';
  const subtotal = MwemaCart.subtotal();
  const fee = deliveryFee(district);
  document.getElementById('checkoutSubtotal').textContent = MwemaCart.formatUgx(subtotal);
  document.getElementById('checkoutDelivery').textContent = MwemaCart.formatUgx(fee);
  document.getElementById('checkoutTotal').textContent = MwemaCart.formatUgx(subtotal + fee);
}

document.addEventListener('DOMContentLoaded', () => {
  renderCheckout();
  document.getElementById('coDistrict')?.addEventListener('change', updateTotals);

  document.getElementById('placeOrderBtn')?.addEventListener('click', async () => {
    const errEl = document.getElementById('checkoutError');
    errEl.classList.remove('show');

    const name = document.getElementById('coName').value.trim();
    const phone = document.getElementById('coPhone').value.trim();
    const district = document.getElementById('coDistrict').value;
    const address = document.getElementById('coAddress').value.trim();
    const payment = document.querySelector('input[name="payment"]:checked')?.value;

    if (!name || !phone || !district || !address) {
      errEl.textContent = 'Please fill in all required fields.';
      errEl.classList.add('show');
      return;
    }

    const items = MwemaCart.getItems();
    if (!items.length) {
      errEl.textContent = 'Your cart is empty.';
      errEl.classList.add('show');
      return;
    }

    const btn = document.getElementById('placeOrderBtn');
    btn.disabled = true;
    btn.textContent = 'Placing order...';

    try {
      const data = await MwemaAPI.createOrder({
        customer_name: name,
        phone,
        email: document.getElementById('coEmail').value.trim(),
        district,
        address,
        payment_method: payment,
        notes: document.getElementById('coNotes').value.trim(),
        items: items.map(i => ({ product_id: i.product_id, quantity: i.quantity })),
      });

      sessionStorage.setItem('mwema_last_order', JSON.stringify(data));
      MwemaCart.clear();
      window.location.href = `/order-confirmation?order=${encodeURIComponent(data.order.order_number)}`;
    } catch (e) {
      errEl.textContent = e.message;
      errEl.classList.add('show');
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-check-circle"></i> Place Order';
    }
  });
});
