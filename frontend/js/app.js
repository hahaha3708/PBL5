/**
 * Viet Heritage Hub — vanilla JS router & interactions
 */
(function () {
  'use strict';

  const ROUTES = ['/', '/history', '/map', '/ai', '/community', '/marketplace', '/auth', '/admin'];

  const dynasticChartData = [
    { name: 'Ngo', start: 938, power: 40 },
    { name: 'Dinh', start: 968, power: 50 },
    { name: 'Early Le', start: 980, power: 60 },
    { name: 'Ly', start: 1009, power: 85 },
    { name: 'Tran', start: 1225, power: 95 },
    { name: 'Ho', start: 1400, power: 50 },
    { name: 'Later Le', start: 1428, power: 90 },
    { name: 'Nguyen', start: 1802, power: 70 }
  ];

  const dynasties = [
    { id: 'ly', name: 'Ly Dynasty', period: '1009–1225', desc: 'The Golden Era of Buddhism and Art.', color: 'border-yellow-500' },
    { id: 'tran', name: 'Tran Dynasty', period: '1225–1400', desc: 'Defenders against the Mongol Empire.', color: 'border-red-600' },
    { id: 'le', name: 'Le Dynasty', period: '1428–1789', desc: 'Renaissance of Literature and Law.', color: 'border-blue-500' },
    { id: 'nguyen', name: 'Nguyen Dynasty', period: '1802–1945', desc: 'Unification and Imperial Grandeur.', color: 'border-purple-500' }
  ];

  let chartInstance = null;
  let activeDynastyIndex = 0;

  let heritageMap = null;
  let mapMarkersLayer = null;
  window._mapSites = null;
  window._mapRegion = 'all';
  window._mapSearch = '';

  let communityDataLoaded = false; // set true after first successful load

  function getHashPath() {
    let h = window.location.hash.replace(/^#/, '') || '/';
    if (h[0] !== '/') h = '/' + h;
    return h;
  }

  function normalizeRoute(path) {
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
    const d = dynasties[activeDynastyIndex];
    const titleEl = document.getElementById('dynasty-title');
    const periodEl = document.getElementById('dynasty-period');
    const descEl = document.getElementById('dynasty-desc');
    if (titleEl) titleEl.textContent = d.name;
    if (periodEl) periodEl.textContent = d.period;
    if (descEl) descEl.textContent = d.desc;

    const borderOn = ['border-yellow-500', 'border-red-600', 'border-blue-500', 'border-purple-500'];
    document.querySelectorAll('[data-dynasty-index]').forEach(function (btn) {
      const i = parseInt(btn.getAttribute('data-dynasty-index'), 10);
      const isOn = i === activeDynastyIndex;
      btn.className =
        'w-full text-left p-4 border-l-2 transition-all duration-300 group hover:bg-white/5 ' +
        (isOn ? borderOn[i] + ' bg-white/5 text-white' : 'border-white/10 text-gray-500');
    });
  }

  function initDynastyButtons() {
    document.querySelectorAll('[data-dynasty-index]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        activeDynastyIndex = parseInt(btn.getAttribute('data-dynasty-index'), 10);
        updateDynastyUI();
      });
    });
    updateDynastyUI();
  }

  function initHistoryChart() {
    const canvas = document.getElementById('dynastyChart');
    if (!canvas || typeof Chart === 'undefined') return;

    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }

    const ctx = canvas.getContext('2d');
    chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: dynasticChartData.map(function (d) {
          return String(d.start);
        }),
        datasets: [
          {
            label: 'Influence',
            data: dynasticChartData.map(function (d) {
              return d.power;
            }),
            borderColor: '#C5A059',
            backgroundColor: 'rgba(197, 160, 89, 0.25)',
            fill: true,
            tension: 0.35,
            pointRadius: 3,
            pointBackgroundColor: '#C5A059'
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
            borderWidth: 1
          }
        },
        scales: {
          x: {
            ticks: { color: '#888' },
            grid: { color: 'rgba(255,255,255,0.06)' }
          },
          y: {
            ticks: { color: '#888' },
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
        <div style="min-width: 180px;">
          <strong style="color: #c5a059; font-size: 14px;">${escapeHtml(site.name)}</strong>
          <div style="font-size: 11px; color: #888; margin-top: 2px;">
            ${escapeHtml(site.type || '')} · ${escapeHtml(site.region_music || '')}
          </div>
          <p style="font-size: 12px; margin-top: 6px; line-height: 1.4;">
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
          <article data-mp-card data-category="${escapeHtml(p.category || '')}" data-title="${escapeHtml(p.name || '')}" class="group relative bg-white/5 rounded-sm overflow-hidden border border-white/5 hover:border-bronze-gold/50 transition-all duration-300">
            <div class="relative h-[400px] overflow-hidden">
              <img src="${p.image_url || `https://picsum.photos/300/400?random=${p.id}`}" alt="${escapeHtml(p.name || '')}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0" />
              <div class="absolute top-4 right-4 bg-black/70 backdrop-blur px-3 py-1 text-bronze-gold text-sm font-bold">${new Intl.NumberFormat('vi-VN').format(Number(p.price) || 0)} đ</div>
              <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <button type="button" class="bg-white text-black p-3 rounded-full hover:bg-bronze-gold transition" aria-label="Cart">🛒</button>
                <button type="button" class="bg-white text-black p-3 rounded-full hover:bg-bronze-gold transition" aria-label="Favorite">★</button>
              </div>
            </div>
            <div class="p-6">
              <div class="text-xs text-bronze-gold uppercase tracking-widest mb-1">${escapeHtml(p.category || '')}</div>
              <h3 class="font-display text-xl mb-1">${escapeHtml(p.name || '')}</h3>
              <p class="text-gray-500 text-sm">${escapeHtml(p.description || '')}</p>
            </div>
          </article>
        `).join('');
    }

    function fetchProducts() {
      console.log('Marketplace: Fetching products...');
      fetch('/api/products')
        .then(res => {
          console.log('Marketplace: Response status:', res.status);
          if (!res.ok) throw new Error('Network response was not ok: ' + res.status);
          return res.json();
        })
        .then(data => {
          console.log('Marketplace: Data received:', data);
          if (Array.isArray(data)) {
            allProducts = data;
            applyMp();
          } else {
            console.error('API returned non-array data:', data);
          }
        })
        .catch(err => {
          console.error('Marketplace: Fetch error:', err);
          const grid = document.getElementById('mp-grid');
          if (grid) grid.innerHTML = `<p class="col-span-full text-center text-red-400">Lỗi kết nối máy chủ (${err.message}). Vui lòng thử lại sau.</p>`;
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
        const btn = e.target.closest('button');
        if (!btn || !btn.closest('[data-mp-card]')) return;
        if (window.VHAuth && !window.VHAuth.canPurchase()) {
          e.preventDefault();
          e.stopPropagation();
          alert('Theo phân quyền: Khách không mua hàng. Vui lòng đăng nhập Thành viên.');
          window.location.hash = '#/auth';
        }
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
          list.innerHTML = '<tr><td colspan="3" class="py-4 text-center text-gray-500">Chưa có dữ liệu lịch sử.</td></tr>';
        })
        .catch(() => {
          list.innerHTML = '<tr><td colspan="3" class="py-4 text-center text-red-400">Lỗi tải dữ liệu.</td></tr>';
        });
    }

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
          document.getElementById('admin-product-category').value = p.category;
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
        category: document.getElementById('admin-product-category').value
      };
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
    }
  };

  // Auto-init if DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.VHApp.init);
  } else {
    window.VHApp.init();
  }
})();
