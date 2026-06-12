document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const orderNumber = params.get('order');
  let data = null;

  try {
    const cached = sessionStorage.getItem('mwema_last_order');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed.order?.order_number === orderNumber) data = parsed;
    }
  } catch { /* ignore */ }

  if (!data && orderNumber) {
    try {
      data = await MwemaAPI.getOrderSummary(orderNumber);
    } catch { /* ignore */ }
  }

  if (!data?.order) {
    document.getElementById('orderConfirmBox').innerHTML = `
      <p class="section-desc">Order not found. <a href="/track">Track your order</a> or <a href="/products">continue shopping</a>.</p>`;
    return;
  }

  const order = data.order;
  document.getElementById('confirmOrderId').textContent = order.order_number;
  document.getElementById('confirmTotal').textContent = order.total_display;
  document.getElementById('confirmPayment').textContent =
    order.payment_method === 'mobile_money' ? 'Mobile Money' : 'Cash on Delivery';
  document.getElementById('confirmStatus').textContent = order.status_label;

  const trackLink = document.getElementById('confirmTrackLink');
  trackLink.href = `/track?order=${encodeURIComponent(order.order_number)}&phone=${encodeURIComponent(order.phone)}`;

  const waText = encodeURIComponent(
    `Hi Mwema, I placed order ${order.order_number} for ${order.total_display}. Please confirm.`
  );
  document.getElementById('confirmWhatsappLink').href = `https://wa.me/256701913028?text=${waText}`;

  if (data.payment_instructions) {
    const pi = data.payment_instructions;
    document.getElementById('paymentInstructions').style.display = 'block';
    document.getElementById('mmInstructions').textContent = pi.instructions;
    document.getElementById('mmMtn').textContent = pi.mtn;
    document.getElementById('mmAirtel').textContent = pi.airtel;
    document.getElementById('mmReference').textContent = pi.reference;
    document.getElementById('mmAmount').textContent = pi.amount_display;
  }

  sessionStorage.removeItem('mwema_last_order');
});
