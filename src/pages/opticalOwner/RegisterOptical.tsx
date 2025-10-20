// src/pages/RegisterOptical.tsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getDays, getHours, createOptical } from "../../services/api";
import "./registerOptical.css";

export default function RegisterOptical() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nameOp: "",
    address: "",
    tel: "",
    city: "",
    email: "",
    logo: null as File | null,
    certCadecuacion: null as File | null,
    certDispensacion: null as File | null,
    day: "",
    hour_aper: "",
    hour_close: "",
  });

  const [days, setDays] = useState([]);
  const [hours, setHours] = useState([]);

  // Cargar datos desde el backend
 useEffect(() => {
  const fetchData = async () => {
    try {
      const [ dayData, hourData] = await Promise.all([

        getDays(),
        getHours(),
      ]);

      // 👇 Esto se asegura de que sea un array válido para map()
      setDays(Array.isArray(dayData) ? dayData : []);
      setHours(Array.isArray(hourData) ? hourData : []);
    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  };

  fetchData();
}, []);



  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, files } = e.target as any;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) data.append(key, value as any);
      });

      await createOptical(data);
      alert("Óptica registrada correctamente");
      navigate("/listOptical");
    } catch (error) {
      console.error("Error registrando óptica:", error);
      alert("Error al registrar la óptica");
    }
  };

  return (
    <div className="edit-container">
      {/* 🔹 Navbar integrada */}
      <header className="edit-header">
        <div className="edit-logo">
          <img src="/src/assets/sunglasses.png" alt="Logo" className="logo-img" />
          <span>S I V E</span>
        </div>

        <div className="edit-buttons">
          <Link to="/" className="btn">Inicio</Link>
          <Link to="/viewO" className="btn">Ver mi óptica</Link>
          <Link to="/login" className="btn">Logout</Link>
        </div>
      </header>

      <main className="edit-content">
        <h2 className="edit-title">Registrar Óptica</h2>
        <form className="edit-form" onSubmit={handleSubmit}>
          {/* Nombre */}
          <label>Nombre de Óptica</label>
          <div className="form-group">
            <input
              type="text"
              name="nameOp"
              value={formData.nameOp}
              onChange={handleChange}
            />
          </div>

          {/* Dirección */}
          <label>Dirección</label>
          <div className="form-group">
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          {/* Teléfono */}
          <label>Teléfono</label>
          <div className="form-group">
            <input
              type="text"
              name="tel"
              value={formData.tel}
              onChange={handleChange}
            />
          </div>

          {/* Día */}
          <label>Día</label>
          <div className="form-group">
            <select name="day" value={formData.day} onChange={handleChange}>
              <option value="">Seleccionar...</option>
              {days.map((d: any) => (
                <option key={d.id_day} value={d.id_day}>
                  {d.name_day}
                </option>
              ))}
            </select>
          </div>

          {/* Hora apertura */}
          <label>Hora de Apertura</label>
          <div className="form-group">
            <select
              name="hour_aper"
              value={formData.hour_aper}
              onChange={handleChange}
            >
              <option value="">Seleccionar...</option>
              {hours.map((h: any) => (
                <option key={h.id_hour} value={h.id_hour}>
                  {h.hour}
                </option>
              ))}
            </select>
          </div>

          {/* Hora cierre */}
          <label>Hora de Cierre</label>
          <div className="form-group">
            <select
              name="hour_close"
              value={formData.hour_close}
              onChange={handleChange}
            >
              <option value="">Seleccionar...</option>
              {hours.map((h: any) => (
                <option key={h.id_hour} value={h.id_hour}>
                  {h.hour}
                </option>
              ))}
            </select>
          </div>

          {/* Archivos */}
          <label>Logo (solo imágenes .jpg, .png)</label>
          <div className="form-group">
            <input
              type="file"
              name="logo"
              accept=".jpg,.jpeg,.png"
              onChange={handleChange}
            />
          </div>

          <label>Certificado de Adecuación (solo PDF)</label>
          <div className="form-group">
            <input
              type="file"
              name="certCadecuacion"
              accept=".pdf"
              onChange={handleChange}
            />
          </div>

          <label>Certificado de Dispensación (solo PDF)</label>
          <div className="form-group">
            <input
              type="file"
              name="certDispensacion"
              accept=".pdf"
              onChange={handleChange}
            />
          </div>

          <div className="form-buttons">
            <button type="submit" className="btn editar">
              Guardar Cambios
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
