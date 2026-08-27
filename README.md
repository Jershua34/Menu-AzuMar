# Menú AzuMar

Menú digital del **Restaurante y Marisquería AzuMar** — Quepos, Costa Rica.

Tres páginas, en español y en inglés:

| Página | Qué es |
|---|---|
| `index.html` | Bienvenida. El cliente elige idioma. |
| `es.html` | Menú en español, 8 páginas. |
| `en.html` | Menú en inglés, 8 páginas. |

Arriba hay una barra con **las secciones** — Entradas, Sea Fast Food, Platos fuertes, Carnes y pastas, Ejecutivo, Batidos, Bebidas e infantil. El cliente toca la que busca y va directo. También puede deslizar el dedo para hojear.

No es una tira larga con scroll: se lee como el menú de papel.

---

## Cómo subirlo a GitHub y publicarlo en Vercel

### 1. Crear el repositorio en GitHub

1. Entrá a [github.com/new](https://github.com/new)
2. Nombre: `azumar-menu`
3. Dejalo **Público** (o privado, funciona igual)
4. **No** marqués "Add a README" — este proyecto ya trae uno
5. Clic en **Create repository**

### 2. Subir los archivos

GitHub te va a mostrar unos comandos. Desde esta carpeta, corré:

```bash
git init
git add .
git commit -m "Menú AzuMar en español e inglés"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/azumar-menu.git
git push -u origin main
```

Cambiá `TU-USUARIO` por tu usuario de GitHub.

> Si preferís no usar comandos: en la página del repositorio recién creado hay un enlace **"uploading an existing file"**. Abrí esta carpeta, seleccioná todo con **Ctrl+A** y arrastralo ahí. Como no hay subcarpetas, no se puede perder nada por el camino.

### 3. Publicar en Vercel

1. Entrá a [vercel.com/new](https://vercel.com/new)
2. Elegí el repositorio `azumar-menu`
3. Vercel detecta solo que es un sitio estático — **no toques ninguna configuración**
4. Clic en **Deploy**

En menos de un minuto te da una dirección tipo `azumar-menu.vercel.app`. Esa es la que va en el código QR de las mesas.

### 4. Ponerle tu propio dominio (opcional)

En Vercel: **Settings → Domains → Add**. Si comprás algo como `menuazumar.com`, ahí se conecta.

---

## Cómo cambiar el menú cuando suban los precios

Las páginas del menú son imágenes. Para actualizarlas:

1. Exportá cada página del menú nuevo como imagen
2. Reemplazá los archivos `es-01.webp` a `es-08.webp` (y `en-01.webp` a `en-08.webp`)
3. Subí el cambio a GitHub — Vercel lo publica solo en un minuto

**Importante:** los nombres tienen que quedar igual (`es-01.webp`, `es-02.webp`, …) y en orden, porque cada sección apunta a un número de página.

Si el menú cambia de secciones o de cantidad de páginas, hay que ajustar la lista `secciones` que está al final de `es.html` y `en.html`. Cada línea dice el nombre que se muestra y a qué página lleva:

```js
{ id: "carnes", nombre: "Carnes y pastas", pagina: 5 },
```

Si las imágenes nuevas pesan mucho (más de 500 KB cada una), conviene pasarlas a WebP antes de subirlas — el menú abre mucho más rápido en los datos del celular.

---

## Estructura

Todos los archivos van **sueltos en la raíz, sin carpetas**. Es a propósito:
cuando se suben archivos a GitHub arrastrándolos, las subcarpetas se pierden
y el sitio queda sin estilos ni imágenes. Plano no puede fallar así.

```
index.html                  Bienvenida y elección de idioma
es.html                     Menú en español
en.html                     Menú en inglés
menu.css                    Estilos
menu.js                     Secciones y deslizar
logo.webp                   Logo de AzuMar
es-01.webp … es-08.webp     Páginas del menú en español
en-01.webp … en-08.webp     Páginas del menú en inglés
vercel.json                 Configuración de publicación
ABRIR-MENU.cmd              Doble clic para verlo en tu navegador
```

No hace falta instalar nada ni compilar: es HTML, CSS y JavaScript puros.

---

## Datos del restaurante

- **Teléfono, WhatsApp y Sinpe:** 8775-8360 (Yohis Hernández B.)
- **Horario:** todos los días, 12 md a 11 pm · Express disponible
- **Dirección:** La Inmaculada, frente a entrada principal, Quepos
- [Instagram](https://www.instagram.com/azu_mar_rest/) · [Facebook](https://www.facebook.com/profile.php?id=61591189964160)

Los precios del menú **ya llevan impuestos incluidos**.
