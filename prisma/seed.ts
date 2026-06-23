import { PrismaClient } from "../app/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import "dotenv/config";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// ponytail: datos hardcoded, suficiente para demo de ventas
const THERAPISTS = [
  { name: "Dra. María González", specialty: "Psicología Clínica", color: "#3B82F6" },
  { name: "Lic. Carlos Rodríguez", specialty: "Terapia Familiar", color: "#10B981" },
  { name: "Dra. Ana Martínez", specialty: "Neuropsicología", color: "#8B5CF6" },
  { name: "Lic. Roberto Sánchez", specialty: "Psicología Infantil", color: "#F59E0B" },
  { name: "Dra. Laura Fernández", specialty: "Terapia Cognitiva", color: "#EF4444" },
  { name: "Lic. Patricia López", specialty: "Psicología Clínica", color: "#EC4899" },
  { name: "Dr. Miguel Torres", specialty: "Terapia de Pareja", color: "#06B6D4" },
  { name: "Lic. Andrea Ruiz", specialty: "Psicología Infantil", color: "#84CC16" },
  { name: "Dra. Carmen Díaz", specialty: "Terapia Ocupacional", color: "#F97316" },
  { name: "Lic. Fernando Morales", specialty: "Psicología del Deporte", color: "#6366F1" },
  { name: "Dra. Sofía Herrera", specialty: "Terapia Familiar", color: "#14B8A6" },
  { name: "Lic. Diego Castillo", specialty: "Neuropsicología", color: "#A855F7" },
  { name: "Dra. Valentina Ramos", specialty: "Psicología Clínica", color: "#F43F5E" },
  { name: "Lic. Alejandro Vega", specialty: "Terapia Cognitiva", color: "#22C55E" },
  { name: "Dra. Isabella Mendoza", specialty: "Psicología Infantil", color: "#0EA5E9" },
];

const PATIENT_NAMES = [
  "Juan Pablo García", "María José Hernández", "Carlos Alberto López", "Ana Lucía Martínez",
  "Pedro Antonio Sánchez", "Lucía Fernanda Torres", "Diego Alejandro Ruiz", "Camila Andrea Morales",
  "Sebastián Nicolás Díaz", "Valentina Sofía Ramos", "Mateo Emiliano Castro", "Isabella Victoria Reyes",
  "Santiago David Flores", "Emma Daniela Vargas", "Nicolás Andrés Jiménez", "Sofía Catalina Rojas",
  "Daniel Felipe Mendoza", "Martina Alejandra Herrera", "Lucas Gabriel Ortiz", "Mariana Paula Delgado",
  "Samuel Esteban Cruz", "Antonella Lucia Paredes", "Tomás Ignacio Silva", "Valeria Andrea Romero",
  "Gabriel Arturo Navarro", "Renata María Aguilar", "Emiliano José Molina", "Carolina Isabel Luna",
  "Joaquín Felipe Guerrero", "Paula Andrea Medina", "Leonardo Daniel Vega", "Fernanda Juliana Ríos",
  "Adrián Sebastián Campos", "Sara Valentina Peña", "Maximiliano José Soto", "Andrea Fernanda Guzmán",
  "Alejandro David Acosta", "Laura Cristina Bravo", "Francisco Javier Ponce", "Natalia Camila Espinoza",
  "Eduardo Miguel Salazar", "Daniela Patricia Cordero", "Ricardo Andrés Fuentes", "Mónica Isabel Vera",
  "Fernando José Contreras", "Patricia Elena Figueroa", "Rodrigo Antonio Sandoval", "Gloria María Núñez",
  "Manuel Alejandro Ibarra", "Claudia Beatriz Montes",
];

function randomPhone() {
  return `+52 ${Math.floor(Math.random() * 900 + 100)} ${Math.floor(Math.random() * 900 + 100)} ${Math.floor(Math.random() * 9000 + 1000)}`;
}

function getWeekDates() {
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - today.getDay() + 1);
  monday.setHours(0, 0, 0, 0);

  const dates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    dates.push(d);
  }
  return dates;
}

async function seed() {
  console.log("Limpiando datos existentes...");
  await prisma.session.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.therapist.deleteMany();

  console.log("Creando terapeutas...");
  const therapists = await Promise.all(
    THERAPISTS.map((t) => prisma.therapist.create({ data: t }))
  );

  console.log("Creando pacientes...");
  const patients = await Promise.all(
    PATIENT_NAMES.map((name) =>
      prisma.patient.create({
        data: {
          name,
          phone: randomPhone(),
          email: `${name.toLowerCase().replace(/ /g, ".").normalize("NFD").replace(/[\u0300-\u036f]/g, "")}@email.com`,
          status: Math.random() > 0.1 ? "ACTIVE" : "INACTIVE",
        },
      })
    )
  );

  console.log("Creando citas de la semana...");
  const weekDates = getWeekDates();
  const hours = [9, 10, 11, 12, 14, 15, 16, 17, 18];
  const today = new Date();

  const appointments: { patientId: string; therapistId: string; dateTime: Date; status: "SCHEDULED" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "NO_SHOW" }[] = [];

  for (const therapist of therapists) {
    // 4-6 citas por terapeuta por día
    for (const day of weekDates) {
      const numAppointments = Math.floor(Math.random() * 3) + 4;
      const dayHours = [...hours].sort(() => Math.random() - 0.5).slice(0, numAppointments);

      for (const hour of dayHours) {
        const patient = patients[Math.floor(Math.random() * patients.length)];
        const dateTime = new Date(day);
        dateTime.setHours(hour, 0, 0, 0);

        let status: "SCHEDULED" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "NO_SHOW" = "SCHEDULED";
        if (dateTime < today) {
          const rand = Math.random();
          if (rand > 0.15) status = "COMPLETED";
          else if (rand > 0.1) status = "NO_SHOW";
          else status = "CANCELLED";
        } else if (dateTime.toDateString() === today.toDateString()) {
          status = Math.random() > 0.3 ? "CONFIRMED" : "SCHEDULED";
        }

        appointments.push({
          patientId: patient.id,
          therapistId: therapist.id,
          dateTime,
          status,
        });
      }
    }
  }

  const createdAppointments = await Promise.all(
    appointments.map((a) => prisma.appointment.create({ data: a }))
  );

  console.log("Creando sesiones para citas completadas...");
  const completedAppointments = createdAppointments.filter((a) => a.status === "COMPLETED");

  await Promise.all(
    completedAppointments.map((apt) =>
      prisma.session.create({
        data: {
          appointmentId: apt.id,
          completed: true,
          completedAt: apt.dateTime,
          notes: Math.random() > 0.5 ? "Sesión completada satisfactoriamente. Paciente muestra progreso." : null,
        },
      })
    )
  );

  console.log(`
Seed completado:
- ${therapists.length} terapeutas
- ${patients.length} pacientes
- ${appointments.length} citas
- ${completedAppointments.length} sesiones
  `);
}

seed()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
