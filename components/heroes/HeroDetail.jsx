import Link from "next/link";

export default function HeroDetail({ hero }) {
    if (!hero) {
        return (
            <main className="max-w-5xl mx-auto px-4 py-20 text-center text-slate-100">
                <h2 className="text-2xl font-bold text-white mb-2">Héroe no encontrado</h2>
                <p className="text-slate-400 text-sm mb-6">
                    No pudimos cargar la información de este héroe.
                </p>
                <Link 
                    href="/heroes"
                    className="inline-flex items-center gap-2 text-sm font-bold bg-amber-400 text-slate-950 px-5 py-2.5 rounded-xl hover:bg-amber-300 transition-colors"
                >
                    ← Volver al catálogo
                </Link>
            </main>
        );
    }

    return (
        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 text-slate-100 space-y-8">
            <div>
                <Link 
                    href="/heroes"
                    className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-amber-400 transition-colors bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl"
                >
                    ← Volver a la lista de héroes
                </Link>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-800 pb-6">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-400/10 border border-amber-400/20 px-3 py-1 rounded-full">
                            Detalles del Héroe
                        </span>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-3">
                            {hero.name}
                        </h1>
                        <p className="text-slate-400 text-base italic mt-1">{hero.title}</p>
                    </div>

                    {hero.release && (
                        <div className="text-xs text-slate-400 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
                            Lanzamiento: <span className="text-slate-200 font-semibold">{hero.release}</span>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 text-sm">
                    <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                        <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Roles</span>
                        <span className="text-amber-300 font-medium">{hero.roles?.join(", ") || "N/A"}</span>
                    </div>
                    <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                        <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Líneas</span>
                        <span className="text-slate-200 font-medium">{hero.lanes?.join(", ") || "N/A"}</span>
                    </div>
                    <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                        <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Especialidades</span>
                        <span className="text-slate-400 font-medium">{hero.specialties?.join(", ") || "N/A"}</span>
                    </div>
                </div>
            </div>

            {hero.ratings && (
                <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-xl">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <span className="text-amber-400">📊</span> Estadísticas
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {[
                            { label: "Ofensiva", value: hero.ratings.offense },
                            { label: "Durabilidad", value: hero.ratings.durability },
                            { label: "Efectos de Habilidad", value: hero.ratings.abilityEffects },
                            { label: "Dificultad", value: hero.ratings.difficulty },
                        ].map((stat, idx) => (
                            <div key={idx} className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-slate-300 font-medium">{stat.label}</span>
                                    <span className="text-amber-400 font-bold">{stat.value}%</span>
                                </div>
                                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                    <div 
                                        className="bg-gradient-to-r from-amber-500 to-amber-300 h-full rounded-full transition-all duration-500" 
                                        style={{ width: `${stat.value || 0}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {hero.skills?.length > 0 && (
                <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-xl">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <span className="text-amber-400">⚡</span> Habilidades
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {hero.skills.map((skill, index) => {
                            const name = typeof skill === "string" ? skill : skill.name;
                            const description = typeof skill === "object" ? skill.description : null;

                            return (
                                <article key={index} className="bg-slate-950/80 border border-slate-800/90 rounded-2xl p-5">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="w-7 h-7 rounded-lg bg-amber-400/10 text-amber-400 flex items-center justify-center text-xs font-bold border border-amber-400/20">
                                            {index + 1}
                                        </span>
                                        <h3 className="text-base font-bold text-white">{name}</h3>
                                    </div>
                                    {description && (
                                        <p className="text-slate-400 text-xs sm:text-sm leading-relaxed pl-10">
                                            {description}
                                        </p>
                                    )}
                                </article>
                            );
                        })}
                    </div>
                </div>
            )}

            {hero.skins?.length > 0 && (
                <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-xl">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <span className="text-amber-400">🛡️</span> Skins Disponibles
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {hero.skins.map((skin) => (
                            <article key={skin.id} className="bg-slate-950/80 border border-slate-800/90 rounded-2xl p-5 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start gap-2 mb-2">
                                        <h3 className="text-base font-bold text-white leading-snug">{skin.name}</h3>
                                        <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-900 text-amber-300 border border-slate-800 px-2 py-0.5 rounded-md">
                                            {skin.rarity || "Normal"}
                                        </span>
                                    </div>

                                    <div className="space-y-1.5 text-xs text-slate-400 mt-4 border-t border-slate-800/80 pt-3">
                                        <p className="flex justify-between">
                                            <span className="text-slate-500">Disponibilidad:</span>
                                            <span className="text-slate-300 font-medium">{skin.availability || "N/A"}</span>
                                        </p>
                                        <p className="flex justify-between">
                                            <span className="text-slate-500">Lanzamiento:</span>
                                            <span className="text-slate-300 font-medium">{skin.release || "N/A"}</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                                    <span className="text-slate-500 font-medium">Precio:</span>
                                    <div className="flex items-center gap-3">
                                        {skin.price?.bp && <span className="text-amber-400 font-bold">🪙 {skin.price.bp} BP</span>}
                                        {skin.price?.dm && <span className="text-cyan-400 font-bold">💎 {skin.price.dm} DM</span>}
                                        {!skin.price?.bp && !skin.price?.dm && <span className="text-slate-500 italic">No a la venta</span>}
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            )}
        </main>
    );
}