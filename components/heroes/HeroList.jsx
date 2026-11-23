"use client";

import { useState } from "react";
import Link from "next/link";
import { getHeroIconUrl } from "@/lib/heroUtils";
import styles from "@/styles/HeroList.module.css";

export default function HeroList({ heroes }) {
    const [search, setSearch] = useState("");
    const [role, setRole] = useState("Todos");
    const [lane, setLane] = useState("Todos");

    const roles = [
        ["Todos", "Todos los roles"],
        ["Tank", "Tanque"],
        ["Fighter", "Luchador"],
        ["Assassin", "Asesino"],
        ["Mage", "Mago"],
        ["Marksman", "Tirador"],
        ["Support", "Apoyo"],
    ];
    const lanes = [
        ["Todos", "Todas las líneas"],
        ["Gold", "Línea de oro"],
        ["Jungle", "Jungla"],
        ["Mid", "Línea central"],
        ["Exp", "Línea EXP"],
        ["Roam", "Roam"],
    ];
    const hasActiveFilters = search !== "" || role !== "Todos" || lane !== "Todos";

    const filteredHeroes = heroes.filter(hero => {
        const matchesSearch = hero.name.toLowerCase().includes(search.toLowerCase());
        const matchesRole = role === "Todos" || hero.roles?.includes(role);
        const matchesLane = lane === "Todos" || hero.lanes?.includes(lane);
        return matchesSearch && matchesRole && matchesLane;
    });

    function resetFilters() {
        setSearch("");
        setRole("Todos");
        setLane("Todos");
    }

    return (
        <main className={styles.page}>
            <header className={styles.header}>
                <div>
                    <span className={styles.eyebrow}>HÉROES</span>
                    <h1>Explora los héroes</h1>
                    <p>Busca un héroe o filtra por rol y línea.</p>
                </div>
                <span className={styles.count}>
                    {filteredHeroes.length} héroes
                </span>
            </header>

            <div className={styles.filters}>
                <label className={styles.searchLabel}>
                    <span>Buscar</span>
                    <input
                        type="search"
                        placeholder="Nombre del héroe..."
                        value={search}
                        onChange={event => setSearch(event.target.value)}
                    />
                </label>

                <label>
                    <span>Rol</span>
                    <select value={role} onChange={event => setRole(event.target.value)}>
                        {roles.map(([value, label]) => (
                            <option key={value} value={value}>
                                {label}
                            </option>
                        ))}
                    </select>
                </label>

                <label>
                    <span>Línea</span>
                    <select value={lane} onChange={event => setLane(event.target.value)}>
                        {lanes.map(([value, label]) => (
                            <option key={value} value={value}>
                                {label}
                            </option>
                        ))}
                    </select>
                </label>

                {hasActiveFilters && (
                    <button className={styles.resetButton} type="button" onClick={resetFilters}>
                        Limpiar
                    </button>
                )}
            </div>

            {filteredHeroes.length ? (
                <div className={styles.heroGrid}>
                    {filteredHeroes.map(hero => (
                        <Link
                            key={hero.slug}
                            href={`/heroes/${hero.slug}`}
                            className={styles.heroCard}
                            aria-label={`Ver detalles de ${hero.name}`}
                        >
                            <img
                                src={getHeroIconUrl(hero)}
                                alt=""
                                className={styles.heroImage}
                                loading="lazy"
                            />
                            <span className={styles.heroName}>{hero.name}</span>
                            <span className={styles.detailLabel}>Ver detalles</span>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className={styles.emptyState}>
                    <h2>No se encontraron héroes</h2>
                    <p>Prueba otra búsqueda o restablece los filtros.</p>
                    <button type="button" onClick={resetFilters}>Mostrar todos</button>
                </div>
            )}
        </main>
    );
}
