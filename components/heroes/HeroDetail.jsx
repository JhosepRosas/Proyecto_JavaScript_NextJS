import Link from "next/link";
import styles from "@/styles/HeroDetail.module.css";

const API_ORIGIN = "https://mlbbdex.com";

function getImageUrl(path, fallback) {
    return new URL(path || fallback, API_ORIGIN).toString();
}

export default function HeroDetail({ hero }) {
    if (!hero) {
        return (
            <main className={styles.detailPage}>
                <h2 className={styles.notFoundTitle}>Héroe no encontrado</h2>
                <p className={styles.notFoundText}>No pudimos cargar la información de este héroe.</p>
                <Link href="/heroes" className={styles.backButton}>← Volver al catálogo</Link>
            </main>
        );
    }

    const heroPortrait = getImageUrl(
        hero.images?.portrait || hero.images?.icon,
        `/visuels/heros/${hero.slug}/portrait.webp`
    );

    const details = [
        ["Roles", hero.roles?.join(", ")],
        ["Líneas", hero.lanes?.join(", ")],
        ["Especialidades", hero.specialties?.join(", ")],
        ["Daño", hero.damageType],
        ["Tipo de ataque", hero.attackType],
        ["Recurso", hero.resource],
        ["Región", hero.region],
        ["Lanzamiento", hero.release],
    ].filter(([, value]) => value);

    return (
        <main className={styles.detailPage}>
            <Link href="/heroes" className={styles.backButton}>← Volver a la lista de héroes</Link>

            <section className={styles.heroCard}>
                <img
                    src={heroPortrait}
                    alt={`Retrato de ${hero.name}`}
                    className={styles.portrait}
                />
                <div className={styles.heroIntro}>
                    <span className={styles.eyebrow}>Detalles del héroe</span>
                    <h1>{hero.name}</h1>
                    {hero.title && <p className={styles.heroTitle}>{hero.title}</p>}

                    <div className={styles.detailGrid}>
                        {details.map(([label, value]) => (
                            <div key={label} className={styles.detailItem}>
                                <span>{label}</span>
                                <strong>{value}</strong>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {hero.ratings && (
                <section className={styles.panel}>
                    <h2>Estadísticas</h2>
                    <div className={styles.ratingsGrid}>
                        {[
                            ["Ofensiva", hero.ratings.offense],
                            ["Durabilidad", hero.ratings.durability],
                            ["Efectos de habilidad", hero.ratings.abilityEffects],
                            ["Dificultad", hero.ratings.difficulty],
                        ].map(([label, value]) => (
                            <div key={label} className={styles.rating}>
                                <div className={styles.ratingLabel}>
                                    <span>{label}</span>
                                    <strong>{value}/10</strong>
                                </div>
                                <div className={styles.progressTrack}>
                                    <span style={{ width: `${Math.min(Number(value) * 10, 100)}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {hero.stats && (
                <section className={styles.panel}>
                    <h2>Atributos base</h2>
                    <div className={styles.statsGrid}>
                        {Object.entries(hero.stats).map(([stat, value]) => (
                            <div key={stat} className={styles.stat}>
                                <span>{stat.replaceAll("_", " ")}</span>
                                <strong>{value}</strong>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {hero.skills?.length > 0 && (
                <section className={styles.panel}>
                    <h2>Habilidades</h2>
                    <div className={styles.skillsGrid}>
                        {hero.skills.map((skill, index) => {
                            const name = typeof skill === "string" ? skill : skill.name;
                            const description = typeof skill === "object" ? skill.description : null;

                            return (
                                <article key={`${name}-${index}`} className={styles.skillCard}>
                                    <div className={styles.skillHeading}>
                                        <span>{index + 1}</span>
                                        <h3>{name}</h3>
                                    </div>
                                    {description && <p>{description}</p>}
                                </article>
                            );
                        })}
                    </div>
                </section>
            )}

            {hero.skins?.length > 0 && (
                <section className={styles.panel}>
                    <h2>Skins disponibles</h2>
                    <div className={styles.skinsGrid}>
                        {hero.skins.map(skin => {
                            const imagePath = hero.images?.skins?.[skin.id];

                            return (
                                <article key={skin.id} className={styles.skinCard}>
                                    {imagePath && (
                                        <img
                                            src={getImageUrl(imagePath, "")}
                                            alt={skin.name}
                                            className={styles.skinImage}
                                        />
                                    )}
                                    <div className={styles.skinContent}>
                                        <div className={styles.skinHeading}>
                                            <h3>{skin.name}</h3>
                                            <span>{skin.rarity || "Normal"}</span>
                                        </div>
                                        <div className={styles.skinFacts}>
                                            <p>Disponibilidad: <strong>{skin.availability || "N/D"}</strong></p>
                                            <p>Lanzamiento: <strong>{skin.release || "N/D"}</strong></p>
                                        </div>
                                        <p className={styles.skinPrice}>
                                            Precio: {skin.price?.bp ? `${skin.price.bp} BP` : ""}
                                            {skin.price?.bp && skin.price?.dm ? " · " : ""}
                                            {skin.price?.dm ? `${skin.price.dm} diamantes` : ""}
                                            {!skin.price?.bp && !skin.price?.dm ? "No disponible" : ""}
                                        </p>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </section>
            )}
        </main>
    );
}
