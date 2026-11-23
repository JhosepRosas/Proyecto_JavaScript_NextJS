import { getHeroBySlug } from "@/services/heroService";
import HeroDetail from "@/components/heroes/HeroDetail";

export default async function HeroPage({ params }) {
    const { slug } = await params;
    const hero = await getHeroBySlug(slug);

    return (
        <main className="min-h-screen bg-slate-950">
            {/* Toda la información detallada (estadísticas, habilidades, skins) viene de HeroDetail */}
            <HeroDetail hero={hero} />
        </main>
    );
}