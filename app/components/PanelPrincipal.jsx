'use client'
import { useState, useEffect } from "react";
import './PanelPrincipal.css';
import PanelResultados from './PanelResultados';

// --- Catálogos ---
const ACTIVIDADES = [
  { nombre: "Video educativo", tiempo_ideal: 20, rol: "Analista" },
  { nombre: "Podcast (temática)", tiempo_ideal: 15, rol: "Analista" },
  { nombre: "Infografía", tiempo_ideal: 210, rol: "Analista" },
  { nombre: "Imágenes y personajes", tiempo_ideal: 15, rol: "Auxiliar" },
  { nombre: "Actividades en iSpring", tiempo_ideal: 25, rol: "Auxiliar" },
  { nombre: "Prevalidación", tiempo_ideal: 13, rol: "Practicante" },
  { nombre: "Subida de SCORM a Drive", tiempo_ideal: 40, rol: "Practicante" }
];
const granulos = Array.from({ length: 5 }, (_, i) => `Gránulo ${i + 1}`);
const datos = {
  analistas: [
    "BLANCA ALEJANDRA HERRERA DUCUARA","DAISSY YURANI ARDILA PRIETO",
    "DARIO FERNANDO NAVARRO PARRA","DIEGO FERNANDO PEREZ MINDIOLA",
    "DORIS KATHERINE AVILA HERNANDEZ","EDWIN ESNEIDER RIATIGA GALVAN",
    "GEORGINA GARIZADO CABARCAS","HERNAN FELIPE CASTRO ESPINOSA",
    "JEIMMY PAOLA CARO CASTILLO","JORGE EDUARDO LEON ESCOBAR",
    "JULIAN YESID RUIZ ROJAS","KEVIN ALEXANDER CÁRDENAS NAISA",
    "LAURA ANDREA BARON GARZON","LAURA FERNANDA MEDINA ROMERO",
    "LAURA MILENA MORA BLANCO","LAURA SOFIA ESTUPIÑAN CORREA",
    "LAURA VICTORIA PATIÑO NARANJO","LEANDRO AREVALO TORRES",
    "LESLY NATALIA CARDOZO ESCOBAR","LEYDI MARIANA ARDILA REYES",
    "LINA MARCELA BABATIVA AGUILAR","MARIA DEL MAR SORACIPA MORA",
    "MIGUEL ANDRES MANCERA ORTIZ","NICOLAS DAVID PASTOR LOPEZ",
    "NIDIA MARCELA PRADA RAMIREZ","PAOLA ANDREA RODRIGUEZ PULIDO",
    "RUBEN FERNANDO MUÑOZ NIÑO","SAMUEL ESTEBAN CORTES LEAL",
    "SERGIO ALEJANDRO LOPEZ TERRONT","YAKO YUYAY JACANAMIJOY IGUARAN",
    "YULE VIVIANA CASTILLO BERNAL"
  ],
  auxiliares: [
    "BRAYAN GUTIERREZ MIRANDA","CAMILO ALEJANDRO RAMOS YUSTY",
    "HAMILTHON MUÑOZ PORRAS","JULIANA SOFIA CORREA ARAQUE",
    "LINA MARCELA BABATIVA AGUILAR","LUIS MIGUEL CUSPIAN ANGUCHO",
    "MARIANA RODRIGUEZ CEBALLOS","PAULA ANDREA VERU ESPARZA"
  ],
  practicantes: [
    "JUAN DAVID LEON BERGEL","NICOLAS GUEVARA GUTIERREZ"
  ],
  equipos: [
    "ALFA","GAMA","DELTA","SIGMA","LAMDA","OMGA"
  ],
  materias: [
    "Administración de Empresas Turísticas y Hoteleras RU",
    "ADMINISTRACIÓN DE LA SEGURIDAD Y LA SALUD EN EL TRABAJO (SST) RU",
    "Seguimiento DOCENTES",
    "Administración de Emp Turísticas y Hoteleras: I Semestre.",
    "Administración SST","Negocios Internacionales",
    "Diplomado en Medicina Preventiva en el Trabajo",
    "Diplomado en Sistemas de Información Geográfica",
    "Diplomado en computación en la nube para sistemas inteligentes",
    "Ingeniería en Diseño de Producto","Ingeniería de Software",
    "INGENIERÍA DE DATOS E INTELINGENCIA ARTIFICIAL RU","INGENIERÍA QUÍMICA",
    "Ingeniería de Datos e Inteligencia Artificial RU",
    "Especialización en inteligencia artificial","Ingenieria de producto",
    "Diplomado en Banca y Medios de Pagos Internacionales",
    "Diplomado en Gestión Sostenible del Turismo",
    "Diplomado en Auditoría de Sistemas Integrados de Gestión",
    "Espacios de practica","Listado de preguntas [Fuera de contexto]",
    "Grabación Lites","Cotización capsulas","Presentación de proyecto",
    "Revisión Avatar diseño de modas","Derecho Laboral y SS",
    "Diseño de Exp Interactivas","Diplomado en Branding",
    "Diplomado en Seguridad y Salud en el Trabajo para Operaciones Logísticas",
    "Metricas"
  ]
};

export default function PanelPrincipal() {
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- Fetch de la base de datos
  const fetchRegistros = async () => {
    setLoading(true);
    const res = await fetch("/api/actividades");
    setRegistros(await res.json());
    setLoading(false);
  };
  useEffect(() => { fetchRegistros(); }, []);

  // --- Panel Líder
  const [form, setForm] = useState({ Analista: "", Auxiliar: "", Practicante: "", Equipo: "", Materia: "" });
  const [msgLider, setMsgLider] = useState("");

  const asignarMateria = async () => {
    setMsgLider("");
    if (!form.Analista || !form.Equipo || !form.Materia) return setMsgLider("⚠️ Debes seleccionar al menos Analista, Equipo y Materia.");
    if (registros.some(r => r.Materia === form.Materia && r.Analista)) return setMsgLider("🛑 Ya asignada.");
    const base = registros.length ? Math.max(...registros.map(r => r.ID_Granulo)) + 1 : 1;
    const ts = new Date().toISOString();
    let nuevos = [];
    for (let i = 0; i < granulos.length; i++) {
      let gid = base + i;
      for (const act of ACTIVIDADES) {
        nuevos.push({
          Analista: form.Analista, Auxiliar: form.Auxiliar, Practicante: form.Practicante, Equipo: form.Equipo, Materia: form.Materia,
          ID_Granulo: gid, Nombre_Granulo: granulos[i], Actividad: act.nombre, Rol: act.rol,
          Fecha_Asignacion: ts, Fecha_Inicio: null, Fecha_Fin: null, Tiempo_Real_Min: null, Tiempo_Ideal_Min: act.tiempo_ideal, Observaciones: ""
        });
      }
    }
    await Promise.all(nuevos.map(r =>
      fetch('/api/actividades', { method: 'POST', headers: { "Content-Type": "application/json" }, body: JSON.stringify(r) })
    ));
    setMsgLider("✅ Materia asignada.");
    setForm({ Analista: "", Auxiliar: "", Practicante: "", Equipo: "", Materia: "" });
    fetchRegistros();
  };

  // -------- SECCIÓN ELIMINAR ASIGNACIÓN -----------
  const [selectedToDelete, setSelectedToDelete] = useState(""); // clave de asignación

  const handleDelete = async () => {
    if (!selectedToDelete) return;
    const [Materia, Analista, Auxiliar, Practicante, Equipo] = selectedToDelete.split("|");
    // Puedes cambiar a DELETE en tu API, pero aquí para simplicidad uso fetch a un endpoint batch (ajusta tu backend si lo requieres)
    const res = await fetch(`/api/actividades/batch-delete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Materia, Analista, Auxiliar, Practicante, Equipo })
    });
    if (res.ok) {
      setMsgLider("🗑️ Asignación eliminada.");
      setSelectedToDelete("");
      fetchRegistros();
    } else {
      setMsgLider("❌ Error al eliminar asignación.");
    }
  };

  // --- Render principal SOLO Panel Líder ---
  // Calculo las asignaciones únicas para usar en la lista y el select de eliminación
  const asignacionesUnicas = [
    ...new Set(
      registros.map(r =>
        [r.Materia, r.Analista, r.Auxiliar, r.Practicante, r.Equipo].join("|")
      )
    ),
  ];

  return (
    <div className="panel-bg" style={{padding:0}}>
      {/* Sección 1: Asignar tareas */}
      <section className="seccion-panel" style={{height: "100vh", display:'flex', flexDirection:'column', justifyContent:'center'}}>
        <h2 className="panel-subtitle">Asignación de Materias</h2>
        <div className="grid grid-cols-3 gap-6 panel-form">
          {/* Analista */}
          <div>
            <label>Analista</label>
            <select
              name="Analista"
              value={form.Analista}
              onChange={e => setForm({ ...form, Analista: e.target.value })}
            >
              <option value="">Selecciona...</option>
              {datos.analistas.map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
          {/* Auxiliar */}
          <div>
            <label>Auxiliar</label>
            <select
              name="Auxiliar"
              value={form.Auxiliar}
              onChange={e => setForm({ ...form, Auxiliar: e.target.value })}
            >
              <option value="">(Ninguno)</option>
              {datos.auxiliares.map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
          {/* Practicante */}
          <div>
            <label>Practicante</label>
            <select
              name="Practicante"
              value={form.Practicante}
              onChange={e => setForm({ ...form, Practicante: e.target.value })}
            >
              <option value="">(Ninguno)</option>
              {datos.practicantes.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          {/* Equipo */}
          <div>
            <label>Equipo</label>
            <select
              name="Equipo"
              value={form.Equipo}
              onChange={e => setForm({ ...form, Equipo: e.target.value })}
            >
              <option value="">Selecciona...</option>
              {datos.equipos.map(e => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
          </div>
          {/* Materia */}
          <div>
            <label>Materia</label>
            <select
              name="Materia"
              value={form.Materia}
              onChange={e => setForm({ ...form, Materia: e.target.value })}
            >
              <option value="">Selecciona...</option>
              {datos.materias.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex gap-3 mb-4 mt-2">
          <button className="btn-main" onClick={asignarMateria}>Asignar Materia</button>
          <button className="btn-secondary" onClick={fetchRegistros}>Actualizar Listado</button>
        </div>
        {msgLider && <p className="msg-info">{msgLider}</p>}
      </section>

      {/* Sección 2: Ver registro de tareas */}
      <section className="seccion-panel" style={{height: "100vh", display:'flex', flexDirection:'column', justifyContent:'center'}}>
        <h2 className="panel-subtitle">Registro de Tareas</h2>
        <div className="assign-list">
          {asignacionesUnicas.map((key, i) => {
            const r = registros.find(row =>
              [row.Materia, row.Analista, row.Auxiliar, row.Practicante, row.Equipo].join("|") === key
            );
            return (
              <div key={i} className="assign-card">
                <span className="mat-title">{r.Materia}</span>
                <span> <b>Analista:</b> {r.Analista}</span>
                <span> <b>Auxiliar:</b> {r.Auxiliar || <span className="text-gray-500">-</span>}</span>
                <span><b>Practicante:</b> {r.Practicante || <span className="text-gray-500">-</span>}</span>
                <span><b>Equipo:</b> {r.Equipo}</span>
              </div>
            );
          })}
        </div>
      </section>

      <PanelResultados registros={registros} datos={datos} granulos={granulos} />


      {/* Sección 3: Eliminar asignaciones */}
      <section className="seccion-panel" style={{height: "100vh", display:'flex', flexDirection:'column', justifyContent:'center'}}>
        <h3 className="panel-subtitle">Eliminar una Asignación</h3>
        <div className="flex gap-2 items-center">
          <select
            value={selectedToDelete}
            onChange={e => setSelectedToDelete(e.target.value)}
            className="panel-select"
          >
            <option value="">Selecciona una asignación...</option>
            {asignacionesUnicas.map((key, i) => {
              const [Materia, Analista, Auxiliar, Practicante, Equipo] = key.split("|");
              return (
                <option key={i} value={key}>
                  {Materia} | {Analista}{Auxiliar ? ` | ${Auxiliar}` : ""}{Practicante ? ` | ${Practicante}` : ""} | {Equipo}
                </option>
              );
            })}
          </select>
          <button
            className="btn-danger"
            disabled={!selectedToDelete}
            onClick={handleDelete}
          >
            Eliminar Asignación
          </button>
        </div>
        <p className="msg-info mt-2">
          <b>Nota:</b> Eliminarás todas las tareas (actividades) de esa asignación.
        </p>
      </section>
    </div>
  );
}
