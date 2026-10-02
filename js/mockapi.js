/* ==========================================================================
   API giả lập của TireGuard Cloud — chạy hoàn toàn trong trình duyệt.

   Mục đích: cho ban giám khảo thấy hình dạng của API quản lý hạm đội và API
   dữ liệu mở trước khi có xe thật. Dữ liệu sinh từ một hạt giống cố định nên
   mỗi lần mở trang đều ra đúng mười hai xe như nhau. Không có máy chủ nào ở
   đây cả: mọi phản hồi đều gắn header "x-mock: true".

   Khi có hạ tầng thật, chỉ cần thay hàm request() bằng fetch() tới máy chủ —
   đường dẫn và hình dạng JSON giữ nguyên.
   ========================================================================== */

export const BASE = 'https://api.tireguard.example/v1';
export const FLEET_ID = 'fleet-demo';

// Thông số khay theo pitch deck: 250 cm³, ≈ 100 g bụi nén, thay mỗi 12.000–15.000 km
export const CART = { volumeCm3: 250, capacityG: 100, swapKmMin: 12000, swapKmMax: 15000 };
const KM_FULL = 13500;              // km để khay đầy ở mức thu gom trung bình
const WARN_FILL = 80, FULL_FILL = 95;

/* ---------- hạt giống cố định ---------- */
function mulberry32(a) {
  return () => {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
const rnd = mulberry32(20261002);
const pick = arr => arr[Math.floor(rnd() * arr.length)];
const round = (v, d = 0) => Math.round(v * 10 ** d) / 10 ** d;

/* ---------- trạm dịch vụ (giả lập, không phải địa điểm thật) ---------- */
export const CENTERS = [
  { id: 'sc-q7',  name: 'TireGuard Service · Quận 7',     lat: 10.7340, lng: 106.7210, bays: 3, mobile: true },
  { id: 'sc-td',  name: 'TireGuard Service · Thủ Đức',    lat: 10.8490, lng: 106.7720, bays: 2, mobile: true },
  { id: 'sc-tb',  name: 'Gara đối tác · Tân Bình',        lat: 10.8010, lng: 106.6520, bays: 2, mobile: false },
  { id: 'sc-bt',  name: 'Gara đối tác · Bình Thạnh',      lat: 10.8110, lng: 106.7090, bays: 1, mobile: false },
  { id: 'sc-q1',  name: 'Điểm đổi khay · Quận 1',         lat: 10.7760, lng: 106.7010, bays: 1, mobile: false },
];

const DISTRICTS = [
  { name: 'Quận 1',     lat: 10.7757, lng: 106.7004 },
  { name: 'Quận 3',     lat: 10.7843, lng: 106.6844 },
  { name: 'Quận 7',     lat: 10.7375, lng: 106.7302 },
  { name: 'Bình Thạnh', lat: 10.8106, lng: 106.7091 },
  { name: 'Thủ Đức',    lat: 10.8494, lng: 106.7537 },
  { name: 'Tân Bình',   lat: 10.8015, lng: 106.6526 },
  { name: 'Gò Vấp',     lat: 10.8387, lng: 106.6653 },
  { name: 'Phú Nhuận',  lat: 10.7991, lng: 106.6803 },
];

const MODELS = [
  { model: 'VinFast VF 8', tire: '245/45 R20' },
  { model: 'VinFast VF 6', tire: '215/55 R18' },
  { model: 'VinFast VF e34', tire: '215/60 R17' },
  { model: 'VinFast VF 5', tire: '185/55 R16' },
];

/* ---------- mười hai xe demo ----------
   Một vài xe được gán sẵn trạng thái để bảng luôn có đủ các loại cảnh báo. */
const NOW = Date.parse('2026-10-02T08:00:00+07:00');
const FORCE = { 2: 'full', 5: 'soon', 7: 'passive', 9: 'fault', 11: 'soon' };

function makeVehicle(i) {
  const m = i < 5 ? MODELS[0] : pick(MODELS);
  const d = pick(DISTRICTS);
  const force = FORCE[i];
  let base = 1500 + rnd() * 9000;                         // km kể từ lần thay
  if (force === 'full') base = 13600 + rnd() * 600;
  if (force === 'soon') base = 11400 + rnd() * 800;

  const wheels = ['RL', 'RR'].map(pos => {
    const km = Math.round(base + (rnd() - 0.5) * 300);
    const fill = Math.min(100, round(km / KM_FULL * 100 * (0.94 + rnd() * 0.1), 0));
    return {
      position: pos,
      cartridgeId: `CT-${(4100 + i * 7 + (pos === 'RL' ? 0 : 3)).toString(36).toUpperCase()}`,
      kmSinceSwap: km,
      fillPct: fill,
      massEstG: round(fill / 100 * CART.capacityG, 1),
      installedAt: new Date(NOW - km / 165 * 864e5).toISOString().slice(0, 10),
    };
  });

  const passive = force === 'passive';
  const fault = force === 'fault';
  const kmDay = Math.round(140 + rnd() * 90);              // xe dịch vụ chạy nhiều
  return {
    id: `TG-DEMO-${String(i + 1).padStart(2, '0')}`,
    model: m.model,
    tire: m.tire,
    district: d.name,
    location: { lat: round(d.lat + (rnd() - .5) * .02, 4), lng: round(d.lng + (rnd() - .5) * .02, 4) },
    odometerKm: Math.round(18000 + rnd() * 60000),
    kmPerDay: kmDay,
    wheels,
    telemetry: {
      mode: passive ? 'passive' : fault ? 'locked_out' : 'active',
      voltageKv: passive || fault ? 0 : round(3.6 + rnd() * 0.9, 1),
      powerW: passive || fault ? 0.15 : round(2.0 + rnd() * 0.7, 1),
      leakageMa: fault ? 2.6 : round(rnd() * 0.3, 2),
      floodEvents30d: passive ? 4 : Math.floor(rnd() * 3),
      lastFloodAt: passive ? new Date(NOW - 18 * 60e3).toISOString()
                 : new Date(NOW - (2 + rnd() * 20) * 864e5).toISOString(),
      lastSeenAt: new Date(NOW - Math.floor(rnd() * 9) * 60e3).toISOString(),
    },
  };
}

export const VEHICLES = Array.from({ length: 12 }, (_, i) => makeVehicle(i));

/* ---------- suy ra trạng thái và lịch bảo dưỡng ---------- */
export function statusOf(v) {
  const maxFill = Math.max(...v.wheels.map(w => w.fillPct));
  const maxKm = Math.max(...v.wheels.map(w => w.kmSinceSwap));
  if (v.telemetry.mode === 'locked_out') return 'fault';
  if (maxFill >= FULL_FILL) return 'full';
  if (v.telemetry.mode === 'passive') return 'passive';
  if (maxFill >= WARN_FILL || maxKm >= CART.swapKmMin) return 'soon';
  return 'ok';
}

export function maintenanceOf(v) {
  const maxKm = Math.max(...v.wheels.map(w => w.kmSinceSwap));
  const maxFill = Math.max(...v.wheels.map(w => w.fillPct));
  const kmLeftFill = Math.max(0, Math.round((FULL_FILL - maxFill) / 100 * KM_FULL));
  const kmLeftSched = Math.max(0, CART.swapKmMin - maxKm);
  const kmLeft = Math.min(kmLeftFill, kmLeftSched);
  const days = Math.floor(kmLeft / v.kmPerDay);
  const reasons = [];
  if (maxFill >= FULL_FILL) reasons.push('cartridge_full');
  else if (maxFill >= WARN_FILL) reasons.push('cartridge_near_full');
  if (maxKm >= CART.swapKmMin) reasons.push('swap_interval_reached');
  if (v.telemetry.mode === 'locked_out') reasons.push('leakage_fault');
  return {
    due: reasons.length > 0,
    reasons,
    kmRemaining: kmLeft,
    estDueDate: new Date(NOW + days * 864e5).toISOString().slice(0, 10),
    thresholds: { warnFillPct: WARN_FILL, fullFillPct: FULL_FILL, swapKm: [CART.swapKmMin, CART.swapKmMax], leakageMa: 2 },
  };
}

/* ---------- khoảng cách và trạm gần nhất ---------- */
function haversineKm(a, b) {
  const R = 6371, r = Math.PI / 180;
  const dLat = (b.lat - a.lat) * r, dLng = (b.lng - a.lng) * r;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function nearestCenters(loc, limit = 3) {
  return CENTERS
    .map(c => {
      const km = haversineKm(loc, c) * 1.3;               // đường đi thực ≈ 1,3 × chim bay
      return { ...c, distanceKm: round(km, 1), etaMin: Math.max(5, Math.round(km / 22 * 60 + (c.mobile ? 10 : 0))) };
    })
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, limit);
}

/* ---------- số liệu ESG demo ---------- */
export const ESG_METRICS = [
  { key: 'g_per_1000km', weight: 0.30, unit: 'g', target: 15, demo: 12.6 },
  { key: 'on_time_swap', weight: 0.20, unit: '%', target: 100, demo: 91 },
  { key: 'cartridge_return', weight: 0.20, unit: '%', target: 100, demo: 84 },
  { key: 'active_uptime', weight: 0.15, unit: '%', target: 100, demo: 93 },
  { key: 'lab_verified', weight: 0.15, unit: '/q', target: 1, demo: 0 },
];

export function gradeOf(score) {
  return score >= 85 ? 'A' : score >= 70 ? 'B' : score >= 55 ? 'C' : score >= 40 ? 'D' : 'E';
}

export function esgScore(values) {
  let s = 0;
  for (const m of ESG_METRICS) {
    const v = values[m.key];
    if (v == null) return null;
    s += Math.min(100, v / m.target * 100) * m.weight;
  }
  return round(s, 1);
}

export const DISTRICT_DEMO = [
  { district: 'Quận 1', vehicles: 14, kg: 4.1, km: 312000 },
  { district: 'Quận 3', vehicles: 11, kg: 3.0, km: 236000 },
  { district: 'Quận 7', vehicles: 19, kg: 5.8, km: 451000 },
  { district: 'Bình Thạnh', vehicles: 16, kg: 4.6, km: 368000 },
  { district: 'Thủ Đức', vehicles: 23, kg: 7.2, km: 566000 },
  { district: 'Tân Bình', vehicles: 12, kg: 3.4, km: 271000 },
  { district: 'Gò Vấp', vehicles: 6, kg: 1.6, km: 128000 },
];
export const K_ANON = 10;     // ô dưới 10 xe thì ẩn

/* ---------- định tuyến ---------- */
let ticketSeq = 1040;
let consentLevel = 0;

function summary(v) {
  return {
    id: v.id, model: v.model, district: v.district, status: statusOf(v),
    cartridges: v.wheels.map(w => ({ position: w.position, fillPct: w.fillPct })),
    kmToService: maintenanceOf(v).kmRemaining,
    lastSeenAt: v.telemetry.lastSeenAt,
  };
}

const ROUTES = [
  ['GET', /^\/fleets\/([\w-]+)\/vehicles$/, (m) =>
    m[1] !== FLEET_ID ? [404, { error: 'fleet_not_found' }]
      : [200, { fleetId: FLEET_ID, count: VEHICLES.length, data: VEHICLES.map(summary) }]],

  ['GET', /^\/vehicles\/([\w-]+)$/, (m, v) => [200, { ...v, status: statusOf(v) }]],

  ['GET', /^\/vehicles\/([\w-]+)\/cartridges$/, (m, v) => [200, {
    vehicleId: v.id, spec: CART, data: v.wheels,
  }]],

  ['GET', /^\/vehicles\/([\w-]+)\/maintenance$/, (m, v) => [200, { vehicleId: v.id, ...maintenanceOf(v) }]],

  ['GET', /^\/service-centers\/nearest$/, (m, _v, q) => {
    const lat = parseFloat(q.get('lat')), lng = parseFloat(q.get('lng'));
    if (!isFinite(lat) || !isFinite(lng)) return [400, { error: 'lat_lng_required' }];
    return [200, { data: nearestCenters({ lat, lng }, parseInt(q.get('limit') || '3', 10)) }];
  }],

  ['POST', /^\/vehicles\/([\w-]+)\/service-requests$/, (m, v, _q, body) => {
    const type = body?.type || 'cartridge_swap';
    const center = CENTERS.find(c => c.id === body?.centerId) || nearestCenters(v.location, 1)[0];
    const near = nearestCenters(v.location, 5).find(c => c.id === center.id);
    return [201, {
      id: `SR-${++ticketSeq}`,
      vehicleId: v.id,
      type,
      status: type === 'roadside' ? 'dispatched' : 'scheduled',
      center: { id: center.id, name: center.name },
      etaMin: type === 'roadside' ? near.etaMin : null,
      slot: type === 'roadside' ? null : maintenanceOf(v).estDueDate,
      createdAt: new Date(NOW).toISOString(),
    }];
  }],

  ['GET', /^\/open-data\/esg\/fleets\/([\w-]+)$/, (m, _v, q) => {
    const demo = q.get('demo') === 'true';
    const values = Object.fromEntries(ESG_METRICS.map(x => [x.key, demo ? x.demo : null]));
    const score = esgScore(values);
    return [200, {
      fleetId: m[1], period: '2026-09', dataStatus: demo ? 'demo' : 'awaiting_pilot',
      metrics: values, score, grade: score == null ? null : gradeOf(score),
      sixPpdRetainedMg: null, sixPpdNote: 'requires Py-GC/MS lab analysis (ISO/IEC 17025)',
    }];
  }],

  ['GET', /^\/open-data\/districts$/, (m, _v, q) => {
    const demo = q.get('demo') === 'true';
    return [200, {
      city: 'TP.HCM', month: q.get('month') || '2026-09', license: 'CC-BY-4.0', kAnonymity: K_ANON,
      data: demo
        ? DISTRICT_DEMO.map(d => d.vehicles < K_ANON ? { district: d.district, suppressed: true } : d)
        : [],
    }];
  }],

  ['POST', /^\/consents$/, (m, _v, _q, body) => {
    const level = Number(body?.level);
    if (![0, 1, 2].includes(level)) return [422, { error: 'level_must_be_0_1_2' }];
    consentLevel = level;
    return [200, {
      fleetId: body.fleetId || FLEET_ID, level,
      sharedWith: [['fleet'], ['fleet', 'research'], ['fleet', 'research', 'regulator', 'public']][level],
      revocable: true, effectiveAt: new Date(NOW).toISOString(),
    }];
  }],
];

/**
 * Giả lập một lời gọi HTTP. Trả về { status, ms, headers, body }.
 * path có thể kèm query, ví dụ '/service-centers/nearest?lat=10.7&lng=106.7'.
 */
export function request(method, path, body) {
  const [p, qs] = path.split('?');
  const q = new URLSearchParams(qs || '');
  const ms = Math.round(90 + Math.random() * 240);

  let status = 404, out = { error: 'not_found' };
  for (const [mth, re, fn] of ROUTES) {
    const m = p.match(re);
    if (!m || mth !== method) continue;
    const needsVehicle = p.startsWith('/vehicles/');
    const v = needsVehicle ? VEHICLES.find(x => x.id === m[1]) : null;
    if (needsVehicle && !v) { status = 404; out = { error: 'vehicle_not_found' }; break; }
    [status, out] = fn(m, v, q, body);
    break;
  }
  const res = {
    status, ms,
    headers: { 'content-type': 'application/json', 'x-mock': 'true', 'x-request-id': Math.random().toString(16).slice(2, 10) },
    body: out,
  };
  return new Promise(r => setTimeout(() => r(res), ms));
}

export function getConsentLevel() { return consentLevel; }

/* ---------- danh mục endpoint cho bảng điều khiển API ---------- */
export const ENDPOINTS = [
  { m: 'GET',  p: `/fleets/${FLEET_ID}/vehicles`, d: 'ep.list' },
  { m: 'GET',  p: '/vehicles/TG-DEMO-03', d: 'ep.vehicle' },
  { m: 'GET',  p: '/vehicles/TG-DEMO-03/cartridges', d: 'ep.cart' },
  { m: 'GET',  p: '/vehicles/TG-DEMO-03/maintenance', d: 'ep.maint' },
  { m: 'GET',  p: '/service-centers/nearest?lat=10.7769&lng=106.7009&limit=3', d: 'ep.nearest' },
  { m: 'POST', p: '/vehicles/TG-DEMO-03/service-requests', d: 'ep.sr', body: { type: 'roadside', reason: 'cartridge_full' } },
  { m: 'GET',  p: `/open-data/esg/fleets/${FLEET_ID}?demo=true`, d: 'ep.esg' },
  { m: 'GET',  p: '/open-data/districts?month=2026-09&demo=true', d: 'ep.districts' },
  { m: 'POST', p: '/consents', d: 'ep.consent', body: { fleetId: FLEET_ID, level: 1 } },
];

export const WEBHOOKS = [
  { e: 'cartridge.threshold_reached', d: 'wh.0', sample: { vehicleId: 'TG-DEMO-06', position: 'RR', fillPct: 83, threshold: 80 } },
  { e: 'cartridge.full',              d: 'wh.1', sample: { vehicleId: 'TG-DEMO-03', position: 'RL', fillPct: 97 } },
  { e: 'maintenance.due',             d: 'wh.2', sample: { vehicleId: 'TG-DEMO-12', reasons: ['swap_interval_reached'], kmRemaining: 0 } },
  { e: 'flood.shutdown',              d: 'wh.3', sample: { vehicleId: 'TG-DEMO-08', cutMs: 1.6, dischargeMs: 4.1, mode: 'passive' } },
  { e: 'flood.recovered',             d: 'wh.4', sample: { vehicleId: 'TG-DEMO-08', dryHoldS: 2.5, rampMs: 800, leakageMa: 0.4 } },
  { e: 'leakage.fault',               d: 'wh.5', sample: { vehicleId: 'TG-DEMO-10', leakageMa: 2.6, retries: 3, mode: 'locked_out' } },
];
