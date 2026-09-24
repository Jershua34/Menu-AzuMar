/**
 * La carta en texto, armada a partir de platos.js (el mismo archivo del pedido a domicilio).
 *
 * Por qué se arma aquí y no se escribe a mano en el HTML: los precios ya viven
 * en dos lugares (las imágenes de la carta impresa y platos.js). Escribirlos
 * otra vez en esta página sería un tercero que tarde o temprano queda viejo.
 */
import { montarMar } from './escena-mar.js';

const quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const raiz = document.documentElement;
const { gsap, ScrollTrigger, Lenis } = window;
// Teléfono con "Sitio de escritorio": sin animaciones ligadas al scroll.
const animar = Boolean(gsap && ScrollTrigger) && !quieto && !raiz.classList.contains('modo-escritorio');

// Un solo archivo para las dos cartas: el idioma lo dice <html lang>.
const EN = raiz.lang.startsWith('en');
const T = EN
  ? {
      porPeso: 'By weight',
      cadaUna: 'each',
      notaCasa: 'Ask your server about the ingredients in each one.',
      errorTitulo: 'We couldn’t load the menu',
      errorTexto: 'Check your connection and try again. You can also ask us on WhatsApp.',
      reintentar: 'Try again',
      cartaImagenes: 'Message us on WhatsApp',
      urlImagenes: 'https://wa.me/50687758360',
    }
  : {
      porPeso: 'Según peso',
      cadaUna: 'cada una',
      notaCasa: 'Pregunta a tu mesero por los ingredientes de cada una.',
      errorTitulo: 'No pudimos cargar la carta',
      errorTexto: 'Revisa tu conexión e inténtalo de nuevo. También puedes preguntarnos por WhatsApp.',
      reintentar: 'Intentar de nuevo',
      cartaImagenes: 'Escribir por WhatsApp',
      urlImagenes: 'https://wa.me/50687758360',
    };
const nombreDe = (p) => (EN ? p.en : p.es);
const descripcionDe = (p) => (EN ? p.dEn : p.dEs);

// Fotos reales que tenemos, por plato. Solo estos platos llevan foto.
const FOTOS = {
  p0: 'plato-ceviche',
  p8: 'plato-calamares',
  p9: 'plato-coctel',
  p11: 'plato-camarones-patacon',
  p21: 'plato-quesadilla',
  p27: 'plato-arroz-azumar',
  p28: 'plato-pescado-entero',
  p32: 'plato-filet-maracuya',
  p33: 'plato-filet-camarones',
  p35: 'plato-tartar',
  p39: 'plato-churrasco',
};

// La foto grande que acompaña a cada sección, cuando hay una que le quede.
const FOTO_SECCION = {
  'entradas': ['plato-coctel', 'Cóctel de camarón jumbo en copa, con patacones', 'Jumbo shrimp cocktail in a glass, with fried plantain'],
  'sea-fast-food': ['plato-quesadilla', 'Quesadilla de camarón con papas fritas', 'Shrimp quesadilla with French fries'],
  'arroces': ['plato-arroz-azumar', 'Arroz AzuMar con camarones y lomito', 'AzuMar rice with shrimp and beef tenderloin'],
  'platos-principales': ['plato-pescado-entero', 'Pescado entero con ensalada y patacones', 'Whole fish with salad and fried plantain'],
  'cortes': ['plato-churrasco', 'Churrasco a la parrilla con chimichurri', 'Grilled churrasco steak with chimichurri'],
};

/* ---------- El mar de la cabecera ---------- */

const lienzo = document.getElementById('mar');
const mar = montarMar(lienzo, { quieto });
if (mar) {
  requestAnimationFrame(() => lienzo.classList.add('listo'));
  mar.setAvance(0.25); // un poco más cerca del agua que en la portada
  new IntersectionObserver(([e]) => mar.pausar(!e.isIntersecting)).observe(document.querySelector('.carta-cabeza'));
}

/* ---------- Armar la carta ---------- */

const contenedor = document.getElementById('carta');
let lenis = null;

if (animar) {
  gsap.registerPlugin(ScrollTrigger);
  if (Lenis) {
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  gsap.to('.carta-cabeza .revela', { opacity: 1, y: 0, stagger: 0.12, duration: 1.1, ease: 'expo.out', delay: 0.1 });
} else {
  raiz.classList.remove('js-anima');
  // Sin animaciones, la barra de arriba toma fondo con un vigía simple.
  const vigia = document.createElement('div');
  vigia.style.cssText = 'position:absolute;top:40px;height:1px;width:1px';
  document.body.prepend(vigia);
  new IntersectionObserver(([e]) => document.getElementById('nav').classList.toggle('con-fondo', !e.isIntersecting)).observe(vigia);
}
raiz.classList.add('animado');

if (Array.isArray(window.PLATOS) && window.CATEGORIAS) {
  armar(window.CATEGORIAS, window.PLATOS);
} else {
  mostrarError();
}

function armar(categorias, platos) {
  const fragmento = document.createDocumentFragment();
  const pastillas = document.getElementById('lista-secciones');
  let conFoto = 0;

  for (const [clave, [nombreEs, nombreEn]] of Object.entries(categorias)) {
    const nombre = EN ? nombreEn : nombreEs;
    const suyos = platos.filter((p) => p.cat === clave);
    if (!suyos.length) continue;

    const seccion = document.createElement('section');
    seccion.className = 'grupo';
    seccion.id = clave;
    seccion.setAttribute('aria-labelledby', `t-${clave}`);

    const foto = FOTO_SECCION[clave];
    if (foto) {
      // Las fotos se alternan de lado: una a la izquierda, la siguiente a la derecha.
      seccion.classList.add('grupo-con-foto');
      if (conFoto++ % 2) seccion.classList.add('foto-derecha');
    }

    seccion.innerHTML = `
      ${foto ? `<div class="grupo-foto"><img src="${foto[0]}-720.webp" srcset="${foto[0]}-720.webp 720w, ${foto[0]}.webp 1400w" sizes="(max-width: 899px) 100vw, 40vw" alt="${EN ? foto[2] : foto[1]}" loading="lazy" width="720" height="900"></div>` : ''}
      <div class="grupo-cuerpo">
        <h2 id="t-${esc(clave)}">${esc(nombre)}</h2>
        ${lista(suyos)}
      </div>`;
    fragmento.append(seccion);

    const li = document.createElement('li');
    li.innerHTML = `<a href="#${esc(clave)}">${esc(nombre)}</a>`;
    pastillas.append(li);
  }

  contenedor.replaceChildren(fragmento);
  contenedor.setAttribute('aria-busy', 'false');

  seguirSeccionActiva();
  enlazarPastillas();
  if (animar) animarCarta();
}

/**
 * Una categoría donde todo cuesta lo mismo y comparte descripción (las
 * bebidas de la casa) se muestra como un bloque: un precio y los nombres.
 * Repetir "₡3.955" siete veces no le dice nada nuevo a nadie.
 */
function lista(suyos) {
  const mismoPrecio = suyos.every((p) => p.precio === suyos[0].precio);
  const mismaDescripcion = suyos.every((p) => descripcionDe(p) === descripcionDe(suyos[0]));
  if (suyos.length >= 4 && mismoPrecio && mismaDescripcion) {
    return `
      <div class="bloque-casa">
        <p class="bloque-precio"><span class="precio">${precio(suyos[0].precio)}</span> ${T.cadaUna}</p>
        <ul class="bloque-nombres" role="list">${suyos.map((p) => `<li>${esc(nombreDe(p))}</li>`).join('')}</ul>
        <p class="bloque-nota">${T.notaCasa}</p>
      </div>`;
  }

  return `<ul class="items" role="list">${suyos.map((p) => {
    const f = FOTOS[p.id];
    return `
      <li class="item${f ? ' item-con-foto' : ''}">
        ${f ? `<img class="item-foto" src="${f}-720.webp" alt="" loading="lazy" width="96" height="96">` : ''}
        <div class="item-texto">
          <div class="item-linea">
            <h3>${esc(nombreDe(p))}</h3>
            <span class="item-puntos" aria-hidden="true"></span>
            <span class="precio">${precio(p.precio)}</span>
          </div>
          ${descripcionDe(p) ? `<p>${esc(descripcionDe(p))}</p>` : ''}
        </div>
      </li>`;
  }).join('')}</ul>`;
}

// ₡4.800 en español (como la carta impresa), ₡4,800 en inglés. 0 = se cobra por peso.
function precio(n) {
  if (!n) return T.porPeso;
  return '₡' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, EN ? ',' : '.');
}

function esc(t) {
  return String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

function mostrarError() {
  contenedor.setAttribute('aria-busy', 'false');
  contenedor.innerHTML = `
    <div class="carta-aviso">
      <h2>${T.errorTitulo}</h2>
      <p>${T.errorTexto}</p>
      <div class="portada-botones">
        <button class="boton boton-oro" type="button" onclick="location.reload()">${T.reintentar}</button>
        <a class="boton boton-linea" href="${T.urlImagenes}">${T.cartaImagenes}</a>
      </div>
    </div>`;
  document.getElementById('secciones').hidden = true;
}

/* ---------- Barra de secciones ---------- */

function seguirSeccionActiva() {
  const barra = document.querySelector('#secciones ul');
  const enlaces = new Map([...barra.querySelectorAll('a')].map((a) => [a.hash.slice(1), a]));

  // "Activa" = la sección que cruza una franja a un tercio de la pantalla.
  const vigia = new IntersectionObserver((entradas) => {
    for (const e of entradas) {
      if (!e.isIntersecting) continue;
      const a = enlaces.get(e.target.id);
      if (!a || a.getAttribute('aria-current')) continue;
      enlaces.forEach((x) => x.removeAttribute('aria-current'));
      a.setAttribute('aria-current', 'true');
      // Que la pastilla activa quede a la vista dentro de la barra.
      const destino = a.offsetLeft - barra.clientWidth / 2 + a.offsetWidth / 2;
      barra.scrollTo({ left: destino, behavior: quieto ? 'auto' : 'smooth' });
    }
  }, { rootMargin: '-30% 0px -65% 0px' });

  document.querySelectorAll('.grupo').forEach((s) => vigia.observe(s));
}

function enlazarPastillas() {
  document.querySelectorAll('#secciones a').forEach((a) => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      // Se calcula el punto exacto: el título queda justo debajo de la barra,
      // sin el aire de arriba de la sección (que sí se ve al llegar bajando).
      const destino = document.getElementById(a.hash.slice(1));
      const barras = document.getElementById('nav').offsetHeight + document.getElementById('secciones').offsetHeight;
      const aire = parseFloat(getComputedStyle(destino).paddingTop);
      if (lenis) {
        const y = destino.getBoundingClientRect().top + window.scrollY - barras + aire - 28;
        lenis.scrollTo(y, { duration: 1.1 });
      } else {
        // Sin desplazamiento suave (o con la página ampliada del modo escritorio)
        // el navegador calcula el salto: el margen se da en la misma unidad que usa él.
        destino.style.scrollMarginTop = `${barras - aire + 28}px`;
        destino.scrollIntoView({ behavior: quieto ? 'auto' : 'smooth' });
      }
      history.replaceState(null, '', a.hash);
    });
  });
}

/* ---------- Movimiento ---------- */

function animarCarta() {
  // Los títulos y platos aparecen al llegar a ellos; las fotos se acercan.
  const aparecer = gsap.utils.toArray('.grupo h2, .item, .bloque-casa, .carta-cierre > *');
  gsap.set(aparecer, { opacity: 0, y: 22 });
  ScrollTrigger.batch(aparecer, {
    start: 'top 92%',
    once: true,
    onEnter: (lote) => gsap.to(lote, { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out', stagger: 0.05 }),
  });

  gsap.utils.toArray('.grupo-foto img').forEach((img) => {
    gsap.fromTo(img, { scale: 1.16 }, {
      scale: 1, ease: 'none',
      scrollTrigger: { trigger: img.closest('.grupo'), start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });

  // La barra de arriba gana fondo al bajar.
  const nav = document.getElementById('nav');
  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (st) => nav.classList.toggle('con-fondo', st.scroll() > 40) });

  // Si llegaron con un #seccion en la dirección, ir ahí ya con la carta armada.
  if (location.hash && document.getElementById(location.hash.slice(1))) {
    requestAnimationFrame(() => document.querySelector(`#secciones a[href="${location.hash}"]`)?.click());
  }
  window.addEventListener('load', () => ScrollTrigger.refresh());
}
