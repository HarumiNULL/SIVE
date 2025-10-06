import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./editOptical.css";

export default function EditOptical() {
  const [formData, setFormData] = useState({
    nameOp: "",
    tel: "",
    direccion:"",
    city: "",
    email: "",
    schedule: "",
    logo:"",
    certCadecuacion: "",
    certDispensacion:""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="edit-container">
      <header className="edit-header">
        <div className="edit-logo">
            <img
            src="/src/assets/sunglasses.png"
            alt="Logo"
            className="logo-img"
          />
          <span>S I V E</span>
        </div>

        <div className="edit-buttons">
          <button className="btn"> <Link to="/" className="btn">inicio</Link></button>
        <button className="btn"><Link to="/viewO"  className="btn"> optica </Link></button>
          <button className="btn "><Link to="/login"  className="btn"> logout</Link></button>
        </div>
      </header>

      <main className="edit-content">
        <h2 className="edit-title">Editar Optica</h2>
        <form className="edit-form" onSubmit={handleSubmit}>
            <label>Nombre de Optica</label>
          <div className="form-group">
            <input
              type="text"
              name="nameOp"
              placeholder=""
              value={formData.nameOp}
              onChange={handleChange}
            />
          </div>

          <label>Dirección</label>
          <div className="form-group">
            <input
              type="text"
              name="direccion"
              placeholder=""
              value={formData.direccion}
              onChange={handleChange}
            />
          </div>

          <label>Telefono</label>
          <div className="form-group">
            <input
              type="telefono"
              name="tel"
              placeholder=""
              value={formData.tel}
              onChange={handleChange}
            />
          </div>
          <label>Ciudad</label>
          <div className="form-group">
             <select>
                <option>Seleccionar...</option>
                <option>Bogotá</option>
                <option>Medellín</option>
                <option>Cali</option>
              </select>
          </div>

          <label>Horario de Atención</label>
          <div className="form-group">
            <select>
                <option>Seleccionar...</option>
                <option>8:00 a 13:00</option>
                <option>9:00 a 18:00</option>
                <option>8:00 a 20:00</option>
              </select>
          </div>
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
              <button type="button" className="btn editar">
                Guardar Cambios
              </button>
            </div>
        </form>
      </main>
    </div>
  );
}
