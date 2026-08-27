/* ==========================================================================
   Hằng số hình học — lấy thẳng từ bảng thông số CAD (mm → m).
   Three.js làm việc bằng mét, nên mọi số mm nhân với MM.
   ========================================================================== */
export const MM = 0.001;

export const R_TIRE  = 365 * MM;   // bán kính ngoài lốp 245/45 R20
export const R_ARCH  = 415 * MM;   // bán kính vòm trong hốc bánh
export const R_SHELL = 445 * MM;   // bán kính vỏ ngoài (vỏ dày 10 mm + gờ)
export const W_ACT   = 260 * MM;   // bề rộng bản cực
export const W_TIRE  = 245 * MM;   // bề rộng mặt lốp
export const T_CORE  =  15 * MM;   // bề dày lõi tổ ong
export const D_CELL  =   3 * MM;   // ô lục giác, đo cạnh-đối-cạnh
export const T_WALL  = 0.5 * MM;   // vách ngăn lục giác

export const D2R  = Math.PI / 180;
export const A0   = 30 * D2R;      // đầu cung thu gom
export const A1   = 75 * D2R;      // cuối cung thu gom
export const AMID = (A0 + A1) / 2;

export const R_CORE_OUT = R_ARCH - 1 * MM;
export const R_CORE_IN  = R_CORE_OUT - T_CORE;
export const R_PCB      = R_CORE_IN - 3 * MM;
export const R_TRAP     = R_ARCH - 20 * MM;   // mặt bẫy hạt

export const reducedMotion =
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* --------------------------------------------------------------------------
   Phân hạng máy. Máy yếu vẫn phải xem được, chỉ là ít hạt và không bloom.
   -------------------------------------------------------------------------- */
function detectTier() {
  const mem   = navigator.deviceMemory || 4;
  const cores = navigator.hardwareConcurrency || 4;
  const small = Math.min(window.innerWidth, window.innerHeight) < 700;
  if (mem <= 2 || cores <= 2 || (small && cores <= 4)) return 'low';
  if (mem <= 4 || cores <= 4 || small)                 return 'mid';
  return 'high';
}

// ?q=low|mid|high để ép mức đồ hoạ khi cần thử trên máy khác
const forced = new URLSearchParams(location.search).get('q');
export const TIER = ['low', 'mid', 'high'].includes(forced) ? forced : detectTier();

export const Q = {
  low:  { particles: 320,  bloom: false, shadows: false, honeycomb: 'flat',  cellScale: 1,   pixelRatio: 1.25, bolts: 8  },
  mid:  { particles: 700,  bloom: true,  shadows: true,  honeycomb: 'solid', cellScale: 1.7, pixelRatio: 1.75, bolts: 12 },
  high: { particles: 1100, bloom: true,  shadows: true,  honeycomb: 'solid', cellScale: 1,   pixelRatio: 2,    bolts: 16 },
}[TIER];

// Trên màn hình điện thoại, bloom là khoản tốn nhất và cũng khó thấy nhất.
// Bỏ nó đi đổi lấy khung hình mượt, trừ khi người dùng tự ép mức đồ hoạ.
if (!forced && Math.min(window.innerWidth, window.innerHeight) < 700) {
  Q.bloom = false;
  Q.pixelRatio = Math.min(Q.pixelRatio, 1.5);
}
