"use client";

import { useState } from "react";

// ponytail: tooltip con hover, sin librerías

export function AppointmentCard({
  appointment,
}: {
  appointment: {
    id: string;
    status: string;
    patient: { name: string; phone: string };
    therapist: { name: string; specialty: string; color: string };
    dateTime: Date;
  };
}) {
  const [showTooltip, setShowTooltip] = useState(false);

  const statusLabels: Record<string, string> = {
    SCHEDULED: "Programada",
    CONFIRMED: "Confirmada",
    COMPLETED: "Completada",
    CANCELLED: "Cancelada",
    NO_SHOW: "No asistió",
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div
        className="text-xs p-1.5 rounded mb-1 text-white truncate cursor-pointer hover:scale-105 hover:shadow-lg transition-all duration-200"
        style={{ backgroundColor: appointment.therapist.color }}
      >
        <p className="font-medium truncate">{appointment.patient.name.split(" ")[0]}</p>
        <p className="opacity-80 truncate text-[10px]">{appointment.therapist.name.split(" ").slice(-1)[0]}</p>
      </div>

      {/* Tooltip mejorado */}
      {showTooltip && (
        <div className="absolute z-50 left-full ml-2 top-0 w-64 animate-in fade-in slide-in-from-left-2 duration-200">
          <div className="bg-white rounded-xl shadow-2xl border border-zinc-200 overflow-hidden">
            {/* Header con color del terapeuta */}
            <div
              className="px-4 py-3 text-white"
              style={{ backgroundColor: appointment.therapist.color }}
            >
              <p className="font-semibold">{appointment.patient.name}</p>
              <p className="text-sm opacity-90">{appointment.patient.phone}</p>
            </div>

            {/* Contenido */}
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                  style={{ backgroundColor: appointment.therapist.color }}
                >
                  {appointment.therapist.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                </div>
                <div>
                  <p className="font-medium text-zinc-900 text-sm">{appointment.therapist.name}</p>
                  <p className="text-xs text-zinc-500">{appointment.therapist.specialty}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-zinc-100">
                <div className="flex items-center gap-2 text-sm text-zinc-600">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {new Date(appointment.dateTime).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  appointment.status === "CONFIRMED" ? "bg-blue-100 text-blue-700" :
                  appointment.status === "COMPLETED" ? "bg-green-100 text-green-700" :
                  appointment.status === "CANCELLED" ? "bg-red-100 text-red-700" :
                  appointment.status === "NO_SHOW" ? "bg-amber-100 text-amber-700" :
                  "bg-zinc-100 text-zinc-600"
                }`}>
                  {statusLabels[appointment.status]}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function TherapistFilter({
  therapists,
}: {
  therapists: { id: string; name: string; color: string }[];
}) {
  const [selected, setSelected] = useState<string>("");
  const [open, setOpen] = useState(false);

  const selectedTherapist = therapists.find(t => t.id === selected);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 px-4 py-2.5 bg-white border-2 border-zinc-200 rounded-xl hover:border-blue-300 transition-colors min-w-[220px]"
      >
        {selectedTherapist ? (
          <>
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: selectedTherapist.color }}
            />
            <span className="text-sm font-medium text-zinc-900 flex-1 text-left truncate">
              {selectedTherapist.name}
            </span>
          </>
        ) : (
          <>
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400" />
            <span className="text-sm font-medium text-zinc-600 flex-1 text-left">
              Todos los terapeutas
            </span>
          </>
        )}
        <svg className={`w-4 h-4 text-zinc-400 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full mt-2 left-0 w-72 bg-white rounded-xl shadow-2xl border border-zinc-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <button
            onClick={() => { setSelected(""); setOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-zinc-50 transition-colors ${!selected ? "bg-blue-50" : ""}`}
          >
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400" />
            <span className="text-sm font-medium text-zinc-700">Todos los terapeutas</span>
            {!selected && (
              <svg className="w-4 h-4 ml-auto text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
          <div className="h-px bg-zinc-100 my-1" />
          {therapists.map((t) => (
            <button
              key={t.id}
              onClick={() => { setSelected(t.id); setOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-zinc-50 transition-colors ${selected === t.id ? "bg-blue-50" : ""}`}
            >
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: t.color }}
              />
              <span className="text-sm font-medium text-zinc-700 truncate">{t.name}</span>
              {selected === t.id && (
                <svg className="w-4 h-4 ml-auto text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
