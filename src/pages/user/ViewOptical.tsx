import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCities, getOneOptical, deleteOptical,BASE_URL, getAllCatalogues, getAllProducts } from "../../services/api";
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
    descriptionOp:string;
    nameOp: string;
    address: string;
    tel: string;
    city: number;
    email: string;
    logo: File | string;
    user: number;
    certCadecuacion: File | string;
    certDispensacion: File | string;
    latitud: number;
    longitud: number;
  }
  interface Catalogue {
    id_catalogue: number;
    nameP: number;
    description: string;
    image?: string;
    price: number;
    optical: number;
  }
  interface City {
  id_city: number;
  name: string;
}

interface Product {
  id_product: number;
  nameProduct: string;
}

  const [optic, setOptic] = useState<Optical | null>(null);
  const [catalogue, setCatalogue] = useState<Catalogue[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [product, setProducts] =useState<Product[]>([]);

  
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

  useEffect(() => {
    if (id) {
      getAllCatalogues()
        .then((res) => {
          const data = res.data || res;
          const filtered = data.filter((item: Catalogue) => item.optical === Number(id));
          console.log("🧾 Catálogo filtrado:", filtered);
          setCatalogue(filtered);
        })
        .catch((err) => console.error("Error al obtener catálogos:", err));
    }
  }, [id]);

  useEffect(() => {
    const fetchProduct = async () => {
      const data = await getAllProducts();
      console.log("🌆 Producto cargadas:", data);
      setProducts(data);
    };
    fetchProduct();
  }, []);

  useEffect(() => {
    const fetchCities = async () => {
      const data = await getCities();
      console.log("🌆 Ciudades cargadas:", data);
      setCities(data);
    };
    fetchCities();
  }, []);


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
    <Navbar />

    {/* Banner */}
    <div className={styles.banner_container}>
      <img src={`${BASE_URL}${optic.logo}`} className={styles.banner} alt="banner" />
      <h1 className={styles.text_banner}>{optic?.nameOp}</h1>
    </div>

    {/* Sección descripción + datos */}
    <div className={styles.info_section}>
      <div className={styles.description_box}>
        <h2>Descripción de la Optica</h2>
        <p>{optic?.descriptionOp || "No hay descripción disponible."}</p>
      </div>

      <div className={styles.details_box}>
        <h2>Información de contacto</h2>
        <p><strong>Dirección:</strong> {optic.address}</p>
        <p><strong>Teléfono:</strong> {optic.tel}</p>
        <p><strong>Correo:</strong> {optic.email}</p>
        <p><strong>Ciudad:</strong> {cities.find(c => c.id_city === optic.city)?.name || "Sin ciudad"}</p>
      </div>
    </div>

    {/* Catálogo */}
  <div className={styles.catalogue_section}>
  <h2 className={styles.h2_title}>Catálogo de Productos y Servicios</h2>
  <div className={styles.catalogue_grid}>
    {catalogue.length > 0 ? (
      catalogue.map((item) => (
        <div key={item.id_catalogue} className={styles.catalogue_card}>
          {item.image ? (
            <img
              src={`http://127.0.0.1:8000${item.image}`}
              alt={item.description}
              className={styles.catalogue_img}
            />
          ) : (
            <div className={styles.catalogue_placeholder}>Sin imagen</div>
          )}
          <div className={styles.catalogue_info}>
            {/* 👇 Aquí el cambio importante */}
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
    <div className={styles.map_container}>
      <div id="map" className={styles.map}></div>
    </div>

    {/* Botones */}
    <div className={styles.button_div}>
      <Link to={`/addProduct/${optic.id_optical}`}>
      <button className={styles.edit_optic}>Agregar Productos</button>
      </Link>

      <Link to="/editO">
        <button className={styles.edit_optic}>Editar óptica</button>
      </Link>
      <button className={styles.delete} onClick={handleDelete}>
        Eliminar
      </button>
    </div>
  </div>
);


}
