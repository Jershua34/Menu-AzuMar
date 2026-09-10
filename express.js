/**
 * Pedido Express.
 *
 * El cliente toca los platos que quiere, se le van marcando y sumando abajo,
 * y al confirmar se abre WhatsApp con el pedido ya escrito. Lo manda DESDE SU
 * PROPIO WhatsApp al del restaurante, así que a AzuMar le llega el pedido con
 * el número de quien pide y puede contestarle por ahí mismo.
 *
 * No hay servidor ni base de datos: este sitio son archivos sueltos en Vercel.
 * Es a propósito. Un pedido que viaja por WhatsApp no se cae, no hay que
 * mantenerlo, y llega al mismo sitio donde ya atienden a los clientes.
 *
 * La página declara su idioma:
 *   window.EXPRESS = { idioma: "es", textos: {...} }
 *
 * OJO CON LA COCINA: el mensaje que se envía va SIEMPRE con los nombres en
 * español, aunque el turista esté leyendo en inglés. En la cocina se lee
 * español; si llegara "Fish Ceviche" habría que traducirlo con el pedido
 * encima. En pantalla el cliente sí ve su idioma.
 */
(function () {
  const cfg = window.EXPRESS;
  if (!cfg || !window.PLATOS) return;

  const T = cfg.textos;
  const ES = cfg.idioma === "es";
  const nombreDe = (p) => (ES ? p.es : p.en);
  const descripcionDe = (p) => (ES ? p.dEs : p.dEn || p.dEs);

  const lista = document.getElementById("lista");
  const barraSecciones = document.getElementById("secciones");
  const fija = document.querySelector(".barra-fija");
  const carrito = document.getElementById("carrito");
  const resumen = document.getElementById("resumen");
  const modal = document.getElementById("modal");

  const LLAVE = "azumar-pedido";
  const WHATSAPP = "50687758360";

  /** { idDelPlato: cantidad }. Sobrevive a que cierren la pestaña sin querer. */
  let pedido = {};
  try {
    pedido = JSON.parse(localStorage.getItem(LLAVE) || "{}");
  } catch (e) {
    pedido = {};
  }

  /**
   * Colones con punto de millar: ₡4.800, igual que en la carta impresa.
   *
   * Se escribe a mano y no con toLocaleString porque el separador depende de
   * la versión del navegador y del idioma del teléfono: en unos sale "4 800"
   * y en otros "4,800". Un turista con el teléfono en inglés vería el precio
   * escrito distinto al de la carta de la mesa, y eso da desconfianza.
   */
  const colones = (n) =>
    "₡" + String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  // ---------- Pintar el menú ----------
  const porCategoria = new Map();
  for (const p of window.PLATOS) {
    if (!porCategoria.has(p.cat)) porCategoria.set(p.cat, []);
    porCategoria.get(p.cat).push(p);
  }

  const filas = new Map(); // id -> sus elementos, para no volver a buscarlos
  const chips = [];
  const grupos = [];

  for (const [cat, platos] of porCategoria) {
    const rotulo = (window.CATEGORIAS[cat] || [cat, cat])[ES ? 0 : 1];

    const seccion = document.createElement("section");
    seccion.className = "grupo";
    seccion.id = "cat-" + cat;

    const titulo = document.createElement("h2");
    titulo.className = "titulo-grupo";
    titulo.textContent = rotulo;
    seccion.appendChild(titulo);

    for (const p of platos) {
      const fila = document.createElement("div");
      fila.className = "plato";

      // Toda la fila es el botón. Apuntarle a un botoncito pequeño con el
      // pulgar, de pie y con hambre, no funciona.
      const tocar = document.createElement("button");
      tocar.className = "tocar";
      tocar.type = "button";
      tocar.setAttribute("aria-pressed", "false");

      const texto = document.createElement("span");
      texto.className = "texto";
      const n = document.createElement("span");
      n.className = "nombre";
      n.textContent = nombreDe(p);
      texto.appendChild(n);
      const d = descripcionDe(p);
      if (d) {
        const dd = document.createElement("span");
        dd.className = "desc";
        dd.textContent = d;
        texto.appendChild(dd);
      }

      const precio = document.createElement("span");
      precio.className = "precio";
      precio.textContent = p.precio ? colones(p.precio) : T.segunPeso;

      tocar.append(texto, precio);
      tocar.addEventListener("click", () => sumar(p.id, 1));

      // Los controles de cantidad solo se ven cuando el plato ya está pedido
      const cantidad = document.createElement("div");
      cantidad.className = "cantidad";
      const menos = document.createElement("button");
      menos.type = "button";
      menos.className = "paso";
      menos.textContent = "−";
      menos.setAttribute("aria-label", T.quitarUno + " " + nombreDe(p));
      menos.addEventListener("click", () => sumar(p.id, -1));
      const cuenta = document.createElement("span");
      cuenta.className = "cuenta";
      const mas = document.createElement("button");
      mas.type = "button";
      mas.className = "paso";
      mas.textContent = "+";
      mas.setAttribute("aria-label", T.agregarUno + " " + nombreDe(p));
      mas.addEventListener("click", () => sumar(p.id, 1));
      cantidad.append(menos, cuenta, mas);

      fila.append(tocar, cantidad);
      seccion.appendChild(fila);
      filas.set(p.id, { fila, tocar, cuenta });
    }

    lista.appendChild(seccion);
    grupos.push(seccion);

    const chip = document.createElement("button");
    chip.className = "seccion";
    chip.type = "button";
    chip.textContent = rotulo;
    chip.setAttribute("role", "tab");
    chip.addEventListener("click", () => irA(seccion));
    barraSecciones.appendChild(chip);
    chips.push(chip);
  }

  // ---------- El pedido ----------
  const platoPorId = new Map(window.PLATOS.map((p) => [p.id, p]));

  function sumar(id, cuanto) {
    const n = (pedido[id] || 0) + cuanto;
    if (n <= 0) delete pedido[id];
    else if (n <= 99) pedido[id] = n;
    guardar();
    pintarFila(id);
    pintarCarrito();
  }

  function guardar() {
    try {
      localStorage.setItem(LLAVE, JSON.stringify(pedido));
    } catch (e) {
      /* Modo privado: el pedido no sobrevive al cierre, pero funciona igual. */
    }
  }

  function pintarFila(id) {
    const f = filas.get(id);
    if (!f) return;
    const n = pedido[id] || 0;
    f.fila.classList.toggle("elegido", n > 0);
    f.tocar.setAttribute("aria-pressed", n > 0 ? "true" : "false");
    f.cuenta.textContent = n;
  }

  /** Lo pedido, en el mismo orden en que aparece en la carta. */
  function lineas() {
    return window.PLATOS.filter((p) => pedido[p.id]).map((p) => ({
      p,
      n: pedido[p.id],
      subtotal: p.precio * pedido[p.id],
    }));
  }

  const total = () => lineas().reduce((s, l) => s + l.subtotal, 0);
  /** Platos que se cobran segun peso (precio 0): el Pescado Entero. */
  const hayPorPeso = () => lineas().some((l) => !l.p.precio);

  /**
   * El total como se le dice a alguien, no como lo calcula la maquina.
   *
   * Si el pedido lleva Pescado Entero, el numero NUNCA es el total real. Antes
   * un pedido de solo pescado le llegaba a la cocina como "Total: ₡0", que es
   * mentira y ademas parece un error del sistema.
   */
  function totalTexto() {
    const t = total();
    if (!hayPorPeso()) return colones(t);
    return t > 0 ? colones(t) + " " + T.masSegunPeso : T.segunPeso;
  }
  const cuantos = () => lineas().reduce((s, l) => s + l.n, 0);

  function pintarCarrito() {
    const n = cuantos();
    carrito.hidden = n === 0;
    document.body.classList.toggle("con-carrito", n > 0);
    if (n === 0) return;
    resumen.textContent =
      n + " " + (n === 1 ? T.plato : T.platos) + " · " + totalTexto();
  }

  // ---------- Ir a una categoría ----------
  const suave = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth";
  const altoBarra = () =>
    fija ? Math.round(fija.getBoundingClientRect().height) : 0;

  function irA(seccion) {
    const y =
      window.scrollY + seccion.getBoundingClientRect().top - altoBarra() - 6;
    window.scrollTo({ top: Math.max(0, y), behavior: suave });
  }

  // Marcar la categoría que se está viendo, igual que en el menú
  let pendiente = false;
  window.addEventListener(
    "scroll",
    () => {
      if (pendiente) return;
      pendiente = true;
      requestAnimationFrame(() => {
        pendiente = false;
        const linea = altoBarra() + 56;
        let i = 0;
        for (let n = 0; n < grupos.length; n++) {
          if (grupos[n].getBoundingClientRect().top <= linea) i = n;
          else break;
        }
        chips.forEach((c, n) => {
          c.classList.toggle("activa", n === i);
          c.setAttribute("aria-selected", n === i ? "true" : "false");
        });
        const activa = chips[i];
        if (activa) {
          barraSecciones.scrollTo({
            left: Math.max(
              0,
              activa.offsetLeft -
                (barraSecciones.clientWidth - activa.offsetWidth) / 2
            ),
            behavior: suave,
          });
        }
      });
    },
    { passive: true }
  );

  // ---------- Confirmar ----------
  const detalle = document.getElementById("detalle");
  const totalModal = document.getElementById("total-modal");
  const formulario = document.getElementById("formulario");
  const aviso = document.getElementById("aviso");

  document.getElementById("ver-pedido").addEventListener("click", abrirModal);
  document.getElementById("cerrar").addEventListener("click", () => modal.close());

  function abrirModal() {
    detalle.textContent = "";
    for (const l of lineas()) {
      const fila = document.createElement("div");
      fila.className = "linea";
      const izq = document.createElement("span");
      izq.textContent = l.n + " × " + nombreDe(l.p);
      const der = document.createElement("span");
      der.className = "linea-precio";
      der.textContent = l.p.precio ? colones(l.subtotal) : T.segunPeso;
      fila.append(izq, der);
      detalle.appendChild(fila);
    }
    totalModal.textContent = colones(total());
    aviso.textContent = "";
    modal.showModal();
  }

  formulario.addEventListener("submit", (e) => {
    e.preventDefault();
    const datos = new FormData(formulario);
    const nom = (datos.get("nombre") || "").toString().trim();
    const tel = (datos.get("telefono") || "").toString().trim();
    const dir = (datos.get("direccion") || "").toString().trim();
    const obs = (datos.get("observaciones") || "").toString().trim();

    if (cuantos() === 0) {
      aviso.textContent = T.pedidoVacio;
      return;
    }
    if (!nom || !dir) {
      aviso.textContent = T.faltanDatos;
      return;
    }
    // El teléfono es lo único que se revisa de forma: sin él no se le puede
    // avisar al cliente si algo falta, y un dígito de menos lo deja incomunicado.
    if (tel.replace(/\D/g, "").length < 8) {
      aviso.textContent = T.telefonoCorto;
      return;
    }

    const enlace = enlaceWhatsapp(nom, tel, dir, obs);

    // Se guarda ANTES de vaciar. Si el navegador bloquea la ventana de
    // WhatsApp, o el cliente la cierra sin querer, la página de despedida se
    // lo ofrece otra vez y no tiene que rehacer el pedido.
    try {
      sessionStorage.setItem("azumar-ultimo-pedido", enlace);
    } catch (e) {
      /* modo privado: sin respaldo, pero el envío funciona igual */
    }

    window.open(enlace, "_blank", "noopener");

    // El pedido se cierra aquí: el siguiente cliente (o el mismo, más tarde)
    // arranca de cero. Dejar el carrito lleno hace que se pida dos veces lo
    // mismo sin querer.
    pedido = {};
    guardar();
    modal.close();
    window.location.href = T.paginaGracias;
  });

  /** El mensaje va en español SIEMPRE: lo lee la cocina, no el cliente. */
  function enlaceWhatsapp(nom, tel, dir, obs) {
    const l = [];
    l.push("*PEDIDO EXPRESS · AzuMar*");
    l.push("");
    l.push("*Cliente:* " + nom);
    l.push("*Teléfono:* " + tel);
    l.push("*Dirección:* " + dir);
    l.push("");
    l.push("*Pedido:*");
    for (const li of lineas()) {
      l.push(
        "• " +
          li.n +
          " x " +
          li.p.es +
          (li.p.precio
            ? "  " + colones(li.subtotal)
            : "  (precio según peso)")
      );
    }
    l.push("");
    l.push("*Total: " + totalTexto() + "*");
    l.push("_Impuestos incluidos. El pescado entero se cobra según peso._");
    if (obs) {
      l.push("");
      l.push("*Observaciones:* " + obs);
    }
    return (
      "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(l.join("\n"))
    );
  }

  // ---------- Vaciar ----------
  document.getElementById("vaciar").addEventListener("click", () => {
    if (!confirm(T.confirmarVaciar)) return;
    const ids = Object.keys(pedido);
    pedido = {};
    guardar();
    ids.forEach(pintarFila);
    pintarCarrito();
    modal.close();
  });

  // ---------- Arranque ----------
  // Si venía de antes con platos elegidos, se le devuelven marcados.
  for (const id of Object.keys(pedido)) {
    if (!platoPorId.has(id)) delete pedido[id]; // ese plato ya no existe
    else pintarFila(id);
  }
  guardar();
  pintarCarrito();
})();
