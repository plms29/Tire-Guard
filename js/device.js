import * as THREE from 'three';
import {
  MM, R_TIRE, R_ARCH, R_SHELL, W_ACT, W_TIRE,
  T_CORE, D_CELL, T_WALL, R_CORE_OUT, R_CORE_IN, R_PCB,
  A0, A1, Q,
} from './config.js';
import {
  carbonWeave, treadPattern, sidewallPattern,
  brushedMetal, flexPcb, honeycombFlat,
} from './textures.js';

const R_RIM = 255 * MM;          // bán kính vành mâm 20 inch
const TAU = Math.PI * 2;

/* ==========================================================================
   Tiện ích hình học
   ========================================================================== */

/** Quạt vành khuyên (rIn → rOut, a0 → a1) ép dày thành khối cong 3D. */
export function ringSectorGeo(rIn, rOut, a0, a1, depth, opts = {}) {
  const seg = opts.seg || 72;
  const s = new THREE.Shape();
  for (let i = 0; i <= seg; i++) {
    const a = a0 + (a1 - a0) * i / seg;
    const x = Math.cos(a) * rOut, y = Math.sin(a) * rOut;
    i ? s.lineTo(x, y) : s.moveTo(x, y);
  }
  for (let i = seg; i >= 0; i--) {
    const a = a0 + (a1 - a0) * i / seg;
    s.lineTo(Math.cos(a) * rIn, Math.sin(a) * rIn);
  }
  s.closePath();

  const b = opts.bevel || 0;
  const g = new THREE.ExtrudeGeometry(s, {
    depth: depth - b * 2,
    curveSegments: seg,
    bevelEnabled: b > 0,
    bevelThickness: b, bevelSize: b, bevelSegments: 2,
  });
  g.translate(0, 0, -(depth - b * 2) / 2);
  g.computeVertexNormals();
  return g;
}

/** Đặt một InstancedMesh quanh trục Z: n bản sao ở bán kính r, lệch z. */
function ringOfInstances(geo, mat, n, r, z, extraRot = 0, castShadow = false) {
  const mesh = new THREE.InstancedMesh(geo, mat, n);
  const d = new THREE.Object3D();
  for (let i = 0; i < n; i++) {
    const a = (i / n) * TAU + extraRot;
    d.position.set(Math.cos(a) * r, Math.sin(a) * r, z);
    d.rotation.set(0, 0, a - Math.PI / 2);
    d.updateMatrix();
    mesh.setMatrixAt(i, d.matrix);
  }
  mesh.instanceMatrix.needsUpdate = true;
  mesh.castShadow = castShadow;
  return mesh;
}

/* ==========================================================================
   Bánh xe — bối cảnh, nhưng là thứ người xem nhìn đầu tiên nên phải thật
   ========================================================================== */
export function buildWheel(castShadow) {
  const wheel = new THREE.Group();
  const detailed = Q.honeycomb === 'solid';   // máy yếu thì bỏ bớt chi tiết nhỏ

  /* ---- mặt lốp: vân gai làm gồ ghề bề mặt, khối gai thật tạo đường biên ---- */
  const treadBump = treadPattern();
  const rubber = new THREE.MeshStandardMaterial({
    color: 0x1a1d21, roughness: .97, metalness: .02,
    bumpMap: treadBump, bumpScale: 3.2,
  });
  const tread = new THREE.Mesh(
    new THREE.CylinderGeometry(R_TIRE, R_TIRE, W_TIRE, 128, 1, true), rubber
  );
  tread.rotation.x = Math.PI / 2;
  tread.castShadow = tread.receiveShadow = castShadow;
  wheel.add(tread);

  if (detailed) {
    // khối gai vai lốp — chỉ hai hàng ngoài cùng, vì chỉ chúng lộ ra ở đường biên
    const blockGeo = new THREE.BoxGeometry(26 * MM, 7 * MM, 46 * MM);
    [-1, 1].forEach(side => {
      const blocks = ringOfInstances(
        blockGeo, rubber, 76, R_TIRE - 1 * MM,
        side * (W_TIRE / 2 - 26 * MM), side > 0 ? 0 : 0.04, castShadow
      );
      wheel.add(blocks);
    });
  }

  /* ---- hông lốp: gân đồng tâm và chữ nổi ---- */
  const sidewallBump = sidewallPattern();
  const sidewall = new THREE.MeshStandardMaterial({
    color: 0x15181c, roughness: .93, metalness: .03,
    bumpMap: sidewallBump, bumpScale: 1.6, side: THREE.DoubleSide,
  });
  [-1, 1].forEach(s => {
    const w = new THREE.Mesh(new THREE.RingGeometry(R_RIM - 6 * MM, R_TIRE, 96), sidewall);
    w.position.z = s * W_TIRE / 2;
    w.rotation.y = s > 0 ? 0 : Math.PI;
    w.receiveShadow = castShadow;
    wheel.add(w);
  });

  /* ---- mâm hợp kim ---- */
  const rough = brushedMetal();
  const alloy = new THREE.MeshPhysicalMaterial({
    color: 0xaeb6bf, metalness: 1.0, roughness: .30, roughnessMap: rough,
    clearcoat: .55, clearcoatRoughness: .22,
  });
  const alloyDark = new THREE.MeshStandardMaterial({
    color: 0x3d444d, metalness: .85, roughness: .48, roughnessMap: rough,
  });

  const barrel = new THREE.Mesh(
    new THREE.CylinderGeometry(R_RIM, R_RIM, W_TIRE * 0.92, 72, 1, true), alloyDark
  );
  barrel.rotation.x = Math.PI / 2;
  wheel.add(barrel);

  const zFace = W_TIRE / 2 - 14 * MM;

  // vành ngoài mâm
  const lip = new THREE.Mesh(new THREE.TorusGeometry(R_RIM - 3 * MM, 7 * MM, 12, 84), alloy);
  lip.position.z = zFace + 4 * MM;
  lip.castShadow = castShadow;
  wheel.add(lip);

  // 5 chấu hình chữ Y, dựng từ biên dạng phẳng rồi ép dày
  const spoke = new THREE.Shape();
  spoke.moveTo(-22 * MM, 54 * MM);
  spoke.lineTo(22 * MM, 54 * MM);
  spoke.lineTo(30 * MM, 148 * MM);
  spoke.lineTo(44 * MM, 234 * MM);
  spoke.lineTo(16 * MM, 246 * MM);
  spoke.lineTo(-16 * MM, 246 * MM);
  spoke.lineTo(-44 * MM, 234 * MM);
  spoke.lineTo(-30 * MM, 148 * MM);
  spoke.closePath();
  const spokeGeo = new THREE.ExtrudeGeometry(spoke, {
    depth: 20 * MM, bevelEnabled: true,
    bevelThickness: 2.4 * MM, bevelSize: 2.4 * MM, bevelSegments: 2,
  });
  for (let i = 0; i < 5; i++) {
    const m = new THREE.Mesh(spokeGeo, alloy);
    m.rotation.z = i * TAU / 5;
    m.position.z = zFace - 20 * MM;
    m.castShadow = castShadow;
    wheel.add(m);
  }

  // moay-ơ, nắp chụp và 5 ốc
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(58 * MM, 62 * MM, 34 * MM, 40), alloyDark);
  hub.rotation.x = Math.PI / 2;
  hub.position.z = zFace - 14 * MM;
  wheel.add(hub);

  const cap = new THREE.Mesh(new THREE.CylinderGeometry(34 * MM, 34 * MM, 6 * MM, 32), alloy);
  cap.rotation.x = Math.PI / 2;
  cap.position.z = zFace + 3 * MM;
  wheel.add(cap);

  if (detailed) {
    const nutGeo = new THREE.CylinderGeometry(7 * MM, 7 * MM, 9 * MM, 6);
    const nuts = new THREE.InstancedMesh(nutGeo, alloyDark, 5);
    const d = new THREE.Object3D();
    for (let i = 0; i < 5; i++) {
      const a = i * TAU / 5 + 0.63;
      d.position.set(Math.cos(a) * 46 * MM, Math.sin(a) * 46 * MM, zFace + 2 * MM);
      d.rotation.set(Math.PI / 2, 0, 0);
      d.updateMatrix();
      nuts.setMatrixAt(i, d.matrix);
    }
    nuts.instanceMatrix.needsUpdate = true;
    wheel.add(nuts);
  }

  /* ---- đĩa phanh thông gió và cùm phanh ---- */
  const iron = new THREE.MeshStandardMaterial({ color: 0x4a5058, metalness: .92, roughness: .52 });
  const disc = new THREE.Mesh(new THREE.CylinderGeometry(176 * MM, 176 * MM, 22 * MM, 64, 1, true), iron);
  disc.rotation.x = Math.PI / 2;
  disc.position.z = zFace - 46 * MM;
  wheel.add(disc);
  [-1, 1].forEach(s => {
    const f = new THREE.Mesh(new THREE.RingGeometry(72 * MM, 176 * MM, 64), iron);
    f.position.z = zFace - 46 * MM + s * 11 * MM;
    f.rotation.y = s > 0 ? 0 : Math.PI;
    wheel.add(f);
  });
  if (detailed) {
    // lỗ khoan tản nhiệt
    const holeGeo = new THREE.CylinderGeometry(5 * MM, 5 * MM, 26 * MM, 10);
    const holeMat = new THREE.MeshStandardMaterial({ color: 0x14171b, roughness: .9, metalness: .2 });
    for (const r of [110 * MM, 145 * MM]) {
      const holes = new THREE.InstancedMesh(holeGeo, holeMat, 24);
      const d = new THREE.Object3D();
      for (let i = 0; i < 24; i++) {
        const a = i * TAU / 24 + (r > 120 * MM ? 0.13 : 0);
        d.position.set(Math.cos(a) * r, Math.sin(a) * r, zFace - 46 * MM);
        d.rotation.set(Math.PI / 2, 0, 0);
        d.updateMatrix();
        holes.setMatrixAt(i, d.matrix);
      }
      holes.instanceMatrix.needsUpdate = true;
      wheel.add(holes);
    }
  }

  return { group: wheel, discZ: zFace - 46 * MM };
}

/** Cùm phanh — gắn vào thân xe chứ không quay theo bánh. */
export function buildCaliper(discZ, castShadow) {
  const g = new THREE.Group();
  const body = new THREE.MeshStandardMaterial({ color: 0x23272d, metalness: .78, roughness: .42 });
  const shape = new THREE.Shape();
  const rIn = 150 * MM, rOut = 196 * MM, a0 = 2.5, a1 = 3.55;
  const seg = 24;
  for (let i = 0; i <= seg; i++) {
    const a = a0 + (a1 - a0) * i / seg;
    const x = Math.cos(a) * rOut, y = Math.sin(a) * rOut;
    i ? shape.lineTo(x, y) : shape.moveTo(x, y);
  }
  for (let i = seg; i >= 0; i--) {
    const a = a0 + (a1 - a0) * i / seg;
    shape.lineTo(Math.cos(a) * rIn, Math.sin(a) * rIn);
  }
  shape.closePath();
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 54 * MM, bevelEnabled: true,
    bevelThickness: 3 * MM, bevelSize: 3 * MM, bevelSegments: 2,
  });
  geo.translate(0, 0, -27 * MM);
  const mesh = new THREE.Mesh(geo, body);
  mesh.position.z = discZ;
  mesh.castShadow = castShadow;
  g.add(mesh);
  return g;
}

/* ==========================================================================
   Thân xe — vòm hốc bánh và tấm lót nhựa
   ========================================================================== */
export function buildBody(castShadow) {
  const body = new THREE.Group();
  const W = W_ACT + 90 * MM;

  const linerMat = new THREE.MeshStandardMaterial({
    color: 0x0a0e14, roughness: .96, metalness: .04, transparent: true,
  });
  const liner = new THREE.Mesh(
    ringSectorGeo(R_SHELL + 12 * MM, R_SHELL + 30 * MM, -0.30, 2.10, W),
    linerMat
  );
  liner.receiveShadow = castShadow;
  body.add(liner);

  const paint = new THREE.MeshPhysicalMaterial({
    color: 0x102a4c, roughness: .36, metalness: .52,
    clearcoat: .9, clearcoatRoughness: .22, transparent: true,
  });
  const fender = new THREE.Mesh(
    ringSectorGeo(R_SHELL + 30 * MM, R_SHELL + 155 * MM, -0.22, 2.05, W, { bevel: 2 * MM }),
    paint
  );
  fender.castShadow = castShadow;
  body.add(fender);

  [-1, 1].forEach(s => {
    const lip = new THREE.Mesh(
      new THREE.TorusGeometry(R_SHELL + 30 * MM, 10 * MM, 10, 72, 2.27), paint
    );
    lip.rotation.z = -0.22;
    lip.position.z = s * W / 2;
    body.add(lip);
  });

  /* Khi bung tách, vè và tấm lót mờ đi thành bản cắt lớp — nếu để đục thì
     thiết bị bị che kín, đúng thực tế nhưng không xem được gì. */
  const mats = [linerMat, paint];
  const setCutaway = (k) => {
    const o = 1 - 0.88 * k;
    mats.forEach(m => { m.opacity = o; m.depthWrite = o > 0.97; });
  };

  return { group: body, setCutaway };
}

/* ==========================================================================
   Thiết bị TireGuard — 5 lớp, mỗi lớp một Group để bung tách độc lập
   ========================================================================== */
export function buildDevice(castShadow) {
  const device = new THREE.Group();
  const layers = {};
  const layer = (name) => {
    const g = new THREE.Group();
    g.name = name;
    device.add(g);
    layers[name] = g;
    return g;
  };

  /* Chuyển động tách khối phụ. Năm nhóm lớn tách ra theo pháp tuyến, còn từng
     chi tiết con lại rời khỏi nhóm của nó thêm một đoạn nữa, mỗi cái trễ một
     nhịp khác nhau và xoay nhẹ. Nhờ vậy một khối đặc vỡ dần ra thành mười mấy
     mảnh thay vì năm tấm trượt song song. */
  const parts = [];
  const detach = (mesh, dir, { delay = 0, spin = 0, axis = 'z' } = {}) => {
    parts.push({
      mesh,
      base: mesh.position.clone(),
      dir: dir.clone(),
      delay,
      spin,
      axis,
      baseRot: mesh.rotation.z,
    });
    return mesh;
  };

  /* ---- (a) VỎ CARBON — 415 → 445 mm, cung 30–75° ---- */
  const shell = layer('shell');
  const weave = carbonWeave();
  const carbon = new THREE.MeshPhysicalMaterial({
    color: 0x555b63, map: weave.map, bumpMap: weave.bump, bumpScale: 0.45,
    roughness: .55, metalness: .14,
    clearcoat: .7, clearcoatRoughness: .42,
  });
  const shellMesh = new THREE.Mesh(
    ringSectorGeo(R_ARCH, R_SHELL, A0, A1, W_ACT + 30 * MM, { bevel: 1.2 * MM }),
    carbon
  );
  shellMesh.castShadow = shellMesh.receiveShadow = castShadow;
  shell.add(shellMesh);

  const ribMat = new THREE.MeshPhysicalMaterial({
    color: 0x2b3644, roughness: .52, metalness: .55, clearcoat: .35,
  });
  [-1, 1].forEach(s => {
    const rib = new THREE.Mesh(
      ringSectorGeo(R_ARCH - 4 * MM, R_SHELL + 4 * MM, A0, A1, 12 * MM, { bevel: 0.8 * MM }),
      ribMat
    );
    rib.position.z = s * (W_ACT + 30 * MM) / 2;
    rib.castShadow = castShadow;
    shell.add(rib);
    detach(rib, new THREE.Vector3(0, 0, s * 0.075), { delay: 0.10, spin: 0.10 });
  });
  [-1, 1].forEach(s => {
    const rail = new THREE.Mesh(
      ringSectorGeo(R_ARCH - 5 * MM, R_ARCH, A0 + 0.02, A1 - 0.02, 8 * MM), ribMat
    );
    rail.position.z = s * (W_ACT / 2 - 6 * MM);
    shell.add(rail);
    detach(rail, new THREE.Vector3(0, 0, s * 0.045), { delay: 0.28, spin: -0.08 });
  });

  /* ---- (b) LÕI TỔ ONG — 15 mm, ô lục giác 3 mm, vách 0,5 mm ---- */
  const core = layer('core');
  if (Q.honeycomb === 'solid') {
    core.add(buildHoneycomb(castShadow));
  } else {
    const flatMat = new THREE.MeshStandardMaterial({
      map: honeycombFlat(), roughness: .72, metalness: .3,
      emissive: 0x0a2a3a, emissiveIntensity: .5,
    });
    core.add(new THREE.Mesh(ringSectorGeo(R_CORE_IN, R_CORE_OUT, A0, A1, W_ACT), flatMat));
  }

  /* ---- (c) BẢN CỰC MẠCH DẺO — rộng 260 mm ---- */
  const pcb = layer('pcb');
  const flex = flexPcb();
  const pcbMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff, map: flex.map, bumpMap: flex.bump, bumpScale: 1.4,
    roughness: .34, metalness: .92,
    clearcoat: .35, clearcoatRoughness: .3,
  });
  const pcbMesh = new THREE.Mesh(
    ringSectorGeo(R_PCB, R_PCB + 1.5 * MM, A0, A1, W_ACT, { bevel: 0.4 * MM }),
    pcbMat
  );
  pcbMesh.castShadow = castShadow;
  pcb.add(pcbMesh);
  const comps = buildComponents();
  pcb.add(comps);
  detach(comps, new THREE.Vector3(0.020, 0.026, 0), { delay: 0.46, spin: 0.06 });

  /* ---- (d) MÁNG HỨNG + HỘP CẢM BIẾN IP68, tại điểm thấp nhất 30° ---- */
  const tray = layer('tray');
  const trayMat = new THREE.MeshStandardMaterial({ color: 0x232c38, roughness: .55, metalness: .45 });

  const trayPos = new THREE.Vector3(
    Math.cos(A0 + 0.05) * (R_ARCH - 28 * MM),
    Math.sin(A0 + 0.05) * (R_ARCH - 28 * MM),
    0
  );

  const trayMesh = new THREE.Mesh(new THREE.BoxGeometry(40 * MM, 20 * MM, W_ACT), trayMat);
  trayMesh.position.copy(trayPos);
  trayMesh.rotation.z = A0;
  trayMesh.castShadow = castShadow;
  tray.add(trayMesh);

  const sensor = new THREE.Mesh(
    new THREE.BoxGeometry(50 * MM, 15 * MM, 30 * MM),
    new THREE.MeshStandardMaterial({ color: 0x11161d, roughness: .45, metalness: .55 })
  );
  sensor.position.copy(trayPos).add(new THREE.Vector3(12 * MM, -20 * MM, 60 * MM));
  sensor.castShadow = castShadow;
  tray.add(sensor);
  detach(sensor, new THREE.Vector3(0.04, -0.05, 0.05), { delay: 0.34, spin: 0.22 });

  const led = new THREE.Mesh(
    new THREE.SphereGeometry(4 * MM, 14, 14),
    new THREE.MeshBasicMaterial({ color: 0x1d94ad })
  );
  led.position.copy(sensor.position).add(new THREE.Vector3(20 * MM, 6 * MM, 16 * MM));
  tray.add(led);

  const pinMat = new THREE.MeshStandardMaterial({ color: 0x9aa5b1, metalness: 1, roughness: .3 });
  [-1, 1].forEach(s => {
    const pin = new THREE.Mesh(new THREE.CylinderGeometry(1.6 * MM, 1.6 * MM, 8 * MM, 10), pinMat);
    pin.position.copy(sensor.position).add(new THREE.Vector3(s * 12 * MM, 11 * MM, 0));
    tray.add(pin);
  });

  const latch = new THREE.Mesh(new THREE.BoxGeometry(20 * MM, 6 * MM, 24 * MM), trayMat);
  latch.position.copy(trayPos).add(new THREE.Vector3(-16 * MM, 4 * MM, -W_ACT / 2 + 20 * MM));
  latch.rotation.z = A0;
  tray.add(latch);
  detach(latch, new THREE.Vector3(-0.05, 0.01, -0.06), { delay: 0.52, spin: -0.3 });

  /* ---- (e) NGÀM GÁ hai đầu cung ---- */
  const bracket = layer('bracket');
  const brkMat = new THREE.MeshPhysicalMaterial({
    color: 0x555f6b, roughness: .55, metalness: .72, clearcoat: .2,
  });
  const boltMat = new THREE.MeshStandardMaterial({ color: 0x424b55, metalness: .9, roughness: .45 });
  [A0, A1].forEach((a, ai) => {
    [-1, 1].forEach((s, si) => {
      const b = new THREE.Mesh(new THREE.BoxGeometry(55 * MM, 12 * MM, 28 * MM), brkMat);
      b.position.set(
        Math.cos(a) * (R_SHELL + 12 * MM),
        Math.sin(a) * (R_SHELL + 12 * MM),
        s * (W_ACT / 2 - 20 * MM)
      );
      b.rotation.z = a;
      b.castShadow = castShadow;
      bracket.add(b);
      detach(b, new THREE.Vector3(Math.cos(a) * 0.05, Math.sin(a) * 0.05, s * 0.05),
        { delay: 0.14 + ai * 0.10 + si * 0.06, spin: 0.18 });

      const bolt = new THREE.Mesh(new THREE.CylinderGeometry(5 * MM, 5 * MM, 16 * MM, 6), boltMat);
      bolt.position.copy(b.position);
      bolt.rotation.z = a + Math.PI / 2;
      bracket.add(bolt);
      detach(bolt, new THREE.Vector3(Math.cos(a) * 0.10, Math.sin(a) * 0.10, s * 0.09),
        { delay: 0.06, spin: 0.9 });
    });
  });

  /* Nhìn xuyên: khi zoom sâu, tấm vỏ mờ đi để lộ lõi tổ ong và bản cực bên
     trong mà không cần phải bung tách. */
  const xrayMats = [carbon, ribMat];
  xrayMats.forEach(m => { m.transparent = true; });
  const setXray = (k) => {
    const o = 1 - 0.80 * k;
    xrayMats.forEach(m => { m.opacity = o; m.depthWrite = o > 0.97; });
  };

  return { device, layers, led, trayPos, parts, setXray };
}

/* --------------------------------------------------------------------------
   Lõi tổ ong thật: mỗi ô là một ống lục giác đặt trên mặt trụ.
   -------------------------------------------------------------------------- */
function buildHoneycomb(castShadow) {
  const group = new THREE.Group();

  const flat  = D_CELL * Q.cellScale;
  const rHex  = flat / Math.sqrt(3);
  const rMid  = (R_CORE_IN + R_CORE_OUT) / 2;

  const colStep = rHex * 1.5;
  const rowStep = flat;
  const cols = Math.max(1, Math.floor((rMid * (A1 - A0)) / colStep));
  const rows = Math.max(1, Math.floor((W_ACT - flat) / rowStep));

  const cellGeo = new THREE.CylinderGeometry(
    rHex - T_WALL / 2, rHex - T_WALL / 2, T_CORE, 6, 1, true
  );
  const cellMat = new THREE.MeshStandardMaterial({
    color: 0x6e7f90, roughness: .48, metalness: .62,
    emissive: 0x123f52, emissiveIntensity: .55,
    side: THREE.DoubleSide, flatShading: true,
  });

  const cells = new THREE.InstancedMesh(cellGeo, cellMat, cols * rows);
  cells.castShadow = castShadow;
  const d = new THREE.Object3D();

  let i = 0;
  for (let c = 0; c < cols; c++) {
    const a = A0 + (c * colStep) / rMid;
    if (a > A1) break;
    for (let r = 0; r < rows; r++) {
      const z = -W_ACT / 2 + flat / 2 + r * rowStep + (c % 2 ? rowStep / 2 : 0);
      if (z > W_ACT / 2) continue;
      d.position.set(Math.cos(a) * rMid, Math.sin(a) * rMid, z);
      d.rotation.set(0, 0, a - Math.PI / 2);
      d.updateMatrix();
      cells.setMatrixAt(i++, d.matrix);
    }
  }
  cells.count = i;
  cells.instanceMatrix.needsUpdate = true;
  group.add(cells);

  const back = new THREE.Mesh(
    ringSectorGeo(R_CORE_IN - 0.8 * MM, R_CORE_IN, A0, A1, W_ACT),
    new THREE.MeshStandardMaterial({ color: 0x0d1522, roughness: .85, metalness: .2 })
  );
  back.receiveShadow = castShadow;
  group.add(back);

  return group;
}

/** Linh kiện dán nổi trên bản cực. */
function buildComponents() {
  const geo = new THREE.BoxGeometry(7 * MM, 2.5 * MM, 4 * MM);
  const mat = new THREE.MeshStandardMaterial({ color: 0x171c23, roughness: .5, metalness: .55 });
  const n = 44;
  const mesh = new THREE.InstancedMesh(geo, mat, n);
  const d = new THREE.Object3D();
  const r = R_PCB + 2.4 * MM;
  for (let i = 0; i < n; i++) {
    const a = A0 + 0.04 + (A1 - A0 - 0.08) * (i % 11) / 10;
    const z = -W_ACT / 2 + 30 * MM + Math.floor(i / 11) * (W_ACT - 60 * MM) / 3;
    d.position.set(Math.cos(a) * r, Math.sin(a) * r, z);
    d.rotation.set(0, 0, a - Math.PI / 2);
    d.updateMatrix();
    mesh.setMatrixAt(i, d.matrix);
  }
  mesh.instanceMatrix.needsUpdate = true;
  return mesh;
}
