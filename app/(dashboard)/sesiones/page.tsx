import { db } from "@/app/lib/db";
import Link from "next/link";
import { SessionActionButtons } from "@/app/components/session-actions";

async function getSessions() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [todayAppointments, upcomingAppointments, recentCompleted] = await Promise.all([
    db.appointment.findMany({
      where: {
        dateTime: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        },
        status: { in: ["SCHEDULED", "CONFIRMED"] },
      },
      include: { patient: true, therapist: true, session: true },
      orderBy: { dateTime: "asc" },
    }),
    db.appointment.findMany({
      where: {
        dateTime: { gt: new Date(today.getTime() + 24 * 60 * 60 * 1000) },
        status: { in: ["SCHEDULED", "CONFIRMED"] },
      },
      include: { patient: true, therapist: true },
      orderBy: { dateTime: "asc" },
      take: 10,
    }),
    db.appointment.findMany({
      where: { status: "COMPLETED" },
      include: { patient: true, therapist: true, session: true },
      orderBy: { dateTime: "desc" },
      take: 10,
    }),
  ]);

  return { todayAppointments, upcomingAppointments, recentCompleted };
}

export default async function SesionesPage() {
  const { todayAppointments, upcomingAppointments, recentCompleted } = await getSessions();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900">Control de Sesiones</h1>
        <p className="text-zinc-500 mt-1">Gestiona el estado de las sesiones del día</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Sesiones de Hoy */}
        <div className="col-span-2">
          <div className="bg-white rounded-xl border border-zinc-200 p-6">
            <h2 className="font-semibold text-zinc-900 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              Sesiones de Hoy
              <span className="ml-auto text-sm font-normal text-zinc-500">
                {todayAppointments.length} pendientes
              </span>
            </h2>
            {todayAppointments.length === 0 ? (
              <p className="text-zinc-500 text-center py-8">No hay sesiones pendientes para hoy</p>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {todayAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="flex items-center gap-4 p-4 border border-zinc-200 rounded-lg hover:border-zinc-300 transition-colors"
                  >
                    <div className="text-center min-w-[60px]">
                      <p className="text-xl font-bold text-zinc-900">
                        {apt.dateTime.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-zinc-900 truncate">{apt.patient.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: apt.therapist.color }}
                        />
                        <p className="text-sm text-zinc-500 truncate">{apt.therapist.name}</p>
                      </div>
                    </div>
                    <SessionActionButtons appointmentId={apt.id} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Próximas Sesiones */}
        <div>
          <div className="bg-white rounded-xl border border-zinc-200 p-6">
            <h2 className="font-semibold text-zinc-900 mb-4">Próximas Sesiones</h2>
            <div className="space-y-3">
              {upcomingAppointments.map((apt) => (
                <div key={apt.id} className="flex items-center gap-3 p-3 bg-zinc-50 rounded-lg">
                  <div className="text-center min-w-[50px]">
                    <p className="text-sm font-semibold text-zinc-900">
                      {apt.dateTime.toLocaleDateString("es-MX", { day: "numeric", month: "short" })}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {apt.dateTime.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-900 truncate">{apt.patient.name}</p>
                    <p className="text-xs text-zinc-500 truncate">{apt.therapist.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sesiones Recientes Completadas */}
        <div>
          <div className="bg-white rounded-xl border border-zinc-200 p-6">
            <h2 className="font-semibold text-zinc-900 mb-4">Completadas Recientemente</h2>
            <div className="space-y-3">
              {recentCompleted.map((apt) => (
                <div key={apt.id} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-900 truncate">{apt.patient.name}</p>
                    <p className="text-xs text-zinc-500">
                      {apt.dateTime.toLocaleDateString("es-MX", { weekday: "short", day: "numeric", month: "short" })}
                    </p>
                  </div>
                  <Link
                    href={`/pacientes/${apt.patient.id}`}
                    className="text-xs text-blue-600 hover:text-blue-700"
                  >
                    Ver
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
