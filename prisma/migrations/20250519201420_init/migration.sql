-- CreateTable
CREATE TABLE "RegistroActividad" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Analista" TEXT NOT NULL,
    "Auxiliar" TEXT,
    "Practicante" TEXT,
    "Equipo" TEXT NOT NULL,
    "Materia" TEXT NOT NULL,
    "ID_Granulo" INTEGER NOT NULL,
    "Nombre_Granulo" TEXT NOT NULL,
    "Actividad" TEXT NOT NULL,
    "Rol" TEXT NOT NULL,
    "Fecha_Asignacion" DATETIME NOT NULL,
    "Fecha_Inicio" DATETIME,
    "Fecha_Fin" DATETIME,
    "Tiempo_Real_Min" REAL,
    "Tiempo_Ideal_Min" REAL NOT NULL,
    "Observaciones" TEXT
);
