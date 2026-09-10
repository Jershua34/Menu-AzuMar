/**
 * Los platos del menú, escritos como datos.
 *
 * Las páginas es.html y en.html muestran FOTOS de la carta impresa: bonitas
 * de leer, pero no se puede tocar un plato dentro de una foto. El Express
 * necesita el menú como lista de verdad, y esta es esa lista.
 *
 * Sale del mismo sitio que la carta impresa (los menús de setiembre 2026) y
 * de la base de la app de pedidos, así que los precios son los mismos que
 * ve el cliente en la mesa. IMPUESTOS YA INCLUIDOS: no sumarles nada.
 *
 * Si cambia un precio hay que cambiarlo AQUÍ y en la imagen de la carta.
 * Son dos sitios, no hay forma de evitarlo mientras la carta sea una foto.
 *
 * precio 0 = "según peso", se pide al mesero. No suma al total.
 */
window.CATEGORIAS = {
  "entradas": [
    "Entradas",
    "Starters"
  ],
  "sea-fast-food": [
    "Sea Fast Food",
    "Sea Fast Food"
  ],
  "arroces": [
    "Arroces",
    "Rice"
  ],
  "platos-principales": [
    "Platos fuertes",
    "Main Courses"
  ],
  "cortes": [
    "Cortes de carne",
    "Steak Cuts"
  ],
  "sopas": [
    "Sopas",
    "Soups"
  ],
  "pastas": [
    "Pastas",
    "Pasta"
  ],
  "ejecutivo": [
    "Ejecutivo",
    "Lunch Specials"
  ],
  "infantil": [
    "Menú infantil",
    "Kid's Menu"
  ],
  "bebidas": [
    "Bebidas",
    "Drinks"
  ],
  "bebidas-calientes": [
    "Bebidas calientes",
    "Hot Drinks"
  ],
  "bebidas-azumar": [
    "Bebidas AzuMar",
    "AzuMar Drinks"
  ]
};

window.PLATOS = [
  {"id":"p0","cat":"entradas","es":"Ceviche de Pescado","en":"Fish Ceviche","precio":4800,"dEs":"Pescado marinado con jugo de limón, cebolla morada, chile dulce y culantro, acompañado con patacones.","dEn":"Fish marinated in fresh lime juice, red onion, sweet pepper and cilantro, served with fried plantain discs."},
  {"id":"p1","cat":"entradas","es":"Ceviche de Camarón","en":"Shrimp Ceviche","precio":5650,"dEs":"Camarones marinados con jugo de limón, cebolla morada, chile dulce y culantro, acompañados con patacones.","dEn":"Shrimp marinated in fresh lime juice, red onion, sweet pepper and cilantro, served with fried plantain discs."},
  {"id":"p2","cat":"entradas","es":"Ceviche Mixto","en":"Mixed Ceviche","precio":6215,"dEs":"Pescado y camarones marinados con jugo de limón, cebolla morada, chile dulce y culantro, acompañados con patacones.","dEn":"Fish and shrimp marinated in fresh lime juice, red onion, sweet pepper and cilantro, served with fried plantain discs."},
  {"id":"p3","cat":"entradas","es":"Ceviche de Palmito","en":"Heart of Palm Ceviche","precio":2900,"dEs":"Palmito marinado con jugo de limón, cebolla morada, chile dulce y culantro, acompañado con patacones.","dEn":"Hearts of palm marinated in fresh lime juice, red onion, sweet pepper and cilantro, served with fried plantain discs."},
  {"id":"p4","cat":"entradas","es":"Caldosa Mixta","en":"Mixed Caldosa","precio":3000,"dEs":"Pescado y camarón marinados con jugo de limón, cebolla morada, chile dulce y culantro, acompañados con ranchitas.","dEn":"Popular Costa Rican street snack: fresh seafood ceviche poured straight into an opened bag of crunchy corn chips."},
  {"id":"p5","cat":"entradas","es":"Caldosa de Pescado","en":"Fish Caldosa","precio":3500,"dEs":"Pescado marinado con jugo de limón, cebolla morada, chile dulce y culantro, acompañado con ranchitas.","dEn":"Popular Costa Rican street snack: fresh fish ceviche poured straight into an opened bag of crunchy corn chips."},
  {"id":"p6","cat":"entradas","es":"Ensalada César con Camarón","en":"Caesar Salad with Shrimp","precio":7350,"dEs":"Lechuga, tomate, crotones, queso parmesano y aderezo césar.","dEn":"Lettuce, croutons, Parmesan cheese and Caesar dressing."},
  {"id":"p7","cat":"entradas","es":"Ensalada César de Pollo","en":"Chicken Caesar Salad","precio":4800,"dEs":"Lechuga, tomate, crotones, queso parmesano y aderezo césar.","dEn":"Lettuce, croutons, Parmesan cheese and Caesar dressing."},
  {"id":"p8","cat":"entradas","es":"Aros de Calamar a la AzuMar","en":"AzuMar Calamari Rings","precio":5650,"dEs":"Calamares empanizados, acompañados con papas fritas.","dEn":"Breaded calamari rings, served with French fries."},
  {"id":"p9","cat":"entradas","es":"Cóctel de Camarón","en":"Shrimp Cocktail","precio":9500,"dEs":"Camarón jumbo, salsa coctel, aguacate, pepino y tomate, acompañado con patacones.","dEn":"Jumbo shrimp, cocktail sauce, avocado, cucumber and tomato, served with fried plantain discs."},
  {"id":"p10","cat":"entradas","es":"Orden de Frijoles Molidos","en":"Refried Beans","precio":2855,"dEs":"Acompañados con chimichurri y patacones.","dEn":"Served with pico de gallo and fried plantain discs."},
  {"id":"p11","cat":"entradas","es":"Camarones con Patacón y Guacamole","en":"Shrimp with Plantain and Guacamole","precio":5800,"dEs":"Camarones montados en una cama de guacamole y patacones.","dEn":"Jumbo shrimp on a bed of guacamole and fried plantain discs."},
  {"id":"p12","cat":"sea-fast-food","es":"Dedos de Pescado","en":"Fish Fingers","precio":5650,"dEs":"Acompañados con papas fritas.","dEn":"Breaded fish strips served with French fries."},
  {"id":"p13","cat":"sea-fast-food","es":"Dedos de Pollo","en":"Chicken Fingers","precio":4800,"dEs":"Acompañados con papas fritas.","dEn":"Breaded chicken strips served with French fries."},
  {"id":"p14","cat":"sea-fast-food","es":"Wrap de Camarón","en":"Shrimp Wrap","precio":6800,"dEs":"Acompañado con papas fritas.","dEn":"Served with French fries."},
  {"id":"p15","cat":"sea-fast-food","es":"Wrap de Pescado","en":"Fish Wrap","precio":6300,"dEs":"Acompañado con papas fritas.","dEn":"Served with French fries."},
  {"id":"p16","cat":"sea-fast-food","es":"Wrap de Pollo","en":"Chicken Wrap","precio":6780,"dEs":"Acompañado con papas fritas.","dEn":"Served with French fries."},
  {"id":"p17","cat":"sea-fast-food","es":"Sándwich de Atún","en":"Tuna Sandwich","precio":6780,"dEs":"Lechuga, tomate, pepinillos, aguacate, mayonesa de wasabi y jalapeños en almíbar, con papas fritas.","dEn":"Lettuce, tomato, pickles, avocado, wasabi mayonnaise and candied jalapeños, with French fries."},
  {"id":"p18","cat":"sea-fast-food","es":"Hamburguesa AzuMar","en":"AzuMar Burger","precio":9040,"dEs":"Camarones salteados, lechuga, tomate, queso y pepinillos, con papas fritas.","dEn":"Sautéed shrimp, lettuce, tomato, cheese and pickles, with French fries."},
  {"id":"p19","cat":"sea-fast-food","es":"Hamburguesa de Atún","en":"Tuna Burger","precio":7345,"dEs":"Lechuga, tomate, pepinillos, aguacate, mayonesa de wasabi y jalapeños en almíbar, con papas fritas.","dEn":"Lettuce, tomato, pickles, avocado, wasabi mayonnaise and candied jalapeños, with French fries."},
  {"id":"p20","cat":"sea-fast-food","es":"Hamburguesa Regular","en":"Classic Burger","precio":5000,"dEs":"Lechuga, tomate, queso, pepinillos y aros de cebolla, acompañados con papas fritas.","dEn":"Beef patty, cheese, lettuce, tomato, pickles and onion rings, served with French fries."},
  {"id":"p21","cat":"sea-fast-food","es":"Quesadilla de Camarón","en":"Shrimp Quesadilla","precio":6780,"dEs":"Tortilla de harina con camarón salteado y queso mozarella, servida con papas fritas y ensalada.","dEn":"Flour tortilla with shrimp and mozzarella cheese, served with French fries and salad."},
  {"id":"p22","cat":"sea-fast-food","es":"Quesadilla de Pollo","en":"Chicken Quesadilla","precio":5300,"dEs":"Tortilla de harina con pollo y queso mozarella, servida con papas fritas y ensalada.","dEn":"Flour tortilla with chicken and mozzarella cheese, served with French fries and salad."},
  {"id":"p23","cat":"sea-fast-food","es":"Quesadilla Vegetariana","en":"Vegetarian Quesadilla","precio":4900,"dEs":"Tortilla de harina con vegetales y queso mozarella, servida con papas fritas y ensalada.","dEn":"Flour tortilla with vegetables and mozzarella cheese, served with French fries and salad."},
  {"id":"p24","cat":"arroces","es":"Arroz con Calamares","en":"Rice with Calamari","precio":6554,"dEs":"Acompañado con papas fritas y ensalada.","dEn":"Served with French fries and salad."},
  {"id":"p25","cat":"arroces","es":"Arroz con Camarón","en":"Rice with Shrimp","precio":6554,"dEs":"Acompañado con papas fritas y ensalada.","dEn":"Served with French fries and salad."},
  {"id":"p26","cat":"arroces","es":"Arroz con Mariscos","en":"Seafood Rice","precio":6780,"dEs":"Acompañado con papas fritas y ensalada.","dEn":"Served with French fries and salad."},
  {"id":"p27","cat":"arroces","es":"Arroz AzuMar","en":"AzuMar Rice","precio":7500,"dEs":"Camarones y lomito, acompañado con papas fritas y ensalada.","dEn":"Shrimp and beef tenderloin, served with French fries and salad."},
  {"id":"p28","cat":"platos-principales","es":"Pescado Entero","en":"Whole Fish","precio":0,"dEs":"Precio según peso. Acompañado de ensalada y patacones.","dEn":"Market price per weight. Served with green salad and fried plantains."},
  {"id":"p29","cat":"platos-principales","es":"Carne a la AzuMar","en":"AzuMar Steak","precio":11800,"dEs":"Lomito, queso mozarella y peperoni, servido con papas fritas y ensalada.","dEn":"Grilled sirloin steak covered in pepperoni and mozzarella cheese, served with green salad and French fries."},
  {"id":"p30","cat":"platos-principales","es":"Camarones Jumbo al Coco","en":"Coconut Jumbo Shrimp","precio":12800,"dEs":"Empanizados con coco y una salsa de frutas, servidos con puré y vegetales.","dEn":"Coconut breaded, with a fruit sauce, served with mashed potatoes and vegetables."},
  {"id":"p31","cat":"platos-principales","es":"Camarones Jumbo al Ajillo","en":"Garlic Jumbo Shrimp","precio":12500,"dEs":"Acompañados de puré de papa y vegetales.","dEn":"Served with garlic sauce, mashed potatoes and vegetables."},
  {"id":"p32","cat":"platos-principales","es":"Filet de Pescado","en":"Fish Fillet","precio":7600,"dEs":"Con salsa de ajo o maracuyá, servido con puré y vegetales.","dEn":"With garlic or passion fruit sauce, served with mashed potatoes and vegetables."},
  {"id":"p33","cat":"platos-principales","es":"Filet de Pescado con Salsa de Camarones","en":"Fish Fillet with Shrimp Sauce","precio":11800,"dEs":"Acompañado de puré y vegetales.","dEn":"Served with mashed potatoes and vegetables."},
  {"id":"p34","cat":"platos-principales","es":"Filet de Pollo con Salsa de Hongos","en":"Chicken Fillet with Mushroom Sauce","precio":7800,"dEs":"Acompañado de puré y vegetales.","dEn":"Served with mashed potatoes and vegetables."},
  {"id":"p35","cat":"platos-principales","es":"Tartar de Atún","en":"Tuna Tartare","precio":6780,"dEs":"Servido con mango, aguacate y chips de yuca.","dEn":"Layers of tuna, mango and avocado, with cassava chips."},
  {"id":"p36","cat":"platos-principales","es":"Filet de Atún Soya y Wasabi","en":"Tuna Fillet with Soy and Wasabi","precio":9700,"dEs":"Servido con puré y vegetales.","dEn":"Served with mashed potatoes and vegetables."},
  {"id":"p37","cat":"platos-principales","es":"Surtido de Mariscos","en":"Seafood Platter","precio":25000,"dEs":"Para 4 personas.","dEn":"Serves 4."},
  {"id":"p38","cat":"platos-principales","es":"Surtido AzuMar","en":"AzuMar Platter","precio":30000,"dEs":"Para 4 personas.","dEn":"Serves 4."},
  {"id":"p39","cat":"cortes","es":"Churrasco","en":"Churrasco Steak","precio":12995,"dEs":"Con chimichurri argentino, servido con puré y vegetales.","dEn":"Served with mashed potatoes, vegetables and Argentine chimichurri."},
  {"id":"p40","cat":"cortes","es":"Ribeye con Salsa de Hongos","en":"Ribeye in Mushroom Sauce","precio":16400,"dEs":"Servido con puré y vegetales.","dEn":"Served with mashed potatoes and vegetables."},
  {"id":"p41","cat":"cortes","es":"Ribeye con Camarones","en":"Ribeye with Shrimp","precio":16950,"dEs":"Servido con puré y vegetales.","dEn":"Served with mashed potatoes and vegetables."},
  {"id":"p42","cat":"cortes","es":"Lomito en Salsa de Hongos","en":"Tenderloin with Mushroom Sauce","precio":11300,"dEs":"Servido con puré y vegetales.","dEn":"Served with mashed potatoes and vegetables."},
  {"id":"p43","cat":"cortes","es":"Lomito con Camarones","en":"Tenderloin with Shrimp Sauce","precio":16950,"dEs":"Servido con puré y vegetales.","dEn":"Served with mashed potatoes and vegetables."},
  {"id":"p44","cat":"sopas","es":"Sopa de Mariscos","en":"Seafood Soup","precio":5500,"dEs":"Servida con una orden de arroz blanco.","dEn":"Served with a side of white rice."},
  {"id":"p45","cat":"sopas","es":"Crema de Mariscos","en":"Cream of Seafood","precio":6200,"dEs":"Servida con una orden de arroz blanco.","dEn":"Served with a side of white rice."},
  {"id":"p46","cat":"pastas","es":"Pasta con Mariscos","en":"Seafood Pasta","precio":7800,"dEs":"Opción a elegir salsa blanca o roja.","dEn":"Choice of white or red sauce."},
  {"id":"p47","cat":"pastas","es":"Pasta al Pesto con Camarones","en":"Pesto Pasta with Shrimp","precio":7800,"dEs":"Pasta en salsa pesto con camarones.","dEn":"Pasta in pesto sauce with shrimp."},
  {"id":"p48","cat":"pastas","es":"Pasta al Pesto con Pollo","en":"Pesto Pasta with Chicken","precio":5900,"dEs":"Pasta en salsa pesto con pollo a la plancha.","dEn":"Pasta in pesto sauce with grilled chicken."},
  {"id":"p49","cat":"pastas","es":"Pasta Pollo con Salsa Roja","en":"Chicken Pasta in Red Sauce","precio":6000,"dEs":"Pasta en salsa roja con pollo a la plancha.","dEn":"Pasta in red sauce with grilled chicken."},
  {"id":"p50","cat":"pastas","es":"Pasta Alfredo con Pollo","en":"Chicken Alfredo Pasta","precio":6800,"dEs":"Pasta en salsa Alfredo cremosa con pollo.","dEn":"Pasta in creamy Alfredo sauce with chicken."},
  {"id":"p51","cat":"ejecutivo","es":"Casado de Pollo a la Plancha","en":"Grilled Chicken Casado","precio":4500,"dEs":"Pollo a la plancha con arroz, frijoles, ensalada verde y maduro. Bebida natural incluida.","dEn":"Grilled chicken, served with white rice, beans, green salad and sweet plantains. Natural drink included."},
  {"id":"p52","cat":"ejecutivo","es":"Casado con Chuleta","en":"Pork Chop Casado","precio":4500,"dEs":"Chuleta a la plancha con arroz, frijoles, ensalada verde y maduro. Bebida natural incluida.","dEn":"Grilled pork chop, served with white rice, beans, green salad and sweet plantains. Natural drink included."},
  {"id":"p53","cat":"ejecutivo","es":"Casado de Fajitas de Pollo","en":"Chicken Fajita Casado","precio":4500,"dEs":"Fajitas de pollo con arroz, frijoles, ensalada verde y maduro. Bebida natural incluida.","dEn":"Chicken fajitas, served with white rice, beans, green salad and sweet plantains. Natural drink included."},
  {"id":"p54","cat":"ejecutivo","es":"Casado con Filet de Pescado","en":"Fish Fillet Casado","precio":4500,"dEs":"Filet de pescado con arroz, frijoles, ensalada verde y maduro. Bebida natural incluida.","dEn":"Fish fillet, served with white rice, beans, green salad and sweet plantains. Natural drink included."},
  {"id":"p55","cat":"infantil","es":"Dedos de Pollo (Infantil)","en":"Chicken Fingers (Kids)","precio":3700,"dEs":"Con papas fritas.","dEn":"With French fries."},
  {"id":"p56","cat":"infantil","es":"Hamburguesa Infantil","en":"Kids Burger","precio":3800,"dEs":"Pan, torta de carne, queso y papas fritas.","dEn":"Bun, beef patty, cheese and French fries."},
  {"id":"p57","cat":"infantil","es":"Mac & Cheese","en":"Mac & Cheese","precio":3600,"dEs":"Macarrones con queso derretido.","dEn":"Macaroni with melted cheese."},
  {"id":"p58","cat":"infantil","es":"Palomitas de Pescado","en":"Fish Popcorn","precio":4000,"dEs":"Con papas fritas.","dEn":"With French fries."},
  {"id":"p59","cat":"bebidas","es":"Batido en Leche","en":"Milk Smoothie","precio":2825,"dEs":"Fresa, mora, sandía, mango o guanábana. Combinaciones: piña + maracuyá y crema de coco, banano + fresa, banano + mango, banano + mora.","dEn":"Strawberry, blackberry, watermelon, mango or soursop. Combinations: pineapple + passion fruit with cream of coconut, banana + strawberry, banana + mango, banana + blackberry."},
  {"id":"p60","cat":"bebidas","es":"Batido en Agua","en":"Water Smoothie","precio":2260,"dEs":"Fresa, mora, sandía, mango o guanábana. Combinaciones: piña + maracuyá y crema de coco, banano + fresa, banano + mango, banano + mora.","dEn":"Strawberry, blackberry, watermelon, mango or soursop. Combinations: pineapple + passion fruit with cream of coconut, banana + strawberry, banana + mango, banana + blackberry."},
  {"id":"p61","cat":"bebidas","es":"Limonada Regular","en":"Lemonade","precio":2260,"dEs":"Limonada natural, bien fría.","dEn":"Fresh lemonade, served cold."},
  {"id":"p62","cat":"bebidas","es":"Limonada con Hierbabuena","en":"Mint Lemonade","precio":2260,"dEs":"Limonada natural con hierbabuena fresca.","dEn":"Fresh lemonade with mint."},
  {"id":"p63","cat":"bebidas","es":"Limonada Hierbabuena + Sandía","en":"Mint and Watermelon Lemonade","precio":2599,"dEs":"Limonada con hierbabuena y sandía.","dEn":"Lemonade with mint and watermelon."},
  {"id":"p64","cat":"bebidas","es":"Gaseosa","en":"Soft Drink","precio":1300,"dEs":"Coca-Cola, Coca-Cola Cero, Fanta Colita, Fanta Naranja, Fanta Uva, Fresca, Ginger Ale o Powerade.","dEn":"Coca-Cola, Coke Zero, Fanta Colita, Fanta Orange, Fanta Grape, Fresca, Ginger Ale or Powerade."},
  {"id":"p65","cat":"bebidas","es":"Agua en Botella","en":"Bottled Water","precio":1300,"dEs":"Agua embotellada.","dEn":"Bottled water."},
  {"id":"p66","cat":"bebidas","es":"Charlie Temple","en":"Charlie Temple","precio":2599,"dEs":"Cerezas y 7UP.","dEn":"Cherries and 7UP."},
  {"id":"p67","cat":"bebidas","es":"Roy Rogers","en":"Roy Rogers","precio":2599,"dEs":"Cerezas con Coca-Cola.","dEn":"Cherries with Coca-Cola."},
  {"id":"p68","cat":"bebidas","es":"Arnold Palmer","en":"Arnold Palmer","precio":2599,"dEs":"Limonada con té frío.","dEn":"Lemonade with iced tea."},
  {"id":"p69","cat":"bebidas-calientes","es":"Café con Leche","en":"Coffee with Milk","precio":1300,"dEs":"Café caliente con leche.","dEn":"Hot coffee with milk."},
  {"id":"p70","cat":"bebidas-calientes","es":"Café Negro","en":"Black Coffee","precio":1000,"dEs":"Café negro caliente.","dEn":"Hot black coffee."},
  {"id":"p71","cat":"bebidas-calientes","es":"Chocolate","en":"Hot Chocolate","precio":1000,"dEs":"Chocolate caliente.","dEn":"Hot chocolate."},
  {"id":"p72","cat":"bebidas-azumar","es":"Perla del Pacífico","en":"Pearl of the Pacific","precio":3955,"dEs":"Bebida de la casa. Preguntá a tu mesero por los ingredientes.","dEn":"House drink. Ask your server about the ingredients."},
  {"id":"p73","cat":"bebidas-azumar","es":"Coral Rubí","en":"Ruby Coral","precio":3955,"dEs":"Bebida de la casa. Preguntá a tu mesero por los ingredientes.","dEn":"House drink. Ask your server about the ingredients."},
  {"id":"p74","cat":"bebidas-azumar","es":"Ancla de Cobre","en":"Copper Anchor","precio":3955,"dEs":"Bebida de la casa. Preguntá a tu mesero por los ingredientes.","dEn":"House drink. Ask your server about the ingredients."},
  {"id":"p75","cat":"bebidas-azumar","es":"Sirena Dorada","en":"Golden Mermaid","precio":3955,"dEs":"Bebida de la casa. Preguntá a tu mesero por los ingredientes.","dEn":"House drink. Ask your server about the ingredients."},
  {"id":"p76","cat":"bebidas-azumar","es":"Sol del Trópico","en":"Tropical Sun","precio":3955,"dEs":"Bebida de la casa. Preguntá a tu mesero por los ingredientes.","dEn":"House drink. Ask your server about the ingredients."},
  {"id":"p77","cat":"bebidas-azumar","es":"Marea Rosa","en":"Pink Tide","precio":3955,"dEs":"Bebida de la casa. Preguntá a tu mesero por los ingredientes.","dEn":"House drink. Ask your server about the ingredients."},
  {"id":"p78","cat":"bebidas-azumar","es":"Brisa Marina","en":"Sea Breezes","precio":3955,"dEs":"Bebida de la casa. Preguntá a tu mesero por los ingredientes.","dEn":"House drink. Ask your server about the ingredients."}
];
