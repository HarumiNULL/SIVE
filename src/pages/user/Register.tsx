import { useState } from "react";
import { Link, useNavigate }  from "react-router-dom";
import React,  { registerUser } from '../../services/api'
import styles from "./register.module.css"
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

export default function Register() {

    const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const navigate= useNavigate();


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    //console.log("Formulario enviado:", formData);

    if (formData.password !== formData.confirm_password) {
      Swal.fire({
        icon: "error",
        title: "Las contraseñas no coinciden ❌",
        text: "No se a podido registrar el Usuario",
        confirmButtonColor: "#2563eb",
      });
      return;
    }

    try {
      const res = await registerUser(formData);
      //console.log("Usuario registrado:", res.user);
      localStorage.setItem("token", res.token);
      Swal.fire({
        icon: "success",
        title: "Registro Correcto ✅",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err: any) {
      console.error("Error al registrar:", err.response?.data || err.message);
      Swal.fire({
        icon: "error",
        title: "Error al Registrar 🚫",
        text: "No se a podido registrar el Usuario",
        confirmButtonColor: "#d33",
      });
    }
    navigate("/login");
  };

    return(
        <div id={styles.form_register} className={styles.forms} >
            <div className={styles.img_register}>
                <img src="src\assets\sunglasses.png" alt="" />
                <h5>SIVE</h5>
            </div>
            <h1 className={styles.registerh1}>Registrate</h1>
            <p>Empieza con nuestra web, solo crea tu cuenta y disfruta la experiencia </p>
            <form onSubmit={handleSubmit} className={styles.form_register}>
                <div className={styles.name}>
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
                <div className={styles.container_submit}><button type="submit">Registrar</button></div>
            </form>
            <p className={styles.foot}>¿Ya tienes una cuenta?</p> <Link to ="/login" className={styles.login_link}>Inicia sesion</Link>
        </div>
    )
}
