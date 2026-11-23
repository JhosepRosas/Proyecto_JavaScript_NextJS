"use client";

import { useMemo, useState } from "react";
import styles from "@/styles/ItemCatalog.module.css";
import { getLocalizedItemName } from "@/lib/itemUtils";

const API_ORIGIN = "https://mlbbdex.com";
const CATEGORY_LABELS = {
    Attack: "Ataque",
    Defense: "Defensa",
    Magic: "Magia",
    Movement: "Movimiento",
    Jungle: "Jungla",
    Roaming: "Roam",
};

export default function ItemCatalog({ items, error }) {
    const [category, setCategory] = useState("Todos");
    const [search, setSearch] = useState("");

    const categories = useMemo(
        () => ["Todos", ...new Set(items.filter(item => !item.removed).map(item => item.category).filter(Boolean).sort())],
        [items]
    );
    const visibleItems = items.filter(item =>
        !item.removed &&
        (category === "Todos" || item.category === category) &&
        getLocalizedItemName(item).toLowerCase().includes(search.toLowerCase())
    );

    return (
        <main className={styles.page}>
            <header className={styles.header}>
                <span>CATÁLOGO DE EQUIPO</span>
                <h1>Ítems de Mobile Legends</h1>
                <p>Revisa imágenes, precios, atributos y pasivas de los objetos.</p>
            </header>

            {error ? (
                <p className={styles.error} role="alert">{error}</p>
            ) : (
                <>
                    <div className={styles.filters}>
                        <label>
                            <span>Buscar ítem</span>
                            <input
                                type="search"
                                value={search}
                                onChange={event => setSearch(event.target.value)}
                                placeholder="Nombre del objeto..."
                            />
                        </label>
                        <label>
                            <span>Categoría</span>
                            <select value={category} onChange={event => setCategory(event.target.value)}>
                                {categories.map(itemCategory => (
                                    <option key={itemCategory} value={itemCategory}>
                                        {itemCategory === "Todos"
                                            ? "Todas las categorías"
                                            : CATEGORY_LABELS[itemCategory] || itemCategory}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>

                    <p className={styles.count}>{visibleItems.length} ítems</p>
                    <div className={styles.grid}>
                        {visibleItems.map(item => (
                            <article className={styles.itemCard} key={item.slug}>
                                <div className={styles.itemHeading}>
                                    <img
                                        src={`${API_ORIGIN}/visuels/objets/${item.slug}.webp`}
                                        alt=""
                                        loading="lazy"
                                    />
                                    <div>
                                        <h2>{getLocalizedItemName(item)}</h2>
                                        <span>{CATEGORY_LABELS[item.category] || item.category}</span>
                                    </div>
                                </div>
                                {item.summary && <p className={styles.summary}>{item.summary}</p>}
                                {item.bonus && <p className={styles.fact}><strong>Atributos:</strong> {item.bonus}</p>}
                                <p className={styles.price}>
                                    <strong>Precio:</strong> {item.price ?? "N/D"}
                                </p>
                                {item.unique && <p className={styles.fact}><strong>Único:</strong> {item.unique}</p>}
                                {item.passive && <p className={styles.fact}><strong>Pasiva:</strong> {item.passive}</p>}
                                {item.active && <p className={styles.fact}><strong>Activa:</strong> {item.active}</p>}
                            </article>
                        ))}
                    </div>
                    {!visibleItems.length && <p className={styles.empty}>No hay ítems que coincidan con los filtros.</p>}
                </>
            )}
            <p className={styles.credit}>
                Datos e imágenes proporcionados por{" "}
                <a href="https://mobilelegends.fandom.com" target="_blank" rel="noreferrer">
                    Mobile Legends Wiki
                </a>{" "}
                (CC BY-SA).
            </p>
        </main>
    );
}
