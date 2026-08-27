import * as THREE from 'three';

/* ==========================================================================
   Vân bề mặt sinh bằng Canvas.
   Không tải ảnh từ ngoài — trang phải chạy được khi mất mạng. Mỗi vân trả về
   kèm một bản xám dùng làm bumpMap, vì thứ khiến vật liệu trông thật không
   phải màu mà là cách ánh sáng gãy trên bề mặt gồ ghề.
   ========================================================================== */

function canvas(w, h) {
  const cv = document.createElement('canvas');
  cv.width = w; cv.height = h;
  return [cv, cv.getContext('2d')];
}

function toTexture(cv, { repeat = [1, 1], srgb = false } = {}) {
  const t = new THREE.CanvasTexture(cv);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeat[0], repeat[1]);
  t.anisotropy = 8;
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/* --------------------------------------------------------------------------
   Sợi carbon dệt chéo 2/2 — ô vuông đan xen, mỗi ô có gradient dọc theo
   hướng sợi để bắt được ánh kim đặc trưng của carbon phủ epoxy.
   -------------------------------------------------------------------------- */
export function carbonWeave(size = 512, cell = 16) {
  const [cv, x] = canvas(size, size);
  const [bv, b] = canvas(size, size);
  x.fillStyle = '#0b0e13'; x.fillRect(0, 0, size, size);
  b.fillStyle = '#808080'; b.fillRect(0, 0, size, size);

  const n = size / cell;
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      // dệt 2/2: hai ô ngang rồi hai ô dọc
      const warp = (Math.floor(r / 2) + Math.floor(c / 2)) % 2 === 0;
      const px = c * cell, py = r * cell;

      const g = warp
        ? x.createLinearGradient(px, py, px + cell, py)
        : x.createLinearGradient(px, py, px, py + cell);
      g.addColorStop(0.00, '#080a0e');
      g.addColorStop(0.35, '#232a34');
      g.addColorStop(0.55, '#2f3947');
      g.addColorStop(1.00, '#0a0d12');
      x.fillStyle = g;
      x.fillRect(px, py, cell, cell);

      const gb = warp
        ? b.createLinearGradient(px, py, px + cell, py)
        : b.createLinearGradient(px, py, px, py + cell);
      gb.addColorStop(0.0, '#4a4a4a');
      gb.addColorStop(0.5, '#c8c8c8');
      gb.addColorStop(1.0, '#4a4a4a');
      b.fillStyle = gb;
      b.fillRect(px, py, cell, cell);
    }
  }
  // vệt nhiễu rất nhẹ để bề mặt không quá đều
  const img = x.getImageData(0, 0, size, size);
  for (let i = 0; i < img.data.length; i += 4) {
    const d = (Math.random() - 0.5) * 10;
    img.data[i] += d; img.data[i + 1] += d; img.data[i + 2] += d;
  }
  x.putImageData(img, 0, 0);

  // Sợi carbon dệt thật có ô cỡ 3–5 mm. Trên tấm vỏ dài 325 mm rộng 290 mm,
  // lặp ít thì ra tôn dập chứ không ra carbon.
  const rep = [30, 26];
  return { map: toTexture(cv, { repeat: rep, srgb: true }), bump: toTexture(bv, { repeat: rep }) };
}

/* --------------------------------------------------------------------------
   Mặt lốp: rãnh dọc chính, khối gai so le, rãnh ngang thoát nước.
   Dùng làm bumpMap trên mặt trụ; phần silhouette do khối gai thật đảm nhiệm.
   -------------------------------------------------------------------------- */
export function treadPattern(w = 1024, h = 512) {
  const [cv, x] = canvas(w, h);
  x.fillStyle = '#2b2b2b'; x.fillRect(0, 0, w, h);   // nền = cao độ gai

  x.fillStyle = '#000000';                            // rãnh = thấp
  const grooves = [0.14, 0.38, 0.62, 0.86];
  grooves.forEach(g => x.fillRect(0, g * h - 11, w, 22));

  // rãnh ngang so le giữa các dải gai
  const lanes = [[0.14, 0.38], [0.38, 0.62], [0.62, 0.86]];
  lanes.forEach(([a, bb], li) => {
    const y0 = a * h + 11, y1 = bb * h - 11;
    for (let i = 0; i < 34; i++) {
      const px = (i + (li % 2 ? 0.5 : 0)) * (w / 34);
      x.save();
      x.translate(px, (y0 + y1) / 2);
      x.rotate(li % 2 ? 0.22 : -0.22);
      x.fillRect(-5, -(y1 - y0) / 2, 10, y1 - y0);
      x.restore();
    }
  });

  // vai lốp
  x.fillStyle = '#111111';
  x.fillRect(0, 0, w, 8); x.fillRect(0, h - 8, w, 8);

  return toTexture(cv, { repeat: [1, 1] });
}

/* --------------------------------------------------------------------------
   Hông lốp: gân tròn đồng tâm, vành chữ nổi và dòng ký hiệu kích cỡ.
   -------------------------------------------------------------------------- */
export function sidewallPattern(size = 1024) {
  const [cv, x] = canvas(size, size);
  const c = size / 2;
  x.fillStyle = '#7a7a7a'; x.fillRect(0, 0, size, size);

  for (let r = c * 0.62; r < c; r += 3.5) {           // gân đồng tâm mảnh
    x.beginPath(); x.arc(c, c, r, 0, Math.PI * 2);
    x.strokeStyle = r % 7 < 3.5 ? '#8d8d8d' : '#6a6a6a';
    x.lineWidth = 2; x.stroke();
  }

  x.beginPath(); x.arc(c, c, c * 0.90, 0, Math.PI * 2);   // gờ nổi ngoài
  x.strokeStyle = '#a8a8a8'; x.lineWidth = 12; x.stroke();

  // chữ nổi chạy quanh vành
  x.save();
  x.translate(c, c);
  x.fillStyle = '#c4c4c4';
  x.font = `bold ${Math.round(size * 0.038)}px "JetBrains Mono", monospace`;
  x.textAlign = 'center'; x.textBaseline = 'middle';
  const label = '245/45 R20  ·  TIREGUARD  ·  ';
  const rr = c * 0.78;
  for (let i = 0; i < 3; i++) {
    for (let k = 0; k < label.length; k++) {
      const a = (i * 2 * Math.PI / 3) + (k / label.length) * (2 * Math.PI / 3);
      x.save();
      x.rotate(a);
      x.translate(0, -rr);
      x.rotate(Math.PI);
      x.fillText(label[k], 0, 0);
      x.restore();
    }
  }
  x.restore();

  return toTexture(cv, { repeat: [1, 1] });
}

/* --------------------------------------------------------------------------
   Nhôm xước: vệt xước theo phương xuyên tâm, dùng làm roughnessMap để mâm xe
   không phản chiếu đều như gương nhựa.
   -------------------------------------------------------------------------- */
export function brushedMetal(size = 512) {
  const [cv, x] = canvas(size, size);
  const c = size / 2;
  x.fillStyle = '#6e6e6e'; x.fillRect(0, 0, size, size);
  for (let i = 0; i < 2600; i++) {
    const a = Math.random() * Math.PI * 2;
    const r0 = Math.random() * c;
    const len = 6 + Math.random() * 34;
    x.strokeStyle = `rgba(${Math.random() > .5 ? 255 : 0},${Math.random() > .5 ? 255 : 0},${Math.random() > .5 ? 255 : 0},0.045)`;
    x.lineWidth = 0.6 + Math.random();
    x.beginPath();
    x.moveTo(c + Math.cos(a) * r0, c + Math.sin(a) * r0);
    x.lineTo(c + Math.cos(a) * (r0 + len), c + Math.sin(a) * (r0 + len));
    x.stroke();
  }
  return toTexture(cv, { repeat: [1, 1] });
}

/* --------------------------------------------------------------------------
   Mạch dẻo phủ đồng: đường mạch, chip, linh kiện dán, pad tiếp xúc.
   Trả về cả bản xám để linh kiện nổi gờ lên khỏi mặt board.
   -------------------------------------------------------------------------- */
export function flexPcb(w = 1024, h = 256) {
  const [cv, x] = canvas(w, h);
  const [bv, b] = canvas(w, h);
  x.fillStyle = '#8d5a2f'; x.fillRect(0, 0, w, h);
  b.fillStyle = '#3a3a3a'; b.fillRect(0, 0, w, h);

  // đường mạch chạy theo phương ngang, bẻ góc vuông như mạch in thật
  for (let i = 0; i < 46; i++) {
    let px = Math.random() * w, py = 16 + Math.random() * (h - 32);
    x.strokeStyle = '#c98d4e'; x.lineWidth = 2.4;
    b.strokeStyle = '#6a6a6a'; b.lineWidth = 2.4;
    x.beginPath(); x.moveTo(px, py);
    b.beginPath(); b.moveTo(px, py);
    for (let k = 0; k < 5; k++) {
      const horiz = k % 2 === 0;
      px += horiz ? (Math.random() - .3) * 150 : 0;
      py += horiz ? 0 : (Math.random() - .5) * 60;
      x.lineTo(px, py); b.lineTo(px, py);
    }
    x.stroke(); b.stroke();
  }

  const chip = (cx, cy, cw, ch) => {
    x.fillStyle = '#15181d'; x.fillRect(cx, cy, cw, ch);
    b.fillStyle = '#e8e8e8'; b.fillRect(cx, cy, cw, ch);
    x.fillStyle = '#8d99a8'; b.fillStyle = '#bdbdbd';
    for (let i = 0; i < Math.floor(ch / 9); i++) {
      x.fillRect(cx - 8, cy + 6 + i * 9, 8, 4);
      x.fillRect(cx + cw, cy + 6 + i * 9, 8, 4);
      b.fillRect(cx - 8, cy + 6 + i * 9, 8, 4);
      b.fillRect(cx + cw, cy + 6 + i * 9, 8, 4);
    }
  };
  chip(300, 86, 74, 70);
  chip(640, 92, 58, 58);

  for (let i = 0; i < 22; i++) {                 // tụ và điện trở dán
    const cx = 40 + i * 44, cy = 186 + (i % 2) * 22;
    x.fillStyle = i % 3 ? '#1d232b' : '#3a2a12'; x.fillRect(cx, cy, 26, 14);
    b.fillStyle = '#d0d0d0'; b.fillRect(cx, cy, 26, 14);
  }
  for (let i = 0; i < 26; i++) {                 // pad tiếp xúc mạ vàng
    x.fillStyle = '#e8c07a'; x.fillRect(26 + i * 38, 20, 20, 12);
    b.fillStyle = '#9a9a9a'; b.fillRect(26 + i * 38, 20, 20, 12);
  }

  return { map: toTexture(cv, { srgb: true }), bump: toTexture(bv) };
}

/* --------------------------------------------------------------------------
   Mặt sàn mờ dần ra rìa. Một mặt phẳng đục sẽ để lộ đường chân trời cắt ngang
   khung hình như một mảng xám; tán dần về trong suốt thì nó chìm vào nền.
   -------------------------------------------------------------------------- */
export function floorFade(size = 512) {
  const [cv, x] = canvas(size, size);
  const c = size / 2;
  const g = x.createRadialGradient(c, c, 0, c, c, c);
  g.addColorStop(0.00, '#ffffff');
  g.addColorStop(0.45, '#c8c8c8');
  g.addColorStop(0.78, '#2a2a2a');
  g.addColorStop(1.00, '#000000');
  x.fillStyle = g;
  x.fillRect(0, 0, size, size);
  const t = new THREE.CanvasTexture(cv);
  t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
  return t;
}

/* --------------------------------------------------------------------------
   Lưới tổ ong vẽ phẳng — chỉ dùng cho máy yếu, thay cho hàng nghìn ô dựng thật.
   -------------------------------------------------------------------------- */
export function honeycombFlat(size = 512) {
  const [cv, x] = canvas(size, size);
  x.fillStyle = '#0d1522'; x.fillRect(0, 0, size, size);
  const r = 13, h = Math.sqrt(3) / 2 * r;
  x.lineWidth = 2.2;
  for (let row = 0; row < size / h + 2; row++) {
    for (let col = 0; col < size / (r * 1.5) + 2; col++) {
      const cx = col * r * 1.5, cy = row * h * 2 + (col % 2 ? h : 0);
      x.beginPath();
      for (let k = 0; k < 6; k++) {
        const a = Math.PI / 3 * k;
        const px = cx + Math.cos(a) * r, py = cy + Math.sin(a) * r;
        k ? x.lineTo(px, py) : x.moveTo(px, py);
      }
      x.closePath();
      x.strokeStyle = '#54677d'; x.stroke();
      x.fillStyle = '#070c14'; x.fill();
    }
  }
  return toTexture(cv, { repeat: [6, 3], srgb: true });
}
