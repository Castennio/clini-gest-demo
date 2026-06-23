import { db } from "@/app/lib/db";
import { CreatePatientButton } from "@/app/components/create-buttons";
import { PatientSearch } from "@/app/components/patient-search";

async function getPatients() {
  return db.patient.findMany({
    include: {
      _count: { select: { appointments: true } },
      appointments: {
        orderBy: { dateTime: "desc" },
        take: 1,
        include: { therapist: true },
      },
    },
    orderBy: { name: "asc" },
  });
}

export default async function PacientesPage() {
  const patients = await getPatients();

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Pacientes</h1>
          <p className="text-zinc-500 mt-1">{patients.length} pacientes registrados</p>
        </div>
        <CreatePatientButton />
      </div>

      <PatientSearch patients={patients} />
    </div>
  );
}
