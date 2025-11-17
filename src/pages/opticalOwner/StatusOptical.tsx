import Navbar from "../../components/Navbar";
import "./statusOptical.css";
import { useNavigate } from "react-router-dom";

export default function StatusOpticaView({ is_verified_owner, optic }: Props) {
  const navigate = useNavigate();

  const isApproved =
    is_verified_owner === true && optic?.is_verified === true;

  const isPending =
    is_verified_owner === false && optic?.is_verified === false;

  const isRejected =
    is_verified_owner === false && optic === null;

  return (
    <>
      {/* NAVBAR ARRIBA */}
      <Navbar />

      {/* CONTENIDO */}
      <div className="status-wrapper">
        
        {isApproved && (
          <div className="status-card approved">
            <div className="icon">✔️</div>
            <h2>Tu óptica ha sido aprobada</h2>
            <p>
              Felicidades 🎉 La óptica <b>{optic?.name}</b> ya está verificada.
            </p>
            <button onClick={() => navigate("/panel-optica")} className="main-btn">
              Ir a mi panel
            </button>
          </div>
        )}

        {isPending && (
          <div className="status-card pending">
            <div className="icon">⏳</div>
            <h2>Tu solicitud está en revisión</h2>
            <p>
              Un administrador revisará tu información pronto.
            </p>
          </div>
        )}

        {isRejected && (
          <div className="status-card rejected">
            <div className="icon">❌</div>
            <h2>Tu solicitud fue rechazada</h2>
            <p>
              Puedes escribir a <b>sivebot.2025@gmail.com</b> si necesitas más información.
            </p>

            <button
              className="retry-btn"
              onClick={() => navigate("/regisO", { state: { fromRejected: true } })}
            >
              Registrar óptica nuevamente
            </button>
          </div>
        )}

      </div>
    </>
  );
}
