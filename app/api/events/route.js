import { getEvents } from "@/services/heroService";

export const dynamic = "force-dynamic";

export async function GET(request) {
    try {
        const events = await getEvents();
        return Response.json({ data: events });
    } catch (error) {
        console.error("Error al consultar eventos:", error);
        return Response.json(
            { error: "No se pudieron obtener los eventos." },
            { status: 502 }
        );
    }
}
