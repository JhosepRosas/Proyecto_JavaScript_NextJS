import { getHeroCounters } from "@/services/heroService";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
    try {
        const { slug } = await params;
        const counters = await getHeroCounters(slug);
        return Response.json({ data: counters });
    } catch (error) {
        console.error("Error al consultar counters del héroe:", error);
        return Response.json(
            { error: "No se pudieron obtener los counters del héroe." },
            { status: 502 }
        );
    }
}
