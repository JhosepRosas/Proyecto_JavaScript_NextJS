import style from "@/styles/DraftPage.module.css";
import { getHeroIconUrl } from "@/lib/heroUtils";

export default function DraftPanel({ title, handleSlotClick, handleNullSlotClick, slots, heroes }) {
    return (
        <div className={style.draftPanel}>
            <h3>{title === "Allies" ? "Aliados" : title === "Enemies" ? "Enemigos" : title}</h3>
            <div className={style.slotContainer}>
                {slots.map((heroSlug, i) => {
                    const hero = heroes.find(item => item.slug === heroSlug);

                    return (
                        <div className={style.slot} key={i}>
                            <button
                                className={style.slotIcon}
                                type="button"
                                aria-label={`${hero ? "Cambiar" : "Seleccionar"} héroe para ${title} ${i + 1}`}
                                onClick={() => handleSlotClick(title, i)}
                            >
                                {hero
                                    ? <img src={getHeroIconUrl(hero)} alt={hero.name} />
                                    : "+"}
                            </button>
                            <button
                                className={style.nullSlotButton}
                                type="button"
                                aria-label={`Quitar héroe de ${title} ${i + 1}`}
                                onClick={() => handleNullSlotClick(title, i)}
                            >
                                x
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}