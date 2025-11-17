import { resetPassword } from '../../services/resetPassword';
import styles from "./resetPassword.module.css";
import { useState } from 'react';

export default function ResetPassword() {
    const [email, setEmail] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Formulario enviado:", email);

        try {
            const res = await resetPassword(email);
            console.log("Correo de recuperación enviado:", res);
            alert("✅ Se ha enviado un enlace de recuperación a tu correo.");
        } catch (err: any) {
            console.error("Error al enviar correo de recuperación:", err.response?.data || err.message);
            alert("❌ Error al enviar el correo. Verifica el email o intenta de nuevo.");
        }
    };

    return (
        <div className={styles.divResetPassword} style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "2rem" }}>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "60%" }}>
                <h1 className={styles.titulo}>¿Olvidaste tu contraseña?</h1>
                <p>A continuacion digita el correo asociado a tu cuenta, se enviara un enlace para que puedas cambiar tu contraseña </p>
                <input className={styles.inputEmail}
                    type="email"
                    placeholder="Ingresa el correo para recuperar tu contraseña"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} // 🔹 Aquí conectamos el input con el estado
                    required
                />
                <button type="submit">Enviar correo</button>
            </form>
        </div>
    );
}
