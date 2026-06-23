"use client";

import { useState } from "react";
import { Modal } from "./modal";
import { PatientForm, TherapistForm, AppointmentForm } from "./forms";

export function CreatePatientButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
      >
        + Nuevo Paciente
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="Nuevo Paciente">
        <PatientForm onSuccess={() => setOpen(false)} />
      </Modal>
    </>
  );
}

export function CreateTherapistButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
      >
        + Nuevo Terapeuta
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="Nuevo Terapeuta">
        <TherapistForm onSuccess={() => setOpen(false)} />
      </Modal>
    </>
  );
}

export function CreateAppointmentButton({
  patients,
  therapists,
}: {
  patients: { id: string; name: string }[];
  therapists: { id: string; name: string; color: string }[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
      >
        + Nueva Cita
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="Nueva Cita">
        <AppointmentForm
          patients={patients}
          therapists={therapists}
          onSuccess={() => setOpen(false)}
        />
      </Modal>
    </>
  );
}
