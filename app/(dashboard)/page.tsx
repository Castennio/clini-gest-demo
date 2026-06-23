import React from "react";
import { db } from "@/app/lib/db";
import Link from "next/link";

// ponytail: forzar renderizado dinámico, no pre-render en build
export const dynamic = "force-dynamic";

// ponytail: queries directas, sin abstracción de "services"
async function getStats() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [
    activePatients,
    todayAppointments,
    pendingSessions,
    therapistWorkloads,
  ] = await Promise.all([
    db.patient.count({ where: { status: "ACTIVE" } }),
    db.appointment.findMany({
      where: { dateTime: { gte: today, lt: tomorrow } },
      include: { patient: true, therapist: true },
      orderBy: { dateTime: "asc" },
    }),
    db.appointment.count({
      where: { status: { in: ["SCHEDULED", "CONFIRMED"] }, dateTime: { gte: today } },
    }),
    db.therapist.findMany({
      include: {
        _count: {
          select: {
            appointments: {
              where: { dateTime: { gte: today, lt: tomorrow } },
            },
          },
        },
      },
    }),
  ]);

  return { activePatients, todayAppointments, pendingSessions, therapistWorkloads };
}

export default async function DashboardPage() {
  const { activePatients, todayAppointments, pendingSessions, therapistWorkloads } = await getStats();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900">Dashboard</h1>
        <p className="text-zinc-500 mt-1">
          {new Date().toLocaleDateString("es-MX", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Pacientes Activos"
          value={activePatients}
          icon="users"
          color="blue"
        />
        <StatCard
          title="Citas de Hoy"
          value={todayAppointments.length}
          icon="calendar"
          color="green"
        />
        <StatCard
          title="Sesiones Pendientes"
          value={pendingSessions}
          icon="clock"
          color="amber"
        />
        <StatCard
          title="Terapeutas"
          value={therapistWorkloads.length}
          icon="user-group"
          color="purple"
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Citas de Hoy */}
        <div className="bg-white rounded-xl border border-zinc-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-zinc-900">Citas de Hoy</h2>
            <Link href="/agenda" className="text-sm text-blue-600 hover:text-blue-700">
              Ver agenda
            </Link>
          </div>
          <div className="space-y-3">
            {todayAppointments.length === 0 ? (
              <p className="text-zinc-500 text-sm py-4 text-center">No hay citas programadas para hoy</p>
            ) : (
              todayAppointments.slice(0, 6).map((apt) => (
                <div key={apt.id} className="flex items-center gap-4 p-3 bg-zinc-50 rounded-lg">
                  <div className="text-center min-w-[60px]">
                    <p className="text-lg font-semibold text-zinc-900">
                      {apt.dateTime.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-zinc-900">{apt.patient.name}</p>
                    <p className="text-sm text-zinc-500">{apt.therapist.name}</p>
                  </div>
                  <StatusBadge status={apt.status} />
                </div>
              ))
            )}
            {todayAppointments.length > 6 && (
              <p className="text-sm text-zinc-500 text-center pt-2">
                +{todayAppointments.length - 6} citas más
              </p>
            )}
          </div>
        </div>

        {/* Carga por Terapeuta */}
        <div className="bg-white rounded-xl border border-zinc-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-zinc-900">Carga de Hoy por Terapeuta</h2>
            <Link href="/terapeutas" className="text-sm text-blue-600 hover:text-blue-700">
              Ver todos
            </Link>
          </div>
          <div className="space-y-3">
            {therapistWorkloads
              .sort((a, b) => b._count.appointments - a._count.appointments)
              .slice(0, 8)
              .map((t) => (
                <div key={t.id} className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: t.color }}
                  />
                  <span className="flex-1 text-sm text-zinc-700">{t.name}</span>
                  <span className="text-sm font-medium text-zinc-900">
                    {t._count.appointments} citas
                  </span>
                  <div className="w-24 h-2 bg-zinc-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.min((t._count.appointments / 8) * 100, 100)}%`,
                        backgroundColor: t.color,
                      }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number;
  icon: string;
  color: "blue" | "green" | "amber" | "purple";
}) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    amber: "bg-amber-50 text-amber-600",
    purple: "bg-purple-50 text-purple-600",
  };

  const icons: Record<string, React.ReactNode> = {
    users: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    calendar: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    clock: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    "user-group": (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  };

  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-zinc-500">{title}</p>
          <p className="text-3xl font-bold text-zinc-900 mt-1">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colors[color]}`}>
          {icons[icon]}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    SCHEDULED: "bg-zinc-100 text-zinc-600",
    CONFIRMED: "bg-blue-100 text-blue-700",
    COMPLETED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
    NO_SHOW: "bg-amber-100 text-amber-700",
  };

  const labels: Record<string, string> = {
    SCHEDULED: "Programada",
    CONFIRMED: "Confirmada",
    COMPLETED: "Completada",
    CANCELLED: "Cancelada",
    NO_SHOW: "No asistió",
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}
