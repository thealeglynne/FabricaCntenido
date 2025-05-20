import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const materias = await prisma.materiaExtra.findMany();
    return NextResponse.json(materias);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ error: 'Error al obtener materias extra' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();

    if (!data.Materia || !data.Equipo) {
      return NextResponse.json({ error: 'Faltan campos obligatorios (Materia y Equipo)' }, { status: 400 });
    }

    // Asegura que las fechas sean Date si existen
    if (data.Fecha_Entrega) data.Fecha_Entrega = new Date(data.Fecha_Entrega);
    if (data.Fecha_Reentrega) data.Fecha_Reentrega = new Date(data.Fecha_Reentrega);

    const materia = await prisma.materiaExtra.create({ data });
    return NextResponse.json(materia, { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ error: 'Error al crear materia extra' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 });

    await prisma.materiaExtra.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ error: 'Error al eliminar materia extra' }, { status: 500 });
  }
}
