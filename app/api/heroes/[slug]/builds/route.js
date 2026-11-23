import { getHeroBuilds } from "@/services/heroService";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
    try {
        const { slug } = await params;
        const builds = await getHeroBuilds(slug);
        return Response.json({ data: builds });
    } catch (error) {
        console.error("Error al consultar builds del héroe:", error);
        return Response.json(
            { error: "No se pudieron obtener las builds del héroe." },
            { status: 502 }
        );
    }
}
