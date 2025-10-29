// src/pages/RegisterOptical.tsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getDays, getHours, createOptical,getCities } from "../../services/api";
import styles from "./registerOptical.module.css"
import Navbar from "../../components/Navbar";

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
  const[cities, setCities]=useState([]);

  // Cargar datos desde el backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dayData, hourData,cityData] = await Promise.all([
          getDays(),
          getHours(),
          getCities()
        ]);
        // 👇 Esto se asegura de que sea un array válido para map()
        setDays(Array.isArray(dayData) ? dayData : []);
        setHours(Array.isArray(hourData) ? hourData : []);
        setCities(Array.isArray(cityData) ? cityData : []);
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
      <Navbar />

       <h2 className={styles.optical_title}>Registrar Óptica</h2><br />
      <div className={styles.formContainer}>
       
        <form action="">
          <label htmlFor="nameOp">Nombre de Óptica</label><br />
          <input className={styles.register_optical_input}
            type="text"
            name="nameOp"
            value={formData.nameOp}
            onChange={handleChange}
          />

          <br />
          <label htmlFor="address">Dirección</label><br />
          <input className={styles.register_optical_input}
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
          <br />
          <label htmlFor="tel">Teléfono</label><br />
          <input className={styles.register_optical_input}
            type="text"
            name="tel"
            value={formData.tel}
            onChange={handleChange}
          />
          <br />
          <label htmlFor="email">Correo de la optica</label><br />
          <input className={styles.register_optical_input}
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <br />
          <br />
          <label >¿Que dias tiene servicio la optica?</label>
          <div className={styles.days}>
            {days
              .sort((a: any, b: any) => a.id_day - b.id_day)
              .map((days: any) => (
                <label className={styles.option_day} key={days.id_day} htmlFor={`${days.id_day}`}>
                  <input type="checkbox" className={styles.option_check}
                    name={`day-${days.id_day}`}
                    id={`${days.id_day}`}
                    value={`${days.id_day}`} />
                  {days.name_day}
                </label>
              ))}
          </div>
          <label htmlFor="city">¿En que ciudad esta ubicada?</label>
          <select name="city" id="">
            {cities.map((city: any)=>(
              <option key={city.id_city} value={`${city.id_city}`}>{city.name}</option>
            ))}
          </select>

          <div className={styles.hours}>
            <label htmlFor="hour_aper"  className={styles.label_form_optical}>Hora de Apertura</label>
            <select className={styles.select_optical}
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
            <label  className={styles.label_form_optical} htmlFor="hour_close">Hora de Cierre</label>
            <select className={styles.select_optical}
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
          <br />
          <label  htmlFor="logo">Logo (solo imágenes .jpg, .png)</label>
          <div className="form-group">
            <input
            className={styles.input_file}
              type="file"
              name="logo"
              accept=".jpg,.jpeg,.png"
              onChange={handleChange}
            />
          </div>
          <label htmlFor="certCadecuacion">Certificado de Adecuación (solo PDF)</label>
          <div className="form-group">
            <input
            className={styles.input_file}
              type="file"
              name="certCadecuacion"
              accept=".pdf"
              onChange={handleChange}
            />
          </div>
          <label htmlFor="certDispensacion">Certificado de Dispensación (solo PDF)</label>
          <div className="form-group">
            <input
              className={styles.input_file}
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

      </div>


    </div>
  );
}
