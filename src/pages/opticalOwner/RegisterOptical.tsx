import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getDays, getHours, createOptical, getCities,logoutUser } from "../../services/api";
import { useAuth } from "../../components/AuthContext";
import styles from "./registerOptical.module.css"
import Navbar from "../../components/Navbar";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";

import { getOneOptical, createSchedule, createScheduleByUrl } from "../../services/api";
import { HelpCircle } from "lucide-react";
import InfoModal from "../../components/InfoModal";


export default function EditOptical() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { role, idUser, logout } = useAuth();
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
  const [openInfo, setOpenInfo] = useState<{ title: string; content: string } | null>(null);



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
      <Marker
        position={[parseFloat(formData.latitud), parseFloat(formData.longitud)]}
      />
    ) : null;
  };

  // 📡 Cargar datos iniciales del backend
  useEffect(() => {
    const fetchData = async () => {
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


    fetchData();
  }, []);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("nameOp", formData.nameOp);
      formDataToSend.append("descriptionOp",formData.descriptionOp)
      formDataToSend.append("address", formData.address);
      formDataToSend.append("tel", formData.tel);
      formDataToSend.append("city", formData.city);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("latitud", formData.latitud);
      formDataToSend.append("longitud", formData.longitud);
      if (formData.logo) formDataToSend.append("logo", formData.logo);
      if (formData.certCadecuacion)
        formDataToSend.append("certCadecuacion", formData.certCadecuacion);
      if (formData.certDispensacion)
        formDataToSend.append("certDispensacion", formData.certDispensacion);

      // 🔹 Verifica los datos antes de enviar
      for (let [key, value] of formDataToSend.entries()) {
        console.log(`${key}:`, value);
      }

      // ✅ Envía al backend
      const opticalCreated = (await createOptical(formDataToSend)) as OpticalFormData;
      const opticalId = opticalCreated.id_optical;
      console.log("🆔 Óptica creada con ID:", opticalId);

      // 🧭 2️⃣ Crear schedules por cada día seleccionado
      for (const day of formData.day) {
        const scheduleData = {
          day_id: day,
          hour_aper_id: formData.hour_aper,   // ID de la hora de apertura
          hour_close_id: formData.hour_close, // ID de la hora de cierre
          optical_id: opticalId,
        };
        try {
          await createSchedule(scheduleData);
          console.log(`✅ Horario creado para el día ${day}`);
        } catch (err) {
          console.error(`❌ Error creando horario del día ${day}:`, err);
        }

        /*console.log("📅 Creando horario:", scheduleData);
        await createSchedule(scheduleData);*/
      }
      if (role === 3) { // usuario
        try {
          await fetch(`/api/users/${userId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              first_name: "", // si lo quieres mantener igual puedes leerlo
              last_name: "",
              email: "",      // el mismo email del usuario logueado
              role: 2,        // 2 = dueño
              state: 1,       // activo
            }),
          });
          console.log("✅ Rol actualizado a dueño");
        } catch (err) {
          console.error("❌ Error actualizando rol:", err);
        }
      }
      alert("✅ Óptica y horarios registrados correctamente.");
      try {
        await logoutUser();
        navigate("/");
      } catch (error) {
        console.error("Error cerrando sesión en el servidor:", error);
      } finally {
        logout();
      }

    } catch (error: any) {
      console.error("❌ Error en el registro de óptica:", error);

      // 🧠 Manejo de error específico si el correo ya existe
      if (error.response && error.response.data.email) {
        alert("⚠️ El correo ya está registrado. Usa otro distinto.");
      } else {
        alert("Ocurrió un error al registrar la óptica. Intenta nuevamente.");
      }
    }
  };



  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement| HTMLTextAreaElement>) => {
    const { name, value, type, files } = e.target as HTMLInputElement;

    // Si es un archivo
    if (type === "file" && files) {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    } else {
      // Cualquier otro input o select
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // 📍 Posición inicial: si tiene datos, usa los del backend, sino Facatativá
  const defaultCenter =
    formData.latitud && formData.longitud
      ? [parseFloat(formData.latitud), parseFloat(formData.longitud)]
      : [4.8166, -74.3545]; // fallback a Facatativá



  return (
    <div className="edit-container">
      <Navbar />

      <h2 className={styles.optical_title}>Registrar Óptica</h2><br />
      <div className={styles.formContainer}>

        <form onSubmit={handleSubmit}>
          <div className={styles.grid_container}>
            <div className={styles.grid_item1}>
              <label htmlFor="nameOp">Nombre de Óptica</label><br />
              <input className={styles.register_optical_input}
                type="text"
                name="nameOp"
                onChange={handleChange}
                required
              />

              <br />
              <label htmlFor="descriptionOp">Agrega una descripcion de tu optica</label>
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
                onChange={handleChange}
                required
              />
              <br />
              <label htmlFor="tel">Teléfono</label><br />
              <input className={styles.register_optical_input}
                type="text"
                name="tel"
                onChange={handleChange}
                required
              />
              <br />
              <label htmlFor="email">Correo de la optica</label><br />
              <input className={styles.register_optical_input}
                type="email"
                name="email"
                onChange={handleChange}
                required
              />
              <br />
              <br />
              <label >¿Que dias tiene servicio la optica?</label>
              <div className={styles.days}>
                {days
                  .sort((a: any, b: any) => a.id_day - b.id_day)
                  .map((dayItem: any) => (
                    <label className={styles.option_day} key={dayItem.id_day}>
                      <input
                        type="checkbox"
                        className={styles.option_check}
                        value={dayItem.id_day}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setFormData((prev) => ({
                            ...prev,
                            day: checked
                              ? [...prev.day, dayItem.id_day]
                              : prev.day.filter((d) => d !== dayItem.id_day),
                          }));
                        }}
                      />
                      {dayItem.name_day}
                    </label>
                  ))}
              </div>
              <br /><br /><br />
            </div>

            <div className={styles.grid_item2}>

              <div className={styles.cities}>
                <label htmlFor="city" className={styles.label_form_optical}>¿En que ciudad esta ubicada?</label>
                <select required name="city" id="" className={styles.select_optical} onChange={(e) => setFormData({ ...formData, city: e.target.value })}>
                  <option value=""> seleccionar..</option>
                  {cities.map((city: any) => (
                    <option key={city.id_city} value={`${city.id_city}`}>{city.name}</option>
                  ))}
                </select>
              </div>

              <div className={styles.hours}>
                <label htmlFor="hour_aper" className={styles.label_form_optical}>Hora de Apertura</label>
                <select required className={styles.select_optical}
                  name="hour_aper"
                  value={formData.hour_aper}
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
                <select required className={styles.select_optical}
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
              <div className="form-group">
                <input
                  className={styles.input_file}
                  type="file"
                  name="logo"
                  accept=".jpg,.jpeg,.png"
                  onChange={handleChange}
                  required
                />
              </div>
              <label htmlFor="certCadecuacion">
                Certificado de Adecuación (solo PDF)
                <HelpCircle
                  size={18}
                  className={styles.info_icon_inline}
                  onClick={() =>
                    setOpenInfo({
                      title: "Certificado de Adecuación",
                      content: `Este certificado acredita que la óptica cumple con la normativa vigente.

Para mayor información ingresar a: https://saludambiental.saludcapital.gov.co/medicamentos_Opticas`,
                    })
                  }
                />
              </label>
              <div className="form-group">
                <input
                  className={styles.input_file}
                  type="file"
                  name="certCadecuacion"
                  accept=".pdf"
                  onChange={handleChange}
                  required
                />
              </div>


              <label htmlFor="certDispensacion">
                Certificado de Dispensación (solo PDF)
                <HelpCircle
                  size={18}
                  className={styles.info_icon_inline}
                  onClick={() =>
                    setOpenInfo({
                      title: "Certificado de Dispensación",
                      content: `Este certificado garantiza que la óptica está autorizada para dispensar medicamentos y productos ópticos.

Para mayor información ingresar a: https://saludambiental.saludcapital.gov.co/medicamentos_Opticas`,
                    })
                  }
                />
              </label>
              <div className="form-group">
                <input
                  className={styles.input_file}
                  type="file"
                  name="certDispensacion"
                  accept=".pdf"
                  onChange={handleChange}
                  required
                />
              </div>


            </div>

          </div>

          {/* 🗺️ Mapa Leaflet */}
          <div style={{ height: "400px", width: "100%", paddingTop: "13%" }}>
            <h3>Selecciona la ubicacion de tu optica dando clic en el mapa</h3>
            <p> <strong>Latitud: </strong>{formData.latitud}   |   <strong>Longitud:    </strong> {formData.longitud}</p>
            <MapContainer
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

          <div className={styles.form_buttons}>
            <button type="submit" className="btn editar">
              Guardar Cambios
            </button>
          </div>

        </form>

      </div>

      {openInfo && (
        <InfoModal
          isOpen={!!openInfo}
          title={openInfo.title}
          content={openInfo.content}
          onClose={() => setOpenInfo(null)}
        />
      )}

    </div>

  );
}
