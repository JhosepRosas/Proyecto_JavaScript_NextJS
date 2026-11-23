"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import style from "@/styles/DraftPage.module.css";
import { getHeroIconUrl, getHeroLanes } from "@/lib/heroUtils";

export default function HeroSearchModal({ isModalOpen, closePopUp, heroes, handleHeroSelect }) {
    const [query, setQuery] = useState("");
    const [selectedLane, setSelectedLane] = useState("All Heroes");
    const [selectedRole, setSelectedRole] = useState("All Roles");
    const [roleHeroes, setRoleHeroes] = useState(heroes);
    const [isLoadingRole, setIsLoadingRole] = useState(false);
    const [roleError, setRoleError] = useState("");
    const lanes = ["All Heroes", "Gold Lane", "Exp Lane", "Mid Lane", "Jungle", "Roam"];
    const roles = [
        ["All Roles", "Todos los roles"],
        ["Tank", "Tanque"],
        ["Fighter", "Luchador"],
        ["Assassin", "Asesino"],
        ["Mage", "Mago"],
        ["Marksman", "Tirador"],
        ["Support", "Apoyo"],
    ];
    const laneLabels = {
        "All Heroes": "Todos los héroes",
        "Gold Lane": "Línea de oro",
        "Exp Lane": "Línea EXP",
        "Mid Lane": "Línea central",
        Jungle: "Jungla",
        Roam: "Roam",
    };

    useEffect(() => {
        if (!isModalOpen) {
            setQuery("");
            setSelectedLane("All Heroes");
            setSelectedRole("All Roles");
        }
    }, [isModalOpen])

    useEffect(() => {
        if (!isModalOpen || selectedRole === "All Roles") {
            setRoleHeroes(heroes);
            setRoleError("");
            setIsLoadingRole(false);
            return;
        }

        const controller = new AbortController();

        async function loadRoleHeroes() {
            setIsLoadingRole(true);
            setRoleError("");

            try {
                const response = await fetch(`/api/heroes?role=${encodeURIComponent(selectedRole)}`, {
                    cache: "no-store",
                    signal: controller.signal
                });
                const result = await response.json();
                if (!response.ok) {
                    throw new Error(result.error || `No se pudieron cargar los héroes de rol ${selectedRole}.`);
                }
                if (!Array.isArray(result.data)) {
                    throw new Error("La API devolvió una lista de héroes no válida.");
                }
                setRoleHeroes(result.data);
            } catch (error) {
                if (!controller.signal.aborted) {
                    setRoleError(error.message);
                }
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoadingRole(false);
                }
            }
        }

        loadRoleHeroes();
        return () => controller.abort();
    }, [heroes, isModalOpen, selectedRole]);

    if (!isModalOpen) return null;

    const filteredHeroes = roleHeroes.filter(hero =>
        hero.name.toLowerCase().includes(query.toLowerCase())
    );
    const visibleHeroes = selectedLane === "All Heroes"
        ? filteredHeroes
        : filteredHeroes.filter(hero => getHeroLanes(hero).includes(selectedLane));
    const laneGroups = lanes.slice(1)
        .map(lane => ({
            lane,
            heroes: visibleHeroes.filter(hero => getHeroLanes(hero).includes(lane)),
        }))
        .filter(group => group.heroes.length > 0);

    function handleKeyDown(e) {
        if (e.key === "Enter" && visibleHeroes.length > 0) {
            e.preventDefault();
            handleHeroSelect(visibleHeroes[0].slug);
            closePopUp();
        }
    }

    return (
        <div className={style.overlay} onClick={closePopUp}>
            <div className={style.modal} onClick={(e) => e.stopPropagation()}>
                <button className={style.closeBtn} onClick={closePopUp} aria-label="Cerrar">×</button>
                <input
                    type="text"
                    className={style.inputSearch}
                    placeholder="Buscar héroes..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoFocus
                />
                <div className={style.heroLaneTabs} role="tablist" aria-label="Filtrar héroes por rol">
                    {roles.map(([role, label]) => (
                        <button
                            className={`${style.heroLaneTab} ${selectedRole === role ? style.activeHeroLaneTab : ""}`}
                            key={role}
                            type="button"
                            role="tab"
                            aria-selected={selectedRole === role}
                            onClick={() => setSelectedRole(role)}
                        >
                            {label}
                        </button>
                    ))}
                </div>
                <div className={style.heroLaneTabs} role="tablist" aria-label="Filtrar héroes por línea">
                    {lanes.map(lane => (
                        <button
                            className={`${style.heroLaneTab} ${selectedLane === lane ? style.activeHeroLaneTab : ""}`}
                            key={lane}
                            id={`hero-lane-tab-${lane.toLowerCase().replaceAll(" ", "-")}`}
                            type="button"
                            role="tab"
                            aria-selected={selectedLane === lane}
                            onClick={() => setSelectedLane(lane)}
                        >
                            {laneLabels[lane]}
                        </button>
                    ))}
                </div>
                <div className={style.heroSelectionSection}>
                    {roleError ? (
                        <p className={style.heroFilterMessage} role="alert">{roleError}</p>
                    ) : isLoadingRole ? (
                        <p className={style.heroFilterMessage} role="status">Cargando héroes...</p>
                    ) : visibleHeroes.length ? (
                        selectedLane === "All Heroes" ? (
                            <div
                                className={style.heroLaneGroups}
                                role="tabpanel"
                                aria-labelledby="hero-lane-tab-all-heroes"
                            >
                                {laneGroups.map(({ lane, heroes: laneHeroes }) => (
                                    <div className={style.heroLaneGroup} key={lane}>
                                        <h3 className={style.heroLaneTitle}>{laneLabels[lane]}</h3>
                                        <div className={style.heroGrid}>
                                            {laneHeroes.map(hero => (
                                                <HeroOption
                                                    key={`${lane}-${hero.slug}`}
                                                    hero={hero}
                                                    handleHeroSelect={handleHeroSelect}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div
                                className={style.heroGrid}
                                role="tabpanel"
                                aria-labelledby={`hero-lane-tab-${selectedLane.toLowerCase().replaceAll(" ", "-")}`}
                            >
                                {visibleHeroes.map(hero => (
                                    <HeroOption
                                        key={hero.slug}
                                        hero={hero}
                                        handleHeroSelect={handleHeroSelect}
                                    />
                                ))}
                            </div>
                        )
                    ) : (
                        <p className={style.heroFilterMessage}>No se encontraron héroes.</p>
                    )}
                </div>
            </div>
        </div >
    )
}

function HeroOption({ hero, handleHeroSelect }) {
    return (
        <div className={style.heroOption}>
            <button
                className={style.heroItem}
                type="button"
                onClick={() => handleHeroSelect(hero.slug)}
            >
                <img
                    src={getHeroIconUrl(hero)}
                    alt=""
                    className={style.heroIcon}
                />
                <span className={style.heroName}>
                    {hero.name}
                </span>
            </button>
            <Link href={`/heroes/${hero.slug}`} className={style.heroDetailLink}>
                Ver detalles
            </Link>
        </div>
    );
}