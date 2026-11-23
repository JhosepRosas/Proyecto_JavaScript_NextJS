import { getItems } from "@/services/heroService";

export const dynamic = "force-dynamic";

export async function GET(request) {
    try {
        const searchParams = new URL(request.url).searchParams;
        const category = searchParams.get("category")?.trim() || undefined;
        const items = await getItems({ category });
        return Response.json({ data: items });
    } catch (error) {
        console.error("Error al consultar los ítems:", error);
        return Response.json(
            { error: "No se pudieron obtener los ítems." },
            { status: 502 }
        );
    }
}
