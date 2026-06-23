import { db } from "@/app/lib/db";
import { CreateAppointmentButton } from "@/app/components/create-buttons";
import { AgendaCalendar } from "@/app/components/agenda-calendar";

async function getWeekData() {
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - today.getDay() + 1);
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 7);

  const [appointments, therapists, patients] = await Promise.all([
    db.appointment.findMany({
      where: { dateTime: { gte: monday, lt: sunday } },
      include: { patient: true, therapist: true },
      orderBy: { dateTime: "asc" },
    }),
    db.therapist.findMany({ orderBy: { name: "asc" } }),
    db.patient.findMany({
      where: { status: "ACTIVE" },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.toISOString();
  });

  return { appointments, therapists, patients, days, today: today.toISOString() };
}

export default async function AgendaPage() {
  const { appointments, therapists, patients, days, today } = await getWeekData();

  // Serializar para client components
  const serializedAppointments = appointments.map((apt) => ({
    id: apt.id,
    status: apt.status,
    dateTime: apt.dateTime.toISOString(),
    therapistId: apt.therapistId,
    patient: { name: apt.patient.name, phone: apt.patient.phone },
    therapist: {
      id: apt.therapist.id,
      name: apt.therapist.name,
      specialty: apt.therapist.specialty,
      color: apt.therapist.color,
    },
  }));

  const todayDate = new Date(today);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Agenda Semanal</h1>
          <p className="text-zinc-500 mt-1">
            Semana del{" "}
            {new Date(days[0]).toLocaleDateString("es-MX", { day: "numeric", month: "long" })} al{" "}
            {new Date(days[6]).toLocaleDateString("es-MX", { day: "numeric", month: "long" })}
          </p>
        </div>
        <CreateAppointmentButton patients={patients} therapists={therapists} />
      </div>

      <AgendaCalendar
        appointments={serializedAppointments}
        therapists={therapists}
        days={days}
        todayStr={new Date(todayDate.toDateString()).toISOString()}
      />
    </div>
  );
}
