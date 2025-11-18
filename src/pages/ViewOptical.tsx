import { useEffect, useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { getOneOptical, deleteOptical } from "../services/api";
import LoadingView from "./LoadingView";
import L from "leaflet"; // 👈 Importa Leaflet correctamente
import "leaflet/dist/leaflet.css"; // 👈 Importa los estilos CSS
import "./viewOptical.css";

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
        .then((res) => setOptic(res.data))
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

  // Inicializar el mapa una vez que optic esté cargado
  useEffect(() => {
    if (!optic) return;
    //console.log("Datos recibidos de la API:", optic);
    const lat = optic.latitud; // fallback Bogotá
    const lng = optic.longitud;

    const map = L.map("map").setView([lat, lng], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
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
    <div className="home-container">
      {/* Encabezado */}
      <header className="home-header">
        <div className="home-logo">
          <img src="/src/assets/sunglasses.png" alt="Logo" className="logo-img" />
          <span>S I V E</span>
        </div>

        <div className="home-buttons">
          <Link to="/" className="btn ver">
            inicio
          </Link>
          <Link to="/editO" className="btn ver">
            Editar óptica
          </Link>
          <Link to="/login" className="btn cerrar">
            Cerrar Sesión
          </Link>
        </div>
      </header>

      {/* Contenido principal */}
      <div>
        <img src={optic?.logo} className="banner" alt="" />
        <h1 className="text-banner">{optic?.nameOp}</h1>
      </div>

      <div className="grid-container">
        <div className="grid-item1">
          <h1 className="optic-title">{optic?.nameOp}</h1>
          <p className="optic-description">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua.
          </p>
          <h3 className="subtitle">Servicios</h3>
          <ul className="services-list">
            <li>Examen de la vista</li>
            <li>Venta de lentes</li>
            <li>Venta de armazones</li>
          </ul>
        </div>

        {/* Mapa */}
        <div className="grid-item2">
          <div id="map" style={{ height: "400px" }}></div>
        </div>

        <div className="grid-item3">
          <div className="button-div">
            <Link to="/editO">
              <button className="edit_optic">Editar óptica</button>
            </Link>
            <button className="delete" onClick={handleDelete}>
              Eliminar
            </button>
          </div>
        </div>

        <div className="grid-item4">
          <h2 className="h2-title">Comentarios</h2>
          <div className="comments">
            <p className="comments-p">No hay comentarios aún.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
