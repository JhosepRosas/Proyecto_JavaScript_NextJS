import { getHeroes } from "@/services/heroService";

export const dynamic = "force-dynamic";

export async function GET(request) {
    try {
        const searchParams = new URL(request.url).searchParams;
        const role = searchParams.get("role")?.trim();
        const heroes = await getHeroes({ role });
        return Response.json({ data: heroes });
    } catch (error) {
        console.error("Error al consultar la lista de héroes:", error);
        return Response.json(
            { error: "No se pudo obtener la lista de héroes." },
            { status: 502 }
        );
    }
}
