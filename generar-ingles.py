# Genera las páginas en inglés (en, carta-en, pedido-en, gracias-en) a partir de las españolas.
# Uso: python generar-ingles.py  (desde esta carpeta, cada vez que cambie una página en español)
# Cada reemplazo exige encontrar el texto exacto: si la página española cambia
# y una frase ya no está, el script falla en vez de dejar español mezclado.
import os
os.chdir(os.path.dirname(os.path.abspath(__file__)))

def traducir(src, dst, pares):
    s = open(src, encoding="utf-8").read()
    for a, b in pares:
        assert a in s, (src, a[:80])
        s = s.replace(a, b)
    open(dst, "w", encoding="utf-8", newline="\n").write(s)

M = "https://menu-azu-mar.vercel.app/"
comunes = [
    ('<html lang="es-CR">', '<html lang="en">'),
    ('href="pedido.html"', 'href="pedido-en.html"'),
    ('href="legal.html">Términos y privacidad</a>', 'href="legal-en.html">Terms and privacy</a>'),
    ('<p>Restaurante y Marisquería AzuMar · Quepos, Costa Rica</p>', '<p>AzuMar Restaurant and Seafood House · Quepos, Costa Rica</p>'),
    ('alt="AzuMar, del mar a tu mesa"', 'alt="AzuMar, from the sea to your table"'),
    ('>Pedir a domicilio</a>', '>Order delivery</a>'),
    ('<nav aria-label="Principal">', '<nav aria-label="Main">'),
    ('aria-label="Abrir la navegación"', 'aria-label="Open navigation"'),
]

inicio = [
    ('<span class="solo-lector"> (abre en otra pestaña)</span>', '<span class="solo-lector"> (opens in a new tab)</span>'),
    ('<title>AzuMar · Restaurante y Marisquería en Quepos, Costa Rica</title>', '<title>AzuMar · Seafood Restaurant in Quepos, Costa Rica</title>'),
    ('content="Mariscos, cortes de carne y cocina tica en Quepos. Abierto todos los días de 12 md a 11 pm, con servicio a domicilio."', 'content="Seafood, steaks and Costa Rican cooking in Quepos. Open every day from noon to 11 pm, with home delivery."'),
    ('<meta property="og:locale" content="es_CR">', '<meta property="og:locale" content="en_US">'),
    ('<meta property="og:title" content="AzuMar · Del mar a tu mesa">', '<meta property="og:title" content="AzuMar · From the sea to your table">'),
    ('content="Restaurante y Marisquería en Quepos, Costa Rica. Abierto todos los días de 12 md a 11 pm."', 'content="Seafood restaurant in Quepos, Costa Rica. Open every day from noon to 11 pm."'),
    ('"url": "' + M + '",', '"url": "' + M + 'en",'),
    ('"hasMenu": "' + M + 'carta",', '"hasMenu": "' + M + 'carta-en",'),
    ('<link rel="canonical" href="' + M + '">', '<link rel="canonical" href="' + M + 'en">'),
    ('<meta property="og:url" content="' + M + '">', '<meta property="og:url" content="' + M + 'en">'),
    ('"slogan": "Del mar a tu mesa"', '"slogan": "From the sea to your table"'),
    ('<a class="saltar" href="#contenido">Saltar al contenido</a>', '<a class="saltar" href="#contenido">Skip to content</a>'),
    ('aria-label="AzuMar, volver al inicio"', 'aria-label="AzuMar, back to top"'),
    ('<li><a href="#platos">Platos</a></li>', '<li><a href="#platos">Dishes</a></li>'),
    ('<li><a href="#visitanos">Visítanos</a></li>', '<li><a href="#visitanos">Visit us</a></li>'),
    ('<a class="boton boton-oro boton-chico" href="carta.html">Ver la carta</a>', '<a class="boton boton-oro boton-chico" href="carta-en.html">See the menu</a>'),
    ('<span class="linea">Del mar</span>', '<span class="linea">From the sea</span>'),
    ('<span class="linea">a tu mesa<span class="punto">.</span></span>', '<span class="linea">to your table<span class="punto">.</span></span>'),
    ('Mariscos, cortes de carne y cocina tica en Quepos. Abierto todos los días de 12 md a 11 pm.</p>', 'Seafood, steaks and Costa Rican cooking in Quepos. Open every day from noon to 11 pm.</p>'),
    ('<a class="boton boton-oro" href="carta.html">\n            Ver la carta', '<a class="boton boton-oro" href="carta-en.html">\n            See the menu'),
    ('<h2 id="titulo-platos">Lo que sale de nuestra cocina</h2>', '<h2 id="titulo-platos">From our kitchen</h2>'),
    ('<p>Pescado entero, camarón jumbo y cortes de carne. Estos son algunos de los platos de la carta.</p>', '<p>Whole fish, jumbo shrimp and steaks. Here are some of the dishes on our menu.</p>'),
    ('<a class="enlace-flecha" href="carta.html">\n          La carta completa', '<a class="enlace-flecha" href="carta-en.html">\n          Full menu'),
    ('alt="Pescado entero dorado con ensalada fresca, limón y patacones"', 'alt="Golden whole fish with fresh salad, lime and fried plantain"'),
    ('<h3>Pescado Entero</h3><p>Acompañado de ensalada y patacones. Se cobra según su peso.</p>', '<h3>Whole Fish</h3><p>Served with salad and patacones (fried plantain). Priced by weight.</p>'),
    ('alt="Cóctel de camarón jumbo en copa, con lechuga y patacones"', 'alt="Jumbo shrimp cocktail in a glass, with lettuce and fried plantain"'),
    ('<h3>Cóctel de Camarón</h3><p>Camarón jumbo, salsa coctel, aguacate, pepino y tomate, con patacones.</p>', '<h3>Shrimp Cocktail</h3><p>Jumbo shrimp, cocktail sauce, avocado, cucumber and tomato, with fried plantain.</p>'),
    ('alt="Ceviche de pescado con cebolla morada y culantro"', 'alt="Fish ceviche with red onion and cilantro"'),
    ('<h3>Ceviche de Pescado</h3><p>Marinado en limón con cebolla morada, chile dulce y culantro, con patacones.</p>', '<h3>Fish Ceviche</h3><p>Marinated in lime with red onion, sweet pepper and cilantro, with fried plantain.</p>'),
    ('alt="Arroz AzuMar con camarones y lomito"', 'alt="AzuMar rice with shrimp and beef tenderloin"'),
    ('<h3>Arroz AzuMar</h3><p>Camarones y lomito, acompañado con papas fritas y ensalada.</p>', '<h3>AzuMar Rice</h3><p>Shrimp and beef tenderloin, served with French fries and salad.</p>'),
    ('alt="Tartar de atún en capas con mango y aguacate"', 'alt="Layered tuna tartare with mango and avocado"'),
    ('<h3>Tartar de Atún</h3><p>Servido con mango, aguacate y chips de yuca.</p>', '<h3>Tuna Tartare</h3><p>Served with mango, avocado and cassava chips.</p>'),
    ('alt="Churrasco a la parrilla con chimichurri"', 'alt="Grilled churrasco steak with chimichurri"'),
    ('<h3>Churrasco</h3><p>Con chimichurri argentino, servido con puré y vegetales.</p>', '<h3>Churrasco Steak</h3><p>With Argentine chimichurri, served with mashed potatoes and vegetables.</p>'),
    ('alt="Filet de pescado bañado en salsa de maracuyá"', 'alt="Fish fillet topped with passion fruit sauce"'),
    ('<h3>Filet de Pescado</h3><p>Con salsa de ajo o de maracuyá, servido con puré y vegetales.</p>', '<h3>Fish Fillet</h3><p>With garlic or passion fruit sauce, served with mashed potatoes and vegetables.</p>'),
    ('alt="Filet de pescado cubierto con salsa de camarones"', 'alt="Fish fillet covered in shrimp sauce"'),
    ('<h3>Filet con Salsa de Camarones</h3><p>Acompañado de puré y vegetales.</p>', '<h3>Fish Fillet with Shrimp Sauce</h3><p>Served with mashed potatoes and vegetables.</p>'),
    ('alt="Camarones sobre guacamole y patacones"', 'alt="Shrimp on guacamole and fried plantain"'),
    ('<h3>Camarones con Patacón y Guacamole</h3><p>Camarones sobre una cama de guacamole y patacones.</p>', '<h3>Shrimp with Plantain and Guacamole</h3><p>Shrimp on a bed of guacamole and fried plantain.</p>'),
    ('alt="Aros de calamar empanizados con papas fritas"', 'alt="Breaded calamari rings with French fries"'),
    ('<h3>Aros de Calamar a la AzuMar</h3><p>Calamares empanizados, acompañados con papas fritas.</p>', '<h3>AzuMar Calamari Rings</h3><p>Breaded calamari rings, served with French fries.</p>'),
    ('alt="Quesadilla de camarón con papas fritas y ensalada"', 'alt="Shrimp quesadilla with French fries and salad"'),
    ('<h3>Quesadilla de Camarón</h3><p>Tortilla de harina con camarón salteado y mozzarella, con papas y ensalada.</p>', '<h3>Shrimp Quesadilla</h3><p>Flour tortilla with sautéed shrimp and mozzarella, with fries and salad.</p>'),
    ('alt="Cóctel de camarón jumbo servido en copa de vidrio, con patacones al lado"', 'alt="Jumbo shrimp cocktail served in a glass, with fried plantain on the side"'),
    ('<h2 id="titulo-estrella">El Cóctel de Camarón, <em>de cerca</em></h2>', '<h2 id="titulo-estrella">The Shrimp Cocktail, <em>up close</em></h2>'),
    ('<p>Camarón jumbo en copa, con salsa coctel, aguacate, pepino y tomate. Se sirve con patacones.</p>', '<p>Jumbo shrimp in a glass with cocktail sauce, avocado, cucumber and tomato. Served with patacones, our fried plantain.</p>'),
    ('<h2 id="titulo-express">AzuMar en tu casa</h2>', '<h2 id="titulo-express">AzuMar at home</h2>'),
    ('<p class="express-intro">Pide tus platos favoritos desde el teléfono y te los llevamos a domicilio.</p>', '<p class="express-intro">Order your favorite dishes from your phone and we’ll bring them to your door.</p>'),
    ('<h3>Elige</h3>', '<h3>Choose</h3>'),
    ('<p>Tocas los platos que quieres en la página de pedidos y ves el total al momento.</p>', '<p>Tap the dishes you want on the order page and see the total right away.</p>'),
    ('<li><a href="#express">A domicilio</a></li>', '<li><a href="#express">Delivery</a></li>'),
    ('<h3>Envía</h3>', '<h3>Send</h3>'),
    ('<p>Escribes tu nombre y dirección, y el pedido nos llega directo por WhatsApp.</p>', '<p>Add your name and address, and your order reaches us directly on WhatsApp.</p>'),
    ('<h3>Paga</h3>', '<h3>Pay</h3>'),
    ('<p>Por SINPE Móvil al 8775-8360, a nombre de Yohis Hernández B.</p>', '<p>By SINPE Móvil to 8775-8360, under the name Yohis Hernández B.</p>'),
    ('<h2 id="titulo-visita">Te esperamos en Quepos</h2>', '<h2 id="titulo-visita">Come see us in Quepos</h2>'),
    ('<h3>Horario</h3>', '<h3>Hours</h3>'),
    ('<p class="dato-grande">12 md a 11 pm</p>', '<p class="dato-grande">Noon to 11 pm</p>'),
    ('<p>Abierto todos los días de la semana.</p>', '<p>Open every day of the week.</p>'),
    ('<h3>Dirección</h3>', '<h3>Address</h3>'),
    ('<p>Frente a la entrada principal, Puntarenas.</p>', '<p>Across from the main entrance, Puntarenas.</p>'),
    ('<span class="enlace-flecha">Cómo llegar', '<span class="enlace-flecha">Get directions'),
    ('<h3>WhatsApp y teléfono</h3>', '<h3>WhatsApp and phone</h3>'),
    ('<p class="dato-grande">8775-8360</p>', '<p class="dato-grande">+506 8775-8360</p>'),
    ('<p>Pedidos y consultas.</p>', '<p>Orders and questions.</p>'),
    ('<h3>Síguenos</h3>', '<h3>Follow us</h3>'),
    ('<use href="#i-envelope-simple"/></svg>Correo</a>', '<use href="#i-envelope-simple"/></svg>Email</a>'),
    ('>Escribir por WhatsApp<', '>Message on WhatsApp<'),
    ('href="tel:+50687758360">Llamar</a>', 'href="tel:+50687758360">Call</a>'),
    ('<a class="nav-idioma" href="en.html" hreflang="en" lang="en" aria-label="View this page in English">EN</a>',
     '<a class="nav-idioma" href="index.html" hreflang="es" lang="es" aria-label="Ver esta página en español">ES</a>'),
]
traducir("index.html", "en.html", comunes + inicio)

carta = [
    ('<title>La carta · AzuMar, Restaurante y Marisquería en Quepos</title>', '<title>Menu · AzuMar Seafood Restaurant in Quepos</title>'),
    ('content="Carta completa de AzuMar en Quepos: ceviches, mariscos, arroces, cortes, pastas, casados y bebidas de la casa. Precios con impuestos incluidos."', 'content="Full menu of AzuMar in Quepos: ceviche, seafood, rice dishes, steaks, pasta, casados and house drinks. Prices include taxes."'),
    ('<meta property="og:title" content="La carta de AzuMar">', '<meta property="og:title" content="The AzuMar menu">'),
    ('content="Restaurante y Marisquería en Quepos, Costa Rica. Precios con impuestos incluidos."', 'content="Seafood restaurant in Quepos, Costa Rica. Prices include taxes."'),
    ('<a class="saltar" href="#carta">Saltar a la carta</a>', '<a class="saltar" href="#carta">Skip to the menu</a>'),
    ('aria-label="AzuMar, ir al inicio"', 'aria-label="AzuMar, go to home page"'),
    ('<li><a href="index.html">Inicio</a></li>', '<li><a href="en.html">Home</a></li>'),
    ('<li><a href="carta.html" aria-current="page">La carta</a></li>', '<li><a href="carta-en.html" aria-current="page">Menu</a></li>'),
    ('<li><a href="index.html#visitanos">Visítanos</a></li>', '<li><a href="en.html#visitanos">Visit us</a></li>'),
    ('<a class="nav-marca" href="index.html"', '<a class="nav-marca" href="en.html"'),
    ('<h1 id="titulo-carta" class="revela">La carta</h1>', '<h1 id="titulo-carta" class="revela">The menu</h1>'),
    ('<p class="revela">Todos los precios incluyen impuestos. Abierto todos los días de 12 md a 11 pm.</p>', '<p class="revela">All prices include taxes. Open every day from noon to 11 pm.</p>'),
    ('aria-label="Secciones de la carta"', 'aria-label="Menu sections"'),
    ('<p class="carta-aviso">Para ver la carta hace falta activar JavaScript. También puedes preguntarnos por <a href="https://wa.me/50687758360">WhatsApp al 8775-8360</a>.</p>', '<p class="carta-aviso">JavaScript is needed to show the menu. You can also ask us on <a href="https://wa.me/50687758360">WhatsApp at +506 8775-8360</a>.</p>'),
    ('<link rel="canonical" href="' + M + 'carta">', '<link rel="canonical" href="' + M + 'carta-en">'),
    ('<meta property="og:url" content="' + M + 'carta">', '<meta property="og:url" content="' + M + 'carta-en">'),
    ('<h2 id="titulo-cierre">¿Se te antojó algo?</h2>', '<h2 id="titulo-cierre">Craving something?</h2>'),
    ('<p>Pídelo desde el teléfono y te lo llevamos a domicilio, o ven a comerlo frente a La Inmaculada.</p>', '<p>Order from your phone and we’ll bring it to your door, or come eat with us across from La Inmaculada.</p>'),
    ('<a class="boton boton-linea" href="index.html#visitanos">Cómo llegar</a>', '<a class="boton boton-linea" href="en.html#visitanos">Get directions</a>'),
    ('<a class="nav-idioma" href="carta-en.html" hreflang="en" lang="en" aria-label="View this menu in English">EN</a>',
     '<a class="nav-idioma" href="carta.html" hreflang="es" lang="es" aria-label="Ver esta carta en español">ES</a>'),
]
traducir("carta.html", "carta-en.html", comunes + carta)
print("en.html y carta-en.html creados")

pedido = [
    ('<link rel="canonical" href="' + M + 'pedido">', '<link rel="canonical" href="' + M + 'pedido-en">'),
    ('<meta property="og:url" content="' + M + 'pedido">', '<meta property="og:url" content="' + M + 'pedido-en">'),
    ('<title>Pedido a domicilio · AzuMar, Quepos</title>', '<title>Order delivery · AzuMar, Quepos</title>'),
    ('content="Pide a domicilio en AzuMar, Quepos: elige tus platos y envía el pedido por WhatsApp. Todos los días de 12 md a 11 pm."', 'content="Order delivery from AzuMar in Quepos: pick your dishes and send the order on WhatsApp. Every day from noon to 11 pm."'),
    ('<meta property="og:title" content="Pedido a domicilio · AzuMar">', '<meta property="og:title" content="Order delivery · AzuMar">'),
    ('<meta property="og:description" content="Elige tus platos y envía el pedido por WhatsApp.">', '<meta property="og:description" content="Pick your dishes and send the order on WhatsApp.">'),
    ('<a class="saltar" href="#carta">Saltar a los platos</a>', '<a class="saltar" href="#carta">Skip to the dishes</a>'),
    ('aria-label="AzuMar, ir al inicio"', 'aria-label="AzuMar, go to home page"'),
    ('<li><a href="index.html">Inicio</a></li>', '<li><a href="en.html">Home</a></li>'),
    ('<li><a href="carta.html">La carta</a></li>', '<li><a href="carta-en.html">Menu</a></li>'),
    ('<li><a href="pedido.html" aria-current="page">A domicilio</a></li>', '<li><a href="pedido-en.html" aria-current="page">Delivery</a></li>'),
    ('<a class="nav-idioma" href="pedido-en.html" hreflang="en" lang="en" aria-label="Order in English">EN</a>', '<a class="nav-idioma" href="pedido.html" hreflang="es" lang="es" aria-label="Pedir en español">ES</a>'),
    ('<a class="boton boton-linea boton-chico" href="carta.html">Ver la carta</a>', '<a class="boton boton-linea boton-chico" href="carta-en.html">See the menu</a>'),
    ('<a class="nav-marca" href="index.html"', '<a class="nav-marca" href="en.html"'),
    ('<h1 id="titulo-pedido">A domicilio</h1>', '<h1 id="titulo-pedido">Delivery</h1>'),
    ('<p>Toca los platos que quieres y se van sumando abajo. El pedido nos llega por WhatsApp. Todos los días de 12 md a 11 pm.</p>', '<p>Tap the dishes you want and they add up at the bottom. Your order reaches us on WhatsApp. Every day from noon to 11 pm.</p>'),
    ('aria-label="Secciones de la carta"', 'aria-label="Menu sections"'),
    ('<p class="carta-aviso">Para pedir desde aquí hace falta activar JavaScript. También puedes escribirnos directo por <a href="https://wa.me/50687758360">WhatsApp al 8775-8360</a>.</p>', '<p class="carta-aviso">JavaScript is needed to order from here. You can also message us directly on <a href="https://wa.me/50687758360">WhatsApp at +506 8775-8360</a>.</p>'),
    ('<p class="pedido-nota">Los precios ya incluyen impuestos. El pescado entero se cobra según su peso.</p>', '<p class="pedido-nota">Prices include taxes. The whole fish is priced by weight.</p>'),
    ('<button class="boton boton-oro" id="ver-pedido" type="button">Ver pedido</button>', '<button class="boton boton-oro" id="ver-pedido" type="button">View order</button>'),
    ('<h2 id="titulo-modal">Confirma tu pedido</h2>', '<h2 id="titulo-modal">Confirm your order</h2>'),
    ('aria-label="Cerrar"', 'aria-label="Close"'),
    ('<label for="f-nombre">Nombre</label>', '<label for="f-nombre">Name</label>'),
    ('<label for="f-telefono">Teléfono</label>', '<label for="f-telefono">Phone</label>'),
    ('<p class="ayuda" id="a-telefono">Para avisarte si falta algo. Ejemplo: 8888-8888</p>', '<p class="ayuda" id="a-telefono">So we can reach you if something is missing. Example: 8888-8888</p>'),
    ('<label for="f-direccion">Dirección de entrega</label>', '<label for="f-direccion">Delivery address</label>'),
    ('<p class="ayuda" id="a-direccion">Con una seña: 200 m sur de la iglesia, casa azul</p>', '<p class="ayuda" id="a-direccion">With a landmark: hotel name, or 200 m south of the church, blue house</p>'),
    ('<label for="f-observaciones">Observaciones <span class="opcional">(opcional)</span></label>', '<label for="f-observaciones">Notes <span class="opcional">(optional)</span></label>'),
    ('<button class="boton boton-oro boton-ancho" type="submit">Enviar por WhatsApp</button>', '<button class="boton boton-oro boton-ancho" type="submit">Send on WhatsApp</button>'),
    ('<p class="letra-chica">Se abre tu WhatsApp con el pedido ya escrito. Tú lo envías, y AzuMar te contesta por ahí mismo para confirmarlo.</p>', '<p class="letra-chica">Your WhatsApp opens with the order already written. You send it, and AzuMar replies there to confirm it.</p>'),
    ('<button class="vaciar" id="vaciar" type="button">Vaciar el pedido</button>', '<button class="vaciar" id="vaciar" type="button">Clear order</button>'),
]
base_pedido = [c for c in comunes if "Pedir a domicilio" not in c[0] and "pedido.html" not in c[0]]
traducir("pedido.html", "pedido-en.html", base_pedido + pedido)

gracias = [
    ('<html lang="es-CR">', '<html lang="en">'),
    ('<title>Pedido enviado · AzuMar</title>', '<title>Order sent · AzuMar</title>'),
    ('<h1>Tu pedido va camino a AzuMar</h1>', '<h1>Your order is on its way to AzuMar</h1>'),
    ('<p>Revisa que el mensaje se haya enviado en tu WhatsApp. Apenas lo recibamos te contestamos por ahí mismo para confirmar el pedido y el tiempo de entrega.</p>', '<p>Check that the message was sent in your WhatsApp. As soon as we get it, we’ll reply there to confirm your order and the delivery time.</p>'),
    ('<p>¿No se te abrió WhatsApp?</p>', '<p>WhatsApp didn’t open?</p>'),
    ('>Abrir WhatsApp con mi pedido</a>', '>Open WhatsApp with my order</a>'),
    ('aria-label="Qué hacer ahora"', 'aria-label="What to do next"'),
    ('<a class="boton boton-linea" href="pedido.html">Hacer otro pedido</a>', '<a class="boton boton-linea" href="pedido-en.html">Place another order</a>'),
    ('<a class="boton boton-linea" href="index.html">Volver al inicio</a>', '<a class="boton boton-linea" href="en.html">Back to home</a>'),
    ('<p class="gracias-contacto"><a href="tel:+50687758360">8775-8360</a> · 12 md a 11 pm · Quepos</p>', '<p class="gracias-contacto"><a href="tel:+50687758360">+506 8775-8360</a> · Noon to 11 pm · Quepos</p>'),
]
traducir("gracias.html", "gracias-en.html", gracias)
print("pedido-en.html y gracias-en.html creados")
