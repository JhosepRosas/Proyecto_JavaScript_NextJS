"use client"
import style from "@/styles/DraftPage.module.css";
import { calculateSuggestion } from "@/lib/draftLogic";
import { getHeroIconUrl } from "@/lib/heroUtils";

const lanes = ["Gold Lane", "Exp Lane", "Mid Lane", "Jungle", "Roam"];
const laneLabels = {
    "Gold Lane": "Línea de oro",
    "Exp Lane": "Línea EXP",
    "Mid Lane": "Línea central",
    Jungle: "Jungla",
    Roam: "Roam",
};

export default function SuggestionPanel({ heroes, bans, allies, enemies, counters, countersLoading }) {
    return (
        <>
            <p className="text-center text-xs text-slate-400">
                <span className={style.counterColor}>Counters de MLBBdex</span>
                {" · "}
                <span className={style.synergyColor}>Sinergias estimadas por roles/especialidades</span>
            </p>
            <div className={style.suggestionColumns}>
                {lanes.map(lane => {
                    const suggestions = calculateSuggestion({
                        allies,
                        enemies,
                        bans,
                        pickedLane: lane,
                        counters,
                    }, heroes);

                    return (
                        <section className={style.suggestionColumn} key={lane}>
                            <h3>{laneLabels[lane]}</h3>
                            {suggestions.length ? (
                                <div className={style.suggestedHeroes}>
                                    {suggestions.map(hero => {
                                        const suggestedHero = heroes.find(item => item.slug === hero.heroId);
                                        if (!suggestedHero) return null;

                                        const formattedScore = hero.score > 0
                                            ? `+${hero.score.toFixed(1)}`
                                            : hero.score.toFixed(1);

                                        return (
                                            <div key={hero.heroId} className={style.suggestedHero}>
                                                <img src={getHeroIconUrl(suggestedHero)} alt="" />
                                                <div className={style.heroDescription}>
                                                    <p>{suggestedHero.name}</p>
                                                    {hero.pros.length > 0 && (
                                                        <ul className={style.greenColor}>
                                                            {hero.pros.map(({ reason, type }, i) => (
                                                                <li
                                                                    key={`${type}-${i}`}
                                                                    className={type === "synergy" ? style.synergyColor : style.counterColor}
                                                                >
                                                                    {reason}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                    {hero.cons.length > 0 && (
                                                        <ul className={style.redColor}>
                                                            {hero.cons.map((reason, i) => (
                                                                <li key={i}>{reason}</li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </div>
                                                <p className={style.heroScore}>{formattedScore}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className={style.noSuggestions}>
                                    {countersLoading
                                        ? "Cargando counters..."
                                        : enemies.some(Boolean)
                                            ? "No hay sugerencias de counters o sinergia para esta línea."
                                            : allies.some(Boolean)
                                                ? "No hay sugerencias de sinergia para esta línea."
                                                : "Selecciona aliados o enemigos para ver sugerencias."}
                                </p>
                            )}
                        </section>
                    );
                })}
            </div>
        </>
    );
}