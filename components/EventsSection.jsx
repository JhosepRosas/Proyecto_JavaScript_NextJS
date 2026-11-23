"use client";

import { useState } from "react";
import style from "@/styles/EventsSection.module.css";

export default function EventsSection({ events, eventsError, patches, patchesError }) {
    const [patchDetails, setPatchDetails] = useState(null);
    const [patchLoading, setPatchLoading] = useState(false);
    const [patchError, setPatchError] = useState("");

    const latestPatch = patches[0];

    async function showPatchDetails() {
        if (patchDetails) {
            setPatchDetails(null);
            return;
        }

        if (!latestPatch) return;

        setPatchLoading(true);
        setPatchError("");
        try {
            const response = await fetch(
                `/api/patches/${encodeURIComponent(latestPatch.version)}`,
                { cache: "no-store" }
            );
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || "No se pudieron cargar las notas del parche.");
            }
            setPatchDetails(result.data);
        } catch (error) {
            setPatchError(error.message);
        } finally {
            setPatchLoading(false);
        }
    }

    return (
        <section className={style.newsSection} id="events">
            <header className={style.header}>
                <span className={style.eyebrow}>MLBBDEX</span>
                <h2>Noticias del juego</h2>
                <p>Eventos y notas de parche recientes.</p>
            </header>

            <div className={style.newsGrid}>
                <section className={`${style.panel} ${style.patchPanel}`}>
                    <h3>Notas de parche</h3>
                    <p className={style.panelIntro}>Actualizaciones recientes de MLBB.</p>

                    {patchesError ? (
                        <p className={style.error} role="alert">{patchesError}</p>
                    ) : patches.length ? (
                        <div className={style.patchList}>
                            {patches.slice(0, 3).map(patch => (
                                <article className={style.patchCard} key={patch.version}>
                                    <h4>{patch.title}</h4>
                                    <p>
                                        Versión {patch.version}
                                        {patch.date && ` · ${new Date(`${patch.date}T00:00:00`).toLocaleDateString("es")}`}
                                    </p>
                                    {patch.link && (
                                        <a href={patch.link} target="_blank" rel="noreferrer">
                                            Fuente →
                                        </a>
                                    )}
                                </article>
                            ))}

                            {latestPatch && (
                                <button
                                    type="button"
                                    onClick={showPatchDetails}
                                    disabled={patchLoading}
                                    className={style.moreButton}
                                >
                                    {patchLoading ? "Cargando..." : patchDetails ? "Ver menos" : "Ver más"}
                                </button>
                            )}
                            {patchError && <p className={style.error} role="alert">{patchError}</p>}

                            {patchDetails && (
                                <div className={style.patchDetails}>
                                    <div>
                                        <h4>{patchDetails.title}</h4>
                                        <p className={style.panelIntro}>
                                            Versión {patchDetails.version}
                                            {patchDetails.date && ` · ${new Date(`${patchDetails.date}T00:00:00`).toLocaleDateString("es")}`}
                                        </p>
                                    </div>
                                    {patchDetails.sections?.map((section, index) => {
                                        const text = section.html
                                            ?.replace(/<br\s*\/?>/gi, "\n")
                                            .replace(/<\/(p|li|h[1-6])>/gi, "\n")
                                            .replace(/<[^>]*>/g, "")
                                            .replace(/&nbsp;/gi, " ")
                                            .replace(/&amp;/gi, "&")
                                            .replace(/&lt;/gi, "<")
                                            .replace(/&gt;/gi, ">")
                                            .replace(/&quot;/gi, "\"")
                                            .replace(/&#39;/gi, "'")
                                            .trim();

                                        if (!section.title && !text) return null;

                                        return (
                                            <article className={style.patchSection} key={section.anchor || `section-${index}`}>
                                                {section.title && <h5>{section.title}</h5>}
                                                {text && <p>{text}</p>}
                                            </article>
                                        );
                                    })}
                                    {patchDetails.link && (
                                        <a href={patchDetails.link} target="_blank" rel="noreferrer">
                                            Leer fuente completa →
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>
                    ) : (
                        <p className={style.emptyState}>No hay parches disponibles.</p>
                    )}
                </section>

                <section className={`${style.panel} ${style.eventPanel}`}>
                    <h3>Eventos y skins</h3>
                    {eventsError ? (
                        <p className={style.error} role="alert">{eventsError}</p>
                    ) : events.length ? (
                        <div className={style.eventList}>
                            {events.map((event, index) => (
                                <article
                                    className={style.eventCard}
                                    key={`${event.kind}-${event.hero}-${event.start}-${index}`}
                                >
                                    {event.image && (
                                        <img
                                            src={event.image}
                                            alt={event.skin || event.name}
                                            className={style.eventImage}
                                        />
                                    )}
                                    <div className={style.eventInfo}>
                                        <p className={style.eventKind}>{event.kind}</p>
                                        <h4>{event.name}</h4>
                                        <p className={style.eventDate}>
                                            {event.start && new Date(event.start).toLocaleDateString("es")}
                                            {event.end && ` – ${new Date(event.end).toLocaleDateString("es")}`}
                                        </p>
                                        {event.link && (
                                            <a href={event.link} target="_blank" rel="noreferrer">
                                                Ver evento →
                                            </a>
                                        )}
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <p className={style.emptyState}>No hay eventos disponibles ahora.</p>
                    )}
                    <p className={style.credit}>
                        Contenido e imágenes:{" "}
                        <a href="https://mobilelegends.fandom.com" target="_blank" rel="noreferrer">
                            Mobile Legends Wiki
                        </a>{" "}
                        (CC BY-SA).
                    </p>
                </section>
            </div>
        </section>
    );
}
