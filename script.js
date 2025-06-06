document.addEventListener('DOMContentLoaded', () => {

    // --- Seleccionar elementos ---
    const heroSection = document.querySelector('.hero-section');
    const contentWrapper = document.querySelector('.content-wrapper');
    const animatedTexts = document.querySelectorAll('.animated-text');
    const shape1 = document.getElementById('shape1');
    const shape2 = document.getElementById('shape2');
    const shape3 = document.getElementById('shape3');
    const dottedCircleWrapper = document.getElementById('dottedCircleWrapper'); // Ahora es un <img>
    const andyFace = document.getElementById('andyFace'); // Ahora es un <img>

    // --- Colores para las formas (usados por GSAP para la rotación de colores) ---
    const shapeColors = [
        '#A8B4DC', // Morado claro (el de la imagen)
        '#C3E0F3', // Celeste (el de la imagen)
        '#B3E0A3', // Verde (nuevo)
        '#FFB3C1', // Rosa (nuevo)
        '#FFD97D'  // Amarillo suave (nuevo)
    ];

    // --- Secuencia de Animación de Entrada General (Hero Section) ---
    const mainTimeline = gsap.timeline({ defaults: { ease: "power3.out" } });

    mainTimeline
        .to(heroSection, { autoAlpha: 1, duration: 0.5 }) // autoAlpha maneja visibility y opacity
        .fromTo(contentWrapper, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 1, delay: 0.2 })
        .fromTo(animatedTexts[0], { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.1 }, "<0.2") // "HOLA! SOY ANDY."
        .fromTo(animatedTexts[1], { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 1, delay: 0.3 }, "<0.1") // "diseñadora y ilustradora."
        .fromTo(andyFace, { autoAlpha: 0, scale: 0.8 }, { autoAlpha: 1, scale: 1, duration: 1.2, ease: "elastic.out(1, 0.7)" }, "<0.4"); // Carita con rebote elástico

    // --- Animación de las Formas de Fondo (Movimiento, Rotación y Cambio de Color) ---
    function animateShape(shapeElement, durationBase, delay, initialX, initialY, initialRotate) {
        // Obtenemos el path dentro del SVG
        const svgPath = shapeElement.querySelector('path');

        gsap.to(shapeElement, {
            x: initialX + (Math.random() * 100 - 50), // Movimiento X random (-50 a +50)
            y: initialY + (Math.random() * 100 - 50), // Movimiento Y random (-50 a +50)
            rotation: initialRotate + (Math.random() * 40 - 20), // Rotación random (-20 a +20)
            duration: durationBase + (Math.random() * 5 - 2.5), // Duración ligeramente variada
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true, // Animación de ida y vuelta
            delay: delay,
            onUpdate: function() {
                // Cambio de color suave a medida que la animación avanza
                const progress = this.progress(); // 0 to 1
                const colorIndex = Math.floor(progress * shapeColors.length);
                const nextColor = shapeColors[colorIndex % shapeColors.length];
                svgPath.setAttribute('fill', nextColor); // Cambia el fill del path
            }
        });
    }

    // Aseguramos que GSAP establezca las posiciones iniciales antes de animar
    // Las propiedades `top`, `left`, `width`, `height` ya están en CSS
    gsap.set(shape1, { x: 0, y: 0, rotation: -20 });
    gsap.set(shape2, { x: 0, y: 0, rotation: 40 });
    gsap.set(shape3, { x: 0, y: 0, rotation: -10 });


    animateShape(shape1, 20, 0, 0, 0, -20);
    animateShape(shape2, 18, 0.5, 0, 0, 40);
    animateShape(shape3, 22, 1, 0, 0, -10);

    // --- Animación de la Carita de Andy (Movimiento Fijo y Vida) ---
    // Movimiento de rebote constante para la carita
    gsap.to(andyFace, {
        y: -15, // Sube 15px
        yoyo: true,
        repeat: -1,
        duration: 4,
        ease: "power1.inOut"
    });

    // Pulso o "respiración" de la carita (escala)
    gsap.to(andyFace, {
        scale: 1.02, // Crece 2%
        yoyo: true,
        repeat: -1,
        duration: 2,
        ease: "sine.inOut",
        delay: 0.5 // Para que no sea idéntico al movimiento Y y cree un efecto más complejo
    });

    // Pequeña rotación constante de la carita
    gsap.to(andyFace, {
        rotation: 2, // Rota 2 grados
        yoyo: true,
        repeat: -1,
        duration: 5,
        ease: "sine.inOut",
        delay: 1 // Otro retraso para desincronizar
    });


    // --- Animación del Círculo Punteado y Rayas (ROTACIÓN) ---
    // Tu SVG completo es la imagen, así que la rotaremos como un todo.
    gsap.to(dottedCircleWrapper, {
        rotation: 360,
        transformOrigin: "center center", // Asegura que gire desde su centro
        duration: 15, // Velocidad de rotación
        ease: "linear", // Rotación constante
        repeat: -1 // Rotación continua
    });

    // --- Efecto en las letras H1 y P (después de la carga) ---
    // Un sutil "jitter" o "pulso" en el texto después de que aparece
    gsap.to(animatedTexts, {
        keyframes: [
            { y: -2, duration: 0.2, ease: "sine.inOut" }, // Pequeño salto
            { y: 0, duration: 0.2, ease: "sine.inOut" },
            { rotation: 1, duration: 0.2, ease: "sine.inOut" }, // Pequeña rotación
            { rotation: 0, duration: 0.2, ease: "sine.inOut" }
        ],
        repeat: -1,
        repeatDelay: 4, // Pausa de 4 segundos antes de repetir el efecto
        delay: mainTimeline.duration() + 0.5 // Empieza poco después de que la secuencia de entrada termine
    });


    // --- Efecto de paralaje sutil al mover el ratón ---
    document.addEventListener('mousemove', (e) => {
        const mouseX = (e.clientX / window.innerWidth) - 0.5; // Rango -0.5 a 0.5
        const mouseY = (e.clientY / window.innerHeight) - 0.5; // Rango -0.5 a 0.5

        // Mueve las formas de fondo más que el contenido principal
        gsap.to(shape1, {
            x: mouseX * 50, // Más movimiento
            y: mouseY * 50,
            duration: 1.5,
            ease: "power2.out"
        });
        gsap.to(shape2, {
            x: mouseX * -40, // Dirección opuesta
            y: mouseY * -40,
            duration: 1.8,
            ease: "power2.out"
        });
        gsap.to(shape3, {
            x: mouseX * 45,
            y: mouseY * 45,
            duration: 1.6,
            ease: "power2.out"
        });

        // Mueve el contenido principal (texto y carita) un poco menos
        gsap.to(contentWrapper, {
            x: mouseX * -15, // Movimiento sutil opuesto
            y: mouseY * -15,
            duration: 1.3,
            ease: "power2.out"
        });

        // Mueve la carita ligeramente para dar profundidad
        gsap.to(andyFace, {
            x: mouseX * 20,
            y: mouseY * 20,
            duration: 1.2,
            ease: "power2.out"
        });

        // Mueve el círculo punteado aún menos, para que se sienta más lejano a la carita
        gsap.to(dottedCircleWrapper, {
            x: mouseX * 10,
            y: mouseY * 10,
            duration: 1.1,
            ease: "power2.out"
        });
    });

});
