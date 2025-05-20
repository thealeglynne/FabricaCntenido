-- CreateTable
CREATE TABLE "materiaExtra" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Materia" TEXT NOT NULL,
    "Equipo" TEXT,
    "Fecha_Entrega" DATETIME,
    "Correcciones" TEXT,
    "Fecha_Reentrega" DATETIME,
    "Estado" TEXT,
    "Observaciones" TEXT
);
