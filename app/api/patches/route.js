import { getPatches } from "@/services/heroService";

export const dynamic = "force-dynamic";

export async function GET(request) {
    try {
        const patches = await getPatches();
        return Response.json({ data: patches });
    } catch (error) {
        console.error("Error al consultar la lista de parches:", error);
        return Response.json(
            { error: "No se pudo obtener la lista de parches." },
            { status: 502 }
        );
    }
}
