"""
Dựng mô hình TireGuard trong Blender theo đúng bảng thông số CAD, rồi xuất GLB.

Chạy không cần mở giao diện:
    blender --background --python tools/build_model.py

Hoặc mở Blender, vào tab Scripting, mở tệp này và bấm Run.
Kết quả: models/tireguard.glb

Trang web hiện dựng hình bằng mã JavaScript nên KHÔNG bắt buộc phải chạy tệp
này. Dùng nó khi bạn muốn chỉnh hình khối bằng tay trong Blender, hoặc cần một
tệp GLB để gửi kèm hồ sơ, in 3D, hay mở trong SolidWorks/Fusion.

Tên object được đặt trùng với tên mà js/device.js tìm: shell, core, pcb, tray,
bracket. Đừng đổi tên nếu định nạp GLB vào trang.
"""

import math
import os
import sys

try:
    import bpy
    import bmesh
    from mathutils import Vector, Matrix
except ImportError:  # chạy ngoài Blender
    sys.exit("Tệp này phải chạy bên trong Blender: blender --background --python tools/build_model.py")

# ---------------------------------------------------------------------------
# Thông số CAD (mét — Blender và three.js đều làm việc bằng mét)
# ---------------------------------------------------------------------------
MM = 0.001
R_ARCH   = 415 * MM     # bán kính vòm trong hốc bánh
R_SHELL  = 445 * MM     # bán kính vỏ ngoài
W_ACT    = 260 * MM     # bề rộng bản cực
T_CORE   =  15 * MM     # bề dày lõi tổ ong
D_CELL   =   3 * MM     # ô lục giác, cạnh-đối-cạnh
T_WALL   = 0.5 * MM     # vách ngăn
A0       = math.radians(30)
A1       = math.radians(75)

R_CORE_OUT = R_ARCH - 1 * MM
R_CORE_IN  = R_CORE_OUT - T_CORE
R_PCB      = R_CORE_IN - 3 * MM

# Tăng số này nếu Blender chạy quá chậm: 1.0 là đúng thông số 3 mm,
# 2.0 là ô 6 mm, nhẹ hơn bốn lần mà nhìn vẫn ra cấu trúc tổ ong.
CELL_SCALE = 1.0

OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                   "models", "tireguard.glb")


def clear_scene():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for block in (bpy.data.meshes, bpy.data.materials):
        for item in list(block):
            if item.users == 0:
                block.remove(item)


def new_object(name, bm):
    mesh = bpy.data.meshes.new(name)
    bm.to_mesh(mesh)
    bm.free()
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    return obj


def arc_band(bm, r_in, r_out, a0, a1, width, segments=96):
    """Dải cong: quạt vành khuyên (r_in → r_out, a0 → a1) kéo dày theo trục Z."""
    z0, z1 = -width / 2, width / 2
    ring = []
    for i in range(segments + 1):
        a = a0 + (a1 - a0) * i / segments
        c, s = math.cos(a), math.sin(a)
        ring.append([
            bm.verts.new((c * r_in,  s * r_in,  z0)),
            bm.verts.new((c * r_out, s * r_out, z0)),
            bm.verts.new((c * r_out, s * r_out, z1)),
            bm.verts.new((c * r_in,  s * r_in,  z1)),
        ])
    for i in range(segments):
        a, b = ring[i], ring[i + 1]
        for k in range(4):
            k2 = (k + 1) % 4
            bm.faces.new((a[k], b[k], b[k2], a[k2]))
    bm.faces.new(ring[0][::-1])
    bm.faces.new(ring[-1])
    bm.normal_update()


def box(bm, size, location, rot_z=0.0):
    sx, sy, sz = (v / 2 for v in size)
    corners = [(-sx, -sy, -sz), (sx, -sy, -sz), (sx, sy, -sz), (-sx, sy, -sz),
               (-sx, -sy,  sz), (sx, -sy,  sz), (sx, sy,  sz), (-sx, sy,  sz)]
    m = Matrix.Rotation(rot_z, 3, "Z")
    verts = [bm.verts.new(m @ Vector(c) + Vector(location)) for c in corners]
    for f in ((0, 1, 2, 3), (7, 6, 5, 4), (0, 4, 5, 1),
              (1, 5, 6, 2), (2, 6, 7, 3), (3, 7, 4, 0)):
        bm.faces.new([verts[i] for i in f])
    bm.normal_update()


# ---------------------------------------------------------------------------
# 1. Vỏ carbon — 415 → 445 mm, cung 30°–75°, có gờ gia cường hai mép
# ---------------------------------------------------------------------------
def build_shell():
    bm = bmesh.new()
    arc_band(bm, R_ARCH, R_SHELL, A0, A1, W_ACT + 30 * MM)
    for side in (-1, 1):
        rib = bmesh.new()
        arc_band(rib, R_ARCH - 4 * MM, R_SHELL + 4 * MM, A0, A1, 12 * MM)
        for v in rib.verts:
            v.co.z += side * (W_ACT + 30 * MM) / 2
        mesh = bpy.data.meshes.new("rib")
        rib.to_mesh(mesh)
        rib.free()
        bm.from_mesh(mesh)
        bpy.data.meshes.remove(mesh)
    obj = new_object("shell", bm)

    bev = obj.modifiers.new("bevel", "BEVEL")
    bev.width = 1.2 * MM
    bev.segments = 2
    bev.limit_method = "ANGLE"
    return obj


# ---------------------------------------------------------------------------
# 2. Lõi tổ ong — ô lục giác 3 mm, vách 0,5 mm, uốn theo cung
# ---------------------------------------------------------------------------
def build_core():
    flat = D_CELL * CELL_SCALE
    r_hex = flat / math.sqrt(3) - T_WALL / 2
    r_mid = (R_CORE_IN + R_CORE_OUT) / 2

    col_step = (flat / math.sqrt(3)) * 1.5
    row_step = flat
    cols = max(1, int((r_mid * (A1 - A0)) / col_step))
    rows = max(1, int((W_ACT - flat) / row_step))

    bm = bmesh.new()
    half = T_CORE / 2
    for c in range(cols):
        a = A0 + (c * col_step) / r_mid
        if a > A1:
            break
        radial = Vector((math.cos(a), math.sin(a), 0.0))
        tangent = Vector((-math.sin(a), math.cos(a), 0.0))
        for r in range(rows):
            z = -W_ACT / 2 + flat / 2 + r * row_step + (row_step / 2 if c % 2 else 0)
            if z > W_ACT / 2:
                continue
            centre = radial * r_mid + Vector((0.0, 0.0, z))
            inner, outer = [], []
            for k in range(6):
                ang = math.pi / 3 * k
                off = tangent * (math.cos(ang) * r_hex) + Vector((0.0, 0.0, math.sin(ang) * r_hex))
                inner.append(bm.verts.new(centre + off - radial * half))
                outer.append(bm.verts.new(centre + off + radial * half))
            for k in range(6):
                k2 = (k + 1) % 6
                bm.faces.new((inner[k], outer[k], outer[k2], inner[k2]))
    # tấm đế phía sau
    arc_band(bm, R_CORE_IN - 0.8 * MM, R_CORE_IN, A0, A1, W_ACT)
    bm.normal_update()
    return new_object("core", bm)


# ---------------------------------------------------------------------------
# 3. Bản cực mạch dẻo — rộng 260 mm, dày 1,5 mm
# ---------------------------------------------------------------------------
def build_pcb():
    bm = bmesh.new()
    arc_band(bm, R_PCB, R_PCB + 1.5 * MM, A0, A1, W_ACT)
    return new_object("pcb", bm)


# ---------------------------------------------------------------------------
# 4. Máng hứng 260×40×20 + hộp cảm biến IP68 50×30×15 + hai điện cực hở 8 mm
# ---------------------------------------------------------------------------
def build_tray():
    bm = bmesh.new()
    a = A0 + 0.05
    r = R_ARCH - 28 * MM
    base = (math.cos(a) * r, math.sin(a) * r, 0.0)

    box(bm, (40 * MM, 20 * MM, W_ACT), base, rot_z=A0)
    sensor = (base[0] + 12 * MM, base[1] - 20 * MM, base[2] + 60 * MM)
    box(bm, (50 * MM, 15 * MM, 30 * MM), sensor)

    for side in (-1, 1):                       # điện cực hở 8 mm
        box(bm, (3 * MM, 8 * MM, 3 * MM),
            (sensor[0] + side * 12 * MM, sensor[1] + 11 * MM, sensor[2]))

    box(bm, (20 * MM, 6 * MM, 24 * MM),        # lẫy bấm rút Cartridge
        (base[0] - 16 * MM, base[1] + 4 * MM, -W_ACT / 2 + 20 * MM), rot_z=A0)
    return new_object("tray", bm)


# ---------------------------------------------------------------------------
# 5. Ngàm gá hai đầu cung
# ---------------------------------------------------------------------------
def build_bracket():
    bm = bmesh.new()
    for a in (A0, A1):
        for side in (-1, 1):
            box(bm, (55 * MM, 12 * MM, 28 * MM),
                (math.cos(a) * (R_SHELL + 12 * MM),
                 math.sin(a) * (R_SHELL + 12 * MM),
                 side * (W_ACT / 2 - 20 * MM)),
                rot_z=a)
    return new_object("bracket", bm)


def main():
    clear_scene()
    parts = [build_shell(), build_core(), build_pcb(), build_tray(), build_bracket()]

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    bpy.ops.object.select_all(action="DESELECT")
    for obj in parts:
        obj.select_set(True)
    bpy.context.view_layer.objects.active = parts[0]

    bpy.ops.export_scene.gltf(
        filepath=OUT,
        export_format="GLB",
        use_selection=True,
        export_draco_mesh_compression_enable=True,
        export_draco_mesh_compression_level=6,
        export_apply=True,
    )
    print("Đã xuất:", OUT)
    for obj in parts:
        print(f"  {obj.name:9s} {len(obj.data.polygons):>7d} mặt")


if __name__ == "__main__":
    main()
