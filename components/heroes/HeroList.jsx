"use client";

import { useState } from "react";
import Link from "next/link";

export default function HeroList({ heroes }) {
    const [search, setSearch] = useState("");
    const [role, setRole] = useState("Todos");
    const [lane, setLane] = useState("Todos");

    const roles = [
        "Todos", "Tank", "Fighter", "Assassin",
        "Mage", "Marksman", "Support"
    ];

    const lanes = [
        "Todos", "Gold", "Jungle", "Mid", "Exp", "Roam"
    ];

    const hasActiveFilters = search !== "" || role !== "Todos" || lane !== "Todos";

    const filteredHeroes = heroes.filter((hero) => {
        const matchesSearch = hero.name
            .toLowerCase()
            .includes(search.toLowerCase());

        const matchesRole =
            role === "Todos" || hero.roles?.includes(role);

        const matchesLane =
            lane === "Todos" || hero.lanes?.includes(lane);

        return matchesSearch && matchesRole && matchesLane;
    });

    const resetFilters = () => {
        setSearch("");
        setRole("Todos");
        setLane("Todos");
    };

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-slate-100">
            
            {/* Encabezado */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 border-b border-slate-800 pb-6">
                <div>
                    <span className="inline-block text-xs font-bold tracking-widest uppercase text-amber-400 bg-amber-400/10 border border-amber-400/20 px-3 py-1 rounded-full mb-3">
                        HEROES DATABASE
                    </span>
                    <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                        Explora los héroes
                    </h2>
                    <p className="text-slate-400 mt-1 text-sm md:text-base">
                        Filtra por rol o línea para encontrar tu próximo héroe favorito.
                    </p>
                </div>

                <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-4 py-2 rounded-xl self-start md:self-auto">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-sm font-semibold text-slate-200">
                        {filteredHeroes.length} <span className="text-slate-400 font-normal">héroes disponibles</span>
                    </span>
                </div>
            </div>

            {/* Panel de Búsqueda y Filtros */}
            <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800/80 p-4 rounded-2xl shadow-xl mb-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    
                    {/* Input Buscador */}
                    <div className="relative md:col-span-5">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar héroe por nombre..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-11 pr-10 py-2.5 bg-slate-950/90 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                        />
                        {search && (
                            <button
                                onClick={() => setSearch("")}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
                                title="Borrar búsqueda"
                            >
                                ✕
                            </button>
                        )}
                    </div>

                    {/* Selector de Rol */}
                    <div className="md:col-span-3">
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full px-4 py-2.5 bg-slate-950/90 border border-slate-700/80 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all cursor-pointer"
                        >
                            {roles.map((item) => (
                                <option key={item} value={item} className="bg-slate-900 text-white">
                                    {item === "Todos" ? "🛡️ Todos los roles" : item}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Selector de Línea */}
                    <div className="md:col-span-2">
                        <select
                            value={lane}
                            onChange={(e) => setLane(e.target.value)}
                            className="w-full px-4 py-2.5 bg-slate-950/90 border border-slate-700/80 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all cursor-pointer"
                        >
                            {lanes.map((item) => (
                                <option key={item} value={item} className="bg-slate-900 text-white">
                                    {item === "Todos" ? "🗺️ Todas las líneas" : item}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Botón Limpiar Filtros */}
                    <div className="md:col-span-2">
                        <button
                            onClick={resetFilters}
                            disabled={!hasActiveFilters}
                            className={`w-full py-2.5 px-4 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                                hasActiveFilters
                                    ? "bg-rose-500/15 text-rose-400 border border-rose-500/30 hover:bg-rose-500 hover:text-white cursor-pointer"
                                    : "bg-slate-800/40 text-slate-600 border border-slate-800 cursor-not-allowed"
                            }`}
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Limpiar
                        </button>
                    </div>

                </div>
            </div>

            {/* Cuadrícula de Héroes */}
            {filteredHeroes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {filteredHeroes.map((hero) => (
                        <article 
                            key={hero.slug} 
                            className="group relative flex flex-col justify-between bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-amber-400/60 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300 h-full"
                        >
                            <div className="space-y-3">
                                <div>
                                    <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                                        {hero.name}
                                    </h3>
                                    {hero.title && (
                                        <p className="text-xs text-slate-400 italic">
                                            {hero.title}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
                                    {hero.roles?.length > 0 && (
                                        <p>
                                            <strong className="text-slate-400 font-medium">Rol:</strong>{" "}
                                            <span className="text-amber-300 font-semibold">{hero.roles.join(", ")}</span>
                                        </p>
                                    )}

                                    {hero.lanes?.length > 0 && (
                                        <p>
                                            <strong className="text-slate-400 font-medium">Línea:</strong>{" "}
                                            <span className="text-slate-200">{hero.lanes.join(", ")}</span>
                                        </p>
                                    )}

                                    {hero.specialties?.length > 0 && (
                                        <p>
                                            <strong className="text-slate-400 font-medium">Especialidad:</strong>{" "}
                                            <span className="text-slate-400">{hero.specialties.join(", ")}</span>
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                                <Link 
                                    href={`/heroes/${hero.slug}`}
                                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 group-hover:text-amber-300 transition-colors w-full justify-between"
                                >
                                    <span>Ver detalles</span>
                                    <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center text-center py-20 px-4 bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl">
                    <h3 className="text-xl font-bold text-white mb-1">No se encontraron héroes</h3>
                    <p className="text-slate-400 text-sm max-w-md mb-6">
                        No hay coincidencias para tu búsqueda actual. Prueba con otro nombre o restablece los filtros.
                    </p>
                    <button
                        onClick={resetFilters}
                        className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm rounded-xl transition-colors"
                    >
                        Mostrar todos los héroes
                    </button>
                </div>
            )}

        </section>
    );
}