/**
 * Visor del menú.
 *
 * Se lee de dos formas, y las dos funcionan al mismo tiempo:
 *   1. Bajando el dedo — todas las páginas van una debajo de otra, de corrido.
 *      Es lo más rápido, y es como la gente lee todo en el teléfono.
 *   2. Tocando el nombre de la sección — "Carnes y pastas" y va directo ahí.
 *      Sirve para el que ya sabe qué busca y no quiere pasar todo.
 * Además, deslizar el dedo hacia los lados salta a la sección siguiente o
 * anterior, que es como se hojea una carta de papel.
 *
 * Cada idioma tiene su HTML pero comparten este archivo. La página declara:
 *   window.MENU = { idioma: "es", secciones: [{id, nombre, pagina}, ...], textos }
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
  const fija = document.querySelector(".barra-fija");
  const btnArriba = document.getElementById("arriba");

  const total = cfg.secciones.length;
  const suave = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth";

  /** Ruta de la imagen de una página (0 -> es-01.webp). */
  const ruta = (i) => `${cfg.idioma}-${String(i + 1).padStart(2, "0")}.webp`;
  /** La misma página a 800px, para celulares. */
  const rutaChica = (i) => ruta(i).replace(".webp", "-800.webp");

  const paginas = [];
  const chips = [];
  let actual = -1;

  // --- Las páginas, una debajo de otra ---
  cfg.secciones.forEach((sec, i) => {
    const img = document.createElement("img");
    img.className = "pagina";
    img.id = "pag-" + sec.id;
    img.alt = `${cfg.textos.pagina}: ${sec.nombre}`;
    img.src = ruta(i);
    // La carta se ve a 390px de ancho en un celular y a 820px como mucho en
    // computadora. Mandarle a todos la de 1400px gastaba tres veces los
    // datos del cliente sin que se leyera mejor. El navegador escoge.
    img.srcset = `${rutaChica(i)} 800w, ${ruta(i)} 1400w`;
    img.sizes = "(max-width: 820px) 100vw, 820px";
    // Medidas reales de las .webp. Van sí o sí: sin ellas el navegador no
    // sabe cuánto mide una imagen que aún no bajó, la página se encoge y se
    // estira mientras cargan, y el dedo termina en otra sección.
    img.width = 1400;
    img.height = 1980;
    // Mientras baja, el hueco late en dorado. Un rectángulo azul quieto
    // parece un sitio roto; uno que late parece un sitio cargando.
    img.addEventListener('load', () => img.classList.add('cargada'), { once: true });
    // Las dos primeras de una; el resto cuando el lector se acerque
    img.loading = i < 2 ? "eager" : "lazy";
    img.decoding = "async";
    visor.appendChild(img);
    paginas.push(img);
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

  /** Alto de la barra pegada arriba. Se recalcula porque cambia al girar
   *  el teléfono o si el sistema usa letra más grande. */
  function medirBarra() {
    const alto = fija ? Math.round(fija.getBoundingClientRect().height) : 0;
    if (alto > 0) {
      document.documentElement.style.setProperty("--alto-barra", alto + "px");
    }
    return alto;
  }
  let altoBarra = medirBarra();
  if (fija && "ResizeObserver" in window) {
    new ResizeObserver(() => {
      altoBarra = medirBarra();
    }).observe(fija);
  }

  /** Deja la pastilla activa a la vista sin mover la página hacia abajo.
   *  scrollIntoView movería las dos cosas; acá solo se mueve la barra. */
  function centrarChip(c) {
    const objetivo = c.offsetLeft - (barra.clientWidth - c.offsetWidth) / 2;
    barra.scrollTo({ left: Math.max(0, objetivo), behavior: suave });
  }

  /** Marca qué sección se está viendo. No mueve la página. */
  function marcar(i) {
    if (i === actual || i < 0 || i >= total) return;
    actual = i;
    chips.forEach((c, n) => {
      const activa = n === i;
      c.classList.toggle("activa", activa);
      c.setAttribute("aria-selected", activa ? "true" : "false");
    });
    centrarChip(chips[i]);
    // La sección queda en la dirección: se puede compartir un enlace directo
    history.replaceState(null, "", "#" + cfg.secciones[i].id);
  }

  /** Lleva la pantalla hasta una página. */
  function ir(i, comportamiento) {
    i = Math.max(0, Math.min(total - 1, i));
    const y =
      window.scrollY +
      paginas[i].getBoundingClientRect().top -
      altoBarra -
      8;
    window.scrollTo({
      top: Math.max(0, y),
      behavior: comportamiento || suave,
    });
    marcar(i);
  }

  // --- Qué sección se está viendo, según dónde va el scroll ---
  // Se mira qué página cruza la línea justo debajo de la barra. Es la que
  // el lector tiene delante de los ojos.
  let pendiente = false;
  function alScroll() {
    if (pendiente) return;
    pendiente = true;
    requestAnimationFrame(() => {
      pendiente = false;
      const linea = altoBarra + 48;
      let i = 0;
      for (let n = 0; n < paginas.length; n++) {
        if (paginas[n].getBoundingClientRect().top <= linea) i = n;
        else break;
      }
      marcar(i);
      if (btnArriba) {
        btnArriba.classList.toggle("visible", window.scrollY > 600);
      }
    });
  }
  window.addEventListener("scroll", alScroll, { passive: true });

  if (btnArriba) {
    btnArriba.addEventListener("click", () => ir(0));
  }

  // --- Deslizar hacia los lados: salta de sección ---
  // El vertical lo maneja el navegador. Acá solo nos metemos si el gesto fue
  // claramente horizontal, para no robarle el scroll a quien está bajando.
  const UMBRAL = 55; // que un toque tembloroso no cuente como deslizar
  const TOLERANCIA_VERTICAL = 40;
  let xInicio = null;
  let yInicio = null;

  visor.addEventListener(
    "touchstart",
    (e) => {
      if (e.touches.length !== 1) {
        xInicio = null; // dos dedos = está haciendo zoom, no hojeando
        return;
      }
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
      if (Math.abs(dx) > UMBRAL && Math.abs(dy) < TOLERANCIA_VERTICAL) {
        ir(actual + (dx < 0 ? 1 : -1));
      }
      xInicio = null;
      yInicio = null;
    },
    { passive: true }
  );

  // --- Teclado, para quien lo abra en computadora ---
  // Arriba y abajo los deja el navegador: es el scroll de siempre.
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      ir(actual + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      ir(actual - 1);
    }
  });

  // --- Abierto o cerrado ---
  // Se calcula con la hora de COSTA RICA, no con la del teléfono. Un turista
  // que llegó con el reloj en otro huso vería "cerrado" a las ocho de la
  // noche, y se iría a comer a otro lado.
  (function estadoDelLocal() {
    const caja = document.getElementById("estado");
    if (!caja || !cfg.textos.abierto) return;
    const APERTURA = 12; // 12 md
    const CIERRE = 23; //  11 pm
    let hora;
    try {
      hora = Number(
        new Intl.DateTimeFormat("en-US", {
          timeZone: "America/Costa_Rica",
          hour: "numeric",
          hour12: false,
        }).format(new Date())
      );
    } catch (e) {
      return; // navegador sin husos horarios: mejor no decir nada que mentir
    }
    const abierto = hora >= APERTURA && hora < CIERRE;
    caja.textContent = abierto ? cfg.textos.abierto : cfg.textos.cerrado;
    caja.classList.add(abierto ? "abierto" : "cerrado");
    caja.hidden = false;
  })();

  // --- Arranque ---
  // Si la dirección trae #carnes, se abre ahí. Si no, arriba del todo.
  const desdeUrl = location.hash.replace("#", "");
  const encontrada = cfg.secciones.findIndex((s) => s.id === desdeUrl);
  requestAnimationFrame(() => {
    altoBarra = medirBarra();
    if (encontrada > 0) ir(encontrada, "auto");
    else marcar(0);
  });
})();
