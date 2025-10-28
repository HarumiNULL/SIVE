import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getDays, getHours, createOptical, getCities } from "../../services/api";
import styles from "./editOptical.module.css"
import Navbar from "../../components/Navbar";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { getOneOptical } from "../../services/api";
import { HelpCircle } from "lucide-react";
import "leaflet/dist/leaflet.css";
import InfoModal from "../../components/InfoModal"; // Componente modal

export default function EditOptical() {
  const navigate = useNavigate();
  const { id } = useParams();
  interface OpticalFormData {
    nameOp: string;
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
    lat: string;
    lng: string;
  }
  const [formData, setFormData] = useState<OpticalFormData>({
    nameOp: "",
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
    lat: "",
    lng: "",
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
          lat: lat.toFixed(6),
          lng: lng.toFixed(6),
        }));
      },
    });

    return formData.lat && formData.lng ? (
      <Marker position={[parseFloat(formData.lat), parseFloat(formData.lng)]} />
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
  // 🛰️ Si hay un id, obtener los datos de esa óptica
  useEffect(() => {
    if (id) {

      getOneOptical(Number(id))
        .then((data) => {
          console.log("📦 Datos recibidos de getOneOptical:", data);
          if (!data) return;
          console.log("📦 Días de la óptica:", data.day);
          setFormData((prev) => ({
            ...prev,
            nameOp: data.nameOp,
            address: data.address,
            tel: data.tel,
            city: data.city,
            email: data.email,
            lat: data.latitud ? String(data.latitud) : "",
            lng: data.longitud ? String(data.longitud) : "",
          }));
        })
        .catch((err) => console.error("Error al obtener la óptica:", err));
    }
  }, [id]);




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


  // 📍 Posición inicial del mapa: usa la de la óptica si existe, o Facatativá como fallback
  const defaultCenter: [number, number] = (() => {
    const lat = parseFloat(formData.lat);
    const lng = parseFloat(formData.lng);
    if (!isNaN(lat) && !isNaN(lng)) {
      return [lat, lng];
    }
    return [4.8166, -74.3545]; // Coordenadas por defecto (Facatativá)
  })();



  return (
    <div className="edit-container">
      <Navbar />

      <h2 className={styles.optical_title}>Editar Óptica</h2><br />
      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit}>
          <div className={styles.grid_container}>
            <div className={styles.grid_item1}>
              <label htmlFor="nameOp">Nombre de Óptica</label><br />
              <input
                className={styles.register_optical_input}
                type="text"
                name="nameOp"
                value={formData.nameOp}
                onChange={handleChange}
              />

              <br />
              <label htmlFor="address">Dirección</label><br />
              <input
                className={styles.register_optical_input}
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
              <br />
              <label htmlFor="tel">Teléfono</label><br />
              <input
                className={styles.register_optical_input}
                type="text"
                name="tel"
                value={formData.tel}
                onChange={handleChange}
              />
              <br />
              <label htmlFor="email">Correo de la óptica</label><br />
              <input
                className={styles.register_optical_input}
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              <br /><br />

              <label>¿Qué días tiene servicio la óptica?</label>
              <div className={styles.days}>
                {days
                  .sort((a: any, b: any) => a.id_day - b.id_day)
                  .map((day: any) => (
                    <label className={styles.option_day} key={day.id_day} htmlFor={`${day.id_day}`}>
                      <input
                        type="checkbox"
                        className={styles.option_check}
                        name={`day-${day.id_day}`}
                        id={`${day.id_day}`}
                        value={`${day.id_day}`}
                        checked={formData.day.includes(Number(day.id_day))}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          setFormData((prev) => ({
                            ...prev,
                            day: e.target.checked
                              ? [...prev.day, value]
                              : prev.day.filter((id) => id !== value),
                          }));
                        }}
                      />
                      {day.name_day}
                    </label>
                  ))}
              </div>
            </div>

            <div className={styles.grid_item2}>
              <div className={styles.hours}>
                <label htmlFor="city" className={styles.label_form_optical}>
                  ¿En qué ciudad está ubicada?
                </label>
                <select
                  name="city"
                  className={styles.select_optical}
                  value={formData.city}
                  onChange={handleChange}
                >
                  <option value=""> seleccionar..</option>
                  {cities.map((city: any) => (
                    <option key={city.id_city} value={`${city.id_city}`}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.hours}>
                <label htmlFor="hour_aper" className={styles.label_form_optical}>Hora de Apertura</label>
                <select
                  className={styles.select_optical}
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
                <select
                  className={styles.select_optical}
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

          <h3>
            Esta es tu ubicación actual de <strong>'{formData.nameOp}'</strong>. ¿Deseas actualizarla?
          </h3>
          <p>
            <strong>Latitud: </strong>
            {formData.lat} | <strong>Longitud: </strong>
            {formData.lng}
          </p>

          <div style={{ height: "400px", width: "100%" }}>
            <MapContainer center={defaultCenter} zoom={14} style={{ height: "100%", width: "100%" }}>
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

      {/* 🔹 Modal reutilizable para la info de certificados */}
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
