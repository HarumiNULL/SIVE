import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  getCities,
  getOneOptical,
  getScheduleByOptical,
  deleteOptical,
  BASE_URL,
  getAllCatalogues,
  getAllProducts,
  logoutUser,
} from "../../services/api";
import LoadingView from "../LoadingView";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Navbar from "../../components/Navbar";
import styles from "./viewOptical.module.css";
import { useAuth } from "../../components/AuthContext";

export default function View_optical() {
  const { isAuthenticated, verifiedOwner } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const { role, opticalId, loading, logout } = useAuth();
  const ROL_DUENO = 2;
  const [optic, setOptic] = useState<any>(null);
  const [catalogue, setCatalogue] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [product, setProducts] = useState<any[]>([]);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  if (loading) return <LoadingView />;

  // Obtener óptica
  useEffect(() => {
    if (!id) return;
    getOneOptical(Number(id))
      .then((res) => setOptic(res))
      .catch(() => setError("No se pudo cargar la óptica."));
  }, [id]);

  // Catálogos
  useEffect(() => {
    if (!id) return;
    getAllCatalogues()
      .then((res) => {
        const data = res.data || res;
        setCatalogue(data.filter((c: any) => c.optical === Number(id)));
      })
      .catch(console.error);
  }, [id]);

  // Productos
  useEffect(() => {
    getAllProducts().then(setProducts).catch(console.error);
  }, []);

  // Horarios
  useEffect(() => {
    if (!optic?.id_optical) return;
    getScheduleByOptical(optic.id_optical)
      .then(setSchedules)
      .catch(console.error);
  }, [optic]);

  // Ciudades
  useEffect(() => {
    getCities().then(setCities).catch(console.error);
  }, []);

  // Eliminar
  const handleDelete = async () => {
    if (!optic?.id_optical) return;
    if (!window.confirm("¿Eliminar esta óptica?")) return;
    try {
      await deleteOptical(optic.id_optical);
      alert("Óptica eliminada ✅");
      try {
        await logoutUser();
        navigate("/");
      } catch (error) {
        console.error("Error cerrando sesión en el servidor:", error);
      } finally {
        logout();
      }
    } catch {
      alert("Error al eliminar ❌");
    }
  };

  // **Inicializar mapa solo si existe el div**
  useEffect(() => {
    if (!optic?.latitud || !optic?.longitud) return;

    const mapContainer = document.getElementById("map");
    if (!mapContainer) return;

    const map = L.map(mapContainer).setView([optic.latitud, optic.longitud], 20);
    L.tileLayer(`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`, {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    L.marker([optic.latitud, optic.longitud])
      .addTo(map)
      .bindPopup(optic.nameOp)
      .openPopup();

    return () => map.remove();
  }, [optic]);

  if (!optic) return <LoadingView />;

  return (
    <div className={styles.home_container}>
      <Navbar />

      {/* Banner */}
      <div className={styles.banner_container}>
        <img src={`${BASE_URL}${optic.logo}`} className={styles.banner} alt="banner" />
        <h1 className={styles.text_banner}>{optic.nameOp}</h1>
      </div>
      {/* Mensaje de verificación */}
      {role === ROL_DUENO && (
        <div className={styles.verification_message}>
          {isAuthenticated ? (
            verifiedOwner ? (
              <p className={styles.verified}>✅ Tu óptica ha sido aceptada correctamente.</p>
            ) : (
              <p className={styles.not_verified}>⚠️ Tu óptica aún no ha sido verificada.</p>
            )
          ) : (
            <p className={styles.not_verified}>⚠️ Debes iniciar sesión para ver el estado de tu óptica.</p>
          )}
        </div>
      )}

      {/* Info */}
      <div className={styles.info_section}>
        <div className={styles.description_box}>
          <h2>Descripción</h2>
          <p>{optic.descriptionOp || "No hay descripción disponible."}</p>
        </div>
        <div className={styles.details_box}>
          <h2>Información de contacto</h2>
          <p><strong>Dirección:</strong> {optic.address}</p>
          <p><strong>Teléfono:</strong> {optic.tel}</p>
          <p><strong>Correo:</strong> {optic.email}</p>
          <p>
            <strong>Ciudad:</strong>{" "}
            {cities.find((c) => c.id_city === optic.city)?.name || "Sin ciudad"}
          </p>
        </div>
        {/* Horarios */}
        <div className={styles.week_calendar}>
          <h2 className={styles.calendar_title}>Horario de Atención</h2>
          {schedules.length > 0 ? (
            <div className={styles.calendar_grid}>
              {["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"].map(day => {
                const schedule = schedules.find(s => s.day?.name_day === day);
                return (
                  <div key={day} className={styles.calendar_cell}>
                    <div className={styles.day_header}>{day}</div>
                    <div className={styles.time_slot}>
                      {schedule
                        ? `${schedule.hour_aper?.hour.slice(0, 5) || "N/A"} - ${schedule.hour_close?.hour.slice(0, 5) || "N/A"}`
                        : "Cerrado"}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className={styles.no_schedule}>No hay horarios disponibles.</p>
          )}
        </div>
      </div>

      {/* Catálogo */}
      <div className={styles.catalogue_section}>
        <h2 className={styles.h2_title}>Catálogo de Productos y Servicios</h2>
        <div className={styles.catalogue_grid}>
          {catalogue.length > 0 ? (
            catalogue.map(item => (
              <div key={item.id_catalogue} className={styles.catalogue_card}>
                {item.image ? (
                  <img src={`${BASE_URL}${item.image}`} alt={item.description} className={styles.catalogue_img} />
                ) : (
                  <div className={styles.catalogue_placeholder}>Sin imagen</div>
                )}
                <div className={styles.catalogue_info}>
                  <h4 className={styles.catalogue_name}>
                    {product.find(p => p.id_product === item.nameP)?.nameProduct || "Producto desconocido"}
                  </h4>
                  <p className={styles.catalogue_desc}>{item.description}</p>
                  <p className={styles.catalogue_price}>${item.price}</p>
                </div>
              </div>
            ))
          ) : (
            <p className={styles.no_products}>No hay productos en el catálogo.</p>
          )}
        </div>
      </div>

      {/* Mapa */}
      {optic.latitud && optic.longitud ? (
        <div className={styles.map_container}>
          <div id="map" className={styles.map}></div>
        </div>
      ) : (
        <p style={{ textAlign: "center", marginTop: "1rem" }}>📍 No hay ubicación registrada.</p>
      )}

      {/* Botones solo para dueño */}
      {role === ROL_DUENO && (
        <div className={styles.button_div}>
          <Link to={`/addProduct/${optic.id_optical}`}>
            <button className={styles.edit_optic}>Agregar Productos</button>
          </Link>
          <Link to={`/editO/${id}`}>
            <button className={styles.edit_optic}>Editar óptica</button>
          </Link>
          <button className={styles.delete} onClick={handleDelete}>Eliminar</button>
        </div>
      )}
    </div>
  );
}
