/**
 * Menú de la barra en celular: abre y cierra, se cierra con Esc, al tocar un
 * enlace o al tocar fuera. En pantallas anchas el botón no se ve.
 */
const nav = document.getElementById('nav');
const boton = nav && nav.querySelector('.nav-menu');
if (boton) {
  const poner = (abierto) => {
    nav.classList.toggle('abierto', abierto);
    boton.setAttribute('aria-expanded', String(abierto));
  };
  boton.addEventListener('click', () => poner(!nav.classList.contains('abierto')));
  nav.querySelectorAll('.nav-enlaces a').forEach((a) => a.addEventListener('click', () => poner(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('abierto')) { poner(false); boton.focus(); }
  });
  document.addEventListener('click', (e) => { if (!nav.contains(e.target)) poner(false); });
}
