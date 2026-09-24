/**
 * Todo el movimiento de la página, en un solo lugar.
 *
 * Cada animación tiene un porqué:
 *  - portada: el mensaje entra por orden (título, texto, botones) y la cámara
 *    se hunde en el mar al bajar, que es lo que lleva a la cocina
 *  - platos: la sección se queda quieta y las fotos pasan de lado, como
 *    recorrer una vitrina
 *  - plato estrella: se inclina con el puntero para verlo "de cerca"
 *  - express: la foto se acerca mientras se leen los tres pasos
 *
 * Quien tiene activado "reducir movimiento" ve la misma página, quieta y
 * completa. Si GSAP no carga, todo el contenido queda visible igual.
 */
import { montarMar } from './escena-mar.js';

const quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const raiz = document.documentElement;
const { gsap, ScrollTrigger, Lenis } = window;
const hayGsap = Boolean(gsap && ScrollTrigger);

/* ---------- El mar ---------- */

const lienzo = document.getElementById('mar');
const mar = montarMar(lienzo, { quieto });
if (mar) {
  requestAnimationFrame(() => lienzo.classList.add('listo'));
  // Si la portada no se ve, no se gasta batería dibujando olas.
  new IntersectionObserver(([e]) => mar.pausar(!e.isIntersecting)).observe(document.querySelector('.portada'));
}

/* ---------- Plato estrella que se inclina ---------- */

montarTarjeta();

/* ---------- Sin GSAP o sin movimiento: página quieta y completa ---------- */

if (!hayGsap || quieto) {
  raiz.classList.remove('js-anima');
  document.querySelector('.platos').classList.add('nativa');
  navegacionSimple();
} else {
  animar();
}
raiz.classList.add('animado');

function animar() {
  gsap.registerPlugin(ScrollTrigger);

  // Desplazamiento suave con inercia. En pantallas táctiles se deja el
  // nativo: el dedo ya tiene su propia inercia y pelear con ella se siente mal.
  if (Lenis) {
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    document.querySelectorAll('a[href^="#"]:not(.saltar)').forEach((a) => {
      a.addEventListener('click', (e) => {
        const destino = a.getAttribute('href');
        if (destino.length < 2) return;
        e.preventDefault();
        lenis.scrollTo(destino, { offset: destino === '#inicio' ? 0 : -72, duration: 1.3 });
      });
    });
  }

  // Entrada de la portada, en orden de lectura.
  const entrada = gsap.timeline({ defaults: { ease: 'expo.out', duration: 1.2 } });
  entrada
    .to('.portada .revela', { opacity: 1, y: 0, stagger: 0.14 }, 0.15)
    .from('.portada-logo', { opacity: 0, scale: 0.92, y: 30, duration: 1.6 }, 0.35);

  // El logo flota sobre el agua, como una boya.
  gsap.to('.portada-logo img', { y: -14, rotation: -0.6, duration: 3.4, ease: 'sine.inOut', yoyo: true, repeat: -1 });

  // Al bajar, la cámara se hunde en el mar y el texto se aparta.
  ScrollTrigger.create({
    trigger: '.portada',
    start: 'top top',
    end: 'bottom top',
    scrub: true,
    onUpdate: (st) => mar && mar.setAvance(st.progress),
  });
  gsap.to('.portada-contenido', {
    y: -90, opacity: 0, ease: 'none',
    scrollTrigger: { trigger: '.portada', start: 'top top', end: '85% top', scrub: true },
  });

  // Platos: pista horizontal fijada. Solo en pantallas anchas; en teléfono
  // se desliza con el dedo, que es lo natural ahí.
  const medidas = gsap.matchMedia();
  medidas.add('(min-width: 768px)', () => {
    const seccion = document.querySelector('.platos');
    const pista = document.getElementById('pista');
    const recorrido = () => pista.scrollWidth - window.innerWidth;
    const tween = gsap.to(pista, {
      x: () => -recorrido(),
      ease: 'none',
      scrollTrigger: {
        trigger: seccion,
        start: 'top top',
        end: () => '+=' + recorrido(),
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
      },
    });
    // Cada foto se acerca un poco al entrar en pantalla.
    gsap.utils.toArray('.plato-foto img').forEach((img) => {
      gsap.fromTo(img, { scale: 1.2 }, {
        scale: 1.02, ease: 'none',
        scrollTrigger: { trigger: img, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true },
      });
    });
  });
  medidas.add('(max-width: 767px)', () => {
    document.querySelector('.platos').classList.add('nativa');
    return () => document.querySelector('.platos').classList.remove('nativa');
  });

  // Express: la foto se acerca mientras se leen los pasos.
  gsap.fromTo('.express-foto img', { scale: 1.18 }, {
    scale: 1, ease: 'none',
    scrollTrigger: { trigger: '.express', start: 'top bottom', end: 'bottom top', scrub: true },
  });

  // Títulos, pasos y celdas aparecen al llegar a ellos.
  const aparecer = gsap.utils.toArray('.estrella-texto > *, .express-texto > h2, .express-intro, .pasos li, .visita h2, .celda');
  gsap.set(aparecer, { opacity: 0, y: 28 });
  ScrollTrigger.batch(aparecer, {
    start: 'top 88%',
    once: true,
    onEnter: (lote) => gsap.to(lote, { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out', stagger: 0.08 }),
  });

  // La barra de arriba: se esconde al bajar y vuelve al subir.
  const nav = document.getElementById('nav');
  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: (st) => {
      nav.classList.toggle('con-fondo', st.scroll() > 40);
      nav.classList.toggle('escondida', st.direction === 1 && st.scroll() > 400);
    },
  });

  // Las fotos cargan tarde: al terminar, las medidas de la pista cambian.
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

function navegacionSimple() {
  const nav = document.getElementById('nav');
  const vigia = document.createElement('div');
  vigia.style.cssText = 'position:absolute;top:40px;height:1px;width:1px';
  document.body.prepend(vigia);
  new IntersectionObserver(([e]) => nav.classList.toggle('con-fondo', !e.isIntersecting)).observe(vigia);
}

function montarTarjeta() {
  const escena = document.getElementById('escena-plato');
  const tarjeta = document.getElementById('tarjeta-plato');
  if (!escena || !tarjeta) return;

  const meta = { x: 0, y: 0 };
  const ahora = { x: 0, y: 0 };
  let tocando = false;
  let visible = false;
  let cuadro = 0;
  let t = 0;

  escena.addEventListener('pointermove', (e) => {
    const r = escena.getBoundingClientRect();
    meta.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    meta.y = ((e.clientY - r.top) / r.height) * 2 - 1;
    tocando = true;
  });
  escena.addEventListener('pointerleave', () => { tocando = false; });

  function pintar() {
    // Sin puntero encima, se mece solo, despacio.
    if (!tocando && !quieto) {
      t += 0.012;
      meta.x = Math.sin(t) * 0.45;
      meta.y = Math.sin(t * 0.7) * 0.25;
    }
    // Inercia de resorte: sigue al puntero sin pegarse a él.
    ahora.x += (meta.x - ahora.x) * 0.08;
    ahora.y += (meta.y - ahora.y) * 0.08;
    tarjeta.style.transform = `rotateY(${ahora.x * 16}deg) rotateX(${-ahora.y * 12}deg) translateZ(0)`;
    tarjeta.style.setProperty('--bx', `${50 + ahora.x * 40}%`);
    tarjeta.style.setProperty('--by', `${35 + ahora.y * 35}%`);
    if (visible) cuadro = requestAnimationFrame(pintar);
  }

  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    cancelAnimationFrame(cuadro);
    if (visible) cuadro = requestAnimationFrame(pintar);
  }).observe(escena);
}
