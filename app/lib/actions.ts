"use server";

import { db } from "@/app/lib/db";
import { revalidatePath } from "next/cache";

// ponytail: server actions directas, sin capas de abstracción

export async function createPatient(formData: FormData) {
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const email = formData.get("email") as string;

  await db.patient.create({
    data: { name, phone, email: email || null },
  });

  revalidatePath("/pacientes");
  revalidatePath("/");
}

export async function createTherapist(formData: FormData) {
  const name = formData.get("name") as string;
  const specialty = formData.get("specialty") as string;
  const color = formData.get("color") as string;

  await db.therapist.create({
    data: { name, specialty, color },
  });

  revalidatePath("/terapeutas");
  revalidatePath("/");
}

export async function createAppointment(formData: FormData) {
  const patientId = formData.get("patientId") as string;
  const therapistId = formData.get("therapistId") as string;
  const date = formData.get("date") as string;
  const time = formData.get("time") as string;

  const dateTime = new Date(`${date}T${time}`);

  await db.appointment.create({
    data: {
      patientId,
      therapistId,
      dateTime,
      status: "SCHEDULED",
    },
  });

  revalidatePath("/agenda");
  revalidatePath("/sesiones");
  revalidatePath("/");
}

export async function markSessionComplete(appointmentId: string) {
  await db.$transaction([
    db.appointment.update({
      where: { id: appointmentId },
      data: { status: "COMPLETED" },
    }),
    db.session.upsert({
      where: { appointmentId },
      create: {
        appointmentId,
        completed: true,
        completedAt: new Date(),
      },
      update: {
        completed: true,
        completedAt: new Date(),
      },
    }),
  ]);

  revalidatePath("/sesiones");
  revalidatePath("/agenda");
  revalidatePath("/");
}

export async function markSessionNoShow(appointmentId: string) {
  await db.appointment.update({
    where: { id: appointmentId },
    data: { status: "NO_SHOW" },
  });

  revalidatePath("/sesiones");
  revalidatePath("/agenda");
  revalidatePath("/");
}

export async function getTherapistsForSelect() {
  return db.therapist.findMany({
    select: { id: true, name: true, color: true },
    orderBy: { name: "asc" },
  });
}

export async function getPatientsForSelect() {
  return db.patient.findMany({
    where: { status: "ACTIVE" },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
}
