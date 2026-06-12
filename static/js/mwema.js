
  /* ── LOADER ── */
  const loader = document.getElementById('loader');
  const loaderSeen = sessionStorage.getItem('mwemaLoaderSeen');
  if (loader) {
    if (loaderSeen) {
      loader.classList.add('hidden');
    } else {
      window.addEventListener('load', () => {
        setTimeout(() => {
          loader.classList.add('hidden');
          sessionStorage.setItem('mwemaLoaderSeen', '1');
        }, 600);
      });
    }
  }

  /* ── NAVBAR ── */
  const navbar = document.getElementById('navbar');
  const backtop = document.getElementById('backtop');

  function handleScroll() {
    const currentScroll = window.scrollY;
    if (navbar) navbar.classList.toggle('scrolled', currentScroll > 60);
    if (backtop) backtop.classList.toggle('show', currentScroll > 300);
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('load', handleScroll);

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href.length < 2) return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        closeMenu();
      }
    });
  });

  if (backtop) {
    backtop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  function toggleMenu() {
    if (hamburger && mobileMenu) {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    }
  }

  function closeMenu() {
    if (hamburger && mobileMenu) {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    }
  }

  if (hamburger) hamburger.addEventListener('click', toggleMenu);
  if (mobileMenu) mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('click', (e) => {
    if (mobileMenu && mobileMenu.classList.contains('open')) {
      if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target)) closeMenu();
    }
  });

  window.toggleMenu = toggleMenu;
  window.closeMenu = closeMenu;

  const dotsContainer = document.getElementById('heroDots');
  if (dotsContainer) {
    for (let i = 0; i < 35; i++) {
      const d = document.createElement('div');
      d.className = 'hero-dot';
      const size = Math.random() * 6 + 2;
      d.style.cssText = `width:${size}px;height:${size}px;left:${Math.random()*100}%;bottom:${Math.random()*-20}%;animation-duration:${8+Math.random()*14}s;animation-delay:${Math.random()*10}s;`;
      dotsContainer.appendChild(d);
    }
  }

  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));
  window.mwemaRevealObserve = (el) => revealObs.observe(el);

  const heroSlides = document.querySelectorAll('.hero-slide');
  const heroWords = document.querySelectorAll('.hero-word');
  let heroIndex = 0;
  let heroWordIndex = 0;

  function rotateHero() {
    if (!heroSlides.length) return;
    heroSlides.forEach((slide, idx) => slide.classList.toggle('active', idx === heroIndex));
    heroIndex = (heroIndex + 1) % heroSlides.length;
  }

  function rotateHeroWords() {
    if (!heroWords.length) return;
    heroWords.forEach((word, idx) => word.classList.toggle('active', idx === heroWordIndex));
    heroWordIndex = (heroWordIndex + 1) % heroWords.length;
  }

  if (heroSlides.length) { rotateHero(); setInterval(rotateHero, 4500); }
  if (heroWords.length) { rotateHeroWords(); setInterval(rotateHeroWords, 3200); }

  document.querySelectorAll('.advantage-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.advantage-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
    });
  });

  document.getElementById('contactSubmitBtn')?.addEventListener('click', async () => {
    const name = document.getElementById('ctName')?.value.trim();
    const phone = document.getElementById('ctPhone')?.value.trim();
    const contactMsg = document.getElementById('contactMsg');
    if (!name || !phone) {
      alert('Please provide your name and phone number.');
      return;
    }
    try {
      await MwemaAPI.submitEnquiry({
        name,
        phone,
        email: document.getElementById('ctEmail')?.value.trim(),
        need: document.getElementById('ctNeed')?.value,
        budget: document.getElementById('ctBudget')?.value,
        message: document.getElementById('ctMessage')?.value.trim(),
      });
      contactMsg.className = 'form-msg success show';
      ['ctName','ctPhone','ctEmail','ctMessage'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
      });
      const ctNeed = document.getElementById('ctNeed');
      const ctBudget = document.getElementById('ctBudget');
      if (ctNeed) ctNeed.value = '';
      if (ctBudget) ctBudget.value = '';
      setTimeout(() => contactMsg.classList.remove('show'), 6000);
    } catch (e) {
      alert(e.message || 'Failed to send message.');
    }
  });

  /* ── AI CHAT WIDGET ── */
  (function initAIChat() {
    const logoSrc = document.querySelector('.nav-logo-img')?.src || '/static/img/mwemalogo.jpg';
    document.body.insertAdjacentHTML('beforeend', `
      <button id="ai-chat-btn" aria-label="Chat with Mwema AI"><i class="fas fa-robot"></i><span class="ai-pulse"></span></button>
      <div id="ai-chat-box" role="dialog" aria-label="Mwema AI Assistant">
        <div class="ai-chat-header">
          <div class="ai-chat-avatar"><img src="${logoSrc}" alt="Mwema Solutions" /></div>
          <div class="ai-chat-header-info"><strong>Mwema AI Assistant</strong><span>Online — Ask me anything</span></div>
          <button class="ai-chat-close" id="ai-chat-close" aria-label="Close chat"><i class="fas fa-times"></i></button>
        </div>
        <div class="ai-chat-messages" id="ai-chat-messages"></div>
        <div class="ai-quick-replies" id="ai-quick-replies"></div>
        <div class="ai-chat-input-row">
          <input type="text" id="ai-chat-input" placeholder="Ask about products, prices, delivery..." autocomplete="off"/>
          <button id="ai-chat-send" aria-label="Send"><i class="fas fa-paper-plane"></i></button>
        </div>
      </div>`);

    const btn = document.getElementById('ai-chat-btn');
    const box = document.getElementById('ai-chat-box');
    const closeBtn = document.getElementById('ai-chat-close');
    const messages = document.getElementById('ai-chat-messages');
    const input = document.getElementById('ai-chat-input');
    const sendBtn = document.getElementById('ai-chat-send');
    const quickWrap = document.getElementById('ai-quick-replies');

    let productCatalog = [];

    async function loadCatalog() {
      try {
        if (window.MwemaProducts) productCatalog = await MwemaProducts.fetchAll();
      } catch { productCatalog = []; }
    }
    loadCatalog();

    function productListHtml(filter) {
      let items = productCatalog;
      if (filter === 'laptop') items = items.filter(p => p.type === 'laptop');
      if (filter === 'desktop') items = items.filter(p => p.type === 'desktop');
      return items.map(p =>
        `• ${p.brand} ${p.name} — <strong>${p.price_display}</strong>`
      ).join('<br>') || 'Browse our <a href="/products">products page</a> for current stock.';
    }

    const KB = [
      { keys: ['hello','hi','hey','help','start'], reply: `Hi! Welcome to <strong>Mwema Solutions</strong>. I can help with prices, ordering, delivery, repairs, and more.`, quick: ['Laptop prices','Track order','Delivery info','Contact us'] },
      { keys: ['track','order status','where is my order'], reply: `Track your order at <a href="/track"><strong>/track</strong></a> using your <strong>Order ID</strong> and <strong>phone number</strong>.`, quick: ['Laptop prices','Contact us'] },
      { keys: ['order','buy','purchase','cart','checkout'], reply: `You can order online! Browse <a href="/products">products</a>, add to cart, and checkout with <strong>COD</strong> or <strong>mobile money</strong>.`, quick: ['Laptop prices','Delivery info'] },
      { keys: ['laptop','laptops','hp','dell','lenovo','thinkpad','elitebook'], reply: () => `<strong>Laptops in stock:</strong><br><br>${productListHtml('laptop')}<br><br><a href="/products">View all &amp; order</a>`, quick: ['Desktop prices','Delivery info','Contact us'] },
      { keys: ['desktop','desktops','pc','optiplex','prodesk'], reply: () => `<strong>Desktops in stock:</strong><br><br>${productListHtml('desktop')}`, quick: ['Laptop prices','Contact us'] },
      { keys: ['price','prices','cost','how much','ugx','budget'], reply: () => `<strong>Current catalog prices:</strong><br><br>${productListHtml()}`, quick: ['Track order','Delivery info','Contact us'] },
      { keys: ['delivery','deliver','shipping','nationwide','kampala'], reply: `We deliver <strong>anywhere in Uganda</strong>. Kampala: 1-2 days. Upcountry: 2-3 days. Delivery fee from UGX 15,000.`, quick: ['Track order','Laptop prices'] },
      { keys: ['repair','fix','broken','virus','maintenance'], reply: `We offer screen replacement, hardware fixes, virus removal, upgrades, and OS setup. Most repairs in 24-48 hours at Makerere Kikoni.`, quick: ['Contact us','Location'] },
      { keys: ['location','address','makerere','kikoni','where'], reply: `<strong>Makerere Kikoni, Kampala</strong>. Mon-Sat 8AM-7PM.`, quick: ['Contact us','Delivery info'] },
      { keys: ['contact','phone','whatsapp','email','call'], reply: `📞 +256 701 913 028 / +256 784 841 119<br>📧 mwemasolutions.it@gmail.com<br>💬 <a href="https://wa.me/256701913028">WhatsApp</a>`, quick: ['Laptop prices','Track order'] },
      { keys: ['bulk','school','business','institution','ngo'], reply: `Bulk orders get volume discounts, custom software, and flexible payment. Contact us with your specs.`, quick: ['Contact us','Laptop prices'] },
      { keys: ['warranty','guarantee','return'], reply: `Refurbished: 3-6 month warranty. New: manufacturer warranty. 7-day return for defects.`, quick: ['Contact us'] },
      { keys: ['student','university','campus'], reply: `Student laptops from UGX 700K with flexible payment. Visit or WhatsApp for a student deal.`, quick: ['Laptop prices','Contact us'] },
      { keys: ['about','mwema','founder','mark','2019'], reply: `<strong>Mwema Solutions</strong> — founded 2019 by Mwesigwa Mark. 500+ clients across Uganda.`, quick: ['Laptop prices','Contact us'] },
    ];

    function getReply(text) {
      const lower = text.toLowerCase();
      for (const entry of KB) {
        if (entry.keys.some(k => lower.includes(k))) {
          const reply = typeof entry.reply === 'function' ? entry.reply() : entry.reply;
          return { reply, quick: entry.quick };
        }
      }
      return { reply: `I can help with products, ordering, delivery, and repairs. Try asking about laptop prices or <a href="/track">track your order</a>.`, quick: ['Laptop prices','Track order','Contact us'] };
    }

    function appendMsg(html, type) {
      const div = document.createElement('div');
      div.className = `ai-msg ${type}`;
      div.innerHTML = html;
      messages.appendChild(div);
      messages.scrollTop = messages.scrollHeight;
    }

    function showTyping() {
      const t = document.createElement('div');
      t.className = 'ai-typing'; t.id = 'ai-typing-indicator';
      t.innerHTML = '<span></span><span></span><span></span>';
      messages.appendChild(t);
      messages.scrollTop = messages.scrollHeight;
    }

    function removeTyping() {
      document.getElementById('ai-typing-indicator')?.remove();
    }

    function setQuickReplies(items) {
      quickWrap.innerHTML = '';
      items.forEach(label => {
        const b = document.createElement('button');
        b.className = 'ai-quick-btn';
        b.textContent = label;
        b.addEventListener('click', () => handleSend(label));
        quickWrap.appendChild(b);
      });
    }

    function openChat() {
      box.classList.add('open');
      if (messages.children.length === 0) {
        setTimeout(() => {
          appendMsg(`Hi! I'm the <strong>Mwema AI Assistant</strong>. Ask about products, prices, ordering, or delivery!`, 'bot');
          setQuickReplies(['Laptop prices','Track order','Delivery info','Contact us']);
        }, 200);
      }
    }

    function handleSend(text) {
      const msg = text || input.value.trim();
      if (!msg) return;
      input.value = '';
      quickWrap.innerHTML = '';
      appendMsg(msg, 'user');
      showTyping();
      setTimeout(async () => {
        if (!productCatalog.length) await loadCatalog();
        removeTyping();
        const { reply, quick } = getReply(msg);
        appendMsg(reply, 'bot');
        setQuickReplies(quick);
      }, 500);
    }

    btn.addEventListener('click', openChat);
    closeBtn.addEventListener('click', () => box.classList.remove('open'));
    document.getElementById('open-ai-from-page')?.addEventListener('click', openChat);
    sendBtn.addEventListener('click', () => handleSend());
    input.addEventListener('keydown', e => { if (e.key === 'Enter') handleSend(); });
  })();

  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting && !e.target.dataset.done) {
        e.target.dataset.done = '1';
        let start = 0;
        const end = +e.target.dataset.target;
        const suffix = e.target.dataset.suffix || '';
        const step = Math.ceil(end / 60);
        const timer = setInterval(() => {
          start += step;
          if (start >= end) { e.target.textContent = end + suffix; clearInterval(timer); }
          else e.target.textContent = start + suffix;
        }, 25);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-target]').forEach(el => counterObs.observe(el));
