"use client"
import Image from "next/image";
import style from "@/styles/AboutPage.module.css";

export default function AboutPage() {
    return (
        <main className={style.about}>
            <h1>MLBB Drafcito</h1>

            <section className={style.aboutSection}>
                <h2>¿Qué es MLBB Drafcito?</h2>
                <p>
                    <strong>MLBB Drafcito</strong> ayuda a tomar mejores decisiones durante el draft de Mobile Legends:
                    muestra datos actuales de counters y sugiere composiciones según los roles y especialidades de los héroes.
                    <br /><br />
                </p>
                <p>
                    La información de counters proviene de la API de MLBBdex. Como no ofrece datos de sinergia entre aliados,
                    las sugerencias de sinergia son estimaciones basadas en combinaciones de roles y especialidades, no estadísticas oficiales.
                </p>
                <br />
                <ul>
                    <li>
                        <strong className={style.blueAcccent}>Counters</strong> — datos de enfrentamientos que la API proporciona para los héroes enemigos.
                    </li>
                    <li>
                        <strong className={style.blueAcccent}>Sinergias estimadas</strong> — sugerencias que favorecen el equilibrio de roles y el seguimiento de daño al control de los aliados.
                    </li>
                </ul>
            </section>

            <section className={style.aboutSection}>
                <h2>Fuente de datos y aviso</h2>
                <p>
                    Los detalles de héroes, counters, builds y eventos se consultan desde la{" "}
                    <a href="https://mlbbdex.com/" className={style.blueAcccent}>MLBBdex API</a>.
                    El contenido y las imágenes de eventos se atribuyen a Mobile Legends Wiki bajo la licencia CC BY-SA.
                </p>

                <div className={style.imageWrapper}>
                    <Image
                        src="/images/counterRelationshipImg.png"
                        alt="Ilustración de las relaciones de counters entre héroes"
                        width={500}
                        height={280}
                        className={style.aboutImage}
                    />
                </div>

                <p>
                    Los resultados dependen del servicio externo y podrían cambiar o no estar disponibles. La sinergia es
                    una heurística sencilla de composición, no una predicción de victorias; usa las sugerencias como guía.
                </p>
                <p className={style.dataNote}>
                    <strong>Actualización de datos:</strong> <span>Se cargan desde la API al solicitarlos</span>
                </p>
            </section>

            <section className={style.aboutSection}>
                <h2>Tecnologías utilizadas</h2>
                <ul>
                    <li>Next.js</li>
                    <li>React</li>
                    <li>MLBBdex API</li>
                    <li>Heurísticas de puntuación del draft</li>
                </ul>
            </section>

        </main>
    );
}
