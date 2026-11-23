const API_ORIGIN = "https://mlbbdex.com";

const LANE_NAMES = {
    Gold: "Gold Lane",
    Exp: "Exp Lane",
    Mid: "Mid Lane",
};

export function getHeroIconUrl(hero) {
    const imagePath = hero.images?.icon || `/visuels/heros/${hero.slug}/icone.webp`;
    return new URL(imagePath, API_ORIGIN).toString();
}

export function getHeroLanes(hero) {
    return (hero.lanes || []).map(lane => LANE_NAMES[lane] || lane);
}
