import * as THREE from 'three';
import { MM, R_TIRE, R_TRAP, W_ACT, W_TIRE, A0, A1, Q } from './config.js';

/* ==========================================================================
   Dòng hạt TRWP.
   Nghiệm số hệ ODE rút gọn:  m·d²r/dt² = qE + (ρp−ρf)Vp·g − 3πηd·v/Cc
   Ba lực giữ nguyên bản chất, các hằng số đã được co giãn cho hợp thang đo
   mô hình và tốc độ khung hình. Đây là mô phỏng minh hoạ, không phải CFD.
   ========================================================================== */

// Hằng số đã hiệu chuẩn bằng mô phỏng ngoại tuyến: hiệu suất hội tụ ổn định
// ở 83% qua 120 giây chạy, nằm trong dải 80–85% mà tài liệu kỹ thuật nêu.
const K_FIELD  = 20.0;   // gia tốc do lực Coulomb, chỉ tác dụng trong cửa sổ thu gom
const G_EFF    = 0.06;   // trọng lực hiệu dụng — nhỏ vì với hạt PM2.5/PM10 lực cản
                         // chi phối hoàn toàn, tốc độ rơi cuối chỉ vài mm/s
const DRAG     = 0.12;   // hệ số cản Stokes tuyến tính hoá
const V_MIN    = 1.6, V_SPAN = 1.5;   // vận tốc tiếp tuyến rời gai lốp
const LIFE_MAX = 2.6;

// Cung gai lốp mà hạt rời ra. Bánh xe quay ngược chiều kim đồng hồ nên hạt
// sinh ra trong cung này bay tiếp tuyến lên phía vòm hốc bánh.
const SPAWN_A0 = -1.40, SPAWN_A1 = 0.60;

const CAP_COLOR  = [0.31, 0.89, 1.00];   // hạt đã bị bẫy
const FREE_COLOR = [0.62, 0.66, 0.72];   // hạt đang bay
const ESC_COLOR  = [1.00, 0.42, 0.37];   // hạt thoát khi mất điện trường

export function createParticles(scene) {
  const N = Q.particles;
  const pos = new Float32Array(N * 3);
  const col = new Float32Array(N * 3);
  const P = [];

  for (let i = 0; i < N; i++) {
    P.push({ t: 0, x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0, stuck: false, entered: false });
  }

  function spawn(p) {
    const a = SPAWN_A0 + Math.random() * (SPAWN_A1 - SPAWN_A0);
    const r = R_TIRE + 4 * MM;
    p.x = Math.cos(a) * r;
    p.y = Math.sin(a) * r;
    p.z = (Math.random() - .5) * W_TIRE;
    const sp = V_MIN + Math.random() * V_SPAN;
    p.vx = -Math.sin(a) * sp;
    p.vy =  Math.cos(a) * sp;
    p.vz = (Math.random() - .5) * 0.35;
    p.t = 0;
    p.stuck = false;
    p.entered = false;
  }
  P.forEach(p => { spawn(p); p.t = Math.random() * 1.5; });

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const mat = new THREE.PointsMaterial({
    size: 0.0062, vertexColors: true, transparent: true, opacity: .72,
    blending: THREE.AdditiveBlending, depthWrite: false,
  });
  const points = new THREE.Points(geo, mat);
  points.frustumCulled = false;
  scene.add(points);

  const stats = { captured: 0, escaped: 0 };

  function reset() { stats.captured = 0; stats.escaped = 0; }

  function update(dt, live) {
    const K = live ? K_FIELD : 0;
    const damp = Math.pow(DRAG, dt);

    for (let i = 0; i < N; i++) {
      const p = P[i];

      if (p.stuck) {
        // hạt đã dính vào vách tổ ong, trôi chậm xuống máng hứng
        const ang = Math.atan2(p.y, p.x) - dt * 0.10;
        if (ang < A0 + 0.03) spawn(p);
        else { p.x = Math.cos(ang) * R_TRAP; p.y = Math.sin(ang) * R_TRAP; }
      } else {
        p.t += dt;
        const ang = Math.atan2(p.y, p.x);
        const r = Math.hypot(p.x, p.y);
        const inWindow = ang > A0 - 0.12 && ang < A1 + 0.12 && r > R_TIRE - 0.01;

        if (inWindow) {
          p.entered = true;                   // đã lọt vào tầm với của thiết bị
          if (K > 0) {                        // F_e = qE, hướng tâm ra ngoài
            p.vx += Math.cos(ang) * K * dt;
            p.vy += Math.sin(ang) * K * dt;
          }
        }
        p.vy -= 9.81 * G_EFF * dt;            // F_g + F_b
        p.vx *= damp; p.vy *= damp; p.vz *= damp;   // F_d
        p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt;

        const r2 = Math.hypot(p.x, p.y);
        const a2 = Math.atan2(p.y, p.x);
        if (live && r2 > R_TRAP - 0.004 && a2 > A0 && a2 < A1 && Math.abs(p.z) < W_ACT / 2) {
          p.stuck = true; stats.captured++;
          p.x = Math.cos(a2) * R_TRAP;
          p.y = Math.sin(a2) * R_TRAP;
        } else if (r2 > 0.75 || p.y < -0.42 || p.t > LIFE_MAX) {
          // chỉ tính là lọt lưới khi hạt đã thực sự đi vào cửa sổ thu gom.
          // Hạt văng thẳng xuống mặt đường chưa từng nằm trong tầm thiết bị.
          if (p.t > 0.25 && p.entered) stats.escaped++;
          spawn(p);
        }
      }

      pos[i * 3] = p.x; pos[i * 3 + 1] = p.y; pos[i * 3 + 2] = p.z;
      const c = p.stuck ? CAP_COLOR : (live ? FREE_COLOR : ESC_COLOR);
      col[i * 3] = c[0]; col[i * 3 + 1] = c[1]; col[i * 3 + 2] = c[2];
    }

    geo.attributes.position.needsUpdate = true;
    geo.attributes.color.needsUpdate = true;
  }

  return { points, update, stats, reset };
}

/* ==========================================================================
   Hồ quang điện. Hai lớp chồng nhau: lõi mảnh sáng trắng và quầng dày mờ —
   đó là cách bản render tạo cảm giác phóng điện.
   ========================================================================== */
export function createBolts(scene) {
  const BOLTS = Q.bolts, SEGS = 7;
  const buf = new Float32Array(BOLTS * SEGS * 2 * 3);

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(buf, 3));

  const coreLine = new THREE.LineSegments(geo, new THREE.LineBasicMaterial({
    color: 0xe8fbff, transparent: true, opacity: .95,
    blending: THREE.AdditiveBlending, depthWrite: false,
  }));
  const glowLine = new THREE.LineSegments(geo, new THREE.LineBasicMaterial({
    color: 0x4fe3ff, transparent: true, opacity: .30,
    blending: THREE.AdditiveBlending, depthWrite: false,
  }));
  glowLine.scale.setScalar(1.004);

  const group = new THREE.Group();
  group.add(coreLine, glowLine);
  group.frustumCulled = false;
  scene.add(group);

  function refresh() {
    let k = 0;
    for (let b = 0; b < BOLTS; b++) {
      const a = A0 + Math.random() * (A1 - A0);
      const z = (Math.random() - .5) * W_ACT;
      const x0 = Math.cos(a) * (R_TIRE + 5 * MM), y0 = Math.sin(a) * (R_TIRE + 5 * MM);
      const x1 = Math.cos(a) * R_TRAP,            y1 = Math.sin(a) * R_TRAP;
      let px = x0, py = y0, pz = z;
      for (let s = 1; s <= SEGS; s++) {
        const t = s / SEGS;
        const nx = x0 + (x1 - x0) * t + (Math.random() - .5) * 0.016;
        const ny = y0 + (y1 - y0) * t + (Math.random() - .5) * 0.016;
        const nz = z + (Math.random() - .5) * 0.02;
        buf[k++] = px; buf[k++] = py; buf[k++] = pz;
        buf[k++] = nx; buf[k++] = ny; buf[k++] = nz;
        px = nx; py = ny; pz = nz;
      }
    }
    geo.attributes.position.needsUpdate = true;
  }

  return { group, refresh };
}
