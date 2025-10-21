import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../services/api";
import { useAuth } from "./AuthContext";
import styles from "./navbar.module.css"

export default function Navbar() {
    const {isAuthenticated, logout}=useAuth()

    const navigate = useNavigate();

    const handleLogout = async () => {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        try {
            await logoutUser(token);
            await logout();
            /*Storage.removeItem("token");*/
            navigate("/login"); 
        } catch (error) {
            console.error("Error cerrando sesión:", error);
        }
    };
    return (
        <>
        <nav>
            <header className={styles.home_header}>
                <div className={styles.home_logo}>
                    <img
                        src="/src/assets/sunglasses.png"
                        alt="Logo"
                        className={styles.logo_img}
                    />
                    <span>S I V E</span>
                </div>

                <div className={styles.home_buttons}>
                    <Link to="/" className={styles.btn_ver}>Inicio</Link>
                    <Link to="/listTest" className={styles.btn_ver}>Tests</Link>
                    <Link to="/listOptical" className={styles.btn_ver}>Opticas</Link>
                    <Link to="/listProb" className={styles.btn_ver}>"Diagnosticos"</Link>
                    <Link to="/viewO"className={styles.btn_ver}>ver mi optica</Link>
                    {isAuthenticated ? 
                    (<Link to="/login" onClick={handleLogout}className={styles.btn_cerrar}>cerrar sesion</Link>
                    ):(
                    <Link to="/login" className={styles.btn_cerrar}>iniciar sesion</Link>
                    )}
                    
                </div>
            </header>
            </nav>
        </>
    )

}
