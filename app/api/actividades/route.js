import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const actividades = await prisma.registroActividad.findMany(); // nombre de tu modelo en schema.prisma
  return NextResponse.json(actividades);
}

export async function POST(request) {
  const data = await request.json();
  const actividad = await prisma.registroActividad.create({ data });
  return NextResponse.json(actividad, { status: 201 });
}

export async function PUT(request) {
  const data = await request.json();
  // necesitas el ID
  const { id, ...updateData } = data;
  const updated = await prisma.registroActividad.update({
    where: { id },
    data: updateData,
  });
  return NextResponse.json(updated);
}
