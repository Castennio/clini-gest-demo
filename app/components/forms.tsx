"use client";

import { useTransition } from "react";
import { createPatient, createTherapist, createAppointment } from "@/app/lib/actions";

// ponytail: formularios inline, sin react-hook-form ni zod

export function PatientForm({ onSuccess }: { onSuccess: () => void }) {
  const [isPending, startTransition] = useTransition();

  return (
    <form
      action={(formData) => {
        startTransition(async () => {
          await createPatient(formData);
          onSuccess();
        });
      }}
      className="space-y-4"
    >
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1">
          Nombre completo *
        </label>
        <input
          name="name"
          required
          placeholder="Ej: María García López"
          className="w-full px-4 py-2.5 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1">
          Teléfono *
        </label>
        <input
          name="phone"
          required
          placeholder="Ej: +52 555 123 4567"
          className="w-full px-4 py-2.5 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1">
          Email
        </label>
        <input
          name="email"
          type="email"
          placeholder="Ej: maria@email.com"
          className="w-full px-4 py-2.5 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        />
      </div>
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium"
        >
          {isPending ? "Guardando..." : "Crear Paciente"}
        </button>
      </div>
    </form>
  );
}

export function TherapistForm({ onSuccess }: { onSuccess: () => void }) {
  const [isPending, startTransition] = useTransition();

  const colors = [
    "#3B82F6", "#10B981", "#8B5CF6", "#F59E0B", "#EF4444",
    "#EC4899", "#06B6D4", "#84CC16", "#F97316", "#6366F1",
  ];

  return (
    <form
      action={(formData) => {
        startTransition(async () => {
          await createTherapist(formData);
          onSuccess();
        });
      }}
      className="space-y-4"
    >
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1">
          Nombre completo *
        </label>
        <input
          name="name"
          required
          placeholder="Ej: Dra. Ana Martínez"
          className="w-full px-4 py-2.5 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1">
          Especialidad *
        </label>
        <select
          name="specialty"
          required
          className="w-full px-4 py-2.5 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        >
          <option value="">Seleccionar especialidad</option>
          <option value="Psicología Clínica">Psicología Clínica</option>
          <option value="Terapia Familiar">Terapia Familiar</option>
          <option value="Neuropsicología">Neuropsicología</option>
          <option value="Psicología Infantil">Psicología Infantil</option>
          <option value="Terapia Cognitiva">Terapia Cognitiva</option>
          <option value="Terapia de Pareja">Terapia de Pareja</option>
          <option value="Terapia Ocupacional">Terapia Ocupacional</option>
          <option value="Psicología del Deporte">Psicología del Deporte</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-2">
          Color en agenda *
        </label>
        <div className="flex gap-2 flex-wrap">
          {colors.map((color) => (
            <label key={color} className="cursor-pointer">
              <input
                type="radio"
                name="color"
                value={color}
                required
                className="sr-only peer"
              />
              <div
                className="w-8 h-8 rounded-full ring-2 ring-transparent peer-checked:ring-zinc-900 peer-checked:ring-offset-2 transition-all"
                style={{ backgroundColor: color }}
              />
            </label>
          ))}
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium"
        >
          {isPending ? "Guardando..." : "Crear Terapeuta"}
        </button>
      </div>
    </form>
  );
}

export function AppointmentForm({
  patients,
  therapists,
  onSuccess,
}: {
  patients: { id: string; name: string }[];
  therapists: { id: string; name: string; color: string }[];
  onSuccess: () => void;
}) {
  const [isPending, startTransition] = useTransition();

  // Default to tomorrow at 10:00
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDate = tomorrow.toISOString().split("T")[0];

  return (
    <form
      action={(formData) => {
        startTransition(async () => {
          await createAppointment(formData);
          onSuccess();
        });
      }}
      className="space-y-4"
    >
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1">
          Paciente *
        </label>
        <select
          name="patientId"
          required
          className="w-full px-4 py-2.5 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        >
          <option value="">Seleccionar paciente</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1">
          Terapeuta *
        </label>
        <select
          name="therapistId"
          required
          className="w-full px-4 py-2.5 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        >
          <option value="">Seleccionar terapeuta</option>
          {therapists.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">
            Fecha *
          </label>
          <input
            name="date"
            type="date"
            required
            defaultValue={defaultDate}
            className="w-full px-4 py-2.5 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">
            Hora *
          </label>
          <select
            name="time"
            required
            defaultValue="10:00"
            className="w-full px-4 py-2.5 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            {[9, 10, 11, 12, 14, 15, 16, 17, 18].map((h) => (
              <option key={h} value={`${h.toString().padStart(2, "0")}:00`}>
                {h}:00
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium"
        >
          {isPending ? "Guardando..." : "Crear Cita"}
        </button>
      </div>
    </form>
  );
}
