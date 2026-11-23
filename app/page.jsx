import { getEvents, getHeroes, getItems, getPatches } from "@/services/heroService";
import Hero from "@/components/Hero";
import HomeDiscoverSection from "@/components/HomeDiscoverSection";
import EventsSection from "@/components/EventsSection";

export const dynamic = "force-dynamic";

export default async function Home() {
  let heroes = [];
  let items = [];
  let catalogError = "";
  let events = [];
  let eventsError = "";
  let patches = [];
  let patchesError = "";

  try {
    const [heroList, itemList] = await Promise.all([getHeroes(), getItems()]);
    heroes = heroList.slice(0, 6);
    items = itemList.filter(item => !item.removed).slice(0, 6);
  } catch (error) {
    console.error("No se pudieron cargar las vistas previas de héroes e ítems:", error);
    catalogError = "No se pudieron cargar las vistas previas del catálogo.";
  }

  try {
    events = await getEvents();
  } catch (error) {
    console.error("No se pudieron cargar los eventos de la página principal:", error);
    eventsError = "No se pudieron cargar los eventos. Inténtalo de nuevo más tarde.";
  }

  try {
    patches = await getPatches();
  } catch (error) {
    console.error("No se pudieron cargar los parches de la página principal:", error);
    patchesError = "No se pudieron cargar los parches. Inténtalo de nuevo más tarde.";
  }

  return (
    <main className="home">
      <Hero />
      <HomeDiscoverSection heroes={heroes} items={items} error={catalogError} />
      <EventsSection
        events={events}
        eventsError={eventsError}
        patches={patches}
        patchesError={patchesError}
      />
    </main>
  );
}
