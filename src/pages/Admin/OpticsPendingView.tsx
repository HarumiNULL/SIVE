import { useEffect, useState } from "react";
import { getPendingOptics, approveOptic, rejectOptic } from "../../services/acceptOwner";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import ModalOptical from "../../components/ModalOptical";
import Navbar from "../../components/Navbar";
import styles from "../../pages/Admin/opticsPendingView.module.css";

interface PendingOptic {
    id_optical: number;
    name: string;
    user_id: number;
    user_email: string;
    peding: boolean;
    
}

export default function OpticsPendingView() {
    const [open, setOpen] = useState(false);
    const [optics, setOptics] = useState<PendingOptic[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedId, setSelectedId] = useState<number | null>(null);


    useEffect(() => {
        loadPendingOptics();
    }, []);

    const loadPendingOptics = async () => {
        try {
            setLoading(true);
            const data = await getPendingOptics();
            setOptics(data);
        } catch (error: any) {
            console.error(error);
            Swal.fire("Error", error.message, "error");
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id_optical: number) => {
        const confirm = await Swal.fire({
            title: "¿Aprobar dueño?",
            text: "El usuario será marcado como dueño verificado.",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Sí, aprobar",
        });

        if (!confirm.isConfirmed) return;

        try {
            await approveOptic(id_optical);
            Swal.fire("Aprobado", "El dueño ha sido aprobado.", "success");
            loadPendingOptics();
        } catch (error: any) {
            Swal.fire("Error", error.message, "error");
        }
    };

    const handleReject = async (id_optical: number) => {
        const confirm = await Swal.fire({
            title: "¿Rechazar óptica?",
            text: "La óptica será eliminada y el usuario no será verificado.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, rechazar",
        });

        if (!confirm.isConfirmed) return;

        try {
            await rejectOptic(id_optical);
            Swal.fire("Rechazada", "La óptica ha sido eliminada.", "success");
            loadPendingOptics();
        } catch (error: any) {
            Swal.fire("Error", error.message, "error");
        }
    };

    if (loading) return <p className="text-center mt-10">Cargando...</p>;

    return (
        <>
            <Navbar />
            <h2 className={styles.titleAbsolute}>Gestion de Opticas</h2>
            <h4 className={styles.description}>En este panel podras aceptar o denegar las opticas que se registren en la plataforma</h4>

            {/* MODAL — SIEMPRE FUERA DE LA TABLA */}
            {selectedId !== null && (
                <ModalOptical
                    open={open}
                    onClose={() => setOpen(false)}
                    id={selectedId}
                />
            )}

            <div className={styles.container}>
                <h1 className={styles.title}>Ópticas pendientes de aprobación</h1>

                {optics.length === 0 ? (
                    <p>No hay ópticas pendientes.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className={styles.table}>
                            <thead className="bg-gray-100">
                                <tr className={styles.tableHeader}>
                                    <th className="px-4 py-2 text-left font-semibold">Nombre</th>
                                    <th className="px-4 py-2 text-left font-semibold">Correo dueño</th>
                                    <th className="px-4 py-2 text-center font-semibold">Acciones</th>
                                </tr>
                            </thead>

                            <tbody>
                                {optics.map((opt) => (
                                    <tr key={opt.id_optical} className="border-t hover:bg-gray-50">

                                        <td className="px-4 py-2">{opt.name}</td>
                                        <td className="px-4 py-2">{opt.user_email}</td>

                                        <td className="px-4 py-2 flex flex-wrap gap-2 justify-center">

                                            {/* Ver */}
                                            <button
                                                onClick={() => {
                                                    setSelectedId(opt.id_optical);
                                                    setOpen(true);
                                                }}
                                                className={styles.buttonVer}
                                            >
                                                Ver
                                            </button>

                                            {/* Aprobar */}
                                            <button
                                                onClick={() => handleApprove(opt.id_optical)}
                                                className={styles.buttonAprobar}
                                            >
                                                Aprobar
                                            </button>

                                            {/* Rechazar */}
                                            <button
                                                onClick={() => handleReject(opt.id_optical)}
                                                className={styles.buttonRechazar}
                                            >
                                                Rechazar
                                            </button>
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
}