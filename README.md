# CliniGest - Demo

Demo funcional para centro terapéutico. Sistema de gestión de pacientes, citas y sesiones.

## Stack

- Next.js 16 + React 19
- Prisma ORM
- Neon PostgreSQL
- Tailwind CSS 4

## Setup Local

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar base de datos
# Crear proyecto en https://neon.tech y copiar connection string
cp .env.example .env
# Editar .env con tu DATABASE_URL de Neon

# 3. Generar cliente Prisma y aplicar schema
npm run db:generate
npm run db:push

# 4. Cargar datos de demo
npm run db:seed

# 5. Iniciar servidor
npm run dev
```

Abrir http://localhost:3000

## Deploy en Vercel

1. Push a GitHub
2. Importar en Vercel
3. Agregar variable `DATABASE_URL` con connection string de Neon
4. Build command: `npm run db:generate && npm run build`
5. Deploy

## Credenciales Demo

- Usuario: `admin`
- Password: `demo123`

(Login simulado, no hay auth real)

## Módulos

- **Dashboard**: Métricas del día, citas pendientes, carga por terapeuta
- **Pacientes**: Listado, perfil con historial de sesiones
- **Agenda**: Vista semanal con citas por terapeuta
- **Sesiones**: Control de sesiones del día (completar/cancelar)
- **Terapeutas**: Listado con métricas de carga

## Datos Mock

El seed genera:
- 15 terapeutas con especialidades variadas
- 50 pacientes
- ~500 citas distribuidas en la semana
- Sesiones completadas con notas

---

Demo de ventas para CliniGest v1.0
