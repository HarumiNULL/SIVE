import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllOpticals } from "../../services/api"; // o import { findOpticalForUser } if añadiste helper
import Navbar from "../../components/Navbar";

export default function RedirectToMyOptical() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const go = async () => {
      try {
        const userString = localStorage.getItem("user");
        const token = localStorage.getItem("token");
        if (!token || !userString) {
          setError("No autenticado");
          setLoading(false);
          return;
        }

        const user = JSON.parse(userString);
        const userId = user.id;

        // Opción A: usar helper (si lo agregaste)
        // const optical = await findOpticalForUser(userId);

        // Opción B: usar getAllOpticals directamente y filtrar
        const allOpticals = await getAllOpticals();
        if (!Array.isArray(allOpticals)) {
          setError("Respuesta inesperada del servidor");
          setLoading(false);
          return;
        }

        const optical = allOpticals.find((o: any) => Number(o.user) === Number(userId));

        if (optical && optical.id_optical) {
          navigate(`/viewO/${optical.id_optical}`);
        } else {
          // No tiene óptica: decide a dónde enviar (ej. formulario de creación)
          // Puedes redirigir a crear óptica, o mostrar mensaje
          // navigate("/create-optical");
          setError("No se encontró una óptica asociada a tu usuario.");
        }
      } catch (err: any) {
        console.error("Error al buscar óptica del usuario:", err);
        setError("Error buscando la óptica. Revisa la consola.");
      } finally {
        setLoading(false);
      }
    };

    go();
  }, [navigate]);

  if (loading) return <p>Cargando...</p>;
  if (error) return (
    <>
    <Navbar/>
    <div>
      <p>{error}</p>
      {/* opcional: un botón para intentar de nuevo */}
      
    </div>
    </>
  );

  return null;
  
}
