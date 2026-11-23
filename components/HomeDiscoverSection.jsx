import Link from "next/link";
import styles from "@/styles/HomeLanding.module.css";
import { getLocalizedItemName } from "@/lib/itemUtils";

const API_ORIGIN = "https://mlbbdex.com";

export default function HomeDiscoverSection({ heroes, items, error }) {
    return (
        <section className={styles.discoverSection}>
            <div className={styles.discoverColumn}>
                <div className={styles.discoverHeading}>
                    <div>
                        <span className={styles.discoverEyebrow}>CATÁLOGO</span>
                        <h2>Héroes</h2>
                        <p>Explora héroes, roles, habilidades y builds.</p>
                    </div>
                    <Link href="/heroes" className={styles.discoverButton}>
                        Ver todos <span aria-hidden="true">→</span>
                    </Link>
                </div>
                {error ? (
                    <p className={styles.previewMessage}>{error}</p>
                ) : heroes.length ? (
                    <div className={styles.heroPreviewGrid}>
                        {heroes.map(hero => (
                            <Link
                                href={`/heroes/${hero.slug}`}
                                key={hero.slug}
                                className={styles.heroPreview}
                                title={`Ver detalles de ${hero.name}`}
                            >
                                <img
                                    src={`${API_ORIGIN}/visuels/heros/${hero.slug}/icone.webp`}
                                    alt=""
                                    loading="lazy"
                                />
                                <span>{hero.name}</span>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p className={styles.previewMessage}>No se pudieron cargar los héroes.</p>
                )}
            </div>

            <div className={styles.discoverColumn}>
                <div className={styles.discoverHeading}>
                    <div>
                        <span className={styles.discoverEyebrow}>EQUIPO</span>
                        <h2>Ítems</h2>
                        <p>Consulta objetos, atributos y pasivas.</p>
                    </div>
                    <Link href="/items" className={styles.discoverButton}>
                        Ver todos <span aria-hidden="true">→</span>
                    </Link>
                </div>
                {error ? (
                    <p className={styles.previewMessage}>{error}</p>
                ) : items.length ? (
                    <div className={styles.itemPreviewGrid}>
                        {items.map(item => (
                            <Link
                                href="/items"
                                key={item.slug}
                                className={styles.itemPreview}
                                title={getLocalizedItemName(item)}
                            >
                                <img
                                    src={`${API_ORIGIN}/visuels/objets/${item.slug}.webp`}
                                    alt=""
                                    loading="lazy"
                                />
                                <span>{getLocalizedItemName(item)}</span>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p className={styles.previewMessage}>No se pudieron cargar los ítems.</p>
                )}
            </div>
        </section>
    );
}
