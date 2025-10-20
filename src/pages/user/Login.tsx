import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { loginUser } from "../../services/api"; 
import { useAuth } from "../../components/AuthContext";
import "./login.css";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const { login } = useAuth(); // <- Usamos el contexto

  // Manejo de cambios en inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Manejo del submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await loginUser(formData);
      console.log("Login exitoso:", res);

      if (res.token) {
        login(res.token); // <- Actualiza el contexto y guarda el token
        alert("Inicio de sesión correcto ✅");
        navigate("/"); // Redirige a inicio
      } else {
        alert("No se recibió token del servidor ❌");
      }
    } catch (err: any) {
      console.error("Error en login:", err);
      alert("Error al iniciar sesión ❌");
    }
  };

  return (
    <div id="form_login" className="forms_login">
      <div className="img_register">
        <img src="src/assets/sunglasses.png" alt="Logo SIVE" />
        <h5>SIVE</h5>
      </div>
      <h1 className="loginh1">Inicia sesión</h1>

      <form onSubmit={handleSubmit} className="form_login">
        <label htmlFor="email">Ingresa tu correo</label><br />
        <input
          type="email"
          name="email"
          id="email_input"
          placeholder="Ingresa tu correo"
          value={formData.email}
          onChange={handleChange}
        /><br />

        <label htmlFor="password">Contraseña</label><br />
        <input
          type="password"
          name="password"
          id="password_input"
          placeholder="Contraseña"
          value={formData.password}
          onChange={handleChange}
        /><br />

        <div className="container_submit">
          <button type="submit">Iniciar Sesión</button>
        </div>
      </form>

      <p className="foot">¿No tienes una cuenta?</p>
      <Link to="/register" className="register_link">Regístrate</Link>
    </div>
  );
}
