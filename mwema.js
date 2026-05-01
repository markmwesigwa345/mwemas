

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
        }, 1800);
      });
    }
  }

  /* ── NAVBAR ── */
  const navbar = document.getElementById('navbar');
  const backtop = document.getElementById('backtop');
  let lastScrollY = 0;
  
  function handleScroll() {
    const currentScroll = window.scrollY;
    
    // Navbar background
    if(navbar) {
      navbar.classList.toggle('scrolled', currentScroll > 60);
    }
    
    // Back to top button with smooth appear/disappear
    if(backtop) {
      if(currentScroll > 300) {
        backtop.classList.add('show');
      } else {
        backtop.classList.remove('show');
      }
    }

    // Active nav link based on section
    const sections = ['hero','trust','services','about','products','why','testimonials','feedback','contact'];
    let current = '';
    sections.forEach(id => {
      const el = document.getElementById(id);
      if(el && currentScroll >= el.offsetTop - 120) current = id;
    });
    document.querySelectorAll('.nav-links a').forEach(a => {
      const href = a.getAttribute('href');
      if(href && href.startsWith('#')) {
        a.classList.toggle('active', href === `#${current}`);
      }
    });
    
    lastScrollY = currentScroll;
  }
  
  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('load', handleScroll);

  /* ── SMOOTH SCROLL ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      const target = document.querySelector(href);
      if(target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Close mobile menu if open
        const mobileMenu = document.getElementById('mobileMenu');
        const hamburger = document.getElementById('hamburger');
        if(mobileMenu && mobileMenu.classList.contains('open')) {
          mobileMenu.classList.remove('open');
          hamburger.classList.remove('open');
        }
      }
    });
  });
  
  // Back to top button functionality
  if(backtop) {
    backtop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── MOBILE MENU ── */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  
  function toggleMenu() {
    if(hamburger && mobileMenu) {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    }
  }
  
  function closeMenu() {
    if(hamburger && mobileMenu) {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    }
  }
  
  if(hamburger) {
    hamburger.addEventListener('click', toggleMenu);
  }
  
  // Close menu when clicking on links
  if(mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  }
  
  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if(mobileMenu && mobileMenu.classList.contains('open')) {
      if(!mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
        closeMenu();
      }
    }
  });
  
  // Make functions global for onclick attributes
  window.toggleMenu = toggleMenu;
  window.closeMenu = closeMenu;

  /* ── HERO PARTICLES ENHANCED ── */
  const dotsContainer = document.getElementById('heroDots');
  if (dotsContainer) {
    for (let i = 0; i < 35; i++) {
      const d = document.createElement('div');
      d.className = 'hero-dot';

      const size = Math.random() * 6 + 2;
      const duration = 8 + Math.random() * 14;
      const delay = Math.random() * 10;

      d.style.cssText = `
        width:${size}px; 
        height:${size}px;
        left:${Math.random() * 100}%;
        bottom:${Math.random() * -20}%;
        animation-duration:${duration}s;
        animation-delay:${delay}s;
      `;

      dotsContainer.appendChild(d);
    }
  }

  /* ── REVEAL ON SCROLL - ENHANCED ── */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(e.isIntersecting) { 
        e.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15 });
  
  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  /* ── HERO CAROUSEL - ENHANCED ── */
  const heroSlides = document.querySelectorAll('.hero-slide');
  const heroWords = document.querySelectorAll('.hero-word');
  let heroIndex = 0;
  let heroWordIndex = 0;
  
  function rotateHero() {
    if (!heroSlides.length) return;
    heroSlides.forEach((slide, idx) => {
      slide.classList.toggle('active', idx === heroIndex);
    });
    heroIndex = (heroIndex + 1) % heroSlides.length;
  }
  
  function rotateHeroWords() {
    if (!heroWords.length) return;
    heroWords.forEach((word, idx) => {
      word.classList.toggle('active', idx === heroWordIndex);
    });
    heroWordIndex = (heroWordIndex + 1) % heroWords.length;
  }
  
  if (heroSlides.length) {
    rotateHero();
    setInterval(rotateHero, 4500); // Slightly adjusted for smoother visual breathing room
  }
  if (heroWords.length) {
    rotateHeroWords();
    setInterval(rotateHeroWords, 3200); // Tuned for better readability during transition
  }

  /* ── ADVANTAGE CARD TABS ── */
  const advantageCards = document.querySelectorAll('.advantage-card');
  advantageCards.forEach(card => {
    card.addEventListener('click', () => {
      advantageCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
    });
  });

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
    if(!grid) return;
    const filtered = filter === 'all'
      ? products
      : filter === 'refurb'
        ? products.filter(p=>p.condition==='refurb')
        : products.filter(p=>p.type===filter);
    grid.innerHTML = filtered.map((p, idx) => `
      <div class="product-card reveal" data-type="${p.type}" data-condition="${p.condition}" style="animation-delay: ${idx * 0.1}s">
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
            <button class="product-btn" onclick="window.location.href='contact.html'" title="Enquire">
              <i class="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    `).join('');
    
    // Re-observe newly added elements
    document.querySelectorAll('.product-card.reveal').forEach(el => revealObs.observe(el));
  }

  function filterProducts(type, btn) {
    document.querySelectorAll('.filter-tab').forEach(t=>t.classList.remove('active'));
    if(btn) btn.classList.add('active');
    renderProducts(type);
  }

  if(document.getElementById('productsGrid')) {
    renderProducts('all');
  }

  /* ── STAR RATING ── */
  let selectedRating = 0;
  const starRatingStars = document.querySelectorAll('#starRating i');
  if(starRatingStars.length) {
    starRatingStars.forEach(star => {
      star.addEventListener('click', () => {
        selectedRating = +star.dataset.val;
        starRatingStars.forEach((s,i) => {
          s.className = i < selectedRating ? 'fas fa-star active' : 'far fa-star';
        });
      });
      star.addEventListener('mouseenter', () => {
        const val = +star.dataset.val;
        starRatingStars.forEach((s,i) => {
          s.className = i < val ? 'fas fa-star active' : 'far fa-star';
        });
      });
      star.addEventListener('mouseleave', () => {
        starRatingStars.forEach((s,i) => {
          s.className = i < selectedRating ? 'fas fa-star active' : 'far fa-star';
        });
      });
    });
  }

  /* ── FORM SUBMISSIONS ── */
  function submitFeedback() {
    const name = document.getElementById('fbName')?.value.trim();
    const msg  = document.getElementById('fbMessage')?.value.trim();
    if(!name || !msg) { 
      alert('Please fill in your name and message.'); 
      return; 
    }
    const feedbackMsg = document.getElementById('feedbackMsg');
    if(feedbackMsg) {
      feedbackMsg.classList.add('success');
      document.getElementById('fbName').value = '';
      document.getElementById('fbContact').value = '';
      document.getElementById('fbType').value = '';
      document.getElementById('fbMessage').value = '';
      selectedRating = 0;
      document.querySelectorAll('#starRating i').forEach(s => s.className='far fa-star');
      setTimeout(() => feedbackMsg.classList.remove('success'), 5000);
    }
  }

  function submitContact() {
    const name  = document.getElementById('ctName')?.value.trim();
    const phone = document.getElementById('ctPhone')?.value.trim();
    if(!name || !phone) { 
      alert('Please provide your name and phone number.'); 
      return; 
    }
    const contactMsg = document.getElementById('contactMsg');
    if(contactMsg) {
      contactMsg.classList.add('success');
      ['ctName','ctPhone','ctEmail','ctMessage'].forEach(id => {
        const el = document.getElementById(id);
        if(el) el.value='';
      });
      const ctNeed = document.getElementById('ctNeed');
      const ctBudget = document.getElementById('ctBudget');
      if(ctNeed) ctNeed.value = '';
      if(ctBudget) ctBudget.value = '';
      setTimeout(() => contactMsg.classList.remove('success'), 6000);
    }
  }

  /* ── AI CHAT WIDGET ── */
  (function initAIChat() {
    // Inject widget HTML into every page
    const widgetHTML = `
      <button id="ai-chat-btn" aria-label="Chat with Mwema AI">
        <i class="fas fa-robot"></i>
        <span class="ai-pulse"></span>
      </button>
      <div id="ai-chat-box" role="dialog" aria-label="Mwema AI Assistant">
        <div class="ai-chat-header">
          <div class="ai-chat-avatar"><img src="mwemalogo.png" alt="Mwema Solutions" /></div>
          <div class="ai-chat-header-info">
            <strong>Mwema AI Assistant</strong>
            <span>Online — Ask me anything</span>
          </div>
          <button class="ai-chat-close" id="ai-chat-close" aria-label="Close chat">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="ai-chat-messages" id="ai-chat-messages"></div>
        <div class="ai-quick-replies" id="ai-quick-replies"></div>
        <div class="ai-chat-input-row">
          <input type="text" id="ai-chat-input" placeholder="Ask about products, prices, delivery..." autocomplete="off"/>
          <button id="ai-chat-send" aria-label="Send"><i class="fas fa-paper-plane"></i></button>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', widgetHTML);

    const btn       = document.getElementById('ai-chat-btn');
    const box       = document.getElementById('ai-chat-box');
    const closeBtn  = document.getElementById('ai-chat-close');
    const messages  = document.getElementById('ai-chat-messages');
    const input     = document.getElementById('ai-chat-input');
    const sendBtn   = document.getElementById('ai-chat-send');
    const quickWrap = document.getElementById('ai-quick-replies');

    // ── Business knowledge base ──
    const KB = [
      {
        keys: ['hello','hi','hey','good morning','good afternoon','good evening','start','help'],
        reply: `Hi there! 👋 Welcome to <strong>Mwema Solutions</strong>. I'm your AI assistant. I can help you with:<br><br>
          • 💻 Laptop & desktop prices<br>
          • 🚚 Delivery information<br>
          • 🔧 Repair services<br>
          • 📍 Location & hours<br>
          • 📦 Bulk & business orders<br><br>
          What would you like to know?`,
        quick: ['Laptop prices','Delivery info','Repairs','Location & hours','Contact us']
      },
      {
        keys: ['laptop','laptops','notebook','hp','dell','lenovo','toshiba','elitebook','thinkpad','ideapad','latitude'],
        reply: `We stock a great range of laptops! Here's a quick overview:<br><br>
          <strong>Refurbished (Certified):</strong><br>
          • HP EliteBook 840 G6 — Core i5, 8GB, 256GB SSD — <strong>UGX 1.4M</strong><br>
          • Dell Latitude 5490 — Core i7, 16GB, 512GB SSD — <strong>UGX 1.9M</strong><br>
          • Lenovo ThinkPad T470 — Core i5, 8GB, 500GB — <strong>UGX 1.2M</strong><br>
          • Toshiba Satellite Pro — Core i5, 4GB, 320GB — <strong>UGX 700K</strong><br><br>
          <strong>Brand New:</strong><br>
          • HP 250 G8 — Core i3, 4GB, 1TB — <strong>UGX 1.8M</strong><br>
          • Lenovo IdeaPad 3 — Ryzen 5, 8GB, 512GB SSD — <strong>UGX 2.1M</strong><br><br>
          All refurbished units are thoroughly inspected and come with a warranty. Want to enquire about a specific model?`,
        quick: ['Desktop prices','Delivery info','Make an enquiry','Contact us']
      },
      {
        keys: ['desktop','desktops','pc','optiplex','prodesk','tower','computer'],
        reply: `We also carry reliable desktop PCs:<br><br>
          • Dell OptiPlex 7050 — Core i5, 8GB, 500GB (Refurb) — <strong>UGX 850K</strong><br>
          • HP ProDesk 400 G6 — Core i5, 8GB, 1TB (New) — <strong>UGX 1.6M</strong><br><br>
          Desktops are great for offices, schools, and home use. We can also configure them with software before delivery. Interested?`,
        quick: ['Laptop prices','Bulk order','Delivery info','Contact us']
      },
      {
        keys: ['price','prices','cost','how much','ugx','budget','cheap','affordable','expensive'],
        reply: `Our prices are designed to fit every budget:<br><br>
          <strong>Refurbished laptops:</strong> UGX 700K – 1.9M<br>
          <strong>Brand new laptops:</strong> UGX 1.8M – 2.1M<br>
          <strong>Desktop PCs:</strong> UGX 850K – 1.6M<br><br>
          💡 We also offer <strong>flexible payment plans</strong> for students and schools. For the most accurate quote, contact us directly — prices may vary based on availability.`,
        quick: ['Laptop prices','Desktop prices','Bulk order','Contact us']
      },
      {
        keys: ['delivery','deliver','shipping','ship','send','nationwide','kampala','mbarara','gulu','ibanda','district'],
        reply: `We deliver <strong>anywhere in Uganda</strong>! 🚚<br><br>
          • <strong>Kampala:</strong> Same-day or next-day delivery<br>
          • <strong>Nationwide:</strong> 1–3 business days depending on location<br>
          • All devices are carefully packaged to arrive in perfect condition<br>
          • Delivery is insured — your device is protected in transit<br><br>
          We've delivered to Kampala, Mbarara, Ibanda, Gulu, and many more districts. Contact us for a delivery quote to your area.`,
        quick: ['Laptop prices','Contact us','Location & hours']
      },
      {
        keys: ['repair','fix','broken','screen','keyboard','virus','slow','maintenance','service','diagnos'],
        reply: `We offer comprehensive <strong>computer repair services</strong>: 🔧<br><br>
          • Screen replacement<br>
          • Keyboard & hardware fixes<br>
          • Virus removal & software troubleshooting<br>
          • RAM & storage upgrades<br>
          • Preventive maintenance & cleaning<br>
          • OS reinstallation & software setup<br><br>
          <strong>Quick turnaround</strong> — most repairs done within 24–48 hours. Bring your device to us at Makerere Kikoni, Kampala, or call for a pickup arrangement.`,
        quick: ['Location & hours','Contact us','Laptop prices']
      },
      {
        keys: ['bulk','wholesale','school','institution','ngo','company','business','corporate','office','multiple','quantity'],
        reply: `We love working with businesses and institutions! 🏢<br><br>
          Our <strong>bulk & business packages</strong> include:<br>
          • Custom-configured machines (software pre-installed)<br>
          • Volume discounts on 5+ units<br>
          • Warranty & after-sales support included<br>
          • Flexible payment terms for schools & NGOs<br>
          • Nationwide delivery for large orders<br><br>
          We've supplied laptops to companies, schools, and NGOs across Uganda. Send us your specifications and budget for a tailored proposal.`,
        quick: ['Contact us','Delivery info','Laptop prices']
      },
      {
        keys: ['location','address','where','find','visit','physical','shop','store','makerere','kikoni'],
        reply: `You can find us at:<br><br>
          📍 <strong>Makerere Kikoni, Kampala</strong><br>
          Central Uganda<br><br>
          We're easy to reach — just off the main Makerere road. You can also call ahead and we'll guide you directly to our shop.`,
        quick: ['Working hours','Contact us','Delivery info']
      },
      {
        keys: ['hours','open','time','when','working','schedule','monday','saturday','sunday','weekend'],
        reply: `Our working hours are:<br><br>
          🕗 <strong>Monday – Saturday: 8:00 AM – 7:00 PM</strong><br><br>
          We're closed on Sundays, but you can still reach us via WhatsApp for urgent enquiries and we'll respond as soon as possible.`,
        quick: ['Location','Contact us','Delivery info']
      },
      {
        keys: ['contact','call','phone','whatsapp','email','reach','talk','message','number'],
        reply: `Here's how to reach us directly:<br><br>
          📞 <strong>+256 701 913 028</strong><br>
          📞 <strong>+256 784 841 119</strong><br>
          💬 WhatsApp: <strong>+256 701 913 028</strong><br>
          📧 <strong>mwemasolutions.it@gmail.com</strong><br><br>
          Or visit us at <strong>Makerere Kikoni, Kampala</strong>. We respond quickly — usually within a few hours!`,
        quick: ['Location & hours','Laptop prices','Delivery info']
      },
      {
        keys: ['warranty','guarantee','return','refund','policy'],
        reply: `All our devices come with a <strong>warranty</strong>:<br><br>
          • Refurbished laptops: <strong>3–6 month warranty</strong> depending on model<br>
          • Brand new devices: <strong>manufacturer warranty</strong> applies<br>
          • After-sales support is always available<br><br>
          If you experience any issues after purchase, contact us and we'll sort it out promptly. Your satisfaction is our priority.`,
        quick: ['Repairs','Contact us','Laptop prices']
      },
      {
        keys: ['student','university','campus','makerere','school','academic','study','learning'],
        reply: `We have <strong>student-friendly packages</strong> designed specifically for campus life! 🎓<br><br>
          • Affordable refurbished laptops from <strong>UGX 700K</strong><br>
          • Flexible payment plans available<br>
          • Lightweight, battery-efficient models for long study sessions<br>
          • Free basic software setup (MS Office, antivirus)<br><br>
          Many students from Makerere, Kyambogo, and other universities trust Mwema Solutions. Come in or WhatsApp us for a student deal!`,
        quick: ['Laptop prices','Contact us','Delivery info']
      },
      {
        keys: ['accessory','accessories','mouse','keyboard','bag','charger','cable','headset','monitor','printer'],
        reply: `Yes, we also stock <strong>computer accessories</strong>! 🖱️<br><br>
          • Laptop bags & backpacks<br>
          • Mice (wired & wireless)<br>
          • Keyboards<br>
          • Chargers & power adapters<br>
          • HDMI & USB cables<br>
          • Headsets & earphones<br><br>
          Contact us or visit the shop for current stock and pricing.`,
        quick: ['Contact us','Laptop prices','Location & hours']
      },
      {
        keys: ['about','who','mwema','story','founder','mark','mission','history','since','2019'],
        reply: `<strong>Mwema Solutions</strong> was founded in 2019 by <strong>Mwesigwa Mark</strong> with a simple but powerful mission: make quality computers accessible to every student and small business in Uganda. 🇺🇬<br><br>
          Based in Makerere Kikoni, Kampala, we've grown to serve clients across the entire country — from Kampala to Mbarara, Ibanda to Gulu.<br><br>
          We believe in honest guidance, transparent pricing, and genuine after-sales care. Over <strong>500+ happy clients</strong> and counting!`,
        quick: ['Laptop prices','Contact us','Delivery info']
      },
      {
        keys: ['refurbished','used','second hand','certified','grade'],
        reply: `Our <strong>refurbished devices</strong> are not just "used" — they're <strong>certified and inspected</strong>: ✅<br><br>
          • Every unit goes through a full hardware diagnostic<br>
          • Faulty parts are replaced before sale<br>
          • Cleaned, tested, and reset to factory settings<br>
          • Come with a 3–6 month warranty<br>
          • Sourced from reputable suppliers with proper documentation<br><br>
          Refurbished is a smart choice — you get premium specs at a fraction of the new price.`,
        quick: ['Laptop prices','Warranty info','Contact us']
      }
    ];

    const fallback = `I'm not sure about that specific question, but I'm here to help! 😊<br><br>
      You can ask me about:<br>
      • Laptop & desktop prices<br>
      • Delivery across Uganda<br>
      • Repair services<br>
      • Location & working hours<br>
      • Bulk & business orders<br><br>
      Or contact us directly at <strong>+256 701 913 028</strong>.`;

    const fallbackQuick = ['Laptop prices','Delivery info','Contact us','Location & hours'];

    function getReply(text) {
      const lower = text.toLowerCase();
      for (const entry of KB) {
        if (entry.keys.some(k => lower.includes(k))) {
          return { reply: entry.reply, quick: entry.quick };
        }
      }
      return { reply: fallback, quick: fallbackQuick };
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
      const t = document.getElementById('ai-typing-indicator');
      if (t) t.remove();
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

    function handleSend(text) {
      const msg = text || input.value.trim();
      if (!msg) return;
      input.value = '';
      quickWrap.innerHTML = '';
      appendMsg(msg, 'user');
      showTyping();
      setTimeout(() => {
        removeTyping();
        const { reply, quick } = getReply(msg);
        appendMsg(reply, 'bot');
        setQuickReplies(quick);
      }, 700 + Math.random() * 400);
    }

    // Open/close
    btn.addEventListener('click', () => {
      box.classList.toggle('open');
      if (box.classList.contains('open') && messages.children.length === 0) {
        setTimeout(() => {
          appendMsg(`Hi! 👋 I'm the <strong>Mwema AI Assistant</strong>. Ask me anything about our laptops, prices, delivery, repairs, or services!`, 'bot');
          setQuickReplies(['Laptop prices','Delivery info','Repairs','Location & hours','About us']);
        }, 300);
      }
    });
    closeBtn.addEventListener('click', () => box.classList.remove('open'));

    // Wire up contact page banner button
    const openFromPage = document.getElementById('open-ai-from-page');
    if (openFromPage) {
      openFromPage.addEventListener('click', () => {
        box.classList.add('open');
        if (messages.children.length === 0) {
          setTimeout(() => {
            appendMsg(`Hi! 👋 I'm the <strong>Mwema AI Assistant</strong>. Ask me anything about our laptops, prices, delivery, repairs, or services!`, 'bot');
            setQuickReplies(['Laptop prices','Delivery info','Repairs','Location & hours','About us']);
          }, 300);
        }
        box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
    }

    // Send on button click or Enter
    sendBtn.addEventListener('click', () => handleSend());
    input.addEventListener('keydown', e => { if (e.key === 'Enter') handleSend(); });
  })();

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
  document.querySelectorAll('[data-target]').forEach(el => counterObs.observe(el));
