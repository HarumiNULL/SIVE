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
                    <Link to="/listTest" className="btn ver">Tests</Link>
                    <Link to="/listOptical" className="btn ver">Opticas</Link>
                    <Link to="/listProb" className="btn ver">"Diagnosticos"</Link>
                    <Link to="/viewO"className="btn ver">ver mi optica</Link>
                    {isAuthenticated ? 
                    (<Link to="/login" onClick={handleLogout}className="btn cerrar">cerrar sesion</Link>
                    ):(
                    <Link to="/login" className="btn cerrar">iniciar sesion</Link>
                    )}
                    
                </div>
            </header>
            </nav>
        </>
    )

}
