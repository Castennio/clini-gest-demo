"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

// ponytail: búsqueda client-side, sin debounce ni server search

type Patient = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  status: string;
  _count: { appointments: number };
  appointments: { therapist: { name: string } }[];
};

export function PatientSearch({ patients }: { patients: Patient[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return patients;
    const q = query.toLowerCase();
    return patients.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.phone.includes(q) ||
        p.email?.toLowerCase().includes(q)
    );
  }, [patients, query]);

  return (
    <>
      {/* Buscador */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nombre, teléfono o email..."
          className="w-full pl-12 pr-4 py-3 bg-white border-2 border-zinc-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-zinc-900 placeholder:text-zinc-400"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-400 hover:text-zinc-600"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Resultados */}
      {query && (
        <p className="text-sm text-zinc-500 mb-4">
          {filtered.length} resultado{filtered.length !== 1 ? "s" : ""} para "{query}"
        </p>
      )}

      {/* Tabla */}
      <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-zinc-50 border-b border-zinc-200">
              <th className="text-left text-xs font-medium text-zinc-500 uppercase tracking-wider px-6 py-3">
                Paciente
              </th>
              <th className="text-left text-xs font-medium text-zinc-500 uppercase tracking-wider px-6 py-3">
                Teléfono
              </th>
              <th className="text-left text-xs font-medium text-zinc-500 uppercase tracking-wider px-6 py-3">
                Último Terapeuta
              </th>
              <th className="text-left text-xs font-medium text-zinc-500 uppercase tracking-wider px-6 py-3">
                Sesiones
              </th>
              <th className="text-left text-xs font-medium text-zinc-500 uppercase tracking-wider px-6 py-3">
                Estado
              </th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                  No se encontraron pacientes
                </td>
              </tr>
            ) : (
              filtered.map((patient) => (
                <tr key={patient.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-medium text-sm">
                        {patient.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                      </div>
                      <div>
                        <p className="font-medium text-zinc-900">
                          <Highlight text={patient.name} query={query} />
                        </p>
                        <p className="text-sm text-zinc-500">
                          <Highlight text={patient.email || ""} query={query} />
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-600">
                    <Highlight text={patient.phone} query={query} />
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-600">
                    {patient.appointments[0]?.therapist.name ?? "—"}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-zinc-900">{patient._count.appointments}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        patient.status === "ACTIVE"
                          ? "bg-green-100 text-green-700"
                          : patient.status === "INACTIVE"
                          ? "bg-zinc-100 text-zinc-600"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {patient.status === "ACTIVE" ? "Activo" : patient.status === "INACTIVE" ? "Inactivo" : "Alta"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/pacientes/${patient.id}`}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Ver perfil
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

// Resalta el texto que coincide con la búsqueda
function Highlight({ text, query }: { text: string; query: string }) {
  if (!query.trim() || !text) return <>{text}</>;

  const parts = text.split(new RegExp(`(${query})`, "gi"));

  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={i} className="bg-yellow-200 text-yellow-900 rounded px-0.5">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}
