const API_URL = "https://mlbbdex.com/api/v1";
const DEFAULT_LOCALE = "es";

function localizedUrl(path) {
    const url = new URL(`${API_URL}${path}`);
    url.searchParams.set("locale", DEFAULT_LOCALE);
    return url;
}

function getSpanishPatchTitle(patch) {
    const titlePrefix = patch.title?.toLowerCase().startsWith("patch notes")
        ? "Notas del parche"
        : "Parche";
    return `${titlePrefix} ${patch.version}`;
}

export async function getHeroes({ role } = {}) {
    const url = localizedUrl("/heroes");
    if (role) {
        url.searchParams.set("role", role);
    }

    const response = await fetch(url, {
        cache: "no-store"
    });

    if (!response.ok) {
        throw new Error(`Error al obtener los héroes (${response.status})`);
    }

    const result = await response.json();
    return result.data;
}

export async function getHeroBySlug(slug) {
    const url = localizedUrl(`/heroes/${encodeURIComponent(slug)}`);
    const response = await fetch(url, {
        cache: "no-store"
    });

    if (!response.ok) {
        throw new Error(`Error al obtener el héroe (${response.status})`);
    }

    const result = await response.json();
    return result.data;
}

export async function getHeroBuilds(slug) {
    const url = localizedUrl(`/heroes/${encodeURIComponent(slug)}/builds`);
    const response = await fetch(url, {
        cache: "no-store"
    });

    if (!response.ok) {
        throw new Error(`Error al obtener las builds de ${slug} (${response.status})`);
    }

    const result = await response.json();
    return result.data;
}

export async function getHeroCounters(slug) {
    const url = localizedUrl(`/heroes/${encodeURIComponent(slug)}/counters`);
    const response = await fetch(url, {
        cache: "no-store"
    });

    if (!response.ok) {
        throw new Error(`Error al obtener los counters de ${slug} (${response.status})`);
    }

    const result = await response.json();
    return result.data;
}

export async function getEvents() {
    const url = localizedUrl("/events");
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
        throw new Error(`Error al obtener los eventos (${response.status})`);
    }

    const result = await response.json();
    return result.data;
}

export async function getPatches() {
    const url = localizedUrl("/patches");
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
        throw new Error(`Error al obtener los parches (${response.status})`);
    }

    const result = await response.json();
    return result.data.map(patch => ({
        ...patch,
        title: getSpanishPatchTitle(patch),
    }));
}

export async function getPatchByVersion(version) {
    const url = localizedUrl(`/patches/${encodeURIComponent(version)}`);
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
        throw new Error(`Error al obtener el parche ${version} (${response.status})`);
    }

    const result = await response.json();
    return {
        ...result.data,
        title: getSpanishPatchTitle(result.data),
    };
}

export async function getEmblems() {
    const url = localizedUrl("/emblems");
    const response = await fetch(url, { cache: "no-store" });

    if (!response.ok) {
        throw new Error(`Error al obtener los emblemas (${response.status})`);
    }

    const result = await response.json();
    return result.data;
}

export async function getSpells() {
    const url = localizedUrl("/spells");
    const response = await fetch(url, { cache: "no-store" });

    if (!response.ok) {
        throw new Error(`Error al obtener los hechizos (${response.status})`);
    }

    const result = await response.json();
    return result.data;
}

export async function getItems({ category } = {}) {
    const url = localizedUrl("/items");
    if (category) {
        url.searchParams.set("category", category);
    }
    const response = await fetch(url, { cache: "no-store" });

    if (!response.ok) {
        throw new Error(`Error al obtener los ítems (${response.status})`);
    }

    const result = await response.json();
    return result.data;
}