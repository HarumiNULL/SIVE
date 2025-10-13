import { Link } from "react-router-dom";
import "./viewOptical.css";

export default function View_optical() {

    return (
        <div className="home-container">
            {/* Encabezado */}
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
                    <Link to="/" className="btn ver">inicio</Link>
                    <Link to="/editO" className="btn ver">
                        Editar optica
                    </Link>
                    <Link to="/login" className="btn cerrar">
                        Cerrar Sesión
                    </Link>
                </div>
            </header>

            {/* Contenido principal */}
            <div>
                <img src="src\assets\banner-eye.jpg" className="banner" alt="" />
                <h1  className="text-banner">Optica eye care</h1>
            </div>

            
            <div className="grid-container">
                <div className="grid-item1">
                    <h1 className="optic-title">Lorem ipsum dolor sit amet</h1>
                    <p className="optic-description">
                        consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                        quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit
                        in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa
                        qui officia deserunt mollit anim id est laborum.
                    </p>
                    <h3 className="subtitle">servicios</h3>
                    <ul className="services-list">
                        <li>Examen de la vista</li>
                        <li>Venta de lentes</li>
                        <li>Venta de armazones</li>
                    </ul>
                </div>
                <div className="grid-item2">
                    <img src="src\assets\Captura de pantalla 2025-10-05 230702.png" className="map" alt="" />
                </div>
                <div className="grid-item3">
                    <div className="button-div">
                        <button className="edit_optic">Editar optica</button>
                        <button className="delete">Eliminar</button>
                    </div>

                </div>
                <div className="grid-item4">
                    <h2 className="h2-title">Comentarios</h2>
                    <div className="comments">
                        <p className="comments-p">No hay comentarios aun.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}