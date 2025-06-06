document.addEventListener('DOMContentLoaded', () => {

    // --- Seleccionar elementos ---
    const heroSection = document.querySelector('.hero-section');
    const contentWrapper = document.querySelector('.content-wrapper');
    const animatedTexts = document.querySelectorAll('.animated-text');
    const shape1 = document.getElementById('shape1');
    const shape2 = document.getElementById('shape2');
    const shape3 = document.getElementById('shape3');
    const dottedCircleWrapper = document.getElementById('dottedCircleWrapper');
    const dottedPath = dottedCircleWrapper.querySelector('.dotted-path'); // Seleccionamos el path principal
    const andyFace = document.getElementById('andyFace');

    // --- Colores para las formas ---
    const shapeColors = [
        '#A8B4DC', // Morado claro (original)
        '#C3E0F3', // Celeste (original)
        '#B3E0A3', // Verde claro
        '#FFB3C1', // Rosa claro
        '#FFD97D'  // Amarillo suave
    ];

    // --- Secuencia de Animación de Entrada General (Hero Section) ---
    const mainTimeline = gsap.timeline({ defaults: { ease: "power3.out" } });

    mainTimeline
        .to(heroSection, { opacity: 1, duration: 0.5 })
        .fromTo(contentWrapper, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, delay: 0.2 })
        .fromTo(animatedTexts[0], { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, stagger: 0.1 }, "<0.2")
        .fromTo(animatedTexts[1], { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, delay: 0.3 }, "<0.1")
        .fromTo(andyFace, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 1.2, ease: "elastic.out(1, 0.7)" }, "<0.4");

    // --- Animación de las Formas de Fondo (Movimiento y cambio de color) ---
    function animateShape(shapeElement, duration, delay, initialX, initialY, initialRotate) {
        gsap.to(shapeElement, {
            x: initialX + Math.random() * 80 - 40,
            y: initialY + Math.random() * 80 - 40,
            rotation: initialRotate + Math.random() * 20 - 10,
            duration: duration,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            delay: delay,
            onUpdate: function() { // Usamos onUpdate para cambiar el color continuamente
                const progress = this.progress(); // 0 a 1 de la animación
                const colorIndex = Math.floor(progress * shapeColors.length);
                const nextColor = shapeColors[colorIndex % shapeColors.length];
                shapeElement.querySelector('path').setAttribute('fill', nextColor);
            }
        });
    }

    gsap.set(shape1, { x: 0, y: 0, rotation: 0 });
    gsap.set(shape2, { x: 0, y: 0, rotation: 0 });
    gsap.set(shape3, { x: 0, y: 0, rotation: 0 });

    animateShape(shape1, 20, 0, 0, 0, 0);
    animateShape(shape2, 18, 0.5, 0, 0, 0);
    animateShape(shape3, 22, 1, 0, 0, 0);

    // --- Animación de la Carita de Andy (Movimiento Fijo) ---
    // Movimiento de rebote constante para la carita
    gsap.to(andyFace, {
        y: -15, // Sube 15px
        yoyo: true,
        repeat: -1,
        duration: 4,
        ease: "power1.inOut"
    });

    // Pulso o "respiración" de la carita
    gsap.to(andyFace, {
        scale: 1.02, // Crece 2%
        yoyo: true,
        repeat: -1,
        duration: 2,
        ease: "sine.inOut",
        delay: 0.5
    });

    // --- Animación del Círculo Punteado y Rayas de Corte ---
    // El círculo completo con todas las rayas giran alrededor
    gsap.to(dottedCircleWrapper, {
        rotation: 360,
        transformOrigin: "center center",
        duration: 15,
        ease: "linear",
        repeat: -1
    });

    // Animar las rayas de corte (path del SVG) para que giren en su propio eje local
    // Necesitamos que el transformOrigin sea el centro del viewBox para que giren correctamente
    // El viewBox es 27 27, el centro es 13.5, 13.5
    const pathElements = Array.from(dottedCircleWrapper.querySelectorAll('path'));

    pathElements.forEach((pathElement, index) => {
        // Excluir el path principal si quieres que solo las líneas de corte giren individualmente
        // El path principal es el primero en la lista. Si sólo tiene 1 path, solo girará el
        // que proporcionaste, que ya es el punteado con las "rayas".
        // Si tu SVG tuviera las 4 líneas como path separados, este forEach las animaría individualmente.
        // Dada la estructura de tu SVG, el `path` principal ya contiene todo el dibujo punteado
        // y las 4 "rayas" de corte. Así que el `rotation` que le dimos a `dottedCircleWrapper`
        // ya gira todo el elemento. Si quieres que las "rayas" roten *dentro* del giro del círculo,
        // tendrías que haberlas exportado como elementos `<path>` separados en el SVG.
        // Ya que el path actual es un path único que contiene todo, la rotación individual
        // no tiene el efecto que se espera de "solo las rayas giran".
        // La animación de `dottedCircleWrapper` ya cubre la rotación de "las rayas de corte alrededor de la carita".
        // Si necesitas que las rayas *dentro* de ese path se muevan de forma independiente,
        // necesitaríamos que esas rayas sean `<path>`s individuales dentro del SVG.
        // Pero para el efecto general, la rotación del `dottedCircleWrapper` es lo que buscas.

        // Por ahora, solo animaremos el path principal si es lo único presente o si queremos que todo rote.
        // Si tienes múltiples paths para las rayas, puedes quitar este if
        if (index === 0) { // Asumiendo que el path principal es el primero
             // Ya lo estamos animando con el wrapper, pero podríamos añadir un efecto adicional sutil
             gsap.to(pathElement, {
                 rotation: 360, // Rotación relativa adicional
                 transformOrigin: "13.5 13.5", // Centro del viewBox
                 duration: 30,
                 ease: "linear",
                 repeat: -1
             });
        }
    });


    // --- Efecto en las letras H1 y P ---
    gsap.to(animatedTexts, {
        keyframes: [
            { scale: 1.005, duration: 0.5, ease: "power1.inOut", stagger: 0.05 },
            { scale: 1, duration: 0.5, ease: "power1.inOut" }
        ],
        repeat: -1,
        repeatDelay: 5,
        delay: mainTimeline.duration() + 1
    });

    // --- Efecto de paralaje sutil al mover el ratón ---
    document.addEventListener('mousemove', (e) => {
        const mouseX = (e.clientX / window.innerWidth) - 0.5;
        const mouseY = (e.clientY / window.innerHeight) - 0.5;

        gsap.to(shape1, {
            x: mouseX * 30,
            y: mouseY * 30,
            duration: 1.5,
            ease: "power2.out"
        });
        gsap.to(shape2, {
            x: mouseX * -20,
            y: mouseY * -20,
            duration: 1.8,
            ease: "power2.out"
        });
        gsap.to(shape3, {
            x: mouseX * 25,
            y: mouseY * 25,
            duration: 1.6,
            ease: "power2.out"
        });

        gsap.to(contentWrapper, {
            x: mouseX * -10,
            y: mouseY * -10,
            duration: 1.3,
            ease: "power2.out"
        });

        gsap.to(andyFace, {
            x: mouseX * 15,
            y: mouseY * 15,
            duration: 1.2,
            ease: "power2.out"
        });

        gsap.to(dottedCircleWrapper, {
            x: mouseX * 5,
            y: mouseY * 5,
            duration: 1.1,
            ease: "power2.out"
        });
    });

});