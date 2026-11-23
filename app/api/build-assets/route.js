import { getEmblems, getItems, getSpells } from "@/services/heroService";

export const dynamic = "force-dynamic";

export async function GET(request) {
    try {
        const [emblems, spells, items] = await Promise.all([
            getEmblems(),
            getSpells(),
            getItems(),
        ]);

        return Response.json({ data: { emblems, spells, items } });
    } catch (error) {
        console.error("Error al consultar los recursos de builds:", error);
        return Response.json(
            { error: "No se pudieron obtener los iconos para las builds." },
            { status: 502 }
        );
    }
}
