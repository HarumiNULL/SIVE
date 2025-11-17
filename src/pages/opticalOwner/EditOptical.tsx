import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getDays, getHours, getCities, getOneOptical, type Schedule, getAllSchedules, BASE_URL, updateOptical, updateSchedule, createScheduleNew } from "../../services/api";
import styles from "./editOptical.module.css"
import Navbar from "../../components/Navbar";
import Swal from "sweetalert2";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { HelpCircle } from "lucide-react";
import InfoModal from "../../components/InfoModal";

export default function EditOptical() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [initialData, setInitialData] = useState<OpticalFormData | null>(null);
  const [initialSchedules, setInitialSchedules] = useState<Schedule[]>([]);
  // ✅ Tipo más claro para Schedule
  interface ScheduleForm {
    id_schedule: number;
    day_id: number;          // el id del día
    hour_aper_id: number;    // id hora apertura
    hour_close_id: number;   // id hora cierre
    optical_id: number;
  }

  // Estado para manejar los schedules
  const [schedules, setSchedules] = useState<ScheduleForm[]>([]);

  interface OpticalFormData {
    id_optical: number;
    nameOp: string;
    descriptionOp: string;
    address: string;
    tel: string;
    city: string;
    email: string;
    logo: File | string | null;                // archivo nuevo
    logoActual: string;               // archivo existente en backend
    certCadecuacion: File | null;     // archivo nuevo
    certCadecuacionActual: string;    // archivo existente en backend
    certDispensacion: File | null;    // archivo nuevo
    certDispensacionActual: string;
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
    // solo los archivos nuevos que suba el usuario
    logo: null,
    certCadecuacion: null,
    certDispensacion: null,
    // los paths actuales del backend
    logoActual: "",
    certCadecuacionActual: "",
    certDispensacionActual: "",
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
        const schedulesOptical: ScheduleForm[] = allSchedules
          .filter((s: any) => s.optical_id === Number(id))
          .map((s: any) => ({
            id_schedule: s.id_schedule,
            day_id: s.day.id_day,
            hour_aper_id: s.hour_aper.id_hour,
            hour_close_id: s.hour_close.id_hour,
            optical_id: s.optical_id,
          }));

        // ⚠️ Declaramos firstSchedule antes de usarlo
        //const firstSchedule = schedulesOptical[0];
        const firstSchedule = schedulesOptical.length > 0 ? schedulesOptical[0] : undefined;



        //console.log("📦 Todos los schedules:", allSchedules);
        //console.log("PRIMER SCHEDULE: ", firstSchedule)
        //console.log("🧩 IDs de ópticas con horarios:", allSchedules.map((s: any) => s.optical_id));

        //console.log("🧿 ID de la óptica actual:", id);

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
          logoActual: opticalData.logo || "",
          certCadecuacionActual: opticalData.certCadecuacion || "",
          certDispensacionActual: opticalData.certDispensacion || "",
          logo: null,
          certCadecuacion: null,
          certDispensacion: null,
          day: opticalData.day || [],
          hour_aper: firstSchedule ? String(firstSchedule.hour_aper_id) : "",
          hour_close: firstSchedule ? String(firstSchedule.hour_close_id) : "",
          latitud: opticalData.latitud ? String(opticalData.latitud) : "",
          longitud: opticalData.longitud ? String(opticalData.longitud) : "",
        }));

        //console.log("✅ Horarios de la óptica filtrados:", schedulesOptical);
        setSchedules(schedulesOptical);
        setInitialData({
          ...opticalData,
          logo: opticalData.logo || null,
          certCadecuacion: opticalData.certCadecuacion || null,
          certDispensacion: opticalData.certDispensacion || null,
        });
        setInitialSchedules(schedulesOptical);



      });
    }
  }, [id]);

  // 🔹 toggleDay para agregar o quitar días
  const toggleDay = (dayId: number) => {
    setSchedules((prev) => {
      // Si ya existe el día, lo quitamos
      if (prev.some((s) => s.day_id === dayId)) {
        return prev.filter((s) => s.day_id !== dayId);
      }
      // Si no existe, agregamos uno nuevo con valores por defecto
      return [
        ...prev,
        {
          id_schedule: 0,
          day_id: dayId,
          hour_aper_id: 1,   // valor por defecto
          hour_close_id: 1,  // valor por defecto
          optical_id: formData.id_optical,
        },
      ];
    });
  };

  // 🔹 handleHourChange para actualizar la hora de apertura/cierre de un día
  const handleHourChange = (id_schedule: number, type: "aper" | "close", value: string) => {
    setSchedules((prev) =>
      prev.map((s) =>
        s.id_schedule === id_schedule || (s.id_schedule === 0 && s.day_id === id_schedule)
          ? {
            ...s,
            hour_aper_id: type === "aper" ? Number(value) : s.hour_aper_id,
            hour_close_id: type === "close" ? Number(value) : s.hour_close_id,
          }
          : s
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!initialData) return;

      const data = new FormData();

      // ✅ Comparar y enviar solo campos que cambiaron (texto)
      ["nameOp", "descriptionOp", "address", "tel", "city", "email", "latitud", "longitud"].forEach((key) => {
        const current = formData[key as keyof OpticalFormData];
        const original = initialData[key as keyof OpticalFormData];
        if (current !== original && current !== "") {
          data.append(key, current as string);
        }
      });

      // ✅ Archivos: enviar solo si cambió
      if (formData.logo instanceof File) data.append("logo", formData.logo);
      if (formData.certCadecuacion instanceof File) data.append("certCadecuacion", formData.certCadecuacion);
      if (formData.certDispensacion instanceof File) data.append("certDispensacion", formData.certDispensacion);

      // ✅ Actualizar óptica solo si hay cambios
      if (
        data.has("nameOp") ||
        data.has("address") ||
        data.has("tel") ||
        data.has("city") ||
        data.has("email") ||
        data.has("latitud") ||
        data.has("longitud") ||
        data.has("logo") ||
        data.has("certCadecuacion") ||
        data.has("certDispensacion")
      ) {
        await updateOptical(formData.id_optical, data);
      }

      // 🔹 Actualizar schedules correctamente
      for (const s of schedules) {
        const original = initialSchedules.find((sch) => sch.id_schedule === s.id_schedule);

        const scheduleData = {
          day_id: s.day_id,
          hour_aper_id: s.hour_aper_id,
          hour_close_id: s.hour_close_id,
          optical_id: formData.id_optical,
        };

        if (!s.id_schedule || s.id_schedule === 0) {
          await createScheduleNew(scheduleData);
        } else if (
          scheduleData.day_id !== original?.day?.id_day ||
          scheduleData.hour_aper_id !== original?.hour_aper?.id_hour ||
          scheduleData.hour_close_id !== original?.hour_close?.id_hour
        ) {
          await updateSchedule(s.id_schedule, scheduleData);
        }
      }



      await Swal.fire({
        icon: "success",
        title: "Cambios guardados",
        text: "La óptica y los horarios fueron actualizados correctamente.",
        timer: 2000,
        showConfirmButton: false,
      });

      navigate(`/viewO/${formData.id_optical}`);

    } catch (error) {
      console.error("Error al actualizar óptica y horarios:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al actualizar la óptica.",
      });

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
                  .map((days: any) => (
                    <label className={styles.option_day} key={days.id_day} htmlFor={`${days.id_day}`}>
                      <input type="checkbox" className={styles.option_check}
                        name={`day-${days.id_day}`}
                        id={`${days.id_day}`}
                        value={`${days.id_day}`}
                        checked={schedules.some((s) => s.day_id === days.id_day)}
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
                  value={formData.city || ""}
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
                  value={formData.hour_aper || ""}
                  onChange={handleChange}
                >
                  <option value="">Selecciona hora de apertura</option>
                  {hours.map((h: any) => (
                    <option key={h.id_hour} value={`${h.id_hour}`}>
                      {h.hour}
                    </option>
                  ))}
                </select>

                <label className={styles.label_form_optical} htmlFor="hour_close">Hora de Cierre</label>
                <select
                  className={styles.select_optical}
                  name="hour_close"
                  value={formData.hour_close || ""}
                  onChange={handleChange}
                >
                  <option value="">Selecciona hora de cierre</option>
                  {hours.map((h: any) => (
                    <option key={h.id_hour} value={String(h.id_hour)}>
                      {h.hour}
                    </option>
                  ))}
                </select>
              </div>
              <br />
              {/* Logo */}
              <label htmlFor="logo">Logo (solo imágenes .jpg, .png)</label>
              <div className={styles.register_optical_input}>
                <input
                  className={styles.input_file}
                  type="file"
                  name="logo"
                  accept=".jpg,.jpeg,.png"
                  onChange={handleChange}
                />
                {/* Mostrar logo actual o seleccionado */}
                {formData.logo && typeof formData.logo === "string" && (
                  <div style={{ marginTop: "5px" }}>
                    <img
                      src={`${BASE_URL}${formData.logo}`}
                      alt={formData.nameOp}
                      style={{ width: "100px", height: "100px", objectFit: "cover" }}
                    />
                  </div>
                )}
                {formData.logo && formData.logo instanceof File && (
                  <div style={{ marginTop: "5px" }}>
                    <img
                      src={URL.createObjectURL(formData.logo)}
                      alt="Nuevo logo"
                      style={{ width: "100px", height: "100px", objectFit: "cover" }}
                    />
                  </div>
                )}
              </div>
              {/* Certificado de Adecuación */}

              <label htmlFor="certCadecuacion">Certificado de Adecuación (solo PDF)
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
              <input
                type="file"
                name="certCadecuacion"
                accept=".pdf"
                onChange={handleChange}
              />
              {formData.certCadecuacion && typeof formData.certCadecuacion === "string" && (
                <div className={styles.current_file}>
                  <a href={`${BASE_URL}${formData.certCadecuacion}`} target="_blank" rel="noopener noreferrer">
                    Ver certificado actual
                  </a>
                </div>
              )}

              {/* Certificado de Dispensación */}
              <label htmlFor="certDispensacion">Certificado de Dispensación (solo PDF)
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
              <input
                type="file"
                name="certDispensacion"
                accept=".pdf"
                onChange={handleChange}
              />
              {formData.certDispensacion && typeof formData.certDispensacion === "string" && (
                <div className={styles.current_file}>
                  <a href={`${BASE_URL}${formData.certDispensacion}`} target="_blank" rel="noopener noreferrer">
                    Ver certificado actual
                  </a>
                </div>
              )}
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

          <div className={styles.form_buttons}>
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
