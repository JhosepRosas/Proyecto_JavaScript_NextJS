"use client";

import { useEffect, useState } from "react";
import styles from "@/styles/HeroBuilds.module.css";
import { getLocalizedItemName } from "@/lib/itemUtils";

const RANKS = [
    ["all", "Todos"],
    ["epic", "Épico"],
    ["legend", "Leyenda"],
    ["mythic", "Mítico"],
    ["honor", "Honor Mítico"],
    ["glory", "Gloria Mítica"],
];

const API_ORIGIN = "https://mlbbdex.com";
const LANE_LABELS = {
    Gold: "Línea de oro",
    Exp: "Línea EXP",
    Mid: "Línea central",
    Jungle: "Jungla",
    Roam: "Roam",
};

function normalizeName(value) {
    return String(value || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");
}

function getItemSlug(name, items) {
    const normalized = normalizeName(name);
    const item = items.find(entry =>
        normalizeName(entry.name) === normalized || normalizeName(entry.slug) === normalized
    );
    return item?.slug || String(name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function findBuildAsset(value, entries, matchFields) {
    const normalized = normalizeName(value);
    return entries.find(entry =>
        matchFields.some(field => normalizeName(entry[field]) === normalized)
    );
}

export default function HeroBuilds({ slug }) {
    const [builds, setBuilds] = useState(null);
    const [assets, setAssets] = useState({ emblems: [], spells: [], items: [] });
    const [selectedRank, setSelectedRank] = useState("all");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [assetsError, setAssetsError] = useState("");

    useEffect(() => {
        const controller = new AbortController();

        async function loadBuilds() {
            try {
                const buildsResponse = await fetch(`/api/heroes/${encodeURIComponent(slug)}/builds`, {
                    cache: "no-store", signal: controller.signal,
                });
                const buildsResult = await buildsResponse.json();
                if (!buildsResponse.ok) {
                    throw new Error(buildsResult.error || "No se pudieron cargar las builds.");
                }
                if (!buildsResult.data || typeof buildsResult.data !== "object") {
                    throw new Error("La API devolvió builds no válidas.");
                }
                setBuilds(buildsResult.data);

                try {
                    const assetsResponse = await fetch("/api/build-assets", {
                        cache: "no-store", signal: controller.signal,
                    });
                    const assetsResult = await assetsResponse.json();
                    if (!assetsResponse.ok) {
                        throw new Error(assetsResult.error || "No se pudieron cargar los iconos.");
                    }
                    if (
                        !Array.isArray(assetsResult.data?.emblems) ||
                        !Array.isArray(assetsResult.data?.spells) ||
                        !Array.isArray(assetsResult.data?.items)
                    ) {
                        throw new Error("La API devolvió catálogos de builds no válidos.");
                    }
                    setAssets(assetsResult.data);
                } catch (assetsLoadError) {
                    if (!controller.signal.aborted) {
                        setAssetsError(assetsLoadError.message);
                    }
                }
            } catch (loadError) {
                if (!controller.signal.aborted) {
                    setError(loadError.message);
                }
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            }
        }

        loadBuilds();
        return () => controller.abort();
    }, [slug]);

    const availableLanes = Object.entries(builds || {})
        .map(([lane, ranks]) => ({
            lane,
            builds: Array.isArray(ranks?.[selectedRank]) ? ranks[selectedRank] : [],
        }))
        .filter(({ builds: laneBuilds }) => laneBuilds.length > 0);

    return (
        <section className={styles.buildsPanel}>
            <h2>Builds recomendadas</h2>
            <p className={styles.intro}>
                Configuraciones y estadísticas según la API de MLBBdex.
            </p>

            {isLoading ? (
                <p role="status" className={styles.message}>Cargando builds...</p>
            ) : error ? (
                <p role="alert" className={styles.error}>{error}</p>
            ) : Object.keys(builds).length === 0 ? (
                <p className={styles.message}>No hay builds disponibles para este héroe.</p>
            ) : (
                <>
                    <div className={styles.rankFilters} aria-label="Filtrar builds por rango">
                        {RANKS.filter(([rank]) =>
                            Object.values(builds).some(lane => Array.isArray(lane?.[rank]) && lane[rank].length)
                        ).map(([rank, label]) => (
                            <button
                                key={rank}
                                type="button"
                                onClick={() => setSelectedRank(rank)}
                                aria-pressed={selectedRank === rank}
                                className={selectedRank === rank ? styles.activeRank : styles.rankButton}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    <div className={styles.lanes}>
                        {availableLanes.map(({ lane, builds: laneBuilds }) => (
                            <div className={styles.laneGroup} key={lane}>
                                <h3>{LANE_LABELS[lane] || lane}</h3>
                                <div className={styles.buildGrid}>
                                    {laneBuilds.map((build, index) => (
                                        <article
                                            key={`${lane}-${selectedRank}-${index}`}
                                            className={styles.buildCard}
                                        >
                                            <h4>
                                                Build {index + 1}
                                            </h4>
                                            <p className={styles.fieldLabel}>Objetos</p>
                                            <ol className={styles.itemSlots}>
                                                {Array.from({ length: 4 }, (_, itemIndex) => {
                                                    const itemName = build.items?.[itemIndex];
                                                    if (!itemName) {
                                                        return <li className={styles.emptyItem} key={`empty-${itemIndex}`} aria-label={`Espacio ${itemIndex + 1} vacío`} />;
                                                    }

                                                    const item = findBuildAsset(itemName, assets.items, ["name", "slug"]);
                                                    const itemSlug = getItemSlug(itemName, assets.items);
                                                    const image = item?.image || `${API_ORIGIN}/visuels/objets/${itemSlug}.webp`;
                                                    const displayName = getLocalizedItemName(
                                                        item || { slug: itemSlug, name: itemName }
                                                    ) || itemName;

                                                    return (
                                                        <li className={styles.itemSlot} key={`${itemSlug}-${itemIndex}`} title={itemName}>
                                                            <img src={image} alt="" loading="lazy" />
                                                            <span>{displayName}</span>
                                                        </li>
                                                    );
                                                })}
                                            </ol>
                                            <div className={styles.buildFacts}>
                                                <div className={styles.buildAsset}>
                                                    <span>Emblema</span>
                                                    {build.emblem && (() => {
                                                        const emblem = findBuildAsset(build.emblem, assets.emblems, ["role", "slug", "name"]);
                                                        return emblem?.image
                                                            ? <img src={emblem.image} alt="" loading="lazy" />
                                                            : null;
                                                    })()}
                                                    <strong>{build.emblem || "N/D"}</strong>
                                                </div>
                                                <div className={styles.buildAsset}>
                                                    <span>Hechizo</span>
                                                    {build.spell && (() => {
                                                        const spell = findBuildAsset(build.spell, assets.spells, ["slug", "name"]);
                                                        return spell?.image
                                                            ? <img src={spell.image} alt="" loading="lazy" />
                                                            : null;
                                                    })()}
                                                    <strong>{build.spell || "N/D"}</strong>
                                                </div>
                                                <p>Victorias: <strong>{build.winRate ?? "N/D"}%</strong></p>
                                                <p>Selección: <strong>{build.pickRate ?? "N/D"}%</strong></p>
                                            </div>
                                            {build.talents?.length > 0 && (
                                                <p className={styles.talents}>
                                                    Talentos: <strong>{build.talents.join(" · ")}</strong>
                                                </p>
                                            )}
                                        </article>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    {assetsError && (
                        <p role="status" className={styles.assetsNotice}>
                            No se cargaron los catálogos de iconos; se muestran los nombres disponibles. ({assetsError})
                        </p>
                    )}
                </>
            )}
        </section>
    );
}
