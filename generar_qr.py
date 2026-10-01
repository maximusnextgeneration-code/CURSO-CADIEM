"""Genera los QR de las evaluaciones publicadas.

Uso:  python generar_qr.py https://usuario.github.io/CURSO-CADIEM/
Crea un qr_<tema>.png por evaluación.
Requiere: pip install "qrcode[pil]"
"""
import sys, os
import qrcode
from qrcode.constants import ERROR_CORRECT_M

TEMAS = {  # clave de la URL (#mN) -> nombre de archivo
    "m1": "economia_y_mercados", "m3": "bonos", "m4": "fondos_mutuos", "m2": "acciones",
    "m5": "etfs", "m6": "productos_estructurados", "m8": "portafolios_de_inversion",
}

if len(sys.argv) < 2:
    sys.exit("Pasá la URL publicada, p. ej.: python generar_qr.py https://usuario.github.io/CURSO-CADIEM/")
base = sys.argv[1].split("#")[0]
here = os.path.dirname(os.path.abspath(__file__))
out_dir = os.path.join(here, "qr"); os.makedirs(out_dir, exist_ok=True)

def make(url, name):
    qr = qrcode.QRCode(error_correction=ERROR_CORRECT_M, box_size=20, border=2)
    qr.add_data(url); qr.make(fit=True)
    path = os.path.join(out_dir, f"qr_{name}.png")
    qr.make_image(fill_color="#0c2e4e", back_color="white").save(path)
    print(path, "->", url)


for key, name in TEMAS.items():
    make(f"{base}#{key}", name)
