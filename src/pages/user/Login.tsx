import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { loginUser, getAllOpticals } from "../../services/api";
import { useAuth } from "../../components/AuthContext";
import styles from "./login.module.css";

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
    console.log("Datos enviados:", formData);

    try {
      const res = await loginUser(formData);
      console.log("Login exitoso:", res);
      const role = res.user.role_id;

      if (res.token) {
        login(res.token, role);
        alert("Inicio de sesión correcto ✅");

        if (role === 1) {
          navigate("/homeAdmin");

        } else if (role === 2) {
          try {
            const opticals = await getAllOpticals();

            console.log("🔍 Lista de ópticas:", opticals);
            console.log("👤 ID del usuario logueado:", res.user.id);

            // Buscar óptica asociada al usuario
            const myOptical = opticals.find((o: any) => o.user === res.user.id);

            if (myOptical) {
              console.log("✅ Óptica encontrada:", myOptical);
              navigate(`/viewO/${myOptical.id_optical}`);
            } else {
              alert("No se encontró una óptica asociada a este usuario ❌");
              navigate("/"); // Redirige a inicio si no tiene óptica
            }

          } catch (error) {
            console.error("Error al buscar óptica:", error);
            alert("Ocurrió un error al buscar la óptica asociada ❌");
          }

        } else if (role === 3) {
          navigate("/listOptical");

        } else {
          navigate("/");
        }

      } else {
        alert("No se recibió token del servidor ❌");
      }

    } catch (err: any) {
      console.error("Error en login:", err);
      if (err instanceof Error) {
        alert(`Error: ${err.message}`);
      } else {
        alert("Error al iniciar sesión ❌");
      }
    }
  };

  return (
    <div id={styles.form_login} className={styles.forms_login}>
      <div className={styles.img_register}>
        <img src="/sunglasses.png" alt="Logo SIVE" />
        <h5>SIVE</h5>
      </div>
      <h1 className={styles.loginh1}>Inicia sesión</h1>

      <form onSubmit={handleSubmit} className="form_login">
        <label className={styles.label_input} htmlFor="email">
          Ingresa tu correo
        </label>
        <br />
        <input
          type="email"
          className={styles.input_login}
          name="email"
          id="email_input"
          placeholder="Ingresa tu correo"
          value={formData.email}
          onChange={handleChange}
        />
        <br />

        <label className={styles.label_input} htmlFor="password">
          Contraseña
        </label>
        <br />
        <input
          type="password"
          name="password"
          className={styles.input_login}
          id={styles.password_input}
          placeholder="Contraseña"
          value={formData.password}
          onChange={handleChange}
        />
        <br />

        <div className={styles.container_submit}>
          <button type="submit">Iniciar Sesión</button>
        </div>
      </form>

      <p className={styles.foot}>¿No tienes una cuenta?</p>
      <Link to="/register" className={styles.register_link}>
        Regístrate
      </Link>
    </div>
  );
}
