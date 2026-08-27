import * as THREE from 'three';
import { t, setLang, getLang, initLang } from './i18n.js';
import { reducedMotion } from './config.js';

const $ = id => document.getElementById(id);

/* ==========================================================================
   Tab nội dung. Panel 3D luôn nằm sẵn trong DOM, chỉ ẩn hiện — dựng lại cảnh
   mỗi lần đổi tab thì mất vài giây và mất luôn góc nhìn người dùng đang đặt.
   ========================================================================== */
export function createTabs(onShow) {
  const tabs = [...document.querySelectorAll('.tab')];
  const panels = new Map(tabs.map(t => [t.dataset.panel, $(t.dataset.panel)]));

  function show(id) {
    tabs.forEach(t => t.setAttribute('aria-selected', String(t.dataset.panel === id)));
    panels.forEach((el, key) => {
      if (!el) return;
      const on = key === id;
      el.classList.toggle('active', on);
      el.hidden = !on;
      if (on) el.scrollTop = 0;
    });
    try { localStorage.setItem('tg-tab', id); } catch (_) { /* chế độ riêng tư */ }
    onShow && onShow(id);
  }

  tabs.forEach(t => t.addEventListener('click', () => show(t.dataset.panel)));

  // điều hướng bàn phím giữa các tab
  document.querySelector('.tabs')?.addEventListener('keydown', e => {
    const i = tabs.indexOf(document.activeElement);
    if (i < 0) return;
    const next = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : -1;
    if (next < 0 || next >= tabs.length) return;
    e.preventDefault();
    tabs[next].focus();
    show(tabs[next].dataset.panel);
  });

  let saved = null;
  try { saved = localStorage.getItem('tg-tab'); } catch (_) { /* bỏ qua */ }
  show(panels.has(saved) ? saved : 'p3d');

  return { show };
}

export function createUI({ onFieldToggle, onReset, onViewChange }) {
  const S = {
    field: true,
    flood: false,       // người dùng bật tay
    labels: true,
    spin: !reducedMotion,
  };

  const statusEl = $('status');
  let statusKey = 'hud.on';

  function paintStatus() {
    statusEl.innerHTML = t(statusKey);
    statusEl.classList.toggle('cut', statusKey !== 'hud.on');
  }

  /** kind: 'on' | 'off' | 'cut' */
  function setStatus(kind) {
    const key = kind === 'cut' ? 'hud.cut' : kind === 'off' ? 'hud.off' : 'hud.on';
    if (key === statusKey) return;
    statusKey = key;
    paintStatus();
  }

  function bindToggle(btn, key, after) {
    btn.addEventListener('click', () => {
      S[key] = !S[key];
      btn.classList.toggle('on', S[key]);
      btn.setAttribute('aria-pressed', String(S[key]));
      after && after();
    });
    btn.setAttribute('aria-pressed', String(S[key]));
  }

  bindToggle($('bField'), 'field', () => {
    setStatus(S.field ? 'on' : 'off');
    onFieldToggle && onFieldToggle();
  });
  bindToggle($('bFlood'), 'flood');
  bindToggle($('bLabels'), 'labels');
  bindToggle($('bSpin'), 'spin');
  $('bSpin').classList.toggle('on', S.spin);
  $('bReset').addEventListener('click', () => onReset && onReset());

  /* ---------- nút chuyển Tổng thể ↔ Tách khối ---------- */
  const captionEl = $('viewCaption');
  const viewBtns = { overview: $('bOverview'), exploded: $('bExploded') };
  let view = 'overview';

  function paintCaption() {
    if (captionEl) captionEl.innerHTML = t(view === 'exploded' ? 'view.capExploded' : 'view.capOverview');
  }

  function setView(next) {
    if (next === view) return;
    view = next;
    Object.entries(viewBtns).forEach(([k, b]) => {
      if (!b) return;
      b.classList.toggle('on', k === view);
      b.setAttribute('aria-pressed', String(k === view));
    });
    paintCaption();
    onViewChange && onViewChange(view);
  }

  Object.entries(viewBtns).forEach(([k, b]) => b && b.addEventListener('click', () => setView(k)));

  /* ---------- HUD ---------- */
  const effEl = $('eff'), barEl = $('effbar'), capEl = $('cap'), escEl = $('esc'), voltEl = $('volt');
  let hudClock = 0;

  function updateHUD(dt, stats, live, time) {
    hudClock += dt;
    if (hudClock < 0.25) return;
    hudClock = 0;

    const locale = getLang() === 'en' ? 'en-US' : 'vi-VN';
    const total = stats.captured + stats.escaped;
    // chờ đủ mẫu rồi mới hiện, nếu không vài giây đầu con số còn đang hội tụ
    // và người xem đọc phải một tỷ lệ thấp không đại diện cho gì cả
    const eff = total > 400 ? Math.round(stats.captured / total * 100) : 0;
    effEl.textContent = eff;
    barEl.style.width = eff + '%';
    capEl.textContent = stats.captured.toLocaleString(locale);
    escEl.textContent = stats.escaped.toLocaleString(locale);
    voltEl.textContent = live
      ? (3.8 + Math.sin(time * 3) * 0.4).toFixed(1).replace('.', getLang() === 'en' ? '.' : ',') + ' kV'
      : (getLang() === 'en' ? '0.0 kV' : '0,0 kV');
  }

  /* ---------- ngôn ngữ ---------- */
  initLang();
  paintStatus();
  paintCaption();
  $('bLang').addEventListener('click', () => setLang(getLang() === 'en' ? 'vi' : 'en'));
  document.addEventListener('langchange', () => { paintStatus(); paintCaption(); });

  /* ---------- hiện dần khi cuộn tới ---------- */
  const io = new IntersectionObserver(
    es => es.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); }),
    { threshold: .12 }
  );
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  /* ---------- gợi ý zoom ----------
     Người xem không tự đoán được là cuộn chuột sẽ mở thiết bị ra, nên phải nói.
     Nói xong thì thôi: chỉ báo mờ đi ngay khi họ bắt đầu zoom. */
  const hintEl = $('zoomHint');
  let hintDone = false;
  function setZoomHint(zoom) {
    if (!hintEl) return;
    if (zoom > 0.05 && !hintDone) { hintDone = true; hintEl.classList.add('gone'); }
    hintEl.style.setProperty('--zoom', zoom.toFixed(2));
  }

  return { state: S, setStatus, updateHUD, setZoomHint, setView };
}

/* ==========================================================================
   Nhãn kích thước neo vào toạ độ 3D rồi chiếu ngược ra màn hình.
   ========================================================================== */
/**
 * points: [{ p: Vector3, offset: chỉ số lớp bung tách, minZoom, minExplode }]
 * Nhãn chỉ hiện khi đã bung tách đủ, hoặc khi người dùng zoom đủ sâu — đó là
 * cơ chế "kéo vào thì chi tiết hiện ra".
 */
export function createHotspots(points) {
  const items = points.map((cfg, i) => ({ el: $('hs' + i), ...cfg }));
  const v = new THREE.Vector3();

  function update(camera, canvas, { labels, explode, zoom, offsets }) {
    items.forEach(h => {
      if (!h.el) return;
      const gate = explode >= (h.minExplode ?? 0.25) || zoom >= (h.minZoom ?? 99);
      if (!labels || !gate) { h.el.classList.remove('on'); return; }

      v.copy(h.p);
      const off = offsets && h.offset != null ? offsets[h.offset] : null;
      if (off) v.add(off);
      v.project(camera);

      const on = v.z < 1 && Math.abs(v.x) < 1.05 && Math.abs(v.y) < 1.05;
      h.el.classList.toggle('on', on);
      if (on) {
        h.el.style.left = ((v.x * 0.5 + 0.5) * canvas.clientWidth) + 'px';
        h.el.style.top  = ((-v.y * 0.5 + 0.5) * canvas.clientHeight) + 'px';
      }
    });
  }

  return { update };
}

/* ==========================================================================
   Màn hình chờ — nối vào tiến độ thật, không phải hẹn giờ cố định.
   ========================================================================== */
export function createLoader() {
  const box = $('loading'), bar = $('lbar');
  let done = false;
  return {
    set(p) { if (!done) bar.style.width = Math.round(p * 100) + '%'; },
    finish() {
      if (done) return;
      done = true;
      bar.style.width = '100%';
      box.classList.add('gone');
      setTimeout(() => box.remove(), 700);
    },
  };
}
