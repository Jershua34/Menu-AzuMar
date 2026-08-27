/**
 * Visor del menú por secciones.
 *
 * El cliente toca el nombre de la sección que busca — "Cortes y pastas" — y
 * va directo a esa página. No hay "Siguiente": nadie llega al menú queriendo
 * pasar páginas, llega queriendo encontrar algo.
 *
 * Cada idioma tiene su HTML pero comparten este archivo. La página declara:
 *   window.MENU = { idioma: "es", secciones: [{nombre, pagina}, ...], textos }
 *
 * Todos los archivos viven sueltos en la raíz, sin carpetas, a propósito:
 * subir archivos a GitHub arrastrándolos pierde las subcarpetas, y sin ellas
 * el sitio queda sin estilos ni imágenes. Plano no se puede romper así.
 */
(function () {
  const cfg = window.MENU;
  if (!cfg) return;

  const visor = document.getElementById("visor");
  const barra = document.getElementById("secciones");

  const paginas = cfg.secciones.length;
  let actual = 0;
  const imagenes = [];
  const chips = [];

  /** Ruta de la imagen de una página (0 -> es-01.webp). */
  const ruta = (i) =>
    `${cfg.idioma}-${String(i + 1).padStart(2, "0")}.webp`;

  // --- Imágenes ---
  cfg.secciones.forEach((sec, i) => {
    const img = document.createElement("img");
    img.className = "pagina";
    img.alt = `${cfg.textos.pagina}: ${sec.nombre}`;
    // Solo las dos primeras se cargan de una; el resto al acercarse
    if (i < 2) img.src = ruta(i);
    else img.dataset.src = ruta(i);
    img.decoding = "async";
    visor.appendChild(img);
    imagenes.push(img);
  });

  // --- Pastillas de sección ---
  cfg.secciones.forEach((sec, i) => {
    const b = document.createElement("button");
    b.className = "seccion";
    b.type = "button";
    b.textContent = sec.nombre;
    b.setAttribute("role", "tab");
    b.addEventListener("click", () => ir(i));
    barra.appendChild(b);
    chips.push(b);
  });

  /** Carga la imagen si aún no se cargó (también la vecina, para que al
   *  pasar ya esté lista y no se vea el hueco). */
  function precargar(i) {
    const img = imagenes[i];
    if (img && img.dataset.src) {
      img.src = img.dataset.src;
      delete img.dataset.src;
    }
  }

  function ir(i) {
    actual = Math.max(0, Math.min(paginas - 1, i));

    imagenes.forEach((img, n) => img.classList.toggle("activa", n === actual));
    chips.forEach((c, n) => {
      const activa = n === actual;
      c.classList.toggle("activa", activa);
      c.setAttribute("aria-selected", activa ? "true" : "false");
    });

    precargar(actual);
    precargar(actual + 1);
    precargar(actual - 1);

    // Deja visible la pastilla activa dentro de la barra
    chips[actual].scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });

    // La sección queda en la dirección: se puede compartir un enlace directo
    history.replaceState(null, "", `#${cfg.secciones[actual].id}`);
  }

  // --- Deslizar con el dedo: la forma natural de hojear un menú ---
  // 45px para que un toque tembloroso no cuente como deslizar
  const UMBRAL = 45;
  let xInicio = null;
  let yInicio = null;

  visor.addEventListener(
    "touchstart",
    (e) => {
      xInicio = e.touches[0].clientX;
      yInicio = e.touches[0].clientY;
    },
    { passive: true }
  );

  visor.addEventListener(
    "touchend",
    (e) => {
      if (xInicio === null) return;
      const dx = e.changedTouches[0].clientX - xInicio;
      const dy = e.changedTouches[0].clientY - yInicio;
      // Solo si el movimiento fue más horizontal que vertical, para no pasar
      // de página cuando alguien intenta hacer zoom sobre la imagen
      if (Math.abs(dx) > UMBRAL && Math.abs(dx) > Math.abs(dy)) {
        ir(actual + (dx < 0 ? 1 : -1));
      }
      xInicio = null;
      yInicio = null;
    },
    { passive: true }
  );

  // --- Teclado, para quien lo abra en computadora ---
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") ir(actual + 1);
    else if (e.key === "ArrowLeft") ir(actual - 1);
  });

  // Arrancar en la sección de la dirección (#cortes) o en la portada
  const desdeUrl = location.hash.replace("#", "");
  const encontrada = cfg.secciones.findIndex((s) => s.id === desdeUrl);
  ir(encontrada >= 0 ? encontrada : 0);
})();
