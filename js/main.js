import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

import {
  MM, R_TIRE, R_ARCH, R_SHELL, W_ACT, A0, A1, AMID, Q, TIER,
} from './config.js';
import { buildWheel, buildDevice, buildBody, buildCaliper } from './device.js';
import { floorFade } from './textures.js';
import { createParticles, createBolts } from './particles.js';
import { createStory } from './story.js';
import { createUI, createTabs, createHotspots, createLoader } from './ui.js';

const canvas = document.getElementById('c');

/* ==========================================================================
   0. Không có WebGL thì rơi về video — không bao giờ để màn hình trắng
   ========================================================================== */
function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch (_) { return false; }
}

if (!hasWebGL()) {
  const v = document.createElement('video');
  v.className = 'fallback';
  v.src = 'assets/tireguard.mp4';
  v.poster = 'assets/poster.jpg';
  v.autoplay = v.muted = v.loop = v.playsInline = true;
  v.setAttribute('playsinline', '');
  canvas.replaceWith(v);
  document.getElementById('loading')?.remove();
  document.querySelector('.hud')?.remove();
  document.querySelector('.dock')?.remove();
  document.body.classList.add('no-gl');
  createTabs();                     // các tab nội dung vẫn phải dùng được
} else {
  boot();
}

async function boot() {
  const loader = createLoader();
  // Nhường quyền cho trình duyệt vẽ lại giữa các bước dựng cảnh.
  // Dùng timer chứ không dùng requestAnimationFrame: nếu trang được mở ở tab
  // nền, rAF không bao giờ chạy và màn hình chờ sẽ kẹt vĩnh viễn.
  const yieldFrame = () => new Promise(r => setTimeout(r, 0));

  /* ========================================================================
     1. Renderer, scene, camera
     ======================================================================== */
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: TIER !== 'low', alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, Q.pixelRatio));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.95;
  if (Q.shadows) {
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  }

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x05101f, 1.7, 4.4);

  const camera = new THREE.PerspectiveCamera(38, 1, 0.05, 40);
  loader.set(0.15);
  await yieldFrame();

  /* ========================================================================
     2. Môi trường phản chiếu — sinh trong code, không tải file HDRI
     ======================================================================== */
  /* Bộ đèn kiểu phòng chụp xe: một nguồn chính có bóng đổ, một nguồn phụ xoá
     bớt bóng tối, hai nguồn viền tách vật thể khỏi nền, và ánh sáng môi trường
     mạnh — chính ánh sáng môi trường mới là thứ làm kim loại và sơn bóng trông
     ra kim loại và sơn bóng, chứ không phải màu vật liệu. */
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.03).texture;
  scene.environmentIntensity = 0.95;

  scene.add(new THREE.HemisphereLight(0xbcdcf5, 0x10161d, 0.34));

  const key = new THREE.DirectionalLight(0xfff2e0, 1.62);
  key.position.set(1.35, 1.75, 1.25);
  if (Q.shadows) {
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.near = 0.4;
    key.shadow.camera.far = 5;
    const b = 0.85;
    Object.assign(key.shadow.camera, { left: -b, right: b, top: b, bottom: -b });
    key.shadow.bias = -0.0006;
    key.shadow.normalBias = 0.003;
  }
  scene.add(key);

  const fill = new THREE.DirectionalLight(0xd6e8ff, 0.85);
  fill.position.set(-1.5, 0.85, 1.5);
  scene.add(fill);

  const kicker = new THREE.DirectionalLight(0xffffff, 1.25);  // viền sau, tách khỏi nền
  kicker.position.set(-1.1, 0.55, -1.6);
  scene.add(kicker);

  const brand = new THREE.DirectionalLight(0x4fe3ff, 0.7);    // viền xanh tĩnh điện
  brand.position.set(0.6, -0.35, -1.4);
  scene.add(brand);

  const bounce = new THREE.DirectionalLight(0x7d94ab, 0.42);  // hắt từ mặt đường lên
  bounce.position.set(0.2, -1.4, 0.5);
  scene.add(bounce);

  /* Không dùng đèn điểm để tả quầng điện trường: khi các lớp bung ra, đèn lọt
     ra khỏi lõi và rọi cháy mặt trong tấm vỏ. Cảm giác phóng điện đã do tia hồ
     quang, lớp phát xạ của tổ ong và bloom đảm nhiệm. */

  loader.set(0.35);
  await yieldFrame();

  /* ========================================================================
     3. Bánh xe và thiết bị
     ======================================================================== */
  const { group: wheel, discZ } = buildWheel(Q.shadows);
  scene.add(wheel);
  scene.add(buildCaliper(discZ, Q.shadows));   // cùm phanh gắn thân xe, không quay
  const body = buildBody(Q.shadows);
  scene.add(body.group);
  loader.set(0.6);
  await yieldFrame();

  const { device, layers, led, trayPos, parts, setXray } = buildDevice(Q.shadows);
  scene.add(device);
  loader.set(0.82);
  await yieldFrame();

  // hướng bung tách của từng lớp, theo pháp tuyến hướng tâm
  const nrm = new THREE.Vector3(Math.cos(AMID), Math.sin(AMID), 0);
  const EXPLODE = [
    { g: layers.shell,   v: nrm.clone().multiplyScalar(0.26) },
    { g: layers.core,    v: nrm.clone().multiplyScalar(0.13) },
    { g: layers.pcb,     v: nrm.clone().multiplyScalar(0.03) },
    { g: layers.tray,    v: new THREE.Vector3(0.10, -0.07, 0) },
    { g: layers.bracket, v: nrm.clone().multiplyScalar(0.11).add(new THREE.Vector3(0, 0, 0.06)) },
  ];

  /* ========================================================================
     4. Hạt, hồ quang, nước, sàn
     ======================================================================== */
  const particles = createParticles(scene);
  const bolts = createBolts(scene);

  // mực nước: khô, ngập, và cao độ hai điện cực hở của hộp IP68
  const DRY_Y = -0.95;
  const CUT_LEVEL = trayPos.y - 0.010;
  const FLOOD_Y = CUT_LEVEL + 0.040;

  const water = new THREE.Mesh(
    new THREE.PlaneGeometry(4, 4),
    new THREE.MeshStandardMaterial({
      color: 0x0a2f42, transparent: true, opacity: .55, roughness: .45, metalness: .1,
      side: THREE.DoubleSide,
    })
  );
  water.rotation.x = -Math.PI / 2;
  water.position.y = -0.95;
  scene.add(water);

  const floor = new THREE.Mesh(
    new THREE.CircleGeometry(2.2, 64),
    new THREE.MeshStandardMaterial({
      color: 0x0a1119, roughness: .88, metalness: .05,
      alphaMap: floorFade(), transparent: true, depthWrite: false,
    })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -R_TIRE - 0.002;
  floor.receiveShadow = Q.shadows;
  scene.add(floor);

  /* ========================================================================
     5. Hậu kỳ
     ======================================================================== */
  let composer = null;
  if (Q.bloom) {
    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    // ngưỡng cao để chỉ tia hồ quang và hạt đã bị bẫy phát sáng,
    // không làm nhoè cả cảnh
    composer.addPass(new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight), 0.30, 0.45, 0.94
    ));
    composer.addPass(new OutputPass());
  }

  /* ========================================================================
     6. Điều khiển quỹ đạo — kéo, cuộn phóng to, cuộn trang đổi cảnh
     ======================================================================== */
  const view = { az: 0.86, el: 0.30, dist: 1.55 };
  const user = { az: 0, el: 0, distMul: 1, spin: 0 };
  const target = new THREE.Vector3();
  let dragging = false, lastX = 0, lastY = 0, idle = 0;

  canvas.addEventListener('pointerdown', e => {
    dragging = true; lastX = e.clientX; lastY = e.clientY; idle = 0;
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener('pointerup', () => { dragging = false; });
  canvas.addEventListener('pointercancel', () => { dragging = false; });
  canvas.addEventListener('pointermove', e => {
    if (!dragging) return;
    user.az -= (e.clientX - lastX) * 0.006;
    user.el = Math.max(-0.9, Math.min(0.9, user.el + (e.clientY - lastY) * 0.005));
    lastX = e.clientX; lastY = e.clientY; idle = 0;
  });
  canvas.addEventListener('wheel', e => {
    e.preventDefault();
    user.distMul = Math.max(0.55, Math.min(1.9, user.distMul + e.deltaY * 0.0009));
    idle = 0;
  }, { passive: false });

  /* ========================================================================
     7. Giao diện và kịch bản
     ======================================================================== */
  const story = createStory();

  const ui = createUI({
    onFieldToggle: () => particles.reset(),
    onReset: () => { user.az = 0; user.el = 0; user.distMul = 1; user.spin = 0; },
    onViewChange: (mode) => {
      story.setMode(mode);
      // đổi chế độ thì bỏ luôn mức zoom người dùng đang giữ, nếu không thì
      // vừa bấm "Tổng thể" xong vẫn thấy máy quay dí sát vào thiết bị
      user.distMul = 1;
    },
  });


  const at = (a, r, z = 0) => new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r, z);
  const hotspots = createHotspots([
    { p: at(A1 - 0.10, R_SHELL, W_ACT / 2),          offset: 0, minZoom: 0.30 },
    { p: at(AMID, R_ARCH - 8 * MM, -W_ACT / 2),      offset: 1, minZoom: 0.30 },
    { p: at(AMID + 0.18, R_ARCH - 21 * MM, W_ACT / 2), offset: 2, minZoom: 0.30 },
    { p: trayPos.clone(),                            offset: 3, minZoom: 0.30 },
    { p: at(A0 + 0.30, R_TIRE + 25 * MM),                       minZoom: 0.30 },
    // ba nhãn dưới chỉ hiện khi zoom sâu — chi tiết cấp hai
    { p: at(AMID - 0.12, R_ARCH - 12 * MM, -W_ACT / 4), offset: 1, minZoom: 0.55, minExplode: 9 },
    { p: at(A0 + 0.10, R_ARCH - 30 * MM, W_ACT / 4),    offset: 3, minZoom: 0.55, minExplode: 9 },
    { p: at(A1 - 0.24, R_ARCH + 6 * MM, -W_ACT / 3),    offset: 0, minZoom: 0.72, minExplode: 9 },
  ]);

  /* ========================================================================
     8. Vòng lặp — chỉ chạy khi người dùng thực sự đang nhìn
     ======================================================================== */
  const clock = new THREE.Clock();
  let exNow = 0, cutNow = 0, zoomNow = 0, boltTimer = 0, firstFrame = true;
  let visible = !document.hidden, onScreen = true;
  const offsets = [null, null, null, null, null];

  document.addEventListener('visibilitychange', () => {
    visible = !document.hidden;
    if (visible) clock.getDelta();          // bỏ khoảng thời gian đã ngủ
  });
  new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; }, { threshold: 0 })
    .observe(canvas);

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    const pr = renderer.getPixelRatio();
    if (canvas.width !== Math.floor(w * pr) || canvas.height !== Math.floor(h * pr)) {
      renderer.setSize(w, h, false);
      composer && composer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
  }

  function frame() {
    if (!visible || !onScreen) { clock.getDelta(); return; }

    const dt = Math.min(clock.getDelta(), 0.05);
    const time = clock.elapsedTime;
    resize();

    /* --- máy quay: kịch bản cuộn + thao tác của người dùng --- */
    if (ui.state.spin && !dragging) {
      idle += dt;
      if (idle > 1.2) user.spin += dt * 0.12;
    }
    const s = story.cam;
    const tAz = s.az + user.az + user.spin;
    const tEl = Math.max(-0.9, Math.min(1.15, s.el + user.el));
    const tDist = s.dist * user.distMul;

    view.az += (tAz - view.az) * 0.08;
    view.el += (tEl - view.el) * 0.08;
    view.dist += (tDist - view.dist) * 0.08;
    target.set(
      target.x + (s.tx - target.x) * 0.08,
      target.y + (s.ty - target.y) * 0.08,
      0
    );

    camera.position.set(
      target.x + Math.cos(view.az) * Math.cos(view.el) * view.dist,
      target.y + Math.sin(view.el) * view.dist,
      target.z + Math.sin(view.az) * Math.cos(view.el) * view.dist
    );
    camera.lookAt(target);

    /* --- bung tách --- */
    /* --- zoom: người dùng cuộn chuột để lại gần thì thiết bị mở ra --- */
    const zoomTarget = Math.max(0, Math.min(1, (1 - user.distMul) / 0.45));
    zoomNow += (zoomTarget - zoomNow) * 0.10;

    /* --- bung tách --- */
    exNow += (story.explode - exNow) * 0.12;
    cutNow += (Math.max(story.cutaway, zoomNow) - cutNow) * 0.12;
    body.setCutaway(cutNow);
    setXray(zoomNow * (1 - exNow));      // đã bung ra rồi thì không cần nhìn xuyên nữa

    EXPLODE.forEach((l, i) => {
      l.g.position.copy(l.v).multiplyScalar(exNow);
      offsets[i] = l.g.position;
    });

    // từng chi tiết con rời khỏi nhóm của nó, mỗi cái trễ một nhịp
    const spread = Math.max(exNow, zoomNow * 0.45);
    for (const p of parts) {
      const t = Math.max(0, Math.min(1, (spread - p.delay) / (1 - p.delay)));
      const e = t * t * (3 - 2 * t);
      p.mesh.position.copy(p.base).addScaledVector(p.dir, e);
      p.mesh.rotation.z = p.baseRot + p.spin * e;
    }

    wheel.rotation.z += dt * 3.2;

    /* --- ngập nước và cơ chế ngắt ---
       Máng hứng nằm ở góc 30°, tức cao hơn tâm trục 210 mm. Để nước chạm được
       hai điện cực thì mặt nước phải dâng quá đó — tương đương ngập sâu khoảng
       60 cm tính từ mặt đường, đúng kịch bản ngập nặng trong đô thị. */
    const flooding = ui.state.flood || story.floodAuto;
    const wTarget = flooding ? FLOOD_Y : DRY_Y;
    water.position.y += (wTarget - water.position.y) * 0.05;
    water.position.y += Math.sin(time * 2.2) * 0.0004;

    const submerged = water.position.y > CUT_LEVEL;
    const live = ui.state.field && !submerged;

    if (!ui.state.field)      ui.setStatus('off');
    else if (submerged)       ui.setStatus('cut');
    else                      ui.setStatus('on');

    // giữ dưới ngưỡng bloom, nếu để màu nguyên bản thì đèn báo nở thành đốm trắng
    led.material.color.setHex(live ? 0x1d94ad : 0xa8443b);

    /* --- hồ quang --- */
    bolts.group.visible = live && exNow < 0.55;
    boltTimer += dt;
    if (bolts.group.visible && boltTimer > 0.055) { boltTimer = 0; bolts.refresh(); }

    /* --- hạt --- */
    particles.update(dt, live);
    ui.updateHUD(dt, particles.stats, live, time);

    /* --- nhãn kích thước --- */
    hotspots.update(camera, canvas, {
      labels: ui.state.labels, explode: exNow, zoom: zoomNow, offsets,
    });
    ui.setZoomHint(zoomNow);

    composer ? composer.render() : renderer.render(scene, camera);

    if (firstFrame) { firstFrame = false; loader.finish(); }
  }

  /* Tab chỉ được dựng ở đây, sau khi clock và resize đã tồn tại — nó gọi
     callback ngay lúc khởi tạo để mở tab đã lưu lần trước. */
  createTabs(id => {
    onScreen = id === 'p3d';
    if (onScreen) { clock.getDelta(); resize(); }
  });

  loader.set(0.95);
  resize();
  renderer.setAnimationLoop(frame);

  // tay cầm để soi cảnh khi phát triển tại máy
  if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
    window.TireGuard = { renderer, scene, camera, story, particles, ui, frame, resize };
  }

  // lưới an toàn: nếu khung hình đầu chậm bất thường, vẫn gỡ màn hình chờ
  setTimeout(() => loader.finish(), 6000);
}
