# Genera modo-escritorio.css a partir de estilos.css.
# Uso: python generar-modo-escritorio.py  (correrlo cada vez que cambie estilos.css)
#
# Por qué existe: Chrome en Android con "Sitio de escritorio" activado dibuja la
# página como si la pantalla midiera 980 px y después la achica para que entre
# en el teléfono. Todo se ve diminuto, y además las reglas de celular
# (@media max-width) no se activan, porque el navegador cree que es una pantalla ancha.
#
# El script del <head> de cada página detecta ese caso, amplía la página al
# ancho real del teléfono y le pone al <html> las clases mx-899, mx-767, mx-599,
# mx-480 y mx-380 según corresponda. Este archivo copia cada regla de
# @media (max-width: Npx) bajo la clase html.mx-N, para que el diseño de
# celular se vea igual que en un teléfono normal. No se edita a mano.
import os, re
os.chdir(os.path.dirname(os.path.abspath(__file__)))

css = open("estilos.css", encoding="utf-8").read()
css = re.sub(r"/\*.*?\*/", "", css, flags=re.S)

def bloque(texto, inicio):
    """Devuelve el contenido entre la llave que abre en `inicio` y su pareja."""
    nivel, i = 0, inicio
    while True:
        c = texto[i]
        if c == "{":
            nivel += 1
        elif c == "}":
            nivel -= 1
            if nivel == 0:
                return texto[inicio + 1:i], i
        i += 1

def reglas(texto):
    """Separa 'selector { declaraciones }' del primer nivel."""
    i, salida = 0, []
    while True:
        a = texto.find("{", i)
        if a < 0:
            return salida
        dentro, fin = bloque(texto, a)
        salida.append((texto[i:a].strip(), dentro.strip()))
        i = fin + 1

salida = ["/* GENERADO por generar-modo-escritorio.py a partir de estilos.css. No editar a mano. */\n"]
for m in re.finditer(r"@media\s*\(max-width:\s*(\d+)px\)\s*\{", css):
    n = m.group(1)
    dentro, _ = bloque(css, m.end() - 1)
    for sel, decl in reglas(dentro):
        if not sel or sel.startswith("@"):
            continue
        selectores = ",\n".join(f"html.mx-{n} {s.strip()}" for s in sel.split(","))
        salida.append(f"{selectores} {{ {decl} }}\n")

open("modo-escritorio.css", "w", encoding="utf-8", newline="\n").write("\n".join(salida))
print("modo-escritorio.css:", len(salida) - 1, "reglas")
