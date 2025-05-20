'use client';
import { useState, useEffect } from "react";
import './PanelPrincipal.css';

export default function PanelMateriaExtra() {
  const [materiasExtra, setMateriasExtra] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    Materia: "",
    Equipo: "",
    Fecha_Entrega: "",
    Correcciones: "",
    Fecha_Reentrega: "",
    Estado: "",
    Observaciones: ""
  });

  // --- Corrección aquí: Validar si la respuesta es un array
  const fetchMateriasExtra = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/materia-extra");
      const data = await res.json();
      if (Array.isArray(data)) {
        setMateriasExtra(data);
      } else {
        setMateriasExtra([]);
        setMessage(data.error || "Error inesperado al obtener materias extra");
      }
    } catch (error) {
      setMateriasExtra([]);
      setMessage("Error al conectar con el servidor");
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMateriasExtra(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!form.Materia || !form.Equipo) {
      return setMessage("⚠️ Materia y Equipo son campos obligatorios");
    }

    try {
      const response = await fetch("/api/materia-extra", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          Fecha_Entrega: form.Fecha_Entrega ? new Date(form.Fecha_Entrega).toISOString() : null,
          Fecha_Reentrega: form.Fecha_Reentrega ? new Date(form.Fecha_Reentrega).toISOString() : null
        }),
      });

      const respData = await response.json();

      if (response.ok) {
        setMessage("✅ Materia extra agregada correctamente");
        setForm({
          Materia: "",
          Equipo: "",
          Fecha_Entrega: "",
          Correcciones: "",
          Fecha_Reentrega: "",
          Estado: "",
          Observaciones: ""
        });
        fetchMateriasExtra();
      } else {
        setMessage("❌ " + (respData.error || "Error al agregar la materia extra"));
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("❌ Error al conectar con el servidor");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta materia extra?")) {
      try {
        const response = await fetch("/api/materia-extra", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });

        const respData = await response.json();

        if (response.ok && respData.success) {
          setMessage("🗑️ Materia extra eliminada correctamente");
          fetchMateriasExtra();
        } else {
          setMessage("❌ " + (respData.error || "Error al eliminar la materia extra"));
        }
      } catch (error) {
        console.error("Error:", error);
        setMessage("❌ Error al conectar con el servidor");
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="panel-bg">
      {/* Formulario */}
      <section className="seccion-panel">
        <h2 className="panel-subtitle">Agregar Materia Extra</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 panel-form">
          <div className="col-span-2">
            <label>Materia *</label>
            <input
              type="text"
              value={form.Materia}
              onChange={(e) => setForm({ ...form, Materia: e.target.value })}
              required
            />
          </div>
          <div>
            <label>Equipo *</label>
            <select
              value={form.Equipo}
              onChange={(e) => setForm({ ...form, Equipo: e.target.value })}
              required
            >
              <option value="">Selecciona...</option>
              <option value="ALFA">ALFA</option>
              <option value="GAMA">GAMA</option>
              <option value="DELTA">DELTA</option>
              <option value="SIGMA">SIGMA</option>
              <option value="LAMDA">LAMDA</option>
              <option value="OMGA">OMGA</option>
            </select>
          </div>
          <div>
            <label>Estado</label>
            <select
              value={form.Estado}
              onChange={(e) => setForm({ ...form, Estado: e.target.value })}
            >
              <option value="">Selecciona...</option>
              <option value="En progreso">En progreso</option>
              <option value="Entregado">Entregado</option>
              <option value="Corregido">Corregido</option>
              <option value="Reentrega pendiente">Reentrega pendiente</option>
            </select>
          </div>
          <div>
            <label>Fecha de Entrega</label>
            <input
              type="date"
              value={form.Fecha_Entrega}
              onChange={(e) => setForm({ ...form, Fecha_Entrega: e.target.value })}
            />
          </div>
          <div>
            <label>Fecha de Reentrega</label>
            <input
              type="date"
              value={form.Fecha_Reentrega}
              onChange={(e) => setForm({ ...form, Fecha_Reentrega: e.target.value })}
            />
          </div>
          <div className="col-span-2">
            <label>Correcciones</label>
            <textarea
              value={form.Correcciones}
              onChange={(e) => setForm({ ...form, Correcciones: e.target.value })}
              rows={3}
            />
          </div>
          <div className="col-span-2">
            <label>Observaciones</label>
            <textarea
              value={form.Observaciones}
              onChange={(e) => setForm({ ...form, Observaciones: e.target.value })}
              rows={3}
            />
          </div>
          <div className="col-span-2 flex justify-end gap-4 mt-4">
            <button type="button" onClick={() => setForm({
              Materia: "",
              Equipo: "",
              Fecha_Entrega: "",
              Correcciones: "",
              Fecha_Reentrega: "",
              Estado: "",
              Observaciones: ""
            })} className="btn-secondary">
              Limpiar
            </button>
            <button type="submit" className="btn-main">
              Guardar
            </button>
          </div>
        </form>
        {message && <p className="msg-info mt-4">{message}</p>}
      </section>

      {/* Listado */}
      <section className="seccion-panel">
        <h2 className="panel-subtitle">Listado de Materias Extra</h2>
        {loading ? (
          <p>Cargando...</p>
        ) : materiasExtra.length === 0 ? (
          <p>No hay materias extra registradas</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th>Materia</th>
                  <th>Equipo</th>
                  <th>Estado</th>
                  <th>Entrega</th>
                  <th>Reentrega</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(materiasExtra) && materiasExtra.map((materia) => (
                  <tr key={materia.id}>
                    <td>{materia.Materia}</td>
                    <td>{materia.Equipo || "-"}</td>
                    <td>{materia.Estado || "-"}</td>
                    <td>{formatDate(materia.Fecha_Entrega)}</td>
                    <td>{formatDate(materia.Fecha_Reentrega)}</td>
                    <td>
                      <button
                        onClick={() => handleDelete(materia.id)}
                        className="btn-danger"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
