'use client'
import { useState, useEffect } from "react";
import './PanelAnalista.css'; // (Cópialo desde el PanelPrincipal.css y adáptalo si quieres colores diferentes)

const fetchActividades = async () => {
  const res = await fetch("/api/actividades");
  return await res.json();
};

export default function PanelAnalista() {
  const [analistas, setAnalistas] = useState([]);
  const [nombreAnalista, setNombreAnalista] = useState("");
  const [actividades, setActividades] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [granulos, setGranulos] = useState([]);
  const [actividadesFiltradas, setActividadesFiltradas] = useState([]);
  const [materiaSel, setMateriaSel] = useState("");
  const [granuloSel, setGranuloSel] = useState("");
  const [actividadSel, setActividadSel] = useState("");
  const [obs, setObs] = useState("");
  const [msg, setMsg] = useState("");
  const [cargando, setCargando] = useState(false);

  // --- Al iniciar, obtener los analistas y actividades
  useEffect(() => {
    fetchActividades().then(acts => {
      setActividades(acts);
      // Saca los analistas únicos (con tareas asignadas)
      setAnalistas(Array.from(new Set(acts.map(a => a.Analista).filter(Boolean))));
    });
  }, []);

  // Cuando selecciona analista, filtra materias pendientes para ese analista
  useEffect(() => {
    if (!nombreAnalista) {
      setMaterias([]);
      return;
    }
    const pendientes = actividades.filter(
      a => a.Analista === nombreAnalista && (a.Tiempo_Real_Min === null || a.Tiempo_Real_Min === "")
    );
    setMaterias(Array.from(new Set(pendientes.map(a => a.Materia))));
    setGranulos([]);
    setActividadesFiltradas([]);
    setMateriaSel(""); setGranuloSel(""); setActividadSel("");
    setObs(""); setMsg("");
  }, [nombreAnalista, actividades]);

  // Cuando cambia materia, filtra granulos
  useEffect(() => {
    if (!nombreAnalista || !materiaSel) {
      setGranulos([]); setActividadesFiltradas([]); return;
    }
    const pendientes = actividades.filter(
      a => a.Analista === nombreAnalista && a.Materia === materiaSel && (a.Tiempo_Real_Min === null || a.Tiempo_Real_Min === "")
    );
    setGranulos(Array.from(new Set(pendientes.map(a => a.Nombre_Granulo))));
    setActividadesFiltradas([]); setGranuloSel(""); setActividadSel(""); setObs(""); setMsg("");
  }, [materiaSel]);

  // Cuando cambia gránulo, filtra actividades
  useEffect(() => {
    if (!nombreAnalista || !materiaSel || !granuloSel) {
      setActividadesFiltradas([]); return;
    }
    const pendientes = actividades.filter(
      a => a.Analista === nombreAnalista &&
        a.Materia === materiaSel &&
        a.Nombre_Granulo === granuloSel &&
        (a.Tiempo_Real_Min === null || a.Tiempo_Real_Min === "")
    );
    setActividadesFiltradas(pendientes);
    setActividadSel(""); setObs(""); setMsg("");
  }, [granuloSel]);

  // --- Iniciar actividad: sólo registra fecha inicio si no existe
  const iniciarActividad = async () => {
    if (!actividadSel) { setMsg("Selecciona una actividad."); return; }
    setCargando(true);
    const act = actividadesFiltradas.find(a => a.Actividad === actividadSel);
    if (!act) return;
    // Si ya tiene fecha de inicio, no hagas nada (opcional)
    if (act.Fecha_Inicio) { setMsg("Ya está iniciada."); setCargando(false); return; }
    await fetch('/api/actividades', {
      method: 'PUT',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: act.id, Fecha_Inicio: new Date().toISOString() })
    });
    setMsg("⏱️ Actividad iniciada.");
    setCargando(false);
    fetchActividades().then(setActividades);
  };

  // --- Completar actividad: guarda observaciones, tiempo real y fecha fin
  const completarActividad = async () => {
    if (!actividadSel) { setMsg("Selecciona una actividad."); return; }
    setCargando(true);
    const act = actividadesFiltradas.find(a => a.Actividad === actividadSel);
    if (!act) return;
    // Calcula minutos si tiene Fecha_Inicio
    let tiempo_real = null;
    if (act.Fecha_Inicio) {
      const inicio = new Date(act.Fecha_Inicio);
      const ahora = new Date();
      tiempo_real = Math.round((ahora - inicio) / 60000);
    }
    await fetch('/api/actividades', {
      method: 'PUT',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: act.id,
        Fecha_Fin: new Date().toISOString(),
        Tiempo_Real_Min: tiempo_real,
        Observaciones: obs
      })
    });
    setMsg("✅ Actividad completada.");
    setCargando(false);
    fetchActividades().then(setActividades);
    setObs(""); setActividadSel(""); setGranuloSel(""); setMateriaSel("");
  };

  return (
    <div className="panel-bg" style={{minHeight: "100vh", justifyContent: 'center', paddingTop: 60}}>
      <h1 className="panel-title">Panel Analista</h1>
      {/* Selector de analista */}
      <div style={{maxWidth: 400, margin: "0 auto 2rem auto"}}>
        <label htmlFor="analista" className="panel-subtitle">Tu Nombre:</label>
        <select
          id="analista"
          className="panel-select"
          value={nombreAnalista}
          onChange={e => setNombreAnalista(e.target.value)}
        >
          <option value="">Selecciona tu nombre...</option>
          {analistas.map((a, i) => (
            <option key={i} value={a}>{a}</option>
          ))}
        </select>
      </div>

      {/* Formulario de actividades */}
      {nombreAnalista &&
        <div className="panel-form" style={{maxWidth: 600}}>
          <div>
            <label>Materia</label>
            <select className="panel-select"
              value={materiaSel} onChange={e => setMateriaSel(e.target.value)}>
              <option value="">Selecciona...</option>
              {materias.map((m, i) => <option key={i} value={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label>Gránulo</label>
            <select className="panel-select"
              value={granuloSel} onChange={e => setGranuloSel(e.target.value)}>
              <option value="">Selecciona...</option>
              {granulos.map((g, i) => <option key={i} value={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label>Actividad</label>
            <select className="panel-select"
              value={actividadSel} onChange={e => setActividadSel(e.target.value)}>
              <option value="">Selecciona...</option>
              {actividadesFiltradas.map((a, i) =>
                <option key={i} value={a.Actividad}>{a.Actividad}</option>
              )}
            </select>
          </div>
          <div style={{gridColumn: '1/4'}}>
            <label>Observaciones</label>
            <textarea
              className="panel-select"
              rows={3}
              value={obs}
              onChange={e => setObs(e.target.value)}
              placeholder="(opcional)"
            />
          </div>
          <div style={{gridColumn: '1/4', display: 'flex', gap: '1rem', marginTop: 8}}>
            <button className="btn-main" onClick={iniciarActividad} disabled={cargando}>▶️ Iniciar</button>
            <button className="btn-secondary" onClick={completarActividad} disabled={cargando}>✅ Completar</button>
          </div>
          {msg && <p className="msg-info" style={{gridColumn: '1/4'}}>{msg}</p>}
        </div>
      }
    </div>
  );
}
