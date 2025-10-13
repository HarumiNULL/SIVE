import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../services/api";
import { useAuth } from "./AuthContext";
import "./navbar.css"


export default function Navbar() {
    const {isAuthenticated, logout}=useAuth()

    const navigate = useNavigate();

    const handleLogout = async () => {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        try {
            await logoutUser(token);
            localStorage.removeItem("token"); // 🧹 Limpia el token local
            navigate("/login"); // 🔁 Redirige al login
        } catch (error) {
            console.error("Error cerrando sesión:", error);
        }
    };
    return (
        <>
        <nav>
            <header className="home-header">
                <div className="home-logo">
                    <img
                        src="/src/assets/sunglasses.png"
                        alt="Logo"
                        className="logo-img"
                    />
                    <span>S I V E</span>
                </div>

                <div className="home-buttons">
                    <Link to="/" className="btn ver">Inicio</Link>
                    <Link to="/viewO"className="btn ver">ver mi optica</Link>
                    {isAuthenticated ? (<Link onClick={handleLogout}className="btn cerrar">cerrar sesion</Link>):
                    (<Link to="/login" className="btn cerrar">iniciar sesion</Link>)}
                    
                </div>
            </header>
            </nav>
        </>
    )

}
