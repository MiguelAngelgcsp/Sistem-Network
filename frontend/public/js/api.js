// ===== API Helper - Sistem Network =====
const API = 'http://localhost:3000/api';

function getToken() { return localStorage.getItem('sn_token'); }
function getUser() { return JSON.parse(localStorage.getItem('sn_user') || 'null'); }
function setSession(token, user) {
  localStorage.setItem('sn_token', token);
  localStorage.setItem('sn_user', JSON.stringify(user));
}
function clearSession() {
  localStorage.removeItem('sn_token');
  localStorage.removeItem('sn_user');
}
function isLoggedIn() { return !!getToken(); }
function hasRole(...roles) {
  const u = getUser();
  return u && roles.includes(u.rol);
}

async function apiFetch(endpoint, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(API + endpoint, { ...options, headers });
  const data = await res.json();

  if (res.status === 401) {
    clearSession();
    window.location.href = '/pages/login.html';
    return;
  }
  return { ok: res.ok, status: res.status, data };
}

function showAlert(elId, msg, type = 'danger') {
  const el = document.getElementById(elId);
  if (!el) return;
  el.className = `alert alert-${type} show`;
  el.textContent = msg;
  if (type === 'success') setTimeout(() => el.classList.remove('show'), 3500);
}

function renderNavbar(container) {
  const user = getUser();
  const isAdmin = user?.rol === 'administrador';
  const isEditor = user?.rol === 'editor';

  container.innerHTML = `
    <nav class="navbar">
      <a class="navbar-brand" href="/pages/noticias.html">📡 Sistem<span>Network</span></a>
      <div class="nav-links">
        <a href="/pages/noticias.html">Noticias</a>
        ${isAdmin ? `<a href="/pages/admin.html">Admin</a>` : ''}
        ${(isAdmin || isEditor) ? `<a href="/pages/editor.html">Panel Editor</a>` : ''}
        ${user ? `<a href="/pages/perfil.html">Perfil</a>` : ''}
      </div>
      <div class="nav-user">
        ${user ? `
          <span>${user.nombre}</span>
          <span class="badge-rol ${user.rol}">${user.rol}</span>
          <button class="btn btn-outline btn-sm" onclick="logout()">Salir</button>
        ` : `
          <a href="/pages/login.html" class="btn btn-primary btn-sm">Ingresar</a>
        `}
      </div>
    </nav>`;
}

function logout() {
  clearSession();
  window.location.href = '/pages/login.html';
}

function requireAuth(...roles) {
  if (!isLoggedIn()) { window.location.href = '/pages/login.html'; return false; }
  if (roles.length && !hasRole(...roles)) {
    alert('No tienes permisos para acceder a esta página.');
    window.location.href = '/pages/noticias.html';
    return false;
  }
  return true;
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });
}
