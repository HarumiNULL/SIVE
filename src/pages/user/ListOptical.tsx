import { useEffect, useState, } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { getAllOpticals } from "../../services/api";
import defaultLogo from "../../assets/288-FOTO-Requisitos-para-optica-oftalmica.jpg";
import styles from "./listOptical.module.css";

interface Optical {
  id_optical: number;
  nameOp: string;
  address: string;
  tel: string;
  email: string;
  logo?: string;
  logo?: string;
}

export default function ListOptical() {
  const [opticals, setOpticals] = useState<Optical[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 4;

  useEffect(() => {
    const fetchAllOptics = async () => {
      try {
        const data = await getAllOpticals();
        console.log("Ópticas recibidas:", data);
        if (Array.isArray(data) && data.length > 0) {
          console.log("Primer id_optical:", data[0].id_optical);
        }
        setOpticals(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error cargando ópticas:", error);
        setOpticals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllOptics();
  }, []);

  // Paginación
  const totalPages = Math.ceil(opticals.length / ITEMS_PER_PAGE);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentOpticals = opticals.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // Generar páginas dinámicamente
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 5) {
      // Si son pocas páginas, muéstralas todas
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      // Mostrar estructura tipo: 1 ... 4 5 6 ... 10
      if (currentPage <= 3) {
        pages.push(1, 2, 3, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <>
      <Navbar />
      <div className={styles.optical_list_container}>
        <h2>Ópticas</h2>

        {loading ? (
          <p>Cargando ópticas...</p>
        ) : opticals.length === 0 ? (
          <p>No se encontraron ópticas.</p>
        ) : (
          <>
            {/* Tarjetas */}
            <div className={styles.optical_cards}>
              {currentOpticals.map((opt) => (
                <div key={opt.id_optical} className={styles.optical_card}>
                  
                  <div className={styles.optical_image}>
                    <img src={opt.logo || defaultLogo} alt={opt.nameOp} />
                  </div>

                  <div className={styles.optical_info}>
                    <h3>{opt.nameOp}</h3>
                    <p>
                      Dirección: {opt.address} <br />
                      Teléfono: {opt.tel} <br />
                      Correo: {opt.email}
                    </p>
                    <div className={styles.optical_buttons}>
                    <Link to={`/viewO/${opt.id_optical}`}>visita optica</Link>
                      <button className={styles.visit_btn}>Visitar</button>
                      <a target="_blank" rel="noopener noreferrer">
                        Ver en el mapa
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className={styles.pagination}>
                {/* Botón Anterior */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`${styles.navBtn} ${
                    currentPage === 1 ? styles.disabled : ""
                  }`}
                >
                  ←
                </button>

                {/* Números dinámicos */}
                {pages.map((page, index) =>
                  page === "..." ? (
                    <span key={`dots-${index}`} className={styles.dots}>
                      ...
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page as number)}
                      className={`${styles.pageBtn} ${
                        currentPage === page ? styles.activePage : ""
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}

                {/* Botón Siguiente */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`${styles.navBtn} ${
                    currentPage === totalPages ? styles.disabled : ""
                  }`}
                >
                  →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
