"use client";

import { useState, useMemo } from "react";

// ponytail: calendario con filtro integrado

type Appointment = {
  id: string;
  status: string;
  dateTime: string;
  therapistId: string;
  patient: { name: string; phone: string };
  therapist: { id: string; name: string; specialty: string; color: string };
};

type Therapist = { id: string; name: string; color: string };

export function AgendaCalendar({
  appointments,
  therapists,
  days,
  todayStr,
}: {
  appointments: Appointment[];
  therapists: Therapist[];
  days: string[];
  todayStr: string;
}) {
  const [selectedTherapist, setSelectedTherapist] = useState<string>("");
  const [filterOpen, setFilterOpen] = useState(false);

  const hours = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

  // Filtrar citas por terapeuta seleccionado
  const filteredAppointments = useMemo(() => {
    if (!selectedTherapist) return appointments;
    return appointments.filter((apt) => apt.therapistId === selectedTherapist);
  }, [appointments, selectedTherapist]);

  const selectedTherapistData = therapists.find((t) => t.id === selectedTherapist);

  return (
    <>
      {/* Filtro de terapeutas */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative">
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="flex items-center gap-3 px-4 py-2.5 bg-white border-2 border-zinc-200 rounded-xl hover:border-blue-300 transition-colors min-w-[240px]"
          >
            {selectedTherapistData ? (
              <>
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: selectedTherapistData.color }}
                />
                <span className="text-sm font-medium text-zinc-900 flex-1 text-left truncate">
                  {selectedTherapistData.name}
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
            <svg
              className={`w-4 h-4 text-zinc-400 transition-transform ${filterOpen ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {filterOpen && (
            <div className="absolute top-full mt-2 left-0 w-80 bg-white rounded-xl shadow-2xl border border-zinc-200 py-2 z-50 max-h-96 overflow-auto">
              <button
                onClick={() => {
                  setSelectedTherapist("");
                  setFilterOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-zinc-50 transition-colors ${!selectedTherapist ? "bg-blue-50" : ""}`}
              >
                <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400" />
                <span className="text-sm font-medium text-zinc-700">Todos los terapeutas</span>
                <span className="ml-auto text-xs text-zinc-400">{appointments.length} citas</span>
                {!selectedTherapist && (
                  <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
              <div className="h-px bg-zinc-100 my-1" />
              {therapists.map((t) => {
                const count = appointments.filter((a) => a.therapistId === t.id).length;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      setSelectedTherapist(t.id);
                      setFilterOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-zinc-50 transition-colors ${selectedTherapist === t.id ? "bg-blue-50" : ""}`}
                  >
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: t.color }} />
                    <span className="text-sm font-medium text-zinc-700 truncate">{t.name}</span>
                    <span className="ml-auto text-xs text-zinc-400">{count} citas</span>
                    {selectedTherapist === t.id && (
                      <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {selectedTherapist && (
          <button
            onClick={() => setSelectedTherapist("")}
            className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Limpiar filtro
          </button>
        )}

        <span className="text-sm text-zinc-500 ml-auto">
          {filteredAppointments.length} citas esta semana
        </span>
      </div>

      {/* Leyenda de terapeutas */}
      <div className="flex flex-wrap gap-4 mb-4 p-4 bg-white rounded-xl border border-zinc-200">
        <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Terapeutas:</span>
        {therapists.map((t) => (
          <button
            key={t.id}
            onClick={() => setSelectedTherapist(selectedTherapist === t.id ? "" : t.id)}
            className={`flex items-center gap-2 px-2 py-1 rounded-lg transition-all ${
              selectedTherapist === t.id ? "bg-zinc-100 ring-2 ring-zinc-300" : "hover:bg-zinc-50"
            }`}
          >
            <div
              className="w-3 h-3 rounded-full ring-2 ring-white shadow-sm"
              style={{ backgroundColor: t.color }}
            />
            <span className="text-sm text-zinc-700">{t.name.split(" ").slice(-1)[0]}</span>
          </button>
        ))}
      </div>

      {/* Calendario */}
      <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
        <div className="grid grid-cols-8 border-b border-zinc-200">
          <div className="p-3 bg-zinc-50" />
          {days.map((dayStr, i) => {
            const day = new Date(dayStr);
            const isToday = dayStr === todayStr;
            return (
              <div
                key={i}
                className={`p-3 text-center border-l border-zinc-200 ${isToday ? "bg-blue-50" : "bg-zinc-50"}`}
              >
                <p className="text-xs text-zinc-500 uppercase">
                  {day.toLocaleDateString("es-MX", { weekday: "short" })}
                </p>
                <p className={`text-lg font-semibold ${isToday ? "text-blue-600" : "text-zinc-900"}`}>
                  {day.getDate()}
                </p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-8">
          {hours.map((hour) => (
            <div key={hour} className="contents">
              <div className="p-2 text-xs text-zinc-500 text-right pr-3 border-t border-zinc-100 bg-zinc-50">
                {hour}:00
              </div>
              {days.map((dayStr, dayIdx) => {
                const dayAppointments = filteredAppointments.filter((apt) => {
                  const aptDate = new Date(apt.dateTime);
                  return aptDate.toDateString() === new Date(dayStr).toDateString() && aptDate.getHours() === hour;
                });

                return (
                  <div
                    key={dayIdx}
                    className="p-1 border-l border-t border-zinc-100 min-h-[60px] hover:bg-zinc-50/50 transition-colors"
                  >
                    {dayAppointments.map((apt) => (
                      <AppointmentCard key={apt.id} appointment={apt} />
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function AppointmentCard({ appointment }: { appointment: Appointment }) {
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

      {showTooltip && (
        <div className="absolute z-50 left-full ml-2 top-0 w-64 pointer-events-none">
          <div className="bg-white rounded-xl shadow-2xl border border-zinc-200 overflow-hidden">
            <div className="px-4 py-3 text-white" style={{ backgroundColor: appointment.therapist.color }}>
              <p className="font-semibold">{appointment.patient.name}</p>
              <p className="text-sm opacity-90">{appointment.patient.phone}</p>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                  style={{ backgroundColor: appointment.therapist.color }}
                >
                  {appointment.therapist.name
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")}
                </div>
                <div>
                  <p className="font-medium text-zinc-900 text-sm">{appointment.therapist.name}</p>
                  <p className="text-xs text-zinc-500">{appointment.therapist.specialty}</p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-zinc-100">
                <div className="flex items-center gap-2 text-sm text-zinc-600">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {new Date(appointment.dateTime).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    appointment.status === "CONFIRMED"
                      ? "bg-blue-100 text-blue-700"
                      : appointment.status === "COMPLETED"
                      ? "bg-green-100 text-green-700"
                      : appointment.status === "CANCELLED"
                      ? "bg-red-100 text-red-700"
                      : appointment.status === "NO_SHOW"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-zinc-100 text-zinc-600"
                  }`}
                >
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
