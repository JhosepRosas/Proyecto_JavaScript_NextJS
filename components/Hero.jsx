import Image from "next/image";
import Link from "next/link";
import styles from "@/styles/HomeLanding.module.css";

export default function Hero() {
    return (
        <section className={styles.draftHero}>
            <Image
                src="/images/homeimg2.jpg"
                alt=""
                fill
                priority
                sizes="100vw"
                className={styles.heroImage}
            />
            <span className={styles.draftShade} />
            <div className={styles.draftContent}>
                <span className={styles.heroEyebrow}>Tu compañero de estrategia en MLBB</span>
                <h1>MLBB Drafcito</h1>
                <p>
                    Elige tus héroes, arma tu composición y responde a las selecciones rivales.
                </p>
                <Link href="/draft" className={styles.draftButton}>
                    Crear mi draft <span aria-hidden="true">→</span>
                </Link>
            </div>
        </section>
    );
}
