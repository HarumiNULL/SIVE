import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { getAllOpticals } from "../../services/api";
import defaultLogo from "../../assets/288-FOTO-Requisitos-para-optica-oftalmica.jpg";
import styles from "./listOptical.module.css"

interface Optical {
  id: number;
  nameOp: string;
  address: string;
  tel: string;
  email: string;
  logo?: string;
}

export default function ListOptical() {
  const [opticals, setOpticals] = useState<Optical[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllOptics = async () => {
      try {
        const data = await getAllOpticals();
        console.log("Ópticas recibidas:", data);
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
          <div className={styles.optical_cards}>
            {opticals.map((opt) => (
              <div key={opt.id} className={styles.optical_card}>
                <div className={styles.optical_info}>
                  <h3>{opt.nameOp}</h3>

                  <p>
                    Dirección: {opt.address} <br />
                    Teléfono: {opt.tel} <br />
                    Correo: {opt.email}
                  </p>

                  <div className={styles.optical_buttons}>
                    <button className={styles.visit_btn}>Visitar</button>
                    <a target="_blank" rel="noopener noreferrer">
                      Ver en el mapa
                    </a>
                  </div>
                </div>

                <div className={styles.optical_image}>
                  <img
                    src={defaultLogo}
                    alt={opt.nameOp}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
