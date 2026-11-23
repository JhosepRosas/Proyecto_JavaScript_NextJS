const API_URL = "https://mlbbdex.com/api/v1";

export async function getHeroes() {
    const response = await fetch(`${API_URL}/heroes`, {
        cache: "no-store"
    });

    if (!response.ok) {
        throw new Error("Error al obtener los héroes");
    }

    const result = await response.json();
    return result.data;
}

export async function getHeroBySlug(slug) {
    const response = await fetch(`${API_URL}/heroes/${slug}`, {
        cache: "no-store"
    });

    if (!response.ok) {
        throw new Error("Error al obtener el héroe");
    }

    const result = await response.json();
    return result.data;
}