<<<<<<< HEAD

  /* ── LOADER ── */
  window.addEventListener('load', () => {
    setTimeout(() => {
      document.getElementById('loader').classList.add('hidden');
    }, 2000);
  });

  /* ── NAVBAR ── */
  window.addEventListener('scroll', () => {
    const nb = document.getElementById('navbar');
    nb.classList.toggle('scrolled', window.scrollY > 60);
    document.getElementById('backtop').classList.toggle('show', window.scrollY > 400);

    // Active link
    const sections = ['hero','services','about','products','why','testimonials','feedback','contact'];
    let current = '';
    sections.forEach(id => {
      const el = document.getElementById(id);
      if(el && window.scrollY >= el.offsetTop - 120) current = id;
    });
    document.querySelectorAll('.nav-links a').forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
    });
  });

  /* ── SMOOTH SCROLL ── */
  function scrollTo(target) {
    document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
  }
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const t = a.getAttribute('href');
      document.querySelector(t)?.scrollIntoView({ behavior: 'smooth' });
    });
  });
  document.getElementById('backtop').addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));

  /* ── MOBILE MENU ── */
  function toggleMenu() {
    const m = document.getElementById('mobileMenu');
    const h = document.getElementById('hamburger');
    m.classList.toggle('open');
    h.classList.toggle('open');
  }
  function closeMenu() {
    document.getElementById('mobileMenu').classList.remove('open');
    document.getElementById('hamburger').classList.remove('open');
  }

  /* ── HERO PARTICLES ── */
  const dotsContainer = document.getElementById('heroDots');
  for(let i=0; i<25; i++) {
    const d = document.createElement('div');
    d.className = 'hero-dot';
    const size = Math.random()*6+2;
    d.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random()*100}%;
      bottom:${Math.random()*-20}%;
      animation-duration:${8+Math.random()*12}s;
      animation-delay:${Math.random()*8}s;
    `;
    dotsContainer.appendChild(d);
  }

  /* ── REVEAL ON SCROLL ── */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(e.isIntersecting) { e.target.classList.add('visible'); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  /* ── PRODUCTS DATA ── */
  const products = [
    { brand:'HP', name:'HP EliteBook 840 G6', type:'laptop', condition:'refurb',
      specs:['Core i5','8GB RAM','256GB SSD'], price:'UGX 1.4M',
      img:'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&q=80' },
    { brand:'Dell', name:'Dell Latitude 5490', type:'laptop', condition:'refurb',
      specs:['Core i7','16GB RAM','512GB SSD'], price:'UGX 1.9M',
      img:'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=500&q=80' },
    { brand:'Lenovo', name:'ThinkPad T470', type:'laptop', condition:'refurb',
      specs:['Core i5','8GB RAM','500GB HDD'], price:'UGX 1.2M',
      img:'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=500&q=80' },
    { brand:'HP', name:'HP 250 G8 Laptop', type:'laptop', condition:'new',
      specs:['Core i3','4GB RAM','1TB HDD'], price:'UGX 1.8M',
      img:'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=500&q=80' },
    { brand:'Dell', name:'Dell OptiPlex 7050', type:'desktop', condition:'refurb',
      specs:['Core i5','8GB RAM','500GB HDD'], price:'UGX 850K',
      img:'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=500&q=80' },
    { brand:'Lenovo', name:'IdeaPad 3 15', type:'laptop', condition:'new',
      specs:['Ryzen 5','8GB RAM','512GB SSD'], price:'UGX 2.1M',
      img:'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&q=80' },
    { brand:'HP', name:'HP ProDesk 400 G6', type:'desktop', condition:'new',
      specs:['Core i5','8GB RAM','1TB HDD'], price:'UGX 1.6M',
      img:'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&q=80' },
    { brand:'Toshiba', name:'Toshiba Satellite Pro', type:'laptop', condition:'refurb',
      specs:['Core i5','4GB RAM','320GB HDD'], price:'UGX 700K',
      img:'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80' },
  ];

  function renderProducts(filter) {
    const grid = document.getElementById('productsGrid');
    const filtered = filter === 'all'
      ? products
      : filter === 'refurb'
        ? products.filter(p=>p.condition==='refurb')
        : products.filter(p=>p.type===filter);
    grid.innerHTML = filtered.map(p => `
      <div class="product-card" data-type="${p.type}" data-condition="${p.condition}">
        <div class="product-img">
          <img src="${p.img}" alt="${p.name}" loading="lazy"/>
          <span class="product-condition ${p.condition==='new'?'condition-new':'condition-refurb'}">
            ${p.condition==='new'?'Brand New':'Refurbished'}
          </span>
        </div>
        <div class="product-body">
          <div class="product-brand">${p.brand}</div>
          <div class="product-name">${p.name}</div>
          <div class="product-specs">
            ${p.specs.map(s=>`<span class="spec-tag">${s}</span>`).join('')}
          </div>
          <div class="product-footer">
            <div class="product-price">
              ${p.price}
              <small>Contact for exact price</small>
            </div>
            <button class="product-btn" onclick="document.querySelector('#contact').scrollIntoView({behavior:'smooth'})" title="Enquire">
              <i class="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  function filterProducts(type, btn) {
    document.querySelectorAll('.filter-tab').forEach(t=>t.classList.remove('active'));
    btn.classList.add('active');
    renderProducts(type);
  }

  renderProducts('all');

  /* ── STAR RATING ── */
  let selectedRating = 0;
  document.querySelectorAll('#starRating i').forEach(star => {
    star.addEventListener('click', () => {
      selectedRating = +star.dataset.val;
      document.querySelectorAll('#starRating i').forEach((s,i) => {
        s.className = i < selectedRating ? 'fas fa-star active' : 'far fa-star';
      });
    });
    star.addEventListener('mouseenter', () => {
      const val = +star.dataset.val;
      document.querySelectorAll('#starRating i').forEach((s,i) => {
        s.className = i < val ? 'fas fa-star active' : 'far fa-star';
      });
    });
    star.addEventListener('mouseleave', () => {
      document.querySelectorAll('#starRating i').forEach((s,i) => {
        s.className = i < selectedRating ? 'fas fa-star active' : 'far fa-star';
      });
    });
  });

  /* ── FORM SUBMISSIONS ── */
  function submitFeedback() {
    const name = document.getElementById('fbName').value.trim();
    const msg  = document.getElementById('fbMessage').value.trim();
    if(!name || !msg) { alert('Please fill in your name and message.'); return; }
    document.getElementById('feedbackMsg').classList.add('success');
    document.getElementById('fbName').value = '';
    document.getElementById('fbContact').value = '';
    document.getElementById('fbType').value = '';
    document.getElementById('fbMessage').value = '';
    selectedRating = 0;
    document.querySelectorAll('#starRating i').forEach(s => s.className='far fa-star');
    setTimeout(() => document.getElementById('feedbackMsg').classList.remove('success'), 5000);
  }

  function submitContact() {
    const name  = document.getElementById('ctName').value.trim();
    const phone = document.getElementById('ctPhone').value.trim();
    if(!name || !phone) { alert('Please provide your name and phone number.'); return; }
    document.getElementById('contactMsg').classList.add('success');
    ['ctName','ctPhone','ctEmail','ctMessage'].forEach(id => document.getElementById(id).value='');
    document.getElementById('ctNeed').value = '';
    document.getElementById('ctBudget').value = '';
    setTimeout(() => document.getElementById('contactMsg').classList.remove('success'), 6000);
  }

  /* ── COUNTER ANIMATION ── */
  function animateCounter(el, end, suffix='') {
    let start = 0;
    const step = Math.ceil(end / 60);
    const timer = setInterval(() => {
      start += step;
      if(start >= end) { el.textContent = end + suffix; clearInterval(timer); }
      else el.textContent = start + suffix;
    }, 25);
  }
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(e.isIntersecting && !e.target.dataset.done) {
        e.target.dataset.done = '1';
        animateCounter(e.target, +e.target.dataset.target, e.target.dataset.suffix || '');
      }
    });
  }, { threshold: 0.5 });
=======

  /* ── LOADER ── */
  window.addEventListener('load', () => {
    setTimeout(() => {
      document.getElementById('loader').classList.add('hidden');
    }, 2000);
  });

  /* ── NAVBAR ── */
  window.addEventListener('scroll', () => {
    const nb = document.getElementById('navbar');
    nb.classList.toggle('scrolled', window.scrollY > 60);
    document.getElementById('backtop').classList.toggle('show', window.scrollY > 400);

    // Active link
    const sections = ['hero','services','about','products','why','testimonials','feedback','contact'];
    let current = '';
    sections.forEach(id => {
      const el = document.getElementById(id);
      if(el && window.scrollY >= el.offsetTop - 120) current = id;
    });
    document.querySelectorAll('.nav-links a').forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
    });
  });

  /* ── SMOOTH SCROLL ── */
  function scrollTo(target) {
    document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
  }
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const t = a.getAttribute('href');
      document.querySelector(t)?.scrollIntoView({ behavior: 'smooth' });
    });
  });
  document.getElementById('backtop').addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));

  /* ── MOBILE MENU ── */
  function toggleMenu() {
    const m = document.getElementById('mobileMenu');
    const h = document.getElementById('hamburger');
    m.classList.toggle('open');
    h.classList.toggle('open');
  }
  function closeMenu() {
    document.getElementById('mobileMenu').classList.remove('open');
    document.getElementById('hamburger').classList.remove('open');
  }

  /* ── HERO PARTICLES ── */
  const dotsContainer = document.getElementById('heroDots');
  for(let i=0; i<25; i++) {
    const d = document.createElement('div');
    d.className = 'hero-dot';
    const size = Math.random()*6+2;
    d.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random()*100}%;
      bottom:${Math.random()*-20}%;
      animation-duration:${8+Math.random()*12}s;
      animation-delay:${Math.random()*8}s;
    `;
    dotsContainer.appendChild(d);
  }

  /* ── REVEAL ON SCROLL ── */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(e.isIntersecting) { e.target.classList.add('visible'); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  /* ── PRODUCTS DATA ── */
  const products = [
    { brand:'HP', name:'HP EliteBook 840 G6', type:'laptop', condition:'refurb',
      specs:['Core i5','8GB RAM','256GB SSD'], price:'UGX 1.4M',
      img:'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&q=80' },
    { brand:'Dell', name:'Dell Latitude 5490', type:'laptop', condition:'refurb',
      specs:['Core i7','16GB RAM','512GB SSD'], price:'UGX 1.9M',
      img:'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=500&q=80' },
    { brand:'Lenovo', name:'ThinkPad T470', type:'laptop', condition:'refurb',
      specs:['Core i5','8GB RAM','500GB HDD'], price:'UGX 1.2M',
      img:'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=500&q=80' },
    { brand:'HP', name:'HP 250 G8 Laptop', type:'laptop', condition:'new',
      specs:['Core i3','4GB RAM','1TB HDD'], price:'UGX 1.8M',
      img:'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=500&q=80' },
    { brand:'Dell', name:'Dell OptiPlex 7050', type:'desktop', condition:'refurb',
      specs:['Core i5','8GB RAM','500GB HDD'], price:'UGX 850K',
      img:'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=500&q=80' },
    { brand:'Lenovo', name:'IdeaPad 3 15', type:'laptop', condition:'new',
      specs:['Ryzen 5','8GB RAM','512GB SSD'], price:'UGX 2.1M',
      img:'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&q=80' },
    { brand:'HP', name:'HP ProDesk 400 G6', type:'desktop', condition:'new',
      specs:['Core i5','8GB RAM','1TB HDD'], price:'UGX 1.6M',
      img:'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&q=80' },
    { brand:'Toshiba', name:'Toshiba Satellite Pro', type:'laptop', condition:'refurb',
      specs:['Core i5','4GB RAM','320GB HDD'], price:'UGX 700K',
      img:'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80' },
  ];

  function renderProducts(filter) {
    const grid = document.getElementById('productsGrid');
    const filtered = filter === 'all'
      ? products
      : filter === 'refurb'
        ? products.filter(p=>p.condition==='refurb')
        : products.filter(p=>p.type===filter);
    grid.innerHTML = filtered.map(p => `
      <div class="product-card" data-type="${p.type}" data-condition="${p.condition}">
        <div class="product-img">
          <img src="${p.img}" alt="${p.name}" loading="lazy"/>
          <span class="product-condition ${p.condition==='new'?'condition-new':'condition-refurb'}">
            ${p.condition==='new'?'Brand New':'Refurbished'}
          </span>
        </div>
        <div class="product-body">
          <div class="product-brand">${p.brand}</div>
          <div class="product-name">${p.name}</div>
          <div class="product-specs">
            ${p.specs.map(s=>`<span class="spec-tag">${s}</span>`).join('')}
          </div>
          <div class="product-footer">
            <div class="product-price">
              ${p.price}
              <small>Contact for exact price</small>
            </div>
            <button class="product-btn" onclick="document.querySelector('#contact').scrollIntoView({behavior:'smooth'})" title="Enquire">
              <i class="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  function filterProducts(type, btn) {
    document.querySelectorAll('.filter-tab').forEach(t=>t.classList.remove('active'));
    btn.classList.add('active');
    renderProducts(type);
  }

  renderProducts('all');

  /* ── STAR RATING ── */
  let selectedRating = 0;
  document.querySelectorAll('#starRating i').forEach(star => {
    star.addEventListener('click', () => {
      selectedRating = +star.dataset.val;
      document.querySelectorAll('#starRating i').forEach((s,i) => {
        s.className = i < selectedRating ? 'fas fa-star active' : 'far fa-star';
      });
    });
    star.addEventListener('mouseenter', () => {
      const val = +star.dataset.val;
      document.querySelectorAll('#starRating i').forEach((s,i) => {
        s.className = i < val ? 'fas fa-star active' : 'far fa-star';
      });
    });
    star.addEventListener('mouseleave', () => {
      document.querySelectorAll('#starRating i').forEach((s,i) => {
        s.className = i < selectedRating ? 'fas fa-star active' : 'far fa-star';
      });
    });
  });

  /* ── FORM SUBMISSIONS ── */
  function submitFeedback() {
    const name = document.getElementById('fbName').value.trim();
    const msg  = document.getElementById('fbMessage').value.trim();
    if(!name || !msg) { alert('Please fill in your name and message.'); return; }
    document.getElementById('feedbackMsg').classList.add('success');
    document.getElementById('fbName').value = '';
    document.getElementById('fbContact').value = '';
    document.getElementById('fbType').value = '';
    document.getElementById('fbMessage').value = '';
    selectedRating = 0;
    document.querySelectorAll('#starRating i').forEach(s => s.className='far fa-star');
    setTimeout(() => document.getElementById('feedbackMsg').classList.remove('success'), 5000);
  }

  function submitContact() {
    const name  = document.getElementById('ctName').value.trim();
    const phone = document.getElementById('ctPhone').value.trim();
    if(!name || !phone) { alert('Please provide your name and phone number.'); return; }
    document.getElementById('contactMsg').classList.add('success');
    ['ctName','ctPhone','ctEmail','ctMessage'].forEach(id => document.getElementById(id).value='');
    document.getElementById('ctNeed').value = '';
    document.getElementById('ctBudget').value = '';
    setTimeout(() => document.getElementById('contactMsg').classList.remove('success'), 6000);
  }

  /* ── COUNTER ANIMATION ── */
  function animateCounter(el, end, suffix='') {
    let start = 0;
    const step = Math.ceil(end / 60);
    const timer = setInterval(() => {
      start += step;
      if(start >= end) { el.textContent = end + suffix; clearInterval(timer); }
      else el.textContent = start + suffix;
    }, 25);
  }
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(e.isIntersecting && !e.target.dataset.done) {
        e.target.dataset.done = '1';
        animateCounter(e.target, +e.target.dataset.target, e.target.dataset.suffix || '');
      }
    });
  }, { threshold: 0.5 });
>>>>>>> f54fade (update msg)
