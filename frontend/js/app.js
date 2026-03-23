/**
 * Viet Heritage Hub — vanilla JS router & interactions
 */
(function () {
  'use strict';

  const ROUTES = ['/', '/history', '/map', '/ai', '/community', '/marketplace', '/auth', '/admin', '/product', '/cart', '/checkout'];

  let chartInstance = null;
  let activeDynastyIndex = 0;

  let heritageMap = null;
  let mapMarkersLayer = null;
  window._mapSites = null;
  window._mapRegion = 'all';
  window._mapSearch = '';

  let communityDataLoaded = false; // set true after first successful load

  // --- CART STATE ---
  let cart = JSON.parse(localStorage.getItem('vh-cart') || '[]');

  function saveCart() {
    localStorage.setItem('vh-cart', JSON.stringify(cart));
    updateCartBadge();
  }

  function updateCartBadge() {
    const badge = document.getElementById('cart-count');
    if (!badge) return;
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    badge.textContent = count;
    badge.classList.toggle('hidden', count === 0);
  }

  function addToCart(product, quantity = 1) {
    if (window.VHAuth && !window.VHAuth.canPurchase()) {
      alert('Vui lòng đăng nhập Thành viên để mua hàng.');
      window.location.hash = '#/auth';
      return;
    }
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
        quantity: quantity
      });
    }
    saveCart();
    alert(`Đã thêm ${product.name} vào giỏ hàng!`);
  }

  function getHashPath() {
    let h = window.location.hash.replace(/^#/, '') || '/';
    if (h[0] !== '/') h = '/' + h;
    return h;
  }

  function normalizeRoute(path) {
    if (path.startsWith('/product/')) return '/product';
    if (ROUTES.indexOf(path) === -1) return '/';
    return path;
  }

  function showPage(path) {
    const route = normalizeRoute(path);
    document.querySelectorAll('.page-section').forEach(function (el) {
      el.classList.toggle('is-active', el.getAttribute('data-route') === route);
    });
    document.querySelectorAll('[data-nav-route]').forEach(function (a) {
      const r = a.getAttribute('data-nav-route');
      const on = r === route;
      a.classList.toggle('is-active', on);
      a.classList.toggle('text-bronze-gold', on);
      a.classList.toggle('text-gray-300', !on);
    });
    window.scrollTo(0, 0);

    if (route === '/history') {
      window.requestAnimationFrame(initHistoryChart);
    }
    if (route === '/map') {
      setTimeout(initMapPage, 80);
    }
    if (route === '/community') {
      setTimeout(initCommunityPage, 80);
    }
    if (route === '/admin') {
      setTimeout(initAdminPage, 80);
    }
    if (route === '/product') {
      const id = path.split('/').pop();
      renderProductDetail(id);
    }
    if (route === '/cart') {
      renderCart();
    }
    if (route === '/checkout') {
      renderCheckout();
    }
    if (route === '/auth' && window.VHAuth) {
      window.VHAuth.updateRoleBanners();
    }
  }

  function onRouteChange() {
    // Luôn lấy user mới nhất để kiểm tra quyền trước khi render
    const user = window.VHAuth ? window.VHAuth.getUser() : null;
    const path = getHashPath();
    
    // Nếu cố vào admin mà không có quyền thì đẩy về auth
    if (path === '/admin') {
      const isAdmin = user && user.role === 'admin';
      const isArtisan = user && user.role === 'artisan';
      if (!isAdmin && !isArtisan) {
        window.location.hash = '#/auth';
        return;
      }
    }

    showPage(path);
  }

  function initRouter() {
    window.addEventListener('hashchange', onRouteChange);
    window.addEventListener('vh-auth-change', function() {
      // Khi auth thay đổi, nếu đang ở trang auth thì không cần re-run ngay (để tránh redirect loop)
      // nhưng nếu đang ở trang khác thì cần cập nhật UI
      if (getHashPath() !== '/auth') {
        onRouteChange();
      }
    });
    if (!window.location.hash) {
      window.location.hash = '#/';
    }
    onRouteChange();
  }

  function initHeaderScroll() {
    const header = document.getElementById('site-header');
    if (!header) return;
    function tick() {
      const scrolled = window.scrollY > 50;
      header.classList.toggle('bg-ink-black/90', scrolled);
      header.classList.toggle('backdrop-blur-md', scrolled);
      header.classList.toggle('border-white/10', scrolled);
      header.classList.toggle('shadow-lg', scrolled);
      header.classList.toggle('py-3', scrolled);
      header.classList.toggle('bg-transparent', !scrolled);
      header.classList.toggle('border-transparent', !scrolled);
      header.classList.toggle('py-6', !scrolled);
    }
    window.addEventListener('scroll', tick);
    tick();
  }

  function initMobileMenu() {
    const btn = document.getElementById('mobile-menu-btn');
    const panel = document.getElementById('mobile-menu');
    if (!btn || !panel) return;
    btn.addEventListener('click', function () {
      panel.classList.toggle('hidden');
    });
    panel.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        panel.classList.add('hidden');
      });
    });
  }

  function initHomeParallax() {
    const hero = document.getElementById('hero-bg');
    if (!hero) return;
    window.addEventListener('scroll', function () {
      hero.style.transform = 'translateY(' + window.scrollY * 0.5 + 'px)';
    });
  }

  function updateDynastyUI() {
    const d = window._dynasties && window._dynasties[activeDynastyIndex];
    if (!d) return;
    const titleEl = document.getElementById('dynasty-title');
    const periodEl = document.getElementById('dynasty-period');
    const descEl = document.getElementById('dynasty-desc');
    const capitalEl = document.getElementById('dynasty-capital');
    const figuresEl = document.getElementById('dynasty-figures');
    const eventsEl = document.getElementById('dynasty-events');
    const bgImgEl = document.getElementById('dynasty-bg-image');

    if (titleEl) titleEl.textContent = d.name;
    if (periodEl) periodEl.textContent = `${d.start_year}–${d.end_year}`;
    if (descEl) descEl.textContent = d.description;
    if (capitalEl) capitalEl.textContent = `Kinh đô: ${d.capital || '---'}`;
    
    if (bgImgEl) {
      bgImgEl.style.backgroundImage = d.image_url ? `url('${d.image_url}')` : 'none';
      bgImgEl.style.backgroundSize = 'cover';
      bgImgEl.style.backgroundPosition = 'center';
    }

    if (figuresEl) {
      const figures = (d.notable_figures || '').split(',').map(s => s.trim()).filter(s => s);
      figuresEl.innerHTML = figures.length > 0 
        ? figures.map(f => `<span class="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-sm text-gray-300">${escapeHtml(f)}</span>`).join('')
        : '<span class="text-gray-600 italic text-sm">Chưa có thông tin</span>';
    }

    if (eventsEl) {
      const events = (d.key_events || '').split(',').map(s => s.trim()).filter(s => s);
      eventsEl.innerHTML = events.length > 0
        ? events.map(e => `<div class="flex items-start gap-3 text-sm text-gray-400"><span class="text-bronze-gold">•</span><span>${escapeHtml(e)}</span></div>`).join('')
        : '<div class="text-gray-600 italic text-sm">Chưa có thông tin</div>';
    }

    document.querySelectorAll('[data-dynasty-index]').forEach(function (btn) {
      const i = parseInt(btn.getAttribute('data-dynasty-index'), 10);
      const isOn = i === activeDynastyIndex;
      btn.className =
        'w-full text-left p-4 border-l-2 transition-all duration-300 group hover:bg-white/5 ' +
        (isOn ? 'border-bronze-gold bg-white/5 text-white' : 'border-white/10 text-gray-500');
    });
  }

  function initDynastyButtons() {
    const container = document.getElementById('dynasty-nav');
    if (!container) return;

    fetch('/api/history')
      .then(res => res.json())
      .then(data => {
        window._dynasties = data;
        if (data.length > 0) {
          container.innerHTML = data.map((d, i) => `
            <button type="button" data-dynasty-index="${i}" class="w-full text-left p-4 border-l-2 border-white/10 text-gray-500 transition-all duration-300 group hover:bg-white/5">
              <div class="text-[10px] uppercase tracking-widest opacity-50 mb-1">${d.start_year} - ${d.end_year}</div>
              <div class="font-display text-lg group-hover:text-bronze-gold transition-colors">${d.name}</div>
            </button>
          `).join('');

          document.querySelectorAll('[data-dynasty-index]').forEach(function (btn) {
            btn.addEventListener('click', function () {
              activeDynastyIndex = parseInt(btn.getAttribute('data-dynasty-index'), 10);
              updateDynastyUI();
            });
          });
          
          updateDynastyUI();
          initHistoryChart(); // Khởi tạo chart sau khi có dữ liệu
        } else {
          container.innerHTML = '<p class="text-gray-600 italic text-sm p-4">Chưa có dữ liệu triều đại.</p>';
        }
      })
      .catch(err => {
        console.error('History Fetch Error:', err);
        container.innerHTML = '<p class="text-red-400 text-sm p-4">Lỗi kết nối dữ liệu.</p>';
      });
  }

  function initHistoryChart() {
    const canvas = document.getElementById('dynastyChart');
    if (!canvas || typeof Chart === 'undefined') return;

    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }

    const data = window._dynasties || [];
    if (data.length === 0) return;

    const ctx = canvas.getContext('2d');
    chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.map(function (d) {
          return d.name;
        }),
        datasets: [
          {
            label: 'Tầm ảnh hưởng',
            data: data.map(function (d) {
              return d.influence || 50;
            }),
            borderColor: '#C5A059',
            backgroundColor: 'rgba(197, 160, 89, 0.25)',
            fill: true,
            tension: 0.35,
            pointRadius: 4,
            pointBackgroundColor: '#C5A059',
            pointHoverRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#0F172A',
            borderColor: '#C5A059',
            borderWidth: 1,
            callbacks: {
              label: function(context) {
                const d = data[context.dataIndex];
                return `Tầm ảnh hưởng: ${context.raw}% (${d.start_year} - ${d.end_year})`;
              }
            }
          }
        },
        scales: {
          x: {
            ticks: { color: '#888', font: { size: 10 } },
            grid: { color: 'rgba(255,255,255,0.06)' }
          },
          y: {
            min: 0,
            max: 100,
            ticks: { color: '#888', stepSize: 20 },
            grid: { color: 'rgba(255,255,255,0.06)' }
          }
        }
      }
    });
  }

  function initAIStudio() {
    const form = document.getElementById('ai-form');
    const out = document.getElementById('ai-output');
    const empty = document.getElementById('ai-empty');
    const btn = document.getElementById('ai-submit');
    const input = document.getElementById('ai-word');
    if (!form || !out) return;

    const styles = ['Thư pháp (Traditional)', 'Modern Minimalist', 'Imperial Seal', 'Bamboo Script'];
    let selectedStyle = styles[0];

    document.querySelectorAll('[data-style-pick]').forEach(function (b) {
      b.addEventListener('click', function () {
        selectedStyle = b.getAttribute('data-style-pick') || selectedStyle;
        document.querySelectorAll('[data-style-pick]').forEach(function (x) {
          const on = x.getAttribute('data-style-pick') === selectedStyle;
          x.className =
            'p-3 text-sm border rounded transition-all style-btn ' +
            (on ? 'border-bronze-gold bg-bronze-gold/10 text-white' : 'border-white/10 text-gray-500 hover:border-white/30');
        });
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const word = (input && input.value) ? input.value.trim() : '';
      if (!word) return;

      btn.disabled = true;
      btn.innerHTML = '<span class="inline-block animate-spin">&#10226;</span> Generating…';
      out.classList.add('hidden');
      empty.classList.remove('hidden');

      fetch('/api/ai/calligraphy-meaning', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word: word, style: selectedStyle })
      })
        .then(function (r) {
          return r.json();
        })
        .then(function (data) {
          empty.classList.add('hidden');
          out.classList.remove('hidden');
          const md = data.markdown || data.error || 'No content.';
          if (typeof marked !== 'undefined' && marked.parse) {
            out.innerHTML = '<div class="ai-output prose prose-invert max-w-none">' + marked.parse(md) + '</div>';
          } else {
            out.innerHTML = '<pre class="text-left text-gray-300 whitespace-pre-wrap">' + escapeHtml(md) + '</pre>';
          }
        })
        .catch(function () {
          empty.classList.add('hidden');
          out.classList.remove('hidden');
          out.innerHTML = '<p class="text-red-400">Không gọi được API. Kiểm tra backend đang chạy.</p>';
        })
        .finally(function () {
          btn.disabled = false;
          btn.innerHTML =
            '<svg class="inline w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg> Ink The Meaning';
        });
    });
  }

  function escapeHtml(s) {
    const d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  function initHomeStats() {
    fetch('/api/heritage/stats')
      .then(function (r) {
        return r.json();
      })
      .then(function (d) {
        const w = document.querySelector('#home-stat-works .font-display');
        const a = document.querySelector('#home-stat-artisans .font-display');
        const s = document.querySelector('#home-stat-sites .font-display');
        if (w && d.works != null) w.textContent = String(d.works);
        if (a && d.artisans != null) a.textContent = String(d.artisans);
        if (s && d.sites != null) s.textContent = String(d.sites);
      })
      .catch(function () {
        const err = document.getElementById('home-stats-err');
        if (err) err.classList.remove('hidden');
      });
  }

  function initMapPage() {
    if (typeof L === 'undefined') {
      const me = document.getElementById('map-error');
      if (me) me.classList.remove('hidden');
      return;
    }
    const el = document.getElementById('heritage-map');
    if (!el) return;

    if (!heritageMap) {
      heritageMap = L.map('heritage-map', { scrollWheelZoom: true }).setView([16.2, 107.8], 6);
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(heritageMap);
      mapMarkersLayer = L.layerGroup().addTo(heritageMap);
    }

    function afterSites() {
      applyMapFilters();
      setTimeout(function () {
        if (heritageMap) heritageMap.invalidateSize();
      }, 200);
    }

    if (window._mapSites) {
      afterSites();
      return;
    }

    fetch('/api/heritage-sites')
      .then(function (r) {
        return r.json();
      })
      .then(function (sites) {
        // Map backend fields to frontend expected fields
        window._mapSites = sites.map(s => ({
          id: s.id,
          name: s.name,
          lat: Number(s.latitude),
          lng: Number(s.longitude),
          type: s.type,
          region_music: s.region_music,
          desc_vi: s.description_vi,
          desc_en: s.description_en
        }));
        afterSites();
      })
      .catch(function () {
        const err = document.getElementById('map-error');
        if (err) err.classList.remove('hidden');
      });
  }

  function getFilteredSites() {
    const sites = window._mapSites || [];
    const type = window._mapTypeFilter || 'all';
    const q = (window._mapSearch || '').toLowerCase().trim();
    let out = sites;
    if (type !== 'all') {
      out = out.filter(function (s) {
        return s.type === type;
      });
    }
    if (q) {
      out = out.filter(function (s) {
        return (s.name || '').toLowerCase().indexOf(q) !== -1;
      });
    }
    return out;
  }

  function applyMapFilters() {
    const sites = getFilteredSites();
    renderMapMarkers(sites);
    renderSiteList(sites);
    if (heritageMap) {
      setTimeout(function () {
        heritageMap.invalidateSize();
      }, 100);
    }
  }

  function renderMapMarkers(sites) {
    if (!heritageMap || !mapMarkersLayer) return;
    mapMarkersLayer.clearLayers();
    const bounds = [];
    sites.forEach(function (site) {
      const m = L.marker([site.lat, site.lng]);
      const popupHtml = `
        <div style="min-width: 220px;">
          ${site.image_url ? `<img src="${site.image_url}" style="width: 100%; height: 120px; object-cover; border-radius: 4px; margin-bottom: 8px;" />` : ''}
          <strong style="color: #c5a059; font-size: 14px;">${escapeHtml(site.name)}</strong>
          <div style="font-size: 11px; color: #888; margin-top: 2px;">
            ${escapeHtml(site.type || '')} · ${escapeHtml(site.region_music || '')}
          </div>
          <p style="font-size: 12px; margin-top: 6px; line-height: 1.4; color: #ccc;">
            ${escapeHtml(site.desc_vi || '')}
          </p>
        </div>
      `;
      m.bindPopup(popupHtml);
      mapMarkersLayer.addLayer(m);
      bounds.push([site.lat, site.lng]);
    });
    if (bounds.length) {
      heritageMap.fitBounds(bounds, { padding: [36, 36], maxZoom: 8 });
    }
  }

  function renderSiteList(sites) {
    const ul = document.getElementById('map-site-list');
    if (!ul) return;
    if (!sites.length) {
      ul.innerHTML = '<li class="text-sm text-gray-500 p-4">Không có điểm nào khớp bộ lọc.</li>';
      return;
    }
    ul.innerHTML = sites
      .map(function (site) {
        return (
          '<li class="p-4 hover:bg-white/5 cursor-pointer transition-colors map-site-item" data-lat="' +
          site.lat +
          '" data-lng="' +
          site.lng +
          '">' +
          '<div class="font-display text-bronze-gold text-sm">' +
          escapeHtml(site.name) +
          '</div>' +
          '<div class="text-xs text-gray-500 mt-1">' +
          escapeHtml(site.type || '') +
          ' · ' +
          escapeHtml(site.region_music || '') +
          '</div></li>'
        );
      })
      .join('');

    ul.querySelectorAll('.map-site-item').forEach(function (li) {
      li.addEventListener('click', function () {
        const lat = parseFloat(li.getAttribute('data-lat'));
        const lng = parseFloat(li.getAttribute('data-lng'));
        if (heritageMap && !isNaN(lat) && !isNaN(lng)) {
          heritageMap.setView([lat, lng], 10);
        }
      });
    });
  }

  function initMapControls() {
    const search = document.getElementById('map-search');
    const filters = document.querySelectorAll('.map-filter');

    if (search) {
      search.addEventListener('input', function () {
        window._mapSearch = search.value || '';
        applyMapFilters();
      });
    }

    filters.forEach(function (btn) {
      btn.addEventListener('click', function () {
        window._mapTypeFilter = btn.getAttribute('data-map-type') || 'all';
        filters.forEach(b => {
          const on = (b.getAttribute('data-map-type') || 'all') === window._mapTypeFilter;
          b.className = `map-filter px-3 py-1.5 rounded-full text-xs uppercase tracking-wider border ${on ? 'border-bronze-gold bg-bronze-gold/10 text-white' : 'border-white/20 text-gray-400 hover:border-bronze-gold/50'}`;
        });
        applyMapFilters();
      });
    });

    // Delegated click for site items
    const ul = document.getElementById('map-site-list');
    if (ul) {
      ul.addEventListener('click', function (e) {
        const li = e.target.closest('.map-site-item');
        if (!li) return;
        const lat = parseFloat(li.getAttribute('data-lat'));
        const lng = parseFloat(li.getAttribute('data-lng'));
        if (heritageMap && !isNaN(lat) && !isNaN(lng)) {
          heritageMap.flyTo([lat, lng], 10);
        }
      });
    }

    initMapPage();
  }

  function initCommunityPage() {
    if (communityDataLoaded) {
      return;
    }
    const errEl = document.getElementById('community-error');

    Promise.all([
      fetch('/api/heritage/stats').then(function (r) {
        return r.json();
      }),
      fetch('/api/community/events').then(function (r) {
        return r.json();
      }),
      fetch('/api/community/threads').then(function (r) {
        return r.json();
      })
    ])
      .then(function (results) {
        const stats = results[0];
        const events = results[1];
        const threads = results[2];
        communityDataLoaded = true;

        document.querySelectorAll('#community-stats [data-stat]').forEach(function (el) {
          const k = el.getAttribute('data-stat');
          if (stats[k] != null) el.textContent = String(stats[k]);
        });

        const evBox = document.getElementById('community-events');
        if (evBox) {
          evBox.innerHTML = events
            .map(function (e) {
              return (
                '<article class="glass-panel rounded-xl p-5 border border-white/10">' +
                '<div class="text-xs text-bronze-gold uppercase tracking-widest mb-2">' +
                escapeHtml(e.date) +
                ' · ' +
                escapeHtml(e.location) +
                '</div>' +
                '<h3 class="font-display text-lg text-white mb-2">' +
                escapeHtml(e.title) +
                '</h3>' +
                '<p class="text-sm text-gray-400 leading-relaxed">' +
                escapeHtml(e.excerpt) +
                '</p></article>'
              );
            })
            .join('');
        }

        const thBox = document.getElementById('community-threads');
        if (thBox) {
          thBox.innerHTML = threads
            .map(function (t) {
              return (
                '<div class="glass-panel rounded-lg px-4 py-3 border border-white/10 flex justify-between gap-4 flex-wrap">' +
                '<div><div class="font-display text-sm text-rice-paper">' +
                escapeHtml(t.title) +
                '</div>' +
                '<div class="text-xs text-gray-500 mt-1">bởi ' +
                escapeHtml(t.author) +
                '</div></div>' +
                '<div class="text-right text-xs text-gray-500">' +
                escapeHtml(String(t.replies)) +
                ' phản hồi<br>' +
                escapeHtml(t.lastActive) +
                '</div></div>'
              );
            })
            .join('');
        }
      })
      .catch(function () {
        if (errEl) errEl.classList.remove('hidden');
      });
  }

  function initNewsletter() {
    const form = document.getElementById('newsletter-form');
    const msg = document.getElementById('newsletter-msg');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (msg) {
        msg.textContent = 'Cảm ơn bạn — đây là bản demo (chưa gửi email thật).';
        msg.classList.remove('hidden');
      }
      form.reset();
    });
  }

  function initMarketplace() {
    const grid = document.getElementById('mp-grid');
    const empty = document.getElementById('mp-empty');
    const search = document.getElementById('mp-search');
    let allProducts = [];
    let cat = 'all';
    let q = '';

    function renderProducts(products) {
      if (!grid) return;
      grid.innerHTML = products
        .map(p => `
          <article data-mp-card data-id="${p.id}" class="group relative bg-white/5 rounded-sm overflow-hidden border border-white/5 hover:border-bronze-gold/50 transition-all duration-300">
            <div class="relative h-[400px] overflow-hidden cursor-pointer" onclick="window.location.hash='#/product/${p.id}'">
              <img src="${p.image_url || `https://picsum.photos/300/400?random=${p.id}`}" alt="${escapeHtml(p.name || '')}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0" />
              <div class="absolute top-4 right-4 bg-black/70 backdrop-blur px-3 py-1 text-bronze-gold text-sm font-bold">${new Intl.NumberFormat('vi-VN').format(Number(p.price) || 0)} đ</div>
              <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <button type="button" class="btn-quick-add bg-white text-black p-3 rounded-full hover:bg-bronze-gold transition" aria-label="Cart">🛒</button>
                <button type="button" class="bg-white text-black p-3 rounded-full hover:bg-bronze-gold transition" aria-label="Favorite">★</button>
              </div>
            </div>
            <div class="p-6 cursor-pointer" onclick="window.location.hash='#/product/${p.id}'">
              <div class="text-xs text-bronze-gold uppercase tracking-widest mb-1">${escapeHtml(p.category || '')}</div>
              <h3 class="font-display text-xl mb-1">${escapeHtml(p.name || '')}</h3>
              <p class="text-gray-500 text-sm line-clamp-2">${escapeHtml(p.description || '')}</p>
            </div>
          </article>
        `).join('');
    }

    function fetchProducts() {
      console.log('Marketplace: Fetching products...');
      fetch('/api/products')
        .then(res => {
          if (!res.ok) throw new Error('Network response was not ok');
          return res.json();
        })
        .then(data => {
          if (Array.isArray(data)) {
            allProducts = data;
            applyMp();
          }
        });
    }

    function applyMp() {
      const filtered = allProducts.filter(p => {
        const name = (p.name || '').toLowerCase();
        const desc = (p.description || '').toLowerCase();
        const category = p.category || '';
        
        const okCat = cat === 'all' || category === cat;
        const okQ = !q || name.includes(q) || desc.includes(q);
        return okCat && okQ;
      });
      
      renderProducts(filtered);
      if (empty) empty.classList.toggle('hidden', filtered.length !== 0);
    }

    document.querySelectorAll('.mp-filter').forEach(function (btn) {
      btn.addEventListener('click', function () {
        cat = btn.getAttribute('data-mp-cat') || 'all';
        document.querySelectorAll('.mp-filter').forEach(function (b) {
          const on = (b.getAttribute('data-mp-cat') || 'all') === cat;
          b.className =
            'mp-filter px-3 py-1.5 rounded-full text-xs uppercase tracking-wider border ' +
            (on
              ? 'border-bronze-gold bg-bronze-gold/10 text-white'
              : 'border-white/20 text-gray-400 hover:border-bronze-gold/50');
        });
        applyMp();
      });
    });

    if (search) {
      search.addEventListener('input', function () {
        q = (search.value || '').toLowerCase().trim();
        applyMp();
      });
    }

    fetchProducts();

    const gridEl = document.getElementById('mp-grid');
    if (gridEl) {
      gridEl.addEventListener('click', function (e) {
        const btn = e.target.closest('.btn-quick-add');
        if (!btn) return;
        e.preventDefault();
        e.stopPropagation();
        
        const card = btn.closest('[data-mp-card]');
        const id = Number(card.getAttribute('data-id'));
        const product = allProducts.find(p => p.id === id);
        if (product) addToCart(product);
      });
    }
  }

  function initAdminPage() {
    if (!window.VHAuth || (!window.VHAuth.isAdmin() && !window.VHAuth.canManageShopOrEvents())) {
      window.location.hash = '#/auth';
      return;
    }

    const userList = document.getElementById('admin-user-list');
    const userFormContainer = document.getElementById('admin-user-form-container');
    const userForm = document.getElementById('admin-user-form');
    const addUserBtn = document.getElementById('admin-add-user-btn');
    const cancelBtn = document.getElementById('admin-user-cancel');

    const historyFormContainer = document.getElementById('admin-history-form-container');
    const historyForm = document.getElementById('admin-history-form');
    const addHistoryBtn = document.getElementById('admin-add-history-btn');
    const cancelHistoryBtn = document.getElementById('admin-history-cancel');

    const mapFormContainer = document.getElementById('admin-map-form-container');
    const mapForm = document.getElementById('admin-map-form');
    const addMapBtn = document.getElementById('admin-add-map-btn');
    const cancelMapBtn = document.getElementById('admin-map-cancel');

    const productFormContainer = document.getElementById('admin-product-form-container');
    const productForm = document.getElementById('admin-product-form');
    const addProductBtn = document.getElementById('admin-add-product-btn');
    const cancelProductBtn = document.getElementById('admin-product-cancel');

    // Tab switching logic
    const tabBtns = document.querySelectorAll('.admin-tab-btn');
    const adminViews = document.querySelectorAll('.admin-view');

    // Phân quyền tab (admin full, artisan limited)
    const isAdmin = window.VHAuth.isAdmin();
    const isArtisan = window.VHAuth.canManageShopOrEvents() && !isAdmin;

    // Cập nhật tiêu đề dựa trên role
    const adminTitle = document.querySelector('#page-admin h1');
    const adminSub = document.querySelector('#page-admin p');
    if (adminTitle) adminTitle.textContent = isAdmin ? 'Admin Dashboard' : 'Artisan Dashboard';
    if (adminSub) adminSub.textContent = isAdmin ? 'Quản lý hệ thống và nội dung di sản.' : 'Quản lý gian hàng và sự kiện của bạn.';

    tabBtns.forEach(btn => {
      const tab = btn.getAttribute('data-admin-tab');
      const isVisible = isAdmin || (isArtisan && (tab === 'community' || tab === 'marketplace'));
      btn.classList.toggle('hidden', !isVisible);
      
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-admin-tab');
        
        // Update button styles
        tabBtns.forEach(b => {
          b.classList.remove('active', 'border-red-500/50', 'bg-red-500/10', 'text-white', 'font-bold');
          b.classList.add('border-transparent', 'text-gray-400');
        });
        btn.classList.add('active', 'border-red-500/50', 'bg-red-500/10', 'text-white', 'font-bold');
        btn.classList.remove('border-transparent', 'text-gray-400');

        // Show/hide views
        adminViews.forEach(view => {
          view.classList.toggle('hidden', view.id !== `admin-view-${targetTab}`);
        });

        // Specific load functions
        if (targetTab === 'users') loadUsers();
        if (targetTab === 'history') loadHistory();
        if (targetTab === 'map') loadMapPoints();
        if (targetTab === 'community') loadCommunityPosts();
        if (targetTab === 'marketplace') loadMarketplaceProducts();
      });
    });

    // Mặc định chọn tab đầu tiên có thể xem
    const firstTab = Array.from(tabBtns).find(b => !b.classList.contains('hidden'));
    if (firstTab) firstTab.click();

    // --- USERS MANAGEMENT ---
    function loadUsers() {
      if (!userList) return;
      fetch('/api/users', { headers: window.VHAuth.authHeaders() })
        .then(res => res.json())
        .then(users => {
          if (users.error) throw new Error(users.error);
          renderUsers(users);
        })
        .catch(err => {
          console.error('Failed to load users:', err);
          userList.innerHTML = '<tr><td colspan="5" class="py-4 text-center text-red-400">Không tải được danh sách.</td></tr>';
        });
    }

    function renderUsers(users) {
      if (!userList) return;
      userList.innerHTML = users.map(user => `
        <tr class="border-b border-white/5 hover:bg-white/5 transition-colors">
          <td class="py-4 px-2 text-gray-500">${user.id}</td>
          <td class="py-4 px-2 font-bold">${user.name}</td>
          <td class="py-4 px-2 text-gray-400">${user.email}</td>
          <td class="py-4 px-2">
            <span class="px-2 py-0.5 rounded-full border border-white/20 text-[10px] uppercase tracking-wider ${user.role === 'admin' ? 'text-red-400 border-red-400/30 bg-red-400/5' : ''}">
              ${user.role}
            </span>
          </td>
          <td class="py-4 px-2 text-right">
            <button onclick="window._adminEditUser(${user.id})" class="text-bronze-gold hover:text-white transition-colors mr-3">Sửa</button>
            <button onclick="window._adminDeleteUser(${user.id})" class="text-red-500 hover:text-white transition-colors">Xóa</button>
          </td>
        </tr>
      `).join('');
    }

    window._adminEditUser = function(id) {
      fetch(`/api/users/${id}`, { headers: window.VHAuth.authHeaders() })
        .then(res => res.json())
        .then(user => {
          document.getElementById('admin-user-id').value = user.id;
          document.getElementById('admin-user-name').value = user.name;
          document.getElementById('admin-user-email').value = user.email;
          document.getElementById('admin-user-role').value = user.role;
          document.getElementById('admin-user-password').value = '';
          userFormContainer.classList.remove('hidden');
          userFormContainer.scrollIntoView({ behavior: 'smooth' });
        });
    };

    window._adminDeleteUser = function(id) {
      if (!confirm('Bạn có chắc muốn xóa người dùng này?')) return;
      fetch(`/api/users/${id}`, {
        method: 'DELETE',
        headers: window.VHAuth.authHeaders()
      })
      .then(res => res.json())
      .then(data => {
        if (data.error) alert(data.error);
        else loadUsers();
      })
      .catch(err => alert('Lỗi: ' + err.message));
    };

    // --- HISTORY MANAGEMENT ---
    function loadHistory() {
      const list = document.getElementById('admin-history-list');
      if (!list) return;
      list.innerHTML = '<tr><td colspan="3" class="py-4 text-center">Đang tải...</td></tr>';
      fetch('/api/history')
        .then(res => res.json())
        .then(data => {
          if (!Array.isArray(data)) throw new Error('Invalid data');
          list.innerHTML = data.map(h => `
            <tr class="border-b border-white/5 hover:bg-white/5 transition-colors">
              <td class="py-4 px-2 font-bold">${escapeHtml(h.name)}</td>
              <td class="py-4 px-2 text-gray-400">${h.start_year} - ${h.end_year}</td>
              <td class="py-4 px-2 text-right">
                <button onclick="window._adminEditHistory(${h.id})" class="text-bronze-gold hover:text-white transition-colors mr-3">Sửa</button>
                <button onclick="window._adminDeleteHistory(${h.id})" class="text-red-500 hover:text-white transition-colors">Xóa</button>
              </td>
            </tr>
          `).join('');
        })
        .catch(() => {
          list.innerHTML = '<tr><td colspan="3" class="py-4 text-center text-red-400">Lỗi tải dữ liệu.</td></tr>';
        });
    }

    window._adminEditHistory = function(id) {
      fetch(`/api/history/${id}`)
        .then(res => res.json())
        .then(h => {
          document.getElementById('admin-history-id').value = h.id;
          document.getElementById('admin-history-name').value = h.name;
          document.getElementById('admin-history-capital').value = h.capital || '';
          document.getElementById('admin-history-figures').value = h.notable_figures || '';
          document.getElementById('admin-history-events').value = h.key_events || '';
          document.getElementById('admin-history-image').value = h.image_url || '';
          document.getElementById('admin-history-color').value = h.theme_color || '';
          document.getElementById('admin-history-start').value = h.start_year;
          document.getElementById('admin-history-end').value = h.end_year;
          document.getElementById('admin-history-pattern').value = h.background_pattern || '';
          document.getElementById('admin-history-music').value = h.background_music || '';
          document.getElementById('admin-history-influence').value = h.influence || 50;
          document.getElementById('admin-history-desc').value = h.description || '';
          historyFormContainer.classList.remove('hidden');
          historyFormContainer.scrollIntoView({ behavior: 'smooth' });
        });
    };

    window._adminDeleteHistory = function(id) {
      if (!confirm('Xóa triều đại này?')) return;
      fetch(`/api/history/${id}`, {
        method: 'DELETE',
        headers: window.VHAuth.authHeaders()
      })
      .then(() => loadHistory())
      .catch(err => alert('Lỗi: ' + err.message));
    };

    // --- MAP MANAGEMENT ---
    function loadMapPoints() {
      const list = document.getElementById('admin-map-list');
      if (!list) return;
      list.innerHTML = '<tr><td colspan="4" class="py-4 text-center">Đang tải...</td></tr>';
      fetch('/api/heritage-sites')
        .then(res => res.json())
        .then(sites => {
          if (!Array.isArray(sites)) throw new Error('Invalid data');
          list.innerHTML = sites.map(s => `
            <tr class="border-b border-white/5 hover:bg-white/5 transition-colors">
              <td class="py-4 px-2 font-bold">${escapeHtml(s.name)}</td>
              <td class="py-4 px-2 text-bronze-gold">${escapeHtml(s.type)}</td>
              <td class="py-4 px-2 text-gray-400 text-xs">${s.latitude}, ${s.longitude}</td>
              <td class="py-4 px-2 text-right">
                <button onclick="window._adminEditMap(${s.id})" class="text-bronze-gold hover:text-white transition-colors mr-3">Sửa</button>
                <button onclick="window._adminDeleteMap(${s.id})" class="text-red-500 hover:text-white transition-colors">Xóa</button>
              </td>
            </tr>
          `).join('');
        })
        .catch(err => {
          console.error('Admin Map Load Error:', err);
          list.innerHTML = '<tr><td colspan="4" class="py-4 text-center text-red-400">Lỗi tải dữ liệu.</td></tr>';
        });
    }

    window._adminEditMap = function(id) {
      fetch(`/api/heritage-sites/${id}`)
        .then(res => res.json())
        .then(s => {
          document.getElementById('admin-map-id').value = s.id;
          document.getElementById('admin-map-name').value = s.name;
          document.getElementById('admin-map-type').value = s.type;
          document.getElementById('admin-map-region-music').value = s.region_music || '';
          document.getElementById('admin-map-image').value = s.image_url || '';
          document.getElementById('admin-map-lat').value = s.latitude;
          document.getElementById('admin-map-lng').value = s.longitude;
          document.getElementById('admin-map-desc-vi').value = s.description_vi || '';
          document.getElementById('admin-map-desc-en').value = s.description_en || '';
          mapFormContainer.classList.remove('hidden');
          mapFormContainer.scrollIntoView({ behavior: 'smooth' });
        });
    };

    window._adminDeleteMap = function(id) {
      if (!confirm('Xóa điểm di sản này?')) return;
      fetch(`/api/heritage-sites/${id}`, {
        method: 'DELETE',
        headers: window.VHAuth.authHeaders()
      })
      .then(() => loadMapPoints())
      .catch(err => alert('Lỗi: ' + err.message));
    };

    // --- COMMUNITY MANAGEMENT ---
    function loadCommunityPosts() {
      const list = document.getElementById('admin-community-list');
      if (!list) return;
      list.innerHTML = '<tr><td colspan="4" class="py-4 text-center text-gray-500">Chưa có bài đăng nào cần duyệt.</td></tr>';
    }

    // --- MARKETPLACE MANAGEMENT ---
    function loadMarketplaceProducts() {
      const list = document.getElementById('admin-product-list');
      if (!list) return;
      list.innerHTML = '<tr><td colspan="4" class="py-4 text-center">Đang tải...</td></tr>';
      fetch('/api/products')
        .then(res => res.json())
        .then(products => {
          if (!Array.isArray(products)) {
            list.innerHTML = '<tr><td colspan="4" class="py-4 text-center text-red-400">Dữ liệu không hợp lệ.</td></tr>';
            return;
          }
          list.innerHTML = products.map(p => `
            <tr class="border-b border-white/5">
              <td class="py-4 px-2 font-bold">${escapeHtml(p.name)}</td>
              <td class="py-4 px-2 text-bronze-gold">${new Intl.NumberFormat('vi-VN').format(p.price)} đ</td>
              <td class="py-4 px-2 text-gray-400">${escapeHtml(p.category)}</td>
              <td class="py-4 px-2 text-right">
                <button onclick="window._adminEditProduct(${p.id})" class="text-bronze-gold hover:text-white transition-colors mr-3">Sửa</button>
                <button onclick="window._adminDeleteProduct(${p.id})" class="text-red-500 hover:text-white transition-colors">Xóa</button>
              </td>
            </tr>
          `).join('');
        })
        .catch(() => {
          list.innerHTML = '<tr><td colspan="4" class="py-4 text-center text-red-400">Lỗi tải dữ liệu.</td></tr>';
        });
    }

    window._adminEditProduct = function(id) {
      fetch(`/api/products/${id}`)
        .then(res => res.json())
        .then(p => {
          document.getElementById('admin-product-id').value = p.id;
          document.getElementById('admin-product-name').value = p.name;
          document.getElementById('admin-product-price').value = p.price;
          document.getElementById('admin-product-category').value = p.category || '';
          document.getElementById('admin-product-image').value = p.image_url || '';
          document.getElementById('admin-product-stock').value = p.stock || 0;
          productFormContainer.classList.remove('hidden');
          productFormContainer.scrollIntoView({ behavior: 'smooth' });
        });
    };

    window._adminDeleteProduct = function(id) {
      if (!confirm('Xóa sản phẩm này?')) return;
      fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: window.VHAuth.authHeaders()
      })
      .then(() => loadMarketplaceProducts())
      .catch(err => alert('Lỗi: ' + err.message));
    };

    // --- FORM ACTIONS ---
    if (addUserBtn) addUserBtn.onclick = () => {
      userForm.reset();
      document.getElementById('admin-user-id').value = '';
      userFormContainer.classList.toggle('hidden');
    };
    if (cancelBtn) cancelBtn.onclick = () => userFormContainer.classList.add('hidden');
    if (userForm) userForm.onsubmit = (e) => {
      e.preventDefault();
      const id = document.getElementById('admin-user-id').value;
      const userData = {
        name: document.getElementById('admin-user-name').value,
        email: document.getElementById('admin-user-email').value,
        role: document.getElementById('admin-user-role').value
      };
      const password = document.getElementById('admin-user-password').value;
      if (password) userData.password = password;
      const method = id ? 'PUT' : 'POST';
      const url = id ? `/api/users/${id}` : '/api/users';
      fetch(url, {
        method,
        headers: { ...window.VHAuth.authHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      })
      .then(res => res.json())
      .then(data => {
        if (data.error) alert(data.error);
        else {
          userFormContainer.classList.add('hidden');
          loadUsers();
        }
      })
      .catch(err => alert('Lỗi: ' + err.message));
    };

    if (addHistoryBtn) addHistoryBtn.onclick = () => {
      historyForm.reset();
      document.getElementById('admin-history-id').value = '';
      historyFormContainer.classList.toggle('hidden');
    };
    if (cancelHistoryBtn) cancelHistoryBtn.onclick = () => historyFormContainer.classList.add('hidden');
    if (historyForm) historyForm.onsubmit = (e) => {
      e.preventDefault();
      const id = document.getElementById('admin-history-id').value;
      const data = {
        name: document.getElementById('admin-history-name').value,
        capital: document.getElementById('admin-history-capital').value,
        notable_figures: document.getElementById('admin-history-figures').value,
        key_events: document.getElementById('admin-history-events').value,
        image_url: document.getElementById('admin-history-image').value,
        theme_color: document.getElementById('admin-history-color').value,
        start_year: document.getElementById('admin-history-start').value,
        end_year: document.getElementById('admin-history-end').value,
        background_pattern: document.getElementById('admin-history-pattern').value,
        background_music: document.getElementById('admin-history-music').value,
        influence: document.getElementById('admin-history-influence').value,
        description: document.getElementById('admin-history-desc').value
      };
      const method = id ? 'PUT' : 'POST';
      const url = id ? `/api/history/${id}` : '/api/history';
      fetch(url, {
        method,
        headers: { ...window.VHAuth.authHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      .then(res => res.json())
      .then(data => {
        if (data.error) alert(data.error);
        else {
          historyFormContainer.classList.add('hidden');
          loadHistory();
        }
      })
      .catch(err => alert('Lỗi: ' + err.message));
    };

    if (addMapBtn) addMapBtn.onclick = () => {
      mapForm.reset();
      document.getElementById('admin-map-id').value = '';
      mapFormContainer.classList.toggle('hidden');
    };
    if (cancelMapBtn) cancelMapBtn.onclick = () => mapFormContainer.classList.add('hidden');
    if (mapForm) mapForm.onsubmit = (e) => {
      e.preventDefault();
      const id = document.getElementById('admin-map-id').value;
      const data = {
        name: document.getElementById('admin-map-name').value,
        type: document.getElementById('admin-map-type').value,
        region_music: document.getElementById('admin-map-region-music').value,
        image_url: document.getElementById('admin-map-image').value,
        latitude: document.getElementById('admin-map-lat').value,
        longitude: document.getElementById('admin-map-lng').value,
        description_vi: document.getElementById('admin-map-desc-vi').value,
        description_en: document.getElementById('admin-map-desc-en').value
      };
      const method = id ? 'PUT' : 'POST';
      const url = id ? `/api/heritage-sites/${id}` : '/api/heritage-sites';
      fetch(url, {
        method,
        headers: { ...window.VHAuth.authHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      .then(res => res.json())
      .then(data => {
        if (data.error) alert(data.error);
        else {
          mapFormContainer.classList.add('hidden');
          loadMapPoints();
        }
      })
      .catch(err => alert('Lỗi: ' + err.message));
    };

    if (addProductBtn) addProductBtn.onclick = () => {
      productForm.reset();
      document.getElementById('admin-product-id').value = '';
      productFormContainer.classList.toggle('hidden');
    };
    if (cancelProductBtn) cancelProductBtn.onclick = () => productFormContainer.classList.add('hidden');
    if (productForm) productForm.onsubmit = (e) => {
      e.preventDefault();
      const id = document.getElementById('admin-product-id').value;
      const data = {
        name: document.getElementById('admin-product-name').value,
        price: document.getElementById('admin-product-price').value,
        category: document.getElementById('admin-product-category').value,
        image_url: document.getElementById('admin-product-image').value,
        stock: document.getElementById('admin-product-stock').value
      };
      
      // Tạm thời gán shop_id = 1 cho demo nếu tạo mới (sau này sẽ lấy từ API my-shops)
      if (!id) data.shop_id = 1;

      const method = id ? 'PUT' : 'POST';
      const url = id ? `/api/products/${id}` : '/api/products';
      fetch(url, {
        method,
        headers: { ...window.VHAuth.authHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      .then(res => res.json())
      .then(data => {
        if (data.error) alert(data.error);
        else {
          productFormContainer.classList.add('hidden');
          loadMarketplaceProducts();
        }
      })
      .catch(err => alert('Lỗi: ' + err.message));
    };
  }

  function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    renderCart();
  }

  function updateCartQuantity(id, delta) {
    const item = cart.find(i => i.id === id);
    if (item) {
      item.quantity += delta;
      if (item.quantity <= 0) {
        removeFromCart(id);
      } else {
        saveCart();
        renderCart();
      }
    }
  }

  function renderProductDetail(id) {
    const content = document.getElementById('product-detail-content');
    if (!content) return;

    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(p => {
        content.innerHTML = `
          <div class="relative rounded-xl overflow-hidden bg-white/5 border border-white/10 group">
            <img src="${p.image_url || `https://picsum.photos/600/800?random=${p.id}`}" alt="${escapeHtml(p.name)}" class="w-full h-full object-cover" />
          </div>
          <div class="flex flex-col justify-center">
            <div class="text-xs text-bronze-gold uppercase tracking-[0.2em] mb-2 font-bold">${escapeHtml(p.category || 'Crafts')}</div>
            <h1 class="font-display text-5xl mb-4 text-white">${escapeHtml(p.name)}</h1>
            <div class="text-3xl text-bronze-gold font-bold mb-6">${new Intl.NumberFormat('vi-VN').format(Number(p.price))} đ</div>
            <p class="text-gray-400 text-lg leading-relaxed mb-8 font-serif italic">
              ${escapeHtml(p.description || 'Sản phẩm thủ công tinh xảo mang đậm nét văn hóa Việt Nam.')}
            </p>
            <div class="flex items-center gap-6 mb-10">
              <div class="flex items-center border border-white/20 rounded-full px-4 py-2">
                <button id="qty-minus" class="text-gray-400 hover:text-white px-2">-</button>
                <input id="qty-input" type="number" value="1" min="1" class="bg-transparent w-12 text-center text-white focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                <button id="qty-plus" class="text-gray-400 hover:text-white px-2">+</button>
              </div>
              <button id="btn-add-detail" class="flex-1 bg-bronze-gold text-ink-black font-bold uppercase tracking-widest py-4 rounded-full hover:bg-white transition-all shadow-[0_0_30px_rgba(197,160,89,0.2)]">
                Thêm vào giỏ hàng
              </button>
            </div>
            <div class="grid grid-cols-2 gap-4 border-t border-white/10 pt-8">
              <div class="flex items-center gap-3 text-xs text-gray-500 uppercase tracking-wider">
                <span class="text-bronze-gold text-lg">🛡️</span> Bảo hành 12 tháng
              </div>
              <div class="flex items-center gap-3 text-xs text-gray-500 uppercase tracking-wider">
                <span class="text-bronze-gold text-lg">🚚</span> Giao hàng toàn quốc
              </div>
            </div>
          </div>
        `;

        // Detail events
        const qIn = document.getElementById('qty-input');
        const btnMinus = document.getElementById('qty-minus');
        const btnPlus = document.getElementById('qty-plus');
        const btnAdd = document.getElementById('btn-add-detail');

        if (btnMinus) btnMinus.onclick = () => { if (qIn.value > 1) qIn.value--; };
        if (btnPlus) btnPlus.onclick = () => { qIn.value++; };
        if (btnAdd) btnAdd.onclick = () => {
          addToCart(p, parseInt(qIn.value));
        };
      })
      .catch(() => {
        content.innerHTML = '<p class="text-center text-red-400 col-span-2">Không tìm thấy sản phẩm hoặc lỗi kết nối.</p>';
      });
  }

  function renderCart() {
    const container = document.getElementById('cart-content');
    const summary = document.getElementById('cart-summary');
    const totalEl = document.getElementById('cart-total');
    if (!container) return;

    if (cart.length === 0) {
      container.innerHTML = '<p class="text-gray-500 text-center py-20 font-serif italic text-lg">Giỏ hàng của bạn đang trống. Hãy khám phá những sản phẩm độc đáo!</p>';
      if (summary) summary.classList.add('hidden');
      return;
    }

    if (summary) summary.classList.remove('hidden');
    let total = 0;
    container.innerHTML = cart.map(item => {
      const subtotal = item.price * item.quantity;
      total += subtotal;
      return `
        <div class="flex items-center gap-6 bg-white/5 p-4 rounded-xl border border-white/5 hover:border-white/10 transition-all">
          <div class="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
            <img src="${item.image_url || `https://picsum.photos/200/200?random=${item.id}`}" class="w-full h-full object-cover" />
          </div>
          <div class="flex-1">
            <h3 class="font-display text-xl text-white mb-1">${escapeHtml(item.name)}</h3>
            <div class="text-bronze-gold font-bold">${new Intl.NumberFormat('vi-VN').format(item.price)} đ</div>
          </div>
          <div class="flex items-center border border-white/10 rounded-lg px-2 py-1">
            <button onclick="VHApp.updateCartQuantity(${item.id}, -1)" class="text-gray-500 hover:text-white px-2">-</button>
            <span class="w-8 text-center text-white font-bold">${item.quantity}</span>
            <button onclick="VHApp.updateCartQuantity(${item.id}, 1)" class="text-gray-500 hover:text-white px-2">+</button>
          </div>
          <div class="w-32 text-right font-bold text-white">
            ${new Intl.NumberFormat('vi-VN').format(subtotal)} đ
          </div>
          <button onclick="VHApp.removeFromCart(${item.id})" class="text-gray-600 hover:text-red-500 transition-colors p-2" title="Xóa">
            🗑️
          </button>
        </div>
      `;
    }).join('');
    if (totalEl) totalEl.textContent = new Intl.NumberFormat('vi-VN').format(total) + ' đ';
  }

  function renderCheckout() {
    const totalEl = document.getElementById('checkout-total');
    const btnPay = document.getElementById('btn-pay-now');
    if (!totalEl || !btnPay) return;

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalEl.textContent = new Intl.NumberFormat('vi-VN').format(total) + ' đ';

    btnPay.onclick = () => {
      btnPay.disabled = true;
      btnPay.textContent = 'Đang xử lý...';
      setTimeout(() => {
        alert('Thanh toán thành công! Cảm ơn bạn đã ủng hộ các nghệ nhân Việt Nam.');
        cart = [];
        saveCart();
        window.location.hash = '#/';
        btnPay.disabled = false;
        btnPay.textContent = 'Xác nhận & Hoàn tất';
      }, 1500);
    };
  }

  function initChat() {
    const toggle = document.getElementById('chat-toggle');
    const windowEl = document.getElementById('chat-window');
    const close = document.getElementById('close-chat');
    const form = document.getElementById('chat-form');
    const input = document.getElementById('chat-input');
    const messages = document.getElementById('chat-messages');

    if (!toggle || !windowEl) return;

    toggle.onclick = () => {
      windowEl.classList.toggle('hidden');
      if (!windowEl.classList.contains('hidden')) {
        input.focus();
        messages.scrollTop = messages.scrollHeight;
      }
    };

    if (close) close.onclick = () => windowEl.classList.add('hidden');

    if (form) {
      form.onsubmit = (e) => {
        e.preventDefault();
        const text = input.value.trim();
        if (!text) return;

        // User message
        const userMsg = document.createElement('div');
        userMsg.className = 'flex flex-col items-end';
        userMsg.innerHTML = `
          <div class="bg-bronze-gold text-black p-3 rounded-2xl rounded-tr-none max-w-[80%] text-sm leading-relaxed">
            ${escapeHtml(text)}
          </div>
          <span class="text-[9px] text-gray-600 mt-1 mr-1 uppercase tracking-widest">Bạn • Vừa xong</span>
        `;
        messages.appendChild(userMsg);
        input.value = '';
        messages.scrollTop = messages.scrollHeight;

        // Mock Admin Reply
        setTimeout(() => {
          const adminMsg = document.createElement('div');
          adminMsg.className = 'flex flex-col items-start animate-fade-in-up';
          adminMsg.innerHTML = `
            <div class="bg-white/5 border border-white/10 text-gray-300 p-3 rounded-2xl rounded-tl-none max-w-[80%] text-sm leading-relaxed">
              Cảm ơn bạn đã nhắn tin. Admin đã nhận được thông tin và sẽ phản hồi sớm nhất có thể!
            </div>
            <span class="text-[9px] text-gray-600 mt-1 ml-1 uppercase tracking-widest">Admin • Vừa xong</span>
          `;
          messages.appendChild(adminMsg);
          messages.scrollTop = messages.scrollHeight;
        }, 1000);
      };
    }
  }

  // Exposed objects
  window.VHApp = {
    init: function () {
      initRouter();
      initHeaderScroll();
      initMobileMenu();
      initHomeParallax();
      initDynastyButtons();
      initAIStudio();
      initHomeStats();
      initMapControls();
      initNewsletter();
      initMarketplace();
      initChat();
      updateCartBadge();
    },
    updateCartQuantity,
    removeFromCart
  };

  // Auto-init if DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.VHApp.init);
  } else {
    window.VHApp.init();
  }
})();
