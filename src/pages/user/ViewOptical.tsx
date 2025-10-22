import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOneOptical, deleteOptical } from "../../services/api";
import { Link } from "react-router-dom";
import LoadingView from "../LoadingView";
import L from "leaflet"; // 👈 Importa Leaflet correctamente
import "leaflet/dist/leaflet.css"; // 👈 Importa los estilos CSS
import Navbar from "../../components/Navbar";
import styles from "./viewOptical.module.css"
export default function View_optical() {
  const navigate = useNavigate();
  const { id } = useParams();

  interface Optical {
    id_optical: number;
    nameOp: string;
    address: string;
    tel: string;
    city: number;
    email: string;
    logo: string;
    user: number;
    certCadecuacion: string;
    certDispensacion: string;
    latitud: number;
    longitud: number;
  }

  const [optic, setOptic] = useState<Optical | null>(null);

  useEffect(() => {
    if (id) { // Asegúrate de que el id exista antes de hacer la llamada
      getOneOptical(Number(id))
        .then((res) => {
          console.log("Respuesta de la API:", res);
          setOptic(res);
    })
        .catch((err) => console.error("Error al obtener la óptica:", err));
    }
  }, [id]); 

  const handleDelete = async () => {
    if (!optic?.id_optical) return;
    const confirmDelete = window.confirm("¿Estás seguro de eliminar esta óptica?");
    if (confirmDelete) {
      try {
        await deleteOptical(Number(optic?.id_optical));
        alert("Óptica eliminada correctamente ✅");
        navigate("/");
      } catch (error) {
        console.error(error);
        alert("Error al eliminar la óptica ❌");
      }
    }
  };
  console.log(optic)

  // Inicializar el mapa una vez que optic esté cargado
  useEffect(() => {
    if (!optic) return;
    console.log("Datos recibidos de la API:", optic);
    const lat = optic.latitud; // fallback Bogotá
    const lng = optic.longitud;
    console.log("Latitud:", optic.latitud, "Longitud:", optic.longitud);  
    const map = L.map("map").setView([lat, lng], 20);

    L.tileLayer(`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`, {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    L.marker([lat, lng])
      .addTo(map)
      .bindPopup(optic.nameOp)
      .openPopup();
    return () => {
      map.remove(); // limpia el mapa al desmontar
    };
  }, [optic]);
  
  if (!optic) return <LoadingView />;

  return (
    <div className={styles.home_container}>
      <Navbar/>
    
      {/* Contenido principal */}
      <div>
        <img src={optic?.logo} className={styles.banner} alt="" />
        <h1 className={styles.text_banner}>{optic?.nameOp}</h1>
      </div>

      <div className={styles.grid_container}>
        <div className={styles.grid_item1}>
          <h1 className={styles.optic_title}>{optic?.nameOp}</h1>
          <p className={styles.optic_description}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua.
          </p>
          <h3 className={styles.subtitle}>Servicios</h3>
          <ul className={styles.services_list}>
            <li>Examen de la vista</li>
            <li>Venta de lentes</li>
            <li>Venta de armazones</li>
          </ul>
        </div>

        {/* Mapa */}
        <div className={styles.grid_item2}>
          <div id="map" style={{ height: "400px" }}></div>
        </div>

        <div className={styles.grid_item3}>
          <div className={styles.button_div}>
            <Link to="/editO">
              <button className={styles.edit_optic}>Editar óptica</button>
            </Link>
            <button className={styles.delete} onClick={handleDelete}>
              Eliminar
            </button>
          </div>
        </div>

        <div className={styles.grid_item4}>
          <h2 className={styles.h2_title}>Comentarios</h2>
          <div className={styles.comments}>
            <p className={styles.comments_p}>No hay comentarios aún.</p>
          </div>
        </div>
      </div>
    </div>
  );
}