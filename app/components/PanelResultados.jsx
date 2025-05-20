'use client'
import React, { useState, useEffect } from 'react';
import './PanelResultados.css';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#12d46f', '#e35656'];

export default function PanelResultados({ registros, datos, granulos }) {
  const [materia, setMateria] = useState(datos.materias[0] || "");

  // Actualiza materia automáticamente si cambia lista de materias
  useEffect(() => {
    if (!datos.materias.includes(materia)) setMateria(datos.materias[0]);
  }, [datos.materias]);

  // Procesa datos
  const actividadesMateria = registros.filter(r => r.Materia === materia);
  const granulosMateria = Array.from(new Set(actividadesMateria.map(r => r.Nombre_Granulo)));
  const dataProgreso = granulosMateria.map(g => {
    const acts = actividadesMateria.filter(a => a.Nombre_Granulo === g);
    const total = acts.length;
    const done = acts.filter(a => a.Tiempo_Real_Min !== null && a.Tiempo_Real_Min !== '').length;
    return {
      granulo: g,
      pct: total === 0 ? 0 : Math.round((done / total) * 100),
    };
  });
  const dataBarras = granulosMateria.map(g => {
    const acts = actividadesMateria.filter(a => a.Nombre_Granulo === g);
    const promReal = acts.reduce((acc, a) => acc + (+a.Tiempo_Real_Min || 0), 0) / (acts.filter(a => a.Tiempo_Real_Min).length || 1);
    const promIdeal = acts.reduce((acc, a) => acc + (+a.Tiempo_Ideal_Min || 0), 0) / (acts.length || 1);
    return {
      granulo: g,
      real: Math.round(promReal * 10) / 10,
      ideal: Math.round(promIdeal * 10) / 10
    };
  });
  const completadas = actividadesMateria.filter(a => a.Tiempo_Real_Min !== null && a.Tiempo_Real_Min !== '').length;
  const pendientes = actividadesMateria.filter(a => !a.Tiempo_Real_Min).length;
  const pieData = [
    { name: "Completadas", value: completadas },
    { name: "Pendientes", value: pendientes }
  ];

  return (
    <div className="resultados-bg">
      <h2 className="resultados-title">Resultados por Materia</h2>
      <div className="resultados-form">
        <label>Materia</label>
        <select value={materia} onChange={e => setMateria(e.target.value)}>
          {datos.materias.map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>
      <div className="resultados-graficas">
        <div className="grafica-card">
          <h4 className="grafica-title">Progreso (%) por Gránulo</h4>
          <ResponsiveContainer width="100%" height={230}>
            <LineChart data={dataProgreso}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="granulo" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="pct" stroke="#12d46f" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="grafica-card">
          <h4 className="grafica-title">Tiempo Real vs Ideal</h4>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={dataBarras}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="granulo" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="real" fill="#12d46f" name="Real" />
              <Bar dataKey="ideal" fill="#51c2d6" name="Ideal" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="grafica-card">
          <h4 className="grafica-title">Estado de Tareas</h4>
          <ResponsiveContainer width="100%" height={230}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={70}
                fill="#8884d8"
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
