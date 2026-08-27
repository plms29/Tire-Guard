/* ==========================================================================
   Hai chế độ xem, chuyển bằng nút bấm chứ không bằng cuộn trang.

   · Tổng thể — lùi ra, thiết bị nằm nguyên trong hốc bánh. Để nhìn bối cảnh:
     thiết bị nằm ở đâu trên xe, khuất sau vè thế nào.
   · Tách khối — áp sát, năm cụm rời ra và từng chi tiết con rời tiếp, vè xe mờ
     thành bản cắt lớp.

   Người xem vẫn zoom được ở cả hai chế độ; mức zoom cộng thêm vào mức tách.
   ========================================================================== */

const VIEWS = {
  overview: { az: 1.22, el: 0.16, dist: 1.90, tx: 0.00, ty: 0.04, explode: 0, cutaway: 0.00 },
  exploded: { az: 0.80, el: 0.30, dist: 1.06, tx: 0.21, ty: 0.29, explode: 1, cutaway: 1.00 },
};

export function createStory(onChange) {
  const state = {
    mode: 'overview',
    cam: { ...VIEWS.overview },
    explode: 0,
    cutaway: 0,
    floodAuto: false,       // giữ lại để main.js không phải phân nhánh
  };

  function setMode(mode) {
    if (!VIEWS[mode] || mode === state.mode) return;
    state.mode = mode;
    const v = VIEWS[mode];
    state.cam = { az: v.az, el: v.el, dist: v.dist, tx: v.tx, ty: v.ty };
    state.explode = v.explode;
    state.cutaway = v.cutaway;
    onChange && onChange(mode);
  }

  return Object.assign(state, { setMode });
}
