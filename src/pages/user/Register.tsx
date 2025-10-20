import { useState } from "react";
import { Link }  from "react-router-dom";
import './register.css'
import { registerUser } from '../../services/api'

export default function Register() {

    const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
  });


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Formulario enviado:", formData);

    if (formData.password !== formData.confirm_password) {
      alert("Las contraseñas no coinciden");
      return;
    }

    try {
      const res = await registerUser(formData);
      console.log("Usuario registrado:", res.user);
      localStorage.setItem("token", res.token);
      alert("Registro exitoso ✅");
    } catch (err: any) {
      console.error("Error al registrar:", err.response?.data || err.message);
      alert("Error al registrar ❌");
    }
  };

    return(
        <div id="form_register" className="forms" >
            <div className="img_register ">
                <img src="src\assets\sunglasses.png" alt="" />
                <h5>SIVE</h5>
            </div>
            <h1 className="registerh1">Registrate</h1>
            <p>Empieza con nuestra web, solo crea tu cuenta y disfruta la experiencia </p>
            <form onSubmit={handleSubmit} className="form_register">
                <div className="name">
                    <label htmlFor="text">Ingresa tu nombre</label><br />
                    <input type="text" placeholder="Primer nombre" name="first_name" onChange={handleChange}/>
                    <label htmlFor="text">Ingresa tu apellido</label><br />
                    <input type="text" placeholder="Apellido" name="last_name" onChange={handleChange}/><br />
                </div>
                <label htmlFor="email">Ingresa tu correo</label><br />
                <input type="email" name="email" id="email_input" placeholder=" Ingresa tu correo" onChange={handleChange}/><br />
                <label htmlFor="password">Contraseña</label><br />
                <input type="password" name="password" id="password_input" placeholder="Contraseña" onChange={handleChange}/><br />
                <label htmlFor="confirm_password">Confirma tu contraseña</label><br />
                <input type="password" name="confirm_password" id="confirm_password_input" placeholder="Confirma tu contraseña" onChange={handleChange} />
                <br />
                <div className="container_submit"><button type="submit">Registrar</button></div>
            </form>
            <p className="foot">¿Ya tienes una cuenta?</p> <Link to ="/login" className="login_link">Inicia sesion</Link>
        </div> 
    ) 
}
