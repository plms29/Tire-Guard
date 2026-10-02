/* ==========================================================================
   Phần nội dung tương tác ngoài cảnh 3D: biểu đồ hiệu suất, máy tính chi phí,
   bảng điều khiển hạm đội, bảng điều khiển API và dữ liệu mở ESG.

   Chạy độc lập với main.js, nên vẫn dùng được trên máy không có WebGL.
   Mọi chuỗi sinh lúc chạy nằm trong L bên dưới; chuỗi tĩnh nằm trong HTML
   (tiếng Việt) và i18n.js (tiếng Anh).
   ========================================================================== */
import { getLang } from './i18n.js';
import {
  BASE, FLEET_ID, CART, VEHICLES, statusOf, maintenanceOf, request,
  ENDPOINTS, WEBHOOKS, ESG_METRICS, esgScore, gradeOf, DISTRICT_DEMO, K_ANON,
} from './mockapi.js';

const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const L = {
  vi: {
    'st.ok': 'Bình thường', 'st.soon': 'Sắp đầy', 'st.full': 'Đầy', 'st.passive': 'Bẫy thụ động', 'st.fault': 'Lỗi dòng rò',
    'k.vehicles': 'Xe đang theo dõi', 'k.soon': 'Khay sắp đầy', 'k.full': 'Cần thay ngay', 'k.flood': 'Đang bẫy thụ động',
    'k.fault': 'Lỗi cần kỹ thuật viên', 'k.mass': 'Bụi trong khay (ước tính)',
    'th.id': 'Xe', 'th.model': 'Mẫu xe', 'th.rl': 'Khay sau trái', 'th.rr': 'Khay sau phải', 'th.km': 'Còn tới hạn thay', 'th.status': 'Trạng thái', 'th.act': '',
    'act.open': 'Chi tiết', 'km': 'km',
    'd.close': 'Đóng', 'd.wheel': 'Khay', 'd.since': 'km kể từ lần thay', 'd.mass': 'bụi ước tính', 'd.installed': 'lắp ngày',
    'd.tel': 'Cảm biến', 'd.mode': 'Chế độ', 'd.volt': 'Điện áp', 'd.pow': 'Công suất', 'd.leak': 'Dòng rò', 'd.flood': 'Sự kiện ngập 30 ngày',
    'd.lastflood': 'Ngập gần nhất', 'd.seen': 'Tín hiệu gần nhất', 'd.loc': 'Khu vực',
    'mode.active': 'Chủ động · tĩnh điện', 'mode.passive': 'Thụ động · đã ngắt cao áp', 'mode.locked_out': 'Khóa cao áp',
    'd.maint': 'Bảo dưỡng', 'd.due': 'Tới hạn', 'd.notdue': 'Chưa tới hạn', 'd.kmleft': 'Còn', 'd.date': 'Dự kiến',
    'r.cartridge_full': 'khay đầy', 'r.cartridge_near_full': 'khay sắp đầy', 'r.swap_interval_reached': 'đủ 12.000 km', 'r.leakage_fault': 'lỗi dòng rò',
    'd.book': 'Đặt lịch thay khay', 'd.road': 'Không thay được trên đường — tìm trạm gần nhất',
    'd.near': 'Trạm gần nhất', 'd.send': 'Gửi yêu cầu hỗ trợ', 'd.mobile': 'có xe lưu động', 'd.eta': 'tới trong khoảng',
    'd.min': 'phút', 'd.ticket': 'Đã tạo yêu cầu', 'd.sched': 'Đã đặt lịch tại', 'd.disp': 'Đã điều phối', 'd.hotline': 'Tổng đài: đang để trống, cập nhật khi thí điểm',
    'd.log': 'Lời gọi API',
    'ago.m': 'phút trước', 'ago.d': 'ngày trước',
    'ep.list': 'Danh sách xe và trạng thái khay', 'ep.vehicle': 'Chi tiết một xe, kèm cảm biến', 'ep.cart': 'Độ đầy từng khay',
    'ep.maint': 'Tới hạn bảo dưỡng chưa', 'ep.nearest': 'Trạm dịch vụ gần nhất', 'ep.sr': 'Gọi hỗ trợ / đặt lịch thay khay',
    'ep.esg': 'Bảng điểm ESG của hạm đội', 'ep.districts': 'Số liệu tổng hợp theo quận', 'ep.consent': 'Ghi nhận mức đồng ý chia sẻ',
    'api.send': 'Gửi', 'api.wait': 'đang gửi…', 'api.hint': '← Chọn một endpoint để gửi thử',
    'wh.ev': 'Sự kiện', 'wh.when': 'Khi nào', 'wh.payload': 'Dữ liệu mẫu',
    'wh.0': 'Một khay vượt 80%', 'wh.1': 'Một khay vượt 95%', 'wh.2': 'Đủ 12.000 km hoặc khay gần đầy',
    'wh.3': 'Phát hiện nước, đã ngắt cao áp và xả điện', 'wh.4': 'Đã ráo, khởi động mềm xong', 'wh.5': 'Dòng rò > 2 mA lặp lại, khóa cao áp',
    'c.lv0': 'Chỉ hạm đội', 'c.lv0d': 'Dữ liệu chỉ nằm trong tài khoản hạm đội. Không chia sẻ ra ngoài.',
    'c.lv1': 'Thêm viện nghiên cứu', 'c.lv1d': 'Viện nghiên cứu nhận số liệu ẩn danh, tổng hợp theo tháng để đánh giá và xếp hạng ESG.',
    'c.lv2': 'Công khai & cơ quan quản lý', 'c.lv2d': 'Số liệu tổng hợp theo quận được công khai và gửi cơ quan quản lý môi trường.',
    'c.field': 'Dữ liệu', 'c.fleet': 'Hạm đội', 'c.research': 'Viện nghiên cứu', 'c.reg': 'Cơ quan quản lý', 'c.public': 'Công khai',
    'c.f0': 'Độ đầy khay từng xe', 'c.f1': 'Biển số, VIN, vị trí GPS', 'c.f2': 'Tổng bụi thu gom theo tháng (ẩn danh)',
    'c.f3': 'Hạng ESG của hạm đội', 'c.f4': 'Số liệu theo quận (≥ 10 xe mỗi ô)', 'c.f5': 'Sự kiện ngập theo quận',
    'c.saved': 'API đã ghi nhận', 'c.current': 'Đang chọn',
    'e.m.g_per_1000km': 'Bụi thu gom trên 1.000 km', 'e.m.on_time_swap': 'Thay khay đúng hạn', 'e.m.cartridge_return': 'Thu hồi khay đã dùng',
    'e.m.active_uptime': 'Thời gian bẫy chủ động', 'e.m.lab_verified': 'Mẫu kiểm định Py-GC/MS mỗi quý',
    'e.h.metric': 'Chỉ số', 'e.h.weight': 'Trọng số', 'e.h.target': 'Mức đạt 100 điểm', 'e.h.why': 'Vì sao',
    'e.w.g_per_1000km': 'Đo trực tiếp hiệu quả thu gom', 'e.w.on_time_swap': 'Khay đầy thì hết thu gom',
    'e.w.cartridge_return': 'Bụi không quay lại môi trường', 'e.w.active_uptime': 'Thụ động chỉ còn ≈ 40%', 'e.w.lab_verified': 'Chống greenwashing',
    'e.score': 'Điểm ESG', 'e.grade': 'Hạng', 'e.unrated': 'Chưa xếp hạng', 'e.wait': 'Chờ dữ liệu thí điểm',
    'e.total': 'Tổng bụi thu gom', 'e.km': 'Quãng đường giám sát', 'e.veh': 'Xe tham gia', 'e.floods': 'Lần ngắt khi ngập đã xử lý',
    'e.ppd': '6PPD giữ lại', 'e.ppdn': 'cần phân tích Py-GC/MS', 'e.demoTag': 'SỐ LIỆU DEMO',
    'e.d.district': 'Quận', 'e.d.veh': 'Số xe', 'e.d.kg': 'Bụi thu gom (kg)', 'e.d.km': 'Km giám sát', 'e.d.gkm': 'g / 1.000 km',
    'e.d.hidden': 'ẩn (< 10 xe)', 'e.d.empty': 'Đang để trống — sẽ điền khi có dữ liệu thí điểm',
    'ch.active': 'TireGuard chủ động', 'ch.passive': 'TireGuard thụ động / mưa', 'ch.comp': 'Đối chứng (CN115320726B)',
    'ch.x': 'Tốc độ xe (km/h)', 'ch.y': 'Hiệu suất thu gom (%)', 'ch.band': 'Dải mục tiêu 60–75%', 'ch.speed': 'Tốc độ',
    'cal.hw': 'Phần cứng ban đầu', 'cal.cart': 'Khay thay mỗi năm', 'cal.cartcost': 'Chi phí khay mỗi năm', 'cal.three': 'Tổng 3 năm',
    'cal.cap': 'Sức chứa bụi tối đa mỗi năm', 'cal.capn': 'dung lượng khay, không phải khối lượng đo được', 'cal.pcs': 'khay',
  },
  en: {
    'st.ok': 'Normal', 'st.soon': 'Nearly full', 'st.full': 'Full', 'st.passive': 'Passive trap', 'st.fault': 'Leakage fault',
    'k.vehicles': 'Vehicles tracked', 'k.soon': 'Nearly full', 'k.full': 'Swap now', 'k.flood': 'In passive mode',
    'k.fault': 'Need a technician', 'k.mass': 'Dust in cartridges (est.)',
    'th.id': 'Vehicle', 'th.model': 'Model', 'th.rl': 'Rear-left cartridge', 'th.rr': 'Rear-right cartridge', 'th.km': 'To next swap', 'th.status': 'Status', 'th.act': '',
    'act.open': 'Details', 'km': 'km',
    'd.close': 'Close', 'd.wheel': 'Cartridge', 'd.since': 'km since swap', 'd.mass': 'dust (est.)', 'd.installed': 'fitted',
    'd.tel': 'Sensors', 'd.mode': 'Mode', 'd.volt': 'Voltage', 'd.pow': 'Power', 'd.leak': 'Leakage', 'd.flood': 'Flood events, 30 days',
    'd.lastflood': 'Last flood', 'd.seen': 'Last seen', 'd.loc': 'Area',
    'mode.active': 'Active · electrostatic', 'mode.passive': 'Passive · HV cut', 'mode.locked_out': 'HV locked out',
    'd.maint': 'Maintenance', 'd.due': 'Due', 'd.notdue': 'Not due', 'd.kmleft': 'Remaining', 'd.date': 'Expected',
    'r.cartridge_full': 'cartridge full', 'r.cartridge_near_full': 'cartridge nearly full', 'r.swap_interval_reached': '12,000 km reached', 'r.leakage_fault': 'leakage fault',
    'd.book': 'Book a cartridge swap', 'd.road': 'Can’t swap on the road — find the nearest centre',
    'd.near': 'Nearest centres', 'd.send': 'Request help', 'd.mobile': 'mobile van', 'd.eta': 'arrives in about',
    'd.min': 'min', 'd.ticket': 'Request created', 'd.sched': 'Booked at', 'd.disp': 'Dispatched', 'd.hotline': 'Hotline: left blank until the pilot',
    'd.log': 'API calls',
    'ago.m': 'min ago', 'ago.d': 'days ago',
    'ep.list': 'Vehicles and cartridge status', 'ep.vehicle': 'One vehicle, with sensors', 'ep.cart': 'Fill level per cartridge',
    'ep.maint': 'Is maintenance due', 'ep.nearest': 'Nearest service centres', 'ep.sr': 'Call for help / book a swap',
    'ep.esg': 'Fleet ESG scorecard', 'ep.districts': 'District-level aggregates', 'ep.consent': 'Record a data-sharing consent level',
    'api.send': 'Send', 'api.wait': 'sending…', 'api.hint': '← Pick an endpoint to try it',
    'wh.ev': 'Event', 'wh.when': 'When', 'wh.payload': 'Sample payload',
    'wh.0': 'A cartridge passes 80%', 'wh.1': 'A cartridge passes 95%', 'wh.2': '12,000 km reached or cartridge nearly full',
    'wh.3': 'Water detected, HV cut and discharged', 'wh.4': 'Dry again, soft-start complete', 'wh.5': 'Repeated leakage > 2 mA, HV locked out',
    'c.lv0': 'Fleet only', 'c.lv0d': 'Data stays in the fleet’s account. Nothing is shared outside.',
    'c.lv1': 'Add research institutes', 'c.lv1d': 'Research institutes receive anonymised monthly aggregates to assess and rate ESG performance.',
    'c.lv2': 'Public & regulators', 'c.lv2d': 'District-level aggregates are published openly and sent to environmental regulators.',
    'c.field': 'Data', 'c.fleet': 'Fleet', 'c.research': 'Researchers', 'c.reg': 'Regulators', 'c.public': 'Public',
    'c.f0': 'Per-vehicle cartridge fill', 'c.f1': 'Plate, VIN, GPS location', 'c.f2': 'Monthly dust collected (anonymised)',
    'c.f3': 'Fleet ESG grade', 'c.f4': 'District figures (≥ 10 vehicles per cell)', 'c.f5': 'Flood events by district',
    'c.saved': 'Recorded by the API', 'c.current': 'Selected',
    'e.m.g_per_1000km': 'Dust collected per 1,000 km', 'e.m.on_time_swap': 'Cartridges swapped on time', 'e.m.cartridge_return': 'Used cartridges returned',
    'e.m.active_uptime': 'Time in active mode', 'e.m.lab_verified': 'Py-GC/MS samples per quarter',
    'e.h.metric': 'Metric', 'e.h.weight': 'Weight', 'e.h.target': 'Full marks at', 'e.h.why': 'Why it matters',
    'e.w.g_per_1000km': 'Direct measure of capture', 'e.w.on_time_swap': 'A full cartridge stops collecting',
    'e.w.cartridge_return': 'Dust does not go back into the environment', 'e.w.active_uptime': 'Passive mode only reaches ≈ 40%', 'e.w.lab_verified': 'Guards against greenwashing',
    'e.score': 'ESG score', 'e.grade': 'Grade', 'e.unrated': 'Not yet rated', 'e.wait': 'Awaiting pilot data',
    'e.total': 'Total dust collected', 'e.km': 'Distance monitored', 'e.veh': 'Vehicles enrolled', 'e.floods': 'Flood cut-offs handled',
    'e.ppd': '6PPD retained', 'e.ppdn': 'needs Py-GC/MS analysis', 'e.demoTag': 'DEMO DATA',
    'e.d.district': 'District', 'e.d.veh': 'Vehicles', 'e.d.kg': 'Dust collected (kg)', 'e.d.km': 'Km monitored', 'e.d.gkm': 'g / 1,000 km',
    'e.d.hidden': 'hidden (< 10 vehicles)', 'e.d.empty': 'Left blank — filled in once pilot data exists',
    'ch.active': 'TireGuard active', 'ch.passive': 'TireGuard passive / rain', 'ch.comp': 'Benchmark (CN115320726B)',
    'ch.x': 'Vehicle speed (km/h)', 'ch.y': 'Capture efficiency (%)', 'ch.band': 'Target band 60–75%', 'ch.speed': 'Speed',
    'cal.hw': 'Up-front hardware', 'cal.cart': 'Cartridges per year', 'cal.cartcost': 'Cartridge cost per year', 'cal.three': '3-year total',
    'cal.cap': 'Max dust capacity per year', 'cal.capn': 'cartridge capacity, not measured mass', 'cal.pcs': 'cartridges',
  },
};
const tr = k => (L[getLang()] || L.vi)[k] ?? L.vi[k] ?? k;
const loc = () => getLang() === 'en' ? 'en-US' : 'vi-VN';
const num = (v, d = 0) => Number(v).toLocaleString(loc(), { minimumFractionDigits: d, maximumFractionDigits: d });

const ICON = { ok: '●', soon: '▲', full: '■', passive: '◆', fault: '✕' };
const CLS  = { ok: 'st-ok', soon: 'st-warn', full: 'st-crit', passive: 'st-info', fault: 'st-crit' };
const chip = s => `<span class="st ${CLS[s]}"><i aria-hidden="true">${ICON[s]}</i>${tr('st.' + s)}</span>`;

function fillBar(pct) {
  const lvl = pct >= 95 ? 'crit' : pct >= 80 ? 'warn' : 'ok';
  return `<span class="fill"><span class="fill-track"><i class="fill-${lvl}" style="width:${pct}%"></i></span><b>${pct}%</b></span>`;
}

function ago(iso) {
  const min = Math.max(0, Math.round((Date.parse('2026-10-02T08:00:00+07:00') - Date.parse(iso)) / 60e3));
  return min < 120 ? `${num(min)} ${tr('ago.m')}` : `${num(Math.round(min / 1440))} ${tr('ago.d')}`;
}

function jsonHTML(obj) {
  const s = JSON.stringify(obj, null, 2);
  return esc(s)
    .replace(/(&quot;[^&]*?&quot;)(\s*:)/g, '<span class="jk">$1</span>$2')
    .replace(/:\s(&quot;.*?&quot;)/g, ': <span class="js">$1</span>')
    .replace(/:\s(-?\d[\d.]*|true|false|null)/g, ': <span class="jn">$1</span>');
}

/* ==========================================================================
   1 · HẠM ĐỘI
   ========================================================================== */
let fleetFilter = 'all';
let openVehicle = null;
const drawerLog = new Map();         // id xe → các lời gọi API đã thực hiện
const drawerExtra = new Map();       // id xe → HTML kết quả (trạm gần nhất, phiếu)

function renderKpis() {
  const st = VEHICLES.map(statusOf);
  const count = s => st.filter(x => x === s).length;
  const mass = VEHICLES.reduce((a, v) => a + v.wheels.reduce((b, w) => b + w.massEstG, 0), 0);
  const items = [
    ['k.vehicles', num(VEHICLES.length), ''],
    ['k.soon', num(count('soon')), 'warn'],
    ['k.full', num(count('full')), 'crit'],
    ['k.flood', num(count('passive')), 'info'],
    ['k.fault', num(count('fault')), 'crit'],
    ['k.mass', `${num(mass / 1000, 2)} kg`, ''],
  ];
  $('fleetKpis').innerHTML = items.map(([k, v, c]) =>
    `<div class="kpi ${c}"><b>${v}</b><span>${tr(k)}</span></div>`).join('');
}

function renderFleet() {
  const rows = VEHICLES.filter(v => {
    const s = statusOf(v);
    return fleetFilter === 'all' || (fleetFilter === 'ok' ? s === 'ok' : s !== 'ok');
  });
  $('fleetTable').innerHTML = `
    <thead><tr>${['th.id', 'th.model', 'th.rl', 'th.rr', 'th.km', 'th.status', 'th.act'].map(k => `<th>${tr(k)}</th>`).join('')}</tr></thead>
    <tbody>${rows.map(v => {
      const s = statusOf(v), m = maintenanceOf(v);
      return `<tr class="${openVehicle === v.id ? 'sel' : ''}">
        <td class="mono">${v.id}</td>
        <td><small>${esc(v.model)}</small></td>
        <td>${fillBar(v.wheels[0].fillPct)}</td>
        <td>${fillBar(v.wheels[1].fillPct)}</td>
        <td class="n">${num(m.kmRemaining)} ${tr('km')}</td>
        <td>${chip(s)}</td>
        <td><button type="button" class="mini" data-open="${v.id}">${tr('act.open')}</button></td>
      </tr>`;
    }).join('')}</tbody>`;
}

function logCall(id, method, path, res) {
  const list = drawerLog.get(id) || [];
  list.unshift({ method, path, status: res.status, ms: res.ms });
  drawerLog.set(id, list.slice(0, 4));
}

function renderDrawer() {
  const box = $('fleetDrawer');
  const v = VEHICLES.find(x => x.id === openVehicle);
  if (!v) { box.hidden = true; box.innerHTML = ''; return; }
  const s = statusOf(v), m = maintenanceOf(v), t = v.telemetry;
  const log = drawerLog.get(v.id) || [];
  box.hidden = false;
  box.innerHTML = `
    <div class="dr-head">
      <div><span class="mono dr-id">${v.id}</span> ${chip(s)}<div class="dr-sub">${esc(v.model)} · ${esc(v.tire)} · ${tr('d.loc')}: ${esc(v.district)}</div></div>
      <button type="button" class="mini" data-close>${tr('d.close')} ✕</button>
    </div>
    <div class="dr-grid">
      ${v.wheels.map(w => `
        <div class="dr-card">
          <h5>${w.position === 'RL' ? tr('th.rl') : tr('th.rr')} <span class="mono">${w.cartridgeId}</span></h5>
          ${fillBar(w.fillPct)}
          <dl>
            <dt>${tr('d.since')}</dt><dd>${num(w.kmSinceSwap)}</dd>
            <dt>${tr('d.mass')}</dt><dd>${num(w.massEstG, 1)} / ${CART.capacityG} g</dd>
            <dt>${tr('d.installed')}</dt><dd>${w.installedAt}</dd>
          </dl>
        </div>`).join('')}
      <div class="dr-card">
        <h5>${tr('d.tel')}</h5>
        <dl>
          <dt>${tr('d.mode')}</dt><dd>${tr('mode.' + t.mode)}</dd>
          <dt>${tr('d.volt')}</dt><dd>${num(t.voltageKv, 1)} kV</dd>
          <dt>${tr('d.pow')}</dt><dd>${num(t.powerW, 2)} W</dd>
          <dt>${tr('d.leak')}</dt><dd class="${t.leakageMa > 2 ? 'bad' : ''}">${num(t.leakageMa, 2)} mA</dd>
          <dt>${tr('d.flood')}</dt><dd>${num(t.floodEvents30d)}</dd>
          <dt>${tr('d.lastflood')}</dt><dd>${ago(t.lastFloodAt)}</dd>
          <dt>${tr('d.seen')}</dt><dd>${ago(t.lastSeenAt)}</dd>
        </dl>
      </div>
      <div class="dr-card">
        <h5>${tr('d.maint')}</h5>
        <dl>
          <dt>${m.due ? tr('d.due') : tr('d.notdue')}</dt><dd>${m.reasons.map(r => tr('r.' + r)).join(', ') || '—'}</dd>
          <dt>${tr('d.kmleft')}</dt><dd>${num(m.kmRemaining)} ${tr('km')}</dd>
          <dt>${tr('d.date')}</dt><dd>${m.estDueDate}</dd>
        </dl>
        <div class="dr-actions">
          <button type="button" class="cta small" data-book="${v.id}">${tr('d.book')}</button>
          <button type="button" class="cta small alt" data-road="${v.id}">${tr('d.road')}</button>
        </div>
      </div>
    </div>
    <div class="dr-extra">${drawerExtra.get(v.id) || ''}</div>
    ${log.length ? `<div class="dr-log"><h5>${tr('d.log')}</h5>${log.map(l =>
      `<div class="mono"><b class="m-${l.method.toLowerCase()}">${l.method}</b> ${esc(l.path)} <span class="${l.status < 300 ? 'ok' : 'bad'}">${l.status}</span> <small>${l.ms} ms</small></div>`).join('')}</div>` : ''}
  `;
}

function centersHTML(v, list) {
  return `<h5>${tr('d.near')}</h5><ol class="near">${list.map(c => `
    <li><div><b>${esc(c.name)}</b><small>${num(c.distanceKm, 1)} km · ${tr('d.eta')} ${num(c.etaMin)} ${tr('d.min')}${c.mobile ? ' · ' + tr('d.mobile') : ''}</small></div>
    <button type="button" class="mini" data-dispatch="${v.id}" data-center="${c.id}">${tr('d.send')}</button></li>`).join('')}
  </ol><p class="hot">${tr('d.hotline')}</p>`;
}

function ticketHTML(t) {
  const head = t.status === 'dispatched' ? tr('d.disp') : tr('d.sched');
  const when = t.etaMin != null ? `${tr('d.eta')} ${num(t.etaMin)} ${tr('d.min')}` : `${tr('d.date')}: ${t.slot}`;
  return `<div class="ticket"><b>${tr('d.ticket')} <span class="mono">${t.id}</span></b><span>${head} ${esc(t.center.name)} · ${when}</span></div>`;
}

async function call(id, method, path, body) {
  const res = await request(method, path, body);
  logCall(id, method, path, res);
  return res;
}

function bindFleet() {
  $('fleetFilter').addEventListener('click', e => {
    const b = e.target.closest('button[data-f]');
    if (!b) return;
    fleetFilter = b.dataset.f;
    [...$('fleetFilter').children].forEach(x => x.classList.toggle('on', x === b));
    renderFleet();
  });

  $('fleetTable').addEventListener('click', async e => {
    const b = e.target.closest('[data-open]');
    if (!b) return;
    openVehicle = b.dataset.open;
    renderFleet();
    await call(openVehicle, 'GET', `/vehicles/${openVehicle}`);
    await call(openVehicle, 'GET', `/vehicles/${openVehicle}/maintenance`);
    renderDrawer();
    $('fleetDrawer').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  $('fleetDrawer').addEventListener('click', async e => {
    const t = e.target.closest('button');
    if (!t) return;
    if (t.hasAttribute('data-close')) { openVehicle = null; renderFleet(); renderDrawer(); return; }

    if (t.dataset.book) {
      const v = VEHICLES.find(x => x.id === t.dataset.book);
      t.disabled = true;
      const res = await call(v.id, 'POST', `/vehicles/${v.id}/service-requests`, { type: 'cartridge_swap' });
      drawerExtra.set(v.id, ticketHTML(res.body));
      renderDrawer();
    }
    if (t.dataset.road) {
      const v = VEHICLES.find(x => x.id === t.dataset.road);
      t.disabled = true;
      const res = await call(v.id, 'GET', `/service-centers/nearest?lat=${v.location.lat}&lng=${v.location.lng}&limit=3`);
      drawerExtra.set(v.id, centersHTML(v, res.body.data));
      renderDrawer();
    }
    if (t.dataset.dispatch) {
      const v = VEHICLES.find(x => x.id === t.dataset.dispatch);
      t.disabled = true;
      const res = await call(v.id, 'POST', `/vehicles/${v.id}/service-requests`,
        { type: 'roadside', centerId: t.dataset.center, reason: maintenanceOf(v).reasons[0] || 'driver_request' });
      drawerExtra.set(v.id, (drawerExtra.get(v.id) || '') + ticketHTML(res.body));
      renderDrawer();
    }
  });
}

/* ==========================================================================
   2 · BẢNG ĐIỀU KHIỂN API
   ========================================================================== */
let apiSel = -1;

function renderApiList() {
  $('apiList').innerHTML = ENDPOINTS.map((ep, i) => `
    <button type="button" role="option" aria-selected="${i === apiSel}" class="ep ${i === apiSel ? 'on' : ''}" data-ep="${i}">
      <b class="m-${ep.m.toLowerCase()}">${ep.m}</b><span class="mono">${esc(ep.p.split('?')[0])}</span><small>${tr(ep.d)}</small>
    </button>`).join('');
  if (apiSel < 0) {
    $('apiReq').innerHTML = '';
    $('apiRes').innerHTML = `<span class="muted">${tr('api.hint')}</span>`;
  }
}

async function sendApi(i) {
  apiSel = i;
  renderApiList();
  const ep = ENDPOINTS[i];
  const curl = `curl -X ${ep.m} "${BASE}${ep.p}" \\\n  -H "Authorization: Bearer $TIREGUARD_KEY"` +
    (ep.body ? ` \\\n  -H "Content-Type: application/json" \\\n  -d '${JSON.stringify(ep.body)}'` : '');
  $('apiReq').innerHTML = `<pre>${esc(curl)}</pre>`;
  $('apiRes').innerHTML = `<span class="muted">${tr('api.wait')}</span>`;
  const res = await request(ep.m, ep.p, ep.body);
  if (apiSel !== i) return;
  $('apiRes').innerHTML =
    `<span class="${res.status < 300 ? 'ok' : 'bad'}">HTTP ${res.status}</span> <span class="muted">· ${res.ms} ms · x-mock: true</span>\n\n` +
    jsonHTML(res.body);
}

function renderHooks() {
  $('hookTable').innerHTML = `
    <thead><tr><th>${tr('wh.ev')}</th><th>${tr('wh.when')}</th><th>${tr('wh.payload')}</th></tr></thead>
    <tbody>${WEBHOOKS.map(h => `<tr><td class="mono hook">${h.e}</td><td><small>${tr(h.d)}</small></td>
      <td><code class="mono">${esc(JSON.stringify(h.sample))}</code></td></tr>`).join('')}</tbody>`;
}

/* ==========================================================================
   3 · ĐỒNG Ý CHIA SẺ & ESG
   ========================================================================== */
let consentLv = 1;
let consentNote = '';

// ai thấy gì ở mỗi mức — [hạm đội, viện nghiên cứu, cơ quan quản lý, công khai]
const VIS = [
  { f: 'c.f0', need: [0, 9, 9, 9] },
  { f: 'c.f1', need: [0, 9, 9, 9] },
  { f: 'c.f2', need: [0, 1, 2, 2] },
  { f: 'c.f3', need: [0, 1, 2, 2] },
  { f: 'c.f4', need: [0, 1, 2, 2] },
  { f: 'c.f5', need: [0, 1, 2, 9] },
];

function renderConsent() {
  const cards = [0, 1, 2].map(lv => `
    <button type="button" class="lv ${lv === consentLv ? 'on' : ''}" data-lv="${lv}" aria-pressed="${lv === consentLv}">
      <span class="num">${lv === consentLv ? '✓ ' : ''}LEVEL ${lv}</span>
      <b>${tr('c.lv' + lv)}</b><small>${tr('c.lv' + lv + 'd')}</small>
    </button>`).join('');
  const cols = ['c.fleet', 'c.research', 'c.reg', 'c.public'];
  const table = `<div class="scroller"><table class="vis"><thead><tr><th>${tr('c.field')}</th>${cols.map(c => `<th>${tr(c)}</th>`).join('')}</tr></thead>
    <tbody>${VIS.map(r => `<tr><td>${tr(r.f)}</td>${r.need.map(n =>
      n <= consentLv ? '<td class="yes" aria-label="có">✓</td>' : '<td class="no" aria-label="không">—</td>').join('')}</tr>`).join('')}</tbody></table></div>`;
  $('consent').innerHTML = `<div class="lvs">${cards}</div>${table}${consentNote ? `<div class="mono api-mini">${consentNote}</div>` : ''}`;
}

function bindConsent() {
  $('consent').addEventListener('click', async e => {
    const b = e.target.closest('[data-lv]');
    if (!b) return;
    consentLv = Number(b.dataset.lv);
    consentNote = '';
    renderConsent();
    const res = await request('POST', '/consents', { fleetId: FLEET_ID, level: consentLv });
    consentNote = `<b class="m-post">POST</b> /consents → <span class="ok">${res.status}</span> · ${tr('c.saved')}: sharedWith = [${res.body.sharedWith.join(', ')}]`;
    renderConsent();
  });
}

function esgDemoOn() { return $('esgDemo').checked; }

function renderEsg() {
  const demo = esgDemoOn();
  const vals = Object.fromEntries(ESG_METRICS.map(m => [m.key, demo ? m.demo : null]));
  const score = esgScore(vals);
  const blank = `<span class="blank">—</span>`;
  const unitTxt = m => m.unit === '/q' ? (getLang() === 'en' ? '/quarter' : '/quý') : m.unit === 'g' ? ' g' : '%';
  const totals = demo
    ? { kg: DISTRICT_DEMO.reduce((a, d) => a + d.kg, 0), km: DISTRICT_DEMO.reduce((a, d) => a + d.km, 0),
        veh: DISTRICT_DEMO.reduce((a, d) => a + d.vehicles, 0), floods: 37 }
    : null;

  $('esgBoard').innerHTML = `
    ${demo ? `<div class="demo-tag">${tr('e.demoTag')}</div>` : ''}
    <div class="esg-top">
      <div class="grade ${score == null ? 'none' : 'g' + gradeOf(score)}">
        <span>${tr('e.grade')}</span><b>${score == null ? '–' : gradeOf(score)}</b>
        <small>${score == null ? tr('e.unrated') : `${tr('e.score')} ${num(score, 1)} / 100`}</small>
      </div>
      <div class="esg-totals">
        <div><span>${tr('e.total')}</span><b>${totals ? num(totals.kg, 1) + ' kg' : blank}</b></div>
        <div><span>${tr('e.km')}</span><b>${totals ? num(totals.km) + ' km' : blank}</b></div>
        <div><span>${tr('e.veh')}</span><b>${totals ? num(totals.veh) : blank}</b></div>
        <div><span>${tr('e.floods')}</span><b>${totals ? num(totals.floods) : blank}</b></div>
        <div><span>${tr('e.ppd')}</span><b>${blank}</b><small>${tr('e.ppdn')}</small></div>
      </div>
    </div>
    <div class="esg-metrics">${ESG_METRICS.map(m => {
      const v = vals[m.key];
      const pct = v == null ? 0 : Math.min(100, v / m.target * 100);
      return `<div class="em"><span>${tr('e.m.' + m.key)}</span>
        <b>${v == null ? blank : num(v, m.unit === 'g' ? 1 : 0) + unitTxt(m)}</b>
        <span class="fill-track"><i class="fill-ok" style="width:${pct}%"></i></span>
        ${v == null ? `<small>${tr('e.wait')}</small>` : ''}</div>`;
    }).join('')}</div>`;

  $('esgMethod').innerHTML = `
    <thead><tr><th>${tr('e.h.metric')}</th><th>${tr('e.h.weight')}</th><th>${tr('e.h.target')}</th><th>${tr('e.h.why')}</th></tr></thead>
    <tbody>${ESG_METRICS.map(m => `<tr><td>${tr('e.m.' + m.key)}</td><td class="n">${num(m.weight * 100)}%</td>
      <td class="n">${num(m.target)}${unitTxt(m)}</td><td><small>${tr('e.w.' + m.key)}</small></td></tr>`).join('')}
      <tr class="hl"><td colspan="4"><small class="mono">A ≥ 85 · B ≥ 70 · C ≥ 55 · D ≥ 40 · E &lt; 40</small></td></tr>
    </tbody>`;

  const head = `<thead><tr><th>${tr('e.d.district')}</th><th>${tr('e.d.veh')}</th><th>${tr('e.d.kg')}</th><th>${tr('e.d.km')}</th><th>${tr('e.d.gkm')}</th></tr></thead>`;
  const body = demo
    ? DISTRICT_DEMO.map(d => d.vehicles < K_ANON
        ? `<tr><td>${d.district}</td><td colspan="4"><small class="muted">${tr('e.d.hidden')}</small></td></tr>`
        : `<tr><td>${d.district}</td><td class="n">${num(d.vehicles)}</td><td class="n">${num(d.kg, 1)}</td><td class="n">${num(d.km)}</td><td class="n">${num(d.kg * 1e6 / d.km, 1)}</td></tr>`).join('')
    : ['Quận 1', 'Quận 3', 'Quận 7', 'Bình Thạnh', 'Thủ Đức'].map(n =>
        `<tr><td>${n}</td><td class="n">${blank}</td><td class="n">${blank}</td><td class="n">${blank}</td><td class="n">${blank}</td></tr>`).join('') +
      `<tr><td colspan="5"><small class="muted">${tr('e.d.empty')}</small></td></tr>`;
  $('esgDistricts').innerHTML = head + `<tbody>${body}</tbody>`;
}

/* ==========================================================================
   4 · BIỂU ĐỒ HIỆU SUẤT THEO TỐC ĐỘ
   Số liệu là đường cong mục tiêu R&D của nhóm (xem ghi chú dưới biểu đồ).
   ========================================================================== */
const SPEEDS = [30, 45, 60, 75, 90, 105, 120];
const SERIES = [
  { k: 'ch.active',  c: '#1aa3c6', dash: '',    mark: 'circle',   v: [55, 62, 68, 72, 75, 75, 74] },
  { k: 'ch.passive', c: '#c97f22', dash: '7 5', mark: 'square',   v: [30, 34, 38, 40, 41, 42, 42] },
  { k: 'ch.comp',    c: '#8f76d6', dash: '2 5', mark: 'triangle', v: [18, 26, 35, 41, 44, 46, 46] },
];

function renderChart() {
  const host = $('effChart');
  if (!host) return;
  const W = 760, H = 380, m = { l: 52, r: 48, t: 20, b: 50 };
  const x = s => m.l + (s - 30) / 90 * (W - m.l - m.r);
  const y = v => m.t + (1 - v / 100) * (H - m.t - m.b);
  const marker = (mk, cx, cy, c) => mk === 'circle'
    ? `<circle cx="${cx}" cy="${cy}" r="4.5" fill="${c}" stroke="#0a1729" stroke-width="2"/>`
    : mk === 'square'
      ? `<rect x="${cx - 4.5}" y="${cy - 4.5}" width="9" height="9" rx="1.5" fill="${c}" stroke="#0a1729" stroke-width="2"/>`
      : `<path d="M${cx} ${cy - 5.5} L${cx + 5.5} ${cy + 4.5} L${cx - 5.5} ${cy + 4.5}Z" fill="${c}" stroke="#0a1729" stroke-width="2"/>`;

  const grid = [0, 20, 40, 60, 80, 100].map(v =>
    `<line x1="${m.l}" x2="${W - m.r}" y1="${y(v)}" y2="${y(v)}" class="cg"/><text x="${m.l - 10}" y="${y(v) + 4}" class="ct" text-anchor="end">${v}</text>`).join('');
  const xt = SPEEDS.map(s => `<text x="${x(s)}" y="${H - m.b + 20}" class="ct" text-anchor="middle">${s}</text>`).join('');
  const band = `<rect x="${m.l}" y="${y(75)}" width="${W - m.l - m.r}" height="${y(60) - y(75)}" class="cband"/>
    <text x="${m.l + 8}" y="${y(75) + 15}" class="ct band">${tr('ch.band')}</text>`;
  const lines = SERIES.map(s => {
    const d = s.v.map((v, i) => `${i ? 'L' : 'M'}${x(SPEEDS[i])} ${y(v)}`).join(' ');
    return `<path d="${d}" fill="none" stroke="${s.c}" stroke-width="2" stroke-dasharray="${s.dash}" stroke-linejoin="round"/>` +
      s.v.map((v, i) => marker(s.mark, x(SPEEDS[i]), y(v), s.c)).join('');
  }).join('');
  // nhãn trực tiếp ở đầu mút phải, xếp lệch để không chồng nhau
  const ends = SERIES.map((s, i) => ({ i, y: y(s.v[6]) + 4 })).sort((a, b) => a.y - b.y);
  for (let k = 1; k < ends.length; k++) ends[k].y = Math.max(ends[k].y, ends[k - 1].y + 14);
  const labels = ends.map(e => `<text x="${x(120) + 10}" y="${e.y}" class="ct lab">${num(SERIES[e.i].v[6])}%</text>`).join('');

  host.innerHTML = `
    <div class="legend">${SERIES.map(s => `<span><svg width="26" height="12" aria-hidden="true"><line x1="0" x2="26" y1="6" y2="6" stroke="${s.c}" stroke-width="2" stroke-dasharray="${s.dash}"/>${marker(s.mark, 13, 6, s.c)}</svg>${tr(s.k)}</span>`).join('')}</div>
    <div class="plot">
      <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${tr('ch.y')} / ${tr('ch.x')}">
        ${band}${grid}${xt}
        <text x="${(W + m.l - m.r) / 2}" y="${H - 8}" class="ct ax" text-anchor="middle">${tr('ch.x')}</text>
        <text transform="translate(14 ${(H - m.b + m.t) / 2}) rotate(-90)" class="ct ax" text-anchor="middle">${tr('ch.y')}</text>
        <line class="cx" id="chX" y1="${m.t}" y2="${H - m.b}" x1="-10" x2="-10"/>
        ${lines}${labels}
        <rect id="chHit" x="${m.l}" y="${m.t}" width="${W - m.l - m.r}" height="${H - m.t - m.b}" fill="transparent"/>
      </svg>
      <div class="tip" id="chTip" hidden></div>
    </div>`;

  const svg = host.querySelector('.plot svg'), tip = $('chTip'), cx = $('chX');
  const move = e => {
    const r = svg.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width * W;
    let i = Math.round((px - m.l) / (W - m.l - m.r) * 6);
    i = Math.max(0, Math.min(6, i));
    const sx = x(SPEEDS[i]);
    cx.setAttribute('x1', sx); cx.setAttribute('x2', sx);
    tip.hidden = false;
    tip.innerHTML = `<b>${tr('ch.speed')} ${SPEEDS[i]} km/h</b>` +
      SERIES.map(s => `<div><i style="background:${s.c}"></i>${tr(s.k)}<b>${s.v[i]}%</b></div>`).join('');
    const left = sx / W * r.width;
    tip.style.left = Math.min(r.width - 230, Math.max(0, left + 14)) + 'px';
    tip.style.top = '8px';
  };
  const hit = $('chHit');
  hit.addEventListener('pointermove', move);
  hit.addEventListener('pointerdown', move);
  hit.addEventListener('pointerleave', () => { tip.hidden = true; cx.setAttribute('x1', -10); cx.setAttribute('x2', -10); });

  $('effTable').innerHTML = `<table><thead><tr><th>km/h</th>${SERIES.map(s => `<th>${tr(s.k)}</th>`).join('')}</tr></thead>
    <tbody>${SPEEDS.map((sp, i) => `<tr><td class="n">${sp}</td>${SERIES.map(s => `<td class="n">${s.v[i]}%</td>`).join('')}</tr>`).join('')}</tbody></table>`;
}

/* ==========================================================================
   5 · MÁY TÍNH CHI PHÍ
   Giá theo tài liệu kỹ thuật: kit 75 USD/bánh (2 bánh sau), OEM 250–300 USD/xe
   (4 bánh), khay 15 USD/bánh/lần thay. Tỷ giá 25.000 ₫/USD như trong tài liệu.
   ========================================================================== */
let phase = 'kit';
const VND = 25000;

function renderCalc() {
  const n = +$('iN').value, km = +$('iK').value;
  $('cN').textContent = num(n);
  $('cK').textContent = num(km);
  const wheels = phase === 'kit' ? 2 : 4;
  const hwLo = phase === 'kit' ? 150 : 250, hwHi = phase === 'kit' ? 150 : 300;
  const perYear = wheels * km / ((CART.swapKmMin + CART.swapKmMax) / 2);
  const carts = Math.ceil(perYear * n);
  const cartCost = carts * 15;
  const usd = v => `${num(v)} USD`;
  const vnd = v => getLang() === 'en' ? '' : `<small>≈ ${num(v * VND / 1e6, 1)} tr ₫</small>`;
  const range = (a, b) => a === b ? usd(a) : `${num(a)}–${num(b)} USD`;
  $('calcOut').innerHTML = `
    <div><span>${tr('cal.hw')}</span><b>${range(hwLo * n, hwHi * n)}</b>${vnd(hwLo * n)}</div>
    <div><span>${tr('cal.cart')}</span><b>${num(carts)} ${tr('cal.pcs')}</b><small>${num(perYear, 1)} / ${getLang() === 'en' ? 'vehicle' : 'xe'}</small></div>
    <div><span>${tr('cal.cartcost')}</span><b>${usd(cartCost)}</b>${vnd(cartCost)}</div>
    <div><span>${tr('cal.three')}</span><b>${range(hwLo * n + 3 * cartCost, hwHi * n + 3 * cartCost)}</b>${vnd(hwLo * n + 3 * cartCost)}</div>
    <div><span>${tr('cal.cap')}</span><b>${num(carts * CART.capacityG / 1000, 1)} kg</b><small>${tr('cal.capn')}</small></div>`;
}

function bindCalc() {
  $('iN').addEventListener('input', renderCalc);
  $('iK').addEventListener('input', renderCalc);
  document.querySelector('#calc .seg').addEventListener('click', e => {
    const b = e.target.closest('[data-phase]');
    if (!b) return;
    phase = b.dataset.phase;
    [...b.parentElement.children].forEach(x => x.classList.toggle('on', x === b));
    renderCalc();
  });
}

/* ==========================================================================
   6 · NÚT "XEM TRONG MÔ HÌNH 3D" — chuyển tab rồi bật lội nước
   ========================================================================== */
function bindGoFlood() {
  $('goFlood')?.addEventListener('click', () => {
    document.querySelector('.tab[data-panel="p3d"]')?.click();
    const f = $('bFlood');
    if (f && !f.classList.contains('on')) setTimeout(() => f.click(), 400);
  });
}

/* ==========================================================================
   Khởi động
   ========================================================================== */
function renderAll() {
  renderChart();
  renderCalc();
  renderKpis();
  renderFleet();
  renderDrawer();
  renderApiList();
  if (apiSel >= 0) sendApi(apiSel);
  renderHooks();
  renderConsent();
  renderEsg();
}

function init() {
  bindFleet();
  bindCalc();
  bindConsent();
  bindGoFlood();
  $('apiList').addEventListener('click', e => {
    const b = e.target.closest('[data-ep]');
    if (b) sendApi(+b.dataset.ep);
  });
  $('esgDemo').addEventListener('change', renderEsg);
  renderAll();
  document.addEventListener('langchange', renderAll);
}

init();
