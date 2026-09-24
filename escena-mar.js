/**
 * El mar de la portada: un océano en 3D a la hora dorada.
 *
 * Todo es código (Three.js + shaders propios): no hay modelos que descargar,
 * así que la portada pesa lo mismo en cualquier teléfono. Las olas se calculan
 * en la tarjeta de video; el procesador solo mueve la cámara.
 *
 * Quien pide menos movimiento (ajuste del sistema) recibe una sola imagen
 * quieta del mismo mar. Si el aparato no tiene WebGL, la página muestra un
 * fondo en degradado y todo lo demás funciona igual.
 */
import * as THREE from './three.module.min.js';

// Mismo azul y dorado del logo y de la carta.
const MARINO = new THREE.Color('#001A3E');
const MARINO_ALTO = new THREE.Color('#0F2A52');
const AZUL_OLA = new THREE.Color('#1B4FA8');
const DORADO = new THREE.Color('#D6A93B');
const DORADO_SUAVE = new THREE.Color('#E8C978');

const OLAS_VERTEX = /* glsl */ `
  uniform float uTiempo;
  varying vec3 vMundo;
  varying vec3 vNormal;
  varying float vAltura;

  // Cuatro trenes de olas con direcciones distintas: con uno solo se ve
  // un patrón repetido; con cuatro, el mar parece de verdad.
  float ola(vec2 p, vec2 dir, float frec, float amp, float vel) {
    return sin(dot(p, dir) * frec + uTiempo * vel) * amp;
  }
  float altura(vec2 p) {
    float h = 0.0;
    h += ola(p, normalize(vec2( 1.0,  0.35)), 0.38, 0.34, 0.9);
    h += ola(p, normalize(vec2(-0.6,  1.0 )), 0.61, 0.18, 1.2);
    h += ola(p, normalize(vec2( 0.2, -1.0 )), 1.13, 0.07, 1.7);
    h += ola(p, normalize(vec2( 1.0, -0.8 )), 2.07, 0.035, 2.3);
    return h;
  }

  void main() {
    vec3 pos = position;
    vec2 p = (modelMatrix * vec4(pos, 1.0)).xz;
    float h = altura(p);
    pos.z += h; // el plano está acostado: z local es la altura

    // Normal por diferencias finitas: más barato que derivar a mano.
    float e = 0.08;
    float hx = altura(p + vec2(e, 0.0));
    float hz = altura(p + vec2(0.0, e));
    vNormal = normalize(vec3(h - hx, e, h - hz));

    vec4 mundo = modelMatrix * vec4(pos, 1.0);
    vMundo = mundo.xyz;
    vAltura = h;
    gl_Position = projectionMatrix * viewMatrix * mundo;
  }
`;

const OLAS_FRAGMENT = /* glsl */ `
  uniform vec3 uMarino;
  uniform vec3 uMarinoAlto;
  uniform vec3 uAzulOla;
  uniform vec3 uDorado;
  uniform vec3 uDoradoSuave;
  uniform vec3 uSol;
  uniform vec3 uCamara;
  varying vec3 vMundo;
  varying vec3 vNormal;
  varying float vAltura;

  void main() {
    vec3 n = normalize(vNormal);
    vec3 v = normalize(uCamara - vMundo);
    float fresnel = pow(1.0 - max(dot(n, v), 0.0), 4.0);

    // Base: marino profundo; las crestas toman el azul de la ola del logo.
    vec3 color = mix(uMarino, uMarinoAlto, smoothstep(-0.4, 0.4, vAltura));
    color = mix(color, uAzulOla, smoothstep(0.18, 0.6, vAltura) * 0.55);

    // Relieve: las caras que miran al sol se aclaran un poco, así el agua
    // cercana no queda como una mancha plana.
    float cara = clamp(dot(n, normalize(vec3(uSol.x, 0.6, uSol.z))), 0.0, 1.0);
    color += uAzulOla * pow(cara, 3.0) * 0.22;

    // El cielo del atardecer reflejado en el agua.
    color = mix(color, mix(uMarinoAlto, uDorado, 0.35), fresnel * 0.55);

    // Destellos del sol: el camino de luz dorada sobre el agua.
    vec3 r = reflect(-v, n);
    float brillo = max(dot(r, uSol), 0.0);
    color += uDoradoSuave * pow(brillo, 260.0) * 2.4;
    color += uDorado * pow(brillo, 18.0) * 0.28;

    // A lo lejos el agua se funde con la bruma del horizonte.
    float dist = length(vMundo.xz - uCamara.xz);
    vec3 bruma = mix(uMarinoAlto, uDorado, 0.22);
    color = mix(color, bruma, smoothstep(14.0, 46.0, dist));

    gl_FragColor = vec4(color, 1.0);
  }
`;

const CIELO_VERTEX = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vDir = normalize((modelMatrix * vec4(position, 1.0)).xyz);
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
  }
`;

const CIELO_FRAGMENT = /* glsl */ `
  uniform vec3 uMarino;
  uniform vec3 uMarinoAlto;
  uniform vec3 uDorado;
  uniform vec3 uDoradoSuave;
  uniform vec3 uSol;
  varying vec3 vDir;
  void main() {
    vec3 d = normalize(vDir);
    float alto = clamp(d.y, 0.0, 1.0);
    // Arriba noche marina, abajo el resplandor dorado del sol que se pone.
    vec3 color = mix(mix(uMarinoAlto, uDorado, 0.30), uMarino, pow(alto, 0.45));
    float sol = max(dot(d, uSol), 0.0);
    color += uDorado * pow(sol, 9.0) * 0.45;
    color += uDoradoSuave * smoothstep(0.9986, 0.9996, sol) * 0.75;
    color += uDoradoSuave * pow(sol, 400.0) * 0.35;
    gl_FragColor = vec4(color, 1.0);
  }
`;

/**
 * Monta el mar dentro de `lienzo`. Devuelve un control con:
 *  - setAvance(0..1): cuánto se ha bajado por la portada (la cámara se hunde)
 *  - pausar(bool): deja de dibujar cuando la portada no se ve
 * o null si el aparato no puede dibujar 3D.
 */
export function montarMar(lienzo, { quieto = false } = {}) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas: lienzo,
      antialias: false,
      powerPreference: 'high-performance',
    });
  } catch (e) {
    return null;
  }

  const movil = window.matchMedia('(max-width: 767px)').matches;
  // Más de 2 píxeles por punto no se nota y cuesta el triple.
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, movil ? 1.25 : 2));

  const escena = new THREE.Scene();
  const camara = new THREE.PerspectiveCamera(52, 1, 0.1, 200);
  const sol = new THREE.Vector3(0.18, 0.1, -1).normalize();

  const uniformes = {
    uTiempo: { value: 0 },
    uMarino: { value: MARINO },
    uMarinoAlto: { value: MARINO_ALTO },
    uAzulOla: { value: AZUL_OLA },
    uDorado: { value: DORADO },
    uDoradoSuave: { value: DORADO_SUAVE },
    uSol: { value: sol },
    uCamara: { value: camara.position },
  };

  const detalle = movil ? 110 : 220;
  const mar = new THREE.Mesh(
    new THREE.PlaneGeometry(110, 110, detalle, detalle),
    new THREE.ShaderMaterial({ vertexShader: OLAS_VERTEX, fragmentShader: OLAS_FRAGMENT, uniforms: uniformes })
  );
  mar.rotation.x = -Math.PI / 2;
  mar.position.z = -30;
  escena.add(mar);

  const cielo = new THREE.Mesh(
    new THREE.SphereGeometry(120, 32, 16),
    new THREE.ShaderMaterial({
      vertexShader: CIELO_VERTEX,
      fragmentShader: CIELO_FRAGMENT,
      uniforms: uniformes,
      side: THREE.BackSide,
      depthWrite: false,
    })
  );
  escena.add(cielo);

  // Chispas doradas que flotan sobre el agua, como brisa con luz.
  const cantidad = movil ? 140 : 320;
  const posiciones = new Float32Array(cantidad * 3);
  const semillas = new Float32Array(cantidad);
  for (let i = 0; i < cantidad; i++) {
    posiciones[i * 3] = (Math.random() - 0.5) * 26;
    posiciones[i * 3 + 1] = 0.4 + Math.random() * 4.2;
    posiciones[i * 3 + 2] = -Math.random() * 26 + 2;
    semillas[i] = Math.random() * 100;
  }
  const geoChispas = new THREE.BufferGeometry();
  geoChispas.setAttribute('position', new THREE.BufferAttribute(posiciones, 3));
  geoChispas.setAttribute('aSemilla', new THREE.BufferAttribute(semillas, 1));
  const chispas = new THREE.Points(
    geoChispas,
    new THREE.ShaderMaterial({
      uniforms: { uTiempo: uniformes.uTiempo, uDorado: uniformes.uDoradoSuave, uEscala: { value: renderer.getPixelRatio() } },
      vertexShader: /* glsl */ `
        uniform float uTiempo;
        uniform float uEscala;
        attribute float aSemilla;
        varying float vLuz;
        void main() {
          vec3 p = position;
          p.y += sin(uTiempo * 0.35 + aSemilla) * 0.25;
          p.x += cos(uTiempo * 0.22 + aSemilla * 1.7) * 0.3;
          vLuz = 0.35 + 0.65 * (0.5 + 0.5 * sin(uTiempo * 1.4 + aSemilla * 3.1));
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_PointSize = uEscala * 26.0 / -mv.z;
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uDorado;
        varying float vLuz;
        void main() {
          float d = length(gl_PointCoord - 0.5);
          float a = (1.0 - smoothstep(0.0, 0.5, d)) * vLuz * 0.7;
          gl_FragColor = vec4(uDorado, a);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
  );
  escena.add(chispas);

  // Cámara: se inclina un poco hacia el mouse o el dedo, con inercia, y se
  // hunde hacia el agua a medida que se baja por la página.
  const puntero = { x: 0, y: 0 };
  const suave = { x: 0, y: 0 };
  let avance = 0;
  let avanceSuave = 0;

  if (!quieto) {
    window.addEventListener(
      'pointermove',
      (e) => {
        puntero.x = (e.clientX / window.innerWidth) * 2 - 1;
        puntero.y = (e.clientY / window.innerHeight) * 2 - 1;
      },
      { passive: true }
    );
  }

  function colocarCamara() {
    suave.x += (puntero.x - suave.x) * 0.04;
    suave.y += (puntero.y - suave.y) * 0.04;
    avanceSuave += (avance - avanceSuave) * 0.08;
    const a = avanceSuave;
    camara.position.set(suave.x * 0.9, 2.3 - a * 1.5 - suave.y * 0.25, 6 - a * 3);
    camara.lookAt(suave.x * 1.6, 1.25 - a * 1.9, -20);
  }

  function ajustar() {
    const w = lienzo.clientWidth;
    const h = lienzo.clientHeight;
    renderer.setSize(w, h, false);
    camara.aspect = w / h;
    // En teléfono vertical se abre el ángulo para que el sol no quede fuera.
    camara.fov = w / h < 0.8 ? 68 : 52;
    camara.updateProjectionMatrix();
  }
  new ResizeObserver(ajustar).observe(lienzo);
  ajustar();

  // El tiempo se acumula a mano: si se pausa y se reanuda, las olas siguen
  // donde estaban en vez de saltar.
  let antes = performance.now();
  let tiempo = 0;
  let pausado = false;
  let cuadro = 0;

  function dibujar() {
    if (pausado) return;
    const ahora = performance.now();
    tiempo += Math.min((ahora - antes) / 1000, 0.05);
    antes = ahora;
    uniformes.uTiempo.value = tiempo;
    colocarCamara();
    renderer.render(escena, camara);
    cuadro = requestAnimationFrame(dibujar);
  }

  if (quieto) {
    uniformes.uTiempo.value = 4.2;
    colocarCamara();
    renderer.render(escena, camara);
  } else {
    dibujar();
  }

  return {
    setAvance(v) {
      avance = v;
      if (quieto) {
        avanceSuave = v;
        colocarCamara();
        renderer.render(escena, camara);
      }
    },
    pausar(si) {
      if (quieto || si === pausado) return;
      pausado = si;
      if (si) {
        cancelAnimationFrame(cuadro);
      } else {
        antes = performance.now(); // descarta el tiempo que estuvo en pausa
        dibujar();
      }
    },
  };
}
