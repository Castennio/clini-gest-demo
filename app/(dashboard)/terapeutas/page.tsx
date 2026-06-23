import { db } from "@/app/lib/db";
import { CreateTherapistButton } from "@/app/components/create-buttons";

export const dynamic = "force-dynamic";

async function getTherapists() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  return db.therapist.findMany({
    include: {
      _count: {
        select: { appointments: true },
      },
      appointments: {
        where: { dateTime: { gte: weekAgo } },
        include: { session: true },
      },
    },
    orderBy: { name: "asc" },
  });
}

export default async function TerapeutasPage() {
  const therapists = await getTherapists();

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Terapeutas</h1>
          <p className="text-zinc-500 mt-1">{therapists.length} terapeutas activos</p>
        </div>
        <CreateTherapistButton />
      </div>

      <div className="grid grid-cols-3 gap-6">
        {therapists.map((therapist) => {
          const weekSessions = therapist.appointments.filter((a) => a.session?.completed).length;
          const weekAppointments = therapist.appointments.length;
          const completionRate = weekAppointments > 0 ? Math.round((weekSessions / weekAppointments) * 100) : 0;

          return (
            <div
              key={therapist.id}
              className="bg-white rounded-xl border border-zinc-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4 mb-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                  style={{ backgroundColor: therapist.color }}
                >
                  {therapist.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-zinc-900 truncate">{therapist.name}</h3>
                  <p className="text-sm text-zinc-500">{therapist.specialty}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-zinc-100">
                <div className="text-center">
                  <p className="text-xl font-bold text-zinc-900">{therapist._count.appointments}</p>
                  <p className="text-xs text-zinc-500">Total Citas</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-zinc-900">{weekSessions}</p>
                  <p className="text-xs text-zinc-500">Esta Semana</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-green-600">{completionRate}%</p>
                  <p className="text-xs text-zinc-500">Asistencia</p>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-zinc-500 mb-1">
                  <span>Carga semanal</span>
                  <span>{weekAppointments}/40</span>
                </div>
                <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min((weekAppointments / 40) * 100, 100)}%`,
                      backgroundColor: therapist.color,
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
