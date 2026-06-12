const MwemaProducts = {
  cache: null,

  async fetchAll(params = {}) {
    if (!params.type && !params.condition && !params.featured) {
      if (this.cache) return this.cache;
    }
    const products = await MwemaAPI.getProducts(params);
    if (!params.type && !params.condition && !params.featured) {
      this.cache = products;
    }
    return products;
  },

  whatsappEnquire(product) {
    const text = encodeURIComponent(`Hi Mwema, I'd like to enquire about: ${product.brand} ${product.name} (${product.price_display})`);
    window.open(`https://wa.me/256701913028?text=${text}`, '_blank');
  },

  renderCard(product, idx = 0, options = {}) {
    const showCart = options.showCart !== false;
    const condClass = product.condition === 'new' ? 'condition-new' : 'condition-refurb';
    const condLabel = product.condition === 'new' ? 'Brand New' : 'Refurbished';
    const stockLabel = product.in_stock ? '' : '<span class="out-of-stock">Out of stock</span>';

    return `
      <div class="product-card reveal" data-id="${product.id}" style="animation-delay:${idx * 0.1}s">
        <div class="product-img">
          <img src="${product.image_url}" alt="${product.name}" loading="lazy"/>
          <span class="product-condition ${condClass}">${condLabel}</span>
          ${stockLabel}
        </div>
        <div class="product-body">
          <div class="product-brand">${product.brand}</div>
          <div class="product-name">${product.name}</div>
          <div class="product-specs">
            ${(product.specs || []).map(s => `<span class="spec-tag">${s}</span>`).join('')}
          </div>
          <div class="product-footer">
            <div class="product-price">
              ${product.price_display}
              <small>${product.in_stock ? 'In stock' : 'Contact for availability'}</small>
            </div>
            <div class="product-actions">
              ${showCart && product.in_stock ? `
                <button class="product-btn product-btn-cart" data-add-cart="${product.id}" title="Add to cart">
                  <i class="fas fa-cart-plus"></i>
                </button>` : ''}
              <button class="product-btn" data-wa-enquire="${product.id}" title="WhatsApp enquire">
                <i class="fab fa-whatsapp"></i>
              </button>
            </div>
          </div>
        </div>
      </div>`;
  },

  async bindProductCards(container, products) {
    if (!container) return;
    const map = new Map(products.map(p => [p.id, p]));

    container.querySelectorAll('[data-add-cart]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const product = map.get(+btn.dataset.addCart);
        if (product) {
          MwemaCart.add(product);
          btn.innerHTML = '<i class="fas fa-check"></i>';
          setTimeout(() => { btn.innerHTML = '<i class="fas fa-cart-plus"></i>'; }, 1200);
        }
      });
    });

    container.querySelectorAll('[data-wa-enquire]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const product = map.get(+btn.dataset.waEnquire);
        if (product) MwemaProducts.whatsappEnquire(product);
      });
    });
  },
};

window.MwemaProducts = MwemaProducts;
