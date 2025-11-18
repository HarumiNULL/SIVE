import { Link, useLocation } from "react-router-dom";
import { logoutUser } from "../services/api";
import { useAuth } from "./AuthContext";
import styles from "./navbar.module.css";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { isAuthenticated, logout, role, opticalId } = useAuth();
  const navigate = useNavigate();
  console.log("el id de optica",opticalId)
  console.log(isAuthenticated)
  console.log(role)
  const location = useLocation();

  const ROL_ADMIN = 1;
  const ROL_DUEÑO = 2;
  const ROL_USUARIO = 3;
  const isHome = location.pathname === "/";


  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/");
    } catch (error) {
      console.error("Error cerrando sesión en el servidor:", error);
    } finally {
      logout();
    }
  };

  const renderNavLinks = () => {

    let roleLinks = null;
  switch (role) {
    case ROL_ADMIN:
      roleLinks = (
        <>
          <Link to="/homeAdmin" className={styles.btn_ver}>Inicio</Link>
          {/* <Link to="/listOptical" className={styles.btn_ver}>Gestión Ópticas</Link> */}
          <Link to="/GestionUser" className={styles.btn_ver}>Gestión Usuarios</Link>
          <Link to="/pendingOptics" className={styles.btn_ver}>Gestion Opticas</Link>
        </>
      );
      break;




      case ROL_DUEÑO:
        roleLinks = (
          <>
            <Link
              to={opticalId ? `/viewO/${opticalId}` : "/registerO"} className={styles.btn_ver}>
              Inicio
            </Link>

            <Link to="/graphics" className={styles.btn_ver}>Mis Estadisticas</Link>
          </>
        );
        break;

      case ROL_USUARIO:
        roleLinks = (
          <>
            <Link to="/" className={styles.btn_ver}>Inicio</Link>
            <Link to="/listTest" className={styles.btn_ver}>Test Visuales</Link>
            <Link to="/listProb" className={styles.btn_ver}>Recomendaciones</Link>
            <Link to="/listOptical" className={styles.btn_ver}>Ópticas</Link>
            <Link to="/registerO" className={styles.btn_ver}>Trabaja con Nosotros</Link>
          </>
        );
        break;
      default:
        roleLinks = null;
    }

    return (
      <>
        {roleLinks}
        <button onClick={handleLogout} className={styles.btn_cerrar}>Cerrar sesión</button>
      </>
    );
  };

  return (
    <nav>
      <header className={styles.home_header}>
        <div className={styles.home_logo}>
          <img src="/sunglasses.png" alt="Logo" className={styles.logo_img} />
          <span>S I V E</span>
        </div>

        <div className={styles.home_buttons}>
          {isAuthenticated ? (
            renderNavLinks()
          ) : (
            <>
              <Link to="/register" className={styles.btn_ver}>
                Registrarse
              </Link>
              <Link
                to="/login"
                className={isHome ? styles.btn_ver : styles.btn_cerrar}
              >
                Iniciar sesión
              </Link>
            </>
          )}
        </div>
      </header>
    </nav>
  );
}
