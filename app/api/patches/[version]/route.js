import { getPatchByVersion } from "@/services/heroService";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
    try {
        const { version } = await params;
        const patch = await getPatchByVersion(version);
        return Response.json({ data: patch });
    } catch (error) {
        console.error("Error al consultar el detalle del parche:", error);
        return Response.json(
            { error: "No se pudo obtener el detalle del parche." },
            { status: 502 }
        );
    }
}
