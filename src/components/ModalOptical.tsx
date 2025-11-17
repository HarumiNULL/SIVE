import { useEffect, useState } from "react";
import { getOneOptical, BASE_URL } from "../services/api";
import styles from "./ModalOptical.module.css";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  id: number;
}

export default function ModalOptical({ open, onClose, id }: ModalProps) {
  const [optic, setOptic] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    setLoading(true);
    getOneOptical(id)
      .then((data) => {
        setOptic(data);
        setError(null);
      })
      .catch(() => setError("No se pudo cargar la óptica"))
      .finally(() => setLoading(false));
  }, [open, id]);

  if (!open) return null;

  return (
    <div className={styles.overlay}>
      {/* CARD CENTRAL */}
      <div className={styles.card}>

        {/* BOTÓN CERRAR */}
        <button onClick={onClose} className={styles.closeBtn}>✕</button>

        <h2 className={styles.title}>Detalles de la Óptica</h2>

        {loading && <p>Cargando...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {optic && (
          <div className={styles.container}>

            {/* INFO PRINCIPAL */}
            <div className={styles.infoGrid}>

              {/* Datos */}
              <div className={styles.textBlock}>
                <p><strong>Nombre:</strong> {optic.nameOp}</p>
                <p><strong>Descripción:</strong> {optic.descriptionOp}</p>
                <p><strong>Dirección:</strong> {optic.address}</p>
                <p><strong>Teléfono:</strong> {optic.tel}</p>
                <p><strong>Email:</strong> {optic.email}</p>
              </div>

              {/* Logo */}
              {optic.logo && (
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <img
                    src={`${BASE_URL}${optic.logo}`}
                    alt="logo"
                    className={styles.logo}
                  />
                </div>
              )}
            </div>

            {/* CERTIFICADOS */}
            <div>
              <h3 className={styles.certTitle}>Certificados</h3>

              {/* Adecuación */}
              {optic.certCadecuacion && (
                <div style={{ marginBottom: "12px" }}>
                  <p className={styles.textBlock}><strong>Certificado de Adecuación</strong></p>
                  <a
                    href={`${BASE_URL}${optic.certCadecuacion}`}
                    target="_blank"
                    className={styles.pdfLink}
                  >
                    Ver PDF
                  </a>
                </div>
              )}

              {/* Dispensación */}
              {optic.certDispensacion && (
                <div style={{ marginBottom: "12px" }}>
                  <p className={styles.textBlock}><strong>Certificado de Dispensación</strong></p>
                  <a
                    href={`${BASE_URL}${optic.certDispensacion}`}
                    target="_blank"
                    className={styles.pdfLink}
                  >
                    Ver PDF
                  </a>
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
