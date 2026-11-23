import { getHeroLanes } from "@/lib/heroUtils";

export function calculateSuggestion({ allies, enemies, bans, pickedLane, counters }, heroes) {
    const results = [];

    for (const enemySlug of enemies.filter(Boolean)) {
        const enemy = heroes.find(hero => hero.slug === enemySlug);
        const enemyCounters = counters[enemySlug]?.all?.strong || [];

        for (const counter of enemyCounters) {
            const candidate = heroes.find(hero => hero.slug === counter.slug);
            if (candidate && getHeroLanes(candidate).includes(pickedLane)) {
                addRelationship(
                    results,
                    counter.slug,
                    counter.advantage,
                    `Counters ${enemy?.name || enemySlug}`,
                    "counter"
                );
            }
        }
    }

    for (const allySlug of allies.filter(Boolean)) {
        const ally = heroes.find(hero => hero.slug === allySlug);
        if (!ally) continue;

        const allyRoles = ally.roles || [];
        const allySpecialties = ally.specialties || [];
        const allyIsFrontline = allyRoles.some(role => ["Tank", "Support"].includes(role));
        const allyIsDamage = allyRoles.some(role => ["Fighter", "Mage", "Marksman", "Assassin"].includes(role));
        const allyProvidesControl = allySpecialties.some(specialty =>
            ["Guard", "Crowd Control", "Control", "Initiator"].includes(specialty)
        );

        for (const candidate of heroes) {
            if (!getHeroLanes(candidate).includes(pickedLane)) continue;

            const candidateIsFrontline = (candidate.roles || [])
                .some(role => ["Tank", "Support"].includes(role));
            const candidateIsDamage = (candidate.roles || [])
                .some(role => ["Fighter", "Mage", "Marksman", "Assassin"].includes(role));
            const candidateDealsDamage = (candidate.specialties || [])
                .some(specialty => ["Damage", "Burst", "Mixed Damage"].includes(specialty));

            if (allyIsFrontline && candidateIsDamage) {
                addRelationship(results, candidate.slug, 1, `Complementa el frente de ${ally.name}`, "synergy");
            } else if (allyIsDamage && candidateIsFrontline) {
                addRelationship(results, candidate.slug, 1, `Aporta protección para ${ally.name}`, "synergy");
            }

            if (allyProvidesControl && candidateDealsDamage) {
                addRelationship(results, candidate.slug, 0.5, `Aprovecha el control de ${ally.name}`, "synergy");
            }
        }
    }

    const pickedSlugs = [
        ...allies.filter(Boolean),
        ...enemies.filter(Boolean),
        ...bans.filter(Boolean),
    ];

    const filteredResults = results.filter(result => !pickedSlugs.includes(result.heroId));
    filteredResults.sort((a, b) => b.score - a.score);

    return filteredResults;
}

function addRelationship(results, heroId, score, reason, type) {
    const existing = results.find(r => r.heroId === heroId);

    if (existing) {
        existing.score += score;
        existing.pros.push({ reason, type });
    } else {
        results.push({
            heroId: heroId,
            score: score,
            pros: [{ reason, type }],
            cons: []
        });
    }
}
