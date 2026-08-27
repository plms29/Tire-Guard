/* ==========================================================================
   Song ngữ. Bản tiếng Việt là nội dung gốc nằm trong HTML — lần chạy đầu
   tiên nó được cất lại, nên ở đây chỉ cần khai báo bản tiếng Anh.
   ========================================================================== */

export const EN = {
  'tab.model': '3D model', 'tab.problem': 'Problem', 'tab.spec': 'Specs',
  'tab.how': 'How it works', 'tab.compare': 'Comparison', 'tab.revenue': 'Revenue',
  'tab.roadmap': 'Roadmap', 'tab.sources': 'Sources',

  'view.overview': 'Whole wheel', 'view.exploded': 'Exploded',
  'view.capOverview': 'The device sits flush inside the rear wheel arch, hugging the 30°–75° centrifugal spray angle. Drag to rotate, scroll to zoom.',
  'view.capExploded': 'Five assemblies, thirty millimetres deep. Each sub-part leaves its cluster on its own beat — shell, honeycomb cartridge, flexible electrode, collection tray, mounting brackets.',

  's3.flowh': 'Four operating steps',

  'loading': 'BUILDING 3D MODEL…',

  'hero.eyebrow': 'Electrostatic wheel arch · VF 8 · 245/45 R20',
  'hero.title': 'Tire dust caught <em>before</em> it reaches the road.',
  'hero.sub': 'The device sits flush inside the rear wheel arch, hugging the 30°–75° centrifugal spray angle. Drag to inspect each layer.',

  'ch.0.n': 'CHAPTER 01', 'ch.0.t': 'Particles are born',
  'ch.0.d': 'Friction between tread and road tears off TRWP particles that already carry a triboelectric charge, thrown out along the 30°–75° arc.',
  'ch.1.n': 'CHAPTER 02', 'ch.1.t': 'Hidden in the arch',
  'ch.1.d': 'The unit sits deep inside the wheelhouse liner rather than hanging below — it survives potholes, flying stones and high kerbs.',
  'ch.2.n': 'CHAPTER 03', 'ch.2.t': 'Thirty millimetres, five layers',
  'ch.2.d': '10 mm carbon shell, 15 mm honeycomb cartridge, 260 mm flexible electrode, collection tray and mounting brackets.',
  'ch.3.n': 'CHAPTER 04', 'ch.3.t': 'Electrostatic capture',
  'ch.3.d': 'The field bends each particle off its parabolic path; the Coulomb force pins it against the honeycomb wall.',
  'ch.4.n': 'CHAPTER 05', 'ch.4.t': 'Safe when flooded',
  'ch.4.d': 'Water bridges the two exposed electrodes and the IP68 circuit cuts the field in under 2 milliseconds.',
  'ch.5.n': 'CHAPTER 06', 'ch.5.t': 'Swap the core, close the loop',
  'ch.5.d': 'Pull the cartridge after 10,000–15,000 km. Returning the old one earns 15% off the next; the dust is sold on to recyclers.',

  'hud.title': 'Particle flow simulation',
  'hud.scope': 'capture rate within the 30°–75° window',
  'hud.captured': 'Captured', 'hud.escaped': 'Passed through', 'hud.voltage': 'Voltage',
  'hud.on': 'FIELD: ON', 'hud.off': 'FIELD: OFF', 'hud.cut': 'FIELD CUT < 2 ms',
  'hud.note': 'Illustrative simulation of the operating principle. Not a CFD result.',

  'dock.field': 'Field', 'dock.flood': 'Flood', 'dock.labels': 'Dimensions',
  'dock.spin': 'Auto-rotate', 'dock.reset': 'Reset view',

  'hs.0': 'Carbon ABS shell · <u>10 mm thick</u>',
  'hs.1': 'Honeycomb core · <u>15 mm · 3 mm cells</u>',
  'hs.2': 'Flexible electrode · <u>260 mm wide</u>',
  'hs.3': 'Collection tray · <u>260×40×20 mm</u>',
  'hs.4': 'Suspension clearance · <u>50 mm</u>',
  'hs.5': 'Hex cell · <u>3 mm · 0.5 mm wall</u>',
  'hs.6': 'Exposed electrodes · <u>8 mm · IP68</u>',
  'hs.7': 'Cartridge slide rail · <u>5 mm deep</u>',

  'zoom.hint': 'Scroll to zoom — the device separates layer by layer',

  'anno.tag': 'Dimensions',
  'anno.0.t': 'Carbon ABS shell', 'anno.0.d': '10 mm thick, radius 415 → 445 mm',
  'anno.1.t': 'Honeycomb core',   'anno.1.d': '15 mm thick, 3 mm hex cells, 0.5 mm walls',
  'anno.2.t': 'Flexible electrode', 'anno.2.d': '260 mm wide, copper-clad, controller on board',
  'anno.3.t': 'Collection tray',  'anno.3.d': '260 × 40 × 20 mm, at the 30° low point',
  'anno.4.t': 'Suspension clearance', 'anno.4.d': '50 mm, enough for full compression',

  's1.tag': '01 — The problem',
  's1.h': 'Electric cars dropped the tailpipe. They did not drop the tire.',
  's1.p1': 'EVs are heavier because of the battery and accelerate harder, so their tires wear faster. None of that leaves through an exhaust pipe, so it appears in no emissions test — and no law penalises it. In Southeast Asia every heavy downpour flushes that dust straight into the river system.',
  's1.st0': 'Extra non-exhaust fine particles an EV produces compared with a petrol car of the same size, because of battery weight.',
  's1.st1': 'Share of EVs in total car sales in Vietnam — moving faster than tire-pollution control.',
  's1.st2': 'What 6PPD becomes when it meets ozone. Rain washes it into waterways, and it is toxic enough to kill some fish species.',
  's1.p2': 'Existing capture technology was trialled in Europe and the United States, mounted externally close to the road. Bring that device to Vietnam’s floods, potholes and high kerbs and it does not survive the first day. The gap is not in the physics — it is in the infrastructure.',

  's2.tag': '02 — Design parameters',
  's2.h': 'Parameterised around the VF 8’s 245/45 R20 tire.',
  's2.th0': 'Geometric parameter', 's2.th1': 'Symbol', 's2.th2': 'Value', 's2.th3': 'Engineering constraint',
  's2.r0': 'Tire outer radius',        's2.n0': 'Standard 245/45 R20 tire.',
  's2.r1': 'Wheel arch radius',        's2.n1': 'Inner curved face of the wheelhouse liner.',
  's2.r2': 'Suspension travel gap',    's2.n2': 'Full compression into a pothole still clears the tire.',
  's2.r3': 'Collection arc',           's2.n3': 'Optimal centrifugal spray angle, chosen from CFD analysis.',
  's2.r4': 'Electrode width',          's2.n4': '15 mm wider than the tread, to catch oblique spray.',
  's2.r5': 'Overall thickness',        's2.n5': '10 mm shell + 15 mm honeycomb core + air gap. Keeps Cd ≈ 0.20.',
  's2.r6': 'Arc length',               's2.n6': '45° sweep hugging the plastic liner.',
  's2.r7': 'Honeycomb cell',           's2.n7': '0.5 mm walls; air slips through without adding drag.',
  's2.r8': 'Cartridge capacity',       's2.n8': 'Holds the dust from 10,000–15,000 km of driving.',
  's2.r9': 'Flood sensor housing',     's2.n9': 'Two 8 mm exposed electrodes, field cut in under 2 ms.',

  's3.tag': '03 — How it works',
  's3.h': 'Three parts, drawing nothing from the traction battery.',
  's3.c0n': 'PART 01', 's3.c0t': 'Wheel-arch carrier',
  's3.c0d': 'Carbon-reinforced ABS shell, 415 mm inner radius, 445 mm outer, sweeping a 45° arc. Two 5 mm slide grooves along the inner edge act as rails for the filter cartridge.',
  's3.c1n': 'PART 02', 's3.c1t': 'Honeycomb trap core',
  's3.c1d': '15 mm thick, hollow hexagonal lattice with 3 mm cells and 0.5 mm walls. Air threads through the gaps so no drag is added; particles are pinned to the walls by the Coulomb force. A 20 mm latch lets a technician swap it in 30 seconds without removing the wheel.',
  's3.c2n': 'PART 03', 's3.c2t': 'Tray &amp; cut-off circuit',
  's3.c2d': 'A 260×40×20 mm tray sits at the 30° low point where heavy dust settles. An IP68 housing bolted underneath carries two 8 mm exposed electrodes: the moment water reaches them, the field is cut in under 2 ms.',
  's3.eqh': 'Why 30°–75°, and why not hang it outside',
  's3.eqp': 'Particles leave the tread tangentially at an initial velocity v₍x0₎, then follow a parabolic path once they enter the uniform field. Placing the trap across exactly this angular band means meeting each particle where its path bends hardest — while burying the entire high-voltage system deep inside the plastic liner, away from stones, potholes and floodwater.',
  's3.e0': 'Particle path in a uniform field',
  's3.e1': 'Equation of motion',
  's3.e2': 'Gauss’s law for the trapping field',
  's3.e3': 'Retention condition over a pothole',
  's3.eqnote': 'F<sub>e</sub> = qE is the Coulomb force, F<sub>g</sub> + F<sub>b</sub> is gravity minus buoyancy, F<sub>d</sub> is Stokes drag with the Cunningham correction for PM2.5. The simulation on this page solves that system in a reduced, real-time form.',

  's4.tag': '04 — Competitive landscape',
  's4.h': 'Three approaches already exist. Here is the gap they leave.',
  's4.th0': 'Approach', 's4.th1': 'Representative', 's4.th2': 'Strength', 's4.th3': 'Weakness in Southeast Asia',
  's4.r0': 'Low-wear tires',
  's4.s0': 'Reduces particles at source with no extra hardware on the vehicle.',
  's4.w0': 'Requires new materials and a redesign per EV model, and friction is still a safety requirement.',
  's4.r1': 'On-vehicle capture',
  's4.s1': 'Uses airflow and an electric field to catch particles beside the wheel.',
  's4.w1': 'Trialled in Europe and the US; an externally mounted unit close to the road does not survive flooding and potholes.',
  's4.r2': 'Collection after release', 's4.rep2': 'Street sweepers, drain filters',
  's4.s2': 'Handles many kinds of road waste at once.',
  's4.w2': 'Only works once particles have reached the road. Heavy rain carries 6PPD into drains, rivers and canals first.',
  's4.rep3': 'Electrostatic trap in the wheel arch',
  's4.s3': 'Captures particles before rain can move them, with the plastic liner shielding the device completely.',
  's4.w3': 'Needs a high-voltage supply on the vehicle and a garage network for scheduled core swaps.',

  's5.tag': '05 — Business model',
  's5.h': 'Three revenue layers closing one material loop.',
  's5.c0n': 'LAYER 01', 's5.c0t': 'Equipment sales',
  's5.c0d': 'Revenue from selling and fitting the electrostatic unit to B2B fleet vehicles. Assumed price of USD 200 per unit.',
  's5.c1n': 'LAYER 02', 's5.c1t': 'Service &amp; the 15% loop',
  's5.c1d': 'Replacement cartridges. Every returned box earns 15% off the next one — the mechanism that keeps the return rate high and locks in the service chain.',
  's5.c2n': 'LAYER 03', 's5.c2t': 'Reselling the dust',
  's5.c2d': 'Captured dust contains rubber, carbon black and synthetic polymers — sold in bulk to recyclers for road asphalt or new tires.',
  's5.th0': 'Metric (USD)', 's5.th1': 'Year 1 — Pilot', 's5.th2': 'Year 2 — Expansion', 's5.th3': 'Year 3 — Scale',
  's5.r0': 'New vehicle installations', 's5.r1': 'Layer 1 — Equipment', 's5.r2': 'Layer 2 — Service',
  's5.r3': 'Layer 3 — Tire dust', 's5.r4': 'Total revenue', 's5.r5': 'Cost of goods sold (55%)',
  's5.r6': 'Operating expenses', 's5.r7': 'Net profit',
  's5.note': 'These figures are hypothetical, built on a first-year fleet contract of 1,000 vehicles at USD 200 per unit and USD 50 per cartridge (USD 42.50 on exchange). They are not audited.',

  's6.tag': '06 — Implementation',
  's6.h': 'From the CAD bench to a regional fleet.',
  's6.l0': 'Optimise the unit for flush integration into the chassis instead of external mounting, achieving flood and impact resistance.',
  's6.l1n': '02 · TESTING',
  's6.l1': 'Low-cost test rigs with mini motors and circuits to tune the electrode’s electrostatic capture efficiency.',
  's6.l2n': '03 · B2B PARTNERS',
  's6.l2': 'Partner with major fleets; delegate fitting and core replacement to the periodic-maintenance garage network.',
  's6.l3': 'Measure dust collected per kilometre and the contribution to partner companies’ ESG certification.',
  's6.l4n': '05 · SCALING',
  's6.l4': 'Field trials in Ho Chi Minh City, Hanoi and Da Nang before expanding to Indonesia, the Philippines and Laos.',

  's7.tag': '07 — Sources',
  's7.h': 'Where the numbers on this page come from.',
  's7.0': 'Non-exhaust Particulate Emissions from Road Transport. Heavier EVs emit 3–8% more non-exhaust fine particles.',
  's7.1': 'EVs account for roughly 40% of car sales in Vietnam, 20% in Thailand and 15% in Indonesia.',
  's7.2': '6PPD reacts with ozone to form 6PPD-quinone, which rain washes into waterways and which is toxic enough to kill some fish species.',
  's7.3': 'Real-world measurement showing tire-wear particles far exceed what remains from a modern car’s tailpipe.',
  's7.4': 'The Transition to Zero Pollution group warns that heavier, faster-accelerating EVs will worsen tire emissions.',
  's7.5': 'The landmark study tracing coho salmon die-offs to 6PPD-quinone.',

  'foot.tag': 'Electrostatic wheel arch — trapping tire microplastics at source, built for Southeast Asian infrastructure.',
  'foot.note': 'MODELLED FROM CAD PARAMETERS · NOT A MANUFACTURING DRAWING',
};

const VI = Object.create(null);      // nội dung gốc, nạp từ HTML
let current = 'vi';
let ready = false;

function nodes() {
  return document.querySelectorAll('[data-i18n],[data-i18n-html]');
}

function snapshot() {
  nodes().forEach(el => {
    const key = el.dataset.i18n || el.dataset.i18nHtml;
    if (!(key in VI)) VI[key] = el.innerHTML;
  });
  // các chuỗi chỉ xuất hiện lúc chạy, không có trong HTML
  VI['hud.off'] = 'ĐIỆN TRƯỜNG: TẮT';
  VI['hud.cut'] = 'NGẮT TĨNH ĐIỆN < 2 ms';
  VI['view.capExploded'] = 'Năm cụm chi tiết, dày ba mươi milimét. Mỗi chi tiết con rời khỏi cụm của nó theo một nhịp riêng — vỏ carbon, lõi tổ ong, bản cực dẻo, máng hứng, ngàm gá.';
  ready = true;
}

/** Lấy một chuỗi theo ngôn ngữ đang bật — dùng cho nhãn sinh ra lúc chạy. */
export function t(key) {
  return (current === 'en' ? EN[key] : VI[key]) ?? VI[key] ?? key;
}

export function getLang() { return current; }

export function setLang(lang) {
  if (!ready) snapshot();
  current = lang === 'en' ? 'en' : 'vi';
  const dict = current === 'en' ? EN : VI;

  nodes().forEach(el => {
    const key = el.dataset.i18n || el.dataset.i18nHtml;
    const val = dict[key];
    if (val != null) el.innerHTML = val;
  });

  document.documentElement.lang = current;
  const btn = document.getElementById('bLang');
  if (btn) {
    btn.textContent = current === 'en' ? 'VI' : 'EN';
    btn.setAttribute('aria-label', current === 'en' ? 'Chuyển sang tiếng Việt' : 'Switch to English');
  }
  try { localStorage.setItem('tg-lang', current); } catch (_) { /* chế độ riêng tư */ }
  document.dispatchEvent(new CustomEvent('langchange', { detail: current }));
}

/** Mặc định: theo lựa chọn đã lưu, nếu chưa có thì theo ngôn ngữ trình duyệt. */
export function initLang() {
  let saved = null;
  try { saved = localStorage.getItem('tg-lang'); } catch (_) { /* bỏ qua */ }
  const guess = (navigator.language || '').toLowerCase().startsWith('vi') ? 'vi' : 'en';
  setLang(saved || guess);
}
