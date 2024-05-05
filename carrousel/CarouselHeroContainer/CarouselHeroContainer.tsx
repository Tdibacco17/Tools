'use client'
import CarouselHeroComponent from "@/components/CarouselHeroComponent/CarouselHeroComponent";
import { useCallback, useEffect, useRef, useState } from "react";

export default function CarouselHeroContainer({
    images,
    controles = false,
    autoplay = false,
    velocidad = 3000,
    intervalo = 5000
}: {
    images: { src: string, alt: string, title: string }[],
    controles?: boolean;
    autoplay?: boolean;
    velocidad?: number;
    intervalo?: number;

}) {
    const slideshow = useRef<HTMLDivElement | null>(null);
    const intervaloSlideshow = useRef<NodeJS.Timeout | null>(null);
    const [imagenActivaIndex, setImagenActivaIndex] = useState(0);
    const [transicionando, setTransicionando] = useState(false);

    const handleSiguiente = useCallback(() => {
        if (!transicionando && slideshow.current && slideshow.current.children.length > 0) {
            setTransicionando(true);

            // Obtenemos el primer elemento del slideshow.
            const primerElemento = slideshow.current.children[0];

            // Establecemos la transición para el slideshow.
            slideshow.current.style.transition = `${velocidad}ms ease-out all`;

            const tamañoSlide = (slideshow.current.children[0] as HTMLElement).offsetWidth;

            // Movemos el slideshow
            slideshow.current.style.transform = `translateX(-${tamañoSlide}px)`;

            const transicion = () => {
                // Reiniciamos la posición del Slideshow.
                slideshow.current!.style.transition = 'none';
                slideshow.current!.style.transform = `translateX(0)`;

                // Tomamos el primer elemento y lo mandamos al final.
                slideshow.current!.appendChild(primerElemento);

                setImagenActivaIndex((prevIndex) => (prevIndex + 1) % images.length);
                setTransicionando(false);

                slideshow.current!.removeEventListener('transitionend', transicion);
            }

            // Eventlistener para cuando termina la animación.
            slideshow.current.addEventListener('transitionend', transicion);
        }
    }, [transicionando, velocidad, images.length]);

    const reiniciarIntervalo = useCallback(() => {
        if (autoplay && intervaloSlideshow.current !== null) {
            clearInterval(intervaloSlideshow.current);
            intervaloSlideshow.current = setInterval(() => {
                handleSiguiente();
            }, intervalo);
        }
    }, [autoplay, intervalo, handleSiguiente]);

    const handleAnterior = useCallback(() => {
        if (transicionando || !slideshow.current || slideshow.current.children.length === 0) {
            return; // Salir de la función si estamos en transición o no hay elementos en el carrusel
        }
        setTransicionando(true); // Bloquear clics adicionales en el botón de anterior

        // Obtenemos el último elemento del slideshow.
        const index = slideshow.current.children.length - 1;
        const ultimoElemento = slideshow.current.children[index];
        slideshow.current.insertBefore(ultimoElemento, slideshow.current.firstChild);

        // Establecemos la transición para el slideshow.
        slideshow.current.style.transition = 'none';
        const tamañoSlide = (slideshow.current.children[0] as HTMLElement).offsetWidth;
        slideshow.current.style.transform = `translateX(-${tamañoSlide}px)`;

        setTimeout(() => {
            if (slideshow.current && slideshow.current.children.length > 0) {
                slideshow.current.style.transition = `${velocidad}ms ease-out all`;
                slideshow.current.style.transform = `translateX(0)`;

                reiniciarIntervalo();
                setImagenActivaIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
                setTimeout(() => {
                    setTransicionando(false); // Restablecer la transición una vez que se completa
                }, velocidad);
            }
        }, 30);
    }, [transicionando, velocidad, reiniciarIntervalo, images.length]);


    useEffect(() => {
        if (autoplay) {
            intervaloSlideshow.current = setInterval(() => {
                handleSiguiente();
            }, intervalo);
        }

        // Limpia el intervalo cuando el componente se desmonta
        return () => {
            if (intervaloSlideshow.current !== null) {
                clearInterval(intervaloSlideshow.current);
            }
        };
    }, [autoplay, intervalo, handleSiguiente]);

    useEffect(() => {
        if (!transicionando) {
            const transicionEndHandler = () => {
                setTransicionando(false);
            };

            slideshow.current?.addEventListener('transitionend', transicionEndHandler);

            return () => {
                slideshow.current?.removeEventListener('transitionend', transicionEndHandler);
            };
        }
    }, [transicionando, slideshow]);


    return (
        <CarouselHeroComponent
            images={images}
            controles={controles}
            slideshow={slideshow}
            handleSiguiente={handleSiguiente}
            handleAnterior={handleAnterior}
            imagenActivaIndex={imagenActivaIndex}
        />
    );
}