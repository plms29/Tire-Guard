# TireGuard — trang demo 3D

Hốc bánh xe tĩnh điện bẫy vi nhựa lốp tại nguồn. Trang này là bản demo tương
tác dựng theo bảng thông số CAD, để nộp kèm hồ sơ **NextGen Innovator 2026**.

## Chạy tại máy

```bash
node tools/dev-server.mjs
```

Mở http://localhost:5173. Không cần cài gì thêm — three.js đã nằm sẵn trong
`vendor/`, không tải từ mạng.

Đừng mở `index.html` bằng cách nhấp đúp: trình duyệt chặn ES module qua giao
thức `file://`, trang sẽ trắng.

## Cấu trúc

```
index.html          một màn hình, 10 tab; song ngữ qua thuộc tính data-i18n
css/site.css        toàn bộ giao diện
js/config.js        thông số CAD, phân hạng máy mạnh yếu
js/textures.js      vân bề mặt sinh bằng Canvas: sợi carbon, gai lốp, hông lốp,
                    nhôm xước, mạch dẻo phủ đồng
js/device.js        dựng bánh xe, thân xe và 5 lớp thiết bị
js/particles.js     mô phỏng dòng hạt và hồ quang điện
js/story.js         hai chế độ xem và keyframe máy quay của mỗi chế độ
js/ui.js            tab, nút chuyển chế độ, HUD, nhãn kích thước, màn hình chờ
js/mockapi.js       API giả lập của TireGuard Cloud: 12 xe demo, trạm dịch vụ,
                    bảng điểm ESG, số liệu theo quận — chạy trong trình duyệt
js/portal.js        biểu đồ hiệu suất, máy tính chi phí, tab Hạm đội · API và
                    Dữ liệu mở · ESG (chạy cả khi máy không có WebGL)
js/i18n.js          bản tiếng Anh (bản tiếng Việt nằm trong HTML)
js/main.js          ghép tất cả, ánh sáng, hậu kỳ, vòng lặp render
vendor/             three.js r168 và các addon, đóng gói sẵn
tools/dev-server.mjs   máy chủ tĩnh cho lúc phát triển
tools/build_model.py   dựng model trong Blender rồi xuất GLB (tuỳ chọn)
docs/               báo cáo, deck, và bản một-tệp ban đầu — không đưa lên mạng
```

## Tham số khi mở trang

| Tham số | Tác dụng |
|---|---|
| `?q=low` | ép mức đồ hoạ thấp — 320 hạt, không bloom, không đổ bóng |
| `?q=mid` | mức trung bình |
| `?q=high` | mức cao — 1.100 hạt, lõi tổ ong dựng thật từng ô |

Không truyền gì thì trang tự chọn theo cấu hình máy. Màn hình nhỏ tự tắt bloom.

## Người xem tương tác thế nào

Trang gói trong **đúng một màn hình, không cuộn dọc**. Nội dung chia theo tab
trên thanh đầu trang: Mô hình 3D · Vấn đề · Thông số · Nguyên lý · So sánh ·
Doanh thu · Lộ trình · Hạm đội · API · Dữ liệu mở · ESG · Nguồn. Tab đang mở được nhớ lại ở lần vào sau.

Trong tab **Mô hình 3D**:

- **Nút chuyển `Tổng thể` ↔ `Tách khối`** ngay giữa đáy màn hình. Tổng thể để
  nhìn bối cảnh — thiết bị nằm ở đâu, khuất sau vè thế nào. Tách khối để xem
  năm cụm rời ra, mỗi chi tiết con lại rời khỏi cụm của nó theo một nhịp riêng.
- **Cuộn chuột trên mô hình** để phóng to. Càng vào gần, vè xe và tấm vỏ carbon
  càng mờ đi để lộ lõi tổ ong và bản cực bên trong, đồng thời nhãn kích thước
  hiện ra theo hai tầng: tầng một ở mức zoom vừa, tầng hai (ô lục giác 3 mm,
  điện cực hở 8 mm, rãnh trượt 5 mm) chỉ hiện khi vào thật sát.
- **Kéo chuột** để xoay. Hàng nút dưới cùng bật/tắt điện trường, mô phỏng lội
  nước, ẩn hiện nhãn, dừng xoay tự động, và đưa máy quay về góc gốc.
- **Lội nước** chạy đúng năm bước trong pitch deck: ngắt cao áp → bẫy thụ động
  (hạt màu cam, đồng hồ về ≈ 40%) → rút nước thì chờ khô 2,5 s → khởi động mềm
  tăng áp trong 0,8 s → về chủ động (≈ 69–72%).

Khi chuyển sang tab khác, vòng lặp dựng hình tự dừng và chạy lại khi quay về —
không đốt pin trong lúc người xem đang đọc bảng số.

## Vài điều cần biết trước khi sửa

**Con số hiệu suất là kết quả mô phỏng, không phải con số cứng.** Hằng số trong
`js/particles.js` (`K_FIELD`, `G_EFF`, `DRAG`, `P_STICK_ACTIVE`,
`P_STICK_PASSIVE`) đã được hiệu chuẩn để hiệu suất hội tụ ở ≈ 69% khi chủ động
và ≈ 40% khi thụ động (120 giây), khớp dải mục tiêu 60–75% của pitch deck và
đường “Passive / Rain Mode” trong biểu đồ của nhóm. Vật lý chạy theo bước cố
định 1/60 s nên máy 20 khung hình/s ra cùng con số với máy 60 khung hình/s.
Đổi bất kỳ hằng số nào thì phải chạy lại và kiểm tra con số trên HUD.

**Hiệu suất được tính trong cửa sổ thu gom.** Mẫu số chỉ đếm những hạt đã thực
sự đi vào vùng 30°–75°. Hạt văng thẳng xuống mặt đường chưa từng nằm trong tầm
với của thiết bị nên không tính là "lọt lưới". Dòng chữ dưới đồng hồ trên trang
nói rõ điều này — đừng bỏ đi.

**Trang có ghi rõ đây là mô phỏng minh hoạ, không phải kết quả CFD.** Giữ nguyên
câu đó. Ban giám khảo kỹ thuật chắc chắn sẽ hỏi, và nói trước thì thành điểm
cộng về sự trung thực.

**Bảng tài chính là giả định.** Ghi chú dưới bảng đã nêu. Giữ nguyên.

**Tab Hạm đội · API là bản demo.** Toàn bộ dữ liệu sinh từ `js/mockapi.js`, mỗi
phản hồi gắn `x-mock: true`, đầu tab có băng chữ DEMO. Khi có máy chủ thật, thay
hàm `request()` bằng `fetch()` — đường dẫn và hình dạng JSON giữ nguyên.

**Tab Dữ liệu mở · ESG mặc định để trống** theo ý nhóm: chỉ hiện khung, chờ số
liệu thí điểm. Công tắc “Điền số liệu demo” hiện số mẫu có gắn nhãn DEMO DATA.
Ô đối tác cũng để trống — điền tên khi đã có thỏa thuận.

## Đưa lên mạng

> **Trước khi kéo thả, đọc dòng này.** Thư mục `docs/` đang chứa
> `TireGuard_Strategic_Intelligence_Report.pdf` — hồ sơ chiến lược nội bộ, có
> chiến thuật tiếp cận VinFast/GSM. Netlify Drop tải lên **mọi tệp trong thư
> mục**, nên tệp đó sẽ tải về được công khai từ một đường dẫn dễ đoán. Chuyển
> `docs/` ra ngoài trước khi deploy, hoặc chấp nhận nó công khai — tuỳ bạn
> quyết định. Đi đường GitHub Pages thì `.gitignore` đã loại `docs/` sẵn.

### Cách nhanh nhất — Netlify Drop

1. Chuyển `docs/` ra ngoài `D:\isarel` (xem cảnh báo trên)
2. Vào https://app.netlify.com/drop
3. Kéo cả thư mục `D:\isarel` thả vào trang
4. Có URL ngay. Đổi tên site thành `tireguard` cho link gọn.

Không cần cấu hình build. Toàn bộ là tệp tĩnh.

### Cách còn lại — GitHub Pages

```bash
git init && git add . && git commit -m "TireGuard 3D demo"
git branch -M main
git remote add origin https://github.com/<tài-khoản>/tireguard.git
git push -u origin main
```

Rồi vào Settings → Pages, chọn nhánh `main`, thư mục `/ (root)`.

### Sau khi có link

Điền vào **hai chỗ** trong hồ sơ dự thi:

- mục **“Link 3D”**
- mục **“Product website / demo link”**

Rồi tạo mã QR trỏ tới URL, in lên poster và slide.

## Dựng model bằng Blender (tuỳ chọn)

Trang đang dựng hình bằng mã JavaScript nên không cần tệp GLB. Nếu muốn một
model để chỉnh tay, in 3D hay gửi kèm hồ sơ:

```bash
blender --background --python tools/build_model.py
```

Kết quả nằm ở `models/tireguard.glb`, tên object đặt sẵn là `shell`, `core`,
`pcb`, `tray`, `bracket` — trùng với tên `js/device.js` tìm khi nạp GLB.

## Kiểm tra trước khi nộp

- [ ] Ngắt mạng, tải lại trang — mô hình vẫn hiện
- [ ] Mở trên iPhone Safari và Android Chrome
- [ ] Bấm nút EN/VI, không sót chuỗi nào
- [ ] Bấm qua cả 10 tab, không tab nào trống
- [ ] Bấm “Lội nước”: thấy ngắt → thụ động ≈ 40% → khởi động mềm → ≈ 70%
- [ ] Tab Hạm đội: mở một xe, “tìm trạm gần nhất”, gửi yêu cầu, ra phiếu SR-…
- [ ] Chuyển Tổng thể ↔ Tách khối mượt ở cả hai chiều
- [ ] Cuộn chuột trên mô hình, nhãn chi tiết hiện ra theo hai tầng
- [ ] Link mở được ở chế độ ẩn danh bằng mạng 4G
- [ ] Dán link vào Facebook hoặc Zalo, ảnh xem trước hiện đúng
- [ ] Đã điền cả “Link 3D” lẫn “demo link” trong hồ sơ
- [ ] QR code đã in lên poster và slide
