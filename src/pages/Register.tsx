import { Link }  from "react-router-dom";
import './register.css'
export default function Register() {
    return(
        <div id="form_register" className="forms" >
            <div className="img_register ">
                <img src="src\assets\sunglasses.png" alt="" />
                <h5>SIVE</h5>
            </div>
            <h1 className="registerh1">Registrate</h1>
            <p>Empieza con nuestra web, solo crea tu cuenta y disfruta la experiencia </p>
            <form action="post" className="form_register">
                <div className="name">
                    <input type="text" placeholder="Primer nombre" name="first_name" className="first_name"/>
                    <input type="text" placeholder="Apellido" name="last_name" className="last_name"/><br />
                </div>
                <label htmlFor="email">Ingresa tu correo</label><br />
                <input type="email" name="email" id="email_input" placeholder=" Ingresa tu correo" /><br />
                <label htmlFor="password">Contraseña</label><br />
                <input type="password" name="password" id="password_input" placeholder="Contraseña"/><br />
                <label htmlFor="confirm_password">Confirma tu contraseña</label><br />
                <input type="password" name="confirm_password" id="confirm_password_input" placeholder="Confirma tu contraseña" />
                <br />
                <div className="container_submit"><input type="submit" value="Registrar" /></div>
            </form>
            <p className="foot">¿Ya tienes una cuenta?</p> <Link to ="/login" className="login_link">Inicia sesion</Link>
        </div> 
    ) 
}
