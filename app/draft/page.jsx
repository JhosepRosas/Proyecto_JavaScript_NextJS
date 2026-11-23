"use client"
import { useEffect, useState } from "react";
import style from "@/styles/DraftPage.module.css";
import DraftPanel from "@/components/DraftPanel";
import SuggestionPanel from "@/components/SuggestionPanel";
import HeroSearchModal from "@/components/HeroSearchModal";

const EMPTY_BANS = Array(10).fill(null);
const EMPTY_TEAM = Array(5).fill(null);
export default function DraftPage() {
    const [heroes, setHeroes] = useState([]);
    const [isLoadingHeroes, setIsLoadingHeroes] = useState(true);
    const [heroListError, setHeroListError] = useState("");
    const [counters, setCounters] = useState({});
    const [countersLoading, setCountersLoading] = useState(false);
    const [counterError, setCounterError] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [banSlots, setBanSlots] = useState(EMPTY_BANS);
    const [allySlots, setAllySlots] = useState(EMPTY_TEAM);
    const [enemySlots, setEnemySlots] = useState(EMPTY_TEAM);
    const setters = {
        Banned: setBanSlots,
        Allies: setAllySlots,
        Enemies: setEnemySlots
    };

    const [selectedSlot, setSelectedSlot] = useState({ panel: null, index: null });
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const controller = new AbortController();

        async function loadHeroes() {
            try {
                const response = await fetch("/api/heroes", {
                    cache: "no-store",
                    signal: controller.signal
                });
                const result = await response.json();
                if (!response.ok) {
                    throw new Error(result.error || "No se pudo cargar la lista de héroes.");
                }
                if (!Array.isArray(result.data)) {
                    throw new Error("La API devolvió una lista de héroes no válida.");
                }
                setHeroes(result.data);
            } catch (error) {
                if (!controller.signal.aborted) {
                    setHeroListError(error.message);
                }
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoadingHeroes(false);
                }
            }
        }

        loadHeroes();
        return () => controller.abort();
    }, []);

    useEffect(() => {
        const enemySlugs = [...new Set(enemySlots.filter(Boolean))];
        const controller = new AbortController();

        if (enemySlugs.length === 0) {
            setCounters({});
            setCounterError("");
            setCountersLoading(false);
            return () => controller.abort();
        }

        async function loadCounters() {
            setCountersLoading(true);
            setCounterError("");

            try {
                const entries = await Promise.all(enemySlugs.map(async slug => {
                    const response = await fetch(
                        `/api/heroes/${encodeURIComponent(slug)}/counters`,
                        { cache: "no-store", signal: controller.signal }
                    );
                    const result = await response.json();
                    if (!response.ok) {
                        throw new Error(result.error || `No se pudieron cargar los counters de ${slug}.`);
                    }
                    if (!result.data?.all?.strong) {
                        throw new Error(`La API devolvió counters no válidos para ${slug}.`);
                    }
                    return [slug, result.data];
                }));

                setCounters(Object.fromEntries(entries));
            } catch (error) {
                if (!controller.signal.aborted) {
                    setCounters({});
                    setCounterError(error.message);
                }
            } finally {
                if (!controller.signal.aborted) {
                    setCountersLoading(false);
                }
            }
        }

        loadCounters();
        return () => controller.abort();
    }, [enemySlots]);

    function closePopUp() {
        setIsModalOpen(false);
    }

    function resetDraft() {
        setBanSlots([...EMPTY_BANS]);
        setAllySlots([...EMPTY_TEAM]);
        setEnemySlots([...EMPTY_TEAM]);
    }

    function handleNullSlotClick(panel, index) {
        const setter = setters[panel];
        if (!setter) {
            console.error("Unknown panel selected");
            return;
        }
        setter(prev => {
            const updated = [...prev];
            updated[index] = null;
            return updated;
        });
    }

    function handleSlotClick(panel, index) {
        if (isLoadingHeroes || heroListError) return;
        setSelectedSlot({ panel, index });
        setIsModalOpen(true);
    }

    function handleHeroSelect(heroSlug) {
        const { panel, index } = selectedSlot;
        const setter = setters[panel];
        if (!setter) return;

        const isTaken = [
            ...banSlots,
            ...allySlots,
            ...enemySlots
        ].includes(heroSlug);

        if (isTaken) {
            const heroName = heroes.find(hero => hero.slug === heroSlug)?.name || heroSlug;
            setErrorMessage(`${heroName} ya fue seleccionado.`);
            setTimeout(() => setErrorMessage(""), 3000);
            closePopUp();
            return;
        }

        setter(prev => {
            const updated = [...prev];
            updated[index] = heroSlug;
            return updated;
        });

        closePopUp();
    }

    return (
        <main>
            {(errorMessage || heroListError || counterError) && (
                <div className={style.errorBanner}>
                    {errorMessage || heroListError || counterError}
                </div>
            )}

            {isLoadingHeroes && <p role="status">Cargando héroes actualizados...</p>}

            <section>
                <DraftPanel
                    title="Allies"
                    handleSlotClick={handleSlotClick}
                    handleNullSlotClick={handleNullSlotClick}
                    slots={allySlots}
                    heroes={heroes}
                />
                <DraftPanel
                    title="Enemies"
                    handleSlotClick={handleSlotClick}
                    handleNullSlotClick={handleNullSlotClick}
                    slots={enemySlots}
                    heroes={heroes}
                />
                <button className="btn" type="button" onClick={resetDraft}>Reiniciar draft</button>
            </section>

            <section>
                <SuggestionPanel
                    heroes={heroes}
                    bans={banSlots}
                    allies={allySlots}
                    enemies={enemySlots}
                    counters={counters}
                    countersLoading={countersLoading}
                />
            </section>

            <HeroSearchModal
                isModalOpen={isModalOpen}
                closePopUp={closePopUp}
                heroes={heroes}
                handleHeroSelect={handleHeroSelect}
            />
        </main>
    );
}
