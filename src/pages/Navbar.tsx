import { Link }  from "react-router-dom";
import "./navbar.css"


export default function Navbar() {
    return(
        <nav className="navbar">
            <div className="nav-links" >
                <Link to="/" >Inicio</Link>
                {/*<Link to ="/login">Inicia sesion</Link>*/}
                <Link to ="/viewO">ver mi optica</Link>
                {/*<Link to = "/register">Registrate</Link>}*/}
            </div>
        </nav>

    )
  
}
