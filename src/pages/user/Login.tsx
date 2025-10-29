import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { useAuth } from "../../components/AuthContext";
import { loginUser, getAllOpticals } from "../../services/api";
import styles from "./login.module.css";


export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const { login } = useAuth();

  // Manejo de cambios en inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Datos enviados:", formData.email);
    try {
      const res = await loginUser(formData);
      console.log("Login exitoso:", res);
      const role = res.user.role_id;
      let opticalId: number | null = null;
      // ✅ Verificamos que el backend haya devuelto el usuario
      if (res.user || !res.token) {
        if (role === 2) {
        // Buscar óptica asociada al dueño
        try {
          const opticals = await getAllOpticals();
          const myOptical = opticals.find((o: any) => o.user === res.user.id);

          if (myOptical) {
            opticalId = myOptical.id_optical;
          } else {
            alert("No se encontró una óptica asociada a este usuario ❌");
          }

        } catch (error) {
          console.error("Error al buscar óptica:", error);
          alert("Ocurrió un error al buscar la óptica asociada ❌");
        }
        }

        login(res.token, role, opticalId);

        Swal.fire({
          icon: "success",
          title: "Inicio de sesión correcto ✅",
          timer: 2000,
          showConfirmButton: false,
        });

        // ✅ Redirección según el rol
        if (role === 1) {
          navigate("/homeAdmin");
        } else if (role === 2) {
          if (opticalId) {
            navigate(`/viewO/${opticalId}`);
          } else {
            navigate("/registerO"); // si no tiene óptica
          }
        } else if (role === 3) {
          navigate("/");
        } else {
          navigate("/");
        }
      } else {
        // Si no hay usuario, mostramos el mensaje de error que venga del backend
        const backendError =
          (res as any)?.error ||
          "Ocurrió un error inesperado durante el inicio de sesión.";

        Swal.fire({
          icon: "error",
          title: "Error",
          text: backendError,
          confirmButtonColor: "#3085d6",
        });
      }
    } catch (err: unknown) {
      console.error("Error en login:", err);
      if (err instanceof Error) {
        const message = err.message.toLowerCase();

        if (message.includes("bloqueado")) {
          Swal.fire({
            icon: "error",
            title: "Acceso bloqueado 🚫",
            text: "Has sido bloqueado por acciones sospechosas. Comunícate con el equipo de desarrollo.",
            confirmButtonColor: "#d33",
          });
        } else if (message.includes("eliminada")) {
          Swal.fire({
            icon: "warning",
            title: "Cuenta eliminada ⚠️",
            text: "Tu cuenta ha sido eliminada. Si crees que es un error, comunícate con soporte.",
            confirmButtonColor: "#f59e0b",
          });
        } else if (message.includes("invalid credentials")) {
          Swal.fire({
            icon: "error",
            title: "Credenciales incorrectas ❌",
            text: "Correo o contraseña inválidos.",
            confirmButtonColor: "#2563eb",
          });
        } else {
          Swal.fire({
            icon: "info",
            title: "Error inesperado ❗",
            text: err.message || "Ocurrió un error al iniciar sesión.",
            confirmButtonColor: "#3085d6",
          });
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Error de sistema ⚙️",
          text: "Ocurrió un error desconocido.",
        });
      }
    }
  }

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
