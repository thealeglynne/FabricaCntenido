// app/api/actividades/batch-delete/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function POST(request) {
  const { Materia, Analista, Auxiliar, Practicante, Equipo } = await request.json();
  await prisma.registroActividad.deleteMany({
    where: {
      Materia,
      Analista,
      Auxiliar: Auxiliar || undefined,
      Practicante: Practicante || undefined,
      Equipo,
    }
  });
  return NextResponse.json({ ok: true });
}
