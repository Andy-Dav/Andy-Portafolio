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

    // --- Colores para las formas (usados para los cambios de color cíclicos) ---
    const shapeColors = [
        '#A8B4DC', // Morado claro (predominante en la imagen)
        '#C3E0F3', // Celeste (predominante en la imagen)
        '#B3E0A3', // Verde claro (para variar)
        '#FFB3C1', // Rosa claro (para variar)
        '#FFD97D'  // Amarillo suave (para variar)
    ];

    // --- Secuencia de Animación de Entrada General (Hero Section) ---
    // Usamos GSAP Timeline para coordinar las animaciones de aparición
    const mainTimeline = gsap.timeline({ defaults: { ease: "power3.out" } });

    mainTimeline
        // Aseguramos que la sección principal sea visible antes de animar sus hijos
        .to(heroSection, { autoAlpha: 1, duration: 0.5 })
        // Animación de entrada del contenedor de texto y carita
        .fromTo(contentWrapper, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 1, delay: 0.2 })
        // Animación de entrada de los textos, escalonada
        .fromTo(animatedTexts[0], { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.1 }, "<0.2") // "HOLA! SOY ANDY."
        .fromTo(animatedTexts[1], { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 1, delay: 0.3 }, "<0.1") // "diseñadora y ilustradora."
        // Animación de entrada de la carita con un efecto elástico para un rebote divertido
        .fromTo(andyFace, { autoAlpha: 0, scale: 0.8 }, { autoAlpha: 1, scale: 1, duration: 1.2, ease: "elastic.out(1, 0.7)" }, "<0.4");


    // --- Animación de las Formas de Fondo (Movimiento, Rotación y Cambio de Color) ---
    function animateShape(shapeElement, durationBase, delay, initialXOffset, initialYOffset, initialRotateOffset) {
        // Obtenemos el path dentro del SVG para cambiar su color de relleno
        const svgPath = shapeElement.querySelector('path');

        gsap.to(shapeElement, {
            // Movimiento aleatorio para crear la sensación de "vida"
            x: initialXOffset + (Math.random() * 100 - 50), // Mueve en un rango de +/- 50px
            y: initialYOffset + (Math.random() * 100 - 50), // Mueve en un rango de +/- 50px
            rotation: initialRotateOffset + (Math.random() * 40 - 20), // Rota en un rango de +/- 20deg
            duration: durationBase + (Math.random() * 5 - 2.5), // Duración ligeramente variada para desincronizar
            ease: "sine.inOut", // Animación suave
            repeat: -1, // Repetir infinitamente
            yoyo: true, // Va y viene
            delay: delay, // Retraso de inicio para escalonar
            onUpdate: function() {
                // Cambia el color del path del SVG mientras la animación de movimiento está en curso
                const progress = this.progress(); // Progreso actual de la animación (0 a 1)
                const colorIndex = Math.floor(progress * shapeColors.length);
                const nextColor = shapeColors[colorIndex % shapeColors.length];
                svgPath.setAttribute('fill', nextColor); // Aplica el color al path
            }
        });
    }

    // Inicializamos las posiciones de las formas con GSAP para asegurar que los offsets se apliquen correctamente
    // y que las rotaciones iniciales del CSS se mantengan como base.
    gsap.set(shape1, { x: 0, y: 0 }); // Dejamos que CSS maneje top/left/rotation inicial
    gsap.set(shape2, { x: 0, y: 0 });
    gsap.set(shape3, { x: 0, y: 0 });

    // Llamamos a la función de animación para cada forma
    // Los últimos tres parámetros son offsets adicionales para que se muevan respecto a su posición original
    animateShape(shape1, 20, 0, 0, 0, -25); // shape1 tenía -25deg de rotación en CSS
    animateShape(shape2, 18, 0.5, 0, 0, 45); // shape2 tenía 45deg de rotación en CSS
    animateShape(shape3, 22, 1, 0, 0, -15); // shape3 tenía -15deg de rotación en CSS


    // --- Animación de la Carita de Andy (Movimiento Fijo y Pulso de Vida) ---
    // Movimiento vertical de rebote
    gsap.to(andyFace, {
        y: -15, // Sube 15px
        yoyo: true, // Va y viene
        repeat: -1, // Infinito
        duration: 4, // Duración del ciclo
        ease: "power1.inOut"
    });

    // Pequeño pulso (escala)
    gsap.to(andyFace, {
        scale: 1.02, // Crece 2%
        yoyo: true,
        repeat: -1,
        duration: 2,
        ease: "sine.inOut",
        delay: 0.5 // Desincroniza con el movimiento Y
    });

    // Muy ligera rotación constante
    gsap.to(andyFace, {
        rotation: 2, // Rota 2 grados
        yoyo: true,
        repeat: -1,
        duration: 5,
        ease: "sine.inOut",
        delay: 1 // Desincroniza con el pulso
    });


    // --- Animación del Círculo Punteado (Rotación Constante) ---
    // Como es una imagen (<img>), la rotamos como un todo.
    gsap.to(dottedCircleWrapper, {
        rotation: 360, // Rotación completa
        transformOrigin: "center center", // Gira desde su centro
        duration: 15, // Velocidad
        ease: "linear", // Constante
        repeat: -1 // Infinito
    });


    // --- Efecto en las Letras (Sutil "Jitter" después de la entrada) ---
    gsap.to(animatedTexts, {
        keyframes: [
            { y: -2, duration: 0.2, ease: "sine.inOut" }, // Pequeño salto
            { y: 0, duration: 0.2, ease: "sine.inOut" },
            { rotation: 0.5, duration: 0.2, ease: "sine.inOut" }, // Muy ligera rotación
            { rotation: 0, duration: 0.2, ease: "sine.inOut" }
        ],
        repeat: -1, // Repite el efecto
        repeatDelay: 4, // Pausa de 4 segundos antes de repetir
        delay: mainTimeline.duration() + 0.5 // Comienza después de que la entrada principal termine
    });


    // --- Efecto de Paralaje al Mover el Ratón ---
    // Crea una sensación de profundidad
    document.addEventListener('mousemove', (e) => {
        const mouseX = (e.clientX / window.innerWidth) - 0.5; // Normaliza a -0.5 a 0.5
        const mouseY = (e.clientY / window.innerHeight) - 0.5;

        // Las formas de fondo se mueven más para mayor profundidad
        gsap.to(shape1, { x: mouseX * 60, y: mouseY * 60, duration: 1.5, ease: "power2.out" });
        gsap.to(shape2, { x: mouseX * -50, y: mouseY * -50, duration: 1.8, ease: "power2.out" }); // Dirección opuesta
        gsap.to(shape3, { x: mouseX * 55, y: mouseY * 55, duration: 1.6, ease: "power2.out" });

        // El contenido principal se mueve sutilmente
        gsap.to(contentWrapper, { x: mouseX * -20, y: mouseY * -20, duration: 1.3, ease: "power2.out" });

        // La carita se mueve para dar profundidad visual
        gsap.to(andyFace, { x: mouseX * 25, y: mouseY * 25, duration: 1.2, ease: "power2.out" });

        // El círculo punteado se mueve un poco, pero menos que la carita
        gsap.to(dottedCircleWrapper, { x: mouseX * 15, y: mouseY * 15, duration: 1.1, ease: "power2.out" });
    });

});
