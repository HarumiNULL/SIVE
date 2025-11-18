import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { confirmResetPassword } from "../../services/resetPassword";
import styles from "./confirmResetPassword.module.css";

export default function ConfirmResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();

  // Obtener token del query string (?token=...)
  const token = new URLSearchParams(location.search).get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    try {
      const res = await confirmResetPassword(token || "", password);
      //console.log("Contraseña cambiada correctamente:", res);
      alert("Tu contraseña ha sido restablecida correctamente");
      navigate("/login");
    } catch (error: any) {
      //console.error("Error al confirmar el reseteo:", error.response?.data || error.message);
      alert("El enlace no es válido o ha expirado");
    }
  };

  return (
    <div className={styles.confirmPasswordDiv} style={{ padding: 20 }}>
      <h1 className={styles.titulo}>Restablecer contraseña</h1>
      <p>Elige una nueva contraseña para proteger tu cuenta</p>
      <form onSubmit={handleSubmit}>
        <input  className={styles.inputEmail}
          type="password"
          placeholder="Nueva contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input  className={styles.inputEmail}
          type="password"
          placeholder="Confirmar contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Cambiar contraseña</button>
      </form>
    </div>
  );
}
