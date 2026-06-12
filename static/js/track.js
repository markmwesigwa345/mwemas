const STATUS_ORDER = [
  'received', 'confirmed', 'awaiting_payment', 'payment_confirmed',
  'processing', 'shipped', 'delivered', 'cancelled',
];

const STATUS_LABELS = {
  received: 'Order Received',
  confirmed: 'Order Confirmed',
  awaiting_payment: 'Awaiting Payment',
  payment_confirmed: 'Payment Confirmed',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

function renderTimeline(events, currentStatus) {
  const container = document.getElementById('orderTimeline');
  const seen = new Set(events.map(e => e.status));
  const currentIdx = STATUS_ORDER.indexOf(currentStatus);

  let html = events.map((event, idx) => `
    <div class="timeline-item done ${idx === events.length - 1 ? 'current' : ''}">
      <div class="timeline-dot"></div>
      <div class="timeline-content">
        <strong>${event.status_label || STATUS_LABELS[event.status] || event.status}</strong>
        ${event.message ? `<p>${event.message}</p>` : ''}
        <small>${event.created_at ? new Date(event.created_at).toLocaleString() : ''}</small>
      </div>
    </div>
  `).join('');

  STATUS_ORDER.slice(currentIdx + 1).forEach(status => {
    if (status === 'cancelled' || seen.has(status)) return;
    html += `
      <div class="timeline-item pending">
        <div class="timeline-dot"></div>
        <div class="timeline-content">
          <strong>${STATUS_LABELS[status]}</strong>
          <p>Upcoming</p>
        </div>
      </div>`;
  });

  container.innerHTML = html;
}

async function doTrack() {
  const errEl = document.getElementById('trackError');
  const resultEl = document.getElementById('trackResult');
  errEl.classList.remove('show');
  resultEl.style.display = 'none';

  const orderNumber = document.getElementById('trackOrderId').value.trim().toUpperCase();
  const phone = document.getElementById('trackPhone').value.trim();

  if (!orderNumber || !phone) {
    errEl.textContent = 'Please enter both order ID and phone number.';
    errEl.classList.add('show');
    return;
  }

  try {
    const data = await MwemaAPI.trackOrder(orderNumber, phone);
    const order = data.order;

    document.getElementById('trackOrderNumber').textContent = order.order_number;
    const badge = document.getElementById('trackStatusBadge');
    badge.textContent = order.status_label;
    badge.className = `status-badge status-${order.status}`;

    renderTimeline(data.timeline || order.events || [], order.status);

    document.getElementById('trackOrderItems').innerHTML = `
      <h4>Order Items</h4>
      <ul>${(order.items || []).map(i =>
        `<li>${i.product_name} x${i.quantity} — ${i.unit_price_display}</li>`
      ).join('')}</ul>
      <p><strong>Total: ${order.total_display}</strong></p>
    `;

    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (e) {
    errEl.textContent = e.message;
    errEl.classList.add('show');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('trackSubmitBtn')?.addEventListener('click', doTrack);
  document.getElementById('trackPhone')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') doTrack();
  });
  document.getElementById('trackOrderId')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') doTrack();
  });

  const params = new URLSearchParams(window.location.search);
  if (params.get('order')) {
    document.getElementById('trackOrderId').value = params.get('order');
  }
  if (params.get('phone')) {
    document.getElementById('trackPhone').value = params.get('phone');
    if (params.get('order')) doTrack();
  }
});
