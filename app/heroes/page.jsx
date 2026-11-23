import { getHeroes } from "@/services/heroService";
import HeroList from "@/components/heroes/HeroList";

export default async function HeroesPage() {
    const heroes = await getHeroes();

    return (
        <main className="min-h-screen bg-slate-950">
            {/* Toda la interfaz del listado, buscador y cuadrícula viene de HeroList */}
            <HeroList heroes={heroes} />
        </main>
    );
}