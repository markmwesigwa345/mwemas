document.addEventListener('DOMContentLoaded', async () => {
  const grid = document.getElementById('productsGrid');
  const tabs = document.querySelectorAll('#filterTabs .filter-tab');
  if (!grid) return;

  let allProducts = [];

  async function render(filter) {
    let products = allProducts;
    if (filter === 'refurb') {
      products = allProducts.filter(p => p.condition === 'refurb');
    } else if (filter && filter !== 'all') {
      products = allProducts.filter(p => p.type === filter);
    }

    grid.innerHTML = products.map((p, idx) => MwemaProducts.renderCard(p, idx)).join('');
    await MwemaProducts.bindProductCards(grid, products);
    document.querySelectorAll('#productsGrid .reveal').forEach(el => {
      if (window.mwemaRevealObserve) window.mwemaRevealObserve(el);
    });
  }

  try {
    allProducts = await MwemaProducts.fetchAll();
  } catch {
    grid.innerHTML = '<p class="section-desc">Unable to load products. Please refresh or contact us.</p>';
    return;
  }

  const urlFilter = new URLSearchParams(window.location.search).get('filter') || 'all';
  tabs.forEach(tab => {
    tab.classList.toggle('active', tab.dataset.filter === urlFilter);
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      render(tab.dataset.filter);
    });
  });

  render(urlFilter);
});
