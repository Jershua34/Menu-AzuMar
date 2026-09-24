# AzuMar · web del restaurante

Web del **Restaurante y Marisquería AzuMar**, Quepos, Costa Rica.
En vivo: https://menu-azu-mar.vercel.app

HTML, CSS y JavaScript puros. No hay que instalar ni compilar nada. Todos los archivos van
sueltos en la raíz, sin subcarpetas: así, si alguien los sube a GitHub arrastrándolos, no se
pierde ninguno.

## Páginas

| Español | Inglés | Qué es |
|---|---|---|
| `index.html` | `en.html` | Inicio con el mar en 3D, platos, Express y cómo llegar |
| `carta.html` | `carta-en.html` | La carta completa, armada desde `platos.js` |
| `pedido.html` | `pedido-en.html` | Pedido a domicilio: se tocan los platos y sale por WhatsApp |
| `gracias.html` | `gracias-en.html` | Despedida tras enviar el pedido (con reintento) |
| `legal.html` | `legal-en.html` | Términos y privacidad |

Las direcciones viejas `/es`, `/express` y `/express-en` redirigen a la carta y al pedido
nuevos (ver `vercel.json`).

## Cambiar un precio o un plato

**Solo en `platos.js`.** La carta y el pedido lo leen de ahí, en los dos idiomas. Precio `0`
significa "según peso" (el pescado entero). Los precios ya llevan impuestos: no sumarles nada.

## Cambiar un texto

1. Se cambia en la página en español (`index.html`, `carta.html`, `pedido.html` o `gracias.html`).
2. Se agrega la traducción en `generar-ingles.py`.
3. Se corre `python generar-ingles.py`: vuelve a crear las páginas en inglés.

Las páginas en inglés **no se editan a mano**. Si una frase en español cambió y el script no
la encuentra, se detiene y dice cuál: así no quedan páginas con los dos idiomas mezclados.

## El mensaje a la cocina

El pedido sale por WhatsApp **siempre en español**, aunque el cliente pida en inglés, porque
lo lee la cocina. Si se toca `pedido.js`, hay que probar un pedido y comparar el mensaje con
el anterior.

## Verla antes de publicar

Doble clic en `ABRIR-WEB.cmd`, que abre http://127.0.0.1:5510. Abrir `index.html` con doble
clic no sirve, porque el mar en 3D necesita un servidor.

## Publicar

Vercel publica solo lo que llega a la rama `main` de GitHub. Desde esta carpeta, la rama local
se llama `master`:

```bash
git push origin master:main
```
