import { db } from "@/app/lib/db";
import { WhatsAppButton } from "@/app/components/whatsapp-button";
import Link from "next/link";
import { notFound } from "next/navigation";

async function getPatient(id: string) {
  const patient = await db.patient.findUnique({
    where: { id },
    include: {
      appointments: {
        include: { therapist: true, session: true },
        orderBy: { dateTime: "desc" },
      },
    },
  });
  if (!patient) notFound();
  return patient;
}

export default async function PatientPage(props: PageProps<"/pacientes/[id]">) {
  const { id } = await props.params;
  const patient = await getPatient(id);

  const completedSessions = patient.appointments.filter((a) => a.session?.completed).length;
  const upcomingAppointments = patient.appointments.filter((a) => a.dateTime > new Date());
  const nextAppointment = upcomingAppointments[0];

  return (
    <div className="p-8">
      <Link href="/pacientes" className="text-sm text-zinc-500 hover:text-zinc-700 flex items-center gap-1 mb-4">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Volver a pacientes
      </Link>

      <div className="grid grid-cols-3 gap-6">
        {/* Perfil */}
        <div className="col-span-1">
          <div className="bg-white rounded-xl border border-zinc-200 p-6">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-2xl mb-4">
                {patient.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
              </div>
              <h1 className="text-xl font-bold text-zinc-900">{patient.name}</h1>
              <span
                className={`mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                  patient.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-zinc-100 text-zinc-600"
                }`}
              >
                {patient.status === "ACTIVE" ? "Activo" : "Inactivo"}
              </span>
            </div>

            <div className="space-y-4 border-t border-zinc-100 pt-4">
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider">Teléfono</p>
                <p className="text-sm font-medium text-zinc-900 mt-1">{patient.phone}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider">Email</p>
                <p className="text-sm font-medium text-zinc-900 mt-1">{patient.email ?? "—"}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider">Paciente desde</p>
                <p className="text-sm font-medium text-zinc-900 mt-1">
                  {patient.createdAt.toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" })}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-zinc-100 pt-4 mt-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-zinc-900">{completedSessions}</p>
                <p className="text-xs text-zinc-500">Sesiones</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-zinc-900">{upcomingAppointments.length}</p>
                <p className="text-xs text-zinc-500">Próximas</p>
              </div>
            </div>

            {nextAppointment && (
              <WhatsAppButton
                patientName={patient.name}
                phone={patient.phone}
                appointment={{
                  dateTime: nextAppointment.dateTime,
                  therapistName: nextAppointment.therapist.name,
                }}
              />
            )}
          </div>
        </div>

        {/* Historial */}
        <div className="col-span-2">
          <div className="bg-white rounded-xl border border-zinc-200 p-6">
            <h2 className="font-semibold text-zinc-900 mb-4">Historial de Sesiones</h2>
            <div className="space-y-4">
              {patient.appointments.length === 0 ? (
                <p className="text-zinc-500 text-center py-8">No hay citas registradas</p>
              ) : (
                patient.appointments.map((apt) => (
                  <div key={apt.id} className="flex items-start gap-4 p-4 bg-zinc-50 rounded-lg">
                    <div className="w-12 text-center">
                      <p className="text-lg font-bold text-zinc-900">{apt.dateTime.getDate()}</p>
                      <p className="text-xs text-zinc-500 uppercase">
                        {apt.dateTime.toLocaleDateString("es-MX", { month: "short" })}
                      </p>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-zinc-900">
                          {apt.dateTime.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                        <span className="text-zinc-300">•</span>
                        <p className="text-sm text-zinc-600">{apt.therapist.name}</p>
                      </div>
                      <p className="text-sm text-zinc-500 mt-1">{apt.therapist.specialty}</p>
                      {apt.session?.notes && (
                        <p className="text-sm text-zinc-600 mt-2 bg-white p-2 rounded border border-zinc-200">
                          {apt.session.notes}
                        </p>
                      )}
                    </div>
                    <StatusBadge status={apt.status} />
                  </div>
                ))
              )}
            </div>
          </div>
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
