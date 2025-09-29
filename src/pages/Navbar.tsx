import { Link }  from "react-router-dom";

export default function Navbar() {
    return(
        <nav>
            <div>
                <Link to="/" >Inicio</Link>
                <Link to ="/login">Inicia sesion</Link>
                <Link to = "/register">Registrate</Link>
            </div>
        </nav>

    )
  
}
