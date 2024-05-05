import Image from "next/image"
import styles from "./CarouselHeroComponent.module.scss"

interface ImgProps { src: string, alt: string, title: string }

export default function CarouselHeroComponent({
    images,
    controles,
    slideshow,
    handleSiguiente,
    handleAnterior,
    imagenActivaIndex
}: {
    images: ImgProps[],
    controles: boolean,
    slideshow: React.RefObject<HTMLDivElement>;
    handleSiguiente: () => void,
    handleAnterior: () => void,
    imagenActivaIndex: number
}) {
    return (
        <div className={styles["container-section-carousel"]}>
            <div className={styles["slider"]} ref={slideshow}>
                {images.map((imgData: ImgProps, index: number) => {
                    return <div key={index} className={styles["container-outer-img"]}>
                        <Image priority={index === 0 ? true : false} src={imgData.src} alt={imgData.alt} fill className={styles["container-inner-img"]} />
                        <div className={styles["container-olverlay"]}>
                            <div className={styles["container-bg-title"]}>
                                <p className={styles["title"]}>{imgData.title}</p>
                            </div>
                        </div>
                        <div className={styles["container-olverlay"]}>
                            <div className={styles["line"]} />
                        </div>
                    </div>
                })}
            </div>
            {images.length > 1 && (
                <div className={styles["container-markers"]}>
                    <div className={styles["markers"]}>
                        {images.map((_, index) => (
                            <div key={index} className={`${styles["marker"]} ${index === imagenActivaIndex ? styles["active"] : ""}`} />
                        ))}
                    </div>
                </div>
            )}
            {controles &&
                <div className={styles["container-btns"]}>
                    <button className={styles["container-icon"]} onClick={handleAnterior}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={styles["icon"]}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                        </svg>
                    </button>
                    <button className={styles["container-icon"]} onClick={handleSiguiente}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={styles["icon"]}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                        </svg>
                    </button>
                </div>}
        </div>
    )
}