/**
 * Đăng nhập / phiên — đồng bộ với /api/auth (JWT trong sessionStorage)
 * Vai trò (theo baocao): guest (chưa đăng nhập) | member | artisan | admin
 */
(function () {
  'use strict';

  var TOKEN_KEY = 'vh_token';
  var USER_KEY = 'vh_user';

  function roleLabel(role) {
    var map = {
      member: 'Thành viên',
      artisan: 'Nghệ nhân',
      admin: 'Quản trị',
      guest: 'Khách'
    };
    return map[role] || role || 'Khách';
  }

  function getToken() {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  function getUser() {
    try {
      var raw = sessionStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function setSession(token, user) {
    sessionStorage.setItem(TOKEN_KEY, token);
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    window.dispatchEvent(new CustomEvent('vh-auth-change'));
  }

  function clearSession() {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    window.dispatchEvent(new CustomEvent('vh-auth-change'));
  }

  function isLoggedIn() {
    return !!getToken();
  }

  /** Quyền theo baocao.txt: Khách < Thành viên < Nghệ nhân < Admin */
  function canPurchase() {
    var u = getUser();
    if (!u) return false;
    return ['member', 'artisan', 'admin'].indexOf(u.role) !== -1;
  }

  function canUseAIFull() {
    var u = getUser();
    if (!u) return false;
    return ['member', 'artisan', 'admin'].indexOf(u.role) !== -1;
  }

  function canInteract() {
    return canPurchase();
  }

  function canManageShopOrEvents() {
    var u = getUser();
    if (!u) return false;
    return u.role === 'artisan' || u.role === 'admin';
  }

  function isAdmin() {
    var u = getUser();
    return u && u.role === 'admin';
  }

  function authHeaders() {
    var t = getToken();
    return t ? { Authorization: 'Bearer ' + t } : {};
  }

  function renderHeader() {
    var desktop = document.getElementById('auth-header-desktop');
    var mobileSlot = document.getElementById('auth-header-mobile');
    var u = getUser();
    var btnLoginClass =
      'inline-flex items-center justify-center rounded-full border-2 border-bronze-gold/90 bg-gradient-to-b from-bronze-gold/20 to-bronze-gold/5 px-5 py-2 text-xs font-bold uppercase tracking-[0.12em] text-bronze-gold shadow-[0_0_18px_rgba(197,160,89,0.22)] ring-1 ring-bronze-gold/20 hover:bg-bronze-gold hover:text-ink-black hover:ring-bronze-gold hover:shadow-[0_0_22px_rgba(197,160,89,0.4)] transition-all duration-300';
    var htmlGuest = '<a href="#/auth" class="' + btnLoginClass + '">Đăng nhập</a>';
    var htmlUser =
      '<div class="flex items-center gap-2 flex-wrap justify-end">' +
      '<span class="text-sm text-gray-300 max-w-[140px] truncate" title="' +
      escapeAttr(u.name) +
      '">' +
      escapeHtml(u.name) +
      '</span>' +
      '<span class="text-[10px] uppercase px-2.5 py-1 rounded-full border border-bronze-gold/50 bg-bronze-gold/10 text-bronze-gold">' +
      roleLabel(u.role) +
      '</span>' +
      '<button type="button" class="btn-logout rounded-full border border-white/20 px-3 py-1.5 text-xs uppercase tracking-wider text-gray-300 hover:border-bronze-gold/50 hover:text-bronze-gold hover:bg-white/5 transition-all">' +
      'Đăng xuất</button>' +
      '</div>';

    if (desktop) desktop.innerHTML = u ? htmlUser : htmlGuest;
    if (mobileSlot) mobileSlot.innerHTML = u ? htmlUser : htmlGuest;

    var guestActions = document.getElementById('guest-actions');
    if (guestActions) {
      guestActions.classList.toggle('hidden', !!u);
    }

    var navAdmin = document.getElementById('nav-admin');
    if (navAdmin) {
      navAdmin.classList.toggle('hidden', !isAdmin());
    }

    var cornerMobile = document.getElementById('auth-corner-mobile');
    if (cornerMobile) {
      if (u) {
        cornerMobile.innerHTML =
          '<span class="text-[11px] text-bronze-gold/90 max-w-[88px] truncate font-display" title="' +
          escapeAttr(u.name) +
          '">' +
          escapeHtml(u.name) +
          '</span>';
      } else {
        cornerMobile.innerHTML =
          '<a href="#/auth" class="inline-flex items-center justify-center rounded-full border-2 border-bronze-gold/90 bg-gradient-to-b from-bronze-gold/20 to-bronze-gold/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-bronze-gold shadow-[0_0_14px_rgba(197,160,89,0.2)] ring-1 ring-bronze-gold/15 hover:bg-bronze-gold hover:text-ink-black hover:ring-bronze-gold transition-all duration-300 whitespace-nowrap">Đăng nhập</a>';
      }
    }

    document.querySelectorAll('.btn-logout').forEach(function (b) {
      b.onclick = function () {
        clearSession();
        if (window.location.hash === '#/auth') {
          window.location.hash = '#/';
        }
      };
    });
  }

  function escapeHtml(s) {
    var d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  function escapeAttr(s) {
    return String(s).replace(/"/g, '&quot;');
  }

  function updateRoleBanners() {
    var u = getUser();
    var role = u ? u.role : 'guest';

    var aiBanner = document.getElementById('ai-role-banner');
    if (aiBanner) {
      if (role === 'guest') {
        aiBanner.classList.remove('hidden');
        aiBanner.innerHTML =
          '<p><strong>Khách (chưa đăng nhập):</strong> AI Art Lab ở chế độ giới hạn (watermark / demo). ' +
          '<a href="#/auth" class="text-bronze-gold underline">Đăng ký Thành viên</a> để dùng đủ tính năng.</p>';
      } else {
        aiBanner.classList.add('hidden');
      }
    }

    var commNote = document.getElementById('community-role-note');
    if (commNote) {
      if (!canInteract()) {
        commNote.classList.remove('hidden');
        commNote.textContent =
          'Khách chỉ xem nội dung. Like, bình luận và chat yêu cầu đăng nhập Thành viên trở lên.';
      } else {
        commNote.classList.add('hidden');
      }
    }

    var artisanNote = document.getElementById('artisan-panel');
    if (artisanNote) {
      artisanNote.classList.toggle('hidden', !canManageShopOrEvents());
    }

    var adminNote = document.getElementById('admin-panel');
    if (adminNote) {
      adminNote.classList.toggle('hidden', !isAdmin());
    }
  }

  function initAuthPage() {
    var tabLogin = document.getElementById('auth-tab-login');
    var tabReg = document.getElementById('auth-tab-register');
    var formLogin = document.getElementById('form-login');
    var formReg = document.getElementById('form-register');
    var msg = document.getElementById('auth-msg');

    function showMsg(text, isErr) {
      if (!msg) return;
      msg.textContent = text;
      msg.className = 'mt-4 text-sm ' + (isErr ? 'text-red-400' : 'text-jade-green');
    }

    var tabActiveClass =
      'flex-1 rounded-full py-2.5 text-sm uppercase tracking-widest transition-all duration-300 border border-bronze-gold/50 bg-bronze-gold/15 text-bronze-gold shadow-[0_0_14px_rgba(197,160,89,0.12)]';
    var tabIdleClass =
      'flex-1 rounded-full py-2.5 text-sm uppercase tracking-widest transition-all duration-300 border border-transparent text-gray-500 hover:text-gray-300 hover:bg-white/5';

    function activateTab(isLogin) {
      if (tabLogin && tabReg) {
        tabLogin.className = isLogin ? tabActiveClass : tabIdleClass;
        tabReg.className = !isLogin ? tabActiveClass : tabIdleClass;
      }
      if (formLogin) formLogin.classList.toggle('hidden', !isLogin);
      if (formReg) formReg.classList.toggle('hidden', isLogin);
    }

    if (tabLogin)
      tabLogin.addEventListener('click', function () {
        activateTab(true);
        showMsg('');
      });
    if (tabReg)
      tabReg.addEventListener('click', function () {
        activateTab(false);
        showMsg('');
      });

    if (formLogin) {
      formLogin.addEventListener('submit', function (e) {
        e.preventDefault();
        var email = (document.getElementById('login-email') || {}).value || '';
        var password = (document.getElementById('login-password') || {}).value || '';
        showMsg('Đang xử lý…', false);
        fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim(), password: password })
        })
          .then(function (r) {
            return r.json().then(function (data) {
              return { ok: r.ok, data: data };
            });
          })
          .then(function (res) {
            if (!res.ok) {
              showMsg(res.data.error || 'Đăng nhập thất bại', true);
              return;
            }
            setSession(res.data.token, res.data.user);
            showMsg('Đăng nhập thành công. Đang chuyển…', false);
            window.location.hash = '#/';
          })
          .catch(function () {
            showMsg('Lỗi mạng hoặc máy chủ.', true);
          });
      });
    }

    if (formReg) {
      formReg.addEventListener('submit', function (e) {
        e.preventDefault();
        var name = (document.getElementById('reg-name') || {}).value || '';
        var email = (document.getElementById('reg-email') || {}).value || '';
        var password = (document.getElementById('reg-password') || {}).value || '';
        showMsg('Đang tạo tài khoản…', false);
        fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            password: password
          })
        })
          .then(function (r) {
            return r.json().then(function (data) {
              return { ok: r.ok, data: data };
            });
          })
          .then(function (res) {
            if (!res.ok) {
              showMsg(res.data.error || 'Đăng ký thất bại', true);
              return;
            }
            setSession(res.data.token, res.data.user);
            showMsg('Đăng ký thành công. Vai trò: Thành viên.', false);
            window.location.hash = '#/';
          })
          .catch(function () {
            showMsg('Lỗi mạng hoặc máy chủ.', true);
          });
      });
    }

    activateTab(true);
  }

  async function refreshMe() {
    var t = getToken();
    if (!t) return null;
    try {
      var r = await fetch('/api/auth/me', { headers: { Authorization: 'Bearer ' + t } });
      if (!r.ok) {
        clearSession();
        return null;
      }
      var data = await r.json();
      if (data.user) {
        sessionStorage.setItem(USER_KEY, JSON.stringify(data.user));
        window.dispatchEvent(new CustomEvent('vh-auth-change'));
      }
      return data.user;
    } catch (e) {
      return null;
    }
  }

  window.VHAuth = {
    getToken: getToken,
    getUser: getUser,
    setSession: setSession,
    clearSession: clearSession,
    isLoggedIn: isLoggedIn,
    roleLabel: roleLabel,
    canPurchase: canPurchase,
    canUseAIFull: canUseAIFull,
    canInteract: canInteract,
    canManageShopOrEvents: canManageShopOrEvents,
    isAdmin: isAdmin,
    authHeaders: authHeaders,
    renderHeader: renderHeader,
    updateRoleBanners: updateRoleBanners,
    initAuthPage: initAuthPage,
    refreshMe: refreshMe
  };

  document.addEventListener('DOMContentLoaded', function () {
    initAuthPage();
    renderHeader();
    updateRoleBanners();
    window.addEventListener('vh-auth-change', function () {
      renderHeader();
      updateRoleBanners();
    });
    refreshMe();
  });
})();
