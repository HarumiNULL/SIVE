import { Link }  from "react-router-dom";
import './login.css'
export default function Login() {
    return(
       <div id="form_login" className="forms_login">
            <div className="img_register ">
                <img src="src\assets\sunglasses.png" alt="" />
                <h5>SIVE</h5>
            </div>
            <h1 className="loginh1">Inicia sesion</h1>
            <p className="description">Empieza con nuestra web, solo crea tu cuenta y disfruta la experiencia </p>
            <form action="post" className="form_login">
                <label htmlFor="email">Ingresa tu correo</label><br />
                <input type="email" name="email" id="email_input" placeholder=" Ingresa tu correo" /><br />
                <label htmlFor="password">Contraseña</label><br />
                <input type="password" name="password" id="password_input" placeholder="Contraseña"/><br />
                <div className="container_submit"><input type="submit" value="Inicia sesion" /></div>
            </form>
            <p className="foot">¿No tienes una cuenta?</p><Link to='/register' className="register_link"> Registrate</Link>
       </div>
    )
}
