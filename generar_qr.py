"""Genera un QR por módulo apuntando a la evaluación publicada.

Uso:  python generar_qr.py https://TU-SITIO/evaluaciones/
Crea qr_modulo_1.png ... qr_modulo_8.png en esta carpeta.
Requiere: pip install "qrcode[pil]"
"""
import sys, os
import qrcode
from qrcode.constants import ERROR_CORRECT_M

if len(sys.argv) < 2:
    sys.exit("Pasá la URL base donde publicaste index.html, p. ej.: python generar_qr.py https://midominio.github.io/cadiem/")
base = sys.argv[1].split("#")[0]
here = os.path.dirname(os.path.abspath(__file__))
for m in ("1", "2", "3", "4", "5", "6", "7", "8"):
    url = f"{base}#m{m}"
    qr = qrcode.QRCode(error_correction=ERROR_CORRECT_M, box_size=20, border=2)
    qr.add_data(url); qr.make(fit=True)
    img = qr.make_image(fill_color="#0c2e4e", back_color="white")
    out = os.path.join(here, f"qr_modulo_{m}.png")
    img.save(out)
    print(out, "->", url)
