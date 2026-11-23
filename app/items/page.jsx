import ItemCatalog from "@/components/ItemCatalog";
import { getItems } from "@/services/heroService";

export const dynamic = "force-dynamic";

export default async function ItemsPage() {
    let items = [];
    let error = "";

    try {
        items = await getItems();
    } catch (loadError) {
        console.error("No se pudo cargar el catálogo de ítems:", loadError);
        error = "No se pudo cargar el catálogo de ítems. Inténtalo más tarde.";
    }

    return <ItemCatalog items={items} error={error} />;
}
