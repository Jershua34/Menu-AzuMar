/**
 * Pedido a domicilio (Express), con el diseño de la web nueva.
 *
 * Funciona igual que el Express del sitio del menú, porque la cocina ya está
 * acostumbrada a ese mensaje:
 *  - se toca un plato y se suma; los controles − / + aparecen cuando ya está pedido
 *  - el pedido se guarda en el teléfono por si cierran la pestaña sin querer
 *  - al confirmar se abre WhatsApp con el pedido escrito y se envía DESDE el
 *    WhatsApp del cliente, así AzuMar le contesta por ahí mismo
 *  - el mensaje va SIEMPRE en español y con los nombres en español: lo lee la
 *    cocina, aunque el cliente esté viendo la página en inglés
 *
 * Los platos y precios salen de platos.js (el mismo archivo que usa la carta):
 * un solo lugar para cambiar un precio en toda la web.
 */
import { montarMar } from './escena-mar.js';

const quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const raiz = document.documentElement;
const EN = raiz.lang.startsWith('en');
const WHATSAPP = '50687758360';
const LLAVE = 'azumar-pedido';

const T = EN
  ? {
      porPeso: 'By weight',
      masPorPeso: '+ fish by weight',
      plato: 'dish', platos: 'dishes',
      agregar: 'Add one', quitar: 'Remove one',
      vacio: 'You haven’t picked any dishes yet.',
      faltan: 'Please add your name and delivery address.',
      telefono: 'Check your phone number: some digits are missing.',
      confirmarVaciar: 'Remove everything from your order?',
      gracias: 'gracias-en.html',
      error: 'We couldn’t load the dishes. Check your connection and try again.',
      reintentar: 'Try again',
      acepto: 'Please tick the box to accept how we use your details.',
    }
  : {
      porPeso: 'Según peso',
      masPorPeso: '+ pescado según peso',
      plato: 'plato', platos: 'platos',
      agregar: 'Agregar uno de', quitar: 'Quitar uno de',
      vacio: 'Todavía no elegiste ningún plato.',
      faltan: 'Falta tu nombre o la dirección de entrega.',
      telefono: 'Revisa el teléfono: faltan números.',
      confirmarVaciar: '¿Seguro que quieres borrar todo el pedido?',
      gracias: 'gracias.html',
      error: 'No pudimos cargar los platos. Revisa tu conexión e inténtalo de nuevo.',
      reintentar: 'Intentar de nuevo',
      acepto: 'Marca la casilla para aceptar el uso de tus datos.',
    };

const nombreDe = (p) => (EN ? p.en : p.es);
const descripcionDe = (p) => (EN ? p.dEn || p.dEs : p.dEs);

// En pantalla, cada idioma con su separador. En el mensaje a la cocina, siempre ₡4.800.
const colones = (n, coma = EN) => '₡' + String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, coma ? ',' : '.');

/* ---------- Mar de la cabecera y barra de arriba ---------- */

const lienzo = document.getElementById('mar');
const mar = montarMar(lienzo, { quieto });
if (mar) {
  requestAnimationFrame(() => lienzo.classList.add('listo'));
  mar.setAvance(0.25);
  new IntersectionObserver(([e]) => mar.pausar(!e.isIntersecting)).observe(document.querySelector('.carta-cabeza'));
}
const vigia = document.createElement('div');
vigia.style.cssText = 'position:absolute;top:40px;height:1px;width:1px';
document.body.prepend(vigia);
new IntersectionObserver(([e]) => document.getElementById('nav').classList.toggle('con-fondo', !e.isIntersecting)).observe(vigia);
raiz.classList.remove('js-anima');
raiz.classList.add('animado');

/* ---------- Armar la lista ---------- */

const contenedor = document.getElementById('carta');
const carrito = document.getElementById('carrito');
const resumen = document.getElementById('resumen');
const modal = document.getElementById('modal');

if (!Array.isArray(window.PLATOS) || !window.CATEGORIAS) {
  contenedor.setAttribute('aria-busy', 'false');
  contenedor.innerHTML = `<div class="carta-aviso"><p>${T.error}</p>
    <div class="portada-botones"><button class="boton boton-oro" type="button" onclick="location.reload()">${T.reintentar}</button></div></div>`;
  document.getElementById('secciones').hidden = true;
} else {
  arrancar();
}

function arrancar() {
  const platos = window.PLATOS;
  const porId = new Map(platos.map((p) => [p.id, p]));
  const filas = new Map();

  let pedido = {};
  try { pedido = JSON.parse(localStorage.getItem(LLAVE) || '{}'); } catch (e) { pedido = {}; }

  const fragmento = document.createDocumentFragment();
  const pastillas = document.getElementById('lista-secciones');

  for (const [clave, [nombreEs, nombreEn]] of Object.entries(window.CATEGORIAS)) {
    const suyos = platos.filter((p) => p.cat === clave);
    if (!suyos.length) continue;
    const nombre = EN ? nombreEn : nombreEs;

    const seccion = document.createElement('section');
    seccion.className = 'grupo grupo-pedido';
    seccion.id = clave;
    const h2 = document.createElement('h2');
    h2.textContent = nombre;
    seccion.append(h2);

    const ul = document.createElement('ul');
    ul.className = 'opciones';
    ul.setAttribute('role', 'list');
    for (const p of suyos) {
      const li = document.createElement('li');
      li.className = 'opcion';

      // Toda la fila es el botón: con el pulgar, de pie y con hambre, un
      // botoncito pequeño no funciona.
      const tocar = document.createElement('button');
      tocar.type = 'button';
      tocar.className = 'opcion-tocar';
      tocar.setAttribute('aria-pressed', 'false');
      tocar.innerHTML = `
        <span class="opcion-texto">
          <span class="opcion-nombre"></span>
          ${descripcionDe(p) ? '<span class="opcion-desc"></span>' : ''}
        </span>
        <span class="precio"></span>`;
      tocar.querySelector('.opcion-nombre').textContent = nombreDe(p);
      if (descripcionDe(p)) tocar.querySelector('.opcion-desc').textContent = descripcionDe(p);
      tocar.querySelector('.precio').textContent = p.precio ? colones(p.precio) : T.porPeso;
      tocar.addEventListener('click', () => sumar(p.id, 1));

      const cantidad = document.createElement('div');
      cantidad.className = 'cantidad';
      const menos = paso('−', `${T.quitar} ${nombreDe(p)}`, () => sumar(p.id, -1));
      const cuenta = document.createElement('span');
      cuenta.className = 'cuenta';
      cuenta.setAttribute('aria-live', 'polite');
      const mas = paso('+', `${T.agregar} ${nombreDe(p)}`, () => sumar(p.id, 1));
      cantidad.append(menos, cuenta, mas);

      li.append(tocar, cantidad);
      ul.append(li);
      filas.set(p.id, { li, tocar, cuenta });
    }
    seccion.append(ul);
    fragmento.append(seccion);

    const a = document.createElement('a');
    a.href = `#${clave}`;
    a.textContent = nombre;
    const liPastilla = document.createElement('li');
    liPastilla.append(a);
    pastillas.append(liPastilla);
  }
  contenedor.replaceChildren(fragmento);
  contenedor.setAttribute('aria-busy', 'false');

  function paso(signo, etiqueta, accion) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'paso';
    b.textContent = signo;
    b.setAttribute('aria-label', etiqueta);
    b.addEventListener('click', accion);
    return b;
  }

  /* ---------- El pedido ---------- */

  function sumar(id, cuanto) {
    const n = (pedido[id] || 0) + cuanto;
    if (n <= 0) delete pedido[id];
    else if (n <= 99) pedido[id] = n;
    guardar();
    pintarFila(id);
    pintarCarrito(cuanto > 0);
  }
  function guardar() {
    try { localStorage.setItem(LLAVE, JSON.stringify(pedido)); } catch (e) { /* modo privado */ }
  }
  function pintarFila(id) {
    const f = filas.get(id);
    if (!f) return;
    const n = pedido[id] || 0;
    f.li.classList.toggle('elegido', n > 0);
    f.tocar.setAttribute('aria-pressed', String(n > 0));
    f.cuenta.textContent = n;
  }

  // Lo pedido, en el mismo orden que en la carta.
  const lineas = () => platos.filter((p) => pedido[p.id]).map((p) => ({ p, n: pedido[p.id], subtotal: p.precio * pedido[p.id] }));
  const total = () => lineas().reduce((s, l) => s + l.subtotal, 0);
  const cuantos = () => lineas().reduce((s, l) => s + l.n, 0);
  const hayPorPeso = () => lineas().some((l) => !l.p.precio);

  // Con Pescado Entero el número nunca es el total real: se dice así, no "₡0".
  function totalTexto(enCocina = false) {
    const t = total();
    const c = (n) => colones(n, enCocina ? false : EN);
    const porPeso = enCocina ? '+ pescado según peso' : T.masPorPeso;
    if (!hayPorPeso()) return c(t);
    return t > 0 ? `${c(t)} ${porPeso}` : (enCocina ? 'según peso' : T.porPeso);
  }

  function pintarCarrito(latido = false) {
    const n = cuantos();
    carrito.hidden = n === 0;
    document.body.classList.toggle('con-carrito', n > 0);
    if (!n) return;
    resumen.textContent = `${n} ${n === 1 ? T.plato : T.platos} · ${totalTexto()}`;
    // Un pulso breve confirma que el plato entró al pedido.
    if (latido && !quieto) {
      carrito.classList.remove('latido');
      void carrito.offsetWidth;
      carrito.classList.add('latido');
    }
  }

  /* ---------- Confirmar ---------- */

  const detalle = document.getElementById('detalle');
  const totalModal = document.getElementById('total-modal');
  const formulario = document.getElementById('formulario');
  const aviso = document.getElementById('aviso');

  document.getElementById('ver-pedido').addEventListener('click', () => {
    detalle.replaceChildren(...lineas().map((l) => {
      const fila = document.createElement('div');
      fila.className = 'linea';
      const izq = document.createElement('span');
      izq.textContent = `${l.n} × ${nombreDe(l.p)}`;
      const der = document.createElement('span');
      der.className = 'precio';
      der.textContent = l.p.precio ? colones(l.subtotal) : T.porPeso;
      fila.append(izq, der);
      return fila;
    }));
    totalModal.textContent = totalTexto();
    aviso.textContent = '';
    modal.showModal();
  });
  document.getElementById('cerrar').addEventListener('click', () => modal.close());
  // Tocar fuera de la ventana también la cierra.
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.close(); });

  formulario.addEventListener('submit', (e) => {
    e.preventDefault();
    const datos = new FormData(formulario);
    const nom = String(datos.get('nombre') || '').trim();
    const tel = String(datos.get('telefono') || '').trim();
    const dir = String(datos.get('direccion') || '').trim();
    const obs = String(datos.get('observaciones') || '').trim();

    if (!cuantos()) return avisar(T.vacio);
    if (!nom || !dir) return avisar(T.faltan, !nom ? 'nombre' : 'direccion');
    // Sin un teléfono completo no se le puede avisar al cliente si algo falta.
    if (tel.replace(/\D/g, '').length < 8) return avisar(T.telefono, 'telefono');
    // Consentimiento expreso para usar los datos (Ley 8968).
    if (!formulario.elements.acepto.checked) return avisar(T.acepto, 'acepto');

    const enlace = enlaceWhatsapp(nom, tel, dir, obs);
    // Se guarda antes de vaciar: si el navegador bloquea WhatsApp, la página
    // de gracias ofrece mandarlo otra vez sin rehacer el pedido.
    try { sessionStorage.setItem('azumar-ultimo-pedido', enlace); } catch (err) { /* modo privado */ }
    window.open(enlace, '_blank', 'noopener');

    pedido = {};
    guardar();
    modal.close();
    window.location.href = T.gracias;
  });

  function avisar(texto, campo) {
    aviso.textContent = texto;
    if (campo) formulario.elements[campo].focus();
  }

  /** El mensaje va en español SIEMPRE: lo lee la cocina. Mismo formato que el Express. */
  function enlaceWhatsapp(nom, tel, dir, obs) {
    const l = ['*PEDIDO EXPRESS · AzuMar*', '', `*Cliente:* ${nom}`, `*Teléfono:* ${tel}`, `*Dirección:* ${dir}`, '', '*Pedido:*'];
    for (const li of lineas()) {
      l.push(`• ${li.n} x ${li.p.es}${li.p.precio ? '  ' + colones(li.subtotal, false) : '  (precio según peso)'}`);
    }
    l.push('', `*Total: ${totalTexto(true)}*`, '_Impuestos incluidos. El pescado entero se cobra según peso._');
    if (obs) l.push('', `*Observaciones:* ${obs}`);
    return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(l.join('\n'))}`;
  }

  document.getElementById('vaciar').addEventListener('click', () => {
    if (!confirm(T.confirmarVaciar)) return;
    const ids = Object.keys(pedido);
    pedido = {};
    guardar();
    ids.forEach(pintarFila);
    pintarCarrito();
    modal.close();
  });

  /* ---------- Barra de secciones ---------- */

  const barra = document.querySelector('#secciones ul');
  const enlaces = new Map([...barra.querySelectorAll('a')].map((a) => [a.hash.slice(1), a]));
  const vigiaSecciones = new IntersectionObserver((entradas) => {
    for (const e of entradas) {
      if (!e.isIntersecting) continue;
      const a = enlaces.get(e.target.id);
      if (!a || a.getAttribute('aria-current')) continue;
      enlaces.forEach((x) => x.removeAttribute('aria-current'));
      a.setAttribute('aria-current', 'true');
      barra.scrollTo({ left: a.offsetLeft - barra.clientWidth / 2 + a.offsetWidth / 2, behavior: quieto ? 'auto' : 'smooth' });
    }
  }, { rootMargin: '-30% 0px -65% 0px' });
  document.querySelectorAll('.grupo').forEach((s) => vigiaSecciones.observe(s));
  barra.querySelectorAll('a').forEach((a) => a.addEventListener('click', (e) => {
    e.preventDefault();
    const destino = document.getElementById(a.hash.slice(1));
    const barras = document.getElementById('nav').offsetHeight + document.getElementById('secciones').offsetHeight;
    const aire = parseFloat(getComputedStyle(destino).paddingTop);
    // El navegador calcula el salto (también con la página ampliada del modo escritorio).
    destino.style.scrollMarginTop = `${barras - aire + 28}px`;
    destino.scrollIntoView({ behavior: quieto ? 'auto' : 'smooth' });
  }));

  // Si venía con platos elegidos, se le devuelven marcados (y se descartan los que ya no existen).
  for (const id of Object.keys(pedido)) {
    if (!porId.has(id)) delete pedido[id];
    else pintarFila(id);
  }
  guardar();
  pintarCarrito();
}
