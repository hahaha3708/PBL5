/**
 * Viet Heritage Hub — vanilla JS router & interactions
 */
(function () {
  'use strict';

  const ROUTES = ['/', '/history', '/map', '/ai', '/community', '/marketplace'];

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
  }

  function onRouteChange() {
    showPage(getHashPath());
  }

  function initRouter() {
    window.addEventListener('hashchange', onRouteChange);
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

    fetch('/api/sites')
      .then(function (r) {
        return r.json();
      })
      .then(function (sites) {
        window._mapSites = sites;
        afterSites();
      })
      .catch(function () {
        const err = document.getElementById('map-error');
        if (err) err.classList.remove('hidden');
      });
  }

  function getFilteredSites() {
    const sites = window._mapSites || [];
    const region = window._mapRegion || 'all';
    const q = (window._mapSearch || '').toLowerCase().trim();
    let out = sites;
    if (region !== 'all') {
      out = out.filter(function (s) {
        return s.region === region;
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
      m.bindPopup(
        '<strong>' +
          escapeHtml(site.name) +
          '</strong><br><span style="opacity:.8;font-size:12px">' +
          escapeHtml(site.region || '') +
          '</span>'
      );
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
          escapeHtml(site.region || '') +
          ' · ' +
          Number(site.lat).toFixed(2) +
          ', ' +
          Number(site.lng).toFixed(2) +
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
    if (search) {
      search.addEventListener('input', function () {
        window._mapSearch = search.value || '';
        applyMapFilters();
      });
    }
    document.querySelectorAll('.map-filter').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const r = btn.getAttribute('data-region') || 'all';
        window._mapRegion = r;
        document.querySelectorAll('.map-filter').forEach(function (b) {
          const on = (b.getAttribute('data-region') || 'all') === r;
          b.className =
            'map-filter px-3 py-1.5 rounded-full text-xs uppercase tracking-wider border ' +
            (on
              ? 'border-bronze-gold bg-bronze-gold/10 text-white'
              : 'border-white/20 text-gray-400 hover:border-bronze-gold/50');
        });
        applyMapFilters();
      });
    });
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
    const cards = document.querySelectorAll('[data-mp-card]');
    const empty = document.getElementById('mp-empty');
    const search = document.getElementById('mp-search');
    let cat = 'all';
    let q = '';

    function applyMp() {
      let n = 0;
      cards.forEach(function (card) {
        const c = card.getAttribute('data-category') || '';
        const title = (card.getAttribute('data-title') || '') + ' ' + (card.textContent || '');
        const okCat = cat === 'all' || c === cat;
        const okQ = !q || title.toLowerCase().indexOf(q) !== -1;
        const show = okCat && okQ;
        card.classList.toggle('hidden', !show);
        if (show) n++;
      });
      if (empty) empty.classList.toggle('hidden', n !== 0);
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
  }

  document.addEventListener('DOMContentLoaded', function () {
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
  });
})();
