"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// ponytail: descripciones para usuarios no técnicos
const NAV_ITEMS = [
  {
    href: "/",
    icon: "home",
    label: "Dashboard",
    description: "Vista general del día: cuántos pacientes, citas pendientes y carga de trabajo de cada terapeuta.",
  },
  {
    href: "/pacientes",
    icon: "users",
    label: "Pacientes",
    description: "Listado completo de pacientes. Ver perfil, historial de sesiones y enviar recordatorios.",
  },
  {
    href: "/agenda",
    icon: "calendar",
    label: "Agenda",
    description: "Calendario semanal con todas las citas. Ver disponibilidad y evitar cruces de horarios.",
  },
  {
    href: "/sesiones",
    icon: "clipboard",
    label: "Sesiones",
    description: "Control de sesiones del día. Marcar como completadas o registrar inasistencias.",
  },
  {
    href: "/terapeutas",
    icon: "user-group",
    label: "Terapeutas",
    description: "Equipo de terapeutas con sus especialidades y métricas de carga semanal.",
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-zinc-50">
      <aside className="w-64 bg-white border-r border-zinc-200 flex flex-col">
        <div className="p-6 border-b border-zinc-200">
          <h1 className="text-xl font-bold text-zinc-900">CliniGest</h1>
          <p className="text-xs text-zinc-500 mt-1">Centro Terapéutico</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </nav>
        <div className="p-4 border-t border-zinc-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-sm font-medium text-blue-600">AD</span>
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-900">Admin</p>
              <p className="text-xs text-zinc-500">Recepción</p>
            </div>
          </div>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}

function NavLink({
  href,
  icon,
  label,
  description,
}: {
  href: string;
  icon: string;
  label: string;
  description: string;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  const icons: Record<string, React.ReactNode> = {
    home: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    users: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    calendar: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    clipboard: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
    "user-group": (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  };

  return (
    <Link
      href={href}
      className={`
        group relative flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg
        transition-all duration-300 ease-out
        ${isActive
          ? "bg-blue-50 text-blue-700 shadow-[0_0_20px_rgba(59,130,246,0.3)]"
          : "text-zinc-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 hover:shadow-[0_0_25px_rgba(99,102,241,0.25)]"
        }
      `}
    >
      {/* Glow effect on hover */}
      <span className={`
        absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300
        bg-gradient-to-r from-blue-400/10 via-indigo-400/10 to-purple-400/10
        ${isActive ? "opacity-100" : ""}
      `} />

      {/* Icon with pulse on hover */}
      <span className={`
        relative z-10 transition-transform duration-300
        group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]
        ${isActive ? "drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" : ""}
      `}>
        {icons[icon]}
      </span>

      {/* Label */}
      <span className="relative z-10">{label}</span>

      {/* Tooltip with description */}
      <div className={`
        absolute left-full ml-4 top-1/2 -translate-y-1/2 z-50
        w-64 p-3 rounded-xl
        bg-white border border-zinc-200
        shadow-[0_20px_50px_rgba(0,0,0,0.15)]
        opacity-0 invisible translate-x-2
        group-hover:opacity-100 group-hover:visible group-hover:translate-x-0
        transition-all duration-300 ease-out
        pointer-events-none
      `}>
        {/* Arrow */}
        <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0
          border-t-8 border-t-transparent
          border-r-8 border-r-white
          border-b-8 border-b-transparent
          drop-shadow-[-2px_0_2px_rgba(0,0,0,0.05)]
        " />

        {/* Tooltip content */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white flex-shrink-0 shadow-lg">
            {icons[icon]}
          </div>
          <div>
            <p className="font-semibold text-zinc-900 text-sm">{label}</p>
            <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{description}</p>
          </div>
        </div>

        {/* Subtle shine effect */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/50 via-transparent to-transparent pointer-events-none" />
      </div>
    </Link>
  );
}
