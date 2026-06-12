const MwemaAPI = {
  base: '/api',

  async request(path, options = {}) {
    const res = await fetch(`${this.base}${path}`, {
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      ...options,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || 'Request failed');
    }
    return data;
  },

  getProducts(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return this.request(`/products${qs ? `?${qs}` : ''}`);
  },

  createOrder(payload) {
    return this.request('/orders', { method: 'POST', body: JSON.stringify(payload) });
  },

  trackOrder(orderNumber, phone) {
    return this.request('/orders/track', {
      method: 'POST',
      body: JSON.stringify({ order_number: orderNumber, phone }),
    });
  },

  getOrderSummary(orderNumber) {
    return this.request(`/orders/${encodeURIComponent(orderNumber)}/summary`);
  },

  submitEnquiry(payload) {
    return this.request('/enquiries', { method: 'POST', body: JSON.stringify(payload) });
  },
};

window.MwemaAPI = MwemaAPI;
