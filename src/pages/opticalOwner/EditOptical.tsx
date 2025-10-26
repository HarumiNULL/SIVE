import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getDays, getHours, getCities, getOneOptical, createOptical, Schedule, getAllSchedules } from "../../services/api";
import styles from "./editOptical.module.css"
import Navbar from "../../components/Navbar";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";

export default function EditOptical() {
  const navigate = useNavigate();
  const { id } = useParams();
  interface OpticalFormData {
    id_optical: number;
    nameOp: string;
    descriptionOp: string;
    address: string;
    tel: string;
    city: string;
    email: string;
    logo: File | null;
    certCadecuacion: File | null;
    certDispensacion: File | null;
    day: number[]; // ✅ aquí definimos el tipo correctamente
    hour_aper: string;
    hour_close: string;
    latitud: string;
    longitud: string;
  }
  const [formData, setFormData] = useState<OpticalFormData>({
    id_optical: 0,
    nameOp: "",
    descriptionOp: "",
    address: "",
    tel: "",
    city: "",
    email: "",
    logo: null as File | null,
    certCadecuacion: null as File | null,
    certDispensacion: null as File | null,
    day: [],
    hour_aper: "",
    hour_close: "",
    latitud: "",
    longitud: "",
  });

  const [days, setDays] = useState([]);
  const [hours, setHours] = useState([]);
  const [cities, setCities] = useState([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);


  // 🧭 Función para actualizar lat/lng al hacer clic en el mapa
  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setFormData((prev) => ({
          ...prev,
          latitud: lat.toFixed(6),
          longitud: lng.toFixed(6),
        }));
      },
    });

    return formData.latitud && formData.longitud ? (
      <Marker position={[parseFloat(formData.latitud), parseFloat(formData.longitud)]} />
    ) : null;
  };

  // 📡 Cargar datos iniciales del backend
  useEffect(() => {
    const fetchLists = async () => {
      try {
        const [dayData, hourData, cityData] = await Promise.all([
          getDays(),
          getHours(),
          getCities(),
        ]);
        setDays(Array.isArray(dayData) ? dayData : []);
        setHours(Array.isArray(hourData) ? hourData : []);
        setCities(Array.isArray(cityData) ? cityData : []);
      } catch (error) {
        console.error("Error cargando datos:", error);
      }
    };

    fetchLists();
  }, []);

  // 📡 Obtener óptica + horarios
  useEffect(() => {
    if (id) {
      Promise.all([
        getOneOptical(Number(id)),
        getAllSchedules(),
      ]).then(([opticalData, allSchedules]) => {
        console.log("📦 Todos los schedules:", allSchedules);
        console.log("🧩 IDs de ópticas con horarios:", allSchedules.map((s: any) => s.optical_id));

        console.log("🧿 ID de la óptica actual:", id);

        // 🟢 Llenar datos del formulario
        setFormData((prev) => ({
          ...prev,
          id_optical: opticalData.id_optical,
          nameOp: opticalData.nameOp,
          descriptionOp: opticalData.descriptionOp || "",
          address: opticalData.address,
          tel: opticalData.tel,
          city: String(opticalData.city),
          email: opticalData.email,
          day: opticalData.day || [],
          hour_aper: String(opticalData.hour_aper || ""),
          hour_close: String(opticalData.hour_close || ""),
          latitud: opticalData.latitud ? String(opticalData.latitud) : "",
          longitud: opticalData.longitud ? String(opticalData.longitud) : "",
        }));
        const schedulesOptical = allSchedules.filter(
          (s: any) => s.optical_id === Number(id)
        );
        console.log("✅ Horarios de la óptica filtrados:", schedulesOptical);
        setSchedules(schedulesOptical);
        setSchedules(schedulesOptical);


      });
    }
  }, [id]);

  // marcar o desmaracr los dias cuandoel usuario hace clic
  const toggleDay = (dayId: number) => {
    setSchedules((prev) => {
      // Si ya existe un horario con ese día, lo quitamos
      if (prev.some((s) => s.id_day === dayId)) {
        return prev.filter((s) => s.id_day !== dayId);
      }
      // Si no existe, lo agregamos con valores por defecto
      return [
        ...prev,
        {
          id_schedule: 0,
          day: { id_day: dayId, name_day: "" },
          id_hour_aper: 1,
          id_hour_close: 1,
          id_optical: formData.id_optical || 0,
        },
      ];
    });
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, files } = e.target as HTMLInputElement;
    if (type === "file" && files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };





  // 📍 Posición inicial: si tiene datos, usa los del backend, sino Facatativá
  const defaultCenter = formData.latitud && formData.longitud
    ? [parseFloat(formData.latitud), parseFloat(formData.longitud)]
    : [4.8166, -74.3545]; // Faca



  return (
    <div className="edit-container">
      <Navbar />

      <h2 className={styles.optical_title}>Editar Óptica</h2><br />
      <div className={styles.formContainer}>

        <form action="">
          <div className={styles.grid_container}>
            <div className={styles.grid_item1}>
              <label htmlFor="nameOp">Nombre de Óptica</label><br />
              <input className={styles.register_optical_input}
                type="text"
                name="nameOp"
                value={formData.nameOp}
                onChange={handleChange}
                required
              />

              <br />
              <br />
              <label htmlFor="descriptionOp">Descripcion</label>
              <textarea className={styles.register_optical_input_description}
                name="descriptionOp"
                id="descriptionOp"
                value={formData.descriptionOp}
                onChange={handleChange}
                required />

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
                        value={`${days.id_day}`}
                        checked={schedules.some((s) => s.day?.id_day === days.id_day)}
                        onChange={() => toggleDay(days.id_day)}

                      />
                      {days.name_day}
                    </label>
                  ))}

              </div>


            </div>

            <div className={styles.grid_item2}>

              <div className={styles.hours}>
                <label htmlFor="city" className={styles.label_form_optical}>¿En que ciudad esta ubicada?</label>
                <select
                  name="city" id=""
                  className={styles.select_optical}
                  value={formData.city || ""} // aquí enlazas el valor actual
                  onChange={handleChange}
                    >
                  <option value=""> seleccionar..</option>
                  {cities.map((city: any) => (
                    <option key={city.id_city} value={`${city.id_city}`}>{city.name}</option>
                  ))}
                </select>
              </div>

              <div className={styles.hours}>
                <label htmlFor="hour_aper" className={styles.label_form_optical}>Hora de Apertura</label>
                <select className={styles.select_optical}
                  name="hour_aper"
                  value={formData.hour_aper || ""}
                  onChange={handleChange}
                >
                  <option value="">Selecciona hora de apertura</option>
                  {hours.map((h: any) => (
                    <option key={h.id_hour} value={h.id_hour}>
                      {h.hour}
                    </option>
                  ))}
                </select>
                <label className={styles.label_form_optical} htmlFor="hour_close">Hora de Cierre</label>
                <select className={styles.select_optical}
                  name="hour_close"
                  value={formData.hour_close}
                  onChange={handleChange}
                >
                  <option value="">Selecciona hora de cierre</option>
                  {hours.map((h: any) => (
                    <option key={h.id_hour} value={h.id_hour}>
                      {h.hour}
                    </option>
                  ))}
                </select>
              </div>
              <br />
              <label htmlFor="logo">Logo (solo imágenes .jpg, .png)</label>
              <div className={styles.register_optical_input}>
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
            </div>

          </div>

          {/* 🗺️ Mapa Leaflet */}
          <div style={{ height: "400px", width: "100%", paddingTop: "13%" }}>
            <h3>Esta es la ubicacion actual de <strong>'{formData.nameOp}'</strong>  ¿Deseas actualizarla?</h3>
            <p> <strong>Latitud: </strong>{formData.latitud}   |   <strong>Longitud:    </strong> {formData.longitud}</p>
            <MapContainer
              key={`${formData.latitud}-${formData.longitud}`}
              center={defaultCenter}
              zoom={14}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution="© OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LocationMarker />
            </MapContainer>
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
